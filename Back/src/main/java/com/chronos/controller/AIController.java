package com.chronos.controller;

import com.chronos.common.Result;
import com.chronos.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/recognize-bill")
    public Result<Map<String, Object>> recognizeBill(@RequestBody Map<String, Object> request) {
        String description = (String) request.get("description");
        Double amount = null;
        if (request.get("amount") instanceof Number) {
            amount = ((Number) request.get("amount")).doubleValue();
        }
        Map<String, Object> result = aiService.recognizeBill(description, amount);
        return Result.success("识别成功", result);
    }

    @PostMapping("/extract-bill-info")
    public Result<Map<String, Object>> extractBillInfo(@RequestBody Map<String, Object> request) {
        String text = (String) request.get("text");
        Map<String, Object> result = aiService.extractBillInfo(text);
        return Result.success("提取成功", result);
    }
}

