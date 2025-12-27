import { Task, TaskData } from '../model/Task';
import { Constants } from '../common/Constants';
import { Utils } from '../common/Utils';
import { LocalDBService, LocalTask, SyncStatus } from './LocalDBService';
import { SyncService } from './SyncService';
import { hilog } from '@kit.PerformanceAnalysisKit';

const TAG = 'TaskService';
const DOMAIN = 0x0000;

/**
 * 任务服务类 - 离线优先模式
 * 策略：数据优先存入本地 SQLite，后台静默同步到云端
 * 参考：华为云开发最佳实践 - 本地 SQLite + CloudDB 双写模式
 */
export class TaskService {
  private static instance: TaskService;
  private localDB: LocalDBService = LocalDBService.getInstance();
  private syncService: SyncService = SyncService.getInstance();

  private constructor() {}

  static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
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
   * Task 转 LocalTask
   */
  private taskToLocal(task: Task, syncStatus: number = SyncStatus.PENDING): LocalTask {
    // 优先使用 localId，如果没有则生成新的
    const taskId = task.localId ? task.localId : this.generateId();
    return {
      id: taskId,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority.toString(),
      dueDate: task.dueDate ? task.dueDate.toISOString() : '',
      createTime: task.createTime ? task.createTime.toISOString() : new Date().toISOString(),
      updateTime: task.updateTime ? task.updateTime.toISOString() : new Date().toISOString(),
      completedTime: task.completedTime ? task.completedTime.toISOString() : '',
      tags: JSON.stringify(task.tags || []),
      userId: 'default_user',
      syncStatus: syncStatus,
      version: 1
    };
  }

  /**
   * LocalTask 转 Task
   */
  private localToTask(local: LocalTask): Task {
    let tags: string[] = [];
    try {
      tags = JSON.parse(local.tags || '[]');
    } catch (e) {
      tags = [];
    }

    let priorityNum = 1;
    if (local.priority) {
      const parsed = parseInt(local.priority);
      if (!isNaN(parsed)) {
        priorityNum = parsed;
      }
    }

    const taskData: TaskData = {
      id: parseInt(local.id) || 0,
      localId: local.id, // 保存原始的本地ID
      title: local.title || '',
      description: local.description || '',
      status: local.status || 'pending',
      priority: priorityNum,
      dueDate: local.dueDate ? new Date(local.dueDate) : null,
      createTime: local.createTime ? new Date(local.createTime) : new Date(),
      updateTime: local.updateTime ? new Date(local.updateTime) : new Date(),
      completedTime: local.completedTime ? new Date(local.completedTime) : null,
      tags: tags
    };

    return new Task(taskData);
  }

  /**
   * 创建任务
   * 离线优先：先存本地，后台静默同步
   */
  async createTask(task: Task): Promise<Task> {
    try {
      // 设置时间
      if (!task.createTime) {
        task.createTime = new Date();
      }
      task.updateTime = new Date();

      // 转换为本地格式并保存
      const localTask = this.taskToLocal(task, SyncStatus.PENDING);
      await this.localDB.upsertTask(localTask);
      
      hilog.info(DOMAIN, TAG, '任务已保存到本地: %{public}s', localTask.id);

      // 触发后台同步（不阻塞）
      this.triggerSync();

      // 返回带有新ID的Task
      return this.localToTask(localTask);
    } catch (error) {
      hilog.error(DOMAIN, TAG, '创建任务失败: %{public}s', String(error));
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * 更新任务
   */
  async updateTask(task: Task): Promise<void> {
    try {
      task.updateTime = new Date();
      const localTask = this.taskToLocal(task, SyncStatus.PENDING);
      await this.localDB.upsertTask(localTask);
      
      hilog.info(DOMAIN, TAG, '任务已更新: %{public}s', localTask.id);
      this.triggerSync();
    } catch (error) {
      hilog.error(DOMAIN, TAG, '更新任务失败: %{public}s', String(error));
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * 删除任务（标记删除）
   * @param taskOrId 可以是 Task 对象或 localId 字符串
   */
  async deleteTask(taskOrId: Task | string): Promise<void> {
    try {
      let localId: string;
      if (typeof taskOrId === 'string') {
        localId = taskOrId;
      } else {
        // 如果是 Task 对象，优先使用 localId
        localId = taskOrId.localId || taskOrId.id.toString();
      }
      
      await this.localDB.deleteTask(localId);
      hilog.info(DOMAIN, TAG, '任务已标记删除: %{public}s', localId);
      this.triggerSync();
    } catch (error) {
      hilog.error(DOMAIN, TAG, '删除任务失败: %{public}s', String(error));
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * 获取任务
   */
  async getTask(id: number): Promise<Task | null> {
    try {
      const localTask = await this.localDB.queryTaskById(id.toString());
      if (!localTask) {
        return null;
      }
      return this.localToTask(localTask);
    } catch (error) {
      hilog.error(DOMAIN, TAG, '获取任务失败: %{public}s', String(error));
      return null;
    }
  }

  /**
   * 获取所有任务
   */
  async getAllTasks(): Promise<Task[]> {
    try {
      const localTasks = await this.localDB.queryAllTasks();
      return localTasks.map(local => this.localToTask(local));
    } catch (error) {
      hilog.error(DOMAIN, TAG, '获取任务列表失败: %{public}s', String(error));
      return [];
    }
  }

  /**
   * 获取待办任务
   */
  async getPendingTasks(): Promise<Task[]> {
    return await this.getTasksByStatus(Constants.TASK_STATUS_PENDING);
  }

  /**
   * 获取进行中的任务
   */
  async getInProgressTasks(): Promise<Task[]> {
    return await this.getTasksByStatus(Constants.TASK_STATUS_IN_PROGRESS);
  }

  /**
   * 获取已完成的任务
   */
  async getCompletedTasks(): Promise<Task[]> {
    return await this.getTasksByStatus(Constants.TASK_STATUS_COMPLETED);
  }

  /**
   * 根据状态获取任务
   */
  async getTasksByStatus(status: string): Promise<Task[]> {
    try {
      const localTasks = await this.localDB.queryTasksByStatus(status);
      return localTasks.map(local => this.localToTask(local));
    } catch (error) {
      hilog.error(DOMAIN, TAG, '获取任务列表失败: %{public}s', String(error));
      return [];
    }
  }

  /**
   * 完成任务
   */
  async completeTask(task: Task): Promise<void> {
    task.status = Constants.TASK_STATUS_COMPLETED;
    task.completedTime = new Date();
    task.updateTime = new Date();
    await this.updateTask(task);
  }

  /**
   * 取消完成任务
   */
  async uncompleteTask(task: Task): Promise<void> {
    task.status = Constants.TASK_STATUS_PENDING;
    task.completedTime = null;
    task.updateTime = new Date();
    await this.updateTask(task);
  }

  /**
   * 获取指定日期的任务
   * 注意：本地查询需要在内存中过滤
   */
  async getTasksByDate(date: Date): Promise<Task[]> {
    try {
      const allTasks = await this.getAllTasks();
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      return allTasks.filter(task => {
        if (!task.dueDate) return false;
        const dueTime = task.dueDate.getTime();
        return dueTime >= startOfDay.getTime() && dueTime <= endOfDay.getTime();
      });
    } catch (error) {
      hilog.error(DOMAIN, TAG, '获取任务列表失败: %{public}s', String(error));
      return [];
    }
  }

  /**
   * 获取指定日期范围的任务
   */
  async getTasksByDateRange(startDate: Date, endDate: Date): Promise<Task[]> {
    try {
      const allTasks = await this.getAllTasks();
      const startTime = startDate.getTime();
      const endTime = endDate.getTime();

      return allTasks.filter(task => {
        if (!task.dueDate) return false;
        const dueTime = task.dueDate.getTime();
        return dueTime >= startTime && dueTime <= endTime;
      });
    } catch (error) {
      hilog.error(DOMAIN, TAG, '获取任务列表失败: %{public}s', String(error));
      return [];
    }
  }

  /**
   * 获取今日任务
   */
  async getTodayTasks(): Promise<Task[]> {
    return await this.getTasksByDate(new Date());
  }

  /**
   * 获取本周任务
   */
  async getWeekTasks(): Promise<Task[]> {
    const today = new Date();
    const weekStart = Utils.getWeekStart(today);
    const weekEnd = Utils.getWeekEnd(today);
    return await this.getTasksByDateRange(weekStart, weekEnd);
  }

  /**
   * 获取本月任务
   */
  async getMonthTasks(): Promise<Task[]> {
    const today = new Date();
    const monthStart = Utils.getMonthStart(today);
    const monthEnd = Utils.getMonthEnd(today);
    return await this.getTasksByDateRange(monthStart, monthEnd);
  }

  /**
   * 触发后台同步（非阻塞）
   */
  private triggerSync(): void {
    // 使用 setTimeout 延迟执行，避免阻塞主线程
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
