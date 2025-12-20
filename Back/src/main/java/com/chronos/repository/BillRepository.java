package com.chronos.repository;

import com.chronos.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByType(String type);

    List<Bill> findByCategory(String category);

    @Query("SELECT b FROM Bill b WHERE DATE(b.date) = DATE(:date)")
    List<Bill> findByDate(@Param("date") LocalDateTime date);

    @Query("SELECT b FROM Bill b WHERE b.date >= :startDate AND b.date <= :endDate")
    List<Bill> findByDateRange(@Param("startDate") LocalDateTime startDate,
                               @Param("endDate") LocalDateTime endDate);

    @Query("SELECT b FROM Bill b WHERE b.type = :type AND b.date >= :startDate AND b.date <= :endDate")
    List<Bill> findByTypeAndDateRange(@Param("type") String type,
                                       @Param("startDate") LocalDateTime startDate,
                                       @Param("endDate") LocalDateTime endDate);
}

