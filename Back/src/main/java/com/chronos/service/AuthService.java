package com.chronos.service;

import com.chronos.entity.User;
import java.util.Map;

public interface AuthService {
    Map<String, Object> login(String username, String password);
    Map<String, Object> register(String username, String password, String nickname);
    Map<String, Object> refreshToken(String token);
    
    /**
     * 微信登录
     * @param openId 微信OpenID
     * @param unionId 微信UnionID（可选）
     * @param nickname 昵称（可选）
     * @param avatar 头像URL（可选）
     * @return 登录结果，包含token和用户信息
     */
    Map<String, Object> wechatLogin(String openId, String unionId, String nickname, String avatar);
}

