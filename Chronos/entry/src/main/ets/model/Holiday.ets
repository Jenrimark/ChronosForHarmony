/**
 * 节假日类型
 */
export enum HolidayType {
  WORKDAY = 'workday',      // 工作日 (type: 0)
  HOLIDAY = 'holiday',      // 假日/休息日 (type: 1)
  FESTIVAL = 'festival',    // 节假日 (type: 2)
  WEEKEND = 'weekend',      // 周末
  WORK_SHIFT = 'work_shift' // 调休日（上班）
}

/**
 * 节假日数据接口
 */
export interface HolidayData {
  name: string;
  date: string;
  type: HolidayType;
  dayType?: number;        // 类型 0工作日 1假日 2节假日
  detailsType?: number;    // 详细类型 0工作日 1假日 2普通节假日 3三倍工资节假日
  lunarCalendar?: string;  // 农历日期
  solarTerms?: string;     // 节气
  constellation?: string;  // 星座
  chineseZodiac?: string;  // 属相
  suit?: string;           // 宜
  avoid?: string;          // 忌
  yearTips?: string;       // 天干地支纪年
  weekDay?: number;        // 星期几 1-7
}

/**
 * mxnzp API响应格式
 */
export interface MxnzpApiResponse {
  code: number;
  msg: string;
  data?: MxnzpHolidayData;
}

/**
 * mxnzp API节假日数据
 */
export interface MxnzpHolidayData {
  date: string;              // 当前日期 YYYY-MM-DD
  weekDay: number;           // 当前周第几天 1-周一 ... 7-周日
  yearTips: string;          // 天干地支纪年法 例如：戊戌
  type: number;              // 类型 0工作日 1假日 2节假日
  detailsType?: number;      // 详细类型 0工作日 1假日 2普通节假日 3三倍工资节假日
  typeDes: string;           // 类型描述 比如 国庆,休息日,工作日
  chineseZodiac: string;     // 属相 例如：狗
  solarTerms: string;        // 节气描述 例如：小雪
  lunarCalendar: string;     // 农历日期
  suit: string;              // 宜事项
  avoid: string;             // 忌事项
  dayOfYear: number;         // 这一年的第几天
  weekOfYear: number;        // 这一年的第几周
  constellation: string;     // 星座
  indexWorkDayOfMonth?: number; // 当前月的第几个工作日
}

/**
 * 旧的API响应格式（兼容）
 */
export interface HolidayJSON {
  events?: HolidayEvent[];
}

/**
 * 旧的节假日事件接口（兼容）
 */
export interface HolidayEvent {
  name: string;
  type: string;
  country?: string;
}

// 兼容旧接口
export interface TianApiResponse {
  code: number;
  msg: string;
  result?: TianApiHolidayResult;
}

export interface TianApiHolidayResult {
  date?: string;
  info?: string;
  name?: string;
  daycode?: number;
  isnotwork?: number;
}

/**
 * 节假日模型
 */
export class Holiday {
  name: string = '';
  date: Date = new Date();
  type: HolidayType = HolidayType.WORKDAY;
  dayType: number = 0;           // 类型 0工作日 1假日 2节假日
  detailsType: number = 0;       // 详细类型
  lunarCalendar: string = '';    // 农历日期
  solarTerms: string = '';       // 节气
  constellation: string = '';    // 星座
  chineseZodiac: string = '';    // 属相
  suit: string = '';             // 宜
  avoid: string = '';            // 忌
  yearTips: string = '';         // 天干地支纪年
  weekDay: number = 1;           // 星期几

  constructor(data?: HolidayData) {
    if (data) {
      this.name = data.name ?? '';
      this.dayType = data.dayType ?? 0;
      this.detailsType = data.detailsType ?? 0;
      this.lunarCalendar = data.lunarCalendar ?? '';
      this.solarTerms = data.solarTerms ?? '';
      this.constellation = data.constellation ?? '';
      this.chineseZodiac = data.chineseZodiac ?? '';
      this.suit = data.suit ?? '';
      this.avoid = data.avoid ?? '';
      this.yearTips = data.yearTips ?? '';
      this.weekDay = data.weekDay ?? 1;
      
      // 解析日期字符串 (支持 YYYY-MM-DD 格式)
      const dateStr = data.date;
      if (dateStr) {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const year = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1;
          const day = parseInt(parts[2]);
          this.date = new Date(year, month, day);
        } else {
          this.date = new Date(dateStr);
        }
      }
      
      // 设置类型
      if (data.type) {
        this.type = data.type;
      } else {
        this.type = this.getTypeFromDayType(this.dayType);
      }
    }
  }

  /**
   * 根据dayType获取HolidayType
   */
  private getTypeFromDayType(dayType: number): HolidayType {
    if (dayType === 0) return HolidayType.WORKDAY;
    if (dayType === 1) return HolidayType.HOLIDAY;
    if (dayType === 2) return HolidayType.FESTIVAL;
    return HolidayType.WORKDAY;
  }

  /**
   * 判断是否是工作日
   */
  isWorkday(): boolean {
    return this.type === HolidayType.WORKDAY || this.dayType === 0;
  }

  /**
   * 判断是否是假日（休息日）
   */
  isHoliday(): boolean {
    return this.type === HolidayType.HOLIDAY || this.dayType === 1;
  }

  /**
   * 判断是否是节假日
   */
  isFestival(): boolean {
    return this.type === HolidayType.FESTIVAL || this.dayType === 2;
  }

  /**
   * 判断是否是三倍工资节假日
   */
  isTriplePay(): boolean {
    return this.detailsType === 3;
  }

  /**
   * 判断是否需要休息（非工作日）
   */
  isRestDay(): boolean {
    return this.dayType === 1 || this.dayType === 2;
  }

  /**
   * 兼容旧方法
   */
  isWeekend(): boolean {
    return this.type === HolidayType.WEEKEND;
  }

  isWorkShift(): boolean {
    return this.type === HolidayType.WORK_SHIFT;
  }

  isNotWork(): boolean {
    return this.isRestDay();
  }

  isChinese(): boolean {
    return this.isFestival();
  }

  isInternational(): boolean {
    return false;
  }
}
