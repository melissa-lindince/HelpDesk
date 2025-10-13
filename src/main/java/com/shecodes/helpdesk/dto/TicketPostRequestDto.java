package com.shecodes.helpdesk.dto;

import com.shecodes.helpdesk.models.Category;
import com.shecodes.helpdesk.models.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TicketPostRequestDto(
        @NotBlank(message = "O título não pode estar vazio.")
        @Size(max = 35, message = "O título deve ser menor que 35 caracteres.")
        String title,
        @NotBlank(message = "A descrição não pode estar vazia.")
        String description,
        @NotNull(message = "A categoria não pode estar vazio.")
        Category category,
        @NotNull(message = "A prioridade não pode estar vazio.")
        Priority priority,
        @NotNull(message = "Deve estar associado a um autor.")
        Integer authorId,
        @NotNull(message = "Deve estar associado a um responsável.")
        Integer responsableUserId
) {
}
