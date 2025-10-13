package com.shecodes.helpdesk.controllers;

import com.shecodes.helpdesk.dto.TicketGetResponseDTO;
import com.shecodes.helpdesk.dto.TicketPatchStatusDto;
import com.shecodes.helpdesk.dto.TicketPostRequestDto;
import com.shecodes.helpdesk.dto.TicketPutRequestDto;
import com.shecodes.helpdesk.models.Status;
import com.shecodes.helpdesk.models.Ticket;
import com.shecodes.helpdesk.services.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.shecodes.helpdesk.dto.TicketMapper.toDTO;
import static com.shecodes.helpdesk.dto.TicketMapper.toModel;

@RestController
@RequestMapping("/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping("/addTicket")
    public Ticket addTicket(@Valid @RequestBody TicketPostRequestDto ticketPostRequestDto){
        Ticket ticket = toModel(ticketPostRequestDto);
        return ticketService.createTicket(ticket);
    }

    @GetMapping("/{id}")
    public TicketGetResponseDTO consultTicket(@PathVariable("id") Integer id){
        return toDTO(ticketService.consultTicket(id));
    }

    @GetMapping("/all")
    public List<TicketGetResponseDTO> consultAllTickets(){
        return ticketService.listAllTickets();
    }

    @GetMapping("/filter/{status}")
    public List<TicketGetResponseDTO> consultByStatus(@PathVariable("status")Status status){
        return ticketService.listByStatus(status);
    }

    @PutMapping("/{id}")
    public Ticket updateTicket(@Valid @RequestBody TicketPutRequestDto ticketPutRequestDto,@PathVariable("id") Integer id){
        Ticket ticket = toModel(ticketPutRequestDto);
        return ticketService.updateTicket(ticket,id);
    }

    @PatchMapping("/{id}")
    public Ticket updateStatusTicket(@Valid @RequestBody TicketPatchStatusDto ticketPatchStatusDto, @PathVariable("id") Integer id){
        return ticketService.updateStatusTicket(id, ticketPatchStatusDto.status());
    }

    @DeleteMapping("/{id}")
    public void deleteTicket(@PathVariable("id") Integer id){
        ticketService.deleteTicket(id);
    }

}
