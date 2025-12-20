package com.chronos.controller;

import com.chronos.common.Result;
import com.chronos.entity.Bill;
import com.chronos.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bills")
public class BillController {

    @Autowired
    private BillService billService;

    @GetMapping
    public Result<List<Bill>> getAllBills(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<Bill> bills = billService.getAllBills(type, category, date, startDate, endDate);
        return Result.success(bills);
    }

    @GetMapping("/{id}")
    public Result<Bill> getBillById(@PathVariable Long id) {
        return billService.getBillById(id)
                .map(Result::success)
                .orElse(Result.error(404, "账单不存在"));
    }

    @PostMapping
    public Result<Bill> createBill(@RequestBody Bill bill) {
        Bill createdBill = billService.createBill(bill);
        return Result.success(createdBill);
    }

    @PutMapping("/{id}")
    public Result<Bill> updateBill(@PathVariable Long id, @RequestBody Bill bill) {
        Bill updatedBill = billService.updateBill(id, bill);
        return Result.success(updatedBill);
    }

    @DeleteMapping("/{id}")
    public Result<?> deleteBill(@PathVariable Long id) {
        billService.deleteBill(id);
        return Result.success(null);
    }

    @GetMapping("/statistics")
    public Result<Map<String, Object>> getStatistics(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        Map<String, Object> statistics = billService.getStatistics(type, startDate, endDate);
        return Result.success(statistics);
    }
}

