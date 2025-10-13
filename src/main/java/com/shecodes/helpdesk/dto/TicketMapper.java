package com.shecodes.helpdesk.dto;

import com.shecodes.helpdesk.models.Ticket;
import com.shecodes.helpdesk.models.User;

public class TicketMapper {

    public static Ticket toModel(TicketPostRequestDto dto){
        Ticket ticket = new Ticket();
        User author = new User();
        author.setId(dto.authorId());
        User responsable = new User();
        responsable.setId(dto.responsableUserId());

        ticket.setTitle(dto.title());
        ticket.setDescription(dto.description());
        ticket.setCategory(dto.category());
        ticket.setPriority(dto.priority());
        ticket.setAuthor(author);
        ticket.setResponsableUser(responsable);

        return ticket;
    }

    public static Ticket toModel(TicketPutRequestDto dto){
        Ticket ticket = new Ticket();
        User responsable = new User();
        responsable.setId(dto.responsableUserId());

        ticket.setTitle(dto.title());
        ticket.setDescription(dto.description());
        ticket.setStatus(dto.status());
        ticket.setResponsableUser(responsable);

        return ticket;
    }

    public static TicketGetResponseDTO toDTO(Ticket ticket){
        return  new TicketGetResponseDTO(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getCreatedOn(),
                ticket.getDueDate(),
                ticket.getEndDate(),
                ticket.getCategory(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getAuthor().getName(),
                ticket.getResponsableUser().getName()
        );
    }
}
