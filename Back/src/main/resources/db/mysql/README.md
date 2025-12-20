# MySQL 数据库初始化

## 使用说明

### 方式一：命令行执行

```bash
# Windows
mysql -u root -p < src\main\resources\db\mysql\init.sql

# Linux/Mac
mysql -u root -p < src/main/resources/db/mysql/init.sql
```

### 方式二：MySQL客户端工具

1. 打开MySQL客户端（如Navicat、DBeaver、MySQL Workbench等）
2. 连接到MySQL服务器
3. 打开并执行 `init.sql` 文件

### 方式三：手动执行

1. 登录MySQL：
```sql
mysql -u root -p
```

2. 执行SQL语句：
```sql
CREATE DATABASE IF NOT EXISTS `Chronos` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `Chronos`;
-- 然后复制 init.sql 中的表创建语句执行
```

## 验证

执行完成后，可以验证表是否创建成功：

```sql
USE Chronos;
SHOW TABLES;
```

应该看到以下表：
- users
- tasks
- task_tags
- bills
- bill_tags

## 注意事项

1. 确保MySQL版本 >= 8.0
2. 确保有创建数据库的权限
3. 如果数据库已存在，脚本会跳过创建数据库，但会创建表（如果不存在）

