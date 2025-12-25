import { Constants } from '../common/Constants';

/**
 * 任务数据接口
 */
export interface TaskData {
  id?: number;
  title?: string;
  description?: string;
  status?: string;
  priority?: number;
  dueDate?: Date | string | null;
  createTime?: Date | string;
  updateTime?: Date | string;
  completedTime?: Date | string | null;
  tags?: string[];
}

/**
 * 任务JSON接口
 */
export interface TaskJSON {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: number;
  dueDate: string | null;
  createTime: string;
  updateTime: string;
  completedTime: string | null;
  tags: string[];
}

/**
 * 任务数据模型
 */
export class Task {
  id: number = 0; // 任务ID
  title: string = ''; // 任务标题
  description: string = ''; // 任务描述
  status: string = Constants.TASK_STATUS_PENDING; // 任务状态
  priority: number = Constants.PRIORITY_LOW; // 优先级（默认低）
  dueDate: Date | null = null; // 截止日期
  createTime: Date = new Date(); // 创建时间
  updateTime: Date = new Date(); // 更新时间
  completedTime: Date | null = null; // 完成时间
  tags: string[] = []; // 标签

  constructor(data?: TaskData) {
    if (data) {
      if (data.id !== undefined) this.id = data.id;
      if (data.title !== undefined) this.title = data.title;
      if (data.description !== undefined) this.description = data.description;
      if (data.status !== undefined) this.status = data.status;
      if (data.priority !== undefined) this.priority = data.priority;
      if (data.dueDate !== undefined) {
        this.dueDate = data.dueDate instanceof Date ? data.dueDate : (data.dueDate ? new Date(data.dueDate) : null);
      }
      if (data.createTime !== undefined) {
        this.createTime = data.createTime instanceof Date ? data.createTime : new Date(data.createTime);
      }
      if (data.updateTime !== undefined) {
        this.updateTime = data.updateTime instanceof Date ? data.updateTime : new Date(data.updateTime);
      }
      if (data.completedTime !== undefined) {
        this.completedTime = data.completedTime instanceof Date ? data.completedTime : (data.completedTime ? new Date(data.completedTime) : null);
      }
      if (data.tags !== undefined) this.tags = data.tags;
    }
  }

  /**
   * 转换为JSON对象
   */
  toJSON(): TaskJSON {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      dueDate: this.dueDate ? this.dueDate.toISOString() : null,
      createTime: this.createTime.toISOString(),
      updateTime: this.updateTime.toISOString(),
      completedTime: this.completedTime ? this.completedTime.toISOString() : null,
      tags: this.tags
    };
  }

  /**
   * 从JSON对象创建
   */
  static fromJSON(json: TaskJSON): Task {
    return new Task({
      id: json.id || 0,
      title: json.title || '',
      description: json.description || '',
      status: json.status || Constants.TASK_STATUS_PENDING,
      priority: json.priority || Constants.PRIORITY_LOW,
      dueDate: json.dueDate ? new Date(json.dueDate) : null,
      createTime: json.createTime ? new Date(json.createTime) : new Date(),
      updateTime: json.updateTime ? new Date(json.updateTime) : new Date(),
      completedTime: json.completedTime ? new Date(json.completedTime) : null,
      tags: json.tags || []
    });
  }

  /**
   * 判断任务是否过期
   */
  isOverdue(): boolean {
    if (!this.dueDate || this.status === Constants.TASK_STATUS_COMPLETED) {
      return false;
    }
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const due = new Date(this.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < now;
  }

  /**
   * 判断任务是否今天到期
   */
  isDueToday(): boolean {
    if (!this.dueDate) {
      return false;
    }
    const today = new Date();
    const due = new Date(this.dueDate);
    return today.getFullYear() === due.getFullYear() &&
      today.getMonth() === due.getMonth() &&
      today.getDate() === due.getDate();
  }
}

