package com.shecodes.helpdesk.dto;


import com.shecodes.helpdesk.models.Category;
import com.shecodes.helpdesk.models.Priority;
import com.shecodes.helpdesk.models.Status;
import com.shecodes.helpdesk.models.User;

import java.time.LocalDateTime;

public record TicketGetResponseDTO(
        Integer id,
        String title,
        String description,
        LocalDateTime createdOn,
        LocalDateTime dueDate,
        LocalDateTime endDate,
        Category category,
        Priority priority,
        Status status,
        String authorName,
        String responsableName
) {
}
