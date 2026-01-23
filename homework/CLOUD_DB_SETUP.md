# 华为云数据库（Cloud DB）配置指南

本文档将指导你完成华为云数据库的配置，实现"辰序"App的端云协同功能。

## 📋 前置要求

1. **华为开发者账号**：需要注册并实名认证
2. **AGC控制台访问权限**：登录 [AppGallery Connect](https://developer.huawei.com/consumer/cn/service/josp/agc/index.html)
3. **DevEco Studio**：已安装并配置好HarmonyOS开发环境

---

## 第一步：在AGC控制台创建项目

1. 登录 [AppGallery Connect控制台](https://developer.huawei.com/consumer/cn/service/josp/agc/index.html)
2. 点击 **"我的项目"** → **"创建项目"**
3. 填写项目信息：
   - **项目名称**：`Chronos` 或 `辰序`
   - **项目类型**：选择 **"应用"**
4. 点击 **"确定"** 完成创建

---

## 第二步：开通云数据库服务

1. 在项目概览页面，找到 **"构建"** 菜单
2. 点击 **"云数据库"** → **"立即开通"**
3. 阅读并同意服务协议，点击 **"开通"**

---

## 第三步：创建存储区（Data Zone）

1. 在云数据库页面，点击 **"存储区"** 标签
2. 点击 **"新建存储区"**
3. 填写存储区信息：
   - **存储区名称**：`ChronosZone`（**重要：必须与代码中的ZONE_NAME一致**）
   - **描述**：辰序应用数据存储区
4. 点击 **"确定"** 完成创建

---

## 第四步：创建对象类型（Object Type）

对象类型相当于数据库表结构。我们需要创建两个对象类型：`TaskCloudDB` 和 `BillCloudDB`。

### 4.1 创建 TaskCloudDB 对象类型

1. 在云数据库页面，点击 **"对象类型"** 标签
2. 点击 **"新建对象类型"**
3. 填写对象类型信息：
   - **对象类型名称**：`TaskCloudDB`（**必须与代码中的类名完全一致**）
   - **描述**：任务数据对象

4. **添加字段**（点击"添加字段"按钮）：

   | 字段名 | 类型 | 是否主键 | 是否可空 | 说明 |
   |--------|------|---------|---------|------|
   | id | String | ✅ 是 | ❌ 否 | 任务ID（主键） |
   | title | String | ❌ 否 | ❌ 否 | 任务标题 |
   | description | String | ❌ 否 | ✅ 是 | 任务描述 |
   | status | String | ❌ 否 | ❌ 否 | 任务状态（pending/in_progress/completed/cancelled） |
   | priority | Integer | ❌ 否 | ❌ 否 | 优先级（1-低, 2-中, 3-高） |
   | dueDate | String | ❌ 否 | ✅ 是 | 截止日期（ISO格式字符串） |
   | createTime | String | ❌ 否 | ❌ 否 | 创建时间（ISO格式字符串） |
   | updateTime | String | ❌ 否 | ❌ 否 | 更新时间（ISO格式字符串） |
   | completedTime | String | ❌ 否 | ✅ 是 | 完成时间（ISO格式字符串） |
   | tags | String | ❌ 否 | ❌ 否 | 标签（JSON字符串数组） |
   | userId | String | ❌ 否 | ❌ 否 | 用户ID（用于多用户隔离） |

5. 点击 **"确定"** 完成创建

### 4.2 创建 BillCloudDB 对象类型

重复上述步骤，创建 `BillCloudDB` 对象类型：

- **对象类型名称**：`BillCloudDB`

**字段列表**：

| 字段名 | 类型 | 是否主键 | 是否可空 | 说明 |
|--------|------|---------|---------|------|
| id | String | ✅ 是 | ❌ 否 | 账单ID（主键） |
| type | String | ❌ 否 | ❌ 否 | 账单类型（income/expense） |
| category | String | ❌ 否 | ❌ 否 | 账单分类 |
| amount | Double | ❌ 否 | ❌ 否 | 金额 |
| description | String | ❌ 否 | ✅ 是 | 描述 |
| date | String | ❌ 否 | ❌ 否 | 日期（ISO格式字符串） |
| createTime | String | ❌ 否 | ❌ 否 | 创建时间（ISO格式字符串） |
| updateTime | String | ❌ 否 | ❌ 否 | 更新时间（ISO格式字符串） |
| tags | String | ❌ 否 | ❌ 否 | 标签（JSON字符串数组） |
| userId | String | ❌ 否 | ❌ 否 | 用户ID（用于多用户隔离） |

---

## 第五步：配置索引（可选，但推荐）

索引可以优化查询性能。如果你看到索引配置界面，可以按以下方式配置：

### 5.1 TaskCloudDB 索引配置

**推荐创建以下索引**：

1. **按用户ID和状态查询索引**：
   - **索引名**：`idx_user_status`
   - **索引字段**：`userId`, `status`
   - **用途**：优化"获取某个用户特定状态的任务"查询

2. **按用户ID和日期查询索引**：
   - **索引名**：`idx_user_dueDate`
   - **索引字段**：`userId`, `dueDate`
   - **用途**：优化"获取某个用户指定日期范围的任务"查询

3. **按用户ID和创建时间查询索引**：
   - **索引名**：`idx_user_createTime`
   - **索引字段**：`userId`, `createTime`
   - **用途**：优化"获取某个用户所有任务（按创建时间排序）"查询

### 5.2 BillCloudDB 索引配置

**推荐创建以下索引**：

1. **按用户ID和类型查询索引**：
   - **索引名**：`idx_user_type`
   - **索引字段**：`userId`, `type`
   - **用途**：优化"获取某个用户的收入/支出账单"查询

2. **按用户ID和日期查询索引**：
   - **索引名**：`idx_user_date`
   - **索引字段**：`userId`, `date`
   - **用途**：优化"获取某个用户指定日期范围的账单"查询

**注意**：
- 如果当前界面显示"暂无数据"，你可以直接点击 **"下一步"** 或 **"完成"** 跳过索引配置
- 索引可以在后续需要时再添加，不影响基本功能使用
- 对于小数据量（<1000条记录），索引的影响不明显，可以暂时不配置

---

## 第六步：导出对象类型文件（Schema）

按照官方文档，需要导出两种格式的文件：

### 6.1 导出 JSON 格式（Schema文件）

1. 在对象类型列表页面，找到 `TaskCloudDB` 和 `BillCloudDB`
2. 分别点击 **"导出"** 按钮
3. 在导出对话框中：
   - **导出文件格式**：选择 **"json格式"**
   - **使用场景**：勾选 **"客户端"**
4. 点击 **"确定"** 按钮
5. 下载生成的 JSON 文件

**重要**：
- 将导出的 JSON 文件内容复制到 `Chronos/entry/src/main/ets/config/app-schema.json`
- 如果项目中没有 `config` 目录，请创建它
- 这个文件是 Cloud DB 必需的，用于定义对象类型结构

### 6.2 导出 JS 格式（对象类型类文件，可选）

1. 重复上述步骤，但这次选择 **"js格式"**
2. 下载生成的 `.js` 文件
3. 将文件放到 `Chronos/entry/src/main/ets/model/clouddb/` 目录下

**注意**：
- 如果你已经按照本项目的代码结构创建了对象类型类（`TaskCloudDB.ets` 和 `BillCloudDB.ets`），可以跳过这一步
- 但建议导出官方生成的文件作为参考，确保字段类型完全匹配

---

## 第七步：配置应用

### 7.1 初始化 AGC SDK（在 EntryAbility 中）

按照官方文档，AGC SDK 的初始化应该在 `EntryAbility` 的 `onCreate` 方法中完成。

**代码已经自动配置好了**，位于 `Chronos/entry/src/main/ets/entryability/EntryAbility.ets`。

初始化逻辑：
1. 读取 `agconnect-services.json` 文件
2. 解析 JSON 内容
3. 调用 `initialize()` 方法初始化 AGC SDK

### 7.2 下载 agconnect-services.json

**方法一：从项目设置下载（推荐）**

1. 在AGC控制台，点击左侧菜单 **"项目设置"**
2. 选择 **"常规"** 标签页
3. 在 **"应用"** 部分，找到你的应用（如果还没有创建应用，需要先创建应用）
4. 点击应用右侧的 **"agconnect-services.json"** 链接或 **"下载"** 按钮
5. 下载配置文件

**方法二：如果找不到下载按钮**

如果"项目设置"中没有看到下载按钮，可能是以下原因：

1. **还没有创建应用**：
   - 点击左侧菜单 **"我的项目"** → 选择你的项目
   - 点击 **"添加应用"** 或 **"创建应用"**
   - 填写应用信息（包名、应用名称等）
   - 创建完成后，再回到"项目设置" → "常规" → "应用"部分下载

2. **界面位置不同**：
   - 尝试在 **"项目设置"** → **"API管理"** 或 **"常规"** 中查找
   - 或者直接在项目概览页面查找 **"下载配置文件"** 按钮

3. **使用DevEco Studio自动生成**（如果上述方法都不行）：
   - 在DevEco Studio中，右键点击项目根目录
   - 选择 **"Tools"** → **"Huawei"** → **"AGC"** → **"Download agconnect-services.json"**
   - 输入你的AGC项目ID和应用包名

### 7.3 放置配置文件

1. 在DevEco Studio中，找到项目根目录：`Chronos/AppScope/resources/`
2. 如果不存在 `rawfile` 文件夹，请创建它：
   ```
   Chronos/AppScope/resources/rawfile/
   ```
3. 将下载的 `agconnect-services.json` 文件复制到 `rawfile` 目录下

**最终路径应该是**：
```
Chronos/AppScope/resources/rawfile/agconnect-services.json
```

**文件结构示例**：
```
Chronos/
├── AppScope/
│   └── resources/
│       └── rawfile/
│           └── agconnect-services.json  ← 放在这里
└── entry/
    └── ...
```

### 7.4 验证配置文件

`agconnect-services.json` 文件内容应该类似这样：
```json
{
  "agcgw": {
    "serverurl": "https://agconnect-drcn.agcstorage.link",
    ...
  },
  "client": {
    "app_id": "你的应用ID",
    ...
  },
  "service": {
    "analytics": {
      ...
    },
    "clouddb": {
      "instance_name": "你的云数据库实例名",
      ...
    }
  }
}
```

---

## 第八步：安装依赖

1. 打开 `Chronos/oh-package.json5` 文件
2. 确认已添加以下依赖：
   ```json5
   {
     "dependencies": {
       "@hw-agconnect/cloud-db": "^1.0.0",
       "@hw-agconnect/core": "^1.0.0"
     }
   }
   ```
3. 在DevEco Studio中，点击右上角的 **"Sync Now"** 同步依赖

---

## 第九步：验证配置

### 9.1 检查代码配置

确认以下文件中的配置是否正确：

1. **CloudDBService.ets**：
   - `ZONE_NAME = 'ChronosZone'` 必须与AGC控制台中的存储区名称一致

2. **对象类型类名**：
   - `TaskCloudDB.ets` 中的类名必须与AGC控制台中的对象类型名称一致
   - `BillCloudDB.ets` 中的类名必须与AGC控制台中的对象类型名称一致

### 9.2 运行测试

1. 连接HarmonyOS设备或启动模拟器
2. 运行应用
3. 查看日志，确认Cloud DB初始化成功：
   ```
   Cloud DB初始化成功
   ```

---

## ⚠️ 常见问题

### 问题1：Cloud DB初始化失败

**可能原因**：
- `agconnect-services.json` 文件未正确放置
- 存储区名称不匹配
- 对象类型名称不匹配

**解决方案**：
1. 检查 `agconnect-services.json` 文件路径是否正确
2. 确认存储区名称与代码中的 `ZONE_NAME` 一致
3. 确认对象类型名称与代码中的类名完全一致（区分大小写）

### 问题2：数据无法同步到云端

**可能原因**：
- 网络连接问题
- 用户未登录AGC账号

**解决方案**：
1. 检查设备网络连接
2. 确保设备已登录华为账号
3. 查看AGC控制台的数据统计，确认是否有数据写入

### 问题3：查询数据为空

**可能原因**：
- 对象类型字段类型不匹配
- 查询条件错误

**解决方案**：
1. 检查对象类型的字段类型是否与代码中的类型一致
2. 确认查询条件是否正确

---

## 📚 参考文档

- [华为云数据库官方文档](https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-Guides/agc-clouddb-get-started)
- [Cloud DB API参考](https://developer.huawei.com/consumer/cn/doc/development/AppGallery-connect-References/clouddb-ts-0000001054200433)

---

## ✅ 配置检查清单

- [ ] AGC项目已创建
- [ ] 云数据库服务已开通
- [ ] 存储区 `ChronosZone` 已创建
- [ ] 对象类型 `TaskCloudDB` 已创建，字段配置正确
- [ ] 对象类型 `BillCloudDB` 已创建，字段配置正确
- [ ] （可选）索引已配置（可跳过，后续需要时再添加）
- [ ] Schema 文件（JSON格式）已导出并放置到 `entry/src/main/ets/config/app-schema.json`
- [ ] `agconnect-services.json` 已下载并放置到正确位置
- [ ] AGC SDK 已在 EntryAbility 中正确初始化
- [ ] SDK依赖已添加到 `oh-package.json5`
- [ ] 代码中的存储区名称与AGC控制台一致
- [ ] 代码中的对象类型名称与AGC控制台一致
- [ ] 应用已成功运行，Cloud DB初始化成功

---

**配置完成后，你的应用就可以实现"没网存本地，有网自动同步到云端"的端云协同功能了！** 🎉

