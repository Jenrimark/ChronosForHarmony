import relationalStore from '@ohos.data.relationalStore';
import { CalendarEvent, CalendarEventData, ReminderType, RepeatRule } from '../model/CalendarEvent';

/**
 * 数据库配置
 */
const STORE_CONFIG: relationalStore.StoreConfig = {
  name: 'calendar_events.db',
  securityLevel: relationalStore.SecurityLevel.S1
};

/**
 * 表名
 */
const TABLE_NAME = 'calendar_events';

/**
 * 建表SQL
 */
const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    location TEXT,
    is_all_day INTEGER DEFAULT 0,
    start_time INTEGER NOT NULL,
    end_time INTEGER NOT NULL,
    reminder TEXT DEFAULT 'none',
    priority INTEGER DEFAULT 0,
    repeat_rule TEXT DEFAULT 'none',
    calendar_id INTEGER DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )
`;

/**
 * 日程数据仓库类
 * 负责日程数据的持久化存储
 */
export class EventRepository {
  private static instance: EventRepository;
  private rdbStore: relationalStore.RdbStore | null = null;
  private context: Context | null = null;
  private initialized: boolean = false;

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): EventRepository {
    if (!EventRepository.instance) {
      EventRepository.instance = new EventRepository();
    }
    return EventRepository.instance;
  }

  /**
   * 设置上下文
   */
  setContext(context: Context): void {
    this.context = context;
  }


  /**
   * 初始化数据库
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (!this.context) {
      console.error('EventRepository: Context未设置');
      return;
    }

    try {
      this.rdbStore = await relationalStore.getRdbStore(this.context, STORE_CONFIG);
      await this.rdbStore.executeSql(CREATE_TABLE_SQL);
      this.initialized = true;
      console.info('EventRepository: 数据库初始化成功');
    } catch (error) {
      console.error('EventRepository: 数据库初始化失败:', error);
    }
  }

  /**
   * 确保数据库已初始化
   */
  private async ensureInitialized(): Promise<boolean> {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.initialized && this.rdbStore !== null;
  }

  /**
   * 插入日程
   */
  async insert(event: CalendarEvent): Promise<number> {
    const ready = await this.ensureInitialized();
    if (!ready || !this.rdbStore) {
      return -1;
    }

    try {
      const valueBucket = this.eventToValueBucket(event);
      const rowId = await this.rdbStore.insert(TABLE_NAME, valueBucket);
      console.info(`EventRepository: 插入日程成功, rowId=${rowId}`);
      return rowId;
    } catch (error) {
      console.error('EventRepository: 插入日程失败:', error);
      return -1;
    }
  }

  /**
   * 更新日程
   */
  async update(event: CalendarEvent): Promise<boolean> {
    const ready = await this.ensureInitialized();
    if (!ready || !this.rdbStore) {
      return false;
    }

    try {
      const valueBucket = this.eventToValueBucket(event);
      const predicates = new relationalStore.RdbPredicates(TABLE_NAME);
      predicates.equalTo('id', event.id);
      
      const rowCount = await this.rdbStore.update(valueBucket, predicates);
      console.info(`EventRepository: 更新日程成功, 影响行数=${rowCount}`);
      return rowCount > 0;
    } catch (error) {
      console.error('EventRepository: 更新日程失败:', error);
      return false;
    }
  }

  /**
   * 删除日程
   */
  async delete(id: number): Promise<boolean> {
    const ready = await this.ensureInitialized();
    if (!ready || !this.rdbStore) {
      return false;
    }

    try {
      const predicates = new relationalStore.RdbPredicates(TABLE_NAME);
      predicates.equalTo('id', id);
      
      const rowCount = await this.rdbStore.delete(predicates);
      console.info(`EventRepository: 删除日程成功, 影响行数=${rowCount}`);
      return rowCount > 0;
    } catch (error) {
      console.error('EventRepository: 删除日程失败:', error);
      return false;
    }
  }

  /**
   * 根据ID查询日程
   */
  async queryById(id: number): Promise<CalendarEvent | null> {
    const ready = await this.ensureInitialized();
    if (!ready || !this.rdbStore) {
      return null;
    }

    try {
      const predicates = new relationalStore.RdbPredicates(TABLE_NAME);
      predicates.equalTo('id', id);
      
      const resultSet = await this.rdbStore.query(predicates);
      if (resultSet.goToFirstRow()) {
        const event = this.resultSetToEvent(resultSet);
        resultSet.close();
        return event;
      }
      resultSet.close();
      return null;
    } catch (error) {
      console.error('EventRepository: 查询日程失败:', error);
      return null;
    }
  }


  /**
   * 查询所有日程
   */
  async queryAll(): Promise<CalendarEvent[]> {
    const ready = await this.ensureInitialized();
    if (!ready || !this.rdbStore) {
      return [];
    }

    try {
      const predicates = new relationalStore.RdbPredicates(TABLE_NAME);
      predicates.orderByAsc('start_time');
      
      const resultSet = await this.rdbStore.query(predicates);
      const events: CalendarEvent[] = [];
      
      while (resultSet.goToNextRow()) {
        events.push(this.resultSetToEvent(resultSet));
      }
      resultSet.close();
      return events;
    } catch (error) {
      console.error('EventRepository: 查询所有日程失败:', error);
      return [];
    }
  }

  /**
   * 根据日期范围查询日程
   */
  async queryByDateRange(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    const ready = await this.ensureInitialized();
    if (!ready || !this.rdbStore) {
      return [];
    }

    try {
      const startTime = startDate.getTime();
      const endTime = endDate.getTime();
      
      const predicates = new relationalStore.RdbPredicates(TABLE_NAME);
      // 查询在时间范围内的事件：事件开始时间 <= 范围结束 AND 事件结束时间 >= 范围开始
      predicates.lessThanOrEqualTo('start_time', endTime);
      predicates.greaterThanOrEqualTo('end_time', startTime);
      predicates.orderByAsc('start_time');
      
      const resultSet = await this.rdbStore.query(predicates);
      const events: CalendarEvent[] = [];
      
      while (resultSet.goToNextRow()) {
        events.push(this.resultSetToEvent(resultSet));
      }
      resultSet.close();
      return events;
    } catch (error) {
      console.error('EventRepository: 按日期范围查询失败:', error);
      return [];
    }
  }

  /**
   * 根据日期查询日程
   */
  async queryByDate(date: Date): Promise<CalendarEvent[]> {
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    return this.queryByDateRange(startOfDay, endOfDay);
  }

  /**
   * 根据关键词搜索日程
   */
  async searchByKeyword(keyword: string): Promise<CalendarEvent[]> {
    const ready = await this.ensureInitialized();
    if (!ready || !this.rdbStore) {
      return [];
    }

    try {
      const predicates = new relationalStore.RdbPredicates(TABLE_NAME);
      predicates.like('title', `%${keyword}%`);
      predicates.orderByDesc('start_time');
      
      const resultSet = await this.rdbStore.query(predicates);
      const events: CalendarEvent[] = [];
      
      while (resultSet.goToNextRow()) {
        events.push(this.resultSetToEvent(resultSet));
      }
      resultSet.close();
      return events;
    } catch (error) {
      console.error('EventRepository: 搜索日程失败:', error);
      return [];
    }
  }

  /**
   * 获取日程数量
   */
  async getCount(): Promise<number> {
    const ready = await this.ensureInitialized();
    if (!ready || !this.rdbStore) {
      return 0;
    }

    try {
      const predicates = new relationalStore.RdbPredicates(TABLE_NAME);
      const resultSet = await this.rdbStore.query(predicates);
      const count = resultSet.rowCount;
      resultSet.close();
      return count;
    } catch (error) {
      console.error('EventRepository: 获取数量失败:', error);
      return 0;
    }
  }


  /**
   * 将 CalendarEvent 转换为 ValuesBucket
   */
  private eventToValueBucket(event: CalendarEvent): relationalStore.ValuesBucket {
    const bucket: relationalStore.ValuesBucket = {
      'title': event.title,
      'location': event.location,
      'is_all_day': event.isAllDay ? 1 : 0,
      'start_time': event.startTime.getTime(),
      'end_time': event.endTime.getTime(),
      'reminder': event.reminder,
      'priority': event.priority ? 1 : 0,
      'repeat_rule': event.repeatRule,
      'calendar_id': event.calendarId,
      'created_at': event.createdAt.getTime(),
      'updated_at': event.updatedAt.getTime()
    };
    return bucket;
  }

  /**
   * 将 ResultSet 转换为 CalendarEvent
   */
  private resultSetToEvent(resultSet: relationalStore.ResultSet): CalendarEvent {
    const id = resultSet.getLong(resultSet.getColumnIndex('id'));
    const title = resultSet.getString(resultSet.getColumnIndex('title'));
    const location = resultSet.getString(resultSet.getColumnIndex('location'));
    const isAllDay = resultSet.getLong(resultSet.getColumnIndex('is_all_day')) === 1;
    const startTime = resultSet.getLong(resultSet.getColumnIndex('start_time'));
    const endTime = resultSet.getLong(resultSet.getColumnIndex('end_time'));
    const reminder = resultSet.getString(resultSet.getColumnIndex('reminder')) as ReminderType;
    const priority = resultSet.getLong(resultSet.getColumnIndex('priority')) === 1;
    const repeatRule = resultSet.getString(resultSet.getColumnIndex('repeat_rule')) as RepeatRule;
    const calendarId = resultSet.getLong(resultSet.getColumnIndex('calendar_id'));
    const createdAt = resultSet.getLong(resultSet.getColumnIndex('created_at'));
    const updatedAt = resultSet.getLong(resultSet.getColumnIndex('updated_at'));

    const data: CalendarEventData = {
      id: id,
      title: title,
      location: location,
      isAllDay: isAllDay,
      startTime: startTime,
      endTime: endTime,
      reminder: reminder,
      priority: priority,
      repeatRule: repeatRule,
      calendarId: calendarId,
      createdAt: createdAt,
      updatedAt: updatedAt
    };

    return CalendarEvent.fromData(data);
  }

  /**
   * 清空所有数据（用于测试）
   */
  async clearAll(): Promise<boolean> {
    const ready = await this.ensureInitialized();
    if (!ready || !this.rdbStore) {
      return false;
    }

    try {
      const predicates = new relationalStore.RdbPredicates(TABLE_NAME);
      await this.rdbStore.delete(predicates);
      console.info('EventRepository: 清空所有数据成功');
      return true;
    } catch (error) {
      console.error('EventRepository: 清空数据失败:', error);
      return false;
    }
  }
}
