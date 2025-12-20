import { Holiday, HolidayType } from "@normalized:N&&&entry/src/main/ets/model/Holiday&";
import type { HolidayJSON } from "@normalized:N&&&entry/src/main/ets/model/Holiday&";
import http from "@ohos:net.http";
/**
 * 节假日服务类 - 调用外部API获取节假日信息
 */
export class HolidayService {
    private static instance: HolidayService;
    private apiKey: string = '6IsiPZBZiPzohIACwzLtE2RnJblLwd4A';
    private baseUrl: string = 'https://api.apilayer.com/checkiday/events';
    private holidaysCache: Map<string, Holiday[]> = new Map();
    private constructor() { }
    static getInstance(): HolidayService {
        if (!HolidayService.instance) {
            HolidayService.instance = new HolidayService();
        }
        return HolidayService.instance;
    }
    /**
     * 获取指定日期的节假日
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
            const dateStr = this.formatDateForAPI(date);
            const url = `${this.baseUrl}?date=${dateStr}&adult=false`;
            console.info('请求节假日API:', url);
            const httpRequest = http.createHttp();
            const response = await httpRequest.request(url, {
                method: http.RequestMethod.GET,
                header: {
                    'apikey': this.apiKey
                }
            });
            const result = await response.result.toString();
            console.info('API原始响应:', result);
            const data: HolidayJSON = JSON.parse(result) as HolidayJSON;
            // 调试：打印API响应结构
            console.info('解析后的API响应:', JSON.stringify(data));
            if (data.events) {
                console.info(`事件数量: ${data.events.length}`);
            }
            const holidays: Holiday[] = this.parseHolidays(data, date);
            // 调试：打印解析结果
            console.info(`日期 ${dateStr} 的节假日数量:`, holidays.length);
            if (holidays.length > 0) {
                console.info('节假日名称:', holidays.map(h => h.name).join(', '));
            }
            // 缓存结果
            this.holidaysCache.set(dateKey, holidays);
            return holidays;
        }
        catch (error) {
            console.error('获取节假日失败:', error);
            console.error('错误详情:', JSON.stringify(error));
            return [];
        }
    }
    /**
     * 获取指定日期范围的节假日
     */
    async getHolidaysByDateRange(startDate: Date, endDate: Date): Promise<Holiday[]> {
        const allHolidays: Holiday[] = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const holidays = await this.getHolidaysByDate(new Date(currentDate));
            allHolidays.push(...holidays);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return allHolidays;
    }
    /**
     * 获取指定月份的节假日
     */
    async getHolidaysByMonth(year: number, month: number): Promise<Holiday[]> {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);
        return await this.getHolidaysByDateRange(startDate, endDate);
    }
    /**
     * 从API响应解析节假日
     */
    private parseHolidays(data: HolidayJSON, date: Date): Holiday[] {
        const holidays: Holiday[] = [];
        const dateStr = this.formatDateForAPI(date);
        if (data.events && Array.isArray(data.events)) {
            for (let i = 0; i < data.events.length; i++) {
                const event = data.events[i];
                // 判断是中国还是国际节假日
                let holidayType: HolidayType | null = null;
                // 检查是否是中国节假日
                if (event.country && (event.country.toLowerCase() === 'cn' || event.country.toLowerCase() === 'china')) {
                    holidayType = HolidayType.CHINESE;
                }
                // 检查是否是国际节假日（类型包含international或没有国家信息）
                else if (event.type && event.type.toLowerCase().includes('international')) {
                    holidayType = HolidayType.INTERNATIONAL;
                }
                // 如果没有国家信息且类型不明确，默认视为国际节假日
                else if (!event.country || event.country === '') {
                    holidayType = HolidayType.INTERNATIONAL;
                }
                // 其他情况跳过
                else {
                    continue;
                }
                if (holidayType) {
                    const holiday = new Holiday({
                        name: event.name,
                        date: dateStr,
                        type: holidayType
                    });
                    holidays.push(holiday);
                }
            }
        }
        return holidays;
    }
    /**
     * 格式化日期为API需要的格式 (MM/DD/YYYY)
     */
    private formatDateForAPI(date: Date): string {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
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
