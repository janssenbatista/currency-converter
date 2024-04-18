package dev.janssenbatista.currencyconverter.services;

import dev.janssenbatista.currencyconverter.controllers.exceptions.BadRequestException;
import dev.janssenbatista.currencyconverter.enums.CurrencyEnum;
import dev.janssenbatista.currencyconverter.models.Currency;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class CurrencyService {

    private final ApiService apiService;

    public CurrencyService(ApiService apiService) {
        this.apiService = apiService;
    }

    public List<Currency> getAvailableCurrencies() {
        return Arrays.stream(CurrencyEnum.values()).map(CurrencyEnum::toEntity).toList();
    }

    public Double convertCurrency(String from, String to) {
        if (from.equalsIgnoreCase(to)) {
            throw new BadRequestException("As moedas devem possuir valores diferentes");
        }
        return apiService.convertCurrency(from, to);
    }
}
