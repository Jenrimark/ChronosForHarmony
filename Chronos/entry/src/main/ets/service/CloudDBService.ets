/**
 * Cloud DB服务类
 * 严格按照华为官方文档实现
 */
import { cloudDatabase } from '@kit.CloudFoundationKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

const ZONE_NAME: string = 'ChronosZone';
const TAG: string = 'CloudDBService';
const DOMAIN: number = 0x0000;

/**
 * 任务Cloud DB对象类型 - 直接在服务中定义避免导入问题
 */
class TaskCloudDBInternal extends cloudDatabase.DatabaseObject {
  public id: string = '';
  public title: string = '';
  public description: string = '';
  public status: string = '';
  public priority: string = '';
  public dueDate: string = '';
  public createTime: string = '';
  public updateTime: string = '';
  public completedTime: string = '';
  public tags: string = '';
  public userld: string = '';

  constructor() {
    super();
  }

  public naturalbase_ClassName(): string {
    return 'TaskCloudDB';
  }
}

/**
 * 账单Cloud DB对象类型 - 直接在服务中定义避免导入问题
 */
class BillCloudDBInternal extends cloudDatabase.DatabaseObject {
  public id: string = '';
  public type: string = '';
  public category: string = '';
  public amount: string = '';
  public description: string = '';
  public date: string = '';
  public createTime: string = '';
  public updateTime: string = '';
  public tags: string = '';
  public userId: string = '';

  constructor() {
    super();
  }

  public naturalbase_ClassName(): string {
    return 'BillCloudDB';
  }
}

// 重新导出供外部使用
export { TaskCloudDBInternal as TaskCloudDB, BillCloudDBInternal as BillCloudDB };

export class CloudDBService {
  private static instance: CloudDBService;
  private isInitialized: boolean = false;

  private constructor() {}

  static getInstance(): CloudDBService {
    if (!CloudDBService.instance) {
      CloudDBService.instance = new CloudDBService();
    }
    return CloudDBService.instance;
  }

  async init(): Promise<void> {
    if (this.isInitialized) {
      hilog.info(DOMAIN, TAG, 'Cloud DB已经初始化');
      return;
    }
    try {
      hilog.info(DOMAIN, TAG, '开始初始化 Cloud DB...');
      
      const zone = cloudDatabase.zone(ZONE_NAME);
      
      if (!zone) {
        hilog.error(DOMAIN, TAG, 'Cloud DB zone 获取失败: %{public}s', ZONE_NAME);
        return;
      }
      
      hilog.info(DOMAIN, TAG, 'Cloud DB zone获取成功: %{public}s', ZONE_NAME);
      this.isInitialized = true;
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, 'Cloud DB初始化失败: %{public}s', error.message);
    }
  }

  // ==================== 任务操作 ====================

  async upsertTask(task: TaskCloudDBInternal): Promise<number> {
    try {
      const databaseZone = cloudDatabase.zone(ZONE_NAME);
      const record = await databaseZone.upsert(task);
      hilog.info(DOMAIN, TAG, '任务保存成功');
      return record;
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, '保存任务失败: %{public}s', error.message);
      throw error;
    }
  }

  async deleteTask(taskId: string): Promise<number> {
    try {
      const databaseZone = cloudDatabase.zone(ZONE_NAME);
      const taskToDelete = new TaskCloudDBInternal();
      taskToDelete.id = taskId;
      const deleteNum = await databaseZone.delete(taskToDelete);
      return deleteNum;
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, '删除任务失败: %{public}s', error.message);
      throw error;
    }
  }

  async queryAllTasks(): Promise<TaskCloudDBInternal[]> {
    try {
      hilog.info(DOMAIN, TAG, '开始查询所有任务');
      const databaseZone = cloudDatabase.zone(ZONE_NAME);
      
      if (!databaseZone) {
        hilog.error(DOMAIN, TAG, 'CloudDB zone 获取失败，可能未初始化或无权限');
        return [];
      }
      
      const condition = new cloudDatabase.DatabaseQuery(TaskCloudDBInternal);
      const resultArray = await databaseZone.query(condition);
      hilog.info(DOMAIN, TAG, '查询任务成功，数量: %{public}d', resultArray.length);
      return resultArray as TaskCloudDBInternal[];
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, '查询任务失败: %{public}s', error.message);
      return [];
    }
  }

  async queryTasksByStatus(status: string): Promise<TaskCloudDBInternal[]> {
    try {
      const databaseZone = cloudDatabase.zone(ZONE_NAME);
      const condition = new cloudDatabase.DatabaseQuery(TaskCloudDBInternal);
      condition.equalTo('status', status);
      const resultArray = await databaseZone.query(condition);
      return resultArray as TaskCloudDBInternal[];
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, '查询任务失败: %{public}s', error.message);
      return [];
    }
  }

  async queryTaskById(taskId: string): Promise<TaskCloudDBInternal | null> {
    try {
      const databaseZone = cloudDatabase.zone(ZONE_NAME);
      const condition = new cloudDatabase.DatabaseQuery(TaskCloudDBInternal);
      condition.equalTo('id', taskId);
      const resultArray = await databaseZone.query(condition);
      return resultArray.length > 0 ? resultArray[0] as TaskCloudDBInternal : null;
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, '查询任务失败: %{public}s', error.message);
      return null;
    }
  }

  async queryTasksByDateRange(startDate: string, endDate: string): Promise<TaskCloudDBInternal[]> {
    try {
      const databaseZone = cloudDatabase.zone(ZONE_NAME);
      const condition = new cloudDatabase.DatabaseQuery(TaskCloudDBInternal);
      condition.greaterThanOrEqualTo('dueDate', startDate).lessThanOrEqualTo('dueDate', endDate);
      const resultArray = await databaseZone.query(condition);
      return resultArray as TaskCloudDBInternal[];
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, '查询任务失败: %{public}s', error.message);
      return [];
    }
  }

  // ==================== 账单操作 ====================

  async upsertBill(bill: BillCloudDBInternal): Promise<number> {
    try {
      const databaseZone = cloudDatabase.zone(ZONE_NAME);
      const record = await databaseZone.upsert(bill);
      return record;
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, '保存账单失败: %{public}s', error.message);
      throw error;
    }
  }

  async deleteBill(billId: string): Promise<number> {
    try {
      const databaseZone = cloudDatabase.zone(ZONE_NAME);
      const billToDelete = new BillCloudDBInternal();
      billToDelete.id = billId;
      const deleteNum = await databaseZone.delete(billToDelete);
      return deleteNum;
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, '删除账单失败: %{public}s', error.message);
      throw error;
    }
  }

  async queryAllBills(): Promise<BillCloudDBInternal[]> {
    try {
      hilog.info(DOMAIN, TAG, '开始查询所有账单');
      const databaseZone = cloudDatabase.zone(ZONE_NAME);
      
      if (!databaseZone) {
        hilog.error(DOMAIN, TAG, 'CloudDB zone 获取失败，可能未初始化或无权限');
        return [];
      }
      
      const condition = new cloudDatabase.DatabaseQuery(BillCloudDBInternal);
      const resultArray = await databaseZone.query(condition);
      hilog.info(DOMAIN, TAG, '查询账单成功，数量: %{public}d', resultArray.length);
      return resultArray as BillCloudDBInternal[];
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, '查询账单失败: %{public}s', error.message);
      return [];
    }
  }

  async queryBillsByType(type: string): Promise<BillCloudDBInternal[]> {
    try {
      const databaseZone = cloudDatabase.zone(ZONE_NAME);
      const condition = new cloudDatabase.DatabaseQuery(BillCloudDBInternal);
      condition.equalTo('type', type);
      const resultArray = await databaseZone.query(condition);
      return resultArray as BillCloudDBInternal[];
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, '查询账单失败: %{public}s', error.message);
      return [];
    }
  }

  async queryBillsByDateRange(startDate: string, endDate: string): Promise<BillCloudDBInternal[]> {
    try {
      const databaseZone = cloudDatabase.zone(ZONE_NAME);
      const condition = new cloudDatabase.DatabaseQuery(BillCloudDBInternal);
      condition.greaterThanOrEqualTo('date', startDate).lessThanOrEqualTo('date', endDate);
      const resultArray = await databaseZone.query(condition);
      return resultArray as BillCloudDBInternal[];
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, '查询账单失败: %{public}s', error.message);
      return [];
    }
  }

  async queryBillById(billId: string): Promise<BillCloudDBInternal | null> {
    try {
      const databaseZone = cloudDatabase.zone(ZONE_NAME);
      const condition = new cloudDatabase.DatabaseQuery(BillCloudDBInternal);
      condition.equalTo('id', billId);
      const resultArray = await databaseZone.query(condition);
      return resultArray.length > 0 ? resultArray[0] as BillCloudDBInternal : null;
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, '查询账单失败: %{public}s', error.message);
      return null;
    }
  }

  // ==================== 工厂方法 ====================
  
  /**
   * 创建新的 TaskCloudDB 实例
   */
  createTask(): TaskCloudDBInternal {
    return new TaskCloudDBInternal();
  }

  /**
   * 创建新的 BillCloudDB 实例
   */
  createBill(): BillCloudDBInternal {
    return new BillCloudDBInternal();
  }
}
