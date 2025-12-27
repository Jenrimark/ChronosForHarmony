/**
 * 本地数据库服务
 * 使用 RDB（关系型数据库）实现离线存储
 * 参考：本地 SQLite + CloudDB 双写模式
 */
import { relationalStore } from '@kit.ArkData';
import { common } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

const TAG = 'LocalDBService';
const DOMAIN = 0x0000;
const DB_NAME = 'chronos.db';
const DB_VERSION = 1;

// 同步状态枚举
export enum SyncStatus {
  SYNCED = 0,      // 已同步
  PENDING = 1,     // 待同步（新增/修改）
  DELETED = 2      // 待删除
}

/**
 * 本地任务数据
 */
export interface LocalTask {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  createTime: string;
  updateTime: string;
  completedTime: string;
  tags: string;
  userId: string;
  syncStatus: number;  // 同步状态
  version: number;     // 版本号，用于冲突解决
}

/**
 * 本地账单数据
 */
export interface LocalBill {
  id: string;
  type: string;
  category: string;
  amount: string;
  description: string;
  date: string;
  createTime: string;
  updateTime: string;
  tags: string;
  userId: string;
  syncStatus: number;
  version: number;
}

export class LocalDBService {
  private static instance: LocalDBService;
  private rdbStore: relationalStore.RdbStore | null = null;
  private context: common.UIAbilityContext | null = null;
  private isInitialized: boolean = false;

  private constructor() {}

  static getInstance(): LocalDBService {
    if (!LocalDBService.instance) {
      LocalDBService.instance = new LocalDBService();
    }
    return LocalDBService.instance;
  }

  /**
   * 设置 Context
   */
  setContext(context: common.UIAbilityContext): void {
    this.context = context;
  }


  /**
   * 初始化数据库
   */
  async init(): Promise<void> {
    if (this.isInitialized || !this.context) {
      return;
    }

    try {
      const config: relationalStore.StoreConfig = {
        name: DB_NAME,
        securityLevel: relationalStore.SecurityLevel.S1
      };

      this.rdbStore = await relationalStore.getRdbStore(this.context, config);
      hilog.info(DOMAIN, TAG, '本地数据库连接成功');

      // 创建表
      await this.createTables();
      this.isInitialized = true;
      hilog.info(DOMAIN, TAG, '本地数据库初始化完成');
    } catch (error) {
      hilog.error(DOMAIN, TAG, '本地数据库初始化失败: %{public}s', String(error));
    }
  }

  /**
   * 创建数据表
   */
  private async createTables(): Promise<void> {
    if (!this.rdbStore) return;

    // 任务表
    const createTaskTable = `
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT,
        priority TEXT,
        dueDate TEXT,
        createTime TEXT,
        updateTime TEXT,
        completedTime TEXT,
        tags TEXT,
        userId TEXT,
        syncStatus INTEGER DEFAULT 0,
        version INTEGER DEFAULT 1
      )
    `;

    // 账单表
    const createBillTable = `
      CREATE TABLE IF NOT EXISTS bills (
        id TEXT PRIMARY KEY,
        type TEXT,
        category TEXT,
        amount TEXT,
        description TEXT,
        date TEXT,
        createTime TEXT,
        updateTime TEXT,
        tags TEXT,
        userId TEXT,
        syncStatus INTEGER DEFAULT 0,
        version INTEGER DEFAULT 1
      )
    `;

    try {
      await this.rdbStore.executeSql(createTaskTable);
      await this.rdbStore.executeSql(createBillTable);
      hilog.info(DOMAIN, TAG, '数据表创建成功');
    } catch (error) {
      hilog.error(DOMAIN, TAG, '创建数据表失败: %{public}s', String(error));
    }
  }

  // ==================== 任务操作 ====================

  /**
   * 插入或更新任务（本地）
   */
  async upsertTask(task: LocalTask): Promise<void> {
    if (!this.rdbStore) {
      hilog.error(DOMAIN, TAG, '数据库未初始化');
      return;
    }

    try {
      const valueBucket: relationalStore.ValuesBucket = {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        createTime: task.createTime,
        updateTime: task.updateTime,
        completedTime: task.completedTime,
        tags: task.tags,
        userId: task.userId,
        syncStatus: task.syncStatus,
        version: task.version
      };

      // 使用 REPLACE 实现 upsert
      await this.rdbStore.insert('tasks', valueBucket, relationalStore.ConflictResolution.ON_CONFLICT_REPLACE);
      hilog.info(DOMAIN, TAG, '任务保存成功: %{public}s', task.id);
    } catch (error) {
      hilog.error(DOMAIN, TAG, '保存任务失败: %{public}s', String(error));
    }
  }

  /**
   * 查询所有任务
   */
  async queryAllTasks(): Promise<LocalTask[]> {
    if (!this.rdbStore) {
      return [];
    }

    try {
      const predicates = new relationalStore.RdbPredicates('tasks');
      predicates.notEqualTo('syncStatus', SyncStatus.DELETED);
      
      const resultSet = await this.rdbStore.query(predicates);
      const tasks: LocalTask[] = [];

      while (resultSet.goToNextRow()) {
        tasks.push(this.resultSetToTask(resultSet));
      }
      resultSet.close();

      hilog.info(DOMAIN, TAG, '查询任务成功，数量: %{public}d', tasks.length);
      return tasks;
    } catch (error) {
      hilog.error(DOMAIN, TAG, '查询任务失败: %{public}s', String(error));
      return [];
    }
  }


  /**
   * 根据ID查询任务
   */
  async queryTaskById(taskId: string): Promise<LocalTask | null> {
    if (!this.rdbStore) {
      return null;
    }

    try {
      const predicates = new relationalStore.RdbPredicates('tasks');
      predicates.equalTo('id', taskId);
      
      const resultSet = await this.rdbStore.query(predicates);
      let task: LocalTask | null = null;

      if (resultSet.goToNextRow()) {
        task = this.resultSetToTask(resultSet);
      }
      resultSet.close();
      return task;
    } catch (error) {
      hilog.error(DOMAIN, TAG, '查询任务失败: %{public}s', String(error));
      return null;
    }
  }

  /**
   * 根据状态查询任务
   */
  async queryTasksByStatus(status: string): Promise<LocalTask[]> {
    if (!this.rdbStore) {
      return [];
    }

    try {
      const predicates = new relationalStore.RdbPredicates('tasks');
      predicates.equalTo('status', status);
      predicates.notEqualTo('syncStatus', SyncStatus.DELETED);
      
      const resultSet = await this.rdbStore.query(predicates);
      const tasks: LocalTask[] = [];

      while (resultSet.goToNextRow()) {
        tasks.push(this.resultSetToTask(resultSet));
      }
      resultSet.close();
      return tasks;
    } catch (error) {
      hilog.error(DOMAIN, TAG, '查询任务失败: %{public}s', String(error));
      return [];
    }
  }

  /**
   * 删除任务（标记删除）
   */
  async deleteTask(taskId: string): Promise<void> {
    if (!this.rdbStore) {
      return;
    }

    try {
      // 标记为待删除，等待同步后真正删除
      const valueBucket: relationalStore.ValuesBucket = {
        syncStatus: SyncStatus.DELETED,
        updateTime: new Date().toISOString()
      };

      const predicates = new relationalStore.RdbPredicates('tasks');
      predicates.equalTo('id', taskId);
      
      await this.rdbStore.update(valueBucket, predicates);
      hilog.info(DOMAIN, TAG, '任务标记删除: %{public}s', taskId);
    } catch (error) {
      hilog.error(DOMAIN, TAG, '删除任务失败: %{public}s', String(error));
    }
  }

  /**
   * 获取待同步的任务
   */
  async getPendingTasks(): Promise<LocalTask[]> {
    if (!this.rdbStore) {
      return [];
    }

    try {
      const predicates = new relationalStore.RdbPredicates('tasks');
      predicates.notEqualTo('syncStatus', SyncStatus.SYNCED);
      
      const resultSet = await this.rdbStore.query(predicates);
      const tasks: LocalTask[] = [];

      while (resultSet.goToNextRow()) {
        tasks.push(this.resultSetToTask(resultSet));
      }
      resultSet.close();
      return tasks;
    } catch (error) {
      hilog.error(DOMAIN, TAG, '查询待同步任务失败: %{public}s', String(error));
      return [];
    }
  }

  /**
   * 标记任务已同步
   */
  async markTaskSynced(taskId: string): Promise<void> {
    if (!this.rdbStore) {
      return;
    }

    try {
      const valueBucket: relationalStore.ValuesBucket = {
        syncStatus: SyncStatus.SYNCED
      };

      const predicates = new relationalStore.RdbPredicates('tasks');
      predicates.equalTo('id', taskId);
      
      await this.rdbStore.update(valueBucket, predicates);
    } catch (error) {
      hilog.error(DOMAIN, TAG, '标记任务同步状态失败: %{public}s', String(error));
    }
  }

  /**
   * 真正删除已同步的删除记录
   */
  async purgeDeletedTasks(): Promise<void> {
    if (!this.rdbStore) {
      return;
    }

    try {
      const predicates = new relationalStore.RdbPredicates('tasks');
      predicates.equalTo('syncStatus', SyncStatus.DELETED);
      
      await this.rdbStore.delete(predicates);
      hilog.info(DOMAIN, TAG, '清理已删除任务完成');
    } catch (error) {
      hilog.error(DOMAIN, TAG, '清理已删除任务失败: %{public}s', String(error));
    }
  }

  /**
   * ResultSet 转 LocalTask
   */
  private resultSetToTask(resultSet: relationalStore.ResultSet): LocalTask {
    return {
      id: resultSet.getString(resultSet.getColumnIndex('id')),
      title: resultSet.getString(resultSet.getColumnIndex('title')),
      description: resultSet.getString(resultSet.getColumnIndex('description')),
      status: resultSet.getString(resultSet.getColumnIndex('status')),
      priority: resultSet.getString(resultSet.getColumnIndex('priority')),
      dueDate: resultSet.getString(resultSet.getColumnIndex('dueDate')),
      createTime: resultSet.getString(resultSet.getColumnIndex('createTime')),
      updateTime: resultSet.getString(resultSet.getColumnIndex('updateTime')),
      completedTime: resultSet.getString(resultSet.getColumnIndex('completedTime')),
      tags: resultSet.getString(resultSet.getColumnIndex('tags')),
      userId: resultSet.getString(resultSet.getColumnIndex('userId')),
      syncStatus: resultSet.getLong(resultSet.getColumnIndex('syncStatus')),
      version: resultSet.getLong(resultSet.getColumnIndex('version'))
    };
  }


  // ==================== 账单操作 ====================

  /**
   * 插入或更新账单（本地）
   */
  async upsertBill(bill: LocalBill): Promise<void> {
    if (!this.rdbStore) {
      hilog.error(DOMAIN, TAG, '数据库未初始化');
      return;
    }

    try {
      const valueBucket: relationalStore.ValuesBucket = {
        id: bill.id,
        type: bill.type,
        category: bill.category,
        amount: bill.amount,
        description: bill.description,
        date: bill.date,
        createTime: bill.createTime,
        updateTime: bill.updateTime,
        tags: bill.tags,
        userId: bill.userId,
        syncStatus: bill.syncStatus,
        version: bill.version
      };

      await this.rdbStore.insert('bills', valueBucket, relationalStore.ConflictResolution.ON_CONFLICT_REPLACE);
      hilog.info(DOMAIN, TAG, '账单保存成功: %{public}s', bill.id);
    } catch (error) {
      hilog.error(DOMAIN, TAG, '保存账单失败: %{public}s', String(error));
    }
  }

  /**
   * 查询所有账单
   */
  async queryAllBills(): Promise<LocalBill[]> {
    if (!this.rdbStore) {
      return [];
    }

    try {
      const predicates = new relationalStore.RdbPredicates('bills');
      predicates.notEqualTo('syncStatus', SyncStatus.DELETED);
      
      const resultSet = await this.rdbStore.query(predicates);
      const bills: LocalBill[] = [];

      while (resultSet.goToNextRow()) {
        bills.push(this.resultSetToBill(resultSet));
      }
      resultSet.close();

      hilog.info(DOMAIN, TAG, '查询账单成功，数量: %{public}d', bills.length);
      return bills;
    } catch (error) {
      hilog.error(DOMAIN, TAG, '查询账单失败: %{public}s', String(error));
      return [];
    }
  }

  /**
   * 根据ID查询账单
   */
  async queryBillById(billId: string): Promise<LocalBill | null> {
    if (!this.rdbStore) {
      return null;
    }

    try {
      const predicates = new relationalStore.RdbPredicates('bills');
      predicates.equalTo('id', billId);
      
      const resultSet = await this.rdbStore.query(predicates);
      let bill: LocalBill | null = null;

      if (resultSet.goToNextRow()) {
        bill = this.resultSetToBill(resultSet);
      }
      resultSet.close();
      return bill;
    } catch (error) {
      hilog.error(DOMAIN, TAG, '查询账单失败: %{public}s', String(error));
      return null;
    }
  }

  /**
   * 根据类型查询账单
   */
  async queryBillsByType(type: string): Promise<LocalBill[]> {
    if (!this.rdbStore) {
      return [];
    }

    try {
      const predicates = new relationalStore.RdbPredicates('bills');
      predicates.equalTo('type', type);
      predicates.notEqualTo('syncStatus', SyncStatus.DELETED);
      
      const resultSet = await this.rdbStore.query(predicates);
      const bills: LocalBill[] = [];

      while (resultSet.goToNextRow()) {
        bills.push(this.resultSetToBill(resultSet));
      }
      resultSet.close();
      return bills;
    } catch (error) {
      hilog.error(DOMAIN, TAG, '查询账单失败: %{public}s', String(error));
      return [];
    }
  }

  /**
   * 删除账单（标记删除）
   */
  async deleteBill(billId: string): Promise<void> {
    if (!this.rdbStore) {
      return;
    }

    try {
      const valueBucket: relationalStore.ValuesBucket = {
        syncStatus: SyncStatus.DELETED,
        updateTime: new Date().toISOString()
      };

      const predicates = new relationalStore.RdbPredicates('bills');
      predicates.equalTo('id', billId);
      
      await this.rdbStore.update(valueBucket, predicates);
      hilog.info(DOMAIN, TAG, '账单标记删除: %{public}s', billId);
    } catch (error) {
      hilog.error(DOMAIN, TAG, '删除账单失败: %{public}s', String(error));
    }
  }

  /**
   * 获取待同步的账单
   */
  async getPendingBills(): Promise<LocalBill[]> {
    if (!this.rdbStore) {
      return [];
    }

    try {
      const predicates = new relationalStore.RdbPredicates('bills');
      predicates.notEqualTo('syncStatus', SyncStatus.SYNCED);
      
      const resultSet = await this.rdbStore.query(predicates);
      const bills: LocalBill[] = [];

      while (resultSet.goToNextRow()) {
        bills.push(this.resultSetToBill(resultSet));
      }
      resultSet.close();
      return bills;
    } catch (error) {
      hilog.error(DOMAIN, TAG, '查询待同步账单失败: %{public}s', String(error));
      return [];
    }
  }

  /**
   * 标记账单已同步
   */
  async markBillSynced(billId: string): Promise<void> {
    if (!this.rdbStore) {
      return;
    }

    try {
      const valueBucket: relationalStore.ValuesBucket = {
        syncStatus: SyncStatus.SYNCED
      };

      const predicates = new relationalStore.RdbPredicates('bills');
      predicates.equalTo('id', billId);
      
      await this.rdbStore.update(valueBucket, predicates);
    } catch (error) {
      hilog.error(DOMAIN, TAG, '标记账单同步状态失败: %{public}s', String(error));
    }
  }

  /**
   * ResultSet 转 LocalBill
   */
  private resultSetToBill(resultSet: relationalStore.ResultSet): LocalBill {
    return {
      id: resultSet.getString(resultSet.getColumnIndex('id')),
      type: resultSet.getString(resultSet.getColumnIndex('type')),
      category: resultSet.getString(resultSet.getColumnIndex('category')),
      amount: resultSet.getString(resultSet.getColumnIndex('amount')),
      description: resultSet.getString(resultSet.getColumnIndex('description')),
      date: resultSet.getString(resultSet.getColumnIndex('date')),
      createTime: resultSet.getString(resultSet.getColumnIndex('createTime')),
      updateTime: resultSet.getString(resultSet.getColumnIndex('updateTime')),
      tags: resultSet.getString(resultSet.getColumnIndex('tags')),
      userId: resultSet.getString(resultSet.getColumnIndex('userId')),
      syncStatus: resultSet.getLong(resultSet.getColumnIndex('syncStatus')),
      version: resultSet.getLong(resultSet.getColumnIndex('version'))
    };
  }

  /**
   * 检查数据库是否已初始化
   */
  isReady(): boolean {
    return this.isInitialized && this.rdbStore !== null;
  }
}
