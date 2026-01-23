# 图标临时替代说明

## 问题

HarmonyOS 系统图标资源名称与预期不符，很多图标名称不存在。

## 临时解决方案

为了让项目能够编译通过，以下图标临时使用 `sys.symbol.circle` 替代：

### 临时替代的图标

| 图标类型 | 原计划使用 | 当前使用 | 说明 |
|---------|-----------|---------|------|
| STATISTICS | `chart_bar_xaxis` | `circle` | 统计图标 |
| SETTINGS | `gear_2` | `circle` | 设置图标 |
| EDIT | `pencil_line` | `circle` | 编辑图标 |
| FILTER | `line_3_horizontal` | `circle` | 筛选图标 |
| SORT | `arrow_up_down` | `circle` | 排序图标 |
| SALARY | `yensign_circle_fill` | `circle` | 工资图标 |
| INVESTMENT | `chart_bar_xaxis` | `circle` | 投资图标 |
| CHART | `chart_pie_simple` | `circle` | 图表图标 |

## 后续优化

### 方法 1：查找正确的系统图标名称

需要查阅 HarmonyOS 官方文档，找到实际可用的系统图标资源名称。

参考文档：
- HarmonyOS SymbolGlyph 组件文档
- 系统图标资源列表

### 方法 2：使用自定义 SVG 图标

如果系统图标不满足需求，可以：

1. 准备 SVG 图标文件
2. 放置在 `entry/src/main/resources/base/media/` 目录
3. 使用 `Image` 组件加载：

```typescript
Image($r('app.media.icon_settings'))
  .width(24)
  .height(24)
  .fillColor(Constants.COLOR_PRIMARY)
```

### 方法 3：使用 Unicode 字符

某些简单图标可以用 Unicode 字符替代：

```typescript
Text('⚙️')  // 设置
Text('📊')  // 图表
Text('✏️')  // 编辑
```

但这不推荐，因为：
- 在不同设备上显示不一致
- 无法精确控制颜色
- 不够专业

## 测试建议

编译成功后，运行应用查看效果：

1. 检查哪些页面使用了临时图标
2. 评估是否影响用户体验
3. 优先替换高频使用的图标

## 已确认可用的图标

以下图标已验证可用：

✅ `sys.symbol.calendar` - 日历
✅ `sys.symbol.checkmark_circle` - 勾选圆圈
✅ `sys.symbol.creditcard` - 信用卡
✅ `sys.symbol.plus_circle` - 加号圆圈
✅ `sys.symbol.trash` - 垃圾桶
✅ `sys.symbol.checkmark` - 勾选
✅ `sys.symbol.xmark` - 叉号
✅ `sys.symbol.chevron_left` - 左箭头
✅ `sys.symbol.chevron_right` - 右箭头
✅ `sys.symbol.checkmark_circle_fill` - 实心勾选圆圈
✅ `sys.symbol.exclamationmark_triangle` - 警告三角
✅ `sys.symbol.xmark_circle` - 叉号圆圈
✅ `sys.symbol.info_circle` - 信息圆圈
✅ `sys.symbol.magnifyingglass` - 放大镜
✅ `sys.symbol.arrow_clockwise` - 刷新箭头
✅ `sys.symbol.lock` - 锁
✅ `sys.symbol.lock_open` - 开锁
✅ `sys.symbol.fork_knife` - 刀叉
✅ `sys.symbol.car` - 汽车
✅ `sys.symbol.cart` - 购物车
✅ `sys.symbol.film` - 电影
✅ `sys.symbol.cross_case` - 医疗箱
✅ `sys.symbol.book` - 书本
✅ `sys.symbol.house` - 房子
✅ `sys.symbol.lightbulb` - 灯泡
✅ `sys.symbol.gift` - 礼物
✅ `sys.symbol.gift_fill` - 实心礼物
✅ `sys.symbol.ellipsis_circle` - 省略号圆圈
✅ `sys.symbol.mic` - 麦克风
✅ `sys.symbol.star` - 星星
✅ `sys.symbol.message` - 消息
✅ `sys.symbol.leaf` - 叶子
✅ `sys.symbol.circle` - 圆圈

## 当前状态

✅ 项目可以编译通过
⚠️ 部分图标显示为圆圈（临时方案）
🔄 需要后续优化图标资源

---

**优先级：** 中等
**影响范围：** 8 个图标
**建议时间：** 编译成功后，根据实际显示效果决定是否需要立即优化
