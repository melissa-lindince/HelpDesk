package com.shecodes.helpdesk.dto;

import com.shecodes.helpdesk.models.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TicketPutRequestDto(
        @NotBlank(message = "O título não pode estar vazio.")
        @Size(max = 35, message = "O título deve ser menor que 35 caracteres.")
        String title,
        @NotBlank(message = "A descrição não pode estar vazia.")
        String description,
        @NotNull(message = "O status não pode estar vazia.")
        Status status,
        @NotNull(message = "Deve estar associado a um responsável.")
        Integer responsableUserId
) {
}
