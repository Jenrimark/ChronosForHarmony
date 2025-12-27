import { Bill, BillType, BillCategory, BillData } from '../model/Bill';
import { Utils } from '../common/Utils';
import { LocalDBService, LocalBill, SyncStatus } from './LocalDBService';
import { SyncService } from './SyncService';
import { BillStatistics } from '../common/Types';
import { hilog } from '@kit.PerformanceAnalysisKit';

const TAG = 'BillService';
const DOMAIN = 0x0000;

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
 * 账单服务类 - 离线优先模式
 * 策略：数据优先存入本地 SQLite，后台静默同步到云端
 * 参考：华为云开发最佳实践 - 本地 SQLite + CloudDB 双写模式
 */
export class BillService {
  private static instance: BillService;
  private localDB: LocalDBService = LocalDBService.getInstance();
  private syncService: SyncService = SyncService.getInstance();

  private constructor() {}

  static getInstance(): BillService {
    if (!BillService.instance) {
      BillService.instance = new BillService();
    }
    return BillService.instance;
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${timestamp}_${random}`;
  }

  /**
   * Bill 转 LocalBill
   */
  private billToLocal(bill: Bill, syncStatus: number = SyncStatus.PENDING): LocalBill {
    // 优先使用 localId，如果没有则生成新的
    const billId = bill.localId ? bill.localId : this.generateId();
    return {
      id: billId,
      type: bill.type,
      category: bill.category,
      amount: bill.amount.toString(),
      description: bill.description,
      date: bill.date ? bill.date.toISOString() : new Date().toISOString(),
      createTime: bill.createTime ? bill.createTime.toISOString() : new Date().toISOString(),
      updateTime: bill.updateTime ? bill.updateTime.toISOString() : new Date().toISOString(),
      tags: JSON.stringify(bill.tags || []),
      userId: 'default_user',
      syncStatus: syncStatus,
      version: 1
    };
  }

  /**
   * LocalBill 转 Bill
   */
  private localToBill(local: LocalBill): Bill {
    let tags: string[] = [];
    try {
      tags = JSON.parse(local.tags || '[]');
    } catch (e) {
      tags = [];
    }

    let amountNum = 0;
    if (local.amount) {
      const parsed = parseFloat(local.amount);
      if (!isNaN(parsed)) {
        amountNum = parsed;
      }
    }

    const typeStr = local.type || 'expense';
    const billType: BillType = typeStr === 'income' ? BillType.INCOME : BillType.EXPENSE;
    const billCategory: BillCategory = (local.category || 'other_expense') as BillCategory;

    const billData: BillData = {
      id: parseInt(local.id) || 0,
      localId: local.id, // 保存原始的本地ID
      type: billType,
      category: billCategory,
      amount: amountNum,
      description: local.description || '',
      date: local.date ? new Date(local.date) : new Date(),
      createTime: local.createTime ? new Date(local.createTime) : new Date(),
      updateTime: local.updateTime ? new Date(local.updateTime) : new Date(),
      tags: tags
    };

    return new Bill(billData);
  }

  /**
   * 创建账单
   * 离线优先：先存本地，后台静默同步
   */
  async createBill(bill: Bill): Promise<Bill> {
    try {
      // 设置时间
      if (!bill.createTime) {
        bill.createTime = new Date();
      }
      bill.updateTime = new Date();

      // 转换为本地格式并保存
      const localBill = this.billToLocal(bill, SyncStatus.PENDING);
      await this.localDB.upsertBill(localBill);

      hilog.info(DOMAIN, TAG, '账单已保存到本地: %{public}s', localBill.id);

      // 触发后台同步（不阻塞）
      this.triggerSync();

      // 返回带有新ID的Bill
      return this.localToBill(localBill);
    } catch (error) {
      hilog.error(DOMAIN, TAG, '创建账单失败: %{public}s', String(error));
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * 更新账单
   */
  async updateBill(bill: Bill): Promise<void> {
    try {
      bill.updateTime = new Date();
      const localBill = this.billToLocal(bill, SyncStatus.PENDING);
      await this.localDB.upsertBill(localBill);

      hilog.info(DOMAIN, TAG, '账单已更新: %{public}s', localBill.id);
      this.triggerSync();
    } catch (error) {
      hilog.error(DOMAIN, TAG, '更新账单失败: %{public}s', String(error));
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * 删除账单（标记删除）
   * @param billOrId 可以是 Bill 对象或 localId 字符串
   */
  async deleteBill(billOrId: Bill | string): Promise<void> {
    try {
      let localId: string;
      if (typeof billOrId === 'string') {
        localId = billOrId;
      } else {
        // 如果是 Bill 对象，优先使用 localId
        localId = billOrId.localId || billOrId.id.toString();
      }
      
      await this.localDB.deleteBill(localId);
      hilog.info(DOMAIN, TAG, '账单已标记删除: %{public}s', localId);
      this.triggerSync();
    } catch (error) {
      hilog.error(DOMAIN, TAG, '删除账单失败: %{public}s', String(error));
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * 获取账单
   */
  async getBillById(id: number): Promise<Bill | null> {
    try {
      const localBill = await this.localDB.queryBillById(id.toString());
      if (!localBill) {
        return null;
      }
      return this.localToBill(localBill);
    } catch (error) {
      hilog.error(DOMAIN, TAG, '获取账单失败: %{public}s', String(error));
      return null;
    }
  }

  /**
   * 获取所有账单
   */
  async getAllBills(): Promise<Bill[]> {
    try {
      const localBills = await this.localDB.queryAllBills();
      return localBills.map(local => this.localToBill(local));
    } catch (error) {
      hilog.error(DOMAIN, TAG, '获取账单列表失败: %{public}s', String(error));
      return [];
    }
  }

  /**
   * 根据类型获取账单
   */
  async getBillsByType(type: BillType): Promise<Bill[]> {
    try {
      const localBills = await this.localDB.queryBillsByType(type);
      return localBills.map(local => this.localToBill(local));
    } catch (error) {
      hilog.error(DOMAIN, TAG, '获取账单列表失败: %{public}s', String(error));
      return [];
    }
  }

  /**
   * 根据分类获取账单
   */
  async getBillsByCategory(category: BillCategory): Promise<Bill[]> {
    try {
      const allBills = await this.getAllBills();
      return allBills.filter(bill => bill.category === category);
    } catch (error) {
      hilog.error(DOMAIN, TAG, '获取账单列表失败: %{public}s', String(error));
      return [];
    }
  }

  /**
   * 获取指定日期的账单
   */
  async getBillsByDate(date: Date): Promise<Bill[]> {
    try {
      const allBills = await this.getAllBills();
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      return allBills.filter(bill => {
        const billTime = bill.date.getTime();
        return billTime >= startOfDay.getTime() && billTime <= endOfDay.getTime();
      });
    } catch (error) {
      hilog.error(DOMAIN, TAG, '获取账单列表失败: %{public}s', String(error));
      return [];
    }
  }

  /**
   * 获取指定日期范围的账单
   */
  async getBillsByDateRange(startDate: Date, endDate: Date): Promise<Bill[]> {
    try {
      const allBills = await this.getAllBills();
      const startTime = startDate.getTime();
      const endTime = endDate.getTime();

      return allBills.filter(bill => {
        const billTime = bill.date.getTime();
        return billTime >= startTime && billTime <= endTime;
      });
    } catch (error) {
      hilog.error(DOMAIN, TAG, '获取账单列表失败: %{public}s', String(error));
      return [];
    }
  }

  /**
   * 获取今日账单
   */
  async getTodayBills(): Promise<Bill[]> {
    return await this.getBillsByDate(new Date());
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
      hilog.error(DOMAIN, TAG, '获取统计信息失败: %{public}s', String(error));
      return new DefaultBillStatistics();
    }
  }

  /**
   * 触发后台同步（非阻塞）
   */
  private triggerSync(): void {
    setTimeout(() => {
      this.syncService.syncAll().catch((err: Error) => {
        hilog.warn(DOMAIN, TAG, '后台同步失败（将在下次重试）: %{public}s', String(err));
      });
    }, 100);
  }

  /**
   * 手动触发同步
   */
  async manualSync(): Promise<void> {
    await this.syncService.syncAll();
  }
}

