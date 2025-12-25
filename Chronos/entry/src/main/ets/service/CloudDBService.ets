/**
 * Cloud DB服务类
 * 严格按照华为官方文档实现
 * 参考: https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/cloudfoundation-database-service
 */
import { cloudDatabase } from '@kit.CloudFoundationKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { TaskCloudDB } from '../model/clouddb/TaskCloudDB';
import { BillCloudDB } from '../model/clouddb/BillCloudDB';

// 存储区名称（必须与AGC控制台创建的存储区名称一致）
const ZONE_NAME: string = 'ChronosZone';
const TAG: string = 'CloudDBService';
const DOMAIN: number = 0x0000;

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

  /**
   * 初始化Cloud DB
   */
  async init(): Promise<void> {
    if (this.isInitialized) {
      hilog.info(DOMAIN, TAG, 'Cloud DB已经初始化');
      return;
    }
    
    try {
      // 测试获取zone
      const zone = cloudDatabase.zone(ZONE_NAME);
      hilog.info(DOMAIN, TAG, 'Cloud DB zone获取成功: %{public}s', ZONE_NAME);
      this.isInitialized = true;
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, 'Cloud DB初始化失败: %{public}s', error.message || JSON.stringify(err));
    }
  }

  // ==================== 任务相关操作 ====================

  /**
   * 添加或更新任务
   */
  async upsertTask(task: TaskCloudDB): Promise<number> {
    try {
      hilog.info(DOMAIN, TAG, '准备保存任务: %{public}s', task.id || 'new');
      const databaseZone = cloudDatabase.zone(ZONE_NAME);
      const record = await databaseZone.upsert(task);
      hilog.info(DOMAIN, TAG, '任务保存成功，影响记录数: %{public}d', record);
      return record;
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, '保存任务失败, code: %{public}s, message: %{public}s', 
        (err as ESObject).code || '', error.message || JSON.stringify(err));
      throw new Error('保存任务失败: ' + (error.message || JSON.stringify(err)));
    }
  }

  /**
   * 删除任务
   */
  async deleteTask(taskId: string): Promise<number> {
    try {
      const databaseZone = cloudDatabase.zone(ZONE_NAME);
      const taskToDelete = new TaskCloudDB();
      taskToDelete.id = taskId;
      const deleteNum = await databaseZone.delete(taskToDelete);
      hilog.info(DOMAIN, TAG, '任务删除成功，删除记录数: %{public}d', deleteNum);
      return deleteNum;
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, '删除任务失败, code: %{public}s, message: %{public}s',
        (err as ESObject).code || '', error.message || JSON.stringify(err));
      throw new Error('删除任务失败: ' + (error.message || JSON.stringify(err)));
    }
  }

  /**
   * 查询所有任务
   */
  async queryAllTasks(): Promise<TaskCloudDB[]> {
    try {
      hilog.info(DOMAIN, TAG, '===== 开始查询所有任务 =====');
      
      // 每次查询都创建新的zone和condition
      const databaseZone = cloudDatabase.zone(ZONE_NAME);
      const condition = new cloudDatabase.DatabaseQuery(TaskCloudDB);
      
      const resultArray = await databaseZone.query(condition);
      hilog.info(DOMAIN, TAG, '查询任务成功，数量: %{public}d', resultArray.length);
      return resultArray as TaskCloudDB[];
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, '查询任务失败, code: %{public}s, message: %{public}s',
        (err as ESObject).code || '', error.message || JSON.stringify(err));
      return [];
    }
  }

  /**
   * 根据状态查询任务
   */
  async queryTasksByStatus(status: string): Promise<TaskCloudDB[]> {
    try {
      const databaseZone = cloudDatabase.zone(ZONE_NAME);
      const condition = new cloudDatabase.DatabaseQuery(TaskCloudDB);
      condition.equalTo('status', status);
      
      const resultArray = await databaseZone.query(condition);
      hilog.info(DOMAIN, TAG, '按状态查询任务成功，数量: %{public}d', resultArray.length);
      return resultArray as TaskCloudDB[];
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, '查询任务失败, code: %{public}s, message: %{public}s',
        (err as ESObject).code || '', error.message || JSON.stringify(err));
      return [];
    }
  }

  /**
   * 根据ID查询任务
   */
  async queryTaskById(taskId: string): Promise<TaskCloudDB | null> {
    try {
      const databaseZone = cloudDatabase.zone(ZONE_NAME);
      const condition = new cloudDatabase.DatabaseQuery(TaskCloudDB);
      condition.equalTo('id', taskId);
      
      const resultArray = await databaseZone.query(condition);
      return resultArray.length > 0 ? resultArray[0] as TaskCloudDB : null;
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, '查询任务失败, code: %{public}s, message: %{public}s',
        (err as ESObject).code || '', error.message || JSON.stringify(err));
      return null;
    }
  }

  /**
   * 根据日期范围查询任务
   */
  async queryTasksByDateRange(startDate: string, endDate: string): Promise<TaskCloudDB[]> {
    try {
      const databaseZone = cloudDatabase.zone(ZONE_NAME);
      const condition = new cloudDatabase.DatabaseQuery(TaskCloudDB);
      condition.greaterThanOrEqualTo('dueDate', startDate).lessThanOrEqualTo('dueDate', endDate);
      
      const resultArray = await databaseZone.query(condition);
      hilog.info(DOMAIN, TAG, '按日期范围查询任务成功，数量: %{public}d', resultArray.length);
      return resultArray as TaskCloudDB[];
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, '查询任务失败, code: %{public}s, message: %{public}s',
        (err as ESObject).code || '', error.message || JSON.stringify(err));
      return [];
    }
  }

  // ==================== 账单相关操作 ====================

  /**
   * 添加或更新账单
   */
  async upsertBill(bill: BillCloudDB): Promise<number> {
    try {
      hilog.info(DOMAIN, TAG, '准备保存账单: %{public}s', bill.id || 'new');
      const databaseZone = cloudDatabase.zone(ZONE_NAME);
      const record = await databaseZone.upsert(bill);
      hilog.info(DOMAIN, TAG, '账单保存成功，影响记录数: %{public}d', record);
      return record;
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, '保存账单失败, code: %{public}s, message: %{public}s',
        (err as ESObject).code || '', error.message || JSON.stringify(err));
      throw new Error('保存账单失败: ' + (error.message || JSON.stringify(err)));
    }
  }

  /**
   * 删除账单
   */
  async deleteBill(billId: string): Promise<number> {
    try {
      const databaseZone = cloudDatabase.zone(ZONE_NAME);
      const billToDelete = new BillCloudDB();
      billToDelete.id = billId;
      const deleteNum = await databaseZone.delete(billToDelete);
      hilog.info(DOMAIN, TAG, '账单删除成功，删除记录数: %{public}d', deleteNum);
      return deleteNum;
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, '删除账单失败, code: %{public}s, message: %{public}s',
        (err as ESObject).code || '', error.message || JSON.stringify(err));
      throw new Error('删除账单失败: ' + (error.message || JSON.stringify(err)));
    }
  }

  /**
   * 查询所有账单
   */
  async queryAllBills(): Promise<BillCloudDB[]> {
    try {
      hilog.info(DOMAIN, TAG, '===== 开始查询所有账单 =====');
      
      const databaseZone = cloudDatabase.zone(ZONE_NAME);
      const condition = new cloudDatabase.DatabaseQuery(BillCloudDB);
      
      const resultArray = await databaseZone.query(condition);
      hilog.info(DOMAIN, TAG, '查询账单成功，数量: %{public}d', resultArray.length);
      return resultArray as BillCloudDB[];
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, '查询账单失败, code: %{public}s, message: %{public}s',
        (err as ESObject).code || '', error.message || JSON.stringify(err));
      return [];
    }
  }

  /**
   * 根据类型查询账单
   */
  async queryBillsByType(type: string): Promise<BillCloudDB[]> {
    try {
      const databaseZone = cloudDatabase.zone(ZONE_NAME);
      const condition = new cloudDatabase.DatabaseQuery(BillCloudDB);
      condition.equalTo('type', type);
      
      const resultArray = await databaseZone.query(condition);
      hilog.info(DOMAIN, TAG, '按类型查询账单成功，数量: %{public}d', resultArray.length);
      return resultArray as BillCloudDB[];
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, '查询账单失败, code: %{public}s, message: %{public}s',
        (err as ESObject).code || '', error.message || JSON.stringify(err));
      return [];
    }
  }

  /**
   * 根据日期范围查询账单
   */
  async queryBillsByDateRange(startDate: string, endDate: string): Promise<BillCloudDB[]> {
    try {
      const databaseZone = cloudDatabase.zone(ZONE_NAME);
      const condition = new cloudDatabase.DatabaseQuery(BillCloudDB);
      condition.greaterThanOrEqualTo('date', startDate).lessThanOrEqualTo('date', endDate);
      
      const resultArray = await databaseZone.query(condition);
      hilog.info(DOMAIN, TAG, '按日期范围查询账单成功，数量: %{public}d', resultArray.length);
      return resultArray as BillCloudDB[];
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, '查询账单失败, code: %{public}s, message: %{public}s',
        (err as ESObject).code || '', error.message || JSON.stringify(err));
      return [];
    }
  }

  /**
   * 根据ID查询账单
   */
  async queryBillById(billId: string): Promise<BillCloudDB | null> {
    try {
      const databaseZone = cloudDatabase.zone(ZONE_NAME);
      const condition = new cloudDatabase.DatabaseQuery(BillCloudDB);
      condition.equalTo('id', billId);
      
      const resultArray = await databaseZone.query(condition);
      return resultArray.length > 0 ? resultArray[0] as BillCloudDB : null;
    } catch (err) {
      const error = err as Error;
      hilog.error(DOMAIN, TAG, '查询账单失败, code: %{public}s, message: %{public}s',
        (err as ESObject).code || '', error.message || JSON.stringify(err));
      return null;
    }
  }
}
