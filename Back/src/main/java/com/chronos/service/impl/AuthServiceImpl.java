package com.chronos.service.impl;

import com.chronos.entity.User;
import com.chronos.exception.BusinessException;
import com.chronos.common.ResultCode;
import com.chronos.repository.UserRepository;
import com.chronos.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Value("${jwt.secret:chronos-secret-key}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}")
    private Long jwtExpiration;

    @Override
    public Map<String, Object> login(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            throw new BusinessException(ResultCode.UNAUTHORIZED);
        }
        
        User user = userOpt.get();
        if (!user.getPassword().equals(password)) {
            throw new BusinessException(ResultCode.UNAUTHORIZED);
        }
        
        String token = generateToken(user);
        
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("username", user.getUsername());
        userInfo.put("nickname", user.getNickname());
        result.put("user", userInfo);
        
        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> register(String username, String password, String nickname) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "用户名已存在");
        }
        
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setNickname(nickname != null ? nickname : username);
        
        user = userRepository.save(user);
        
        String token = generateToken(user);
        
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("username", user.getUsername());
        userInfo.put("nickname", user.getNickname());
        userInfo.put("avatar", user.getAvatar());
        userInfo.put("phone", user.getPhone());
        result.put("user", userInfo);
        
        return result;
    }

    @Override
    public Map<String, Object> refreshToken(String token) {
        // TODO: 实现token刷新逻辑
        throw new BusinessException("暂未实现");
    }

    @Override
    @Transactional
    public Map<String, Object> wechatLogin(String openId, String unionId, String nickname, String avatar) {
        // 查找是否已存在该微信用户
        Optional<User> userOpt = userRepository.findByWechatOpenId(openId);
        
        User user;
        if (userOpt.isPresent()) {
            // 已存在，更新信息
            user = userOpt.get();
            if (nickname != null && !nickname.isEmpty()) {
                user.setNickname(nickname);
            }
            if (avatar != null && !avatar.isEmpty()) {
                user.setAvatar(avatar);
            }
            if (unionId != null && !unionId.isEmpty()) {
                user.setWechatUnionId(unionId);
            }
            user = userRepository.save(user);
        } else {
            // 新用户，创建账号
            user = new User();
            user.setWechatOpenId(openId);
            user.setWechatUnionId(unionId);
            user.setNickname(nickname != null && !nickname.isEmpty() ? nickname : "微信用户");
            user.setAvatar(avatar);
            // 微信登录不需要密码，生成一个唯一用户名
            user.setUsername("wx_" + openId);
            user.setPassword(""); // 微信登录不需要密码
            user.setLoginType("wechat");
            user = userRepository.save(user);
        }
        
        String token = generateToken(user);
        
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("username", user.getUsername());
        userInfo.put("nickname", user.getNickname());
        userInfo.put("avatar", user.getAvatar());
        userInfo.put("phone", user.getPhone());
        userInfo.put("loginType", user.getLoginType());
        result.put("user", userInfo);
        
        return result;
    }

    private String generateToken(User user) {
        return "token_" + user.getId() + "_" + System.currentTimeMillis();
    }
}

