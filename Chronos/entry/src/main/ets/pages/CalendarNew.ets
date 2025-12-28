import { CalendarViewType, CalendarEvent } from '../model/CalendarEvent';
import { Holiday, MxnzpHolidayData } from '../model/Holiday';
import { Task } from '../model/Task';
import { TaskService } from '../service/TaskService';
import { HolidayService } from '../service/HolidayService';
import { EventService } from '../service/EventService';
import { Utils } from '../common/Utils';
import { Constants } from '../common/Constants';
import { TaskItem } from '../components/TaskItem';

// 组件导入
import { ViewTabs } from '../components/calendar/ViewTabs';
import { DateCell, CalendarDayData } from '../components/calendar/DateCell';
import { YearView } from '../components/calendar/YearView';
import { WeekView } from '../components/calendar/WeekView';
import { DayView } from '../components/calendar/DayView';
import { EventSheet } from '../components/calendar/EventSheet';
import { CalendarMenu, JumpToDateSheet, SearchEventSheet, SearchResultItem } from '../components/calendar/CalendarMenu';

/**
 * 增强版日历页面
 * 支持年/月/周/日四种视图
 */
@Component
export struct CalendarNewPage {
  @State currentView: CalendarViewType = CalendarViewType.MONTH;
  @State selectedDate: Date = new Date();
  @State currentMonth: Date = new Date();
  @State currentYear: number = new Date().getFullYear();
  @State calendarDays: CalendarDayData[] = [];
  @State events: CalendarEvent[] = [];
  @State allTasks: Task[] = [];
  @State selectedDateTasks: Task[] = [];
  @State selectedDateEvents: CalendarEvent[] = [];
  @State selectedCalendarInfo: MxnzpHolidayData | null = null;
  @State isLoading: boolean = false;
  @State showDetail: boolean = false;
  
  // 弹窗状态
  @State showEventSheet: boolean = false;
  @State showMenu: boolean = false;
  @State showJumpDate: boolean = false;
  @State showSearch: boolean = false;
  @State editingEvent: CalendarEvent | null = null;
  
  // 滑动相关
  private swipeStartX: number = 0;

  private taskService: TaskService = TaskService.getInstance();
  private holidayService: HolidayService = HolidayService.getInstance();
  private eventService: EventService = EventService.getInstance();
  private today: Date = new Date();
  
  // 24节气列表
  private readonly solarTermsList: string[] = [
    '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
    '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
    '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
    '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'
  ];

  aboutToAppear() {
    this.loadData();
  }

  /**
   * 加载所有数据
   */
  async loadData(): Promise<void> {
    await this.loadTasks();
    await this.loadEvents();
    await this.loadCalendarData();
  }

  /**
   * 加载任务
   */
  async loadTasks(): Promise<void> {
    this.allTasks = await this.taskService.getAllTasks();
    this.updateSelectedDateTasks();
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
   * 更新选中日期的日程事件
   */
  updateSelectedDateEvents(): void {
    const filtered = this.events.filter(event => event.isOnDate(this.selectedDate));
    this.selectedDateEvents = [...filtered];
  }

  /**
   * 判断是否是真正的24节气
   */
  isRealSolarTerm(solarTerms: string): boolean {
    if (!solarTerms || solarTerms === '无') {
      return false;
    }
    if (solarTerms.includes('后') || solarTerms.includes('前')) {
      return false;
    }
    return this.solarTermsList.includes(solarTerms);
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
   * 加载日程事件
   */
  async loadEvents(): Promise<void> {
    this.events = await this.eventService.getAllEvents();
    this.updateSelectedDateEvents();
  }

  /**
   * 加载日历数据
   */
  async loadCalendarData(): Promise<void> {
    this.isLoading = true;
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      await this.holidayService.getHolidayByDate(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    this.updateCalendarDays();
    this.isLoading = false;
    await this.loadSelectedDateInfo();
  }

  /**
   * 加载选中日期信息
   */
  async loadSelectedDateInfo(): Promise<void> {
    this.selectedCalendarInfo = await this.holidayService.getCalendarInfo(this.selectedDate);
    
    // 调试日志
    if (this.selectedCalendarInfo) {
      console.info(`CalendarNew: 选中日期信息 - suit: "${this.selectedCalendarInfo.suit}", avoid: "${this.selectedCalendarInfo.avoid}"`);
      console.info(`CalendarNew: 完整calendarInfo:`, JSON.stringify(this.selectedCalendarInfo));
    } else {
      console.warn('CalendarNew: selectedCalendarInfo 为 null');
    }
    
    this.updateSelectedDateTasks();
    this.updateSelectedDateEvents();
    this.showDetail = true;
  }

  /**
   * 更新日历日期数组
   */
  updateCalendarDays(): void {
    const days: CalendarDayData[] = [];
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayWeek = firstDay.getDay();
    const startDay = firstDayWeek === 0 ? 6 : firstDayWeek - 1;
    
    // 上月日期
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
    
    // 下月日期
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push(this.createCalendarDay(date, false));
    }
    
    this.calendarDays = days;
  }

  /**
   * 创建日历日期项
   */
  createCalendarDay(date: Date, isCurrentMonth: boolean): CalendarDayData {
    const day = new CalendarDayData();
    day.date = date;
    day.isCurrentMonth = isCurrentMonth;
    day.isToday = Utils.isSameDay(date, this.today);
    day.isSelected = Utils.isSameDay(date, this.selectedDate);
    day.taskCount = this.getTaskCountForDate(date);
    day.eventCount = this.getEventCountForDate(date);
    
    const dateKey = this.getDateKey(date);
    day.calendarInfo = this.holidayService.getCalendarFromCache(dateKey);
    day.holiday = this.holidayService.getHolidayFromCache(dateKey);
    
    return day;
  }

  /**
   * 获取日期键
   */
  getDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * 获取任务数量
   */
  getTaskCountForDate(date: Date): number {
    return this.allTasks.filter(task => {
      if (!task.dueDate) return false;
      return Utils.isSameDay(date, task.dueDate);
    }).length;
  }

  /**
   * 获取事件数量
   */
  getEventCountForDate(date: Date): number {
    return this.events.filter(event => event.isOnDate(date)).length;
  }

  /**
   * 视图切换
   */
  onViewChange(view: CalendarViewType): void {
    this.currentView = view;
    if (view === CalendarViewType.YEAR) {
      this.currentYear = this.selectedDate.getFullYear();
    }
  }

  /**
   * 选择日期
   */
  async onDateSelect(day: CalendarDayData): Promise<void> {
    if (!day.isCurrentMonth) {
      this.currentMonth = new Date(day.date.getFullYear(), day.date.getMonth(), 1);
      await this.loadCalendarData();
    }
    this.selectedDate = day.date;
    this.updateCalendarDays();
    await this.loadSelectedDateInfo();
  }

  /**
   * 从年视图选择月份
   */
  async onMonthSelect(year: number, month: number): Promise<void> {
    this.currentMonth = new Date(year, month, 1);
    this.selectedDate = new Date(year, month, 1);
    this.currentView = CalendarViewType.MONTH;
    await this.loadCalendarData();
  }

  /**
   * 上一个月/年
   */
  async prevPeriod(): Promise<void> {
    if (this.currentView === CalendarViewType.YEAR) {
      this.currentYear--;
    } else {
      const newMonth = new Date(this.currentMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      this.currentMonth = newMonth;
      await this.loadCalendarData();
    }
  }

  /**
   * 下一个月/年
   */
  async nextPeriod(): Promise<void> {
    if (this.currentView === CalendarViewType.YEAR) {
      this.currentYear++;
    } else {
      const newMonth = new Date(this.currentMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      this.currentMonth = newMonth;
      await this.loadCalendarData();
    }
  }

  /**
   * 新建日程
   */
  createEvent(): void {
    this.editingEvent = null;
    this.showEventSheet = true;
  }

  /**
   * 编辑日程
   */
  editEvent(event: CalendarEvent): void {
    this.editingEvent = event;
    this.showEventSheet = true;
  }

  /**
   * 保存日程
   */
  async saveEvent(event: CalendarEvent): Promise<void> {
    if (event.id > 0) {
      await this.eventService.updateEvent(event);
    } else {
      await this.eventService.createEvent(event);
    }
    await this.loadEvents();
    this.updateCalendarDays();
  }

  /**
   * 删除日程
   */
  async deleteEvent(event: CalendarEvent): Promise<void> {
    await this.eventService.deleteEvent(event.id);
    await this.loadEvents();
    this.updateCalendarDays();
    this.updateSelectedDateEvents();
  }

  /**
   * 构建日程项
   */
  @Builder
  buildEventItem(event: CalendarEvent) {
    Row() {
      // 时间
      Column() {
        if (event.isAllDay) {
          Text('全天')
            .fontSize(12)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
        } else {
          Text(Utils.formatDate(event.startTime, 'HH:mm'))
            .fontSize(14)
            .fontWeight(FontWeight.Medium)
            .fontColor(Constants.COLOR_PRIMARY)
          if (event.endTime) {
            Text(Utils.formatDate(event.endTime, 'HH:mm'))
              .fontSize(12)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
              .margin({ top: 2 })
          }
        }
      }
      .width(60)
      .alignItems(HorizontalAlign.Center)

      // 日程信息
      Column() {
        Text(event.title)
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
        
        if (event.location) {
          Text(`📍 ${event.location}`)
            .fontSize(13)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .margin({ top: 4 })
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
        }
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)
      .margin({ left: 12 })

      // 重要标记
      if (event.priority) {
        Text('⭐')
          .fontSize(18)
      }
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
    .borderRadius(12)
    .margin({ bottom: 8 })
    .onClick(() => {
      this.editEvent(event);
    })
  }

  /**
   * 跳转到日期
   */
  async jumpToDate(date: Date): Promise<void> {
    this.selectedDate = date;
    this.currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    this.currentYear = date.getFullYear();
    await this.loadCalendarData();
  }

  /**
   * 搜索日程
   */
  async searchEvents(keyword: string): Promise<SearchResultItem[]> {
    const results = await this.eventService.searchEvents(keyword);
    return results.map(event => {
      const item = new SearchResultItem();
      item.id = event.id;
      item.title = event.title;
      item.date = event.startTime;
      return item;
    });
  }

  /**
   * 获取标题文本
   */
  getTitleText(): string {
    if (this.currentView === CalendarViewType.YEAR) {
      return `${this.currentYear}年`;
    }
    return `${this.currentMonth.getFullYear()}年${this.currentMonth.getMonth() + 1}月`;
  }

  /**
   * 构建月视图
   */
  @Builder
  buildMonthView() {
    Column() {
      // 星期标题
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

      // 日期网格（支持滑动翻页）
      Grid() {
        ForEach(this.calendarDays, (day: CalendarDayData) => {
          GridItem() {
            DateCell({
              day: day,
              onSelect: (d: CalendarDayData) => {
                this.onDateSelect(d);
              }
            })
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
    .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
    .borderRadius(12)
    .margin({ left: 16, right: 16, bottom: 12 })
    .padding({ top: 8, bottom: 8 })
    .gesture(
      PanGesture({ direction: PanDirection.Horizontal })
        .onActionStart((event: GestureEvent) => {
          this.swipeStartX = event.offsetX;
        })
        .onActionEnd((event: GestureEvent) => {
          const deltaX = event.offsetX - this.swipeStartX;
          if (Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
              this.prevPeriod();
            } else {
              this.nextPeriod();
            }
          }
        })
    )
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
              .fontColor(this.selectedCalendarInfo.type === 0 ? Constants.COLOR_TEXT_SECONDARY : '#FFFFFF')
              .fontWeight(FontWeight.Medium)
          }
          .padding({ left: 12, right: 12, top: 6, bottom: 6 })
          .backgroundColor(this.selectedCalendarInfo.type === 0 ? '#F5F5F5' : Constants.COLOR_PRIMARY)
          .borderRadius(16)
        }
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 16, bottom: 8 })

      // 宜忌信息（API数据源时显示）
      if (this.selectedCalendarInfo && 
          (this.selectedCalendarInfo.suit && this.selectedCalendarInfo.suit.trim() || 
           this.selectedCalendarInfo.avoid && this.selectedCalendarInfo.avoid.trim())) {
        Column() {
          if (this.selectedCalendarInfo.suit && this.selectedCalendarInfo.suit.trim()) {
            Row() {
              Text('宜')
                .fontSize(12)
                .fontColor('#FFFFFF')
                .backgroundColor(Constants.COLOR_SUCCESS)
                .padding({ left: 6, right: 6, top: 2, bottom: 2 })
                .borderRadius(4)
              Text(this.selectedCalendarInfo.suit.replace(/\./g, ' ').trim())
                .fontSize(12)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
                .margin({ left: 8 })
                .maxLines(2)
                .textOverflow({ overflow: TextOverflow.Ellipsis })
                .layoutWeight(1)
            }
            .width('100%')
            .margin({ bottom: 4 })
          }
          
          if (this.selectedCalendarInfo.avoid && this.selectedCalendarInfo.avoid.trim()) {
            Row() {
              Text('忌')
                .fontSize(12)
                .fontColor('#FFFFFF')
                .backgroundColor(Constants.COLOR_DANGER)
                .padding({ left: 6, right: 6, top: 2, bottom: 2 })
                .borderRadius(4)
              Text(this.selectedCalendarInfo.avoid.replace(/\./g, ' ').trim())
                .fontSize(12)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
                .margin({ left: 8 })
                .maxLines(2)
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

      // 日程列表（在任务列表之前）
      if (this.selectedDateEvents.length > 0) {
        Row() {
          Text('日程安排')
            .fontSize(15)
            .fontWeight(FontWeight.Medium)
            .fontColor(Constants.COLOR_TEXT_PRIMARY)
          
          Blank()
          
          Text(`共 ${this.selectedDateEvents.length} 项`)
            .fontSize(12)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 12, bottom: 8 })

        Column() {
          ForEach(this.selectedDateEvents, (event: CalendarEvent) => {
            this.buildEventItem(event)
          })
        }
        .width('100%')
        .padding({ left: 16, right: 16, bottom: 16 })
      }

      // 任务列表
      if (this.selectedDateTasks.length > 0) {
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
        .padding({ left: 16, right: 16, top: this.selectedDateEvents.length > 0 ? 12 : 12, bottom: 8 })

        Column() {
          ForEach(this.selectedDateTasks, (task: Task) => {
            TaskItem({
              task: task,
              onTap: (task: Task) => {
                // 点击任务的处理（可以打开详情或编辑）
              },
              onComplete: (task: Task) => {
                this.onTaskComplete(task);
              },
              onDelete: (task: Task) => {
                this.onTaskDelete(task);
              }
            })
            .margin({ bottom: 8 })
          })
        }
        .width('100%')
        .padding({ left: 16, right: 16, bottom: 16 })
      }

      // 如果没有任务和日程，显示空状态
      if (this.selectedDateTasks.length === 0 && this.selectedDateEvents.length === 0) {
        Column() {
          Text('📅')
            .fontSize(40)
            .opacity(0.3)
          Text('这一天没有任务和日程')
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .margin({ top: 12 })
        }
        .width('100%')
        .height(120)
        .justifyContent(FlexAlign.Center)
      }
    }
    .width('100%')
    .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
    .borderRadius({ topLeft: 20, topRight: 20 })
    .padding({ bottom: 16 })
    .flexShrink(0)
  }

  build() {
    Stack() {
      Column() {
        // 顶部导航
        Row() {
          Button('‹')
            .type(ButtonType.Normal)
            .fontSize(24)
            .fontColor(Constants.COLOR_TEXT_PRIMARY)
            .backgroundColor(Color.Transparent)
            .width(44)
            .height(44)
            .onClick(() => this.prevPeriod())

          Blank()

          Column() {
            Text(this.getTitleText())
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

          // 菜单按钮
          Button('⋮')
            .type(ButtonType.Normal)
            .fontSize(20)
            .fontColor(Constants.COLOR_TEXT_PRIMARY)
            .backgroundColor(Color.Transparent)
            .width(44)
            .height(44)
            .onClick(() => {
              this.showMenu = !this.showMenu;
            })

          Button('›')
            .type(ButtonType.Normal)
            .fontSize(24)
            .fontColor(Constants.COLOR_TEXT_PRIMARY)
            .backgroundColor(Color.Transparent)
            .width(44)
            .height(44)
            .onClick(() => this.nextPeriod())
        }
        .width('100%')
        .height(56)
        .padding({ left: 8, right: 8 })

        // 视图切换标签
        ViewTabs({
          currentView: $currentView,
          onViewChange: (view: CalendarViewType) => this.onViewChange(view)
        })

        // 视图内容
        if (this.currentView === CalendarViewType.YEAR) {
          YearView({
            currentYear: this.currentYear,
            selectedDate: $selectedDate,
            onMonthSelect: (year: number, month: number) => this.onMonthSelect(year, month)
          })
        } else if (this.currentView === CalendarViewType.MONTH) {
          Scroll() {
            Column() {
              // 日历视图
              Column() {
                this.buildMonthView()
              }
              .margin({ bottom: 12 })
              
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
                .height(200)
                .justifyContent(FlexAlign.Center)
              }
            }
            .width('100%')
          }
          .layoutWeight(1)
          .scrollBar(BarState.Off)
          .edgeEffect(EdgeEffect.Spring)
        } else if (this.currentView === CalendarViewType.WEEK) {
          WeekView({
            selectedDate: $selectedDate,
            events: this.events,
            onEventTap: (event: CalendarEvent) => this.editEvent(event),
            onDateSelect: (date: Date) => {
              this.selectedDate = date;
            }
          })
        } else if (this.currentView === CalendarViewType.DAY) {
          DayView({
            selectedDate: $selectedDate,
            events: this.events,
            calendarInfo: this.selectedCalendarInfo,
            onEventTap: (event: CalendarEvent) => this.editEvent(event)
          })
        }
      }
      .width('100%')
      .height('100%')
      .backgroundColor(Constants.COLOR_BACKGROUND)

      // 菜单弹出层
      if (this.showMenu) {
        Column()
          .width('100%')
          .height('100%')
          .backgroundColor('rgba(0,0,0,0.3)')
          .onClick(() => {
            this.showMenu = false;
          })
        
        Column() {
          CalendarMenu({
            isShow: $showMenu,
            onJumpToDate: () => {
              this.showJumpDate = true;
            },
            onSearch: () => {
              this.showSearch = true;
            },
            onSettings: () => {},
            onHelp: () => {}
          })
        }
        .position({ x: '50%', y: 100 })
      }

      // 添加日程悬浮按钮
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
        .translate({ x: -76, y: -76 })
        .zIndex(10)
        .onClick(() => {
          this.createEvent();
        })

      // 日程编辑弹窗
      if (this.showEventSheet) {
        Column() {
          // 半透明遮罩
          Column()
            .width('100%')
            .height('100%')
            .backgroundColor('#000000')
            .opacity(0.5)
            .onClick(() => {
              this.showEventSheet = false;
            })
        }
        .width('100%')
        .height('100%')
        .position({ x: 0, y: 0 })
        .zIndex(100)

        Column() {
          EventSheet({
            isShow: $showEventSheet,
            editEvent: this.editingEvent,
            selectedDate: $selectedDate,
            onSave: (event: CalendarEvent) => this.saveEvent(event),
            onDelete: (event: CalendarEvent) => this.deleteEvent(event)
          })
        }
        .width('100%')
        .height('90%')
        .backgroundColor(Constants.COLOR_BACKGROUND)
        .borderRadius({ topLeft: 20, topRight: 20 })
        .position({ x: 0, y: '10%' })
        .zIndex(101)
      }
    }
    .width('100%')
    .height('100%')
  }
}
