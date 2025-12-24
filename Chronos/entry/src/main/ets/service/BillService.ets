import { Bill, BillType, BillCategory, BillJSON } from '../model/Bill';
import { Utils } from '../common/Utils';
import { CloudDBService } from './CloudDBService';
import { CloudDBConverter } from '../utils/CloudDBConverter';
import { Constants } from '../common/Constants';
import { BillStatistics } from '../common/Types';

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
 * 账单服务类 - 使用华为云数据库（Cloud DB）
 * 按照官方文档规范实现端云协同：优先读写本地缓存，网络空闲时自动同步云端
 */
export class BillService {
  private static instance: BillService;
  private cloudDBService: CloudDBService = CloudDBService.getInstance();

  private constructor() {
    // 确保Cloud DB服务已初始化
    this.cloudDBService.init();
  }

  static getInstance(): BillService {
    if (!BillService.instance) {
      BillService.instance = new BillService();
    }
    return BillService.instance;
  }

  /**
   * 创建账单
   * 数据会立即存入本地，随后静默上传云端
   */
  async createBill(bill: Bill): Promise<Bill> {
    try {
      // 设置创建时间和更新时间
      if (!bill.createTime) {
        bill.createTime = new Date();
      }
      bill.updateTime = new Date();
      
      // 转换为Cloud DB对象
      const userId = CloudDBConverter.getCurrentUserId();
      const cloudDBBill = CloudDBConverter.billToCloudDB(bill, userId);
      
      // 保存到Cloud DB（会自动同步到云端），返回保存后的对象
      const savedBill = await this.cloudDBService.upsertBill(cloudDBBill);
      
      // 转换回Bill对象
      return CloudDBConverter.cloudDBToBill(savedBill);
    } catch (error) {
      console.error('创建账单失败:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * 更新账单
   */
  async updateBill(bill: Bill): Promise<void> {
    try {
      bill.updateTime = new Date();
      const userId = CloudDBConverter.getCurrentUserId();
      const cloudDBBill = CloudDBConverter.billToCloudDB(bill, userId);
      await this.cloudDBService.upsertBill(cloudDBBill);
    } catch (error) {
      console.error('更新账单失败:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * 删除账单
   */
  async deleteBill(id: number): Promise<void> {
    try {
      await this.cloudDBService.deleteBill(id.toString());
    } catch (error) {
      console.error('删除账单失败:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * 获取账单
   */
  async getBillById(id: number): Promise<Bill | null> {
    try {
      const cloudDBBill = await this.cloudDBService.queryBillById(id.toString());
      if (!cloudDBBill) {
        return null;
      }
      return CloudDBConverter.cloudDBToBill(cloudDBBill);
    } catch (error) {
      console.error('获取账单失败:', error);
      return null;
    }
  }

  /**
   * 获取所有账单
   */
  async getAllBills(): Promise<Bill[]> {
    try {
      const userId = CloudDBConverter.getCurrentUserId();
      const cloudDBBills = await this.cloudDBService.queryAllBills(userId);
      return cloudDBBills.map(cloudDB => CloudDBConverter.cloudDBToBill(cloudDB));
    } catch (error) {
      console.error('获取账单列表失败:', error);
      return [];
    }
  }

  /**
   * 根据类型获取账单
   */
  async getBillsByType(type: BillType): Promise<Bill[]> {
    try {
      const userId = CloudDBConverter.getCurrentUserId();
      const cloudDBBills = await this.cloudDBService.queryBillsByType(type, userId);
      return cloudDBBills.map(cloudDB => CloudDBConverter.cloudDBToBill(cloudDB));
    } catch (error) {
      console.error('获取账单列表失败:', error);
      return [];
    }
  }

  /**
   * 根据分类获取账单
   * 注意：Cloud DB查询需要先获取所有账单，然后在内存中过滤
   */
  async getBillsByCategory(category: BillCategory): Promise<Bill[]> {
    try {
      const allBills = await this.getAllBills();
      return allBills.filter(bill => bill.category === category);
    } catch (error) {
      console.error('获取账单列表失败:', error);
      return [];
    }
  }

  /**
   * 获取指定日期的账单
   */
  async getBillsByDate(date: Date): Promise<Bill[]> {
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      const userId = CloudDBConverter.getCurrentUserId();
      const cloudDBBills = await this.cloudDBService.queryBillsByDateRange(
        startDate.toISOString(),
        endDate.toISOString(),
        userId
      );
      return cloudDBBills.map(cloudDB => CloudDBConverter.cloudDBToBill(cloudDB));
    } catch (error) {
      console.error('获取账单列表失败:', error);
      return [];
    }
  }

  /**
   * 获取指定日期范围的账单
   */
  async getBillsByDateRange(startDate: Date, endDate: Date): Promise<Bill[]> {
    try {
      const userId = CloudDBConverter.getCurrentUserId();
      const cloudDBBills = await this.cloudDBService.queryBillsByDateRange(
        startDate.toISOString(),
        endDate.toISOString(),
        userId
      );
      return cloudDBBills.map(cloudDB => CloudDBConverter.cloudDBToBill(cloudDB));
    } catch (error) {
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
      let bills: Bill[] = [];
      if (startDate && endDate) {
        bills = await this.getBillsByDateRange(startDate, endDate);
      } else {
        bills = await this.getAllBills();
      }
      
      // 如果指定了类型，过滤账单
      if (type) {
        bills = bills.filter(bill => bill.type === type);
      }
      
      // 计算统计信息
      const stats = new DefaultBillStatistics();
      bills.forEach(bill => {
        if (bill.isIncome()) {
          stats.totalIncome += bill.amount;
          stats.incomeCount++;
        } else {
          stats.totalExpense += bill.amount;
          stats.expenseCount++;
        }
      });
      stats.netIncome = stats.totalIncome - stats.totalExpense;
      
      return stats;
    } catch (error) {
      console.error('获取统计信息失败:', error);
      const defaultStats = new DefaultBillStatistics();
      return defaultStats;
    }
  }

}
