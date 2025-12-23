package com.devflow.devflow_api.service;

import com.devflow.devflow_api.model.Status;
import com.devflow.devflow_api.model.Ticket;
import com.devflow.devflow_api.model.User;
import com.devflow.devflow_api.repository.TicketRepository;
import com.devflow.devflow_api.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
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

    // public List<Ticket> getMyTickets() {
    //    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    //    return ticketRepository.findByUserEmail(email);
    // }

    public List<Ticket> getMyTickets() {
        // On récupère l'email de l'utilisateur connecté via le SecurityContext
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        return ticketRepository.findByUserEmail(email);
    }

    public Ticket createTicket(Ticket ticketCreated) {

        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        ticketCreated.setUser(user);

        return ticketRepository.save(ticketCreated);

    }

    public Ticket updateTicket(Ticket ticketToUpdate) {
        Ticket existingTicket = ticketRepository.findById(ticketToUpdate.getId())
                .orElseThrow(()-> new RuntimeException("Oups Ticket non trouvé"));

        existingTicket.setTitle(ticketToUpdate.getTitle());
        existingTicket.setDescription(ticketToUpdate.getDescription());
        existingTicket.setStatus(ticketToUpdate.getStatus());

        return ticketRepository.save(existingTicket);

    }

    public Ticket updateTicketStatus(Long id, Status newStatus) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé avec l'ID : " + id));

        ticket.setStatus(newStatus);
        return ticketRepository.save(ticket);
    }

    // public void deleteTicket(Long id) {
    //   ticketRepository.deleteById(id);
    // }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteTicket(Long id) {
        ticketRepository.deleteById(id);
    }

   


}
