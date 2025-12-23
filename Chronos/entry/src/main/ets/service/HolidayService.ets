import { Holiday, HolidayType, TianApiResponse, TianApiHolidayResult } from '../model/Holiday';
import { http } from '@kit.NetworkKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { Constants } from '../common/Constants';

/**
 * 节假日服务类 - 调用天行API获取节假日信息
 */
export class HolidayService {
  private static instance: HolidayService;
  private apiKey: string = Constants.TIANAPI_KEY;
  private baseUrl: string = Constants.TIANAPI_HOLIDAY_URL;
  private holidaysCache: Map<string, Holiday[]> = new Map();

  private constructor() {}

  static getInstance(): HolidayService {
    if (!HolidayService.instance) {
      HolidayService.instance = new HolidayService();
    }
    return HolidayService.instance;
  }

  /**
   * 获取指定日期的节假日
   * @param date 查询日期
   */
  async getHolidaysByDate(date: Date): Promise<Holiday[]> {
    const dateKey = this.getDateKey(date);
    
    // 检查缓存
    if (this.holidaysCache.has(dateKey)) {
      const cached = this.holidaysCache.get(dateKey) as Holiday[];
      console.info(`从缓存获取日期 ${dateKey} 的节假日:`, cached.length);
      return cached;
    }

    try {
      const dateStr = this.formatDateForAPI(date); // YYYY-MM-DD
      
      // 构建请求URL：type=0表示批量查询单日
      const url = `${this.baseUrl}?key=${this.apiKey}&date=${dateStr}&type=0`;
      
      console.info('请求节假日API:', url);
      
      const httpRequest = http.createHttp();
      const response = await httpRequest.request(url, {
        method: http.RequestMethod.GET
      });

      const result = await response.result.toString();
      console.info('API原始响应:', result);
      
      const apiResponse: TianApiResponse = JSON.parse(result) as TianApiResponse;

      // 检查API响应状态
      if (apiResponse.code !== 200) {
        console.error(`天行API返回错误: code=${apiResponse.code}, msg=${apiResponse.msg}`);
        return [];
      }

      const holidays: Holiday[] = this.parseHolidays(apiResponse, date);
      
      // 调试：打印解析结果
      console.info(`日期 ${dateStr} 的节假日数量:`, holidays.length);
      if (holidays.length > 0) {
        console.info('节假日名称:', holidays.map(h => h.name).join(', '));
      }
      
      // 缓存结果
      this.holidaysCache.set(dateKey, holidays);
      
      return holidays;
    } catch (error) {
      console.error('获取节假日失败:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('错误详情:', errorMsg);
      return [];
    }
  }

  /**
   * 获取指定日期范围的节假日（使用范围查询，type=3）
   * @param startDate 开始日期
   * @param endDate 结束日期
   */
  async getHolidaysByDateRange(startDate: Date, endDate: Date): Promise<Holiday[]> {
    try {
      const startStr = this.formatDateForAPI(startDate); // YYYY-MM-DD
      const endStr = this.formatDateForAPI(endDate);
      const dateRange = `${startStr},${endStr}`;
      
      // type=3 表示范围查询
      const url = `${this.baseUrl}?key=${this.apiKey}&date=${dateRange}&type=3`;
      
      console.info('请求节假日范围查询API:', url);
      
      const httpRequest = http.createHttp();
      const response = await httpRequest.request(url, {
        method: http.RequestMethod.GET
      });

      const result = await response.result.toString();
      const apiResponse: TianApiResponse = JSON.parse(result) as TianApiResponse;

      if (apiResponse.code !== 200) {
        console.error(`天行API返回错误: code=${apiResponse.code}, msg=${apiResponse.msg}`);
        return [];
      }

      // 范围查询可能返回数组，需要遍历解析
      const holidays: Holiday[] = [];
      if (apiResponse.result) {
        // 如果是单条结果
        const holiday = this.parseHolidayResult(apiResponse.result, startDate);
        if (holiday) {
          holidays.push(holiday);
        }
      }
      
      return holidays;
    } catch (error) {
      console.error('获取节假日范围失败:', error);
      // 降级为逐日查询
      return await this.getHolidaysByDateRangeFallback(startDate, endDate);
    }
  }

  /**
   * 逐日查询节假日（按月查询的主要实现方式）
   */
  private async getHolidaysByDateRangeFallback(startDate: Date, endDate: Date): Promise<Holiday[]> {
    const allHolidays: Holiday[] = [];
    const currentDate = new Date(startDate);
    let totalDays = 0;
    let holidayCount = 0;
    
    while (currentDate <= endDate) {
      totalDays++;
      const holidays = await this.getHolidaysByDate(new Date(currentDate));
      if (holidays.length > 0) {
        allHolidays.push(...holidays);
        holidayCount += holidays.length;
      }
      currentDate.setDate(currentDate.getDate() + 1);
      
      // 添加延迟以避免API调用频率过高（每10个请求延迟100ms）
      if (totalDays % 10 === 0) {
        await new Promise<void>((resolve: () => void) => {
          setTimeout(resolve, 100);
        });
      }
    }
    
    console.info(`逐日查询完成：查询${totalDays}天，找到${holidayCount}个节假日`);
    return allHolidays;
  }

  /**
   * 获取指定月份的节假日
   * @param year 年份
   * @param month 月份（0-11）
   * 注意：直接使用逐日查询方式，因为按月查询API可能返回格式不完整
   */
  async getHolidaysByMonth(year: number, month: number): Promise<Holiday[]> {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    console.info(`获取${year}年${month + 1}月的节假日，日期范围: ${this.formatDateForAPI(startDate)} 至 ${this.formatDateForAPI(endDate)}`);
    return await this.getHolidaysByDateRangeFallback(startDate, endDate);
  }

  /**
   * 从API响应解析节假日
   */
  private parseHolidays(apiResponse: TianApiResponse, date: Date): Holiday[] {
    const holidays: Holiday[] = [];
    
    if (apiResponse.result) {
      const holiday = this.parseHolidayResult(apiResponse.result, date);
      if (holiday) {
        holidays.push(holiday);
      }
    }
    
    return holidays;
  }

  /**
   * 解析单个节假日结果
   */
  private parseHolidayResult(result: TianApiHolidayResult, defaultDate: Date): Holiday | null {
    // 使用result.date或默认日期
    const dateStr = result.date ?? this.formatDateForAPI(defaultDate);
    
    // 获取日期类型
    const daycode = result.daycode ?? 0;
    const isnotwork = result.isnotwork ?? 0;

    // 如果是工作日(daycode=0)，不创建Holiday对象
    if (daycode === 0) {
      return null;
    }

    // 根据daycode确定类型
    let holidayType: HolidayType;
    if (daycode === 1) {
      holidayType = HolidayType.HOLIDAY;
    } else if (daycode === 2) {
      holidayType = HolidayType.WEEKEND;
    } else if (daycode === 3) {
      holidayType = HolidayType.WORK_SHIFT;
    } else {
      // 未知类型，不创建
      return null;
    }

    // 获取节假日名称
    let name = result.name ?? '';
    // 如果name为空，根据类型设置默认名称
    if (!name || name.length === 0) {
      if (daycode === 1) {
        name = result.info ?? '节假日';
      } else if (daycode === 2) {
        name = '周末';
      } else if (daycode === 3) {
        name = result.info ?? '调休';
      }
    }

    return new Holiday({
      name: name,
      date: dateStr,
      type: holidayType,
      daycode: daycode,
      isnotwork: isnotwork,
      info: result.info ?? ''
    });
  }

  /**
   * 格式化日期为API需要的格式 (YYYY-MM-DD)
   */
  private formatDateForAPI(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * 获取日期键（用于缓存）
   */
  private getDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  }

  /**
   * 清空缓存
   */
  clearCache(): void {
    this.holidaysCache.clear();
  }
}
