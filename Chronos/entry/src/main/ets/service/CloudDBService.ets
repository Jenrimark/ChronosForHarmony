// 按照官方文档使用 cloud.database() API
import cloud from '@hw-agconnect/cloud';
import { TaskCloudDB } from '../model/clouddb/TaskCloudDB';
import { BillCloudDB } from '../model/clouddb/BillCloudDB';
import { BusinessError } from '@kit.BasicServicesKit';

// 定义字段信息类
class FieldInfo {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isNullable: boolean;

  constructor(name: string, type: string, isNullable: boolean, isPrimaryKey: boolean = false) {
    this.name = name;
    this.type = type;
    this.isNullable = isNullable;
    this.isPrimaryKey = isPrimaryKey;
  }
}

// 定义对象类型类
class ObjectType {
  name: string;
  fields: FieldInfo[];

  constructor(name: string, fields: FieldInfo[]) {
    this.name = name;
    this.fields = fields;
  }
}

// 定义ObjectTypeInfo类
class ObjectTypeInfo {
  objectTypes: ObjectType[];
  schemaVersion: number;
  permissions: string[];

  constructor(objectTypes: ObjectType[], schemaVersion: number = 1) {
    this.objectTypes = objectTypes;
    this.schemaVersion = schemaVersion;
    this.permissions = [];
  }
}

// 定义DatabaseConfig类
class DatabaseConfig {
  objectTypeInfo: ObjectTypeInfo;
  zoneName: string;

  constructor(objectTypeInfo: ObjectTypeInfo, zoneName: string) {
    this.objectTypeInfo = objectTypeInfo;
    this.zoneName = zoneName;
  }
}

// 创建TaskCloudDB的字段定义
function createTaskFields(): FieldInfo[] {
  const fields: FieldInfo[] = [];
  fields.push(new FieldInfo('id', 'String', false, true));
  fields.push(new FieldInfo('title', 'String', false));
  fields.push(new FieldInfo('description', 'String', true));
  fields.push(new FieldInfo('status', 'String', false));
  fields.push(new FieldInfo('priority', 'Integer', false));
  fields.push(new FieldInfo('dueDate', 'String', true));
  fields.push(new FieldInfo('createTime', 'String', false));
  fields.push(new FieldInfo('updateTime', 'String', false));
  fields.push(new FieldInfo('completedTime', 'String', true));
  fields.push(new FieldInfo('tags', 'String', false));
  fields.push(new FieldInfo('userId', 'String', false));
  return fields;
}

// 创建BillCloudDB的字段定义
function createBillFields(): FieldInfo[] {
  const fields: FieldInfo[] = [];
  fields.push(new FieldInfo('id', 'String', false, true));
  fields.push(new FieldInfo('type', 'String', false));
  fields.push(new FieldInfo('category', 'String', false));
  fields.push(new FieldInfo('amount', 'Double', false));
  fields.push(new FieldInfo('description', 'String', true));
  fields.push(new FieldInfo('date', 'String', false));
  fields.push(new FieldInfo('createTime', 'String', false));
  fields.push(new FieldInfo('updateTime', 'String', false));
  fields.push(new FieldInfo('tags', 'String', false));
  fields.push(new FieldInfo('userId', 'String', false));
  return fields;
}

// 创建对象类型
const taskObjectType: ObjectType = new ObjectType('TaskCloudDB', createTaskFields());
const billObjectType: ObjectType = new ObjectType('BillCloudDB', createBillFields());

// 创建对象类型数组
const objectTypes: ObjectType[] = [];
objectTypes.push(taskObjectType);
objectTypes.push(billObjectType);

// 创建schema配置
const schema: ObjectTypeInfo = new ObjectTypeInfo(objectTypes, 1);

/**
 * Cloud DB服务类
 * 按照华为官方文档规范实现端云协同：优先读写本地缓存，网络空闲时自动同步云端
 */
export class CloudDBService {
  private static instance: CloudDBService;
  private readonly ZONE_NAME: string = 'ChronosZone';
  private isInitialized: boolean = false;

  private constructor() {}

  static getInstance(): CloudDBService {
    if (!CloudDBService.instance) {
      CloudDBService.instance = new CloudDBService();
    }
    return CloudDBService.instance;
  }

  /**
   * 获取数据库配置
   */
  private getDbConfig(): DatabaseConfig {
    return new DatabaseConfig(schema, this.ZONE_NAME);
  }

  /**
   * 初始化Cloud DB
   */
  async init(): Promise<void> {
    if (this.isInitialized) {
      console.info('Cloud DB已经初始化');
      return;
    }
    this.isInitialized = true;
    console.info('Cloud DB服务已就绪');
  }

  /**
   * 检查是否已初始化
   */
  private checkInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('Cloud DB未初始化，请先调用init()方法');
    }
  }

  // ==================== 任务相关操作 ====================

  /**
   * 添加或更新任务
   */
  async upsertTask(task: TaskCloudDB): Promise<TaskCloudDB> {
    this.checkInitialized();
    try {
      const taskData: TaskCloudDB = new TaskCloudDB();
      taskData.id = task.id;
      taskData.title = task.title;
      taskData.description = task.description;
      taskData.status = task.status;
      taskData.priority = task.priority;
      taskData.dueDate = task.dueDate;
      taskData.createTime = task.createTime;
      taskData.updateTime = task.updateTime;
      taskData.completedTime = task.completedTime;
      taskData.tags = task.tags;
      taskData.userId = task.userId;
      
      const dbConfig = this.getDbConfig();
      const db = cloud.database(dbConfig as ESObject);
      const collection = db.collection(TaskCloudDB);
      await collection.upsert(taskData);
      console.info('任务保存成功');
      return taskData;
    } catch (err) {
      const error = err as BusinessError;
      console.error('保存任务失败:', JSON.stringify(error));
      const errorMessage: string = '保存任务失败: ' + JSON.stringify(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * 删除任务
   */
  async deleteTask(taskId: string): Promise<void> {
    this.checkInitialized();
    try {
      const taskToDelete: TaskCloudDB = new TaskCloudDB();
      taskToDelete.id = taskId;
      const dbConfig = this.getDbConfig();
      const db = cloud.database(dbConfig as ESObject);
      const collection = db.collection(TaskCloudDB);
      await collection.delete(taskToDelete);
      console.info('任务删除成功');
    } catch (err) {
      const error = err as BusinessError;
      console.error('删除任务失败:', JSON.stringify(error));
      const errorMessage: string = '删除任务失败: ' + JSON.stringify(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * 查询所有任务
   */
  async queryAllTasks(userId?: string): Promise<TaskCloudDB[]> {
    this.checkInitialized();
    try {
      const dbConfig = this.getDbConfig();
      const db = cloud.database(dbConfig as ESObject);
      const collection = db.collection(TaskCloudDB);
      let query = collection.query();
      
      if (userId) {
        query = query.equalTo('userId', userId);
      }
      query = query.orderByDesc('createTime');
      
      const resultArray = await query.get();
      return resultArray;
    } catch (err) {
      const error = err as BusinessError;
      console.error('查询任务失败:', JSON.stringify(error));
      const emptyArray: TaskCloudDB[] = [];
      return emptyArray;
    }
  }

  /**
   * 根据状态查询任务
   */
  async queryTasksByStatus(status: string, userId?: string): Promise<TaskCloudDB[]> {
    this.checkInitialized();
    try {
      const dbConfig = this.getDbConfig();
      const db = cloud.database(dbConfig as ESObject);
      const collection = db.collection(TaskCloudDB);
      let query = collection.query().equalTo('status', status);
      
      if (userId) {
        query = query.equalTo('userId', userId);
      }
      query = query.orderByDesc('createTime');
      
      const resultArray = await query.get();
      return resultArray;
    } catch (err) {
      const error = err as BusinessError;
      console.error('查询任务失败:', JSON.stringify(error));
      const emptyArray: TaskCloudDB[] = [];
      return emptyArray;
    }
  }

  /**
   * 根据ID查询任务
   */
  async queryTaskById(taskId: string): Promise<TaskCloudDB | null> {
    this.checkInitialized();
    try {
      const dbConfig = this.getDbConfig();
      const db = cloud.database(dbConfig as ESObject);
      const collection = db.collection(TaskCloudDB);
      const resultArray = await collection.query().equalTo('id', taskId).get();
      
      return resultArray.length > 0 ? resultArray[0] : null;
    } catch (err) {
      const error = err as BusinessError;
      console.error('查询任务失败:', JSON.stringify(error));
      return null;
    }
  }

  /**
   * 根据日期范围查询任务
   */
  async queryTasksByDateRange(startDate: string, endDate: string, userId?: string): Promise<TaskCloudDB[]> {
    this.checkInitialized();
    try {
      const dbConfig = this.getDbConfig();
      const db = cloud.database(dbConfig as ESObject);
      const collection = db.collection(TaskCloudDB);
      let query = collection.query()
        .greaterThanOrEqualTo('dueDate', startDate)
        .lessThanOrEqualTo('dueDate', endDate);
      
      if (userId) {
        query = query.equalTo('userId', userId);
      }
      query = query.orderByAsc('dueDate');
      
      const resultArray = await query.get();
      return resultArray;
    } catch (err) {
      const error = err as BusinessError;
      console.error('查询任务失败:', JSON.stringify(error));
      const emptyArray: TaskCloudDB[] = [];
      return emptyArray;
    }
  }

  // ==================== 账单相关操作 ====================

  /**
   * 添加或更新账单
   */
  async upsertBill(bill: BillCloudDB): Promise<BillCloudDB> {
    this.checkInitialized();
    try {
      const billData: BillCloudDB = new BillCloudDB();
      billData.id = bill.id;
      billData.type = bill.type;
      billData.category = bill.category;
      billData.amount = bill.amount;
      billData.description = bill.description;
      billData.date = bill.date;
      billData.createTime = bill.createTime;
      billData.updateTime = bill.updateTime;
      billData.tags = bill.tags;
      billData.userId = bill.userId;
      
      const dbConfig = this.getDbConfig();
      const db = cloud.database(dbConfig as ESObject);
      const collection = db.collection(BillCloudDB);
      await collection.upsert(billData);
      console.info('账单保存成功');
      return billData;
    } catch (err) {
      const error = err as BusinessError;
      console.error('保存账单失败:', JSON.stringify(error));
      const errorMessage: string = '保存账单失败: ' + JSON.stringify(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * 删除账单
   */
  async deleteBill(billId: string): Promise<void> {
    this.checkInitialized();
    try {
      const billToDelete: BillCloudDB = new BillCloudDB();
      billToDelete.id = billId;
      const dbConfig = this.getDbConfig();
      const db = cloud.database(dbConfig as ESObject);
      const collection = db.collection(BillCloudDB);
      await collection.delete(billToDelete);
      console.info('账单删除成功');
    } catch (err) {
      const error = err as BusinessError;
      console.error('删除账单失败:', JSON.stringify(error));
      const errorMessage: string = '删除账单失败: ' + JSON.stringify(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * 查询所有账单
   */
  async queryAllBills(userId?: string): Promise<BillCloudDB[]> {
    this.checkInitialized();
    try {
      const dbConfig = this.getDbConfig();
      const db = cloud.database(dbConfig as ESObject);
      const collection = db.collection(BillCloudDB);
      let query = collection.query();
      
      if (userId) {
        query = query.equalTo('userId', userId);
      }
      query = query.orderByDesc('date');
      
      const resultArray = await query.get();
      return resultArray;
    } catch (err) {
      const error = err as BusinessError;
      console.error('查询账单失败:', JSON.stringify(error));
      const emptyArray: BillCloudDB[] = [];
      return emptyArray;
    }
  }

  /**
   * 根据类型查询账单
   */
  async queryBillsByType(type: string, userId?: string): Promise<BillCloudDB[]> {
    this.checkInitialized();
    try {
      const dbConfig = this.getDbConfig();
      const db = cloud.database(dbConfig as ESObject);
      const collection = db.collection(BillCloudDB);
      let query = collection.query().equalTo('type', type);
      
      if (userId) {
        query = query.equalTo('userId', userId);
      }
      query = query.orderByDesc('date');
      
      const resultArray = await query.get();
      return resultArray;
    } catch (err) {
      const error = err as BusinessError;
      console.error('查询账单失败:', JSON.stringify(error));
      const emptyArray: BillCloudDB[] = [];
      return emptyArray;
    }
  }

  /**
   * 根据日期范围查询账单
   */
  async queryBillsByDateRange(startDate: string, endDate: string, userId?: string): Promise<BillCloudDB[]> {
    this.checkInitialized();
    try {
      const dbConfig = this.getDbConfig();
      const db = cloud.database(dbConfig as ESObject);
      const collection = db.collection(BillCloudDB);
      let query = collection.query()
        .greaterThanOrEqualTo('date', startDate)
        .lessThanOrEqualTo('date', endDate);
      
      if (userId) {
        query = query.equalTo('userId', userId);
      }
      query = query.orderByDesc('date');
      
      const resultArray = await query.get();
      return resultArray;
    } catch (err) {
      const error = err as BusinessError;
      console.error('查询账单失败:', JSON.stringify(error));
      const emptyArray: BillCloudDB[] = [];
      return emptyArray;
    }
  }

  /**
   * 根据ID查询账单
   */
  async queryBillById(billId: string): Promise<BillCloudDB | null> {
    this.checkInitialized();
    try {
      const dbConfig = this.getDbConfig();
      const db = cloud.database(dbConfig as ESObject);
      const collection = db.collection(BillCloudDB);
      const resultArray = await collection.query().equalTo('id', billId).get();
      
      return resultArray.length > 0 ? resultArray[0] : null;
    } catch (err) {
      const error = err as BusinessError;
      console.error('查询账单失败:', JSON.stringify(error));
      return null;
    }
  }
}
