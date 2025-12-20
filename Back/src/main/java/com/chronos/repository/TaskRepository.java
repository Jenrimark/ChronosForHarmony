package com.chronos.repository;

import com.chronos.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(String status);

    @Query("SELECT t FROM Task t WHERE DATE(t.dueDate) = DATE(:date)")
    List<Task> findByDate(@Param("date") LocalDateTime date);

    @Query("SELECT t FROM Task t WHERE t.dueDate >= :startDate AND t.dueDate <= :endDate")
    List<Task> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                @Param("endDate") LocalDateTime endDate);

    @Query("SELECT t FROM Task t WHERE t.status = :status AND t.dueDate >= :startDate AND t.dueDate <= :endDate")
    List<Task> findByStatusAndDateRange(@Param("status") String status,
                                        @Param("startDate") LocalDateTime startDate,
                                        @Param("endDate") LocalDateTime endDate);
}

