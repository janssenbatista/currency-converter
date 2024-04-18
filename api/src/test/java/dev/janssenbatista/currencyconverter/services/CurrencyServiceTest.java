package dev.janssenbatista.currencyconverter.services;

import dev.janssenbatista.currencyconverter.controllers.exceptions.BadRequestException;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class CurrencyServiceTest {

    ApiService apiService = mock(ApiService.class);
    CurrencyService currencyService = new CurrencyService(apiService);

    @Test
    void shouldThrowBadRequestException_WhenFromAndToAreEqual() {
        assertThatThrownBy(() -> {
            currencyService.convertCurrency("USD", "USD");
        }).isInstanceOf(BadRequestException.class).hasMessageContaining("As moedas devem possuir valores diferentes");
        verify(apiService, times(0)).convertCurrency(anyString(), anyString());
    }

    @Test
    void shouldConvertACurrencySuccessfully() {
        final String from = "USD";
        final String to = "BRL";
        final Double expectValue = 5.12;
        when(apiService.convertCurrency(from, to)).thenReturn(expectValue);
        assertThat(currencyService.convertCurrency(from, to)).isEqualTo(expectValue);
        verify(apiService, times(1)).convertCurrency(from, to);
    }

}