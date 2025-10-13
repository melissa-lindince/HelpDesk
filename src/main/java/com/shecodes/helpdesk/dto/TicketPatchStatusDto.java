package com.shecodes.helpdesk.dto;

import com.shecodes.helpdesk.models.Status;
import jakarta.validation.constraints.NotNull;

public record TicketPatchStatusDto(
        @NotNull(message = "O status não pode estar vazio.")
        Status status
) {
}
