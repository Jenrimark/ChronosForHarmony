# 辰序 (Chronos)

一个基于 HarmonyOS Next 的时间管理和记账应用，采用前后端分离架构。

**得分**=**lo**g**(**全场最高票**+**1**)**log**(**你的票数**+**1**)×**100

sk-c98gx1dgjy6bpmu8ejq77l1zmvvied1f0fmtmgvie271iezj

## 项目概述

辰序是一个集成了任务管理和记账功能的时间管理应用，帮助用户更好地管理时间、追踪任务和记录收支。

### 主要功能

- ✅ **任务管理**：创建、编辑、完成任务，支持优先级和状态管理
- 📅 **日历视图**：在日历上查看任务分布，按日期筛选任务
- 📊 **统计分析**：任务完成率统计、优先级分布、时间趋势分析
- 💰 **记账功能**：记录收入和支出，支持分类管理
- 🤖 **AI智能识别**：自动识别账单类型和分类
- ⚙️ **设置管理**：应用配置和数据管理

## 项目结构

```
Chronos/
├── Back/                    # 后端目录（待开发）
├── Chronos/                  # 前端目录（HarmonyOS应用）
│   ├── entry/
│   │   └── src/
│   │       └── main/
│   │           └── ets/     # 前端代码目录
│   └── ...
├── API_DESIGN.md             # 后端API接口设计文档
├── ERROR_SOLUTIONS.md        # 开发问题解决方案
├── PROJECT_STRUCTURE.md      # 项目结构说明
└── README.md                 # 项目说明文档（本文档）
```

## 快速开始

### 前端开发

#### 环境要求

- **DevEco Studio (Next 版本)**
- **HarmonyOS Next SDK (API 11+)**
- **Node.js** (用于包管理)

#### 项目创建

1. 打开 **DevEco Studio**
2. 点击 **File > New > Create Project**
3. 选择 **Empty Ability** 模板
4. 配置项目信息：
   - **Project name**: `Chronos`
   - **Bundle name**: `com.wuhandong.chronos`
   - **Model**: `Stage`
   - **Language**: `ArkTS`
5. 点击 **Finish** 完成创建

#### 目录结构初始化

在 `entry/src/main/ets/` 目录下创建以下文件夹：

- `common` - 通用工具和常量
- `components` - 可复用组件
- `model` - 数据模型
- `service` - 服务层
- `pages` - 页面（默认已存在）

详细的项目结构说明请参考 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

#### 运行项目

1. 连接 HarmonyOS 设备或启动模拟器
2. 点击 **Run** 按钮或使用快捷键运行
3. 应用将自动安装并启动

### 后端开发

后端开发待启动，API接口设计请参考 [API_DESIGN.md](./API_DESIGN.md)

## 文档导航

- [项目结构说明](./PROJECT_STRUCTURE.md) - 详细的项目目录结构和模块说明
- [API接口设计](./API_DESIGN.md) - 前后端交互的API接口规范
- [开发问题解决方案](./ERROR_SOLUTIONS.md) - 开发过程中遇到的问题及解决方案

## 技术栈

### 前端

- **开发语言**: ArkTS
- **UI框架**: ArkUI
- **数据库**: relationalStore (RDB)
- **架构模式**: Stage 模型
- **设计模式**: 单例模式（服务层）、MVC模式

### 后端

- **待开发**

## 开发指南

### 代码规范

- 遵循 ArkTS 编码规范
- 使用 TypeScript 严格类型检查
- 组件命名使用 PascalCase
- 文件命名使用 PascalCase.ets

### Git 工作流

1. 初始化 Git 仓库（如果尚未初始化）
2. 创建功能分支进行开发
3. 完成功能后提交代码
4. 合并到主分支

### 常见问题

开发过程中遇到的问题及解决方案请参考 [ERROR_SOLUTIONS.md](./ERROR_SOLUTIONS.md)

## 后续计划

- [ ] 后端API服务开发
- [ ] 任务编辑功能完善
- [ ] 任务提醒功能
- [ ] 数据备份和恢复
- [ ] 深色模式支持
- [ ] 云端数据同步
- [ ] 更多统计图表

## 许可证

本项目为个人学习项目。

## 联系方式

如有问题或建议，欢迎反馈。

---

**最后更新**: 2024年12月
