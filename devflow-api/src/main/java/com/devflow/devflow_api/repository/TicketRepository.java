package com.devflow.devflow_api.repository;

import com.devflow.devflow_api.model.Ticket;
import com.devflow.devflow_api.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByStatus(String status);
    List<Ticket> findByAssignedToId(Long userId);
    List<Ticket> findByUserEmail(String email);
}
