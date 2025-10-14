package com.shecodes.helpdesk.exception;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//classe que pode lidar com exceptions -> mostrar mensagens de erro mais amigavel e não estourar o stackerror na tela do usuario
@RestControllerAdvice
public class GlobalExceptionHandler {

    //lida com erros da classe customizada NotFoundException
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFoundExcepetion(NotFoundException ex){
        Map<String, Object> body = new HashMap<>(); //map de chave valor para mostrar no body
        body.put("status", HttpStatus.NOT_FOUND.value());
        body.put("error", "Erro de acesso de dados");
        body.put("message", ex.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    //lida com erros dos dto de validation -> mostrar msg de erro para usuario
    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            org.springframework.web.bind.MethodArgumentNotValidException ex) {

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Erro de validação");

        // pega todas as mensagens de erro (do @NotBlank, @NotNull, etc.)
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .toList();

        body.put("message", errors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    //lida com erros de serialização de json
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Erro de leitura do JSON");

        if (ex.getCause() instanceof InvalidFormatException invalidFormatEx) {
            String fieldName = invalidFormatEx.getPath().get(0).getFieldName();
            String targetType = invalidFormatEx.getTargetType().getSimpleName();
            body.put("message", String.format(
                    "Valor inválido para o campo '%s'. Deve ser do tipo %s. Valores aceitos: %s",
                    fieldName,
                    targetType,
                    Arrays.toString(invalidFormatEx.getTargetType().getEnumConstants()) // lista de enums
            ));
        } else {
            body.put("message", ex.getMessage());
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }
}
