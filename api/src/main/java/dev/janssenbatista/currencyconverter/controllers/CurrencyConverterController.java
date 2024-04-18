package dev.janssenbatista.currencyconverter.controllers;

import dev.janssenbatista.currencyconverter.controllers.dtos.RequestDto;
import dev.janssenbatista.currencyconverter.controllers.dtos.ResponseDto;
import dev.janssenbatista.currencyconverter.models.Currency;
import dev.janssenbatista.currencyconverter.services.CurrencyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping()
public class CurrencyConverterController {

    private final CurrencyService currencyService;

    public CurrencyConverterController(CurrencyService currencyService) {
        this.currencyService = currencyService;
    }

    @GetMapping("currencies")
    ResponseEntity<List<Currency>> getAllAvailableCurrencies() {
        return ResponseEntity.ok(currencyService.getAvailableCurrencies());
    }

    @PostMapping("convert")
    ResponseEntity<ResponseDto> convertCurrency(@RequestBody @Valid RequestDto dto) {
        Double response = currencyService.convertCurrency(dto.from(), dto.to());
        return ResponseEntity.ok(new ResponseDto(response));
    }


}
