package com.chronos.service.impl;

import com.chronos.entity.Bill;
import com.chronos.exception.BusinessException;
import com.chronos.common.ResultCode;
import com.chronos.repository.BillRepository;
import com.chronos.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class BillServiceImpl implements BillService {

    @Autowired
    private BillRepository billRepository;

    @Override
    public List<Bill> getAllBills(String type, String category, LocalDateTime date,
                                  LocalDateTime startDate, LocalDateTime endDate) {
        if (type != null && startDate != null && endDate != null) {
            return billRepository.findByTypeAndDateRange(type, startDate, endDate);
        } else if (type != null) {
            return billRepository.findByType(type);
        } else if (category != null) {
            return billRepository.findByCategory(category);
        } else if (date != null) {
            return billRepository.findByDate(date);
        } else if (startDate != null && endDate != null) {
            return billRepository.findByDateRange(startDate, endDate);
        } else {
            return billRepository.findAll();
        }
    }

    @Override
    public Optional<Bill> getBillById(Long id) {
        return billRepository.findById(id);
    }

    @Override
    @Transactional
    public Bill createBill(Bill bill) {
        return billRepository.save(bill);
    }

    @Override
    @Transactional
    public Bill updateBill(Long id, Bill bill) {
        Bill existingBill = billRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));
        
        if (bill.getType() != null) {
            existingBill.setType(bill.getType());
        }
        if (bill.getCategory() != null) {
            existingBill.setCategory(bill.getCategory());
        }
        if (bill.getAmount() != null) {
            existingBill.setAmount(bill.getAmount());
        }
        if (bill.getDescription() != null) {
            existingBill.setDescription(bill.getDescription());
        }
        if (bill.getDate() != null) {
            existingBill.setDate(bill.getDate());
        }
        if (bill.getTags() != null) {
            existingBill.setTags(bill.getTags());
        }
        
        return billRepository.save(existingBill);
    }

    @Override
    @Transactional
    public void deleteBill(Long id) {
        if (!billRepository.existsById(id)) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        billRepository.deleteById(id);
    }

    @Override
    public Map<String, Object> getStatistics(String type, LocalDateTime startDate, LocalDateTime endDate) {
        List<Bill> bills;
        if (startDate != null && endDate != null) {
            bills = billRepository.findByDateRange(startDate, endDate);
        } else {
            bills = billRepository.findAll();
        }

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;
        int incomeCount = 0;
        int expenseCount = 0;

        for (Bill bill : bills) {
            if ("income".equals(bill.getType())) {
                totalIncome = totalIncome.add(bill.getAmount());
                incomeCount++;
            } else if ("expense".equals(bill.getType())) {
                totalExpense = totalExpense.add(bill.getAmount());
                expenseCount++;
            }
        }

        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalIncome", totalIncome);
        statistics.put("totalExpense", totalExpense);
        statistics.put("netIncome", totalIncome.subtract(totalExpense));
        statistics.put("incomeCount", incomeCount);
        statistics.put("expenseCount", expenseCount);

        return statistics;
    }
}

