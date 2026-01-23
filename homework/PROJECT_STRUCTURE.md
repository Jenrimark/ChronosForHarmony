# 辰序 (Chronos) 项目结构说明

## 项目概述

辰序是一个基于 HarmonyOS Next 的时间管理应用，采用前后端分离架构。前端使用 ArkTS 开发，采用 Stage 模型架构；后端待开发。

## 整体项目结构

```
Chronos/
├── Back/                    # 后端目录（待开发）
├── Chronos/                 # 前端目录（HarmonyOS应用）
│   ├── entry/
│   │   └── src/
│   │       └── main/
│   │           └── ets/    # 前端代码目录
│   └── ...
├── API_DESIGN.md            # 后端API接口设计文档
├── ERROR_SOLUTIONS.md       # 开发问题解决方案
├── PROJECT_STRUCTURE.md     # 项目结构说明（本文档）
└── README.md                # 项目说明文档
```

## 前端目录结构

```
Chronos/entry/src/main/ets/
├── common/              # 通用工具和常量
│   ├── Constants.ets   # 应用常量定义
│   ├── ApiClient.ets   # API客户端
│   └── Utils.ets       # 工具函数类
├── components/          # 可复用组件
│   ├── CalendarComponent.ets  # 日历组件
│   ├── TaskItem.ets           # 任务项组件
│   ├── BillItem.ets           # 账单项组件
│   └── StatisticsChart.ets    # 统计图表组件
├── model/               # 数据模型
│   ├── Task.ets        # 任务数据模型
│   └── Bill.ets        # 账单数据模型
├── service/             # 服务层
│   ├── DatabaseService.ets  # 数据库服务
│   ├── TaskService.ets      # 任务服务
│   ├── BillService.ets      # 账单服务
│   └── AIService.ets        # AI服务
└── pages/               # 页面
    ├── Main.ets         # 主页面（底部导航栏）
    ├── Calendar.ets     # 日历页面
    ├── Tasks.ets        # 任务页面
    ├── Statistics.ets   # 统计页面
    ├── Accounting.ets   # 记账页面
    └── Settings.ets     # 设置页面
```

## 后端目录结构

```
Back/                     # 后端目录（待开发）
└── (待补充)
```

## 功能模块

### 1. 通用模块 (common)

#### Constants.ets
- 应用常量定义
- 任务状态和优先级常量
- 颜色主题常量
- 页面路由常量
- API配置

#### ApiClient.ets
- HTTP请求封装
- 统一错误处理
- Token管理

#### Utils.ets
- 日期格式化工具
- 日期计算工具（周、月、年）
- 优先级和状态文本转换
- 日期比较工具

### 2. 数据模型 (model)

#### Task.ets
- 任务数据模型
- 包含任务的所有属性（标题、描述、状态、优先级、截止日期等）
- 提供 JSON 序列化/反序列化方法
- 提供任务状态判断方法（是否过期、是否今天到期等）

#### Bill.ets
- 账单数据模型
- 包含账单的所有属性（类型、分类、金额、描述、日期等）
- 提供 JSON 序列化/反序列化方法

### 3. 服务层 (service)

#### DatabaseService.ets
- 数据库操作服务（使用 relationalStore）
- 提供任务的 CRUD 操作
- 提供账单的 CRUD 操作
- 支持按状态、日期范围查询

#### TaskService.ets
- 任务业务逻辑服务
- 封装任务相关的业务操作
- 提供获取今日、本周、本月任务的方法

#### BillService.ets
- 账单业务逻辑服务
- 封装账单相关的业务操作
- 提供统计功能

#### AIService.ets
- AI服务封装
- 智能识别账单
- 提取账单信息

### 4. 组件 (components)

#### CalendarComponent.ets
- 日历显示组件
- 支持月份切换
- 显示任务数量标记
- 支持日期选择

#### TaskItem.ets
- 任务列表项组件
- 显示任务信息
- 支持完成任务、删除任务操作

#### BillItem.ets
- 账单列表项组件
- 显示账单信息
- 支持删除账单操作

#### StatisticsChart.ets
- 统计图表组件
- 支持状态统计、优先级统计、每日统计三种图表类型

### 5. 页面 (pages)

#### Main.ets
- 主页面，包含底部导航栏
- 管理5个主要页面的切换
- 在应用启动时初始化数据库

#### Calendar.ets
- 日历页面
- 显示日历组件
- 显示选中日期的任务列表

#### Tasks.ets
- 任务管理页面
- 支持按状态筛选任务
- 支持添加、完成、删除任务
- 包含添加任务对话框

#### Statistics.ets
- 统计页面
- 显示任务概览数据
- 显示完成率统计
- 显示各种统计图表

#### Accounting.ets
- 记账页面
- 支持添加收入和支出
- 支持AI智能识别
- 显示账单列表

#### Settings.ets
- 设置页面
- 应用信息显示
- 数据管理功能入口

## 数据库设计

### tasks 表结构

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INTEGER | 主键，自增 |
| title | TEXT | 任务标题 |
| description | TEXT | 任务描述 |
| status | TEXT | 任务状态（pending/in_progress/completed/cancelled） |
| priority | INTEGER | 优先级（1-4） |
| dueDate | TEXT | 截止日期（ISO格式） |
| createTime | TEXT | 创建时间（ISO格式） |
| updateTime | TEXT | 更新时间（ISO格式） |
| completedTime | TEXT | 完成时间（ISO格式） |
| tags | TEXT | 标签（JSON数组） |

### bills 表结构

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INTEGER | 主键，自增 |
| type | TEXT | 账单类型（income/expense） |
| category | TEXT | 账单分类 |
| amount | REAL | 金额 |
| description | TEXT | 描述 |
| date | TEXT | 日期（ISO格式） |
| createTime | TEXT | 创建时间（ISO格式） |
| updateTime | TEXT | 更新时间（ISO格式） |
| tags | TEXT | 标签（JSON数组） |

## 使用说明

### 启动应用
1. 应用启动时会自动初始化数据库
2. 主页面显示底部导航栏，包含5个标签页

### 添加任务
1. 进入"任务"页面
2. 点击右下角的"+"按钮
3. 在弹出的对话框中输入任务信息
4. 点击"确定"保存

### 管理任务
- **完成任务**：点击任务项左侧的复选框
- **删除任务**：点击任务项右侧的删除按钮
- **筛选任务**：使用顶部的筛选按钮

### 添加账单
1. 进入"记账"页面
2. 点击"+"按钮
3. 输入账单信息或使用AI智能识别
4. 点击"确定"保存

### 查看统计
1. 进入"统计"页面
2. 查看任务概览和完成率
3. 切换不同的图表类型查看详细统计

## 技术栈

### 前端
- **开发语言**：ArkTS
- **UI框架**：ArkUI
- **数据库**：relationalStore (RDB)
- **架构模式**：Stage 模型
- **设计模式**：单例模式（服务层）、MVC模式

### 后端
- **待开发**

## 后续扩展建议

1. **任务编辑功能**：添加任务详情/编辑页面
2. **任务提醒**：添加通知提醒功能
3. **数据备份**：实现数据导入导出功能
4. **主题切换**：支持深色模式
5. **任务分类**：添加标签和分类管理
6. **数据同步**：支持云端同步（后端开发完成后）
7. **后端开发**：实现RESTful API服务


