import { CalendarComponent } from '../components/CalendarComponent';
import { TaskItem } from '../components/TaskItem';
import { TaskService } from '../service/TaskService';
import { HolidayService } from '../service/HolidayService';
import { Task } from '../model/Task';
import { Holiday } from '../model/Holiday';
import { Utils } from '../common/Utils';
import { Constants } from '../common/Constants';

/**
 * 日历页面
 */
@Component
export struct CalendarPage {
  @State selectedDate: Date = new Date();
  @State tasks: Task[] = [];
  @State selectedDateTasks: Task[] = [];
  @State allTasks: Task[] = [];
  @State holidays: Holiday[] = [];
  @State currentMonth: Date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  @State monthChangeTrigger: number = 0;
  @State tapActionId: number = 0;
  @State completeActionId: number = 0;
  @State deleteActionId: number = 0;

  private taskService: TaskService = TaskService.getInstance();
  private holidayService: HolidayService = HolidayService.getInstance();

  aboutToAppear() {
    this.loadTasks();
    this.loadHolidays();
  }

  /**
   * 加载所有任务
   */
  async loadTasks(): Promise<void> {
    const tasks = await this.taskService.getAllTasks();
    // 创建新数组引用以确保触发UI更新
    this.allTasks = [...tasks];
    this.updateSelectedDateTasks();
  }

  /**
   * 加载节假日
   */
  async loadHolidays(): Promise<void> {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const loadedHolidays = await this.holidayService.getHolidaysByMonth(year, month);
    // 创建新数组引用以确保触发UI更新
    this.holidays = [...loadedHolidays];
    console.info(`加载 ${year}年${month + 1}月 的节假日，共 ${loadedHolidays.length} 个`);
  }

  /**
   * 更新选中日期的任务
   */
  updateSelectedDateTasks(): void {
    const filtered = this.allTasks.filter(task => {
      if (!task.dueDate) return false;
      return Utils.isSameDay(task.dueDate, this.selectedDate);
    });
    // 创建新数组引用以确保触发UI更新
    this.selectedDateTasks = [...filtered];
  }

  /**
   * 监听状态变化
   */
  aboutToUpdate() {
    // 月份变化时重新加载节假日（monthChangeTrigger包含编码的月份信息：year*10000+month*100）
    if (this.monthChangeTrigger > 0 && this.monthChangeTrigger < 999999) {
      const year = Math.floor(this.monthChangeTrigger / 10000);
      const month = Math.floor((this.monthChangeTrigger % 10000) / 100);
      const newMonth = new Date(year, month, 1);
      this.currentMonth = newMonth;
      this.monthChangeTrigger = 0;
      // 异步加载节假日
      this.loadHolidays();
    }

    if (this.completeActionId > 0) {
      const task = this.allTasks.find(t => t.id === this.completeActionId);
      if (task) {
        this.onTaskComplete(task);
      }
      this.completeActionId = 0;
    }
    if (this.deleteActionId > 0) {
      const task = this.allTasks.find(t => t.id === this.deleteActionId);
      if (task) {
        this.onTaskDelete(task);
      }
      this.deleteActionId = 0;
    }
    if (this.tapActionId > 0) {
      const task = this.allTasks.find(t => t.id === this.tapActionId);
      if (task) {
        this.onTaskTap(task);
      }
      this.tapActionId = 0;
    }
    this.updateSelectedDateTasks();
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

  build() {
    Column() {
      // 日历组件
      CalendarComponent({
        selectedDate: this.selectedDate,
        tasks: this.allTasks,
        holidays: this.holidays,
        selectedDateChanged: $selectedDate,
        monthChangeTrigger: $monthChangeTrigger
      })
        .margin({ top: 16 })

      // 选中日期的任务列表
      Column() {
        Row() {
          Text(Utils.formatDate(this.selectedDate, 'YYYY年MM月DD日'))
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT_PRIMARY)

          Blank()

          Text(`${this.selectedDateTasks.length} 个任务`)
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 16, bottom: 8 })

        if (this.selectedDateTasks.length === 0) {
          Column() {
            Text('这一天没有任务')
              .fontSize(14)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
          }
          .width('100%')
          .height(100)
          .justifyContent(FlexAlign.Center)
        } else {
          List() {
            ForEach(this.selectedDateTasks, (task: Task) => {
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
      }
      .layoutWeight(1)
      .width('100%')
    }
    .width('100%')
    .flexGrow(1)
    .backgroundColor(Constants.COLOR_BACKGROUND)
  }
}

