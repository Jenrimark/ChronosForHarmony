import { Task, TaskJSON } from '../model/Task';
import { Constants } from '../common/Constants';
import { Utils } from '../common/Utils';
import { CloudDBService } from './CloudDBService';
import { CloudDBConverter } from '../utils/CloudDBConverter';

/**
 * 任务服务类 - 使用华为云数据库（Cloud DB）
 * 实现端云协同：优先读写本地缓存，网络空闲时自动同步云端
 */
export class TaskService {
  private static instance: TaskService;
  private cloudDBService: CloudDBService = CloudDBService.getInstance();
  private initPromise: Promise<void> | null = null;

  private constructor() {
    // 初始化Cloud DB服务
    this.initPromise = this.cloudDBService.init();
  }

  static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  /**
   * 确保CloudDB已初始化
   */
  private async ensureInitialized(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise;
    }
  }

  /**
   * 创建任务
   * 数据会立即存入本地，随后静默上传云端
   */
  async createTask(task: Task): Promise<Task> {
    await this.ensureInitialized();
    try {
      // 设置创建时间和更新时间
      if (!task.createTime) {
        task.createTime = new Date();
      }
      task.updateTime = new Date();
      
      // 转换为Cloud DB对象
      const userId = CloudDBConverter.getCurrentUserId();
      const cloudDBTask = CloudDBConverter.taskToCloudDB(task, userId);
      
      // 保存到Cloud DB（会自动同步到云端）
      await this.cloudDBService.upsertTask(cloudDBTask);
      
      // 返回转换后的Task对象（使用cloudDBTask的id）
      return CloudDBConverter.cloudDBToTask(cloudDBTask);
    } catch (error) {
      console.error('创建任务失败:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * 更新任务
   */
  async updateTask(task: Task): Promise<void> {
    await this.ensureInitialized();
    try {
      task.updateTime = new Date();
      const userId = CloudDBConverter.getCurrentUserId();
      const cloudDBTask = CloudDBConverter.taskToCloudDB(task, userId);
      await this.cloudDBService.upsertTask(cloudDBTask);
    } catch (error) {
      console.error('更新任务失败:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * 删除任务
   */
  async deleteTask(id: number): Promise<void> {
    await this.ensureInitialized();
    try {
      await this.cloudDBService.deleteTask(id.toString());
    } catch (error) {
      console.error('删除任务失败:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * 获取任务
   */
  async getTask(id: number): Promise<Task | null> {
    await this.ensureInitialized();
    try {
      const cloudDBTask = await this.cloudDBService.queryTaskById(id.toString());
      if (!cloudDBTask) {
        return null;
      }
      return CloudDBConverter.cloudDBToTask(cloudDBTask);
    } catch (error) {
      console.error('获取任务失败:', error);
      return null;
    }
  }

  /**
   * 获取所有任务
   */
  async getAllTasks(): Promise<Task[]> {
    await this.ensureInitialized();
    try {
      const cloudDBTasks = await this.cloudDBService.queryAllTasks();
      return cloudDBTasks.map(cloudDB => CloudDBConverter.cloudDBToTask(cloudDB));
    } catch (error) {
      console.error('获取任务列表失败:', error);
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
    await this.ensureInitialized();
    try {
      const cloudDBTasks = await this.cloudDBService.queryTasksByStatus(status);
      return cloudDBTasks.map(cloudDB => CloudDBConverter.cloudDBToTask(cloudDB));
    } catch (error) {
      console.error('获取任务列表失败:', error);
      return [];
    }
  }

  /**
   * 完成任务
   */
  async completeTask(task: Task): Promise<void> {
    await this.ensureInitialized();
    try {
      task.status = Constants.TASK_STATUS_COMPLETED;
      task.completedTime = new Date();
      task.updateTime = new Date();
      await this.updateTask(task);
    } catch (error) {
      console.error('完成任务失败:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * 取消完成任务
   */
  async uncompleteTask(task: Task): Promise<void> {
    await this.ensureInitialized();
    try {
      task.status = Constants.TASK_STATUS_PENDING;
      task.completedTime = null;
      task.updateTime = new Date();
      await this.updateTask(task);
    } catch (error) {
      console.error('取消完成任务失败:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * 获取指定日期的任务
   */
  async getTasksByDate(date: Date): Promise<Task[]> {
    await this.ensureInitialized();
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      const cloudDBTasks = await this.cloudDBService.queryTasksByDateRange(
        startDate.toISOString(),
        endDate.toISOString()
      );
      return cloudDBTasks.map(cloudDB => CloudDBConverter.cloudDBToTask(cloudDB));
    } catch (error) {
      console.error('获取任务列表失败:', error);
      return [];
    }
  }

  /**
   * 获取指定日期范围的任务
   */
  async getTasksByDateRange(startDate: Date, endDate: Date): Promise<Task[]> {
    await this.ensureInitialized();
    try {
      const cloudDBTasks = await this.cloudDBService.queryTasksByDateRange(
        startDate.toISOString(),
        endDate.toISOString()
      );
      return cloudDBTasks.map(cloudDB => CloudDBConverter.cloudDBToTask(cloudDB));
    } catch (error) {
      console.error('获取任务列表失败:', error);
      return [];
    }
  }

  /**
   * 获取今日任务
   */
  async getTodayTasks(): Promise<Task[]> {
    const today = new Date();
    return await this.getTasksByDate(today);
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
}
