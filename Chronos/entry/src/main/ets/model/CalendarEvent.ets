/**
 * 日历视图类型枚举
 */
export enum CalendarViewType {
  YEAR = 'year',
  MONTH = 'month',
  WEEK = 'week',
  DAY = 'day'
}

/**
 * 提醒类型枚举
 */
export enum ReminderType {
  NONE = 'none',
  AT_TIME = 'at_time',
  FIVE_MIN = '5min',
  TEN_MIN = '10min',
  THIRTY_MIN = '30min',
  ONE_HOUR = '1hour',
  ONE_DAY = '1day'
}

/**
 * 重复规则枚举
 */
export enum RepeatRule {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

/**
 * 日程事件接口
 */
export interface CalendarEventData {
  id: number;
  title: string;
  location: string;
  isAllDay: boolean;
  startTime: number;      // 时间戳
  endTime: number;        // 时间戳
  reminder: ReminderType;
  priority: boolean;
  repeatRule: RepeatRule;
  calendarId: number;
  createdAt: number;      // 时间戳
  updatedAt: number;      // 时间戳
}

/**
 * 日程事件类
 */
export class CalendarEvent {
  id: number = 0;
  title: string = '';
  location: string = '';
  isAllDay: boolean = false;
  startTime: Date = new Date();
  endTime: Date = new Date();
  reminder: ReminderType = ReminderType.NONE;
  priority: boolean = false;
  repeatRule: RepeatRule = RepeatRule.NONE;
  calendarId: number = 1;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();

  constructor(data?: CalendarEventData) {
    if (data) {
      this.id = data.id;
      this.title = data.title;
      this.location = data.location;
      this.isAllDay = data.isAllDay;
      this.startTime = new Date(data.startTime);
      this.endTime = new Date(data.endTime);
      this.reminder = data.reminder;
      this.priority = data.priority;
      this.repeatRule = data.repeatRule;
      this.calendarId = data.calendarId;
      this.createdAt = new Date(data.createdAt);
      this.updatedAt = new Date(data.updatedAt);
    }
  }

  /**
   * 转换为数据对象（用于存储）
   */
  toData(): CalendarEventData {
    const data: CalendarEventData = {
      id: this.id,
      title: this.title,
      location: this.location,
      isAllDay: this.isAllDay,
      startTime: this.startTime.getTime(),
      endTime: this.endTime.getTime(),
      reminder: this.reminder,
      priority: this.priority,
      repeatRule: this.repeatRule,
      calendarId: this.calendarId,
      createdAt: this.createdAt.getTime(),
      updatedAt: this.updatedAt.getTime()
    };
    return data;
  }

  /**
   * 从数据对象创建实例
   */
  static fromData(data: CalendarEventData): CalendarEvent {
    return new CalendarEvent(data);
  }

  /**
   * 判断是否是有效事件（标题非空）
   */
  isValid(): boolean {
    return this.title.trim().length > 0;
  }

  /**
   * 判断事件是否在指定日期
   */
  isOnDate(date: Date): boolean {
    const eventStart = new Date(this.startTime);
    const eventEnd = new Date(this.endTime);
    const targetStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    const targetEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    
    // 事件开始时间在目标日期内，或事件跨越目标日期
    return (eventStart <= targetEnd && eventEnd >= targetStart);
  }

  /**
   * 判断事件是否在指定日期范围内
   */
  isInDateRange(startDate: Date, endDate: Date): boolean {
    const eventStart = this.startTime.getTime();
    const eventEnd = this.endTime.getTime();
    const rangeStart = startDate.getTime();
    const rangeEnd = endDate.getTime();
    
    return (eventStart <= rangeEnd && eventEnd >= rangeStart);
  }

  /**
   * 获取事件时长（分钟）
   */
  getDurationMinutes(): number {
    const diff = this.endTime.getTime() - this.startTime.getTime();
    return Math.floor(diff / (1000 * 60));
  }

  /**
   * 获取事件时长（小时）
   */
  getDurationHours(): number {
    return this.getDurationMinutes() / 60;
  }

  /**
   * 获取格式化的时间范围字符串
   */
  getTimeRangeString(): string {
    if (this.isAllDay) {
      return '全天';
    }
    const startHour = this.startTime.getHours().toString().padStart(2, '0');
    const startMin = this.startTime.getMinutes().toString().padStart(2, '0');
    const endHour = this.endTime.getHours().toString().padStart(2, '0');
    const endMin = this.endTime.getMinutes().toString().padStart(2, '0');
    return `${startHour}:${startMin} - ${endHour}:${endMin}`;
  }

  /**
   * 获取提醒时间（Date对象）
   */
  getReminderTime(): Date | null {
    if (this.reminder === ReminderType.NONE) {
      return null;
    }
    
    const startTime = this.startTime.getTime();
    let reminderTime = startTime;
    
    if (this.reminder === ReminderType.AT_TIME) {
      reminderTime = startTime;
    } else if (this.reminder === ReminderType.FIVE_MIN) {
      reminderTime = startTime - 5 * 60 * 1000;
    } else if (this.reminder === ReminderType.TEN_MIN) {
      reminderTime = startTime - 10 * 60 * 1000;
    } else if (this.reminder === ReminderType.THIRTY_MIN) {
      reminderTime = startTime - 30 * 60 * 1000;
    } else if (this.reminder === ReminderType.ONE_HOUR) {
      reminderTime = startTime - 60 * 60 * 1000;
    } else if (this.reminder === ReminderType.ONE_DAY) {
      reminderTime = startTime - 24 * 60 * 60 * 1000;
    }
    
    return new Date(reminderTime);
  }

  /**
   * 克隆事件
   */
  clone(): CalendarEvent {
    return CalendarEvent.fromData(this.toData());
  }
}

/**
 * 提醒类型显示文本
 */
export function getReminderTypeText(type: ReminderType): string {
  if (type === ReminderType.NONE) return '无提醒';
  if (type === ReminderType.AT_TIME) return '准时';
  if (type === ReminderType.FIVE_MIN) return '5分钟前';
  if (type === ReminderType.TEN_MIN) return '10分钟前';
  if (type === ReminderType.THIRTY_MIN) return '30分钟前';
  if (type === ReminderType.ONE_HOUR) return '1小时前';
  if (type === ReminderType.ONE_DAY) return '1天前';
  return '无提醒';
}

/**
 * 重复规则显示文本
 */
export function getRepeatRuleText(rule: RepeatRule): string {
  if (rule === RepeatRule.NONE) return '不重复';
  if (rule === RepeatRule.DAILY) return '每天';
  if (rule === RepeatRule.WEEKLY) return '每周';
  if (rule === RepeatRule.MONTHLY) return '每月';
  if (rule === RepeatRule.YEARLY) return '每年';
  return '不重复';
}

/**
 * 视图类型显示文本
 */
export function getViewTypeText(type: CalendarViewType): string {
  if (type === CalendarViewType.YEAR) return '年';
  if (type === CalendarViewType.MONTH) return '月';
  if (type === CalendarViewType.WEEK) return '周';
  if (type === CalendarViewType.DAY) return '日';
  return '月';
}
