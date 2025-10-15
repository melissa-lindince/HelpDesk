package com.shecodes.helpdesk.controllers;

import com.shecodes.helpdesk.dto.TicketResponseDTO;
import com.shecodes.helpdesk.dto.TicketPatchStatusDto;
import com.shecodes.helpdesk.dto.TicketPatchDTO;
import com.shecodes.helpdesk.dto.TicketPostRequestDto;
import com.shecodes.helpdesk.dto.TicketPutRequestDto;

import com.shecodes.helpdesk.dto.*;
import com.shecodes.helpdesk.models.Category;
import com.shecodes.helpdesk.models.Priority;
import com.shecodes.helpdesk.models.Status;
import com.shecodes.helpdesk.models.Ticket;
import com.shecodes.helpdesk.services.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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
    public TicketResponseDTO consultTicket(@PathVariable("id") Integer id){
        return toDTO(ticketService.consultTicket(id));
    }

    @GetMapping("/all")
    public List<TicketResponseDTO> consultAllTickets(){
        return ticketService.listAllTickets();
    }

    @GetMapping("/filter/{status}")
    public List<TicketResponseDTO> consultByStatus(@PathVariable("status")Status status){
        return ticketService.listByStatus(status);
    }

    @GetMapping("/filter")
    public List<TicketResponseDTO> filterTickets(
            @RequestParam(required = false) Status status, @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) Category category,
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)@RequestParam(required = false)LocalDateTime startDate,
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)@RequestParam(required = false)LocalDateTime endDate
            ){
        return ticketService.filter(status, priority, category, startDate, endDate);
    }

    @PutMapping("/{id}")
    public TicketResponseDTO updateTicket(@Valid @RequestBody TicketPutRequestDto ticketPutRequestDto, @PathVariable("id") Integer id){
        Ticket ticket = toModel(ticketPutRequestDto);
        return toDTO(ticketService.updateTicket(ticket,id));
    }
@PatchMapping("/{id}")
    public TicketResponseDTO updateTicketPatch(@RequestBody TicketPatchDTO ticketPatchDTO,@PathVariable("id") Integer id){
    Ticket ticket = TicketMapper.toModel(ticketPatchDTO);
    return TicketMapper.toDTO(ticketService.updateTicket(ticket, id));
}



    @PatchMapping("/status/{id}")
    public TicketResponseDTO  updateStatusTicket(@Valid @RequestBody TicketPatchStatusDto ticketPatchStatusDto, @PathVariable("id") Integer id){
        Ticket ticket = ticketService.updateStatusTicket(id, ticketPatchStatusDto.status());
        return TicketMapper.toDTO(ticket);
    }

    @DeleteMapping("/{id}")
    public void deleteTicket(@PathVariable("id") Integer id){
        ticketService.deleteTicket(id);
    }

}
