# AGC配置文件下载帮助

如果找不到 `agconnect-services.json` 的下载位置，请按照以下步骤操作：

## 📍 方法一：从项目设置下载（标准方法）

### 步骤：

1. **登录 AGC 控制台**
   - 访问：https://developer.huawei.com/consumer/cn/service/josp/agc/index.html
   - 使用华为开发者账号登录

2. **进入项目**
   - 点击 **"我的项目"**
   - 选择你的项目（Chronos 或 辰序）

3. **进入项目设置**
   - 点击左侧菜单 **"项目设置"**（通常在底部）
   - 选择 **"常规"** 标签页

4. **找到应用部分**
   - 在页面中找到 **"应用"** 部分
   - 如果显示"暂无应用"，需要先创建应用（见下方）

5. **下载配置文件**
   - 点击应用名称右侧的 **"agconnect-services.json"** 链接
   - 或者点击 **"下载"** 按钮

---

## 📍 方法二：先创建应用（如果还没有应用）

如果"项目设置"中显示"暂无应用"，需要先创建应用：

1. **创建应用**
   - 在项目概览页面，点击 **"添加应用"** 或 **"创建应用"**
   - 填写应用信息：
     - **应用名称**：辰序 或 Chronos
     - **应用包名**：`com.wuhandong.chronos`（必须与 `app.json5` 中的 `bundleName` 一致）
     - **应用类型**：选择 **"应用"**
     - **平台**：选择 **"HarmonyOS"**

2. **创建完成后**
   - 回到 **"项目设置"** → **"常规"**
   - 现在应该能看到你的应用了
   - 点击 **"agconnect-services.json"** 下载

---

## 📍 方法三：使用DevEco Studio自动生成

如果AGC控制台找不到下载按钮，可以使用DevEco Studio：

1. **打开DevEco Studio**
2. **右键点击项目根目录**（`Chronos` 文件夹）
3. **选择菜单**：
   ```
   Tools → Huawei → AGC → Download agconnect-services.json
   ```
4. **输入信息**：
   - AGC项目ID（在项目设置中可以找到）
   - 应用包名：`com.wuhandong.chronos`
5. **点击下载**

---

## 📍 方法四：手动创建配置文件（临时方案）

如果以上方法都不行，可以手动创建配置文件：

1. **获取必要信息**
   - 登录AGC控制台
   - 在项目设置中找到：
     - **项目ID**（Project ID）
     - **应用ID**（App ID）
     - **API密钥**（API Key）

2. **创建文件**
   - 在 `Chronos/AppScope/resources/rawfile/` 目录下创建 `agconnect-services.json`
   - 内容模板：
   ```json
   {
     "agcgw": {
       "serverurl": "https://agconnect-drcn.agcstorage.link"
     },
     "client": {
       "app_id": "你的应用ID",
       "client_id": "你的客户端ID",
       "client_secret": "你的客户端密钥",
       "package_name": "com.wuhandong.chronos"
     },
     "service": {
       "clouddb": {
         "instance_name": "你的云数据库实例名"
       }
     }
   }
   ```

---

## ⚠️ 常见问题

### Q1: 找不到"项目设置"菜单
**A**: 确保你已经登录并选择了正确的项目。项目设置通常在左侧菜单的最底部。

### Q2: "应用"部分显示"暂无应用"
**A**: 需要先创建应用。参考"方法二"。

### Q3: 下载的文件内容为空
**A**: 可能是应用配置不完整。检查：
- 是否已开通云数据库服务
- 是否已创建存储区
- 应用包名是否正确

### Q4: 文件应该放在哪里？
**A**: 必须放在 `Chronos/AppScope/resources/rawfile/agconnect-services.json`

---

## ✅ 验证配置

下载完成后，检查：

1. **文件位置**：`Chronos/AppScope/resources/rawfile/agconnect-services.json`
2. **文件内容**：应该包含 `clouddb` 相关的配置
3. **文件格式**：JSON格式，可以正常打开

如果还有问题，可以：
- 截图AGC控制台的界面发给我
- 或者告诉我你当前在AGC控制台的哪个页面

