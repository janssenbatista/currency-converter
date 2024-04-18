package dev.janssenbatista.currencyconverter.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties
public record ConverterResponse(
        @JsonProperty("conversion_rate") double conversionRate
) {
}
