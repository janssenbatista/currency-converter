package dev.janssenbatista.currencyconverter.controllers.exceptions;

public class ApiException extends RuntimeException {

    public ApiException(String message) {
        super(message);
    }

}
