package dev.janssenbatista.currencyconverter.controllers.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RequestDto(
        @NotBlank
        @Size(min = 3, max = 3, message = "O símbolo da moeda deve conter apenas 3 letras")
        @Pattern(regexp = "^[A-Z]{3}$")
        String from,
        @NotBlank
        @Size(min = 3, max = 3, message = "O símbolo da moeda deve conter apenas 3 letras")
        @Pattern(regexp = "^[A-Z]{3}$")
        String to
) {
}
