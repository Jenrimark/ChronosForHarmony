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
  @State filterStatus: string = 'all'; // all, pending, in_progress, completed
  @State showAddDialog: boolean = false;
  @State newTask: Task = new Task();
  @State tapActionId: number = 0;
  @State completeActionId: number = 0;
  @State deleteActionId: number = 0;

  private taskService: TaskService = TaskService.getInstance();

  aboutToAppear() {
    this.loadTasks();
  }

  /**
   * 加载任务
   */
  async loadTasks(): Promise<void> {
    if (this.filterStatus === 'all') {
      this.tasks = await this.taskService.getAllTasks();
    } else {
      this.tasks = await this.taskService.getTasksByStatus(this.filterStatus);
    }
  }

  /**
   * 切换筛选状态
   */
  onFilterChange(status: string): void {
    this.filterStatus = status;
    this.loadTasks();
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
    this.showAddDialog = true;
  }

  /**
   * 添加任务
   */
  async addTask(): Promise<void> {
    if (!this.newTask.title.trim()) {
      return;
    }
    await this.taskService.createTask(this.newTask);
    this.showAddDialog = false;
    await this.loadTasks();
  }

  build() {
    Stack() {
      Column() {
        // 筛选标签栏
        Row() {
          this.buildFilterButton('all', '全部')
          this.buildFilterButton(Constants.TASK_STATUS_PENDING, '待办')
          this.buildFilterButton(Constants.TASK_STATUS_IN_PROGRESS, '进行中')
          this.buildFilterButton(Constants.TASK_STATUS_COMPLETED, '已完成')
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 16, bottom: 8 })
        .justifyContent(FlexAlign.SpaceAround)

        // 任务列表
        if (this.tasks.length === 0) {
          Column() {
            Text('暂无任务')
              .fontSize(16)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
          }
          .width('100%')
          .layoutWeight(1)
          .justifyContent(FlexAlign.Center)
        } else {
          List() {
            ForEach(this.tasks, (task: Task) => {
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

        // 添加按钮
        Button('+')
          .type(ButtonType.Circle)
          .width(56)
          .height(56)
          .fontSize(32)
          .fontColor(Constants.COLOR_TEXT_ON_PRIMARY)
          .backgroundColor(Constants.COLOR_PRIMARY)
          .margin({ right: 16, bottom: 16 })
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
        Text('添加任务')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .margin({ bottom: 16 })

        TextInput({ placeholder: '请输入任务标题' })
          .width('100%')
          .height(40)
          .onChange((value: string) => {
            this.newTask.title = value;
          })
          .margin({ bottom: 12 })

        TextInput({ placeholder: '请输入任务描述（可选）' })
          .width('100%')
          .height(80)
          .type(InputType.Normal)
          .onChange((value: string) => {
            this.newTask.description = value;
          })
          .margin({ bottom: 16 })

        Row() {
          Button('取消')
            .type(ButtonType.Normal)
            .layoutWeight(1)
            .onClick(() => {
              this.showAddDialog = false;
            })

          Button('确定')
            .type(ButtonType.Normal)
            .layoutWeight(1)
            .backgroundColor(Constants.COLOR_PRIMARY)
            .fontColor('#FFFFFF')
            .onClick(() => {
              this.addTask();
            })
        }
        .width('100%')
        .justifyContent(FlexAlign.SpaceAround)
      }
      .width('80%')
      .padding(24)
      .backgroundColor('#FFFFFF')
      .borderRadius(12)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('rgba(0, 0, 0, 0.5)')
    .justifyContent(FlexAlign.Center)
    .onClick(() => {
      this.showAddDialog = false;
    })
  }

  @Builder
  buildFilterButton(status: string, label: string) {
    Button(label)
      .type(ButtonType.Normal)
      .fontSize(14)
      .fontColor(
        this.filterStatus === status
          ? Constants.COLOR_TEXT_ON_PRIMARY
          : Constants.COLOR_TEXT_PRIMARY
      )
      .backgroundColor(
        this.filterStatus === status
          ? Constants.COLOR_PRIMARY
          : Constants.COLOR_CARD_BACKGROUND
      )
      .borderRadius(16)
      .padding({ left: 16, right: 16, top: 6, bottom: 6 })
      .onClick(() => this.onFilterChange(status))
  }
}

