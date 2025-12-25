import { TaskItem } from '../components/TaskItem';
import { TaskService } from '../service/TaskService';
import { Task } from '../model/Task';
import { Constants } from '../common/Constants';
import { Utils } from '../common/Utils';

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
  @State tapActionId: number = 0;
  @State completeActionId: number = 0;
  @State deleteActionId: number = 0;

  private taskService: TaskService = TaskService.getInstance();

  aboutToAppear() {
    this.loadTasks();
    // 初始化过滤后的任务列表
    this.filteredTasks = [];
  }

  /**
   * 加载任务
   */
  async loadTasks(): Promise<void> {
    // 先加载所有任务用于统计
    this.allTasks = await this.taskService.getAllTasks();
    
    // 然后根据筛选状态加载任务列表
    if (this.filterStatus === 'all') {
      this.tasks = this.allTasks;
    } else {
      this.tasks = await this.taskService.getTasksByStatus(this.filterStatus);
    }
    
    // 应用搜索过滤
    this.applySearchFilter();
  }

  /**
   * 应用搜索过滤
   */
  applySearchFilter(): void {
    if (!this.searchKeyword || !this.searchKeyword.trim()) {
      // 如果没有搜索关键词，直接使用当前筛选的任务列表
      this.filteredTasks = this.tasks;
      return;
    }

    // 根据关键词过滤任务标题
    const keyword = this.searchKeyword.trim().toLowerCase();
    this.filteredTasks = this.tasks.filter(task => 
      task.title.toLowerCase().includes(keyword)
    );
  }

  /**
   * 搜索关键词变化
   */
  onSearchChange(keyword: string): void {
    this.searchKeyword = keyword;
    this.applySearchFilter();
  }

  /**
   * 获取已完成任务数量
   */
  getCompletedCount(): number {
    return this.allTasks.filter(t => t.status === Constants.TASK_STATUS_COMPLETED).length;
  }

  /**
   * 获取未完成任务数量
   */
  getPendingCount(): number {
    return this.allTasks.filter(t => t.status !== Constants.TASK_STATUS_COMPLETED).length;
  }

  /**
   * 切换筛选状态
   */
  onFilterChange(status: string): void {
    this.filterStatus = status;
    this.loadTasks();
    // 筛选状态改变后，如果有关键词，重新应用搜索过滤
    if (this.searchKeyword) {
      this.applySearchFilter();
    }
  }

  /**
   * 监听状态变化
   */
  aboutToUpdate() {
    if (this.completeActionId > 0) {
      const task = this.tasks.find(t => t.id === this.completeActionId);
      if (task) {
        this.onTaskComplete(task);
      }
      this.completeActionId = 0;
    }
    if (this.deleteActionId > 0) {
      const task = this.tasks.find(t => t.id === this.deleteActionId);
      if (task) {
        this.onTaskDelete(task);
      }
      this.deleteActionId = 0;
    }
    if (this.tapActionId > 0) {
      const task = this.tasks.find(t => t.id === this.tapActionId);
      if (task) {
        this.onTaskTap(task);
      }
      this.tapActionId = 0;
    }
  }

  /**
   * 完成任务
   */
  async onTaskComplete(task: Task): Promise<void> {
    if (task.status === Constants.TASK_STATUS_COMPLETED) {
      await this.taskService.uncompleteTask(task);
    } else {
      await this.taskService.completeTask(task);
    }
    await this.loadTasks();
  }

  /**
   * 删除任务
   */
  async onTaskDelete(task: Task): Promise<void> {
    await this.taskService.deleteTask(task.id);
    await this.loadTasks();
  }

  /**
   * 跳转到任务详情/编辑
   */
  onTaskTap(task: Task): void {
    // TODO: 跳转到任务编辑页面
    console.info('点击任务:', task.title);
  }

  /**
   * 显示添加任务对话框
   */
  showAddTaskDialog(): void {
    this.newTask = new Task();
    this.newTask.priority = Constants.PRIORITY_LOW; // 默认低优先级
    this.showAddDialog = true;
  }

  /**
   * 添加任务
   */
  async addTask(): Promise<void> {
    // 验证任务标题不能为空
    if (!this.newTask.title || !this.newTask.title.trim()) {
      return;
    }
    try {
      // 创建任务
      await this.taskService.createTask(this.newTask);
      // 关闭对话框
      this.showAddDialog = false;
      // 重新加载任务列表
      await this.loadTasks();
      // 重置新建任务对象
      this.newTask = new Task();
      this.newTask.priority = Constants.PRIORITY_LOW;
    } catch (error) {
      console.error('添加任务失败:', error);
      // 可以在这里添加错误提示
    }
  }

  build() {
    Stack() {
      Column() {
        // 统计数据卡片
        Row() {
          this.buildStatCard('全部任务', this.allTasks.length.toString(), Constants.COLOR_PRIMARY)
          this.buildStatCard('已完成', this.getCompletedCount().toString(), Constants.COLOR_SUCCESS)
          this.buildStatCard('未完成', this.getPendingCount().toString(), Constants.COLOR_WARNING)
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

        // 任务列表
        if (this.filteredTasks.length === 0) {
          Column() {
            Text(this.searchKeyword ? '未找到匹配的任务' : '暂无任务')
              .fontSize(16)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
          }
          .width('100%')
          .layoutWeight(1)
          .justifyContent(FlexAlign.Center)
        } else {
          List() {
            ForEach(this.filteredTasks, (task: Task) => {
              ListItem() {
                TaskItem({
                  task: task,
                  onTapAction: $tapActionId,
                  onCompleteAction: $completeActionId,
                  onDeleteAction: $deleteActionId
                })
              }
            })
          }
          .width('100%')
          .layoutWeight(1)
          .padding({ left: 16, right: 16 })
        }

        // 添加按钮 - 悬浮样式
        Button('+')
          .type(ButtonType.Circle)
          .width(60)
          .height(60)
          .fontSize(36)
          .fontWeight(FontWeight.Medium)
          .fontColor(Constants.COLOR_TEXT_ON_PRIMARY)
          .backgroundColor(Constants.COLOR_PRIMARY)
          .shadow({
            radius: 12,
            color: 'rgba(255, 107, 53, 0.4)',
            offsetX: 0,
            offsetY: 4
          })
          .margin({ right: 20, bottom: 20 })
          .alignSelf(ItemAlign.End)
          .onClick(() => this.showAddTaskDialog())
    }
    .width('100%')
    .flexGrow(1)
    .backgroundColor(Constants.COLOR_BACKGROUND)

      // 添加任务对话框
      if (this.showAddDialog) {
        this.buildAddTaskDialog()
      }
    }
    .width('100%')
    .height('100%')
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
          // 设置为明天作为默认截止日期
          if (!this.newTask.dueDate) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            this.newTask.dueDate = tomorrow;
          }
        })

        // 优先级选择
        Text('优先级')
          .fontSize(15)
          .fontWeight(FontWeight.Medium)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
          .margin({ bottom: 12 })
          .alignSelf(ItemAlign.Start)

        Row() {
          // 低优先级按钮
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

          // 中优先级按钮
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

          // 高优先级按钮
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
              // 重置表单
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
      // 点击背景区域关闭对话框
      this.showAddDialog = false;
      // 重置表单
      this.newTask = new Task();
      this.newTask.priority = Constants.PRIORITY_LOW;
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

  @Builder
  buildStatCard(title: string, value: string, color: string) {
    Column() {
      Text(value)
        .fontSize(28)
        .fontWeight(FontWeight.Bold)
        .fontColor(color)
        .margin({ bottom: 6 })
      Text(title)
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
}

