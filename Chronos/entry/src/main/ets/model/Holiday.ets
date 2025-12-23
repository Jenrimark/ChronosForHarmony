/**
 * 节假日类型（根据daycode）
 */
export enum HolidayType {
  WORKDAY = 'workday',      // 工作日 (daycode: 0)
  HOLIDAY = 'holiday',      // 节假日 (daycode: 1)
  WEEKEND = 'weekend',      // 双休日 (daycode: 2)
  WORK_SHIFT = 'work_shift' // 调休日（上班） (daycode: 3)
}

/**
 * 节假日数据接口
 */
export interface HolidayData {
  name: string;
  date: string;
  type: HolidayType;
  daycode?: number;      // 日期类型：0工作日、1节假日、2双休日、3调休日
  isnotwork?: number;    // 是否需要上班：0工作日、1休息日
  info?: string;         // 文字提示
}

/**
 * 天行API响应格式
 */
export interface TianApiResponse {
  code: number;
  msg: string;
  result?: TianApiHolidayResult;
}

/**
 * 天行API节假日结果
 */
export interface TianApiHolidayResult {
  date?: string;         // 当前阳历日期 (YYYY-MM-DD)
  info?: string;         // 文字提示：工作日、节假日、节日、双休日、调休日
  name?: string;         // 节假日名称（中文）
  daycode?: number;      // 日期类型：0工作日、1节假日、2双休日、3调休日
  isnotwork?: number;    // 是否需要上班：0工作日、1休息日
  holiday?: string;      // 节日日期
  weekday?: number;      // 星期（数字）
  cnweekday?: string;    // 星期（中文）
  tip?: string;          // 放假提示
  rest?: string;         // 拼假建议
  wage?: number;         // 薪资法定倍数
  enname?: string;       // 节日名称（英文）
  remark?: string[];     // 调休日数组
  update?: boolean;      // 是否更新法定节假日（按年查询专有字段）
  vacation?: string[];   // 节假日数组
  lunarday?: string;     // 农历日
  lunaryear?: string;    // 农历年
  lunarmonth?: string;   // 农历月
  start?: number;        // 假期起点计数
  end?: number;          // 假期终点计数
  now?: number;          // 假期当前计数
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

/**
 * 节假日模型
 */
export class Holiday {
  name: string = '';
  date: Date = new Date();
  type: HolidayType = HolidayType.WORKDAY;
  daycode: number = 0;      // 日期类型：0工作日、1节假日、2双休日、3调休日
  isnotwork: number = 0;    // 是否需要上班：0工作日、1休息日
  info: string = '';        // 文字提示

  constructor(data?: HolidayData) {
    if (data) {
      this.name = data.name ?? '';
      this.info = data.info ?? '';
      this.daycode = data.daycode ?? 0;
      this.isnotwork = data.isnotwork ?? 0;
      
      // 解析日期字符串 (支持 YYYY-MM-DD 格式)
      const dateStr = data.date;
      if (dateStr) {
        // 尝试解析 YYYY-MM-DD 格式
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const year = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1; // 月份从0开始
          const day = parseInt(parts[2]);
          this.date = new Date(year, month, day);
        } else {
          // 尝试直接解析日期字符串
          this.date = new Date(dateStr);
        }
      }
      
      // 如果没有提供type，根据daycode推断
      if (data.type) {
        this.type = data.type;
      } else {
        this.type = this.getTypeFromDaycode(this.daycode);
      }
    }
  }

  /**
   * 根据daycode获取HolidayType
   */
  private getTypeFromDaycode(daycode: number): HolidayType {
    if (daycode === 0) return HolidayType.WORKDAY;
    if (daycode === 1) return HolidayType.HOLIDAY;
    if (daycode === 2) return HolidayType.WEEKEND;
    if (daycode === 3) return HolidayType.WORK_SHIFT;
    return HolidayType.WORKDAY;
  }

  /**
   * 判断是否是工作日
   */
  isWorkday(): boolean {
    return this.type === HolidayType.WORKDAY || this.daycode === 0;
  }

  /**
   * 判断是否是节假日
   */
  isHoliday(): boolean {
    return this.type === HolidayType.HOLIDAY || this.daycode === 1;
  }

  /**
   * 判断是否是周末
   */
  isWeekend(): boolean {
    return this.type === HolidayType.WEEKEND || this.daycode === 2;
  }

  /**
   * 判断是否是调休日（需要上班）
   */
  isWorkShift(): boolean {
    return this.type === HolidayType.WORK_SHIFT || this.daycode === 3;
  }

  /**
   * 判断是否需要上班
   */
  isNotWork(): boolean {
    return this.isnotwork === 1;
  }

  /**
   * 兼容旧方法：判断是否是中国节假日
   */
  isChinese(): boolean {
    return this.isHoliday();
  }

  /**
   * 兼容旧方法：判断是否是国际节假日
   */
  isInternational(): boolean {
    return false; // 天行API主要返回中国节假日
  }
}
