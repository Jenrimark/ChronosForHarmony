import { TaskItem } from '../components/TaskItem';
import { TaskService } from '../service/TaskService';
import { Task } from '../model/Task';
import { Constants } from '../common/Constants';
import { Utils } from '../common/Utils';
import { promptAction } from '@kit.ArkUI';
import { CalendarComponent } from '../components/CalendarComponent';

/**
 * 任务页面
 */
@Component
export struct Tasks {
  @State tasks: Task[] = [];
  @State allTasks: Task[] = []; // 所有任务，用于统计
  @State filteredTasks: Task[] = []; // 过滤后的任务列表
  @State filterStatus: string = 'all'; // all, pending, in_progress, completed
  @State searchKeyword: string = ''; // 搜索关键词
  @State showAddDialog: boolean = false;
  @State newTask: Task = new Task();
  @State sortType: string = 'createTime'; // 排序方式：priority(重要性), dueDate(截止时间), createTime(创建时间)
  @State showDatePicker: boolean = false; // 显示日期选择器
  @State tempSelectedDate: Date = new Date(); // 临时选择的日期
  @State monthChangeTrigger: number = 0; // 月份变化触发器
  
  // 统计数据 - 使用 @State 确保 UI 更新
  @State totalCount: number = 0;
  @State completedCount: number = 0;
  @State pendingCount: number = 0;
  
  // 任务详情弹窗状态
  @State showDetailDialog: boolean = false;
  @State selectedTask: Task | null = null;

  private taskService: TaskService = TaskService.getInstance();

  aboutToAppear() {
    this.loadTasks();
  }

  /**
   * 加载任务
   */
  async loadTasks(): Promise<void> {
    try {
      // 先加载所有任务用于统计
      this.allTasks = await this.taskService.getAllTasks();
      
      // 更新统计数据
      this.updateStatistics();
      
      // 然后根据筛选状态加载任务列表
      if (this.filterStatus === 'all') {
        this.tasks = this.allTasks;
      } else {
        this.tasks = await this.taskService.getTasksByStatus(this.filterStatus);
      }
      
      // 应用搜索过滤
      this.applySearchFilter();
    } catch (error) {
      console.error('加载任务失败:', error);
      promptAction.showToast({ message: '加载任务失败' });
    }
  }

  /**
   * 更新统计数据
   */
  updateStatistics(): void {
    this.totalCount = this.allTasks.length;
    this.completedCount = this.allTasks.filter(t => t.status === Constants.TASK_STATUS_COMPLETED).length;
    this.pendingCount = this.allTasks.filter(t => t.status !== Constants.TASK_STATUS_COMPLETED).length;
  }

  /**
   * 应用搜索过滤
   */
  applySearchFilter(): void {
    let tasks = this.tasks;
    
    // 应用搜索过滤
    if (this.searchKeyword && this.searchKeyword.trim()) {
      const keyword = this.searchKeyword.trim().toLowerCase();
      tasks = tasks.filter(task => 
        task.title.toLowerCase().includes(keyword)
      );
    }
    
    // 应用排序
    this.filteredTasks = this.applySort(tasks);
  }

  /**
   * 应用排序
   */
  applySort(tasks: Task[]): Task[] {
    const sortedTasks = [...tasks];
    
    // 先分离已完成和未完成的任务
    const completedTasks = sortedTasks.filter(t => t.status === Constants.TASK_STATUS_COMPLETED);
    const activeTasks = sortedTasks.filter(t => t.status !== Constants.TASK_STATUS_COMPLETED);
    
    let sortedActiveTasks: Task[] = [];
    let sortedCompletedTasks: Task[] = [];
    
    if (this.sortType === 'priority') {
      // 重要性排序：重要程度从高到低（priority从高到低）
      sortedActiveTasks = activeTasks.sort((a, b) => {
        return b.priority - a.priority;
      });
      sortedCompletedTasks = completedTasks.sort((a, b) => {
        return b.priority - a.priority;
      });
    } else if (this.sortType === 'dueDate') {
      // 截止时间排序：截止时间早的在前
      sortedActiveTasks = activeTasks.sort((a, b) => {
        // 没有截止日期的排在最后
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
      sortedCompletedTasks = completedTasks.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    } else if (this.sortType === 'createTime') {
      // 创建时间排序：创建时间越晚越在前面
      sortedActiveTasks = activeTasks.sort((a, b) => {
        return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
      });
      sortedCompletedTasks = completedTasks.sort((a, b) => {
        return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
      });
    } else {
      sortedActiveTasks = activeTasks;
      sortedCompletedTasks = completedTasks;
    }
    
    // 未完成的任务在前，已完成的任务在后
    return [...sortedActiveTasks, ...sortedCompletedTasks];
  }

  /**
   * 搜索关键词变化
   */
  onSearchChange(keyword: string): void {
    this.searchKeyword = keyword;
    this.applySearchFilter();
  }

  /**
   * 切换筛选状态
   */
  onFilterChange(status: string): void {
    this.filterStatus = status;
    this.loadTasks();
  }

  /**
   * 完成/取消完成任务 - 直接回调处理
   */
  async onTaskComplete(task: Task): Promise<void> {
    try {
      if (task.status === Constants.TASK_STATUS_COMPLETED) {
        await this.taskService.uncompleteTask(task);
        promptAction.showToast({ message: '已取消完成' });
      } else {
        await this.taskService.completeTask(task);
        promptAction.showToast({ message: '任务已完成' });
      }
      await this.loadTasks();
    } catch (error) {
      console.error('更新任务状态失败:', error);
      promptAction.showToast({ message: '操作失败，请重试' });
    }
  }

  /**
   * 删除任务 - 直接回调处理
   */
  async onTaskDelete(task: Task): Promise<void> {
    try {
      // 显示确认对话框
      AlertDialog.show({
        title: '确认删除',
        message: `确定要删除任务"${task.title}"吗？`,
        primaryButton: {
          value: '取消',
          action: () => {}
        },
        secondaryButton: {
          value: '删除',
          fontColor: Constants.COLOR_DANGER,
          action: async () => {
            try {
              await this.taskService.deleteTask(task);
              promptAction.showToast({ message: '任务已删除' });
              await this.loadTasks();
            } catch (error) {
              console.error('删除任务失败:', error);
              promptAction.showToast({ message: '删除失败，请重试' });
            }
          }
        }
      });
    } catch (error) {
      console.error('删除任务失败:', error);
      promptAction.showToast({ message: '删除失败，请重试' });
    }
  }

  /**
   * 点击任务查看详情
   */
  onTaskTap(task: Task): void {
    this.selectedTask = task;
    this.showDetailDialog = true;
  }

  /**
   * 显示添加任务对话框
   */
  showAddTaskDialog(): void {
    this.newTask = new Task();
    this.newTask.priority = Constants.PRIORITY_LOW;
    this.showAddDialog = true;
  }

  /**
   * 添加任务
   */
  async addTask(): Promise<void> {
    if (!this.newTask.title || !this.newTask.title.trim()) {
      promptAction.showToast({ message: '请输入任务标题' });
      return;
    }
    try {
      await this.taskService.createTask(this.newTask);
      this.showAddDialog = false;
      await this.loadTasks();
      this.newTask = new Task();
      this.newTask.priority = Constants.PRIORITY_LOW;
      promptAction.showToast({ message: '任务已添加' });
    } catch (error) {
      console.error('添加任务失败:', error);
      promptAction.showToast({ message: '添加失败，请重试' });
    }
  }

  build() {
    Stack() {
      Column() {
        // 统计数据卡片 - 直接内联渲染以确保响应式更新
        Row() {
          // 全部任务卡片
          Column() {
            Text(this.totalCount.toString())
              .fontSize(28)
              .fontWeight(FontWeight.Bold)
              .fontColor(Constants.COLOR_PRIMARY)
              .margin({ bottom: 6 })
            Text('全部任务')
              .fontSize(13)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
          }
          .layoutWeight(1)
          .padding({ top: 16, bottom: 16, left: 12, right: 12 })
          .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
          .borderRadius(12)
          .margin({ left: 6, right: 6 })
          .justifyContent(FlexAlign.Center)
          .shadow({
            radius: 8,
            color: 'rgba(0, 0, 0, 0.06)',
            offsetX: 0,
            offsetY: 2
          })

          // 已完成卡片
          Column() {
            Text(this.completedCount.toString())
              .fontSize(28)
              .fontWeight(FontWeight.Bold)
              .fontColor(Constants.COLOR_SUCCESS)
              .margin({ bottom: 6 })
            Text('已完成')
              .fontSize(13)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
          }
          .layoutWeight(1)
          .padding({ top: 16, bottom: 16, left: 12, right: 12 })
          .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
          .borderRadius(12)
          .margin({ left: 6, right: 6 })
          .justifyContent(FlexAlign.Center)
          .shadow({
            radius: 8,
            color: 'rgba(0, 0, 0, 0.06)',
            offsetX: 0,
            offsetY: 2
          })

          // 未完成卡片
          Column() {
            Text(this.pendingCount.toString())
              .fontSize(28)
              .fontWeight(FontWeight.Bold)
              .fontColor(Constants.COLOR_WARNING)
              .margin({ bottom: 6 })
            Text('未完成')
              .fontSize(13)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
          }
          .layoutWeight(1)
          .padding({ top: 16, bottom: 16, left: 12, right: 12 })
          .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
          .borderRadius(12)
          .margin({ left: 6, right: 6 })
          .justifyContent(FlexAlign.Center)
          .shadow({
            radius: 8,
            color: 'rgba(0, 0, 0, 0.06)',
            offsetX: 0,
            offsetY: 2
          })
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 16, bottom: 12 })
        .justifyContent(FlexAlign.SpaceAround)

        // 搜索框
        Row() {
          TextInput({ placeholder: '搜索任务...', text: this.searchKeyword })
            .layoutWeight(1)
            .height(40)
            .fontSize(14)
            .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
            .borderRadius(20)
            .padding({ left: 16, right: 16 })
            .onChange((value: string) => {
              this.onSearchChange(value);
            })
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 0, bottom: 12 })

        // 筛选标签栏
        Row() {
          this.buildFilterButton('all', '全部')
          this.buildFilterButton(Constants.TASK_STATUS_PENDING, '待办')
          this.buildFilterButton(Constants.TASK_STATUS_IN_PROGRESS, '进行中')
          this.buildFilterButton(Constants.TASK_STATUS_COMPLETED, '已完成')
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 8, bottom: 8 })
        .justifyContent(FlexAlign.SpaceAround)

        // 排序方式选择
        Row() {
          Text('排序方式：')
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .margin({ right: 12 })
          
          this.buildSortButton('priority', '重要性')
          this.buildSortButton('dueDate', '截止时间')
          this.buildSortButton('createTime', '创建时间')
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 8, bottom: 12 })
        .justifyContent(FlexAlign.Start)

        // 任务列表 - 可滚动区域
        Scroll() {
          if (this.filteredTasks.length === 0) {
            Column() {
              Text(this.searchKeyword ? '未找到匹配的任务' : '暂无任务')
                .fontSize(16)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
            }
            .width('100%')
            .height('100%')
            .justifyContent(FlexAlign.Center)
            .padding({ top: 100 })
          } else {
            Column() {
              ForEach(this.filteredTasks, (task: Task) => {
                TaskItem({
                  task: task,
                  onComplete: (t: Task) => this.onTaskComplete(t),
                  onDelete: (t: Task) => this.onTaskDelete(t),
                  onTap: (t: Task) => this.onTaskTap(t)
                })
              })
            }
            .width('100%')
            .padding({ left: 16, right: 16, bottom: 80 })
          }
        }
        .width('100%')
        .layoutWeight(1)
        .scrollBar(BarState.Auto)
      }
      .width('100%')
      .height('100%')
      .backgroundColor(Constants.COLOR_BACKGROUND)

      // 添加按钮 - 悬浮在最上层
      Button('+')
        .type(ButtonType.Circle)
        .width(60)
        .height(60)
        .fontSize(36)
        .fontWeight(FontWeight.Medium)
        .fontColor('#FFFFFF')
        .backgroundColor(Constants.COLOR_PRIMARY)
        .shadow({
          radius: 12,
          color: 'rgba(255, 107, 53, 0.4)',
          offsetX: 0,
          offsetY: 4
        })
        .position({ x: '100%', y: '100%' })
        .translate({ x: -80, y: -80 })
        .zIndex(1000)
        .onClick(() => this.showAddTaskDialog())

      // 添加任务对话框
      if (this.showAddDialog) {
        this.buildAddTaskDialog()
      }

      // 任务详情对话框
      if (this.showDetailDialog && this.selectedTask) {
        this.buildTaskDetailDialog()
      }

      // 日期选择器弹窗
      if (this.showDatePicker) {
        this.buildDatePickerDialog()
      }
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  buildTaskDetailDialog() {
    Column() {
      Column() {
        // 对话框标题
        Row() {
          Text('任务详情')
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT_PRIMARY)
          
          Blank()
          
          Text('×')
            .fontSize(24)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .onClick(() => {
              this.showDetailDialog = false;
              this.selectedTask = null;
            })
        }
        .width('100%')
        .margin({ bottom: 20 })

        // 任务标题
        Text(this.selectedTask?.title || '')
          .fontSize(18)
          .fontWeight(FontWeight.Medium)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
          .width('100%')
          .margin({ bottom: 12 })

        // 任务描述
        if (this.selectedTask?.description) {
          Text(this.selectedTask.description)
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .width('100%')
            .margin({ bottom: 16 })
        }

        // 详情信息
        Column() {
          // 状态
          Row() {
            Text('状态')
              .fontSize(14)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
              .width(80)
            Text(Utils.getStatusText(this.selectedTask?.status || ''))
              .fontSize(14)
              .fontColor(Constants.COLOR_TEXT_PRIMARY)
          }
          .width('100%')
          .padding({ top: 10, bottom: 10 })

          // 优先级
          Row() {
            Text('优先级')
              .fontSize(14)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
              .width(80)
            Text(Utils.getPriorityText(this.selectedTask?.priority || 1))
              .fontSize(14)
              .fontColor(Utils.getPriorityColor(this.selectedTask?.priority || 1))
              .fontWeight(FontWeight.Medium)
          }
          .width('100%')
          .padding({ top: 10, bottom: 10 })

          // 截止日期
          if (this.selectedTask?.dueDate) {
            Row() {
              Text('截止日期')
                .fontSize(14)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
                .width(80)
              Text(Utils.formatDate(this.selectedTask.dueDate, 'YYYY-MM-DD'))
                .fontSize(14)
                .fontColor(
                  this.selectedTask.isOverdue() 
                    ? Constants.COLOR_DANGER 
                    : Constants.COLOR_TEXT_PRIMARY
                )
            }
            .width('100%')
            .padding({ top: 10, bottom: 10 })
          }

          // 创建时间
          Row() {
            Text('创建时间')
              .fontSize(14)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
              .width(80)
            Text(Utils.formatDate(this.selectedTask?.createTime || new Date(), 'YYYY-MM-DD HH:mm'))
              .fontSize(14)
              .fontColor(Constants.COLOR_TEXT_PRIMARY)
          }
          .width('100%')
          .padding({ top: 10, bottom: 10 })
        }
        .width('100%')
        .backgroundColor(Constants.COLOR_BACKGROUND)
        .borderRadius(12)
        .padding(12)
        .margin({ bottom: 20 })

        // 操作按钮
        Row() {
          // 完成/取消完成按钮
          Button(this.selectedTask?.status === Constants.TASK_STATUS_COMPLETED ? '取消完成' : '完成')
            .type(ButtonType.Normal)
            .layoutWeight(1)
            .height(44)
            .fontSize(15)
            .fontWeight(FontWeight.Medium)
            .backgroundColor(Constants.COLOR_SUCCESS)
            .fontColor('#FFFFFF')
            .borderRadius(10)
            .onClick(() => {
              if (this.selectedTask) {
                this.onTaskComplete(this.selectedTask);
                this.showDetailDialog = false;
                this.selectedTask = null;
              }
            })

          // 删除按钮
          Button('删除')
            .type(ButtonType.Normal)
            .layoutWeight(1)
            .height(44)
            .fontSize(15)
            .fontWeight(FontWeight.Medium)
            .backgroundColor(Constants.COLOR_DANGER)
            .fontColor('#FFFFFF')
            .borderRadius(10)
            .margin({ left: 12 })
            .onClick(() => {
              if (this.selectedTask) {
                this.showDetailDialog = false;
                this.onTaskDelete(this.selectedTask);
                this.selectedTask = null;
              }
            })
        }
        .width('100%')
      }
      .width('90%')
      .padding(24)
      .backgroundColor('#FFFFFF')
      .borderRadius(20)
      .shadow({
        radius: 20,
        color: 'rgba(0, 0, 0, 0.15)',
        offsetX: 0,
        offsetY: 8
      })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('rgba(0, 0, 0, 0.5)')
    .justifyContent(FlexAlign.Center)
    .onClick(() => {
      this.showDetailDialog = false;
      this.selectedTask = null;
    })
  }

  @Builder
  buildAddTaskDialog() {
    Column() {
      Column() {
        // 对话框标题
        Text('添加任务')
          .fontSize(22)
          .fontWeight(FontWeight.Bold)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
          .margin({ bottom: 20 })

        // 任务标题输入框
        Text('任务标题')
          .fontSize(15)
          .fontWeight(FontWeight.Medium)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
          .margin({ bottom: 8 })
          .alignSelf(ItemAlign.Start)

        TextInput({ placeholder: '请输入任务标题', text: this.newTask.title })
          .width('100%')
          .height(48)
          .maxLength(100)
          .fontSize(15)
          .backgroundColor(Constants.COLOR_BACKGROUND)
          .borderRadius(12)
          .padding({ left: 12, right: 12 })
          .onChange((value: string) => {
            this.newTask.title = value;
          })
          .margin({ bottom: 16 })

        // 任务描述输入框
        Text('任务描述（可选）')
          .fontSize(15)
          .fontWeight(FontWeight.Medium)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
          .margin({ bottom: 8 })
          .alignSelf(ItemAlign.Start)

        TextArea({ placeholder: '请输入任务描述', text: this.newTask.description })
          .width('100%')
          .height(80)
          .maxLength(500)
          .fontSize(14)
          .backgroundColor(Constants.COLOR_BACKGROUND)
          .borderRadius(12)
          .padding(12)
          .onChange((value: string) => {
            this.newTask.description = value;
          })
          .margin({ bottom: 16 })

        // 截止日期选择
        Text('截止日期（可选）')
          .fontSize(15)
          .fontWeight(FontWeight.Medium)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
          .margin({ bottom: 8 })
          .alignSelf(ItemAlign.Start)

        Row() {
          Text(this.newTask.dueDate ? Utils.formatDate(this.newTask.dueDate, 'YYYY-MM-DD') : '点击选择日期')
            .fontSize(15)
            .fontColor(this.newTask.dueDate ? Constants.COLOR_TEXT_PRIMARY : Constants.COLOR_TEXT_SECONDARY)
            .layoutWeight(1)

          if (this.newTask.dueDate) {
            Text('×')
              .fontSize(18)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
              .padding({ left: 8, right: 8 })
              .onClick(() => {
                this.newTask.dueDate = null;
              })
          }
        }
        .width('100%')
        .height(48)
        .padding({ left: 12, right: 12 })
        .backgroundColor(Constants.COLOR_BACKGROUND)
        .borderRadius(12)
        .margin({ bottom: 16 })
        .onClick(() => {
          this.tempSelectedDate = this.newTask.dueDate || new Date();
          this.showDatePicker = true;
        })

        // 优先级选择
        Text('优先级')
          .fontSize(15)
          .fontWeight(FontWeight.Medium)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
          .margin({ bottom: 12 })
          .alignSelf(ItemAlign.Start)

        Row() {
          Button('低')
            .type(ButtonType.Normal)
            .layoutWeight(1)
            .height(44)
            .fontSize(15)
            .fontWeight(FontWeight.Medium)
            .backgroundColor(
              this.newTask.priority === Constants.PRIORITY_LOW
                ? '#FFA726'
                : Constants.COLOR_BACKGROUND
            )
            .fontColor(
              this.newTask.priority === Constants.PRIORITY_LOW
                ? Constants.COLOR_TEXT_ON_PRIMARY
                : Constants.COLOR_TEXT_SECONDARY
            )
            .borderRadius(10)
            .onClick(() => {
              this.newTask.priority = Constants.PRIORITY_LOW;
            })

          Button('中')
            .type(ButtonType.Normal)
            .layoutWeight(1)
            .height(44)
            .fontSize(15)
            .fontWeight(FontWeight.Medium)
            .backgroundColor(
              this.newTask.priority === Constants.PRIORITY_MEDIUM
                ? '#FF8F00'
                : Constants.COLOR_BACKGROUND
            )
            .fontColor(
              this.newTask.priority === Constants.PRIORITY_MEDIUM
                ? Constants.COLOR_TEXT_ON_PRIMARY
                : Constants.COLOR_TEXT_SECONDARY
            )
            .borderRadius(10)
            .margin({ left: 10 })
            .onClick(() => {
              this.newTask.priority = Constants.PRIORITY_MEDIUM;
            })

          Button('高')
            .type(ButtonType.Normal)
            .layoutWeight(1)
            .height(44)
            .fontSize(15)
            .fontWeight(FontWeight.Medium)
            .backgroundColor(
              this.newTask.priority === Constants.PRIORITY_HIGH
                ? Constants.COLOR_DANGER
                : Constants.COLOR_BACKGROUND
            )
            .fontColor(
              this.newTask.priority === Constants.PRIORITY_HIGH
                ? Constants.COLOR_TEXT_ON_PRIMARY
                : Constants.COLOR_TEXT_SECONDARY
            )
            .borderRadius(10)
            .margin({ left: 10 })
            .onClick(() => {
              this.newTask.priority = Constants.PRIORITY_HIGH;
            })
        }
        .width('100%')
        .margin({ bottom: 24 })

        // 操作按钮行
        Row() {
          Button('取消')
            .type(ButtonType.Normal)
            .layoutWeight(1)
            .height(48)
            .fontSize(16)
            .fontWeight(FontWeight.Medium)
            .backgroundColor(Constants.COLOR_BACKGROUND)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .borderRadius(12)
            .onClick(() => {
              this.showAddDialog = false;
              this.newTask = new Task();
              this.newTask.priority = Constants.PRIORITY_LOW;
            })

          Button('确定')
            .type(ButtonType.Normal)
            .layoutWeight(1)
            .height(48)
            .fontSize(16)
            .fontWeight(FontWeight.Medium)
            .backgroundColor(Constants.COLOR_PRIMARY)
            .fontColor(Constants.COLOR_TEXT_ON_PRIMARY)
            .borderRadius(12)
            .margin({ left: 16 })
            .shadow({
              radius: 8,
              color: 'rgba(255, 107, 53, 0.3)',
              offsetX: 0,
              offsetY: 2
            })
            .onClick(() => {
              this.addTask();
            })
        }
        .width('100%')
        .justifyContent(FlexAlign.SpaceBetween)
      }
      .width('90%')
      .padding(24)
      .backgroundColor('#FFFFFF')
      .borderRadius(20)
      .shadow({
        radius: 20,
        color: 'rgba(0, 0, 0, 0.15)',
        offsetX: 0,
        offsetY: 8
      })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('rgba(0, 0, 0, 0.5)')
    .justifyContent(FlexAlign.Center)
    .onClick(() => {
      this.showAddDialog = false;
      this.newTask = new Task();
      this.newTask.priority = Constants.PRIORITY_LOW;
    })
  }

  /**
   * 构建日期选择器弹窗
   */
  @Builder
  buildDatePickerDialog() {
    Column() {
      Column() {
        // 对话框标题
        Row() {
          Text('选择截止日期')
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT_PRIMARY)
          
          Blank()
          
          Text('×')
            .fontSize(24)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .onClick(() => {
              this.showDatePicker = false;
            })
        }
        .width('100%')
        .margin({ bottom: 16 })

        // 日历组件
        CalendarComponent({
          selectedDate: this.tempSelectedDate,
          tasks: [],
          holidays: [],
          selectedDateChanged: this.tempSelectedDate,
          monthChangeTrigger: this.monthChangeTrigger
        })
        .width('100%')
        .margin({ bottom: 20 })

        // 操作按钮
        Row() {
          Button('取消')
            .type(ButtonType.Normal)
            .layoutWeight(1)
            .height(44)
            .fontSize(15)
            .fontWeight(FontWeight.Medium)
            .backgroundColor(Constants.COLOR_BACKGROUND)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .borderRadius(10)
            .onClick(() => {
              this.showDatePicker = false;
            })

          Button('确定')
            .type(ButtonType.Normal)
            .layoutWeight(1)
            .height(44)
            .fontSize(15)
            .fontWeight(FontWeight.Medium)
            .backgroundColor(Constants.COLOR_PRIMARY)
            .fontColor(Constants.COLOR_TEXT_ON_PRIMARY)
            .borderRadius(10)
            .margin({ left: 12 })
            .onClick(() => {
              this.newTask.dueDate = new Date(this.tempSelectedDate);
              this.newTask.dueDate.setHours(0, 0, 0, 0);
              this.showDatePicker = false;
            })
        }
        .width('100%')
      }
      .width('90%')
      .padding(24)
      .backgroundColor('#FFFFFF')
      .borderRadius(20)
      .shadow({
        radius: 20,
        color: 'rgba(0, 0, 0, 0.15)',
        offsetX: 0,
        offsetY: 8
      })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('rgba(0, 0, 0, 0.5)')
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
    .onClick(() => {
      this.showDatePicker = false;
    })
  }

  @Builder
  buildFilterButton(status: string, label: string) {
    Button(label)
      .type(ButtonType.Normal)
      .fontSize(14)
      .fontWeight(this.filterStatus === status ? FontWeight.Medium : FontWeight.Normal)
      .fontColor(
        this.filterStatus === status
          ? Constants.COLOR_TEXT_ON_PRIMARY
          : Constants.COLOR_TEXT_SECONDARY
      )
      .backgroundColor(
        this.filterStatus === status
          ? Constants.COLOR_PRIMARY
          : Constants.COLOR_CARD_BACKGROUND
      )
      .borderRadius(20)
      .padding({ left: 18, right: 18, top: 8, bottom: 8 })
      .shadow(this.filterStatus === status ? {
        radius: 6,
        color: 'rgba(255, 107, 53, 0.3)',
        offsetX: 0,
        offsetY: 2
      } : {
        radius: 0,
        color: 'transparent',
        offsetX: 0,
        offsetY: 0
      })
      .onClick(() => this.onFilterChange(status))
  }

  /**
   * 切换排序方式
   */
  onSortChange(sortType: string): void {
    this.sortType = sortType;
    this.applySearchFilter();
  }

  @Builder
  buildSortButton(sortType: string, label: string) {
    Button(label)
      .type(ButtonType.Normal)
      .fontSize(13)
      .fontWeight(this.sortType === sortType ? FontWeight.Medium : FontWeight.Normal)
      .fontColor(
        this.sortType === sortType
          ? Constants.COLOR_TEXT_ON_PRIMARY
          : Constants.COLOR_TEXT_SECONDARY
      )
      .backgroundColor(
        this.sortType === sortType
          ? Constants.COLOR_PRIMARY
          : Constants.COLOR_CARD_BACKGROUND
      )
      .borderRadius(16)
      .padding({ left: 14, right: 14, top: 6, bottom: 6 })
      .margin({ right: 8 })
      .onClick(() => this.onSortChange(sortType))
  }
}
