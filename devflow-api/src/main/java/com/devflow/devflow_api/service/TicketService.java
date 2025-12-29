package com.devflow.devflow_api.service;

import com.devflow.devflow_api.model.Priority;
import com.devflow.devflow_api.model.Status;
import com.devflow.devflow_api.model.Ticket;
import com.devflow.devflow_api.model.User;
import com.devflow.devflow_api.repository.TicketRepository;
import com.devflow.devflow_api.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public TicketService(TicketRepository ticketRepository , UserRepository userRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // Cette méthode accepte maintenant l'email envoyé par le Controller
    public List<Ticket> getMyTickets(String email) {
        return ticketRepository.findByUserEmail(email);
    }

    public Ticket createTicket(Ticket ticket, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        ticket.setUser(user);
        if (ticket.getStatus() == null) ticket.setStatus(Status.TODO);
        if (ticket.getPriority() == null) ticket.setPriority(Priority.MEDIUM);
        return ticketRepository.save(ticket);
    }

    public Ticket updateTicketStatus(Long id, Status newStatus) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé avec l'ID : " + id));
        ticket.setStatus(newStatus);
        return ticketRepository.save(ticket);
    }

    @Transactional
    public Ticket updateStatus(Long id, Status newStatus) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
        ticket.setStatus(newStatus);
        return ticketRepository.save(ticket);
    }

    @Transactional
    public void deleteTicket(Long id, String email) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
        if (!ticket.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Vous n'êtes pas autorisé à supprimer ce ticket");
        }
        ticketRepository.delete(ticket);
        System.out.println("Ticket supprimé avec succès");
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    public void deleteTicket(Long id) {
        ticketRepository.deleteById(id);
    }
}