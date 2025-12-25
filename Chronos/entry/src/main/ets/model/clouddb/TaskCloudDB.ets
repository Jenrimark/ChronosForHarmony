import { cloudDatabase } from '@kit.CloudFoundationKit';

/**
 * 任务Cloud DB对象类型
 * 严格按照华为官方文档示例编写
 * 参考: https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/cloudfoundation-database-add-file
 * 
 * 注意：naturalbase_ClassName() 返回值必须与 schema.json 中的 objectTypeName 完全一致
 */
export class TaskCloudDB extends cloudDatabase.DatabaseObject {
  public naturalbase_ClassName(): string {
    return 'TaskCloudDB';
  }

  public id: string | undefined;
  public title: string | undefined;
  public description: string | undefined;
  public status: string | undefined;
  public priority: string | undefined;
  public dueDate: string | undefined;
  public createTime: string | undefined;
  public updateTime: string | undefined;
  public completedTime: string | undefined;
  public tags: string | undefined;
  public userld: string | undefined;  // 注意：数据库字段名是 userld (不是 userId)
}
