/**
 * 工具函数类
 */
export class Utils {
    /**
     * 格式化日期
     */
    static formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return format
            .replace('YYYY', String(year))
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes);
    }
    /**
     * 解析日期字符串
     */
    static parseDate(dateString: string): Date {
        return new Date(dateString);
    }
    /**
     * 获取日期开始时间（00:00:00）
     */
    static getStartOfDay(date: Date): Date {
        const result = new Date(date);
        result.setHours(0, 0, 0, 0);
        return result;
    }
    /**
     * 获取日期结束时间（23:59:59）
     */
    static getEndOfDay(date: Date): Date {
        const result = new Date(date);
        result.setHours(23, 59, 59, 999);
        return result;
    }
    /**
     * 判断两个日期是否是同一天
     */
    static isSameDay(date1: Date, date2: Date): boolean {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    }
    /**
     * 获取日期所在周的第一天（周一）
     */
    static getWeekStart(date: Date): Date {
        const result = new Date(date);
        const day = result.getDay();
        const diff = day === 0 ? 6 : day - 1; // 周一为0
        result.setDate(result.getDate() - diff);
        return Utils.getStartOfDay(result);
    }
    /**
     * 获取日期所在周的最后一天（周日）
     */
    static getWeekEnd(date: Date): Date {
        const weekStart = Utils.getWeekStart(date);
        const result = new Date(weekStart);
        result.setDate(result.getDate() + 6);
        return Utils.getEndOfDay(result);
    }
    /**
     * 获取日期所在月的第一天
     */
    static getMonthStart(date: Date): Date {
        const result = new Date(date);
        result.setDate(1);
        return Utils.getStartOfDay(result);
    }
    /**
     * 获取日期所在月的最后一天
     */
    static getMonthEnd(date: Date): Date {
        const result = new Date(date);
        result.setMonth(result.getMonth() + 1);
        result.setDate(0);
        return Utils.getEndOfDay(result);
    }
    /**
     * 获取月份的天数
     */
    static getDaysInMonth(date: Date): number {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    }
    /**
     * 获取优先级颜色
     */
    static getPriorityColor(priority: number): string {
        switch (priority) {
            case 1:
                return '#8E8E93'; // 低优先级 - 灰色
            case 2:
                return '#007AFF'; // 中优先级 - 蓝色
            case 3:
                return '#FF9500'; // 高优先级 - 橙色
            case 4:
                return '#FF3B30'; // 紧急 - 红色
            default:
                return '#8E8E93';
        }
    }
    /**
     * 获取优先级文本
     */
    static getPriorityText(priority: number): string {
        switch (priority) {
            case 1:
                return '低';
            case 2:
                return '中';
            case 3:
                return '高';
            case 4:
                return '紧急';
            default:
                return '低';
        }
    }
    /**
     * 获取状态文本
     */
    static getStatusText(status: string): string {
        switch (status) {
            case 'pending':
                return '待办';
            case 'in_progress':
                return '进行中';
            case 'completed':
                return '已完成';
            case 'cancelled':
                return '已取消';
            default:
                return '待办';
        }
    }
}
