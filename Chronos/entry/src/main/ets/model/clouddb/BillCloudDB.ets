import { cloudDatabase } from '@kit.CloudFoundationKit';

/**
 * 账单Cloud DB对象类型
 * 严格按照华为官方文档示例编写
 * 参考: https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/cloudfoundation-database-add-file
 * 
 * 注意：naturalbase_ClassName() 返回值必须与 schema.json 中的 objectTypeName 完全一致
 */
export class BillCloudDB extends cloudDatabase.DatabaseObject {
  public naturalbase_ClassName(): string {
    return 'BillCloudDB';
  }

  public id: string | undefined;
  public type: string | undefined;
  public category: string | undefined;
  public amount: string | undefined;
  public description: string | undefined;
  public date: string | undefined;
  public createTime: string | undefined;
  public updateTime: string | undefined;
  public tags: string | undefined;
  public userId: string | undefined;
}
