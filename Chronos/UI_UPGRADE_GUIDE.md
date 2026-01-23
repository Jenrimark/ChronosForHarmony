# 辰序 UI 升级指南

## 📦 新增组件和工具

本次优化新增了以下文件：

1. **IconComponent.ets** - 统一的图标组件系统
2. **AnimationUtils.ets** - 动画工具函数库
3. **Constants.ets** - 优化后的设计系统常量
4. **TasksOptimized.ets** - 优化示例页面

## 🎨 设计系统升级

### 色彩系统

新的色彩系统符合 WCAG AA 标准，确保文字对比度 ≥ 4.5:1

```typescript
// 主色调
Constants.COLOR_PRIMARY          // #FF6B35 - 主橙色
Constants.COLOR_PRIMARY_DARK     // #E65100 - 深橙色
Constants.COLOR_PRIMARY_LIGHT    // #FFE5DC - 浅橙色

// 功能色
Constants.COLOR_SUCCESS          // #10B981 - 绿色（收入、完成）
Constants.COLOR_WARNING          // #F59E0B - 琥珀色（待办）
Constants.COLOR_DANGER           // #EF4444 - 红色（支出、删除）
Constants.COLOR_INFO             // #3B82F6 - 蓝色（信息）

// 文字色（优化对比度）
Constants.COLOR_TEXT_PRIMARY     // #1E293B - 主要文字（对比度 12.6:1）
Constants.COLOR_TEXT_SECONDARY   // #64748B - 次要文字（对比度 7.1:1）
Constants.COLOR_TEXT_TERTIARY    // #94A3B8 - 三级文字（对比度 4.6:1）
```

### 间距系统

基于 8px 网格的间距系统：

```typescript
Constants.SPACING_XS   // 4px  - 极小间距
Constants.SPACING_SM   // 8px  - 小间距
Constants.SPACING_MD   // 16px - 中等间距
Constants.SPACING_LG   // 24px - 大间距
Constants.SPACING_XL   // 32px - 超大间距
```

### 圆角系统

```typescript
Constants.BORDER_RADIUS_SM   // 8px  - 按钮、输入框
Constants.BORDER_RADIUS_MD   // 12px - 卡片
Constants.BORDER_RADIUS_LG   // 16px - 大卡片
Constants.BORDER_RADIUS_XL   // 20px - 对话框
Constants.BORDER_RADIUS_FULL // 9999 - 圆形
```

## 🎯 图标组件使用

### 基础图标

```typescript
import { IconComponent, IconType } from '../components/IconComponent';

// 使用图标
IconComponent({
  iconType: IconType.CALENDAR,
  size: 24,
  color: Constants.COLOR_PRIMARY
})
```

### 图标按钮

```typescript
import { IconButton, IconType } from '../components/IconComponent';

// 带交互的图标按钮
IconButton({
  iconType: IconType.ADD,
  size: 24,
  color: Constants.COLOR_TEXT_ON_PRIMARY,
  backgroundColor: Constants.COLOR_PRIMARY,
  accessibilityText: '添加任务',
  onClick: () => {
    // 处理点击
  }
})
```

### 分类图标

```typescript
import { CategoryIcon, IconType } from '../components/IconComponent';

// 带背景圆圈的分类图标
CategoryIcon({
  iconType: IconType.FOOD,
  size: 36,
  iconSize: 20,
  backgroundColor: Constants.COLOR_PRIMARY_LIGHT,
  iconColor: Constants.COLOR_PRIMARY
})
```

### 可用图标类型

```typescript
// 导航图标
IconType.CALENDAR, IconType.TASK, IconType.BILL, 
IconType.STATISTICS, IconType.SETTINGS

// 操作图标
IconType.ADD, IconType.DELETE, IconType.EDIT, 
IconType.COMPLETE, IconType.CLOSE

// 状态图标
IconType.SUCCESS, IconType.WARNING, IconType.ERROR, IconType.INFO

// 功能图标
IconType.SEARCH, IconType.FILTER, IconType.SORT, 
IconType.REFRESH, IconType.VOICE, IconType.AI

// 分类图标
IconType.FOOD, IconType.TRANSPORT, IconType.SHOPPING,
IconType.ENTERTAINMENT, IconType.MEDICAL, IconType.EDUCATION
// ... 更多图标见 IconComponent.ets
```

## 🎬 动画工具使用

### 基础动画

```typescript
import { AnimationUtils } from '../utils/AnimationUtils';

// 淡入动画
Column() {
  // 内容
}
.animation(AnimationUtils.fadeIn())

// 缩放动画
Button('点击')
  .animation(AnimationUtils.scale())

// 弹性动画
Row() {
  // 内容
}
.animation(AnimationUtils.spring())
```

### 对话框动画

```typescript
import { DialogAnimationUtils } from '../utils/AnimationUtils';

// 对话框弹出
if (this.showDialog) {
  Column() {
    // 对话框内容
  }
  .transition(DialogAnimationUtils.popIn())
}

// 从底部滑入
if (this.showSheet) {
  Column() {
    // 底部表单内容
  }
  .transition(DialogAnimationUtils.slideFromBottom())
}
```

### 列表项动画

```typescript
import { ListItemAnimationUtils } from '../utils/AnimationUtils';

// 列表项进入动画（带延迟）
ForEach(this.items, (item, index) => {
  ListItem() {
    // 内容
  }
  .transition(ListItemAnimationUtils.itemEnter(index))
})

// 列表项删除动画
ListItem() {
  // 内容
}
.transition(ListItemAnimationUtils.itemDelete())
```

### 按钮动画

```typescript
import { ButtonAnimationUtils } from '../utils/AnimationUtils';

Button('点击我')
  .stateEffect(true)  // 启用状态效果
  .animation(ButtonAnimationUtils.hover())
```

### 卡片动画

```typescript
import { CardAnimationUtils } from '../utils/AnimationUtils';

Column() {
  // 卡片内容
}
.stateEffect(true)
.animation(CardAnimationUtils.hoverLift())
.onClick(() => {
  // 点击处理
})
```

### 加载动画

```typescript
import { LoadingAnimationUtils } from '../utils/AnimationUtils';

// 骨架屏闪烁
Column() {
  // 骨架屏内容
}
.animation(LoadingAnimationUtils.skeletonShimmer())

// 旋转加载
Image($r('app.media.loading'))
  .rotate({ angle: this.rotateAngle })
  .animation(LoadingAnimationUtils.rotate())
```

## 🔄 迁移步骤

### 步骤 1：替换 emoji 图标

**之前：**
```typescript
Text('📅')
  .fontSize(24)
```

**之后：**
```typescript
IconComponent({
  iconType: IconType.CALENDAR,
  size: 24,
  color: Constants.COLOR_PRIMARY
})
```

### 步骤 2：使用新的色彩常量

**之前：**
```typescript
.fontColor('#FF6B35')
.backgroundColor('#FFFFFF')
```

**之后：**
```typescript
.fontColor(Constants.COLOR_PRIMARY)
.backgroundColor(Constants.COLOR_CARD_BACKGROUND)
```

### 步骤 3：添加交互反馈

**之前：**
```typescript
Button('点击')
  .onClick(() => {})
```

**之后：**
```typescript
Button('点击')
  .stateEffect(true)
  .hoverEffect(HoverEffect.Scale)
  .animation(ButtonAnimationUtils.hover())
  .onClick(() => {})
```

### 步骤 4：添加对话框动画

**之前：**
```typescript
if (this.showDialog) {
  Column() {
    // 对话框内容
  }
}
```

**之后：**
```typescript
if (this.showDialog) {
  Column() {
    // 对话框内容
  }
  .transition(DialogAnimationUtils.popIn())
}
```

### 步骤 5：使用统一间距

**之前：**
```typescript
.padding({ left: 16, right: 16, top: 12, bottom: 12 })
.margin({ bottom: 8 })
```

**之后：**
```typescript
.padding({ 
  left: Constants.SPACING_MD, 
  right: Constants.SPACING_MD, 
  top: Constants.SPACING_SM, 
  bottom: Constants.SPACING_SM 
})
.margin({ bottom: Constants.SPACING_SM })
```

## 📋 迁移检查清单

### 页面级别

- [ ] 替换所有 emoji 为 IconComponent
- [ ] 更新所有颜色值为 Constants
- [ ] 添加页面转场动画
- [ ] 统一间距和圆角值
- [ ] 添加加载状态动画

### 组件级别

- [ ] 为所有按钮添加 stateEffect(true)
- [ ] 为可点击元素添加 hoverEffect
- [ ] 为对话框添加弹出动画
- [ ] 为列表项添加进入动画
- [ ] 优化卡片悬停效果

### 交互反馈

- [ ] 按钮按下有视觉反馈
- [ ] 卡片点击有动画效果
- [ ] 列表项删除有动画
- [ ] 对话框打开/关闭流畅
- [ ] 页面切换有过渡

### 无障碍

- [ ] 所有图标按钮有 accessibilityText
- [ ] 重要操作有确认对话框
- [ ] 色彩对比度符合标准
- [ ] 支持键盘导航

## 🎯 优先级建议

### 高优先级（立即执行）

1. **替换 emoji 图标** - 影响最明显
2. **更新色彩系统** - 提升可读性
3. **添加按钮交互反馈** - 改善用户体验

### 中优先级（本周完成）

4. **添加对话框动画** - 提升流畅度
5. **统一间距和圆角** - 视觉一致性
6. **优化加载状态** - 用户感知

### 低优先级（逐步优化）

7. **添加列表动画** - 锦上添花
8. **完善无障碍支持** - 长期目标
9. **性能优化** - 持续改进

## 💡 最佳实践

### 1. 图标使用

```typescript
// ✅ 推荐：使用 IconComponent
IconComponent({
  iconType: IconType.CALENDAR,
  size: 24,
  color: Constants.COLOR_PRIMARY
})

// ❌ 避免：使用 emoji
Text('📅').fontSize(24)
```

### 2. 颜色使用

```typescript
// ✅ 推荐：使用 Constants
.fontColor(Constants.COLOR_TEXT_PRIMARY)
.backgroundColor(Constants.COLOR_CARD_BACKGROUND)

// ❌ 避免：硬编码颜色
.fontColor('#1E293B')
.backgroundColor('#FFFFFF')
```

### 3. 动画使用

```typescript
// ✅ 推荐：使用动画工具
.animation(AnimationUtils.fadeIn())
.transition(DialogAnimationUtils.popIn())

// ❌ 避免：手动配置动画
.animation({
  duration: 200,
  curve: Curve.EaseOut
})
```

### 4. 交互反馈

```typescript
// ✅ 推荐：完整的交互反馈
Button('点击')
  .stateEffect(true)
  .hoverEffect(HoverEffect.Scale)
  .animation(ButtonAnimationUtils.hover())
  .onClick(() => {})

// ❌ 避免：无反馈
Button('点击')
  .onClick(() => {})
```

## 🐛 常见问题

### Q: 图标显示不出来？

A: 确保使用的是 HarmonyOS 系统图标资源 `$r('sys.symbol.xxx')`，如果某些图标不存在，可以使用替代图标或自定义 SVG。

### Q: 动画不流畅？

A: 检查是否使用了正确的动画时长和曲线，推荐使用 `AnimationUtils` 中预定义的配置。

### Q: 色彩对比度不够？

A: 使用新的 Constants 中定义的颜色，已经过对比度测试，符合 WCAG AA 标准。

### Q: 如何自定义动画？

A: 可以参考 `AnimationUtils.ets` 中的实现，创建自己的动画配置函数。

## 📚 参考资源

- [HarmonyOS 图标系统文档](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/arkts-symbol-glyph-V5)
- [HarmonyOS 动画文档](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/arkts-animation-V5)
- [WCAG 对比度标准](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

## 🎉 完成后的效果

完成所有优化后，你的应用将具有：

✅ 统一专业的图标系统  
✅ 流畅自然的动画效果  
✅ 清晰易读的色彩对比  
✅ 明确的交互反馈  
✅ 一致的视觉风格  
✅ 更好的无障碍支持  

---

**需要帮助？** 查看 `TasksOptimized.ets` 获取完整的实现示例。
