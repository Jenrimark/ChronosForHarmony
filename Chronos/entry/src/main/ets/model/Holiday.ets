/**
 * 节假日类型
 */
export enum HolidayType {
  CHINESE = 'chinese',    // 中国节假日
  INTERNATIONAL = 'international'  // 国际节假日
}

/**
 * 节假日数据接口
 */
export interface HolidayData {
  name: string;
  date: string;
  type: HolidayType;
}

/**
 * 节假日JSON接口（API响应格式）
 */
export interface HolidayJSON {
  events: HolidayEvent[];
}

/**
 * 节假日事件接口
 */
export interface HolidayEvent {
  name: string;
  type: string;
  country?: string;
}

/**
 * 节假日模型
 */
export class Holiday {
  name: string = '';
  date: Date = new Date();
  type: HolidayType = HolidayType.CHINESE;

  constructor(data?: HolidayData) {
    if (data) {
      this.name = data.name;
      // 解析日期字符串 (MM/DD/YYYY 格式)
      const dateStr = data.date;
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        // MM/DD/YYYY -> new Date(YYYY, MM-1, DD)
        const month = parseInt(parts[0]) - 1; // 月份从0开始
        const day = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        this.date = new Date(year, month, day);
      } else {
        // 尝试直接解析日期字符串
        this.date = new Date(dateStr);
      }
      this.type = data.type;
    }
  }

  /**
   * 判断是否是中国节假日
   */
  isChinese(): boolean {
    return this.type === HolidayType.CHINESE;
  }

  /**
   * 判断是否是国际节假日
   */
  isInternational(): boolean {
    return this.type === HolidayType.INTERNATIONAL;
  }
}
