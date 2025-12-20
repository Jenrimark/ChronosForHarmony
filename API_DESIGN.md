# 辰序 (Chronos) 后端API接口设计文档

本文档定义了前端与后端交互的API接口规范。

## 基础信息

- **Base URL**: `http://your-backend-url/api` (需要根据实际后端地址配置)
- **认证方式**: Bearer Token (JWT)
- **请求格式**: JSON
- **响应格式**: JSON

## 统一响应格式

```json
{
  "code": 200,        // 状态码，200表示成功
  "message": "操作成功",
  "data": {}         // 响应数据
}
```

## 错误码说明

- `200` / `0`: 成功
- `400`: 请求参数错误
- `401`: 未授权（需要登录）
- `403`: 无权限
- `404`: 资源不存在
- `500`: 服务器内部错误

---

## 一、任务管理API

### 1.1 获取所有任务
- **URL**: `/tasks`
- **Method**: `GET`
- **参数**: 
  - `status` (可选): 任务状态筛选 (pending/in_progress/completed/cancelled)
  - `date` (可选): 日期筛选 (YYYY-MM-DD)
  - `startDate` (可选): 开始日期 (YYYY-MM-DD)
  - `endDate` (可选): 结束日期 (YYYY-MM-DD)
- **响应**:
```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "title": "任务标题",
      "description": "任务描述",
      "status": "pending",
      "priority": 2,
      "dueDate": "2024-12-20T10:00:00Z",
      "createTime": "2024-12-19T10:00:00Z",
      "updateTime": "2024-12-19T10:00:00Z",
      "completedTime": null,
      "tags": ["标签1", "标签2"]
    }
  ]
}
```

### 1.2 获取单个任务
- **URL**: `/tasks/{id}`
- **Method**: `GET`
- **响应**: 同1.1中的单个任务对象

### 1.3 创建任务
- **URL**: `/tasks`
- **Method**: `POST`
- **请求体**:
```json
{
  "title": "任务标题",
  "description": "任务描述",
  "status": "pending",
  "priority": 2,
  "dueDate": "2024-12-20T10:00:00Z",
  "tags": ["标签1"]
}
```
- **响应**: 创建的任务对象

### 1.4 更新任务
- **URL**: `/tasks/{id}`
- **Method**: `PUT`
- **请求体**: 同1.3（所有字段可选）
- **响应**: 更新后的任务对象

### 1.5 删除任务
- **URL**: `/tasks/{id}`
- **Method**: `DELETE`
- **响应**:
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

### 1.6 完成任务
- **URL**: `/tasks/{id}/complete`
- **Method**: `POST`
- **响应**: 更新后的任务对象

### 1.7 取消完成任务
- **URL**: `/tasks/{id}/uncomplete`
- **Method**: `POST`
- **响应**: 更新后的任务对象

---

## 二、账单管理API

### 2.1 获取所有账单
- **URL**: `/bills`
- **Method**: `GET`
- **参数**:
  - `type` (可选): 账单类型 (income/expense)
  - `category` (可选): 账单分类
  - `date` (可选): 日期筛选 (YYYY-MM-DD)
  - `startDate` (可选): 开始日期 (YYYY-MM-DD)
  - `endDate` (可选): 结束日期 (YYYY-MM-DD)
- **响应**:
```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "type": "expense",
      "category": "food",
      "amount": 45.50,
      "description": "午餐 - 麻辣烫",
      "date": "2024-12-19T12:00:00Z",
      "createTime": "2024-12-19T12:00:00Z",
      "updateTime": "2024-12-19T12:00:00Z",
      "tags": ["午餐", "餐饮"]
    }
  ]
}
```

### 2.2 获取单个账单
- **URL**: `/bills/{id}`
- **Method**: `GET`
- **响应**: 同2.1中的单个账单对象

### 2.3 创建账单
- **URL**: `/bills`
- **Method**: `POST`
- **请求体**:
```json
{
  "type": "expense",
  "category": "food",
  "amount": 45.50,
  "description": "午餐 - 麻辣烫",
  "date": "2024-12-19T12:00:00Z",
  "tags": ["午餐"]
}
```
- **响应**: 创建的账单对象

### 2.4 更新账单
- **URL**: `/bills/{id}`
- **Method**: `PUT`
- **请求体**: 同2.3（所有字段可选）
- **响应**: 更新后的账单对象

### 2.5 删除账单
- **URL**: `/bills/{id}`
- **Method**: `DELETE`
- **响应**:
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

### 2.6 获取统计信息
- **URL**: `/bills/statistics`
- **Method**: `GET`
- **参数**:
  - `type` (可选): 统计类型 (today/week/month/year)
  - `startDate` (可选): 开始日期
  - `endDate` (可选): 结束日期
- **响应**:
```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "totalIncome": 8000.00,
    "totalExpense": 500.50,
    "netIncome": 7499.50,
    "incomeCount": 1,
    "expenseCount": 5
  }
}
```

---

## 三、AI服务API

### 3.1 智能识别账单
- **URL**: `/ai/recognize-bill`
- **Method**: `POST`
- **请求体**:
```json
{
  "description": "午餐麻辣烫45.5元",
  "amount": 45.5
}
```
- **响应**:
```json
{
  "code": 200,
  "message": "识别成功",
  "data": {
    "type": "expense",
    "category": "food",
    "amount": 45.5,
    "description": "午餐麻辣烫"
  }
}
```

### 3.2 提取账单信息
- **URL**: `/ai/extract-bill-info`
- **Method**: `POST`
- **请求体**:
```json
{
  "text": "午餐麻辣烫45.5元"
}
```
- **响应**:
```json
{
  "code": 200,
  "message": "提取成功",
  "data": {
    "amount": 45.5,
    "description": "午餐麻辣烫"
  }
}
```

---

## 四、用户认证API（如果需要）

### 4.1 登录
- **URL**: `/auth/login`
- **Method**: `POST`
- **请求体**:
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```
- **响应**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "user@example.com",
      "nickname": "用户昵称"
    }
  }
}
```

### 4.2 注册
- **URL**: `/auth/register`
- **Method**: `POST`
- **请求体**:
```json
{
  "username": "user@example.com",
  "password": "password123",
  "nickname": "用户昵称"
}
```
- **响应**: 同4.1

### 4.3 刷新Token
- **URL**: `/auth/refresh`
- **Method**: `POST`
- **响应**: 同4.1

---

## 日期时间格式

所有日期时间字段使用 ISO 8601 格式：
- 格式: `YYYY-MM-DDTHH:mm:ssZ`
- 示例: `2024-12-19T10:00:00Z`

---

## 注意事项

1. 所有需要认证的接口都需要在请求头中携带 `Authorization: Bearer {token}`
2. 如果token过期，后端应返回401状态码，前端需要重新登录
3. 日期参数可以使用相对日期，如 `today`, `week`, `month`
4. 分页参数（如果需要）: `page`, `pageSize`
5. 排序参数（如果需要）: `sortBy`, `sortOrder` (asc/desc)

---

## 前端配置

在 `Constants.ets` 中配置后端地址：

```typescript
static readonly API_BASE_URL: string = 'http://your-backend-url/api';
```

在应用启动时初始化：

```typescript
ApiClient.getInstance().setBaseUrl(Constants.API_BASE_URL);
```


