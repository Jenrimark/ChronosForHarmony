package com.chronos.service.impl;

import com.chronos.service.AIService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AIServiceImpl implements AIService {

    @Override
    public Map<String, Object> recognizeBill(String description, Double amount) {
        Map<String, Object> result = new HashMap<>();
        
        String category = "other";
        if (description != null) {
            String lowerDesc = description.toLowerCase();
            if (lowerDesc.contains("餐") || lowerDesc.contains("饭") || lowerDesc.contains("食") || 
                lowerDesc.contains("麻辣烫") || lowerDesc.contains("火锅") || lowerDesc.contains("烧烤")) {
                category = "food";
            } else if (lowerDesc.contains("交通") || lowerDesc.contains("车") || lowerDesc.contains("地铁") || 
                      lowerDesc.contains("公交") || lowerDesc.contains("打车")) {
                category = "transport";
            } else if (lowerDesc.contains("购物") || lowerDesc.contains("买") || lowerDesc.contains("超市")) {
                category = "shopping";
            } else if (lowerDesc.contains("娱乐") || lowerDesc.contains("电影") || lowerDesc.contains("游戏")) {
                category = "entertainment";
            }
        }
        
        result.put("type", "expense");
        result.put("category", category);
        result.put("amount", amount);
        result.put("description", description);
        
        return result;
    }

    @Override
    public Map<String, Object> extractBillInfo(String text) {
        Map<String, Object> result = new HashMap<>();
        
        Double amount = null;
        String description = text;
        
        if (text != null) {
            String[] parts = text.split("元");
            if (parts.length > 0) {
                try {
                    String amountStr = parts[0].replaceAll("[^0-9.]", "");
                    if (!amountStr.isEmpty()) {
                        amount = Double.parseDouble(amountStr);
                    }
                } catch (NumberFormatException e) {
                }
            }
            
            description = text.replaceAll("\\d+(\\.\\d+)?元", "").trim();
            if (description.isEmpty()) {
                description = text;
            }
        }
        
        result.put("amount", amount);
        result.put("description", description);
        
        return result;
    }
}

