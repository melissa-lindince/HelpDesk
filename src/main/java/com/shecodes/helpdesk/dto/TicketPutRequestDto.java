package com.shecodes.helpdesk.dto;

import com.shecodes.helpdesk.models.Status;
import jakarta.validation.constraints.Size;

public record TicketPutRequestDto(

        @Size(max = 35, message = "O título deve ser menor que 35 caracteres.")
        String title,

        String description,

        Status status,

        Integer responsableUserId
) {
}
