# Design Document: App Feature Completion

## Overview

本设计文档描述了 Chronos 应用中多个未完成功能的技术实现方案。主要涉及三个模块：
1. **日历模块** - 日程创建和视图切换
2. **任务模块** - 完成按钮、详情查看、删除和统计
3. **记账模块** - 手动记账、分类管理和视图功能

技术栈：HarmonyOS ArkTS，使用本地 SQLite 存储 + CloudDB 云同步。

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Layer                              │
├─────────────┬─────────────┬─────────────┬──────────────────┤
│ CalendarNew │   Tasks     │ Accounting  │   Components     │
│   Page      │   Page      │   Page      │  (TaskItem,      │
│             │             │             │   BillItem, etc) │
├─────────────┴─────────────┴─────────────┴──────────────────┤
│                      Service Layer                          │
├─────────────┬─────────────┬─────────────┬──────────────────┤
│ EventService│ TaskService │ BillService │  HolidayService  │
├─────────────┴─────────────┴─────────────┴──────────────────┤
│                    Repository Layer                         │
├─────────────┬─────────────┬─────────────────────────────────┤
│EventRepository│LocalDBService│     CloudDBService           │
├─────────────┴─────────────┴─────────────────────────────────┤
│                     Storage Layer                           │
├─────────────────────────────┬───────────────────────────────┤
│      Local SQLite           │        Huawei CloudDB         │
└─────────────────────────────┴───────────────────────────────┘
```

## Components and Interfaces

### 1. TaskItem 组件改进

当前问题：点击事件通过 `@Link` 传递 ID，但父组件的 `aboutToUpdate` 处理逻辑存在问题。

改进方案：使用回调函数直接处理事件。

```typescript
// TaskItem.ets - 改进后的接口
@Component
export struct TaskItem {
  @Prop task: Task = new Task();
  onComplete: (task: Task) => void = () => {};
  onDelete: (task: Task) => void = () => {};
  onTap: (task: Task) => void = () => {};
  
  build() {
    Row() {
      // 完成按钮 - 直接调用回调
      Column() {
        // 根据状态显示不同样式
      }
      .onClick(() => {
        this.onComplete(this.task);
      })
      
      // 任务内容区域
      Column() {
        // 标题、描述等
      }
      .onClick(() => {
        this.onTap(this.task);
      })
      
      // 删除按钮
      Column() {
        Text('×')
      }
      .onClick(() => {
        this.onDelete(this.task);
      })
    }
  }
}
```

### 2. TaskDetailSheet 组件（新增）

```typescript
// TaskDetailSheet.ets - 任务详情弹窗
@Component
export struct TaskDetailSheet {
  @Link isShow: boolean;
  @Prop task: Task;
  onEdit: (task: Task) => void = () => {};
  onDelete: (task: Task) => void = () => {};
  onComplete: (task: Task) => void = () => {};
  
  build() {
    Column() {
      // 标题
      Text(this.task.title)
      
      // 描述
      if (this.task.description) {
        Text(this.task.description)
      }
      
      // 截止日期
      if (this.task.dueDate) {
        Row() {
          Text('截止日期')
          Text(formatDate(this.task.dueDate))
        }
      }
      
      // 优先级
      Row() {
        Text('优先级')
        Text(getPriorityText(this.task.priority))
      }
      
      // 状态
      Row() {
        Text('状态')
        Text(getStatusText(this.task.status))
      }
      
      // 操作按钮
      Row() {
        Button('编辑').onClick(() => this.onEdit(this.task))
        Button('删除').onClick(() => this.onDelete(this.task))
        Button(this.task.isCompleted ? '取消完成' : '完成')
          .onClick(() => this.onComplete(this.task))
      }
    }
  }
}
```

### 3. ManualBillSheet 组件（新增）

```typescript
// ManualBillSheet.ets - 手动记账弹窗
@Component
export struct ManualBillSheet {
  @Link isShow: boolean;
  onSave: (bill: Bill) => void = () => {};
  
  @State selectedType: BillType = BillType.EXPENSE;
  @State selectedCategory: BillCategory = BillCategory.FOOD;
  @State amount: number = 0;
  @State description: string = '';
  
  // 支出分类列表
  private expenseCategories: CategoryItem[] = [
    { category: BillCategory.FOOD, icon: '🍔', name: '餐饮' },
    { category: BillCategory.TRANSPORT, icon: '🚗', name: '交通' },
    { category: BillCategory.SHOPPING, icon: '🛍️', name: '购物' },
    { category: BillCategory.ENTERTAINMENT, icon: '🎬', name: '娱乐' },
    { category: BillCategory.MEDICAL, icon: '🏥', name: '医疗' },
    { category: BillCategory.EDUCATION, icon: '📚', name: '教育' },
    { category: BillCategory.HOUSING, icon: '🏠', name: '住房' },
    { category: BillCategory.UTILITIES, icon: '💡', name: '水电' },
    { category: BillCategory.OTHER_EXPENSE, icon: '📝', name: '其他' }
  ];
  
  // 收入分类列表
  private incomeCategories: CategoryItem[] = [
    { category: BillCategory.SALARY, icon: '💰', name: '工资' },
    { category: BillCategory.BONUS, icon: '🎁', name: '奖金' },
    { category: BillCategory.INVESTMENT, icon: '📈', name: '投资' },
    { category: BillCategory.GIFT, icon: '🎁', name: '礼金' },
    { category: BillCategory.OTHER_INCOME, icon: '📝', name: '其他' }
  ];
  
  build() {
    Column() {
      // 类型切换（支出/收入）
      Row() {
        Button('支出').onClick(() => this.selectedType = BillType.EXPENSE)
        Button('收入').onClick(() => this.selectedType = BillType.INCOME)
      }
      
      // 分类网格
      Grid() {
        ForEach(this.getCurrentCategories(), (item: CategoryItem) => {
          GridItem() {
            Column() {
              Text(item.icon)
              Text(item.name)
            }
            .onClick(() => this.selectedCategory = item.category)
          }
        })
      }
      
      // 金额输入
      TextInput({ placeholder: '请输入金额' })
        .type(InputType.Number)
        .onChange((value) => this.amount = parseFloat(value))
      
      // 备注输入
      TextInput({ placeholder: '添加备注（可选）' })
        .onChange((value) => this.description = value)
      
      // 保存按钮
      Button('保存')
        .onClick(() => this.saveBill())
    }
  }
  
  getCurrentCategories(): CategoryItem[] {
    return this.selectedType === BillType.EXPENSE 
      ? this.expenseCategories 
      : this.incomeCategories;
  }
  
  saveBill(): void {
    const bill = new Bill();
    bill.type = this.selectedType;
    bill.category = this.selectedCategory;
    bill.amount = this.amount;
    bill.description = this.description;
    bill.date = new Date();
    this.onSave(bill);
    this.isShow = false;
  }
}
```

### 4. 日程创建按钮集成

在 CalendarNewPage 中添加创建日程的入口按钮：

```typescript
// CalendarNew.ets 中添加悬浮按钮
@Builder
buildAddEventButton() {
  Button('+')
    .type(ButtonType.Circle)
    .width(60)
    .height(60)
    .fontSize(36)
    .backgroundColor(Constants.COLOR_PRIMARY)
    .fontColor('#FFFFFF')
    .position({ x: '100%', y: '100%' })
    .translate({ x: -76, y: -76 })
    .onClick(() => {
      this.editingEvent = null;
      this.showEventSheet = true;
    })
}
```

## Data Models

### 现有模型（无需修改）

- **Task**: 任务模型，包含 id, title, description, status, priority, dueDate 等字段
- **Bill**: 账单模型，包含 id, type, category, amount, description, date 等字段
- **CalendarEvent**: 日程模型，包含 id, title, startTime, endTime, reminder 等字段

### 分类项接口（新增）

```typescript
// CategoryItem.ets
interface CategoryItem {
  category: BillCategory;
  icon: string;
  name: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Task Completion Toggle

*For any* task in the system, toggling its completion status should change it from completed to pending or from pending to completed, and the change should be persisted to storage.

**Validates: Requirements 2.1, 2.2, 2.3**

### Property 2: Task Deletion Removes from Storage

*For any* task that exists in storage, after deletion, querying for that task should return null or empty result.

**Validates: Requirements 4.2, 4.3**

### Property 3: Task Statistics Accuracy

*For any* set of tasks in the system, the total count should equal the sum of completed count and pending count, and each count should accurately reflect the number of tasks with that status.

**Validates: Requirements 5.1, 5.2, 5.3, 5.4**

### Property 4: Task Filter Correctness

*For any* filter selection (all, pending, in-progress, completed), the returned task list should contain only tasks matching that filter criteria, and "all" filter should return all tasks.

**Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

### Property 5: Event Creation Persistence

*For any* valid calendar event (non-empty title), after saving, the event should be retrievable from storage with all fields intact.

**Validates: Requirements 1.2, 1.5**

### Property 6: Event Count Update

*For any* date, after creating an event on that date, the event count for that date should increase by 1.

**Validates: Requirements 1.3**

### Property 7: Bill Creation with Category

*For any* valid bill (positive amount, valid category), after creation, the bill should be stored with correct type and category, and statistics should reflect the new amount.

**Validates: Requirements 7.4, 7.5**

### Property 8: Bill Category Display

*For any* bill in the system, when displayed, it should show the correct category icon and name corresponding to its category field.

**Validates: Requirements 8.2**

### Property 9: Bill Date Grouping

*For any* set of bills, when grouped by date, bills with the same date should be in the same group, and groups should be sorted in chronological order.

**Validates: Requirements 9.4**

### Property 10: Monthly Statistics Calculation

*For any* month, the monthly income should equal the sum of all income bills in that month, and monthly expense should equal the sum of all expense bills in that month.

**Validates: Requirements 9.2**

### Property 11: View Switch Preserves Date

*For any* selected date, when switching between year, month, week, and day views, the selected date should remain the same after the switch.

**Validates: Requirements 10.5**

## Error Handling

### 任务操作错误处理

```typescript
// 删除任务时的错误处理
async onTaskDelete(task: Task): Promise<void> {
  try {
    await this.taskService.deleteTask(task.id);
    await this.loadTasks();
  } catch (error) {
    console.error('删除任务失败:', error);
    // 显示错误提示
    promptAction.showToast({ message: '删除失败，请重试' });
  }
}

// 完成任务时的错误处理
async onTaskComplete(task: Task): Promise<void> {
  try {
    if (task.status === Constants.TASK_STATUS_COMPLETED) {
      await this.taskService.uncompleteTask(task);
    } else {
      await this.taskService.completeTask(task);
    }
    await this.loadTasks();
  } catch (error) {
    console.error('更新任务状态失败:', error);
    promptAction.showToast({ message: '操作失败，请重试' });
  }
}
```

### 账单操作错误处理

```typescript
// 创建账单时的错误处理
async saveBill(bill: Bill): Promise<void> {
  if (bill.amount <= 0) {
    promptAction.showToast({ message: '请输入有效金额' });
    return;
  }
  
  try {
    await this.billService.createBill(bill);
    await this.loadBills();
    await this.loadStatistics();
  } catch (error) {
    console.error('保存账单失败:', error);
    promptAction.showToast({ message: '保存失败，请重试' });
  }
}
```

### 日程操作错误处理

```typescript
// 保存日程时的验证和错误处理
async saveEvent(event: CalendarEvent): Promise<void> {
  if (!event.title || event.title.trim().length === 0) {
    promptAction.showToast({ message: '请输入日程标题' });
    return;
  }
  
  try {
    if (event.id > 0) {
      await this.eventService.updateEvent(event);
    } else {
      await this.eventService.createEvent(event);
    }
    await this.loadEvents();
    this.updateCalendarDays();
  } catch (error) {
    console.error('保存日程失败:', error);
    promptAction.showToast({ message: '保存失败，请重试' });
  }
}
```

## Testing Strategy

### 单元测试

使用 HarmonyOS 的 @ohos/hypium 测试框架进行单元测试。

测试重点：
1. TaskService 的 CRUD 操作
2. BillService 的统计计算
3. EventService 的日期范围查询
4. 各种过滤和分组逻辑

### 属性测试

使用 fast-check 或类似的属性测试库（如果 HarmonyOS 支持）进行属性测试。

每个属性测试应运行至少 100 次迭代，使用随机生成的输入数据。

测试标签格式：**Feature: app-feature-completion, Property {number}: {property_text}**

### 集成测试

测试组件之间的交互：
1. TaskItem 点击事件正确传递到父组件
2. 弹窗组件正确显示和关闭
3. 数据变更后 UI 正确更新

### 测试数据生成

```typescript
// 生成随机任务
function generateRandomTask(): Task {
  const task = new Task();
  task.title = `Task_${Math.random().toString(36).substring(7)}`;
  task.description = `Description_${Math.random().toString(36).substring(7)}`;
  task.status = [
    Constants.TASK_STATUS_PENDING,
    Constants.TASK_STATUS_IN_PROGRESS,
    Constants.TASK_STATUS_COMPLETED
  ][Math.floor(Math.random() * 3)];
  task.priority = Math.floor(Math.random() * 3) + 1;
  task.dueDate = new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000);
  return task;
}

// 生成随机账单
function generateRandomBill(): Bill {
  const bill = new Bill();
  bill.type = Math.random() > 0.5 ? BillType.INCOME : BillType.EXPENSE;
  bill.category = bill.type === BillType.INCOME 
    ? [BillCategory.SALARY, BillCategory.BONUS, BillCategory.INVESTMENT][Math.floor(Math.random() * 3)]
    : [BillCategory.FOOD, BillCategory.TRANSPORT, BillCategory.SHOPPING][Math.floor(Math.random() * 3)];
  bill.amount = Math.floor(Math.random() * 1000) + 1;
  bill.description = `Bill_${Math.random().toString(36).substring(7)}`;
  bill.date = new Date();
  return bill;
}
```
