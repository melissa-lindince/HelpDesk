package com.shecodes.helpdesk.services;

import com.shecodes.helpdesk.dto.TicketResponseDTO;
import com.shecodes.helpdesk.dto.TicketMapper;
import com.shecodes.helpdesk.exception.NotFoundException;
import com.shecodes.helpdesk.models.Category;
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
        userRepository.findById(ticket.getAuthor().getId()).orElseThrow(() -> new NotFoundException("Autor do ticket não encontrado."));
        userRepository.findById(ticket.getResponsableUser().getId()).orElseThrow(() -> new NotFoundException("Responsável do ticket não encontrado."));
        ticket.setCreatedOn(LocalDateTime.now());
        ticket.setStatus(Status.PENDENTE);
        setDueDate(ticket.getPriority(), ticket);
        return ticketRepository.save(ticket);
    }

    public Ticket consultTicket(Integer id){
        return ticketRepository.findById(id).orElseThrow(() -> new NotFoundException("Ticket não encontrado."));
    }

    public Ticket updateTicket(Ticket ticket, Integer id){
        Ticket ticketToUpdate = ticketRepository.findById(id).orElseThrow(() -> new NotFoundException("Ticket não encontrado."));

       
        if (ticket.getCategory() != null) {
            ticketToUpdate.setCategory(ticket.getCategory());
        }

        if (ticket.getDescription() != null) {
            ticketToUpdate.setDescription(ticket.getDescription() );
        }

        if (ticket.getTitle() != null) {
            ticketToUpdate.setTitle(ticket.getTitle());
        }

        if (ticket.getPriority() != null) {
            ticketToUpdate.setPriority(ticket.getPriority());
            setDueDate(ticket.getPriority(), ticketToUpdate);
        }
            return ticketRepository.save(ticketToUpdate);
        }

    public Ticket updateStatusTicket(Integer id, Status status){
        Ticket ticketToUpdateStatus = ticketRepository.findById(id).orElseThrow(() -> new NotFoundException("Ticket não encontrado."));

        ticketToUpdateStatus.setStatus(status);
        if(status.equals(Status.FINALIZADO)){
            ticketToUpdateStatus.setEndDate(LocalDateTime.now());
        } else{
            ticketToUpdateStatus.setEndDate(null);
        }
        return ticketRepository.save(ticketToUpdateStatus);
    }

    public void deleteTicket(Integer id){
        Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new NotFoundException("Ticket não encontrado."));
        ticketRepository.delete(ticket);
    }

    public List<TicketResponseDTO> listAllTickets(){
        return ticketRepository.findAll().stream().map(TicketMapper::toDTO).collect(Collectors.toList());
    }

    public List<TicketResponseDTO> listByStatus(Status status){
        return ticketRepository.findByStatus(status).stream().map(TicketMapper::toDTO).collect(Collectors.toList());
    }

    //metodo privado para determinar data de vencimento de ticket a partir da prioridade
    private LocalDateTime setDueDate(Priority priority, Ticket ticket){
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

    public List<TicketResponseDTO> filter(Status status, Priority priority, Category category, LocalDateTime startDate, LocalDateTime endDate) {
        return ticketRepository.filter(status,category,priority,startDate,endDate)
                .stream().map(TicketMapper::toDTO).collect(Collectors.toList());
    }
}
