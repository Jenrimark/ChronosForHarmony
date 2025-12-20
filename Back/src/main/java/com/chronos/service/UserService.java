package com.chronos.service;

import com.chronos.entity.User;

public interface UserService {
    /**
     * 根据ID获取用户信息
     */
    User getUserById(Long id);
    
    /**
     * 更新用户昵称
     */
    User updateNickname(Long userId, String nickname);
    
    /**
     * 更新用户头像
     */
    User updateAvatar(Long userId, String avatarUrl);
    
    /**
     * 更新手机号
     */
    User updatePhone(Long userId, String phone);
    
    /**
     * 更新用户信息（昵称、头像、手机号）
     */
    User updateUserInfo(Long userId, String nickname, String avatar, String phone);
}
