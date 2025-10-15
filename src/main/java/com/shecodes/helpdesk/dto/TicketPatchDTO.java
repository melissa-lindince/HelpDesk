package com.shecodes.helpdesk.dto;

import com.shecodes.helpdesk.models.Category;
import com.shecodes.helpdesk.models.Priority;
import com.shecodes.helpdesk.models.Status;

public record TicketPatchDTO(
        Category category,
        Priority priority
) {}
