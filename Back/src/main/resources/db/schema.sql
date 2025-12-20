-- ============================================
-- Chronos 数据库建表脚本
-- 数据库名: Chronos
-- ============================================

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS `Chronos` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `Chronos`;

-- ============================================
-- 1. 用户表 (users)
-- ============================================
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    `password` VARCHAR(255) NOT NULL COMMENT '密码',
    `nickname` VARCHAR(50) COMMENT '昵称',
    `avatar` VARCHAR(500) COMMENT '头像URL',
    `phone` VARCHAR(20) UNIQUE COMMENT '手机号',
    `wechat_openid` VARCHAR(100) UNIQUE COMMENT '微信OpenID',
    `wechat_unionid` VARCHAR(100) COMMENT '微信UnionID',
    `login_type` VARCHAR(20) DEFAULT 'password' COMMENT '登录类型：password-密码登录，wechat-微信登录',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_username` (`username`),
    INDEX `idx_phone` (`phone`),
    INDEX `idx_wechat_openid` (`wechat_openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ============================================
-- 2. 任务表 (tasks)
-- ============================================
CREATE TABLE IF NOT EXISTS `tasks` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '任务ID',
    `user_id` BIGINT COMMENT '用户ID（关联users表）',
    `title` VARCHAR(200) NOT NULL COMMENT '任务标题',
    `description` TEXT COMMENT '任务描述',
    `status` VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '任务状态：pending-待办，in_progress-进行中，completed-已完成，cancelled-已取消',
    `priority` INT NOT NULL DEFAULT 2 COMMENT '优先级：1-低，2-中，3-高，4-紧急',
    `due_date` DATETIME COMMENT '截止日期',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `completed_time` DATETIME COMMENT '完成时间',
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_due_date` (`due_date`),
    INDEX `idx_create_time` (`create_time`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='任务表';

-- ============================================
-- 3. 任务标签表 (task_tags)
-- ============================================
CREATE TABLE IF NOT EXISTS `task_tags` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '标签ID',
    `task_id` BIGINT NOT NULL COMMENT '任务ID',
    `tag` VARCHAR(50) NOT NULL COMMENT '标签名称',
    INDEX `idx_task_id` (`task_id`),
    INDEX `idx_tag` (`tag`),
    FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='任务标签表';

-- ============================================
-- 4. 账单表 (bills)
-- ============================================
CREATE TABLE IF NOT EXISTS `bills` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '账单ID',
    `user_id` BIGINT COMMENT '用户ID（关联users表）',
    `type` VARCHAR(20) NOT NULL COMMENT '账单类型：income-收入，expense-支出',
    `category` VARCHAR(50) COMMENT '账单分类',
    `amount` DECIMAL(10, 2) NOT NULL COMMENT '金额',
    `description` VARCHAR(500) COMMENT '描述',
    `date` DATETIME NOT NULL COMMENT '账单日期',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_type` (`type`),
    INDEX `idx_category` (`category`),
    INDEX `idx_date` (`date`),
    INDEX `idx_create_time` (`create_time`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='账单表';

-- ============================================
-- 5. 账单标签表 (bill_tags)
-- ============================================
CREATE TABLE IF NOT EXISTS `bill_tags` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '标签ID',
    `bill_id` BIGINT NOT NULL COMMENT '账单ID',
    `tag` VARCHAR(50) NOT NULL COMMENT '标签名称',
    INDEX `idx_bill_id` (`bill_id`),
    INDEX `idx_tag` (`tag`),
    FOREIGN KEY (`bill_id`) REFERENCES `bills`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='账单标签表';

-- ============================================
-- 初始化数据（可选）
-- ============================================
-- 插入一个测试用户（密码：123456，实际使用时应该加密存储）
-- INSERT INTO `users` (`username`, `password`, `nickname`, `login_type`) 
-- VALUES ('admin', '123456', '管理员', 'password');
