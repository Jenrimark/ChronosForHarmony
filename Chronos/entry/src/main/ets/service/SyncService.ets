/**
 * 数据同步服务
 * 实现本地数据库与 CloudDB 的双向同步
 * 策略：离线优先，有网络时自动同步
 */
import { LocalDBService, LocalTask, LocalBill, SyncStatus } from './LocalDBService';
import { CloudDBService, TaskCloudDB, BillCloudDB } from './CloudDBService';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { connection } from '@kit.NetworkKit';

const TAG = 'SyncService';
const DOMAIN = 0x0000;

export class SyncService {
  private static instance: SyncService;
  private localDB: LocalDBService = LocalDBService.getInstance();
  private cloudDB: CloudDBService = CloudDBService.getInstance();
  private isSyncing: boolean = false;
  private netConnection: connection.NetConnection | null = null;

  private constructor() {}

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  /**
   * 初始化同步服务
   */
  async init(): Promise<void> {
    // 监听网络状态变化
    this.setupNetworkListener();
    hilog.info(DOMAIN, TAG, '同步服务初始化完成');
  }

  /**
   * 设置网络监听
   */
  private setupNetworkListener(): void {
    try {
      this.netConnection = connection.createNetConnection();
      
      this.netConnection.on('netAvailable', () => {
        hilog.info(DOMAIN, TAG, '网络已连接，开始同步...');
        this.syncAll();
      });

      this.netConnection.on('netUnavailable', () => {
        hilog.info(DOMAIN, TAG, '网络已断开，使用离线模式');
      });

      this.netConnection.register(() => {
        hilog.info(DOMAIN, TAG, '网络监听注册成功');
      });
    } catch (error) {
      hilog.error(DOMAIN, TAG, '设置网络监听失败: %{public}s', String(error));
    }
  }

  /**
   * 检查网络是否可用
   */
  async isNetworkAvailable(): Promise<boolean> {
    try {
      const hasNet = await connection.hasDefaultNet();
      return hasNet;
    } catch (error) {
      return false;
    }
  }

  /**
   * 同步所有数据
   */
  async syncAll(): Promise<void> {
    if (this.isSyncing) {
      hilog.info(DOMAIN, TAG, '同步正在进行中，跳过');
      return;
    }

    const hasNetwork = await this.isNetworkAvailable();
    if (!hasNetwork) {
      hilog.info(DOMAIN, TAG, '无网络连接，跳过同步');
      return;
    }

    this.isSyncing = true;
    hilog.info(DOMAIN, TAG, '开始全量同步...');

    try {
      // 1. 上传本地待同步数据到云端
      await this.uploadPendingData();

      // 2. 从云端下载数据到本地
      await this.downloadCloudData();

      hilog.info(DOMAIN, TAG, '同步完成');
    } catch (error) {
      hilog.error(DOMAIN, TAG, '同步失败: %{public}s', String(error));
    } finally {
      this.isSyncing = false;
    }
  }


  /**
   * 上传待同步数据到云端
   */
  private async uploadPendingData(): Promise<void> {
    // 上传任务
    const pendingTasks = await this.localDB.getPendingTasks();
    hilog.info(DOMAIN, TAG, '待同步任务数量: %{public}d', pendingTasks.length);

    for (const task of pendingTasks) {
      try {
        if (task.syncStatus === SyncStatus.DELETED) {
          // 删除云端数据
          await this.cloudDB.deleteTask(task.id);
        } else {
          // 上传到云端
          const cloudTask = this.localTaskToCloud(task);
          await this.cloudDB.upsertTask(cloudTask);
        }
        // 标记已同步
        await this.localDB.markTaskSynced(task.id);
      } catch (error) {
        hilog.error(DOMAIN, TAG, '上传任务失败: %{public}s', String(error));
      }
    }

    // 清理已删除的记录
    await this.localDB.purgeDeletedTasks();

    // 上传账单
    const pendingBills = await this.localDB.getPendingBills();
    hilog.info(DOMAIN, TAG, '待同步账单数量: %{public}d', pendingBills.length);

    for (const bill of pendingBills) {
      try {
        if (bill.syncStatus === SyncStatus.DELETED) {
          await this.cloudDB.deleteBill(bill.id);
        } else {
          const cloudBill = this.localBillToCloud(bill);
          await this.cloudDB.upsertBill(cloudBill);
        }
        await this.localDB.markBillSynced(bill.id);
      } catch (error) {
        hilog.error(DOMAIN, TAG, '上传账单失败: %{public}s', String(error));
      }
    }
  }

  /**
   * 从云端下载数据到本地
   */
  private async downloadCloudData(): Promise<void> {
    try {
      // 下载任务
      const cloudTasks = await this.cloudDB.queryAllTasks();
      hilog.info(DOMAIN, TAG, '云端任务数量: %{public}d', cloudTasks.length);

      for (const cloudTask of cloudTasks) {
        const localTask = await this.localDB.queryTaskById(cloudTask.id);
        
        // 冲突解决：比较更新时间，取最新的
        if (!localTask || this.shouldUpdateLocal(localTask.updateTime, cloudTask.updateTime)) {
          const task = this.cloudTaskToLocal(cloudTask);
          task.syncStatus = SyncStatus.SYNCED;
          await this.localDB.upsertTask(task);
        }
      }

      // 下载账单
      const cloudBills = await this.cloudDB.queryAllBills();
      hilog.info(DOMAIN, TAG, '云端账单数量: %{public}d', cloudBills.length);

      for (const cloudBill of cloudBills) {
        const localBill = await this.localDB.queryBillById(cloudBill.id);
        
        if (!localBill || this.shouldUpdateLocal(localBill.updateTime, cloudBill.updateTime)) {
          const bill = this.cloudBillToLocal(cloudBill);
          bill.syncStatus = SyncStatus.SYNCED;
          await this.localDB.upsertBill(bill);
        }
      }
    } catch (error) {
      hilog.error(DOMAIN, TAG, '下载云端数据失败: %{public}s', String(error));
    }
  }

  /**
   * 判断是否应该用云端数据更新本地
   * 基于时间戳的冲突解决策略
   */
  private shouldUpdateLocal(localTime: string, cloudTime: string): boolean {
    if (!localTime) return true;
    if (!cloudTime) return false;
    
    const localDate = new Date(localTime).getTime();
    const cloudDate = new Date(cloudTime).getTime();
    
    return cloudDate > localDate;
  }

  // ==================== 数据转换 ====================

  private localTaskToCloud(task: LocalTask): TaskCloudDB {
    const cloudTask = new TaskCloudDB();
    cloudTask.id = task.id;
    cloudTask.title = task.title;
    cloudTask.description = task.description;
    cloudTask.status = task.status;
    cloudTask.priority = task.priority;
    cloudTask.dueDate = task.dueDate;
    cloudTask.createTime = task.createTime;
    cloudTask.updateTime = task.updateTime;
    cloudTask.completedTime = task.completedTime;
    cloudTask.tags = task.tags;
    cloudTask.userld = task.userId;
    return cloudTask;
  }

  private cloudTaskToLocal(cloudTask: TaskCloudDB): LocalTask {
    return {
      id: cloudTask.id,
      title: cloudTask.title,
      description: cloudTask.description,
      status: cloudTask.status,
      priority: cloudTask.priority,
      dueDate: cloudTask.dueDate,
      createTime: cloudTask.createTime,
      updateTime: cloudTask.updateTime,
      completedTime: cloudTask.completedTime,
      tags: cloudTask.tags,
      userId: cloudTask.userld,
      syncStatus: SyncStatus.SYNCED,
      version: 1
    };
  }

  private localBillToCloud(bill: LocalBill): BillCloudDB {
    const cloudBill = new BillCloudDB();
    cloudBill.id = bill.id;
    cloudBill.type = bill.type;
    cloudBill.category = bill.category;
    cloudBill.amount = bill.amount;
    cloudBill.description = bill.description;
    cloudBill.date = bill.date;
    cloudBill.createTime = bill.createTime;
    cloudBill.updateTime = bill.updateTime;
    cloudBill.tags = bill.tags;
    cloudBill.userId = bill.userId;
    return cloudBill;
  }

  private cloudBillToLocal(cloudBill: BillCloudDB): LocalBill {
    return {
      id: cloudBill.id,
      type: cloudBill.type,
      category: cloudBill.category,
      amount: cloudBill.amount,
      description: cloudBill.description,
      date: cloudBill.date,
      createTime: cloudBill.createTime,
      updateTime: cloudBill.updateTime,
      tags: cloudBill.tags,
      userId: cloudBill.userId,
      syncStatus: SyncStatus.SYNCED,
      version: 1
    };
  }

  /**
   * 销毁服务
   */
  destroy(): void {
    if (this.netConnection) {
      this.netConnection.unregister(() => {
        hilog.info(DOMAIN, TAG, '网络监听已注销');
      });
    }
  }
}
