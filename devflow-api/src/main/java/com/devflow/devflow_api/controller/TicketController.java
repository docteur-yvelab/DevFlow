package com.devflow.devflow_api.controller;

import com.devflow.devflow_api.model.Ticket;
import com.devflow.devflow_api.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // Teste d'abord cette route simple
    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyTickets(Authentication authentication) {
        System.out.println("Route /my appelée par : " + authentication.getName());
        return ResponseEntity.ok(ticketService.getMyTickets(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody Ticket ticket, Authentication authentication) {
        return ResponseEntity.ok(ticketService.createTicket(ticket, authentication.getName()));
    }
}