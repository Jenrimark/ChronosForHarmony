import { cloudDatabase } from '@kit.CloudFoundationKit';

/**
 * 任务Cloud DB对象类型
 * 严格按照华为官方文档示例编写
 */
export class TaskCloudDB extends cloudDatabase.DatabaseObject {
  public id: string = '';
  public title: string = '';
  public description: string = '';
  public status: string = '';
  public priority: string = '';
  public dueDate: string = '';
  public createTime: string = '';
  public updateTime: string = '';
  public completedTime: string = '';
  public tags: string = '';
  public userld: string = '';  // 注意：数据库字段名是 userld (不是 userId)

  constructor() {
    super();
  }

  public naturalbase_ClassName(): string {
    return 'TaskCloudDB';
  }
}
