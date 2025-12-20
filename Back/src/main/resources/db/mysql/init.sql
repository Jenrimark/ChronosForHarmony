-- ============================================
-- Chronos 数据库初始化脚本
-- 数据库名称: Chronos
-- 数据库类型: MySQL 8.0+
-- ============================================

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS `Chronos` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `Chronos`;

-- ============================================
-- 用户表 (users)
-- ============================================
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `username` VARCHAR(50) NOT NULL COMMENT '用户名',
    `password` VARCHAR(255) NOT NULL COMMENT '密码',
    `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
    `avatar` VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
    `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
    `wechat_openid` VARCHAR(100) DEFAULT NULL COMMENT '微信OpenID',
    `wechat_unionid` VARCHAR(100) DEFAULT NULL COMMENT '微信UnionID',
    `login_type` VARCHAR(20) DEFAULT 'password' COMMENT '登录类型：password-密码登录，wechat-微信登录',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`),
    UNIQUE KEY `uk_phone` (`phone`),
    UNIQUE KEY `uk_wechat_openid` (`wechat_openid`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ============================================
-- 任务表 (tasks)
-- ============================================
CREATE TABLE IF NOT EXISTS `tasks` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '任务ID',
    `title` VARCHAR(200) NOT NULL COMMENT '任务标题',
    `description` TEXT DEFAULT NULL COMMENT '任务描述',
    `status` VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '任务状态：pending-待办，in_progress-进行中，completed-已完成，cancelled-已取消',
    `priority` INT NOT NULL DEFAULT 2 COMMENT '优先级：1-低，2-中，3-高，4-紧急',
    `due_date` DATETIME DEFAULT NULL COMMENT '截止日期',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `completed_time` DATETIME DEFAULT NULL COMMENT '完成时间',
    PRIMARY KEY (`id`),
    KEY `idx_status` (`status`),
    KEY `idx_priority` (`priority`),
    KEY `idx_due_date` (`due_date`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='任务表';

-- ============================================
-- 任务标签表 (task_tags)
-- ============================================
CREATE TABLE IF NOT EXISTS `task_tags` (
    `task_id` BIGINT NOT NULL COMMENT '任务ID',
    `tag` VARCHAR(50) NOT NULL COMMENT '标签名称',
    PRIMARY KEY (`task_id`, `tag`),
    KEY `idx_tag` (`tag`),
    CONSTRAINT `fk_task_tags_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='任务标签表';

-- ============================================
-- 账单表 (bills)
-- ============================================
CREATE TABLE IF NOT EXISTS `bills` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '账单ID',
    `type` VARCHAR(20) NOT NULL COMMENT '账单类型：income-收入，expense-支出',
    `category` VARCHAR(50) DEFAULT NULL COMMENT '账单分类',
    `amount` DECIMAL(10, 2) NOT NULL COMMENT '金额',
    `description` VARCHAR(500) DEFAULT NULL COMMENT '描述',
    `date` DATETIME NOT NULL COMMENT '账单日期',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_type` (`type`),
    KEY `idx_category` (`category`),
    KEY `idx_date` (`date`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='账单表';

-- ============================================
-- 账单标签表 (bill_tags)
-- ============================================
CREATE TABLE IF NOT EXISTS `bill_tags` (
    `bill_id` BIGINT NOT NULL COMMENT '账单ID',
    `tag` VARCHAR(50) NOT NULL COMMENT '标签名称',
    PRIMARY KEY (`bill_id`, `tag`),
    KEY `idx_tag` (`tag`),
    CONSTRAINT `fk_bill_tags_bill` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='账单标签表';

-- ============================================
-- 初始化数据（可选）
-- ============================================

-- 插入示例用户（密码：123456，实际使用时应该加密）
-- INSERT INTO `users` (`username`, `password`, `nickname`, `create_time`, `update_time`) 
-- VALUES ('admin', '123456', '管理员', NOW(), NOW());

