/**
 * CloudDB 测试页面
 * 用于验证数据库查询功能是否正常工作
 */
import { cloudDatabase } from '@kit.CloudFoundationKit';
import { hilog } from '@kit.PerformanceAnalysisKit';

const TAG: string = 'CloudDBTest';
const DOMAIN: number = 0x0000;
const ZONE_NAME: string = 'ChronosZone';

// 直接在测试页面定义模型类，避免混淆问题
class TestTaskCloudDB extends cloudDatabase.DatabaseObject {
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
  public userld: string = '';

  public naturalbase_ClassName(): string {
    return 'TaskCloudDB';
  }

  constructor() {
    super();
  }
}

class TestBillCloudDB extends cloudDatabase.DatabaseObject {
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

  public naturalbase_ClassName(): string {
    return 'BillCloudDB';
  }

  constructor() {
    super();
  }
}

@Entry
@Component
struct CloudDBTestPage {
  @State testResults: string[] = [];
  @State isLoading: boolean = false;
  @State taskCount: number = 0;
  @State billCount: number = 0;

  aboutToAppear() {
    this.addLog('测试页面已加载');
  }

  addLog(msg: string) {
    const time = new Date().toLocaleTimeString();
    this.testResults.push(`[${time}] ${msg}`);
    hilog.info(DOMAIN, TAG, msg);
  }

  // 测试1: 获取DatabaseZone
  async testGetZone(): Promise<boolean> {
    try {
      this.addLog('测试1: 获取DatabaseZone...');
      const zone = cloudDatabase.zone(ZONE_NAME);
      this.addLog('✓ DatabaseZone获取成功');
      return true;
    } catch (err) {
      const error = err as Error;
      this.addLog(`✗ DatabaseZone获取失败: ${error.message}`);
      return false;
    }
  }

  // 测试2: 创建DatabaseQuery
  async testCreateQuery(): Promise<boolean> {
    try {
      this.addLog('测试2: 创建DatabaseQuery...');
      const condition = new cloudDatabase.DatabaseQuery(TestTaskCloudDB);
      this.addLog('✓ DatabaseQuery创建成功');
      return true;
    } catch (err) {
      const error = err as Error;
      this.addLog(`✗ DatabaseQuery创建失败: ${error.message}`);
      return false;
    }
  }

  // 测试3: 查询任务
  async testQueryTasks(): Promise<boolean> {
    try {
      this.addLog('测试3: 查询任务数据...');
      const zone = cloudDatabase.zone(ZONE_NAME);
      const condition = new cloudDatabase.DatabaseQuery(TestTaskCloudDB);
      const results = await zone.query(condition);
      this.taskCount = results.length;
      this.addLog(`✓ 查询任务成功，数量: ${results.length}`);
      
      // 打印前3条数据
      for (let i = 0; i < Math.min(3, results.length); i++) {
        const task = results[i] as TestTaskCloudDB;
        this.addLog(`  - 任务${i+1}: ${task.title || '(无标题)'}`);
      }
      return true;
    } catch (err) {
      const error = err as Error;
      this.addLog(`✗ 查询任务失败: ${error.message}`);
      return false;
    }
  }

  // 测试4: 查询账单
  async testQueryBills(): Promise<boolean> {
    try {
      this.addLog('测试4: 查询账单数据...');
      const zone = cloudDatabase.zone(ZONE_NAME);
      const condition = new cloudDatabase.DatabaseQuery(TestBillCloudDB);
      const results = await zone.query(condition);
      this.billCount = results.length;
      this.addLog(`✓ 查询账单成功，数量: ${results.length}`);
      
      // 打印前3条数据
      for (let i = 0; i < Math.min(3, results.length); i++) {
        const bill = results[i] as TestBillCloudDB;
        this.addLog(`  - 账单${i+1}: ${bill.description || '(无描述)'} ¥${bill.amount}`);
      }
      return true;
    } catch (err) {
      const error = err as Error;
      this.addLog(`✗ 查询账单失败: ${error.message}`);
      return false;
    }
  }

  // 测试5: 写入测试任务
  async testUpsertTask(): Promise<boolean> {
    try {
      this.addLog('测试5: 写入测试任务...');
      const zone = cloudDatabase.zone(ZONE_NAME);
      
      const testTask = new TestTaskCloudDB();
      testTask.id = `test_${Date.now()}`;
      testTask.title = '测试任务';
      testTask.description = '这是一个测试任务';
      testTask.status = 'pending';
      testTask.priority = '1';
      testTask.createTime = new Date().toISOString();
      testTask.updateTime = new Date().toISOString();
      testTask.tags = '[]';
      testTask.userld = 'test_user';
      
      const result = await zone.upsert(testTask);
      this.addLog(`✓ 写入任务成功，影响行数: ${result}`);
      return true;
    } catch (err) {
      const error = err as Error;
      this.addLog(`✗ 写入任务失败: ${error.message}`);
      return false;
    }
  }

  // 运行所有测试
  async runAllTests() {
    this.isLoading = true;
    this.testResults = [];
    this.addLog('========== 开始CloudDB测试 ==========');
    
    let passed = 0;
    let failed = 0;
    
    // 测试1
    if (await this.testGetZone()) passed++; else failed++;
    
    // 测试2
    if (await this.testCreateQuery()) passed++; else failed++;
    
    // 测试3
    if (await this.testQueryTasks()) passed++; else failed++;
    
    // 测试4
    if (await this.testQueryBills()) passed++; else failed++;
    
    this.addLog('========== 测试完成 ==========');
    this.addLog(`通过: ${passed}, 失败: ${failed}`);
    
    this.isLoading = false;
  }

  // 测试写入
  async runWriteTest() {
    this.isLoading = true;
    this.addLog('========== 开始写入测试 ==========');
    
    await this.testUpsertTask();
    
    // 写入后重新查询验证
    await this.testQueryTasks();
    
    this.addLog('========== 写入测试完成 ==========');
    this.isLoading = false;
  }

  build() {
    Column() {
      // 标题
      Text('CloudDB 功能测试')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 20, bottom: 20 })

      // 统计信息
      Row() {
        Text(`任务: ${this.taskCount}`)
          .fontSize(16)
          .margin({ right: 20 })
        Text(`账单: ${this.billCount}`)
          .fontSize(16)
      }
      .margin({ bottom: 20 })

      // 按钮区域
      Row() {
        Button('运行查询测试')
          .onClick(() => this.runAllTests())
          .enabled(!this.isLoading)
          .margin({ right: 10 })

        Button('测试写入')
          .onClick(() => this.runWriteTest())
          .enabled(!this.isLoading)
          .margin({ right: 10 })

        Button('清空日志')
          .onClick(() => {
            this.testResults = [];
            this.taskCount = 0;
            this.billCount = 0;
          })
          .enabled(!this.isLoading)
      }
      .margin({ bottom: 20 })

      // 加载指示器
      if (this.isLoading) {
        LoadingProgress()
          .width(50)
          .height(50)
          .margin({ bottom: 10 })
        Text('测试中...')
          .fontSize(14)
          .fontColor('#666')
      }

      // 测试结果日志
      Scroll() {
        Column() {
          ForEach(this.testResults, (log: string, index: number) => {
            Text(log)
              .fontSize(12)
              .fontColor(log.includes('✗') ? '#ff0000' : (log.includes('✓') ? '#00aa00' : '#333333'))
              .width('100%')
              .padding(5)
              .backgroundColor(index % 2 === 0 ? '#f5f5f5' : '#ffffff')
          })
        }
        .width('100%')
      }
      .width('100%')
      .layoutWeight(1)
      .backgroundColor('#fafafa')
      .borderRadius(8)
      .padding(10)
    }
    .width('100%')
    .height('100%')
    .padding(20)
  }
}
