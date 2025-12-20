package com.chronos.controller;

import com.chronos.common.Result;
import com.chronos.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        Map<String, Object> result = authService.login(username, password);
        return Result.success("登录成功", result);
    }

    @PostMapping("/register")
    public Result<Map<String, Object>> register(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        String nickname = request.get("nickname");
        Map<String, Object> result = authService.register(username, password, nickname);
        return Result.success("注册成功", result);
    }

    @PostMapping("/refresh")
    public Result<Map<String, Object>> refreshToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        Map<String, Object> result = authService.refreshToken(token);
        return Result.success("刷新成功", result);
    }

    /**
     * 微信登录
     */
    @PostMapping("/wechat/login")
    public Result<Map<String, Object>> wechatLogin(@RequestBody Map<String, String> request) {
        String openId = request.get("openId");
        String unionId = request.get("unionId"); // 可选
        String nickname = request.get("nickname"); // 可选
        String avatar = request.get("avatar"); // 可选
        
        if (openId == null || openId.isEmpty()) {
            return Result.error("openId不能为空");
        }
        
        Map<String, Object> result = authService.wechatLogin(openId, unionId, nickname, avatar);
        return Result.success("登录成功", result);
    }
}

