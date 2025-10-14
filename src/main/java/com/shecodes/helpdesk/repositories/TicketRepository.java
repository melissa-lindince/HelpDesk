package com.shecodes.helpdesk.repositories;

import com.shecodes.helpdesk.models.Category;
import com.shecodes.helpdesk.models.Priority;
import com.shecodes.helpdesk.models.Status;
import com.shecodes.helpdesk.models.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Integer> {

    @Query("""
        SELECT t FROM Ticket t
        WHERE (:status IS NULL OR t.status = :status)
          AND (:category IS NULL OR t.category = :category)
          AND (:priority IS NULL OR t.priority = :priority)
          AND (
                (:startDate IS NULL AND :endDate IS NULL)
                OR (t.dueDate BETWEEN :startDate AND :endDate)
                OR (:startDate IS NOT NULL AND :endDate IS NULL AND t.dueDate >= :startDate)
                OR (:startDate IS NULL AND :endDate IS NOT NULL AND t.dueDate <= :endDate)
              )
    """)
    List<Ticket> filter(@Param("status") Status status, @Param("category") Category category, @Param("priority") Priority priority,
                        @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    List<Ticket> findByDueDate(LocalDateTime dueDate);
    List<Ticket> findByStatus(Status status);

}
