# Implementation Plan: Calendar Enhancement

## Overview

本实现计划将日历模块从单一月视图升级为完整的多视图日历系统。采用增量开发方式，先完成数据层和服务层，再逐步实现各个视图组件。

## Tasks

- [x] 1. 创建日程数据模型和枚举类型
  - 创建 `CalendarEvent` 接口定义日程数据结构
  - 创建 `ReminderType` 和 `RepeatRule` 枚举
  - 创建 `CalendarViewType` 枚举
  - _Requirements: 6.2, 9.1, 10.1_

- [ ] 2. 实现数据持久化层
  - [x] 2.1 创建 EventRepository 类
    - 实现 RdbStore 初始化和表创建
    - 实现 insert, update, delete, query 方法
    - 实现 eventToRow 和 rowToEvent 序列化方法
    - _Requirements: 12.1, 12.3_
  
  - [ ]* 2.2 编写 EventRepository 属性测试
    - **Property 6: Event Persistence Round-Trip**
    - **Validates: Requirements 6.4, 12.1, 12.4**
  
  - [ ]* 2.3 编写 EventRepository 单元测试
    - 测试 CRUD 操作边界情况
    - _Requirements: 12.3_

- [ ] 3. 实现日程服务层
  - [x] 3.1 创建 EventService 类
    - 实现单例模式
    - 实现 createEvent, updateEvent, deleteEvent 方法
    - 实现 getEventsByDate, getEventsByDateRange 查询方法
    - 实现 searchEvents 搜索方法
    - _Requirements: 6.4, 7.3, 11.4_
  
  - [ ]* 3.2 编写 EventService 属性测试
    - **Property 8: Event Deletion Consistency**
    - **Property 11: CRUD Operation Consistency**
    - **Validates: Requirements 7.3, 12.3**

- [x] 4. Checkpoint - 数据层完成
  - 确保所有测试通过，ask the user if questions arise.

- [ ] 5. 实现智能解析器
  - [x] 5.1 创建 SmartParser 类
    - 实现日期提取（今天、明天、后天、周X、X月X日）
    - 实现时间提取（上午/下午X点、X:XX）
    - 实现标题提取
    - _Requirements: 8.2, 8.4_
  
  - [ ]* 5.2 编写 SmartParser 属性测试
    - **Property 9: Smart Parser Extraction**
    - **Validates: Requirements 8.2, 8.4**

- [x] 6. 实现视图切换组件
  - [x] 6.1 创建 ViewTabs 组件
    - 实现年/月/周/日四个标签页
    - 实现切换动画和状态管理
    - _Requirements: 1.1, 1.2_
  
  - [ ]* 6.2 编写视图切换属性测试
    - **Property 1: View Switch Preserves Selected Date**
    - **Validates: Requirements 1.3**

- [x] 7. 增强月视图
  - [x] 7.1 重构 DateCell 组件
    - 提取为独立可复用组件
    - 实现显示优先级逻辑（节日>节气>农历）
    - 添加事件指示器
    - _Requirements: 3.2, 3.3, 3.4_
  
  - [ ]* 7.2 编写 DateCell 属性测试
    - **Property 3: Date Cell Display Priority**
    - **Property 4: Event Indicator Consistency**
    - **Validates: Requirements 3.3, 3.4**
  
  - [x] 7.3 优化月视图网格计算
    - 实现动态行数计算（5或6行）
    - _Requirements: 3.1_
  
  - [ ]* 7.4 编写网格计算属性测试
    - **Property 2: Month Grid Row Calculation**
    - **Validates: Requirements 3.1**

- [x] 8. Checkpoint - 月视图增强完成
  - 确保所有测试通过，ask the user if questions arise.

- [x] 9. 实现年视图
  - [x] 9.1 创建 YearView 组件
    - 实现 3x4 网格布局展示12个月
    - 实现迷你月历显示
    - 实现当前月高亮
    - 实现点击月份跳转
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 10. 实现周视图
  - [x] 10.1 创建 TimelineRow 组件
    - 实现时间刻度显示
    - 实现当前时间红线
    - _Requirements: 4.2, 4.3_
  
  - [x] 10.2 创建 EventBlock 组件
    - 实现事件块渲染
    - 实现时间位置计算
    - _Requirements: 4.4_
  
  - [x] 10.3 创建 WeekView 组件
    - 实现7天横向布局
    - 实现时间轴纵向滚动
    - 集成 TimelineRow 和 EventBlock
    - _Requirements: 4.1, 4.5_
  
  - [ ]* 10.4 编写事件渲染属性测试
    - **Property 5: Event Time Slot Rendering**
    - **Validates: Requirements 4.4, 5.4**

- [x] 11. 实现日视图
  - [x] 11.1 创建 DayView 组件
    - 实现单日时间轴布局
    - 显示完整日期信息（公历、农历、节气、生肖）
    - 集成 TimelineRow 和 EventBlock
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 12. Checkpoint - 四视图完成
  - 确保所有测试通过，ask the user if questions arise.

- [x] 13. 实现日程创建弹窗
  - [x] 13.1 创建 EventSheet 组件
    - 实现半模态弹窗（bindSheet）
    - 实现所有输入字段
    - 实现全天开关逻辑
    - 实现表单验证
    - _Requirements: 6.1, 6.2, 6.3, 6.6_
  
  - [ ]* 13.2 编写表单验证属性测试
    - **Property 7: Empty Title Validation**
    - **Validates: Requirements 6.6**
  
  - [x] 13.3 集成智能输入
    - 添加智能输入栏
    - 集成 SmartParser
    - 实现自动填充
    - _Requirements: 8.1, 8.3_

- [x] 14. 实现日程编辑和删除
  - [x] 14.1 扩展 EventSheet 支持编辑模式
    - 实现数据预填充
    - 添加编辑和删除按钮
    - 实现删除确认
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 15. 实现重复日程
  - [x] 15.1 实现重复规则处理
    - 实现重复事件实例生成
    - 实现重复事件查询
    - _Requirements: 10.2, 10.3_
  
  - [ ]* 15.2 编写重复事件属性测试
    - **Property 10: Recurring Event Instance Generation**
    - **Validates: Requirements 10.2, 10.3**
  
  - [ ] 15.3 实现重复事件编辑选项
    - 添加"编辑单个/全部"选择
    - _Requirements: 10.4_

- [x] 16. 实现快捷菜单
  - [x] 16.1 创建菜单组件
    - 实现菜单按钮和弹出层
    - 实现跳转日期功能
    - 实现搜索日程功能
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [x] 17. 集成主日历页面
  - [x] 17.1 重构 Calendar.ets
    - 集成 ViewTabs 组件
    - 集成四种视图切换
    - 集成 EventSheet
    - 添加新建日程按钮
    - _Requirements: 1.1, 1.4, 1.5_

- [x] 18. Final Checkpoint - 功能完成
  - 确保所有测试通过，ask the user if questions arise.

- [x] 19. 修复视图布局问题
  - [x] 19.1 修复年视图布局
    - 添加 Scroll 组件支持上下滑动
    - 减少月份网格之间的上下间距
    - 确保10、11、12月完全可见
    - 底部添加 padding 为导航栏留出空间
    - _Requirements: 2.5, 2.6, 2.7_
  
  - [x] 19.2 修复周视图底部间距
    - 底部添加 padding 为导航栏留出空间
    - _Requirements: 4.6_
  
  - [x] 19.3 修复日视图底部间距
    - 底部添加 padding 为导航栏留出空间
    - _Requirements: 5.6_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- 使用 ArkTS 语法，避免不支持的特性（如解构赋值、内联对象类型）
