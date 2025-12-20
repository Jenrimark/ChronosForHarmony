import { relationalStore, ValuesBucket } from '@kit.ArkData';
import { BusinessError } from '@kit.BasicServicesKit';
import { Context } from '@kit.AbilityKit';
import { Constants } from '../common/Constants';
import { Task, TaskData } from '../model/Task';

/**
 * 数据库服务类
 */
export class DatabaseService {
  private static instance: DatabaseService;
  private rdbStore: relationalStore.RdbStore | null = null;
  private readonly STORE_CONFIG: relationalStore.StoreConfig = {
    name: Constants.DATABASE_NAME,
    securityLevel: relationalStore.SecurityLevel.S1
  };

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * 初始化数据库
   */
  async init(context: Context): Promise<void> {
    try {
      this.rdbStore = await relationalStore.getRdbStore(context, this.STORE_CONFIG);
      await this.createTables();
    } catch (err) {
      const error = err as BusinessError;
      console.error('数据库初始化失败:', JSON.stringify(error));
      throw new Error('数据库初始化失败');
    }
  }

  /**
   * 创建数据表
   */
  private async createTables(): Promise<void> {
    if (!this.rdbStore) {
      throw new Error('数据库未初始化');
    }

    const createTableSql = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT '${Constants.TASK_STATUS_PENDING}',
        priority INTEGER NOT NULL DEFAULT ${Constants.PRIORITY_MEDIUM},
        dueDate TEXT,
        createTime TEXT NOT NULL,
        updateTime TEXT NOT NULL,
        completedTime TEXT,
        tags TEXT
      )
    `;

    await this.rdbStore.executeSql(createTableSql);
  }

  /**
   * 添加任务
   */
  async addTask(task: Task): Promise<number> {
    if (!this.rdbStore) {
      throw new Error('数据库未初始化');
    }

    const valuesBucket: ValuesBucket = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      createTime: task.createTime.toISOString(),
      updateTime: task.updateTime.toISOString(),
      completedTime: task.completedTime ? task.completedTime.toISOString() : null,
      tags: JSON.stringify(task.tags)
    };

    const insertId = await this.rdbStore.insert('tasks', valuesBucket);
    return Number(insertId);
  }

  /**
   * 更新任务
   */
  async updateTask(task: Task): Promise<void> {
    if (!this.rdbStore) {
      throw new Error('数据库未初始化');
    }

    task.updateTime = new Date();
    const valuesBucket: ValuesBucket = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      updateTime: task.updateTime.toISOString(),
      completedTime: task.completedTime ? task.completedTime.toISOString() : null,
      tags: JSON.stringify(task.tags)
    };

    const predicates = new relationalStore.RdbPredicates('tasks');
    predicates.equalTo('id', task.id);

    await this.rdbStore.update(valuesBucket, predicates);
  }

  /**
   * 删除任务
   */
  async deleteTask(id: number): Promise<void> {
    if (!this.rdbStore) {
      throw new Error('数据库未初始化');
    }

    const predicates = new relationalStore.RdbPredicates('tasks');
    predicates.equalTo('id', id);

    await this.rdbStore.delete(predicates);
  }

  /**
   * 根据ID获取任务
   */
  async getTaskById(id: number): Promise<Task | null> {
    if (!this.rdbStore) {
      throw new Error('数据库未初始化');
    }

    const predicates = new relationalStore.RdbPredicates('tasks');
    predicates.equalTo('id', id);

    const resultSet = await this.rdbStore.query(predicates, ['*']);
    if (resultSet.rowCount === 0) {
      resultSet.close();
      return null;
    }

    resultSet.goToFirstRow();
    const row = await resultSet.getRow();
    const task = this.rowToTask(row);
    resultSet.close();
    return task;
  }

  /**
   * 获取所有任务
   */
  async getAllTasks(): Promise<Task[]> {
    if (!this.rdbStore) {
      throw new Error('数据库未初始化');
    }

    const predicates = new relationalStore.RdbPredicates('tasks');
    predicates.orderByDesc('createTime');

    const resultSet = await this.rdbStore.query(predicates, ['*']);
    const tasks = await this.resultSetToTasks(resultSet);
    resultSet.close();
    return tasks;
  }

  /**
   * 根据状态获取任务
   */
  async getTasksByStatus(status: string): Promise<Task[]> {
    if (!this.rdbStore) {
      throw new Error('数据库未初始化');
    }

    const predicates = new relationalStore.RdbPredicates('tasks');
    predicates.equalTo('status', status);
    predicates.orderByDesc('createTime');

    const resultSet = await this.rdbStore.query(predicates, ['*']);
    const tasks = await this.resultSetToTasks(resultSet);
    resultSet.close();
    return tasks;
  }

  /**
   * 根据日期范围获取任务
   */
  async getTasksByDateRange(startDate: Date, endDate: Date): Promise<Task[]> {
    if (!this.rdbStore) {
      throw new Error('数据库未初始化');
    }

    const predicates = new relationalStore.RdbPredicates('tasks');
    predicates.greaterThanOrEqualTo('dueDate', startDate.toISOString());
    predicates.lessThanOrEqualTo('dueDate', endDate.toISOString());
    predicates.orderByAsc('dueDate');

    const resultSet = await this.rdbStore.query(predicates, ['*']);
    const tasks = await this.resultSetToTasks(resultSet);
    resultSet.close();
    return tasks;
  }

  /**
   * 将结果集转换为任务数组
   */
  private async resultSetToTasks(resultSet: relationalStore.ResultSet): Promise<Task[]> {
    const tasks: Task[] = [];
    while (!resultSet.isAtLastRow()) {
      resultSet.goToNextRow();
      const row = await resultSet.getRow();
      tasks.push(this.rowToTask(row));
    }
    return tasks;
  }

  /**
   * 将行数据转换为任务对象
   */
  private rowToTask(row: relationalStore.ResultSetRow): Task {
    const idValue = row.getValue('id');
    const titleValue = row.getValue('title');
    const descriptionValue = row.getValue('description');
    const statusValue = row.getValue('status');
    const priorityValue = row.getValue('priority');
    const dueDateValue = row.getValue('dueDate');
    const createTimeValue = row.getValue('createTime');
    const updateTimeValue = row.getValue('updateTime');
    const completedTimeValue = row.getValue('completedTime');
    const tagsValue = row.getValue('tags');

    const data: TaskData = {
      id: idValue ? Number(idValue) : 0,
      title: titleValue ? String(titleValue) : '',
      description: descriptionValue ? String(descriptionValue) : '',
      status: statusValue ? String(statusValue) : Constants.TASK_STATUS_PENDING,
      priority: priorityValue ? Number(priorityValue) : Constants.PRIORITY_MEDIUM,
      dueDate: dueDateValue ? String(dueDateValue) : null,
      createTime: createTimeValue ? String(createTimeValue) : new Date().toISOString(),
      updateTime: updateTimeValue ? String(updateTimeValue) : new Date().toISOString(),
      completedTime: completedTimeValue ? String(completedTimeValue) : null,
      tags: tagsValue ? JSON.parse(String(tagsValue)) : []
    };
    return new Task(data);
  }
}
