import { cloudDatabase } from '@kit.CloudFoundationKit';

/**
 * 账单Cloud DB对象类型
 * 严格按照华为官方文档示例编写
 */
export class BillCloudDB extends cloudDatabase.DatabaseObject {
  public id: string = '';
  public type: string = '';
  public category: string = '';
  public amount: string = '';
  public description: string = '';
  public date: string = '';
  public createTime: string = '';
  public updateTime: string = '';
  public tags: string = '';
  public userId: string = '';

  constructor() {
    super();
  }

  public naturalbase_ClassName(): string {
    return 'BillCloudDB';
  }
}
