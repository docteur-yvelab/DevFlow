package com.devflow.devflow_api.controller;

import com.devflow.devflow_api.model.Status;
import com.devflow.devflow_api.model.Ticket;
import com.devflow.devflow_api.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    // Récupérer tous les tickets
    @GetMapping("/all")
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyTickets() {
        return ResponseEntity.ok(service.getMyTickets());
    }

    // @GetMapping("/all")
    // public ResponseEntity<List<Ticket>> getAllTickets() {
    // return ResponseEntity.ok(service.getAllTickets());
    //}

    // Créer un nouveau ticket
    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody Ticket ticket) {
        return ResponseEntity.ok(ticketService.createTicket(ticket));
    }

    // Modifier le statut (Indispensable pour le Drag & Drop)
    // Route: PATCH /api/tickets/{id}/status?newStatus=DONE
    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateStatus(
            @PathVariable Long id,
            @RequestParam Status newStatus) {
        return ResponseEntity.ok(ticketService.updateTicketStatus(id, newStatus));
    }

    // Supprimer un ticket
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
}
