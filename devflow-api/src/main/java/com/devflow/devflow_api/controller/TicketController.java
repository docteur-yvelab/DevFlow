package com.devflow.devflow_api.controller;

import com.devflow.devflow_api.model.Status;
import com.devflow.devflow_api.model.Ticket;
import com.devflow.devflow_api.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyTickets(Authentication authentication) {
        return ResponseEntity.ok(ticketService.getMyTickets(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody Ticket ticket, Authentication authentication) {
        return ResponseEntity.ok(ticketService.createTicket(ticket, authentication.getName()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            Status status = Status.valueOf(payload.get("status"));
            return ResponseEntity.ok(ticketService.updateStatus(id, status));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id, Authentication authentication) {
        ticketService.deleteTicket(id, authentication.getName());
        return ResponseEntity.noContent().build(); // Retourne un code 204 (Succès, pas de contenu)
    }
}