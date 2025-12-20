package com.chronos.service;

import java.util.Map;

public interface AIService {
    Map<String, Object> recognizeBill(String description, Double amount);
    Map<String, Object> extractBillInfo(String text);
}

