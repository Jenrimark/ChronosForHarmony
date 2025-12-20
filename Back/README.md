# 辰序 (Chronos) 后端服务

基于 Spring Boot 的后端 API 服务，为辰序应用提供 RESTful API 接口。

## 技术栈

- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **H2 Database** (开发环境)
- **MySQL** (生产环境)
- **JWT** (认证)
- **Lombok**
- **Maven**

## 项目结构

```
Back/
├── src/
│   ├── main/
│   │   ├── java/com/chronos/
│   │   │   ├── ChronosApplication.java      # 主启动类
│   │   │   ├── config/                      # 配置类
│   │   │   ├── controller/                  # 控制器层
│   │   │   ├── service/                     # 服务层
│   │   │   ├── repository/                  # 数据访问层
│   │   │   ├── entity/                      # 实体类
│   │   │   ├── common/                      # 通用类
│   │   │   └── exception/                   # 异常处理
│   │   └── resources/
│   │       └── application.yml              # 配置文件
│   └── test/
└── pom.xml
```

## 快速开始

### 环境要求

- JDK 17+
- Maven 3.6+

### 运行项目

1. 克隆项目到本地
2. 进入 `Back` 目录
3. 运行以下命令：

```bash
mvn spring-boot:run
```

或者使用 IDE 直接运行 `ChronosApplication.java`

### 访问接口

- API 基础路径: `http://localhost:8080/api`
- H2 控制台: `http://localhost:8080/api/h2-console`

## API 接口

详细的 API 接口文档请参考根目录下的 [API_DESIGN.md](../API_DESIGN.md)

### 主要接口

- **任务管理**: `/tasks`
- **账单管理**: `/bills`
- **AI服务**: `/ai`
- **用户认证**: `/auth`

## 配置说明

### application.yml

- `server.port`: 服务端口（默认 8080）
- `server.servlet.context-path`: 上下文路径（默认 `/api`）
- `spring.datasource`: 数据库配置
- `jwt.secret`: JWT 密钥
- `jwt.expiration`: JWT 过期时间（毫秒）

### 数据库配置

开发环境默认使用 H2 内存数据库，生产环境可以切换到 MySQL：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/chronos
    username: root
    password: your_password
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
```

## 开发说明

### 统一响应格式

所有 API 接口返回统一的响应格式：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}
}
```

### 异常处理

- `BusinessException`: 业务异常
- `GlobalExceptionHandler`: 全局异常处理器

### 数据模型

- **Task**: 任务实体
- **Bill**: 账单实体
- **User**: 用户实体

## 后续计划

- [ ] 完善 JWT 认证功能
- [ ] 添加数据验证
- [ ] 添加单元测试
- [ ] 添加 API 文档（Swagger）
- [ ] 添加日志记录
- [ ] 添加缓存支持
- [ ] 优化 AI 服务实现

## 许可证

本项目为个人学习项目。

