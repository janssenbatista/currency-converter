package dev.janssenbatista.currencyconverter.controllers.exceptions;

public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }

}
