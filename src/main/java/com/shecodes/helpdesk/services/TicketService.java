package com.shecodes.helpdesk.services;

import com.shecodes.helpdesk.dto.TicketGetResponseDTO;
import com.shecodes.helpdesk.dto.TicketMapper;
import com.shecodes.helpdesk.models.Priority;
import com.shecodes.helpdesk.models.Status;
import com.shecodes.helpdesk.models.Ticket;
import com.shecodes.helpdesk.repositories.TicketRepository;
import com.shecodes.helpdesk.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Ticket createTicket(Ticket ticket) {
        userRepository.findById(ticket.getAuthor().getId()).orElse(null);
        userRepository.findById(ticket.getResponsableUser().getId()).orElse(null);
        ticket.setCreatedOn(LocalDateTime.now());
        ticket.setStatus(Status.PENDENTE);
        setDueDate(ticket.getPriority(), ticket);
        return ticketRepository.save(ticket);
    }

    public Ticket consultTicket(Integer id){
        return ticketRepository.findById(id).orElse(null);
    }

    public Ticket updateTicket(Ticket ticket, Integer id){
        Ticket ticketToUpdate = ticketRepository.findById(id).orElse(null);
        if (!ticket.getTitle().equals("")){
            ticketToUpdate.setTitle(ticket.getTitle());
        }
        if (!ticket.getDescription().equals("")){
            ticketToUpdate.setDescription(ticket.getDescription());
        }
        if (ticket.getStatus() != null){
            ticketToUpdate.setStatus(ticket.getStatus());
        }
        if (ticket.getResponsableUser().getId() != null){
            ticketToUpdate.setResponsableUser(ticket.getResponsableUser());
        }
        return ticketRepository.save(ticketToUpdate);
    }

    public Ticket updateStatusTicket(Integer id, Status status){
        Ticket ticketToUpdateStatus = ticketRepository.findById(id).orElse(null);
        ticketToUpdateStatus.setStatus(status);
        return ticketRepository.save(ticketToUpdateStatus);
    }

    public void deleteTicket(Integer id){
        ticketRepository.deleteById(id);
    }

    public List<TicketGetResponseDTO> listAllTickets(){
        return ticketRepository.findAll().stream().map(TicketMapper::toDTO).collect(Collectors.toList());
    }

    public List<TicketGetResponseDTO> listByStatus(Status status){
        return ticketRepository.findByStatus(status).stream().map(TicketMapper::toDTO).collect(Collectors.toList());
    }

    public LocalDateTime setDueDate(Priority priority, Ticket ticket){
        LocalDateTime dueDate = null;

        if (priority.equals(Priority.BAIXA)){
            dueDate = ticket.getCreatedOn().plusDays(10);
        } else if (priority.equals(Priority.MEDIA)) {
            dueDate = ticket.getCreatedOn().plusDays(7);
        } else if (priority.equals(Priority.ALTA)) {
            dueDate = ticket.getCreatedOn().plusDays(5);
        }

        ticket.setDueDate(dueDate);
        return dueDate;
    }
}
