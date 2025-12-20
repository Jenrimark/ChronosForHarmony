package com.chronos.controller;

import com.chronos.common.Result;
import com.chronos.entity.User;
import com.chronos.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 获取用户信息
     */
    @GetMapping("/{id}")
    public Result<Map<String, Object>> getUserInfo(@PathVariable Long id) {
        User user = userService.getUserById(id);
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("username", user.getUsername());
        userInfo.put("nickname", user.getNickname());
        userInfo.put("avatar", user.getAvatar());
        userInfo.put("phone", user.getPhone());
        userInfo.put("loginType", user.getLoginType());
        userInfo.put("createTime", user.getCreateTime());
        return Result.success("获取成功", userInfo);
    }

    /**
     * 更新用户昵称
     */
    @PutMapping("/{id}/nickname")
    public Result<Map<String, Object>> updateNickname(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String nickname = request.get("nickname");
        User user = userService.updateNickname(id, nickname);
        Map<String, Object> result = new HashMap<>();
        result.put("nickname", user.getNickname());
        return Result.success("更新成功", result);
    }

    /**
     * 更新用户头像
     */
    @PutMapping("/{id}/avatar")
    public Result<Map<String, Object>> updateAvatar(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String avatar = request.get("avatar");
        User user = userService.updateAvatar(id, avatar);
        Map<String, Object> result = new HashMap<>();
        result.put("avatar", user.getAvatar());
        return Result.success("更新成功", result);
    }

    /**
     * 更新手机号
     */
    @PutMapping("/{id}/phone")
    public Result<Map<String, Object>> updatePhone(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String phone = request.get("phone");
        User user = userService.updatePhone(id, phone);
        Map<String, Object> result = new HashMap<>();
        result.put("phone", user.getPhone());
        return Result.success("更新成功", result);
    }

    /**
     * 更新用户信息（可批量更新昵称、头像、手机号）
     */
    @PutMapping("/{id}/info")
    public Result<Map<String, Object>> updateUserInfo(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String nickname = request.get("nickname");
        String avatar = request.get("avatar");
        String phone = request.get("phone");
        
        User user = userService.updateUserInfo(id, nickname, avatar, phone);
        
        Map<String, Object> result = new HashMap<>();
        result.put("id", user.getId());
        result.put("nickname", user.getNickname());
        result.put("avatar", user.getAvatar());
        result.put("phone", user.getPhone());
        return Result.success("更新成功", result);
    }
}
