package dev.janssenbatista.currencyconverter.controllers.exceptions.handlers;

import dev.janssenbatista.currencyconverter.controllers.exceptions.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class AppExceptionHandler {

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<?> handle(BadRequestException e) {
        Response response = new Response(LocalDateTime.now(), e.getMessage(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.badRequest().body(response);
    }

    private record Response(
            LocalDateTime timestamp,
            String message,
            Integer statusCode
    ) {
    }
}
