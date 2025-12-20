package com.chronos.service.impl;

import com.chronos.entity.User;
import com.chronos.exception.BusinessException;
import com.chronos.repository.UserRepository;
import com.chronos.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new BusinessException("用户不存在"));
    }

    @Override
    @Transactional
    public User updateNickname(Long userId, String nickname) {
        User user = getUserById(userId);
        user.setNickname(nickname);
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public User updateAvatar(Long userId, String avatarUrl) {
        User user = getUserById(userId);
        user.setAvatar(avatarUrl);
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public User updatePhone(Long userId, String phone) {
        User user = getUserById(userId);
        // 检查手机号是否已被其他用户使用
        if (phone != null && !phone.isEmpty()) {
            userRepository.findByPhone(phone).ifPresent(existingUser -> {
                if (!existingUser.getId().equals(userId)) {
                    throw new BusinessException("该手机号已被使用");
                }
            });
        }
        user.setPhone(phone);
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public User updateUserInfo(Long userId, String nickname, String avatar, String phone) {
        User user = getUserById(userId);
        
        if (nickname != null && !nickname.isEmpty()) {
            user.setNickname(nickname);
        }
        
        if (avatar != null && !avatar.isEmpty()) {
            user.setAvatar(avatar);
        }
        
        if (phone != null && !phone.isEmpty()) {
            // 检查手机号是否已被其他用户使用
            userRepository.findByPhone(phone).ifPresent(existingUser -> {
                if (!existingUser.getId().equals(userId)) {
                    throw new BusinessException("该手机号已被使用");
                }
            });
            user.setPhone(phone);
        }
        
        return userRepository.save(user);
    }
}
