-- ============================================
-- Chronos 数据库初始化数据脚本
-- 用于测试和演示
-- ============================================

USE `Chronos`;

-- ============================================
-- 插入测试用户
-- ============================================
-- 注意：实际生产环境中密码应该加密存储
INSERT INTO `users` (`username`, `password`, `nickname`, `login_type`, `create_time`, `update_time`) 
VALUES 
('admin', '123456', '管理员', 'password', NOW(), NOW()),
('test', '123456', '测试用户', 'password', NOW(), NOW());

-- ============================================
-- 插入测试任务（可选）
-- ============================================
-- INSERT INTO `tasks` (`user_id`, `title`, `description`, `status`, `priority`, `due_date`, `create_time`, `update_time`)
-- VALUES 
-- (1, '完成项目文档', '编写项目README和API文档', 'in_progress', 3, DATE_ADD(NOW(), INTERVAL 7 DAY), NOW(), NOW()),
-- (1, '代码审查', '审查团队成员提交的代码', 'pending', 2, DATE_ADD(NOW(), INTERVAL 3 DAY), NOW(), NOW());

-- ============================================
-- 插入测试账单（可选）
-- ============================================
-- INSERT INTO `bills` (`user_id`, `type`, `category`, `amount`, `description`, `date`, `create_time`, `update_time`)
-- VALUES 
-- (1, 'expense', 'food', 45.50, '午餐', NOW(), NOW(), NOW()),
-- (1, 'income', 'salary', 5000.00, '工资', DATE_SUB(NOW(), INTERVAL 1 DAY), NOW(), NOW());
