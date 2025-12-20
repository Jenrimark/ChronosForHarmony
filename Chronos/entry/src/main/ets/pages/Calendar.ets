import { TaskItem } from '../components/TaskItem';
import { TaskService } from '../service/TaskService';
import { HolidayService } from '../service/HolidayService';
import { Task } from '../model/Task';
import { Holiday } from '../model/Holiday';
import { Utils } from '../common/Utils';
import { Constants } from '../common/Constants';

/**
 * 日历日期项
 */
interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  taskCount: number;
  holidays: Holiday[];
  lunarDate: string; // 农历日期字符串（暂时为空，待SDK支持后实现）
}

/**
 * 日历页面 - 固定日历网格布局
 */
@Component
export struct CalendarPage {
  @State selectedDate: Date = new Date();
  @State currentMonth: Date = new Date();
  @State calendarDays: CalendarDay[] = [];
  @State selectedDateTasks: Task[] = [];
  @State allTasks: Task[] = [];
  @State holidays: Holiday[] = [];
  @State tapActionId: number = 0;
  @State completeActionId: number = 0;
  @State deleteActionId: number = 0;
  @State showDetail: boolean = false; // 是否显示详情

  private taskService: TaskService = TaskService.getInstance();
  private holidayService: HolidayService = HolidayService.getInstance();
  private today: Date = new Date();

  aboutToAppear() {
    this.loadTasks();
    this.loadHolidays();
    this.updateCalendarDays();
  }

  /**
   * 加载所有任务
   */
  async loadTasks(): Promise<void> {
    const tasks = await this.taskService.getAllTasks();
    this.allTasks = [...tasks];
    this.updateSelectedDateTasks();
    this.updateCalendarDays();
  }

  /**
   * 加载节假日
   */
  async loadHolidays(): Promise<void> {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const loadedHolidays = await this.holidayService.getHolidaysByMonth(year, month);
    this.holidays = [...loadedHolidays];
    this.updateCalendarDays();
  }

  /**
   * 更新日历日期数组
   */
  updateCalendarDays(): void {
    const days: CalendarDay[] = [];
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    // 获取当月第一天和最后一天
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // 获取当月第一天是星期几（0=周日，1=周一...）
    const firstDayWeek = firstDay.getDay();
    const startDay = firstDayWeek === 0 ? 6 : firstDayWeek - 1; // 转换为周一为0
    
    // 获取上个月的最后几天
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push(this.createCalendarDay(date, false));
    }
    
    // 获取当月的所有日期
    const daysInMonth = lastDay.getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push(this.createCalendarDay(date, true));
    }
    
    // 补齐到6行（42天）
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push(this.createCalendarDay(date, false));
    }
    
    this.calendarDays = [...days];
  }

  /**
   * 获取农历日期字符串
   * TODO: 待SDK支持@kit.I18nKit后实现
   */
  getLunarDate(date: Date): string {
    // 暂时返回空字符串，待SDK支持农历API后实现
    // 示例实现（需要@kit.I18nKit支持）：
    // const lunarCalendar = i18n.Calendar.getInstance('chinese');
    // lunarCalendar.setTime(date);
    // const lunarDay = lunarCalendar.getField('d');
    // return this.formatLunarDay(lunarDay);
    return '';
  }

  /**
   * 格式化农历日为中文数字
   */
  formatLunarDay(day: number): string {
    const lunarDayNames = [
      '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
      '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
      '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
    ];
    if (day >= 0 && day < lunarDayNames.length) {
      return lunarDayNames[day];
    }
    return '';
  }

  /**
   * 获取完整农历日期字符串（用于详情显示）
   * TODO: 待SDK支持@kit.I18nKit后实现
   */
  getFullLunarDate(date: Date): string {
    // 暂时返回空字符串，待SDK支持农历API后实现
    return '';
  }

  /**
   * 创建日历日期项
   */
  createCalendarDay(date: Date, isCurrentMonth: boolean): CalendarDay {
    const isToday = Utils.isSameDay(date, this.today);
    const isSelected = Utils.isSameDay(date, this.selectedDate);
    const taskCount = this.getTaskCountForDate(date);
    const dateHolidays = this.getHolidaysForDate(date);
    const lunarDate = this.getLunarDate(date);
    
    return {
      date: date,
      isCurrentMonth: isCurrentMonth,
      isToday: isToday,
      isSelected: isSelected,
      taskCount: taskCount,
      holidays: dateHolidays,
      lunarDate: lunarDate
    };
  }

  /**
   * 更新选中日期的任务
   */
  updateSelectedDateTasks(): void {
    const filtered = this.allTasks.filter(task => {
      if (!task.dueDate) return false;
      return Utils.isSameDay(task.dueDate, this.selectedDate);
    });
    this.selectedDateTasks = [...filtered];
  }

  /**
   * 监听状态变化
   */
  aboutToUpdate() {
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
    console.info('点击任务:', task.title);
  }

  /**
   * 选择日期
   */
  onDateSelect(day: CalendarDay): void {
    if (!day.isCurrentMonth) {
      // 如果点击的是上个月或下个月的日期，切换月份
      this.currentMonth = new Date(day.date.getFullYear(), day.date.getMonth(), 1);
      this.loadHolidays();
    }
    this.selectedDate = day.date;
    this.updateSelectedDateTasks();
    this.showDetail = true; // 显示详情
  }

  /**
   * 上一个月
   */
  prevMonth(): void {
    const newMonth = new Date(this.currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    this.currentMonth = newMonth;
    this.loadHolidays();
    this.updateCalendarDays();
  }

  /**
   * 下一个月
   */
  nextMonth(): void {
    const newMonth = new Date(this.currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    this.currentMonth = newMonth;
    this.loadHolidays();
    this.updateCalendarDays();
  }

  /**
   * 获取日期对应的节假日
   */
  getHolidaysForDate(date: Date): Holiday[] {
    return this.holidays.filter(holiday => {
      return Utils.isSameDay(date, holiday.date);
    });
  }

  /**
   * 获取日期对应的任务数量
   */
  getTaskCountForDate(date: Date): number {
    return this.allTasks.filter(task => {
      if (!task.dueDate) return false;
      return Utils.isSameDay(date, task.dueDate);
    }).length;
  }

  /**
   * 构建日历网格
   */
  @Builder
  buildCalendarGrid() {
    Column() {
      // 星期标题行
      Row() {
        ForEach(['一', '二', '三', '四', '五', '六', '日'], (day: string) => {
          Text(day)
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .width('14.28%')
            .textAlign(TextAlign.Center)
        })
      }
      .width('100%')
      .height(40)
      .padding({ left: 8, right: 8 })

      // 日期网格
      Grid() {
        ForEach(this.calendarDays, (day: CalendarDay) => {
          GridItem() {
            this.buildCalendarDay(day)
          }
        })
      }
      .columnsTemplate('1fr 1fr 1fr 1fr 1fr 1fr 1fr')
      .rowsTemplate('1fr 1fr 1fr 1fr 1fr 1fr')
      .width('100%')
      .height(360)
      .padding({ left: 8, right: 8, top: 8, bottom: 8 })
    }
    .width('100%')
  }

  /**
   * 构建单个日期单元格
   */
  @Builder
  buildCalendarDay(day: CalendarDay) {
    Column() {
      // 日期数字
      Text(`${day.date.getDate()}`)
        .fontSize(16)
        .fontWeight(day.isToday || day.isSelected ? FontWeight.Bold : FontWeight.Normal)
        .fontColor(this.getDateTextColor(day))
        .margin({ bottom: 2 })

      // 农历日期
      if (day.lunarDate && day.isCurrentMonth) {
        Text(day.lunarDate)
          .fontSize(10)
          .fontColor(this.getLunarTextColor(day))
          .margin({ bottom: 2 })
      }

      // 任务/节假日标记
      if (day.taskCount > 0 || day.holidays.length > 0) {
        Row() {
          if (day.taskCount > 0) {
            Text('●')
              .fontSize(8)
              .fontColor(Constants.COLOR_PRIMARY)
          }
          if (day.holidays.length > 0) {
            Text('●')
              .fontSize(8)
              .fontColor(Constants.COLOR_DANGER)
              .margin({ left: day.taskCount > 0 ? 2 : 0 })
          }
        }
        .justifyContent(FlexAlign.Center)
        .height(12)
      }
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .backgroundColor(day.isSelected ? Constants.COLOR_PRIMARY_LIGHT : 'transparent')
    .borderRadius(8)
    .onClick(() => {
      this.onDateSelect(day);
    })
  }

  /**
   * 获取农历文字颜色
   */
  getLunarTextColor(day: CalendarDay): string {
    if (!day.isCurrentMonth) {
      return Constants.COLOR_TEXT_TERTIARY;
    }
    if (day.holidays.length > 0) {
      return Constants.COLOR_DANGER;
    }
    return Constants.COLOR_TEXT_SECONDARY;
  }

  /**
   * 获取日期文字颜色
   */
  getDateTextColor(day: CalendarDay): string {
    if (!day.isCurrentMonth) {
      return Constants.COLOR_TEXT_TERTIARY;
    }
    if (day.isToday || day.isSelected) {
      return Constants.COLOR_PRIMARY;
    }
    if (day.holidays.length > 0) {
      return Constants.COLOR_DANGER;
    }
    return Constants.COLOR_TEXT_PRIMARY;
  }

  /**
   * 构建详情区域
   */
  @Builder
  buildDetailSection() {
    Column() {
      // 日期信息
      Row() {
        Column() {
          Text(Utils.formatDate(this.selectedDate, 'MM月DD日'))
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT_PRIMARY)
          Row() {
            Text(Utils.formatDate(this.selectedDate, 'YYYY年'))
              .fontSize(12)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
            if (this.getFullLunarDate(this.selectedDate)) {
              Text(this.getFullLunarDate(this.selectedDate))
                .fontSize(12)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
                .margin({ left: 8 })
            }
          }
          .margin({ top: 4 })
        }
        .alignItems(HorizontalAlign.Start)

        Blank()

        // 节假日显示
        if (this.getHolidaysForDate(this.selectedDate).length > 0) {
          Row() {
            Text('🎉')
              .fontSize(16)
            Text(this.getHolidaysForDate(this.selectedDate)[0].name)
              .fontSize(14)
              .fontColor(Constants.COLOR_PRIMARY)
              .margin({ left: 4 })
          }
          .padding({ left: 12, right: 12, top: 6, bottom: 6 })
          .backgroundColor(Constants.COLOR_PRIMARY_LIGHT)
          .borderRadius(16)
        }
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 16, bottom: 12 })

      // 任务列表
      if (this.selectedDateTasks.length === 0) {
        Column() {
          Text('📝')
            .fontSize(48)
            .opacity(0.3)
          Text('这一天没有任务')
            .fontSize(16)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .margin({ top: 16 })
        }
        .width('100%')
        .height(150)
        .justifyContent(FlexAlign.Center)
      } else {
        Row() {
          Text('任务列表')
            .fontSize(16)
            .fontWeight(FontWeight.Medium)
            .fontColor(Constants.COLOR_TEXT_PRIMARY)
          
          Blank()
          
          Text(`共 ${this.selectedDateTasks.length} 项`)
            .fontSize(12)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 12, bottom: 8 })

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
    .width('100%')
    .layoutWeight(1)
    .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
    .borderRadius({ topLeft: 20, topRight: 20 })
    .padding({ bottom: 16 })
  }

  build() {
    Column() {
      // 顶部月份导航
      Row() {
        Button('‹')
          .type(ButtonType.Normal)
          .fontSize(20)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
          .backgroundColor('transparent')
          .width(40)
          .height(40)
          .onClick(() => {
            this.prevMonth();
          })

        Blank()

        Text(`${this.currentMonth.getFullYear()}年${this.currentMonth.getMonth() + 1}月`)
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)

        Blank()

        Button('›')
          .type(ButtonType.Normal)
          .fontSize(20)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
          .backgroundColor('transparent')
          .width(40)
          .height(40)
          .onClick(() => {
            this.nextMonth();
          })
      }
      .width('100%')
      .height(56)
      .padding({ left: 16, right: 16 })

      // 日历网格
      Column() {
        this.buildCalendarGrid()
      }
      .width('100%')
      .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
      .borderRadius(12)
      .margin({ left: 16, right: 16, bottom: 12 })
      .padding({ top: 12, bottom: 12 })

      // 详情区域（可下拉展开）
      if (this.showDetail) {
        this.buildDetailSection()
      } else {
        // 底部提示
        Column() {
          Text('点击日期查看详情')
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .margin({ bottom: 8 })
          Text('↓')
            .fontSize(20)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .opacity(0.5)
        }
        .width('100%')
        .padding({ top: 20, bottom: 20 })
      }
    }
    .width('100%')
    .flexGrow(1)
    .backgroundColor(Constants.COLOR_BACKGROUND)
  }
}
