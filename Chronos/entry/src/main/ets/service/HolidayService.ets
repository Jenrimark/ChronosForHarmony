import util from '@ohos.util';
import { preferences } from '@kit.ArkData';
import { http } from '@kit.NetworkKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { Context } from '@kit.AbilityKit';
import { Holiday, HolidayType, MxnzpHolidayData } from '../model/Holiday';
import { Constants } from '../common/Constants';

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
 * mxnzp API响应格式
 */
interface MxnzpYearResponse {
  code: number;
  msg: string;
  data?: MxnzpHolidayData[];
}

/**
 * 节假日服务类 - 支持本地数据和API数据两种数据源
 */
export class HolidayService {
  private static instance: HolidayService;
  private holidaysCache: Map<string, Holiday> = new Map();
  private calendarCache: Map<string, MxnzpHolidayData> = new Map();
  private localDataLoaded: boolean = false;
  private localCalendarData: LocalCalendarData[] = [];
  private localDataMap: Map<string, LocalCalendarData> = new Map();
  private context: Context | null = null;
  private dataSource: number = Constants.DATA_SOURCE_LOCAL; // 默认使用本地数据
  private preferencesStore: preferences.Preferences | null = null;
  private yearDataCache: Map<number, MxnzpHolidayData[]> = new Map(); // 按年份缓存API数据

  private constructor() {
    this.initPreferences();
  }

  static getInstance(): HolidayService {
    if (!HolidayService.instance) {
      HolidayService.instance = new HolidayService();
    }
    return HolidayService.instance;
  }

  /**
   * 初始化Preferences
   */
  private async initPreferences(): Promise<void> {
    if (!this.context) {
      // 如果context未设置，使用默认值
      this.dataSource = Constants.DATA_SOURCE_LOCAL;
      return;
    }

    try {
      this.preferencesStore = await preferences.getPreferences(this.context, 'chronos_prefs');
      // 读取数据源配置
      const savedSource = await this.preferencesStore.get(Constants.PREF_CALENDAR_DATA_SOURCE, Constants.DATA_SOURCE_LOCAL);
      this.dataSource = savedSource as number;
      console.info(`HolidayService: 数据源设置为 ${this.dataSource === Constants.DATA_SOURCE_LOCAL ? '本地数据' : 'API数据'}`);
    } catch (error) {
      console.error('HolidayService: 初始化Preferences失败:', error);
      this.dataSource = Constants.DATA_SOURCE_LOCAL; // 默认使用本地数据
    }
  }

  /**
   * 设置应用上下文（用于读取资源文件）
   */
  async setContext(context: Context): Promise<void> {
    this.context = context;
    // 重新初始化Preferences
    await this.initPreferences();
  }

  /**
   * 获取当前数据源
   */
  getDataSource(): number {
    return this.dataSource;
  }

  /**
   * 设置数据源
   * @param source 0=本地数据, 1=API数据
   */
  async setDataSource(source: number): Promise<void> {
    if (source !== Constants.DATA_SOURCE_LOCAL && source !== Constants.DATA_SOURCE_API) {
      console.error('HolidayService: 无效的数据源:', source);
      return;
    }

    this.dataSource = source;
    
    // 保存到Preferences
    if (this.preferencesStore) {
      try {
        await this.preferencesStore.put(Constants.PREF_CALENDAR_DATA_SOURCE, source);
        await this.preferencesStore.flush();
        console.info(`HolidayService: 数据源已切换为 ${source === Constants.DATA_SOURCE_LOCAL ? '本地数据' : 'API数据'}`);
      } catch (error) {
        console.error('HolidayService: 保存数据源配置失败:', error);
      }
    }

    // 清空缓存，强制重新加载
    this.clearCache();
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
    // 解析日期，直接判断星期几（更可靠）
    const dateParts = dateKey.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // 月份从0开始
    const day = parseInt(dateParts[2]);
    const date = new Date(year, month, day);
    const jsWeekDay = date.getDay(); // JavaScript的getDay(): 0=周日, 6=周六
    
    // 判断是否是周末：周六(6)或周日(0)
    const isWeekendDay = jsWeekDay === 0 || jsWeekDay === 6;
    
    // 判断类型：周末为休息日(1)，工作日为(0)
    const type = isWeekendDay ? 1 : 0;
    const typeDes = isWeekendDay ? '休息日' : '工作日';
    
    // 转换星期几为1-7格式（周一=1, 周日=7）
    const weekDay = jsWeekDay === 0 ? 7 : jsWeekDay;
    
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

    let mxnzpData: MxnzpHolidayData | null = null;

    // 根据数据源选择获取方式
    if (this.dataSource === Constants.DATA_SOURCE_API) {
      // 使用API获取数据
      mxnzpData = await this.getDataFromAPI(date);
    } else {
      // 使用本地数据
      await this.loadLocalData();
      const localData = this.localDataMap.get(dateKey);
      if (localData) {
        mxnzpData = this.convertToMxnzpFormat(localData, dateKey);
      } else {
        console.warn(`HolidayService: 未找到日期 ${dateKey} 的本地数据`);
      }
    }

    if (!mxnzpData) {
      return null;
    }

    const holiday = this.parseHolidayData(mxnzpData);
    
    // 缓存结果
    this.holidaysCache.set(dateKey, holiday);
    this.calendarCache.set(dateKey, mxnzpData);
    
    return holiday;
  }

  /**
   * 从API获取数据
   */
  private async getDataFromAPI(date: Date): Promise<MxnzpHolidayData | null> {
    const dateKey = this.getDateKey(date);
    const year = date.getFullYear();

    try {
      // 检查年份缓存
      if (!this.yearDataCache.has(year)) {
        // 加载整年数据
        await this.loadYearDataFromAPI(year);
      }

      const yearData = this.yearDataCache.get(year);
      if (!yearData) {
        console.warn(`HolidayService: 未找到 ${year} 年的API数据`);
        // API失败时，降级到本地数据
        return await this.getDataFromLocal(date);
      }

      // 查找指定日期的数据
      const dayData = yearData.find(item => item.date === dateKey);
      if (dayData) {
        // API返回的数据应该包含suit和avoid字段
        // 确保这些字段存在，如果API没有返回则使用空字符串
        const result: MxnzpHolidayData = {
          date: dayData.date,
          weekDay: dayData.weekDay,
          yearTips: dayData.yearTips || '',
          type: dayData.type,
          detailsType: dayData.detailsType,
          typeDes: dayData.typeDes || '',
          chineseZodiac: dayData.chineseZodiac || '',
          solarTerms: dayData.solarTerms || '',
          lunarCalendar: dayData.lunarCalendar || '',
          suit: dayData.suit || '',  // 宜事项
          avoid: dayData.avoid || '', // 忌事项
          dayOfYear: dayData.dayOfYear || 0,
          weekOfYear: dayData.weekOfYear || 0,
          constellation: dayData.constellation || ''
        };
        
        // 调试日志：检查suit和avoid字段
        console.info(`HolidayService: ${dateKey} API数据 - suit: "${result.suit}", avoid: "${result.avoid}"`);
        console.info(`HolidayService: ${dateKey} 完整数据:`, JSON.stringify(result));
        
        return result;
      }

      console.warn(`HolidayService: 未找到日期 ${dateKey} 的API数据`);
      // API数据中找不到，降级到本地数据
      return await this.getDataFromLocal(date);
    } catch (error) {
      console.error(`HolidayService: 从API获取数据失败:`, error);
      // API失败时，降级到本地数据
      return await this.getDataFromLocal(date);
    }
  }

  /**
   * 从本地数据获取（降级方案）
   */
  private async getDataFromLocal(date: Date): Promise<MxnzpHolidayData | null> {
    const dateKey = this.getDateKey(date);
    await this.loadLocalData();
    const localData = this.localDataMap.get(dateKey);
    if (localData) {
      return this.convertToMxnzpFormat(localData, dateKey);
    }
    return null;
  }

  /**
   * 从API加载整年数据
   */
  private async loadYearDataFromAPI(year: number): Promise<void> {
    try {
      const url = `${Constants.MXNZP_HOLIDAY_URL}/${year}?ignoreHoliday=false&app_id=${Constants.MXNZP_APP_ID}&app_secret=${Constants.MXNZP_APP_SECRET}`;
      
      console.info(`HolidayService: 正在从API加载 ${year} 年数据...`);
      
      const httpRequest = http.createHttp();
      const response = await httpRequest.request(url, {
        method: http.RequestMethod.GET,
        connectTimeout: 10000,
        readTimeout: 10000
      });

      if (response.responseCode !== 200) {
        throw new Error(`API请求失败，状态码: ${response.responseCode}`);
      }

      const responseText = await response.result.toString();
      const data: MxnzpYearResponse = JSON.parse(responseText);

      if (data.code !== 1 || !data.data) {
        throw new Error(`API返回错误: ${data.msg || '未知错误'}`);
      }

      // 调试：打印API返回的原始数据结构（前3条）
      console.info(`HolidayService: API返回数据示例（前3条）:`);
      for (let i = 0; i < Math.min(3, data.data.length); i++) {
        const item = data.data[i];
        console.info(`HolidayService: [${i}] date: ${item.date}, suit: "${item.suit}", avoid: "${item.avoid}"`);
        console.info(`HolidayService: [${i}] 完整数据:`, JSON.stringify(item));
      }

      // 缓存整年数据
      this.yearDataCache.set(year, data.data);
      console.info(`HolidayService: 成功加载 ${year} 年数据，共 ${data.data.length} 条`);

      httpRequest.destroy();
    } catch (error) {
      console.error(`HolidayService: 加载 ${year} 年API数据失败:`, error);
      // ArkTS要求throw只能抛出Error类型
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`加载 ${year} 年API数据失败: ${errorMessage}`);
    }
  }

  /**
   * 获取指定日期的万年历信息
   */
  async getCalendarInfo(date: Date): Promise<MxnzpHolidayData | null> {
    const dateKey = this.getDateKey(date);
    
    if (this.calendarCache.has(dateKey)) {
      const cached = this.calendarCache.get(dateKey) as MxnzpHolidayData;
      console.info(`HolidayService: ${dateKey} 从缓存获取 - suit: "${cached.suit}", avoid: "${cached.avoid}"`);
      return cached;
    }

    // 如果缓存中没有，先获取数据
    await this.getHolidayByDate(date);
    const result = this.calendarCache.get(dateKey) || null;
    if (result) {
      console.info(`HolidayService: ${dateKey} 获取后 - suit: "${result.suit}", avoid: "${result.avoid}"`);
    }
    return result;
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
      suit: data.suit || '',  // 确保有值，API返回的宜事项
      avoid: data.avoid || '', // 确保有值，API返回的忌事项
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
    this.yearDataCache.clear(); // 同时清空API年份缓存
    console.info('HolidayService: 缓存已清空');
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
