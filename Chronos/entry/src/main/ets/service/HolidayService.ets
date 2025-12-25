import util from '@ohos.util';
import { Holiday, HolidayType, MxnzpHolidayData } from '../model/Holiday';

/**
 * 公历日期接口
 */
interface GregorianDate {
  year: number;
  month: number;
  date: number;
}

/**
 * 农历日期接口
 */
interface LunarDate {
  year: string;
  month: string;
  date: string;
  leapMonth: boolean;
}

/**
 * 本地万年历JSON数据格式
 */
interface LocalCalendarData {
  day: string;
  gregorian: GregorianDate;
  lunar: LunarDate;
  zodiac: string;
  solarTerm?: string;
}

/**
 * 星座信息接口
 */
interface ConstellationInfo {
  name: string;
  startMonth: number;
  startDate: number;
  endMonth: number;
  endDate: number;
}

/**
 * 节假日服务类 - 从本地 JSON 文件读取万年历信息
 */
export class HolidayService {
  private static instance: HolidayService;
  private holidaysCache: Map<string, Holiday> = new Map();
  private calendarCache: Map<string, MxnzpHolidayData> = new Map();
  private localDataLoaded: boolean = false;
  private localCalendarData: LocalCalendarData[] = [];
  private localDataMap: Map<string, LocalCalendarData> = new Map();
  private context: Context | null = null;


  private constructor() {}

  static getInstance(): HolidayService {
    if (!HolidayService.instance) {
      HolidayService.instance = new HolidayService();
    }
    return HolidayService.instance;
  }

  /**
   * 设置应用上下文（用于读取资源文件）
   */
  setContext(context: Context): void {
    this.context = context;
  }

  /**
   * 加载本地万年历数据
   */
  async loadLocalData(): Promise<void> {
    if (this.localDataLoaded) {
      return;
    }

    try {
      if (!this.context) {
        console.error('HolidayService: Context未设置，无法读取本地数据');
        return;
      }

      const resourceManager = this.context.resourceManager;
      const rawFile = await resourceManager.getRawFileContent('calendar.json');
      const textDecoder = new util.TextDecoder('utf-8');
      const jsonStr = textDecoder.decodeToString(rawFile);
      
      this.localCalendarData = JSON.parse(jsonStr) as LocalCalendarData[];
      
      // 构建日期索引Map，加速查询
      for (const item of this.localCalendarData) {
        const dateKey = this.formatDateKey(item.gregorian.year, item.gregorian.month, item.gregorian.date);
        this.localDataMap.set(dateKey, item);
      }
      
      this.localDataLoaded = true;
      console.info(`HolidayService: 成功加载本地万年历数据，共 ${this.localCalendarData.length} 条`);
    } catch (error) {
      console.error('HolidayService: 加载本地万年历数据失败:', error);
    }
  }

  /**
   * 格式化日期键
   */
  private formatDateKey(year: number, month: number, date: number): string {
    const m = month.toString().padStart(2, '0');
    const d = date.toString().padStart(2, '0');
    return `${year}-${m}-${d}`;
  }

  /**
   * 获取日期键（用于缓存）
   */
  private getDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * 星期转换为数字 (1-7)
   */
  private weekDayToNumber(day: string): number {
    if (day === '星期一') return 1;
    if (day === '星期二') return 2;
    if (day === '星期三') return 3;
    if (day === '星期四') return 4;
    if (day === '星期五') return 5;
    if (day === '星期六') return 6;
    if (day === '星期日') return 7;
    return 1;
  }

  /**
   * 判断是否是周末
   */
  private isWeekend(weekDay: number): boolean {
    return weekDay === 6 || weekDay === 7;
  }


  /**
   * 获取星座列表
   */
  private getConstellationList(): ConstellationInfo[] {
    const list: ConstellationInfo[] = [];
    
    const c1: ConstellationInfo = { name: '摩羯座', startMonth: 1, startDate: 1, endMonth: 1, endDate: 19 };
    const c2: ConstellationInfo = { name: '水瓶座', startMonth: 1, startDate: 20, endMonth: 2, endDate: 18 };
    const c3: ConstellationInfo = { name: '双鱼座', startMonth: 2, startDate: 19, endMonth: 3, endDate: 20 };
    const c4: ConstellationInfo = { name: '白羊座', startMonth: 3, startDate: 21, endMonth: 4, endDate: 19 };
    const c5: ConstellationInfo = { name: '金牛座', startMonth: 4, startDate: 20, endMonth: 5, endDate: 20 };
    const c6: ConstellationInfo = { name: '双子座', startMonth: 5, startDate: 21, endMonth: 6, endDate: 21 };
    const c7: ConstellationInfo = { name: '巨蟹座', startMonth: 6, startDate: 22, endMonth: 7, endDate: 22 };
    const c8: ConstellationInfo = { name: '狮子座', startMonth: 7, startDate: 23, endMonth: 8, endDate: 22 };
    const c9: ConstellationInfo = { name: '处女座', startMonth: 8, startDate: 23, endMonth: 9, endDate: 22 };
    const c10: ConstellationInfo = { name: '天秤座', startMonth: 9, startDate: 23, endMonth: 10, endDate: 23 };
    const c11: ConstellationInfo = { name: '天蝎座', startMonth: 10, startDate: 24, endMonth: 11, endDate: 22 };
    const c12: ConstellationInfo = { name: '射手座', startMonth: 11, startDate: 23, endMonth: 12, endDate: 21 };
    const c13: ConstellationInfo = { name: '摩羯座', startMonth: 12, startDate: 22, endMonth: 12, endDate: 31 };
    
    list.push(c1);
    list.push(c2);
    list.push(c3);
    list.push(c4);
    list.push(c5);
    list.push(c6);
    list.push(c7);
    list.push(c8);
    list.push(c9);
    list.push(c10);
    list.push(c11);
    list.push(c12);
    list.push(c13);
    
    return list;
  }

  /**
   * 根据月日获取星座
   */
  private getConstellation(month: number, date: number): string {
    const constellations = this.getConstellationList();

    for (const c of constellations) {
      if (c.startMonth === c.endMonth) {
        if (month === c.startMonth && date >= c.startDate && date <= c.endDate) {
          return c.name;
        }
      } else {
        if ((month === c.startMonth && date >= c.startDate) || (month === c.endMonth && date <= c.endDate)) {
          return c.name;
        }
      }
    }
    return '未知';
  }

  /**
   * 将本地数据转换为 MxnzpHolidayData 格式（兼容现有代码）
   */
  private convertToMxnzpFormat(localData: LocalCalendarData, dateKey: string): MxnzpHolidayData {
    const weekDay = this.weekDayToNumber(localData.day);
    const isWeekendDay = this.isWeekend(weekDay);
    
    // 判断类型：周末为休息日(1)，工作日为(0)
    const type = isWeekendDay ? 1 : 0;
    const typeDes = isWeekendDay ? '休息日' : '工作日';
    
    const solarTermValue = localData.solarTerm ? localData.solarTerm : '无';

    const result: MxnzpHolidayData = {
      date: dateKey,
      weekDay: weekDay,
      yearTips: localData.lunar.year,
      type: type,
      typeDes: typeDes,
      chineseZodiac: localData.zodiac,
      solarTerms: solarTermValue,
      lunarCalendar: localData.lunar.date,
      suit: '',
      avoid: '',
      dayOfYear: 0,
      weekOfYear: 0,
      constellation: this.getConstellation(localData.gregorian.month, localData.gregorian.date)
    };
    
    return result;
  }


  /**
   * 获取指定日期的节假日及万年历信息
   */
  async getHolidayByDate(date: Date, retryCount: number = 0): Promise<Holiday | null> {
    const dateKey = this.getDateKey(date);
    
    // 检查缓存
    if (this.holidaysCache.has(dateKey)) {
      return this.holidaysCache.get(dateKey) as Holiday;
    }

    // 确保本地数据已加载
    await this.loadLocalData();

    // 从本地数据查找
    const localData = this.localDataMap.get(dateKey);
    if (!localData) {
      console.warn(`HolidayService: 未找到日期 ${dateKey} 的本地数据`);
      return null;
    }

    // 转换为兼容格式
    const mxnzpData = this.convertToMxnzpFormat(localData, dateKey);
    const holiday = this.parseHolidayData(mxnzpData);
    
    // 缓存结果
    this.holidaysCache.set(dateKey, holiday);
    this.calendarCache.set(dateKey, mxnzpData);
    
    return holiday;
  }

  /**
   * 获取指定日期的万年历信息
   */
  async getCalendarInfo(date: Date): Promise<MxnzpHolidayData | null> {
    const dateKey = this.getDateKey(date);
    
    if (this.calendarCache.has(dateKey)) {
      return this.calendarCache.get(dateKey) as MxnzpHolidayData;
    }

    await this.getHolidayByDate(date);
    return this.calendarCache.get(dateKey) || null;
  }

  /**
   * 批量获取日期的节假日
   */
  async getHolidaysByDates(dates: Date[]): Promise<Holiday[]> {
    const holidays: Holiday[] = [];
    
    for (const date of dates) {
      const holiday = await this.getHolidayByDate(date);
      if (holiday && (holiday.dayType === 1 || holiday.dayType === 2)) {
        holidays.push(holiday);
      }
    }
    
    return holidays;
  }

  /**
   * 获取指定月份的节假日
   */
  async getHolidaysByMonth(year: number, month: number): Promise<Holiday[]> {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    const holidays: Holiday[] = [];
    
    console.info(`获取${year}年${month + 1}月的节假日`);
    
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const holiday = await this.getHolidayByDate(new Date(currentDate));
      if (holiday && (holiday.dayType === 1 || holiday.dayType === 2)) {
        holidays.push(holiday);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    console.info(`查询完成，找到${holidays.length}个节假日`);
    return holidays;
  }


  /**
   * 解析节假日数据
   */
  private parseHolidayData(data: MxnzpHolidayData): Holiday {
    let holidayType: HolidayType;
    let name: string;
    
    if (data.type === 0) {
      holidayType = HolidayType.WORKDAY;
      name = '工作日';
    } else if (data.type === 1) {
      holidayType = HolidayType.HOLIDAY;
      name = data.typeDes || '休息日';
    } else if (data.type === 2) {
      holidayType = HolidayType.FESTIVAL;
      name = data.typeDes || '节假日';
    } else {
      holidayType = HolidayType.WORKDAY;
      name = data.typeDes || '工作日';
    }

    return new Holiday({
      name: name,
      date: data.date,
      type: holidayType,
      dayType: data.type,
      detailsType: data.detailsType,
      lunarCalendar: data.lunarCalendar,
      solarTerms: data.solarTerms,
      constellation: data.constellation,
      chineseZodiac: data.chineseZodiac,
      suit: data.suit,
      avoid: data.avoid,
      yearTips: data.yearTips,
      weekDay: data.weekDay
    });
  }

  /**
   * 清空缓存
   */
  clearCache(): void {
    this.holidaysCache.clear();
    this.calendarCache.clear();
  }

  /**
   * 从缓存获取节假日信息
   */
  getHolidayFromCache(dateKey: string): Holiday | null {
    return this.holidaysCache.get(dateKey) || null;
  }

  /**
   * 从缓存获取万年历信息
   */
  getCalendarFromCache(dateKey: string): MxnzpHolidayData | null {
    return this.calendarCache.get(dateKey) || null;
  }

  /**
   * 兼容旧方法
   */
  async getHolidaysByDate(date: Date): Promise<Holiday[]> {
    const holiday = await this.getHolidayByDate(date);
    if (holiday && (holiday.dayType === 1 || holiday.dayType === 2)) {
      return [holiday];
    }
    return [];
  }

  /**
   * 重试失败的日期（本地读取不需要，保留接口兼容）
   */
  async retryFailedDates(): Promise<void> {
    // 本地读取不需要重试
  }
}
