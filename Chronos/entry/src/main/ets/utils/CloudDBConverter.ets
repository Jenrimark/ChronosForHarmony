import { Task, TaskData } from '../model/Task';
import { TaskCloudDB } from '../model/clouddb/TaskCloudDB';
import { Bill, BillType, BillCategory, BillData } from '../model/Bill';
import { BillCloudDB } from '../model/clouddb/BillCloudDB';

/**
 * Cloud DB数据转换工具类
 */
export class CloudDBConverter {
  /**
   * 生成唯一ID（使用时间戳+随机数）
   */
  static generateId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${timestamp}_${random}`;
  }

  /**
   * 将Task转换为TaskCloudDB
   */
  static taskToCloudDB(task: Task, userId: string = 'default'): TaskCloudDB {
    const taskId: string = task.id > 0 ? task.id.toString() : CloudDBConverter.generateId();
    const cloudDB: TaskCloudDB = new TaskCloudDB();
    cloudDB.id = taskId;
    cloudDB.title = task.title;
    cloudDB.description = task.description;
    cloudDB.status = task.status;
    cloudDB.priority = task.priority;
    cloudDB.dueDate = task.dueDate ? task.dueDate.toISOString() : null;
    cloudDB.createTime = task.createTime.toISOString();
    cloudDB.updateTime = task.updateTime.toISOString();
    cloudDB.completedTime = task.completedTime ? task.completedTime.toISOString() : null;
    cloudDB.tags = JSON.stringify(task.tags || []);
    cloudDB.userId = userId;
    return cloudDB;
  }

  /**
   * 将TaskCloudDB转换为Task
   */
  static cloudDBToTask(cloudDB: TaskCloudDB): Task {
    let tags: string[] = [];
    try {
      tags = JSON.parse(cloudDB.tags || '[]');
    } catch (e) {
      tags = [];
    }

    const taskData: TaskData = {
      id: parseInt(cloudDB.id) || 0,
      title: cloudDB.title,
      description: cloudDB.description,
      status: cloudDB.status,
      priority: cloudDB.priority,
      dueDate: cloudDB.dueDate ? new Date(cloudDB.dueDate) : null,
      createTime: cloudDB.createTime ? new Date(cloudDB.createTime) : new Date(),
      updateTime: cloudDB.updateTime ? new Date(cloudDB.updateTime) : new Date(),
      completedTime: cloudDB.completedTime ? new Date(cloudDB.completedTime) : null,
      tags: tags
    };
    
    return new Task(taskData);
  }

  /**
   * 将Bill转换为BillCloudDB
   */
  static billToCloudDB(bill: Bill, userId: string = 'default'): BillCloudDB {
    const billId: string = bill.id > 0 ? bill.id.toString() : CloudDBConverter.generateId();
    const cloudDB: BillCloudDB = new BillCloudDB();
    cloudDB.id = billId;
    cloudDB.type = bill.type;
    cloudDB.category = bill.category;
    cloudDB.amount = bill.amount;
    cloudDB.description = bill.description;
    cloudDB.date = bill.date.toISOString();
    cloudDB.createTime = bill.createTime.toISOString();
    cloudDB.updateTime = bill.updateTime.toISOString();
    cloudDB.tags = JSON.stringify(bill.tags || []);
    cloudDB.userId = userId;
    return cloudDB;
  }

  /**
   * 将BillCloudDB转换为Bill
   */
  static cloudDBToBill(cloudDB: BillCloudDB): Bill {
    let tags: string[] = [];
    try {
      tags = JSON.parse(cloudDB.tags || '[]');
    } catch (e) {
      tags = [];
    }

    // 类型转换：从字符串转换为枚举类型
    const billType: BillType = cloudDB.type === 'income' ? BillType.INCOME : BillType.EXPENSE;
    const billCategory: BillCategory = cloudDB.category as BillCategory;
    
    const billData: BillData = {
      id: parseInt(cloudDB.id) || 0,
      type: billType,
      category: billCategory,
      amount: cloudDB.amount,
      description: cloudDB.description,
      date: cloudDB.date ? new Date(cloudDB.date) : new Date(),
      createTime: cloudDB.createTime ? new Date(cloudDB.createTime) : new Date(),
      updateTime: cloudDB.updateTime ? new Date(cloudDB.updateTime) : new Date(),
      tags: tags
    };
    
    return new Bill(billData);
  }

  /**
   * 获取当前用户ID（临时实现，后续可以从UserService获取）
   */
  static getCurrentUserId(): string {
    // TODO: 从UserService或AuthService获取当前登录用户ID
    // 暂时返回默认值
    return 'default_user';
  }
}

