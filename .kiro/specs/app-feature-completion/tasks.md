# Implementation Plan: App Feature Completion

## Overview

本实现计划将分阶段完成 Chronos 应用的功能补全，按照任务模块、记账模块、日历模块的顺序进行实现。每个模块完成后进行检查点验证。

## Tasks

- [x] 1. 修复任务模块交互功能
  - [x] 1.1 重构 TaskItem 组件使用回调函数
    - 将 @Link 状态变量改为回调函数 props
    - 实现 onComplete、onDelete、onTap 回调
    - 确保点击区域正确响应
    - _Requirements: 2.1, 2.2, 4.1_

  - [x] 1.2 更新 Tasks 页面使用新的 TaskItem 接口
    - 移除 aboutToUpdate 中的 ID 检测逻辑
    - 直接在回调中处理任务操作
    - 添加错误处理和用户提示
    - _Requirements: 2.3, 4.2, 4.3_

  - [ ]* 1.3 编写任务完成切换的属性测试
    - **Property 1: Task Completion Toggle**
    - **Validates: Requirements 2.1, 2.2, 2.3**

- [x] 2. 实现任务详情功能
  - [x] 2.1 创建 TaskDetailSheet 组件
    - 显示任务标题、描述、截止日期、优先级、状态
    - 提供编辑、删除、完成/取消完成按钮
    - 实现弹窗打开和关闭逻辑
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 2.2 集成 TaskDetailSheet 到 Tasks 页面
    - 在 onTap 回调中打开详情弹窗
    - 处理详情页的编辑和删除操作
    - _Requirements: 3.1_

  - [ ]* 2.3 编写任务删除的属性测试
    - **Property 2: Task Deletion Removes from Storage**
    - **Validates: Requirements 4.2, 4.3**

- [x] 3. 完善任务统计和筛选功能
  - [x] 3.1 验证并修复任务统计显示
    - 确保 getCompletedCount 和 getPendingCount 正确计算
    - 确保统计卡片实时更新
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 3.2 验证并修复任务筛选功能
    - 确保 onFilterChange 正确调用 loadTasks
    - 验证各筛选状态返回正确的任务列表
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 3.3 编写任务统计准确性的属性测试
    - **Property 3: Task Statistics Accuracy**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**

  - [ ]* 3.4 编写任务筛选正确性的属性测试
    - **Property 4: Task Filter Correctness**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

- [x] 4. Checkpoint - 任务模块验证
  - 确保所有任务相关测试通过
  - 验证任务完成、删除、详情查看功能正常
  - 如有问题请询问用户

- [x] 5. 实现手动记账功能
  - [x] 5.1 创建 ManualBillSheet 组件
    - 实现支出/收入类型切换
    - 实现分类选择网格（9个支出分类 + 5个收入分类）
    - 实现金额输入和备注输入
    - 实现保存逻辑
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 5.2 集成 ManualBillSheet 到 Accounting 页面
    - 添加手动记账入口按钮
    - 处理保存后的数据刷新
    - 更新统计显示
    - _Requirements: 7.5_

  - [ ]* 5.3 编写账单创建的属性测试
    - **Property 7: Bill Creation with Category**
    - **Validates: Requirements 7.4, 7.5**

- [x] 6. 完善记账分类和视图功能
  - [x] 6.1 优化账单列表分类显示
    - 确保每个账单显示正确的分类图标和名称
    - 验证 getCategoryIcon 和 getCategoryName 方法
    - _Requirements: 8.1, 8.2_

  - [x] 6.2 实现账单按日期分组显示
    - 验证 groupBillsByDate 方法正确分组
    - 确保按日期倒序排列
    - _Requirements: 9.4_

  - [x] 6.3 验证月度统计计算
    - 确保 monthIncome、monthExpense、monthBalance 正确计算
    - 验证统计数据实时更新
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ]* 6.4 编写账单分类显示的属性测试
    - **Property 8: Bill Category Display**
    - **Validates: Requirements 8.2**

  - [ ]* 6.5 编写账单日期分组的属性测试
    - **Property 9: Bill Date Grouping**
    - **Validates: Requirements 9.4**

  - [ ]* 6.6 编写月度统计计算的属性测试
    - **Property 10: Monthly Statistics Calculation**
    - **Validates: Requirements 9.2**

- [x] 7. Checkpoint - 记账模块验证
  - 确保所有记账相关测试通过
  - 验证手动记账、分类显示、统计功能正常
  - 如有问题请询问用户

- [x] 8. 完善日历日程功能
  - [x] 8.1 添加日程创建悬浮按钮
    - 在 CalendarNewPage 添加右下角悬浮按钮
    - 点击打开 EventSheet 创建新日程
    - _Requirements: 1.1_

  - [x] 8.2 验证日程保存功能
    - 确保 EventSheet 的 saveEvent 正确调用 EventService
    - 验证日程保存后日历视图更新
    - _Requirements: 1.2, 1.3_

  - [x] 8.3 验证智能输入解析
    - 测试 SmartParser 解析自然语言输入
    - 确保解析结果正确填充表单字段
    - _Requirements: 1.4_

  - [x] 8.4 添加表单验证
    - 确保空标题时阻止保存
    - 显示验证错误提示
    - _Requirements: 1.5_

  - [ ]* 8.5 编写日程创建持久化的属性测试
    - **Property 5: Event Creation Persistence**
    - **Validates: Requirements 1.2, 1.5**

  - [ ]* 8.6 编写日程计数更新的属性测试
    - **Property 6: Event Count Update**
    - **Validates: Requirements 1.3**

- [x] 9. 验证日历视图切换功能
  - [x] 9.1 验证年视图功能
    - 确保 YearView 正确显示12个月
    - 验证点击月份切换到月视图
    - _Requirements: 10.1_

  - [x] 9.2 验证月视图功能
    - 确保月视图正确显示日期网格
    - 验证日期选择和事件指示器
    - _Requirements: 10.2_

  - [x] 9.3 验证周视图功能
    - 确保 WeekView 正确显示7天
    - 验证事件在时间轴上正确显示
    - _Requirements: 10.3_

  - [x] 9.4 验证日视图功能
    - 确保 DayView 正确显示24小时时间轴
    - 验证事件在对应时间段显示
    - _Requirements: 10.4_

  - [x] 9.5 验证视图切换保持日期上下文
    - 切换视图后选中日期不变
    - _Requirements: 10.5_

  - [ ]* 9.6 编写视图切换保持日期的属性测试
    - **Property 11: View Switch Preserves Date**
    - **Validates: Requirements 10.5**

- [x] 10. Final Checkpoint - 全部功能验证
  - 确保所有测试通过
  - 验证三个模块功能完整可用
  - 如有问题请询问用户

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- 实现语言：HarmonyOS ArkTS
- 测试框架：@ohos/hypium
