# Chronos 数据库设置指南

## 一、创建MySQL数据库

### 方法1：使用MySQL命令行

```bash
mysql -u root -p
```

然后执行：

```sql
CREATE DATABASE IF NOT EXISTS `Chronos` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `Chronos`;
SOURCE Back/src/main/resources/db/schema.sql;
```

### 方法2：使用SQL文件

```bash
mysql -u root -p < Back/src/main/resources/db/schema.sql
```

### 方法3：使用MySQL Workbench或其他GUI工具

1. 打开MySQL Workbench
2. 连接到MySQL服务器
3. 执行 `Back/src/main/resources/db/schema.sql` 文件

## 二、配置后端连接MySQL

### 1. 修改配置文件

编辑 `Back/src/main/resources/application.yml`：

```yaml
spring:
  profiles:
    active: prod  # 改为 prod 使用MySQL，dev 使用H2内存数据库
```

### 2. 配置MySQL连接信息

编辑 `Back/src/main/resources/application-prod.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/Chronos?useUnicode=true&characterEncoding=utf8mb4&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: root  # 修改为你的MySQL用户名
    password: your_password  # 修改为你的MySQL密码
```

### 3. 验证连接

启动后端应用，如果看到以下日志说明连接成功：

```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
```

## 三、数据库表说明

### users（用户表）
- `id`: 用户ID（主键，自增）
- `username`: 用户名（唯一）
- `password`: 密码
- `nickname`: 昵称
- `avatar`: 头像URL
- `phone`: 手机号（唯一）
- `wechat_openid`: 微信OpenID（唯一）
- `wechat_unionid`: 微信UnionID
- `login_type`: 登录类型（password/wechat）
- `create_time`: 创建时间
- `update_time`: 更新时间

### tasks（任务表）
- `id`: 任务ID（主键，自增）
- `user_id`: 用户ID（外键）
- `title`: 任务标题
- `description`: 任务描述
- `status`: 任务状态（pending/in_progress/completed/cancelled）
- `priority`: 优先级（1-4）
- `due_date`: 截止日期
- `create_time`: 创建时间
- `update_time`: 更新时间
- `completed_time`: 完成时间

### task_tags（任务标签表）
- `id`: 标签ID（主键，自增）
- `task_id`: 任务ID（外键）
- `tag`: 标签名称

### bills（账单表）
- `id`: 账单ID（主键，自增）
- `user_id`: 用户ID（外键）
- `type`: 账单类型（income/expense）
- `category`: 账单分类
- `amount`: 金额
- `description`: 描述
- `date`: 账单日期
- `create_time`: 创建时间
- `update_time`: 更新时间

### bill_tags（账单标签表）
- `id`: 标签ID（主键，自增）
- `bill_id`: 账单ID（外键）
- `tag`: 标签名称

## 四、常见问题

### 1. 连接失败：Access denied

检查用户名和密码是否正确。

### 2. 连接失败：Unknown database 'Chronos'

先创建数据库：
```sql
CREATE DATABASE IF NOT EXISTS `Chronos` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 时区问题

确保连接URL中包含 `serverTimezone=Asia/Shanghai`。

### 4. 字符编码问题

确保数据库和表都使用 `utf8mb4` 字符集。

## 五、开发环境 vs 生产环境

- **开发环境（dev）**: 使用H2内存数据库，无需配置，适合快速开发测试
- **生产环境（prod）**: 使用MySQL数据库，需要先创建数据库和表结构

切换方式：修改 `application.yml` 中的 `spring.profiles.active` 值。