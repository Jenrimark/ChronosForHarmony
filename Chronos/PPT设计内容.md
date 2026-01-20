# 辰序 (Chronos) 功能流程图 - PPT版本

本文档包含简化版流程图，适合PPT展示，突出核心功能和关键流程。

---

## 一、核心功能流程图

### 1.1 任务管理流程

```mermaid
flowchart TD
    A[用户操作] --> B{操作类型}
    B -->|创建| C[填写任务信息]
    B -->|编辑| D[修改任务信息]
    B -->|完成/删除| E[更新任务状态]
    
    C --> F[保存到本地数据库]
    D --> F
    E --> F
    
    F --> G[立即显示在界面]
    F --> H[后台同步到云端]
    
    H --> I{网络可用}
    I -->|是| J[同步成功]
    I -->|否| K[等待网络恢复]
    K --> H
    
    style F fill:#fff4e1
    style H fill:#e1f5ff
    style J fill:#e8f5e9
```

### 1.2 账单管理流程

```mermaid
flowchart TD
    A[用户记账] --> B{记账方式}
    B -->|智能记账| C[输入自然语言]
    B -->|手动记账| D[填写表单]
    
    C --> E[AI识别账单信息]
    E --> F{识别成功}
    F -->|是| G[自动填充表单]
    F -->|否| H[使用本地识别]
    H --> G
    
    D --> I[用户确认]
    G --> I
    
    I --> J[保存到本地数据库]
    J --> K[更新统计图表]
    J --> L[后台同步到云端]
    
    style E fill:#ffe1f5
    style J fill:#fff4e1
    style L fill:#e1f5ff
```

### 1.3 日程管理流程

```mermaid
flowchart TD
    A[用户创建日程] --> B{创建方式}
    B -->|智能创建| C[输入自然语言]
    B -->|手动创建| D[填写表单]
    
    C --> E[AI解析时间地点]
    E --> F[自动填充表单]
    
    D --> G[用户确认]
    F --> G
    
    G --> H[保存到本地数据库]
    H --> I[设置系统闹钟]
    I --> J[更新日历视图]
    H --> K[后台同步到云端]
    
    style E fill:#ffe1f5
    style H fill:#fff4e1
    style I fill:#e8f5e9
```

### 1.4 数据同步流程

```mermaid
flowchart TD
    A[用户操作数据] --> B[保存到本地数据库]
    B --> C[立即可用]
    B --> D[标记待同步]
    
    D --> E{网络可用}
    E -->|是| F[上传到云端]
    E -->|否| G[加入同步队列]
    
    F --> H{上传成功}
    H -->|是| I[同步完成]
    H -->|否| J[等待重试]
    J --> E
    
    G --> K[监听网络状态]
    K --> L{网络恢复}
    L -->|是| F
    L -->|否| K
    
    M[云端数据变更] --> N[下载到本地]
    N --> O[合并数据]
    O --> P[更新界面]
    
    style B fill:#fff4e1
    style F fill:#e1f5ff
    style I fill:#e8f5e9
```

---

## 二、AI功能流程图

### 2.1 智能账单识别流程

```mermaid
flowchart TD
    A[用户输入自然语言] --> B[AI提取金额和描述]
    B --> C[AI识别类型和分类]
    
    C --> D{API调用成功}
    D -->|是| E[返回识别结果]
    D -->|否| F[使用本地关键词匹配]
    F --> E
    
    E --> G[自动填充表单]
    G --> H[用户确认]
    H --> I[保存账单]
    
    style B fill:#ffe1f5
    style C fill:#ffe1f5
    style I fill:#e1f5ff
```

### 2.2 智能创建任务/日程流程

```mermaid
flowchart TD
    A[用户输入自然语言] --> B[解析时间信息]
    B --> C[解析地点信息]
    C --> D[提取标题]
    
    D --> E{包含时间}
    E -->|是| F[创建日程]
    E -->|否| G[创建任务]
    
    F --> H[保存到数据库]
    G --> H
    H --> I[设置系统闹钟]
    I --> J[更新界面]
    
    style B fill:#ffe1f5
    style C fill:#ffe1f5
    style H fill:#fff4e1
```

### 2.3 AI对话助手流程

```mermaid
flowchart TD
    A[进入对话页面] --> B[加载用户数据]
    B --> C[任务列表]
    B --> D[日程安排]
    B --> E[记账信息]
    
    C --> F[构建系统消息]
    D --> F
    E --> F
    
    F --> G[用户提问]
    G --> H[调用AI API]
    H --> I[流式输出回复]
    I --> J[实时显示]
    
    style F fill:#ffe1f5
    style H fill:#fff4e1
    style I fill:#e1f5ff
```

### 2.4 AI服务架构流程

```mermaid
flowchart TD
    A[用户触发AI功能] --> B{功能类型}
    B -->|账单识别| C[调用后端API]
    B -->|信息提取| C
    B -->|智能对话| D[调用MIMO API]
    B -->|创建任务/日程| E[本地解析]
    
    C --> F{API成功}
    F -->|是| G[返回结果]
    F -->|否| H[本地降级处理]
    H --> G
    
    D --> I[流式接收响应]
    I --> J[实时更新UI]
    
    E --> K[解析自然语言]
    K --> L[提取关键信息]
    L --> M[创建数据]
    
    style C fill:#ffe1f5
    style D fill:#ffe1f5
    style E fill:#ffe1f5
    style H fill:#fff4e1
```

---

## 三、数据流转流程

### 3.1 离线优先策略

```mermaid
flowchart LR
    A[用户操作] --> B[Service层处理]
    B --> C[本地数据库]
    C --> D[立即返回结果]
    D --> E[更新UI界面]
    
    C --> F[后台同步服务]
    F --> G{网络状态}
    G -->|可用| H[云端数据库]
    G -->|不可用| I[等待队列]
    I --> G
    
    H --> J[同步完成]
    
    style C fill:#fff4e1
    style H fill:#e8f5e9
    style F fill:#e1f5ff
```

### 3.2 数据生命周期

```mermaid
flowchart TD
    A[数据创建] --> B[本地存储]
    B --> C[立即可用]
    C --> D[用户操作]
    
    D --> E[后台同步]
    E --> F{网络可用}
    F -->|是| G[上传云端]
    F -->|否| H[等待同步]
    
    G --> I[同步完成]
    H --> J[网络恢复]
    J --> E
    
    K[云端变更] --> L[下载到本地]
    L --> M[合并数据]
    M --> D
    
    style B fill:#fff4e1
    style G fill:#e1f5ff
    style I fill:#e8f5e9
```

---

## 四、系统集成流程

### 4.1 系统闹钟集成

```mermaid
flowchart TD
    A[创建日程] --> B[设置提醒]
    B --> C[保存到数据库]
    C --> D[调用系统闹钟API]
    D --> E[设置闹钟成功]
    
    F[编辑日程] --> G{提醒变更}
    G -->|是| H[取消旧闹钟]
    H --> D
    G -->|否| I[更新完成]
    
    J[删除日程] --> K[取消系统闹钟]
    K --> L[删除完成]
    
    style C fill:#fff4e1
    style D fill:#e8f5e9
    style E fill:#e1f5ff
```

### 4.2 日历数据源切换

```mermaid
flowchart TD
    A[用户切换数据源] --> B{数据源类型}
    B -->|API数据| C[请求API数据]
    B -->|本地数据| D[使用本地JSON]
    
    C --> E[解析响应]
    E --> F[缓存到本地]
    F --> G[更新日历显示]
    
    D --> G
    
    H[日历加载] --> I{数据源类型}
    I -->|API| J[从缓存读取]
    I -->|本地| K[从JSON读取]
    J --> L[显示日历信息]
    K --> L
    
    style C fill:#ffe1f5
    style F fill:#fff4e1
    style L fill:#e8f5e9
```

---

## 流程图说明

### 核心特点

1. **离线优先**：所有操作优先保存本地，确保离线可用
2. **后台同步**：数据保存后自动同步，不阻塞用户操作
3. **AI降级**：API失败时自动使用本地识别，保证功能可用
4. **系统集成**：深度集成HarmonyOS系统功能

### 使用建议

- 每个流程图可单独用于PPT页面
- 建议配合文字说明使用
- 可根据需要选择展示的流程图
- 颜色标识：蓝色=服务层，黄色=数据库，绿色=成功状态，粉色=AI功能

---

**文档版本**：v2.0 - PPT简化版  
**最后更新**：2024年12月
