package dev.janssenbatista.currencyconverter.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.janssenbatista.currencyconverter.controllers.exceptions.BadRequestException;
import dev.janssenbatista.currencyconverter.models.ConverterResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
public class ApiService {

    @Value("${api.key}")
    private String apiKey;

    private final ObjectMapper mapper;

    public ApiService(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    public Double convertCurrency(String from, String to) {
        final String BASE_URL = "https://v6.exchangerate-api.com";
        try (HttpClient httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofMillis(3_000))
                .build()) {
            final URI uri = URI
                    .create(String.format("%s/v6/%s/pair/%s/%s", BASE_URL, apiKey, from.toUpperCase(), to.toUpperCase()));
            final HttpRequest request = HttpRequest.newBuilder(uri).GET().build();
            final HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                final ConverterResponse converterResponse = mapper.readValue(response.body(), ConverterResponse.class);
                System.out.println("HTTP_CLIENT: " + converterResponse);
                return converterResponse.conversionRate();
            } else {
                throw new BadRequestException(response.body());
            }
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
