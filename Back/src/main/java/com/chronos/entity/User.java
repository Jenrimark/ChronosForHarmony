package com.chronos.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    /**
     * 昵称
     */
    @Column(length = 50)
    private String nickname;

    /**
     * 头像URL
     */
    @Column(length = 500)
    private String avatar;

    /**
     * 手机号
     */
    @Column(length = 20, unique = true)
    private String phone;

    /**
     * 微信OpenID（用于微信登录）
     */
    @Column(name = "wechat_openid", length = 100, unique = true)
    private String wechatOpenId;

    /**
     * 微信UnionID（用于微信登录，可选）
     */
    @Column(name = "wechat_unionid", length = 100)
    private String wechatUnionId;

    /**
     * 登录类型：password-密码登录，wechat-微信登录
     */
    @Column(name = "login_type", length = 20)
    private String loginType = "password";

    @Column(nullable = false)
    private LocalDateTime createTime;

    @Column(nullable = false)
    private LocalDateTime updateTime;

    @PrePersist
    protected void onCreate() {
        createTime = LocalDateTime.now();
        updateTime = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updateTime = LocalDateTime.now();
    }
}

