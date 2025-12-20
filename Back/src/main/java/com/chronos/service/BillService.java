package com.chronos.service;

import com.chronos.entity.Bill;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface BillService {
    List<Bill> getAllBills(String type, String category, LocalDateTime date, 
                           LocalDateTime startDate, LocalDateTime endDate);
    Optional<Bill> getBillById(Long id);
    Bill createBill(Bill bill);
    Bill updateBill(Long id, Bill bill);
    void deleteBill(Long id);
    Map<String, Object> getStatistics(String type, LocalDateTime startDate, LocalDateTime endDate);
}

