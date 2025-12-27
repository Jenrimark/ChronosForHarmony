import { TaskItem } from '../components/TaskItem';
import { TaskService } from '../service/TaskService';
import { HolidayService } from '../service/HolidayService';
import { Task } from '../model/Task';
import { Holiday, MxnzpHolidayData } from '../model/Holiday';
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
  holiday: Holiday | null;
  calendarInfo: MxnzpHolidayData | null;
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
  @State selectedCalendarInfo: MxnzpHolidayData | null = null;
  @State tapActionId: number = 0;
  @State completeActionId: number = 0;
  @State deleteActionId: number = 0;
  @State showDetail: boolean = false;
  @State isLoading: boolean = false;

  private taskService: TaskService = TaskService.getInstance();
  private holidayService: HolidayService = HolidayService.getInstance();
  private today: Date = new Date();

  aboutToAppear() {
    this.loadTasks();
    this.loadCalendarData();
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
   * 加载日历数据（节假日和万年历信息）
   */
  async loadCalendarData(): Promise<void> {
    this.isLoading = true;
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    // 获取当月所有日期
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    console.info(`加载${year}年${month + 1}月日历数据`);
    
    // 逐日加载数据（会自动缓存）
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      await this.holidayService.getHolidayByDate(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    this.updateCalendarDays();
    this.isLoading = false;
    
    // 加载选中日期的详细信息
    await this.loadSelectedDateInfo();
  }

  /**
   * 加载选中日期的详细信息
   */
  async loadSelectedDateInfo(): Promise<void> {
    this.selectedCalendarInfo = await this.holidayService.getCalendarInfo(this.selectedDate);
  }

  /**
   * 更新日历日期数组
   */
  updateCalendarDays(): void {
    const days: CalendarDay[] = [];
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const firstDayWeek = firstDay.getDay();
    const startDay = firstDayWeek === 0 ? 6 : firstDayWeek - 1;
    
    // 上个月的日期
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push(this.createCalendarDay(date, false));
    }
    
    // 当月日期
    const daysInMonth = lastDay.getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push(this.createCalendarDay(date, true));
    }
    
    // 下个月日期（补齐到42天）
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push(this.createCalendarDay(date, false));
    }
    
    this.calendarDays = [...days];
  }

  /**
   * 创建日历日期项
   */
  createCalendarDay(date: Date, isCurrentMonth: boolean): CalendarDay {
    const isToday = Utils.isSameDay(date, this.today);
    const isSelected = Utils.isSameDay(date, this.selectedDate);
    const taskCount = this.getTaskCountForDate(date);
    
    // 从缓存获取节假日和万年历信息（使用公开方法）
    const dateKey = this.getDateKey(date);
    const calendarInfo = this.holidayService.getCalendarFromCache(dateKey);
    const holiday = this.holidayService.getHolidayFromCache(dateKey);
    
    return {
      date: date,
      isCurrentMonth: isCurrentMonth,
      isToday: isToday,
      isSelected: isSelected,
      taskCount: taskCount,
      holiday: holiday,
      calendarInfo: calendarInfo
    };
  }

  /**
   * 获取日期键
   */
  private getDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
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
   * 选择日期
   */
  async onDateSelect(day: CalendarDay): Promise<void> {
    if (!day.isCurrentMonth) {
      this.currentMonth = new Date(day.date.getFullYear(), day.date.getMonth(), 1);
      await this.loadCalendarData();
    }
    this.selectedDate = day.date;
    this.updateSelectedDateTasks();
    await this.loadSelectedDateInfo();
    this.showDetail = true;
  }

  /**
   * 上一个月
   */
  async prevMonth(): Promise<void> {
    const newMonth = new Date(this.currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    this.currentMonth = newMonth;
    await this.loadCalendarData();
  }

  /**
   * 下一个月
   */
  async nextMonth(): Promise<void> {
    const newMonth = new Date(this.currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    this.currentMonth = newMonth;
    await this.loadCalendarData();
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
   * 24节气列表
   */
  private readonly solarTermsList: string[] = [
    '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
    '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
    '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
    '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'
  ];

  /**
   * 判断是否是真正的24节气（不是"xx后"、"xx前"）
   */
  isRealSolarTerm(solarTerms: string): boolean {
    if (!solarTerms || solarTerms === '无') {
      return false;
    }
    // 如果包含"后"或"前"，说明不是节气当天
    if (solarTerms.includes('后') || solarTerms.includes('前')) {
      return false;
    }
    // 检查是否在24节气列表中
    return this.solarTermsList.includes(solarTerms);
  }

  /**
   * 获取日历单元格显示的文本
   * 优先级：节日 > 节气 > 农历
   */
  getCalendarDisplayText(day: CalendarDay): string {
    if (!day.calendarInfo) {
      return '';
    }
    
    // 1. 如果是节假日（type=2），显示节日名称
    if (day.holiday && day.holiday.dayType === 2 && day.calendarInfo.typeDes) {
      // 截取节日名称（可能是"国庆节"、"春节"等）
      const festivalName = day.calendarInfo.typeDes;
      if (festivalName !== '工作日' && festivalName !== '休息日') {
        return festivalName;
      }
    }
    
    // 2. 如果是真正的24节气，显示节气
    if (this.isRealSolarTerm(day.calendarInfo.solarTerms)) {
      return day.calendarInfo.solarTerms;
    }
    
    // 3. 默认显示农历日期
    return day.calendarInfo.lunarCalendar || '';
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
    await this.taskService.deleteTask(task);
    await this.loadTasks();
  }

  /**
   * 跳转到任务详情
   */
  onTaskTap(task: Task): void {
    console.info('点击任务:', task.title);
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
   * 构建日历网格
   */
  @Builder
  buildCalendarGrid() {
    Column() {
      // 星期标题行
      Row() {
        ForEach(['一', '二', '三', '四', '五', '六', '日'], (day: string, index: number) => {
          Text(day)
            .fontSize(14)
            .fontColor(index >= 5 ? Constants.COLOR_DANGER : Constants.COLOR_TEXT_SECONDARY)
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

      // 农历日期、节气或节日
      if (day.isCurrentMonth && day.calendarInfo) {
        Text(this.getCalendarDisplayText(day))
          .fontSize(9)
          .fontColor(this.getLunarTextColor(day))
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Clip })
      }

      // 任务/节假日标记
      Row() {
        if (day.taskCount > 0) {
          Text('●')
            .fontSize(6)
            .fontColor(Constants.COLOR_PRIMARY)
        }
        if (day.holiday && (day.holiday.dayType === 1 || day.holiday.dayType === 2)) {
          Text(day.holiday.dayType === 2 ? '休' : '●')
            .fontSize(day.holiday.dayType === 2 ? 8 : 6)
            .fontColor(Constants.COLOR_DANGER)
            .margin({ left: day.taskCount > 0 ? 2 : 0 })
        }
      }
      .justifyContent(FlexAlign.Center)
      .height(10)
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .backgroundColor(day.isSelected ? Constants.COLOR_PRIMARY_LIGHT : (day.isToday ? '#FFF0E8' : 'transparent'))
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
    // 节假日用红色
    if (day.holiday && day.holiday.dayType === 2) {
      return Constants.COLOR_DANGER;
    }
    // 真正的24节气用绿色
    if (day.calendarInfo && this.isRealSolarTerm(day.calendarInfo.solarTerms)) {
      return Constants.COLOR_SUCCESS;
    }
    return Constants.COLOR_TEXT_TERTIARY;
  }

  /**
   * 获取日期文字颜色
   */
  getDateTextColor(day: CalendarDay): string {
    if (!day.isCurrentMonth) {
      return Constants.COLOR_TEXT_TERTIARY;
    }
    if (day.isSelected) {
      return Constants.COLOR_PRIMARY_DARK;
    }
    if (day.isToday) {
      return Constants.COLOR_PRIMARY;
    }
    // 周末用红色
    const weekDay = day.date.getDay();
    if (weekDay === 0 || weekDay === 6) {
      return Constants.COLOR_DANGER;
    }
    if (day.holiday && day.holiday.dayType === 2) {
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
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT_PRIMARY)
          
          Row() {
            Text(Utils.formatDate(this.selectedDate, 'YYYY年'))
              .fontSize(13)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
            
            if (this.selectedCalendarInfo) {
              Text(`${this.selectedCalendarInfo.lunarCalendar}`)
                .fontSize(13)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
                .margin({ left: 8 })
              
              Text(`${this.selectedCalendarInfo.yearTips}年`)
                .fontSize(13)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
                .margin({ left: 8 })
            }
          }
          .margin({ top: 4 })
          
          // 节气、星座、属相
          if (this.selectedCalendarInfo) {
            Row() {
              if (this.isRealSolarTerm(this.selectedCalendarInfo.solarTerms)) {
                Text(`🌿 ${this.selectedCalendarInfo.solarTerms}`)
                  .fontSize(12)
                  .fontColor(Constants.COLOR_SUCCESS)
              }
              Text(`⭐ ${this.selectedCalendarInfo.constellation}`)
                .fontSize(12)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
                .margin({ left: 8 })
              Text(`🐾 ${this.selectedCalendarInfo.chineseZodiac}`)
                .fontSize(12)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
                .margin({ left: 8 })
            }
            .margin({ top: 6 })
          }
        }
        .alignItems(HorizontalAlign.Start)

        Blank()

        // 节假日/工作日标签
        if (this.selectedCalendarInfo) {
          Column() {
            Text(this.selectedCalendarInfo.typeDes)
              .fontSize(14)
              .fontColor(this.selectedCalendarInfo.type === 0 ? Constants.COLOR_TEXT_SECONDARY : Constants.COLOR_PRIMARY)
              .fontWeight(FontWeight.Medium)
          }
          .padding({ left: 12, right: 12, top: 6, bottom: 6 })
          .backgroundColor(this.selectedCalendarInfo.type === 0 ? '#F5F5F5' : Constants.COLOR_PRIMARY_LIGHT)
          .borderRadius(16)
        }
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 16, bottom: 8 })

      // 宜忌信息
      if (this.selectedCalendarInfo && (this.selectedCalendarInfo.suit || this.selectedCalendarInfo.avoid)) {
        Column() {
          if (this.selectedCalendarInfo.suit) {
            Row() {
              Text('宜')
                .fontSize(12)
                .fontColor('#FFFFFF')
                .backgroundColor(Constants.COLOR_SUCCESS)
                .padding({ left: 6, right: 6, top: 2, bottom: 2 })
                .borderRadius(4)
              Text(this.selectedCalendarInfo.suit.replace(/\./g, ' '))
                .fontSize(12)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
                .margin({ left: 8 })
                .maxLines(1)
                .textOverflow({ overflow: TextOverflow.Ellipsis })
                .layoutWeight(1)
            }
            .width('100%')
            .margin({ bottom: 4 })
          }
          
          if (this.selectedCalendarInfo.avoid) {
            Row() {
              Text('忌')
                .fontSize(12)
                .fontColor('#FFFFFF')
                .backgroundColor(Constants.COLOR_DANGER)
                .padding({ left: 6, right: 6, top: 2, bottom: 2 })
                .borderRadius(4)
              Text(this.selectedCalendarInfo.avoid.replace(/\./g, ' '))
                .fontSize(12)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
                .margin({ left: 8 })
                .maxLines(1)
                .textOverflow({ overflow: TextOverflow.Ellipsis })
                .layoutWeight(1)
            }
            .width('100%')
          }
        }
        .width('100%')
        .padding({ left: 16, right: 16, bottom: 12 })
      }

      Divider()
        .color(Constants.COLOR_DIVIDER)
        .margin({ left: 16, right: 16 })

      // 任务列表
      if (this.selectedDateTasks.length === 0) {
        Column() {
          Text('📝')
            .fontSize(40)
            .opacity(0.3)
          Text('这一天没有任务')
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .margin({ top: 12 })
        }
        .width('100%')
        .height(120)
        .justifyContent(FlexAlign.Center)
      } else {
        Row() {
          Text('任务列表')
            .fontSize(15)
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
          .fontSize(24)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
          .backgroundColor('transparent')
          .width(44)
          .height(44)
          .onClick(() => {
            this.prevMonth();
          })

        Blank()

        Column() {
          Text(`${this.currentMonth.getFullYear()}年${this.currentMonth.getMonth() + 1}月`)
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT_PRIMARY)
          
          if (this.isLoading) {
            Text('加载中...')
              .fontSize(11)
              .fontColor(Constants.COLOR_TEXT_TERTIARY)
          }
        }

        Blank()

        Button('›')
          .type(ButtonType.Normal)
          .fontSize(24)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
          .backgroundColor('transparent')
          .width(44)
          .height(44)
          .onClick(() => {
            this.nextMonth();
          })
      }
      .width('100%')
      .height(56)
      .padding({ left: 8, right: 8 })

      // 日历网格
      Column() {
        this.buildCalendarGrid()
      }
      .width('100%')
      .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
      .borderRadius(12)
      .margin({ left: 16, right: 16, bottom: 12 })
      .padding({ top: 8, bottom: 8 })

      // 详情区域
      if (this.showDetail) {
        this.buildDetailSection()
      } else {
        Column() {
          Text('点击日期查看详情')
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
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
