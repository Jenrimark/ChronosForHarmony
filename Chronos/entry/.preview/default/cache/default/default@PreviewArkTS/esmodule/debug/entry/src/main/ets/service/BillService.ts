import { Bill } from "@normalized:N&&&entry/src/main/ets/model/Bill&";
import type { BillType, BillCategory, BillJSON } from "@normalized:N&&&entry/src/main/ets/model/Bill&";
import { Utils } from "@normalized:N&&&entry/src/main/ets/common/Utils&";
import { ApiClient } from "@normalized:N&&&entry/src/main/ets/common/ApiClient&";
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import type { BillStatistics } from '../common/Types';
/**
 * 账单查询参数类
 */
class BillQueryParams {
    type?: string;
    category?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
}
/**
 * 默认账单统计信息类
 */
class DefaultBillStatistics implements BillStatistics {
    totalIncome: number = 0;
    totalExpense: number = 0;
    netIncome: number = 0;
    incomeCount: number = 0;
    expenseCount: number = 0;
}
/**
 * 账单请求数据类
 */
class BillRequestData {
    type: string = '';
    category: string = '';
    amount: number = 0;
    description: string = '';
    date: string = '';
    tags: string[] = [];
}
/**
 * 账单服务类 - 通过API调用后端
 */
export class BillService {
    private static instance: BillService;
    private apiClient: ApiClient = ApiClient.getInstance();
    private constructor() {
        // 初始化API客户端
        this.apiClient.setBaseUrl(Constants.API_BASE_URL);
    }
    static getInstance(): BillService {
        if (!BillService.instance) {
            BillService.instance = new BillService();
        }
        return BillService.instance;
    }
    /**
     * 创建账单
     */
    async createBill(bill: Bill): Promise<Bill> {
        try {
            const billData = this.billToRequestData(bill);
            const response = await this.apiClient.post<BillJSON>('/bills', billData);
            return this.billFromResponse(response.data);
        }
        catch (error) {
            console.error('创建账单失败:', error);
            throw error instanceof Error ? error : new Error(String(error));
        }
    }
    /**
     * 更新账单
     */
    async updateBill(bill: Bill): Promise<void> {
        try {
            const billData = this.billToRequestData(bill);
            await this.apiClient.put<BillJSON>(`/bills/${bill.id}`, billData);
        }
        catch (error) {
            console.error('更新账单失败:', error);
            throw error instanceof Error ? error : new Error(String(error));
        }
    }
    /**
     * 删除账单
     */
    async deleteBill(id: number): Promise<void> {
        try {
            await this.apiClient.delete<Record<string, any>>(`/bills/${id}`);
        }
        catch (error) {
            console.error('删除账单失败:', error);
            throw error instanceof Error ? error : new Error(String(error));
        }
    }
    /**
     * 获取账单
     */
    async getBillById(id: number): Promise<Bill | null> {
        try {
            const response = await this.apiClient.get<BillJSON>(`/bills/${id}`);
            return this.billFromResponse(response.data);
        }
        catch (error) {
            console.error('获取账单失败:', error);
            return null;
        }
    }
    /**
     * 获取所有账单
     */
    async getAllBills(): Promise<Bill[]> {
        try {
            const response = await this.apiClient.get<BillJSON[]>('/bills');
            return response.data.map(json => this.billFromResponse(json));
        }
        catch (error) {
            console.error('获取账单列表失败:', error);
            return [];
        }
    }
    /**
     * 根据类型获取账单
     */
    async getBillsByType(type: BillType): Promise<Bill[]> {
        try {
            const params = new BillQueryParams();
            params.type = type;
            const response = await this.apiClient.get<BillJSON[]>('/bills', params as Record<string, any>);
            return response.data.map(json => this.billFromResponse(json));
        }
        catch (error) {
            console.error('获取账单列表失败:', error);
            return [];
        }
    }
    /**
     * 根据分类获取账单
     */
    async getBillsByCategory(category: BillCategory): Promise<Bill[]> {
        try {
            const params = new BillQueryParams();
            params.category = category;
            const response = await this.apiClient.get<BillJSON[]>('/bills', params as Record<string, any>);
            return response.data.map(json => this.billFromResponse(json));
        }
        catch (error) {
            console.error('获取账单列表失败:', error);
            return [];
        }
    }
    /**
     * 获取指定日期的账单
     */
    async getBillsByDate(date: Date): Promise<Bill[]> {
        try {
            const dateStr = date.toISOString();
            const params = new BillQueryParams();
            params.date = dateStr;
            const response = await this.apiClient.get<BillJSON[]>('/bills', params as Record<string, any>);
            return response.data.map(json => this.billFromResponse(json));
        }
        catch (error) {
            console.error('获取账单列表失败:', error);
            return [];
        }
    }
    /**
     * 获取指定日期范围的账单
     */
    async getBillsByDateRange(startDate: Date, endDate: Date): Promise<Bill[]> {
        try {
            const startDateStr = startDate.toISOString();
            const endDateStr = endDate.toISOString();
            const params = new BillQueryParams();
            params.startDate = startDateStr;
            params.endDate = endDateStr;
            const response = await this.apiClient.get<BillJSON[]>('/bills', params as Record<string, any>);
            return response.data.map(json => this.billFromResponse(json));
        }
        catch (error) {
            console.error('获取账单列表失败:', error);
            return [];
        }
    }
    /**
     * 获取今日账单
     */
    async getTodayBills(): Promise<Bill[]> {
        const today = new Date();
        return await this.getBillsByDate(today);
    }
    /**
     * 获取本周账单
     */
    async getWeekBills(): Promise<Bill[]> {
        const today = new Date();
        const weekStart = Utils.getWeekStart(today);
        const weekEnd = Utils.getWeekEnd(today);
        return await this.getBillsByDateRange(weekStart, weekEnd);
    }
    /**
     * 获取本月账单
     */
    async getMonthBills(): Promise<Bill[]> {
        const today = new Date();
        const monthStart = Utils.getMonthStart(today);
        const monthEnd = Utils.getMonthEnd(today);
        return await this.getBillsByDateRange(monthStart, monthEnd);
    }
    /**
     * 计算总金额
     */
    calculateTotal(bills: Bill[]): number {
        return bills.reduce((sum, bill) => {
            return sum + (bill.isIncome() ? bill.amount : -bill.amount);
        }, 0);
    }
    /**
     * 计算收入总额
     */
    calculateIncome(bills: Bill[]): number {
        return bills
            .filter(b => b.isIncome())
            .reduce((sum, bill) => sum + bill.amount, 0);
    }
    /**
     * 计算支出总额
     */
    calculateExpense(bills: Bill[]): number {
        return bills
            .filter(b => b.isExpense())
            .reduce((sum, bill) => sum + bill.amount, 0);
    }
    /**
     * 获取统计信息
     */
    async getStatistics(type?: string, startDate?: Date, endDate?: Date): Promise<BillStatistics> {
        try {
            const params: Record<string, any> = {};
            if (type) {
                params.type = type;
            }
            if (startDate) {
                params.startDate = startDate.toISOString();
            }
            if (endDate) {
                params.endDate = endDate.toISOString();
            }
            const response = await this.apiClient.get<BillStatistics>('/bills/statistics', params);
            return response.data;
        }
        catch (error) {
            console.error('获取统计信息失败:', error);
            const defaultStats = new DefaultBillStatistics();
            return defaultStats;
        }
    }
    /**
     * 将Bill转换为请求数据格式
     */
    private billToRequestData(bill: Bill): Record<string, any> {
        const requestData = new BillRequestData();
        requestData.type = bill.type;
        requestData.category = bill.category;
        requestData.amount = bill.amount;
        requestData.description = bill.description;
        requestData.date = bill.date.toISOString();
        requestData.tags = bill.tags;
        return requestData as Record<string, any>;
    }
    /**
     * 从响应数据创建Bill对象
     */
    private billFromResponse(json: BillJSON): Bill {
        let tags: string[] = [];
        // 处理tags字段：后端返回的可能是数组或字符串
        try {
            const tagsValue = json.tags;
            if (!tagsValue) {
                tags = [];
            }
            else {
                // 先尝试作为数组处理
                try {
                    const tagsArray = tagsValue as string[];
                    // 检查是否是有效的数组（有length属性）
                    if (tagsArray.length !== undefined) {
                        tags = tagsArray;
                    }
                    else {
                        // 不是数组，尝试作为字符串解析
                        const tagsStr = tagsValue as string;
                        if (tagsStr.length > 0) {
                            tags = JSON.parse(tagsStr);
                        }
                    }
                }
                catch (e1) {
                    // 数组转换失败，尝试作为字符串解析
                    try {
                        const tagsStr = tagsValue as string;
                        if (tagsStr && tagsStr.length > 0) {
                            tags = JSON.parse(tagsStr);
                        }
                    }
                    catch (e2) {
                        tags = [];
                    }
                }
            }
        }
        catch (e) {
            // 解析失败，使用空数组
            tags = [];
        }
        return new Bill({
            id: json.id,
            type: json.type as BillType,
            category: json.category as BillCategory,
            amount: json.amount,
            description: json.description,
            date: json.date,
            createTime: json.createTime,
            updateTime: json.updateTime,
            tags: tags
        });
    }
}
