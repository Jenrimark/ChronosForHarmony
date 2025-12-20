# Chronos 数据库配置说明

## 数据库信息

- **数据库名**: `Chronos`
- **字符集**: `utf8mb4`
- **排序规则**: `utf8mb4_unicode_ci`

## 快速开始

### 1. 创建数据库

使用MySQL客户端执行以下命令：

```sql
CREATE DATABASE IF NOT EXISTS `Chronos` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

或者直接执行 `schema.sql` 文件：

```bash
mysql -u root -p < src/main/resources/db/schema.sql
```

### 2. 配置数据库连接

#### 开发环境（H2内存数据库）

默认使用H2内存数据库，无需配置，直接运行即可。

#### 生产环境（MySQL）

修改 `application.yml` 中的 `spring.profiles.active` 为 `prod`，然后修改 `application-prod.yml` 中的数据库连接信息：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/Chronos?useUnicode=true&characterEncoding=utf8mb4&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: root
    password: your_password  # 修改为你的MySQL密码
```

### 3. 运行应用

```bash
mvn spring-boot:run
```

## 数据库表结构

### users（用户表）
- 存储用户基本信息
- 支持用户名密码登录和微信登录

### tasks（任务表）
- 存储任务信息
- 关联用户ID（user_id）

### task_tags（任务标签表）
- 存储任务的标签
- 多对多关系

### bills（账单表）
- 存储账单信息（收入/支出）
- 关联用户ID（user_id）

### bill_tags（账单标签表）
- 存储账单的标签
- 多对多关系

## 注意事项

1. **字符集**: 使用 `utf8mb4` 以支持emoji和特殊字符
2. **时区**: 数据库连接URL中包含 `serverTimezone=Asia/Shanghai`
3. **外键约束**: 任务和账单表都有关联用户的外键，删除用户时会级联删除相关数据
4. **索引**: 已为常用查询字段创建索引，提高查询性能

## 数据迁移

如果需要从H2迁移到MySQL：

1. 导出H2数据（如果使用文件数据库）
2. 执行 `schema.sql` 创建MySQL表结构
3. 导入数据到MySQL
4. 修改配置文件切换到MySQL
