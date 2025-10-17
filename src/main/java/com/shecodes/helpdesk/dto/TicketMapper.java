package com.shecodes.helpdesk.dto;

import com.shecodes.helpdesk.models.Ticket;
import com.shecodes.helpdesk.models.User;

//permite transformar um dto <-> entidade -> útil para deixar controller mais limpo, separa logica de mapeamento
public class TicketMapper {

    //transformar um dto de criação de ticket em entidade ticket -> permitir que service use
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

    //overload (sobrecarga) -> transformar em entidade ticket mas com parametro diferente(outro dto)
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

    public static Ticket toModel(TicketPatchDTO dto){
        Ticket ticket = new Ticket();

        if(dto.category() != null) ticket.setCategory(dto.category());
        if(dto.priority() != null) ticket.setPriority(dto.priority());
        if(dto.description() != null) ticket.setDescription(dto.description());
        if(dto.title() != null) ticket.setTitle(dto.title());

        if (dto.responsableUserId() != null) {
        User responsable = new User();
        responsable.setId(dto.responsableUserId());
        ticket.setResponsableUser(responsable);
    }
    
    return ticket;
}
    //transformar um ticket em dto ->
    // resposta padronizada(utilizavel + de uma vez),
    // evitar recursividade(relacionamento onetomany: chamada do pai que chama filho que refencia pai)
    public static TicketResponseDTO toDTO(Ticket ticket){
        return  new TicketResponseDTO(
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
