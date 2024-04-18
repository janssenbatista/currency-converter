package dev.janssenbatista.currencyconverter.controllers.exceptions.handlers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
class ValidationExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ExceptionDetails> handleException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String messageError = error.getDefaultMessage();
            errors.put(fieldName, messageError);
        });
        return new ResponseEntity<>(
                new ExceptionDetails("Bad Request", LocalDateTime.now(), errors),
                HttpStatus.BAD_REQUEST
        );
    }

    record ExceptionDetails(
            String title,
            LocalDateTime timestamp,
            Map<String, String> details
    ) {
    }


}
