package com.devflow.devflow_api.repository;

import com.devflow.devflow_api.model.Ticket;
import com.devflow.devflow_api.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Query("SELECT t FROM Ticket t WHERE t.user.email = :email")
    List<Ticket> findByUserEmail(@Param("email") String email);

    List<Ticket> findByStatus(String status);
    List<Ticket> findByAssignedToId(Long userId);
    // List<Ticket> findByUserEmail(String email);


}
