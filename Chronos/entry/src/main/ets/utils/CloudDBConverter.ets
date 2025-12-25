import { Task, TaskData } from '../model/Task';
import { TaskCloudDB } from '../model/clouddb/TaskCloudDB';
import { Bill, BillType, BillCategory, BillData } from '../model/Bill';
import { BillCloudDB } from '../model/clouddb/BillCloudDB';

/**
 * Cloud DB数据转换工具类
 * 处理前端模型和数据库模型之间的转换
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
  static taskToCloudDB(task: Task, odlUserId: string = 'default'): TaskCloudDB {
    const taskId: string = task.id > 0 ? task.id.toString() : CloudDBConverter.generateId();
    const cloudDB: TaskCloudDB = new TaskCloudDB();
    cloudDB.id = taskId;
    cloudDB.title = task.title;
    cloudDB.description = task.description;
    cloudDB.status = task.status;
    cloudDB.priority = task.priority.toString();  // number -> string
    cloudDB.dueDate = task.dueDate ? task.dueDate.toISOString() : undefined;
    cloudDB.createTime = task.createTime.toISOString();
    cloudDB.updateTime = task.updateTime.toISOString();
    cloudDB.completedTime = task.completedTime ? task.completedTime.toISOString() : undefined;
    cloudDB.tags = JSON.stringify(task.tags || []);
    cloudDB.userld = odlUserId;  // 注意：数据库字段名是 userld（拼写错误）
    return cloudDB;
  }

  /**
   * 将TaskCloudDB转换为Task
   */
  static cloudDBToTask(cloudDB: TaskCloudDB): Task {
    let tags: string[] = [];
    try {
      const tagsStr = cloudDB.tags || '[]';
      tags = JSON.parse(tagsStr);
    } catch (e) {
      tags = [];
    }

    // priority: string -> number
    let priorityNum = 1;
    if (cloudDB.priority) {
      const parsed = parseInt(cloudDB.priority);
      if (!isNaN(parsed)) {
        priorityNum = parsed;
      }
    }

    const taskData: TaskData = {
      id: parseInt(cloudDB.id || '0') || 0,
      title: cloudDB.title || '',
      description: cloudDB.description || '',
      status: cloudDB.status || 'pending',
      priority: priorityNum,
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
  static billToCloudDB(bill: Bill, odlUserId: string = 'default'): BillCloudDB {
    const billId: string = bill.id > 0 ? bill.id.toString() : CloudDBConverter.generateId();
    const cloudDB: BillCloudDB = new BillCloudDB();
    cloudDB.id = billId;
    cloudDB.type = bill.type;
    cloudDB.category = bill.category;
    cloudDB.amount = bill.amount.toString();  // number -> string
    cloudDB.description = bill.description;
    cloudDB.date = bill.date.toISOString();
    cloudDB.createTime = bill.createTime.toISOString();
    cloudDB.updateTime = bill.updateTime.toISOString();
    cloudDB.tags = JSON.stringify(bill.tags || []);
    cloudDB.userId = odlUserId;
    return cloudDB;
  }

  /**
   * 将BillCloudDB转换为Bill
   */
  static cloudDBToBill(cloudDB: BillCloudDB): Bill {
    let tags: string[] = [];
    try {
      const tagsStr = cloudDB.tags || '[]';
      tags = JSON.parse(tagsStr);
    } catch (e) {
      tags = [];
    }

    // amount: string -> number
    let amountNum = 0;
    if (cloudDB.amount) {
      const parsed = parseFloat(cloudDB.amount);
      if (!isNaN(parsed)) {
        amountNum = parsed;
      }
    }

    // 类型转换：从字符串转换为枚举类型
    const typeStr = cloudDB.type || 'expense';
    const billType: BillType = typeStr === 'income' ? BillType.INCOME : BillType.EXPENSE;
    const billCategory: BillCategory = (cloudDB.category || 'other_expense') as BillCategory;
    
    const billData: BillData = {
      id: parseInt(cloudDB.id || '0') || 0,
      type: billType,
      category: billCategory,
      amount: amountNum,
      description: cloudDB.description || '',
      date: cloudDB.date ? new Date(cloudDB.date) : new Date(),
      createTime: cloudDB.createTime ? new Date(cloudDB.createTime) : new Date(),
      updateTime: cloudDB.updateTime ? new Date(cloudDB.updateTime) : new Date(),
      tags: tags
    };
    
    return new Bill(billData);
  }

  /**
   * 获取当前用户ID
   */
  static getCurrentUserId(): string {
    // TODO: 从UserService或AuthService获取当前登录用户ID
    return 'default_user';
  }
}
