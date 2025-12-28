import { Context } from '@kit.AbilityKit';
import { CalendarEvent, ReminderType, RepeatRule } from '../model/CalendarEvent';
import { EventRepository } from '../repository/EventRepository';

/**
 * 日程服务类
 * 提供日程的业务逻辑处理
 */
export class EventService {
  private static instance: EventService;
  private repository: EventRepository;
  private eventsCache: CalendarEvent[] = [];
  private cacheLoaded: boolean = false;

  private constructor() {
    this.repository = EventRepository.getInstance();
  }

  /**
   * 获取单例实例
   */
  static getInstance(): EventService {
    if (!EventService.instance) {
      EventService.instance = new EventService();
    }
    return EventService.instance;
  }

  /**
   * 设置上下文（传递给Repository）
   */
  setContext(context: Context): void {
    this.repository.setContext(context);
  }

  /**
   * 初始化服务
   */
  async initialize(): Promise<void> {
    await this.loadAllEvents();
  }

  /**
   * 加载所有日程到缓存
   */
  private async loadAllEvents(): Promise<void> {
    this.eventsCache = await this.repository.queryAll();
    this.cacheLoaded = true;
    console.info(`EventService: 加载了 ${this.eventsCache.length} 个日程`);
  }

  /**
   * 刷新缓存
   */
  async refreshCache(): Promise<void> {
    await this.loadAllEvents();
  }

  /**
   * 创建日程
   */
  async createEvent(event: CalendarEvent): Promise<number> {
    // 验证
    if (!event.isValid()) {
      console.error('EventService: 日程标题不能为空');
      return -1;
    }

    // 设置时间戳
    const now = new Date();
    event.createdAt = now;
    event.updatedAt = now;

    // 插入数据库
    const id = await this.repository.insert(event);
    if (id > 0) {
      event.id = id;
      this.eventsCache.push(event);
      this.sortCache();
    }
    return id;
  }

  /**
   * 更新日程
   */
  async updateEvent(event: CalendarEvent): Promise<boolean> {
    // 验证
    if (!event.isValid()) {
      console.error('EventService: 日程标题不能为空');
      return false;
    }

    // 更新时间戳
    event.updatedAt = new Date();

    // 更新数据库
    const success = await this.repository.update(event);
    if (success) {
      // 更新缓存
      const index = this.eventsCache.findIndex(e => e.id === event.id);
      if (index >= 0) {
        this.eventsCache[index] = event;
        this.sortCache();
      }
    }
    return success;
  }

  /**
   * 删除日程
   */
  async deleteEvent(id: number): Promise<boolean> {
    const success = await this.repository.delete(id);
    if (success) {
      // 从缓存移除
      const index = this.eventsCache.findIndex(e => e.id === id);
      if (index >= 0) {
        this.eventsCache.splice(index, 1);
      }
    }
    return success;
  }

  /**
   * 根据ID获取日程
   */
  async getEventById(id: number): Promise<CalendarEvent | null> {
    // 先从缓存查找
    const cached = this.eventsCache.find(e => e.id === id);
    if (cached) {
      return cached;
    }
    // 从数据库查找
    return await this.repository.queryById(id);
  }

  /**
   * 获取所有日程
   */
  async getAllEvents(): Promise<CalendarEvent[]> {
    if (!this.cacheLoaded) {
      await this.loadAllEvents();
    }
    return [...this.eventsCache];
  }


  /**
   * 获取指定日期的日程
   */
  async getEventsByDate(date: Date): Promise<CalendarEvent[]> {
    if (!this.cacheLoaded) {
      await this.loadAllEvents();
    }
    
    // 从缓存筛选
    const events = this.eventsCache.filter(event => event.isOnDate(date));
    
    // 添加重复事件的实例
    const repeatingEvents = this.getRepeatingEventsForDate(date);
    
    return [...events, ...repeatingEvents];
  }

  /**
   * 获取指定日期范围的日程
   */
  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    if (!this.cacheLoaded) {
      await this.loadAllEvents();
    }
    
    // 从缓存筛选
    const events = this.eventsCache.filter(event => event.isInDateRange(startDate, endDate));
    
    return events;
  }

  /**
   * 搜索日程
   */
  async searchEvents(keyword: string): Promise<CalendarEvent[]> {
    if (!keyword || keyword.trim().length === 0) {
      return [];
    }
    
    const lowerKeyword = keyword.toLowerCase();
    
    // 先从缓存搜索
    if (this.cacheLoaded) {
      return this.eventsCache.filter(event => 
        event.title.toLowerCase().includes(lowerKeyword) ||
        event.location.toLowerCase().includes(lowerKeyword)
      );
    }
    
    // 从数据库搜索
    return await this.repository.searchByKeyword(keyword);
  }

  /**
   * 获取指定日期的重复事件实例
   */
  private getRepeatingEventsForDate(date: Date): CalendarEvent[] {
    const instances: CalendarEvent[] = [];
    
    for (const event of this.eventsCache) {
      if (event.repeatRule === RepeatRule.NONE) {
        continue;
      }
      
      // 检查是否匹配重复规则
      if (this.matchesRepeatRule(event, date)) {
        // 创建该日期的实例
        const instance = event.clone();
        instance.startTime = this.adjustDateToTarget(event.startTime, date);
        instance.endTime = this.adjustDateToTarget(event.endTime, date);
        instances.push(instance);
      }
    }
    
    return instances;
  }

  /**
   * 检查日期是否匹配重复规则
   */
  private matchesRepeatRule(event: CalendarEvent, targetDate: Date): boolean {
    const eventDate = event.startTime;
    
    // 目标日期必须在事件开始日期之后
    if (targetDate < eventDate) {
      return false;
    }
    
    // 如果是同一天，不需要生成重复实例
    if (this.isSameDay(eventDate, targetDate)) {
      return false;
    }
    
    if (event.repeatRule === RepeatRule.DAILY) {
      return true;
    }
    
    if (event.repeatRule === RepeatRule.WEEKLY) {
      return eventDate.getDay() === targetDate.getDay();
    }
    
    if (event.repeatRule === RepeatRule.MONTHLY) {
      return eventDate.getDate() === targetDate.getDate();
    }
    
    if (event.repeatRule === RepeatRule.YEARLY) {
      return eventDate.getMonth() === targetDate.getMonth() &&
             eventDate.getDate() === targetDate.getDate();
    }
    
    return false;
  }

  /**
   * 将时间调整到目标日期
   */
  private adjustDateToTarget(sourceDate: Date, targetDate: Date): Date {
    return new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
      sourceDate.getHours(),
      sourceDate.getMinutes(),
      sourceDate.getSeconds()
    );
  }

  /**
   * 判断是否是同一天
   */
  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  /**
   * 排序缓存（按开始时间升序）
   */
  private sortCache(): void {
    this.eventsCache.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  /**
   * 获取日程数量
   */
  async getEventCount(): Promise<number> {
    if (this.cacheLoaded) {
      return this.eventsCache.length;
    }
    return await this.repository.getCount();
  }

  /**
   * 获取指定日期的日程数量
   */
  getEventCountForDate(date: Date): number {
    if (!this.cacheLoaded) {
      return 0;
    }
    return this.eventsCache.filter(event => event.isOnDate(date)).length;
  }

  /**
   * 清空所有日程（用于测试）
   */
  async clearAllEvents(): Promise<boolean> {
    const success = await this.repository.clearAll();
    if (success) {
      this.eventsCache = [];
    }
    return success;
  }
}
