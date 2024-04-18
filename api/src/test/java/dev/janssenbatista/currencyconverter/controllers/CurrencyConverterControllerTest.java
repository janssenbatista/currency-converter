package dev.janssenbatista.currencyconverter.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.janssenbatista.currencyconverter.controllers.dtos.RequestDto;
import dev.janssenbatista.currencyconverter.controllers.exceptions.BadRequestException;
import dev.janssenbatista.currencyconverter.services.CurrencyService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CurrencyConverterController.class)
class CurrencyConverterControllerTest {

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CurrencyService service;

    @Test
    void shouldReturnAllCurrencies() throws Exception {
        when(service.getAvailableCurrencies()).thenReturn(List.of());
        mockMvc.perform(get("/currencies")).andExpect(status().isOk());
    }

    @Test
    void shouldReturnStatusCode400_WhenFromAndToAreEqual() throws Exception {
        final String from = "BRL";
        final String to = "BRL";
        final String badRequestMessage = "As moedas devem ter valores diferentes";
        when(service.convertCurrency(from, to)).thenThrow(new BadRequestException(badRequestMessage));
        final String requestDto = mapper.writeValueAsString(new RequestDto(from, to));
        mockMvc
                .perform(post("/convert")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestDto))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.timestamp").isNotEmpty())
                .andExpect(jsonPath("$.message").value(badRequestMessage))
                .andExpect(jsonPath("$.statusCode").value(400))
                .andDo(print());
    }

    @Test
    void shouldReturnStatusCode200_WhenConvertCurrencyCorrectly() throws Exception {
        final String from = "USD";
        final String to = "BRL";
        final Double expectedValue = 5.12;
        when(service.convertCurrency(from, to)).thenReturn(expectedValue);
        final String requestDto = mapper.writeValueAsString(new RequestDto(from, to));
        mockMvc
                .perform(post("/convert")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestDto))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.conversionRate").value(expectedValue))
                .andDo(print());
    }

}