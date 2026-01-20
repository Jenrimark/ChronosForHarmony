# MIMO AI 记账服务使用说明

## 功能说明

已集成小米MIMO大模型API，实现智能账单识别功能。

## 配置步骤

### 1. 设置API Key

编辑 `Chronos/entry/src/main/ets/common/Constants.ets`，设置你的MIMO API Key：

```typescript
static readonly MIMO_API_KEY: string = 'your-api-key-here';
```

### 2. API接口信息

- **接口地址**: `https://api.xiaomimimo.com/v1/chat/completions`
- **请求头**:
  - `api-key`: 你的API Key
  - `Content-Type`: `application/json`

### 3. 使用方法

在记账页面：
1. **点击右下角加号** - 展开输入栏
2. **输入账单描述** - 如："午餐15元"、"工资5000元"
3. **点击发送** - AI会自动识别账单类型、分类和金额
4. **长按加号** - 进入录音模式（待实现）

## AI识别功能

MIMO AI会自动识别：
- **账单类型**: 收入(income) 或 支出(expense)
- **账单分类**: 餐饮、交通、购物、娱乐、医疗、教育、住房、水电等
- **金额**: 从文本中提取金额
- **描述**: 提取或保留原始描述

## 示例

输入文本示例：
- "午餐15元" → 支出-餐饮-15元
- "工资5000元" → 收入-工资-5000元
- "打车20块" → 支出-交通-20元
- "看电影50" → 支出-娱乐-50元

## 注意事项

1. 确保网络连接正常
2. API Key需要有效
3. 如果AI识别失败，会使用默认分类
4. 录音功能需要后续实现语音识别

## 错误处理

- 如果API调用失败，会在控制台输出错误信息
- 会返回默认的账单分类（支出-其他）
- 用户仍可以手动编辑账单信息
