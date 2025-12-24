/**
 * 任务Cloud DB对象类型
 * 注意：这个类需要与AGC控制台中定义的对象类型结构完全一致
 */
export class TaskCloudDB {
  // 主键字段（必须）
  id: string = '';
  
  // 任务字段
  title: string = '';
  description: string = ''; // 可空字段，但使用空字符串作为默认值
  status: string = 'pending'; // pending, in_progress, completed, cancelled
  priority: number = 1; // 1-低, 2-中, 3-高
  dueDate: string | null = null; // ISO日期字符串（可空）
  createTime: string = ''; // ISO日期字符串
  updateTime: string = ''; // ISO日期字符串
  completedTime: string | null = null; // ISO日期字符串（可空）
  tags: string = '[]'; // JSON字符串数组

  // 用户ID（用于多用户隔离）
  userId: string = '';

  constructor(data?: Partial<TaskCloudDB>) {
    if (data) {
      if (data.id !== undefined) this.id = data.id;
      if (data.title !== undefined) this.title = data.title;
      if (data.description !== undefined) this.description = data.description;
      if (data.status !== undefined) this.status = data.status;
      if (data.priority !== undefined) this.priority = data.priority;
      if (data.dueDate !== undefined) this.dueDate = data.dueDate;
      if (data.createTime !== undefined) this.createTime = data.createTime;
      if (data.updateTime !== undefined) this.updateTime = data.updateTime;
      if (data.completedTime !== undefined) this.completedTime = data.completedTime;
      if (data.tags !== undefined) this.tags = data.tags;
      if (data.userId !== undefined) this.userId = data.userId;
    }
  }
}

