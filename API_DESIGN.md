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

## 五、节假日查询API（天行API）

### 5.1 基础信息

- **接口地址**: `https://apis.tianapi.com/jiejiari/index`
- **支持协议**: http/https
- **请求方式**: GET/POST
- **返回格式**: UTF-8 JSON
- **API密钥**: 946b76bdb2c6424342e01207eba8372f（配置在 `Constants.TIANAPI_KEY`）

### 5.2 查询类型说明

接口支持多种查询方式，通过 `type` 参数控制：

- `type=0`: 批量查询（单日查询）
- `type=1`: 按年查询
- `type=2`: 按月查询
- `type=3`: 范围查询

### 5.3 请求参数

| 参数名 | 类型   | 必须 | 示例值         | 说明                                  |
| ------ | ------ | ---- | -------------- | ------------------------------------- |
| key    | string | 是   | API密钥        | API密钥                               |
| date   | string | 是   | 2024-01-01     | 查询日期或日期范围（根据type格式不同）|
| type   | int    | 是   | 0              | 查询类型：0批量、1按年、2按月、3范围  |
| mode   | int    | 否   | 0              | 查询模式，为1同时返回中外特殊节日信息 |

**日期格式说明**：
- `type=0`（批量/单日）: `YYYY-MM-DD`，如 `2024-01-01`
- `type=1`（按年）: `YYYY`，如 `2024`
- `type=2`（按月）: `YYYY-MM`，如 `2024-01`
- `type=3`（范围）: `YYYY-MM-DD,YYYY-MM-DD`，如 `2024-01-01,2024-01-31`

### 5.4 响应格式

#### 成功响应

```json
{
  "code": 200,
  "msg": "success",
  "result": {
    "date": "2024-01-01",
    "info": "节假日",
    "name": "元旦",
    "daycode": 1,
    "isnotwork": 1,
    "holiday": "1月1日",
    "weekday": 1,
    "cnweekday": "星期一",
    "enname": "New Year's Day",
    "tip": "1月1日放假，共1天",
    "rest": "",
    "wage": 3,
    "vacation": ["2024-01-01"],
    "remark": [],
    "lunarday": "十一月",
    "lunaryear": "癸卯",
    "lunarmonth": "十一月"
  }
}
```

#### 错误响应

```json
{
  "code": 150,
  "msg": "API可用次数不足"
}
```

### 5.5 返回参数说明

#### 公共参数

| 名称   | 类型   | 说明     |
| ------ | ------ | -------- |
| code   | int    | 状态码   |
| msg    | string | 错误信息 |
| result | object | 返回结果集 |

#### 应用参数（result对象中的字段）

| 名称       | 类型    | 示例值                                             | 说明                                                             |
| ---------- | ------- | -------------------------------------------------- | ---------------------------------------------------------------- |
| date       | string  | 2024-01-01                                         | 当前阳历日期                                                     |
| info       | string  | 节假日                                             | 文字提示：工作日、节假日、节日、双休日、调休日                   |
| name       | string  | 元旦                                               | 节假日名称（中文）                                               |
| daycode    | int     | 1                                                  | 日期类型：0工作日、1节假日、2双休日、3调休日（上班）             |
| isnotwork  | int     | 1                                                  | 是否需要上班：0为工作日、1为休息日                               |
| holiday    | string  | 1月1日                                             | 节日日期                                                         |
| weekday    | int     | 1                                                  | 星期（数字，1-7）                                                |
| cnweekday  | string  | 星期一                                             | 星期（中文）                                                     |
| enname     | string  | New Year's Day                                     | 节日名称（英文）                                                 |
| tip        | string  | 1月1日放假，共1天                                  | 放假提示                                                         |
| rest       | string  | 拼假建议                                           | 拼假建议                                                         |
| wage       | int     | 3                                                  | 薪资法定倍数/按年查询时为具体日期                                |
| vacation   | array   | ["2024-01-01"]                                     | 节假日数组                                                       |
| remark     | array   | ["2024-12-26","2024-01-08"]                        | 调休日数组                                                       |
| lunarday   | string  | 十一月                                             | 农历日                                                           |
| lunaryear  | string  | 癸卯                                               | 农历年                                                           |
| lunarmonth | string  | 十一月                                             | 农历月                                                           |
| start      | int     | 0                                                  | 假期起点计数（按年查询时）                                       |
| end        | int     | 6                                                  | 假期终点计数（按年查询时）                                       |
| now        | int     | 0                                                  | 假期当前计数（按年查询时）                                       |
| update     | boolean | true/false                                         | 是否更新法定节假日（按年查询专有字段）                           |

### 5.6 daycode 说明

`daycode` 是判断日期类型的关键字段：

- `0`: 工作日
- `1`: 节假日（法定节假日）
- `2`: 双休日
- `3`: 调休日（需要上班）

### 5.7 错误状态码

| 错误状态码 | 错误信息            | 解释帮助                                                                                          |
| ---------- | ------------------- | ------------------------------------------------------------------------------------------------- |
| 100        | 内部服务器错误      | 报此错误码请及时反馈或等待官方修复                                                                |
| 110        | 当前API已下线       | 接口已下线无法使用，可关注相关通知                                                                |
| 120        | API暂时维护中       | 接口暂时关闭维护中，请注意相关公告                                                                |
| 130        | API调用频率超限     | 超过每秒请求数上限，可在控制台-接口管理中查询                                                      |
| 140        | API没有调用权限     | 请检查是否自行在接口管理中停用或被禁用该接口                                                      |
| 150        | API可用次数不足     | 免费类接口套餐超限或计次类接口余额不足                                                            |
| 160        | 账号未申请该API     | 请先在接口文档页面申请该接口                                                                      |
| 170        | Referer请求来源受限 | 设置了Referer白名单，但来源Referer不在白名单内                                                    |
| 180        | IP请求来源受限      | 设置了IP白名单，但来源IP不在白名单内                                                              |
| 190        | 当前key不可用       | 通常为账号无效，此状态无法恢复                                                                    |
| 230        | key错误或为空       | 请检查apikey是否填写错误                                                                          |
| 240        | 缺少key参数         | 请检查是否传递了key参数或者编码格式是否符合要求                                                   |
| 250        | 数据返回为空        | 数据查询或转换失败，请检查输入值或注意中文编码问题                                                |
| 260        | 参数值不得为空      | 请检查关键参数是否传递了空值                                                                      |
| 270        | 参数值不符合要求    | 参数值不符合基本格式要求                                                                          |
| 280        | 缺少必要的参数      | 缺少必填的参数，请根据接口文档检查                                                                |
| 290        | 超过最大输入限制    | 参数值超过输入范围，请查看接口文档的说明                                                          |

### 5.8 接口配额说明

| 用户等级 | 免费接口数 | 每日调用量 | QPS  | 会员价格                       |
| -------- | ---------- | ---------- | ---- | ------------------------------ |
| 普通会员 | 10个       | 100次      | 5-10 | 免费                           |
| 高级会员 | 不限       | 1万次      | 20   | 20元/月、120元/年              |
| 黄金会员 | 不限       | 50万次     | 30   | 65元/月、390元/年              |
| 钻石会员 | 不限       | 不限次     | 60   | 1690元/年                      |

### 5.9 前端使用示例

```typescript
// 在 HolidayService 中使用
import { Constants } from '../common/Constants';

// 获取单日节假日
const date = new Date(2024, 0, 1); // 2024-01-01
const url = `${Constants.TIANAPI_HOLIDAY_URL}?key=${Constants.TIANAPI_KEY}&date=2024-01-01&type=0`;

// 获取月份节假日
const url = `${Constants.TIANAPI_HOLIDAY_URL}?key=${Constants.TIANAPI_KEY}&date=2024-01&type=2`;

// 获取范围节假日
const url = `${Constants.TIANAPI_HOLIDAY_URL}?key=${Constants.TIANAPI_KEY}&date=2024-01-01,2024-01-31&type=3`;
```

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
