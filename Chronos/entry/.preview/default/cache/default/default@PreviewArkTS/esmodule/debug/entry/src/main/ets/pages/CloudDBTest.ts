if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CloudDBTestPage_Params {
    testResults?: string[];
    isLoading?: boolean;
    taskCount?: number;
    billCount?: number;
}
import cloudDatabase from "@hms:core.deviceCloudGateway.cloudDatabase";
import hilog from "@ohos:hilog";
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
class CloudDBTestPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__testResults = new ObservedPropertyObjectPU([], this, "testResults");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__taskCount = new ObservedPropertySimplePU(0, this, "taskCount");
        this.__billCount = new ObservedPropertySimplePU(0, this, "billCount");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CloudDBTestPage_Params) {
        if (params.testResults !== undefined) {
            this.testResults = params.testResults;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.taskCount !== undefined) {
            this.taskCount = params.taskCount;
        }
        if (params.billCount !== undefined) {
            this.billCount = params.billCount;
        }
    }
    updateStateVars(params: CloudDBTestPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__testResults.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__taskCount.purgeDependencyOnElmtId(rmElmtId);
        this.__billCount.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__testResults.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__taskCount.aboutToBeDeleted();
        this.__billCount.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __testResults: ObservedPropertyObjectPU<string[]>;
    get testResults() {
        return this.__testResults.get();
    }
    set testResults(newValue: string[]) {
        this.__testResults.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __taskCount: ObservedPropertySimplePU<number>;
    get taskCount() {
        return this.__taskCount.get();
    }
    set taskCount(newValue: number) {
        this.__taskCount.set(newValue);
    }
    private __billCount: ObservedPropertySimplePU<number>;
    get billCount() {
        return this.__billCount.get();
    }
    set billCount(newValue: number) {
        this.__billCount.set(newValue);
    }
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
        }
        catch (err) {
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
        }
        catch (err) {
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
                this.addLog(`  - 任务${i + 1}: ${task.title || '(无标题)'}`);
            }
            return true;
        }
        catch (err) {
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
                this.addLog(`  - 账单${i + 1}: ${bill.description || '(无描述)'} ¥${bill.amount}`);
            }
            return true;
        }
        catch (err) {
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
        }
        catch (err) {
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
        if (await this.testGetZone())
            passed++;
        else
            failed++;
        // 测试2
        if (await this.testCreateQuery())
            passed++;
        else
            failed++;
        // 测试3
        if (await this.testQueryTasks())
            passed++;
        else
            failed++;
        // 测试4
        if (await this.testQueryBills())
            passed++;
        else
            failed++;
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CloudDBTest.ets(217:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.padding(20);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题
            Text.create('CloudDB 功能测试');
            Text.debugLine("entry/src/main/ets/pages/CloudDBTest.ets(219:7)", "entry");
            // 标题
            Text.fontSize(24);
            // 标题
            Text.fontWeight(FontWeight.Bold);
            // 标题
            Text.margin({ top: 20, bottom: 20 });
        }, Text);
        // 标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 统计信息
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/CloudDBTest.ets(225:7)", "entry");
            // 统计信息
            Row.margin({ bottom: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`任务: ${this.taskCount}`);
            Text.debugLine("entry/src/main/ets/pages/CloudDBTest.ets(226:9)", "entry");
            Text.fontSize(16);
            Text.margin({ right: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`账单: ${this.billCount}`);
            Text.debugLine("entry/src/main/ets/pages/CloudDBTest.ets(229:9)", "entry");
            Text.fontSize(16);
        }, Text);
        Text.pop();
        // 统计信息
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 按钮区域
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/CloudDBTest.ets(235:7)", "entry");
            // 按钮区域
            Row.margin({ bottom: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('运行查询测试');
            Button.debugLine("entry/src/main/ets/pages/CloudDBTest.ets(236:9)", "entry");
            Button.onClick(() => this.runAllTests());
            Button.enabled(!this.isLoading);
            Button.margin({ right: 10 });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('测试写入');
            Button.debugLine("entry/src/main/ets/pages/CloudDBTest.ets(241:9)", "entry");
            Button.onClick(() => this.runWriteTest());
            Button.enabled(!this.isLoading);
            Button.margin({ right: 10 });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('清空日志');
            Button.debugLine("entry/src/main/ets/pages/CloudDBTest.ets(246:9)", "entry");
            Button.onClick(() => {
                this.testResults = [];
                this.taskCount = 0;
                this.billCount = 0;
            });
            Button.enabled(!this.isLoading);
        }, Button);
        Button.pop();
        // 按钮区域
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 加载指示器
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.debugLine("entry/src/main/ets/pages/CloudDBTest.ets(258:9)", "entry");
                        LoadingProgress.width(50);
                        LoadingProgress.height(50);
                        LoadingProgress.margin({ bottom: 10 });
                    }, LoadingProgress);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('测试中...');
                        Text.debugLine("entry/src/main/ets/pages/CloudDBTest.ets(262:9)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#666');
                    }, Text);
                    Text.pop();
                });
            }
            // 测试结果日志
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 测试结果日志
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/CloudDBTest.ets(268:7)", "entry");
            // 测试结果日志
            Scroll.width('100%');
            // 测试结果日志
            Scroll.layoutWeight(1);
            // 测试结果日志
            Scroll.backgroundColor('#fafafa');
            // 测试结果日志
            Scroll.borderRadius(8);
            // 测试结果日志
            Scroll.padding(10);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CloudDBTest.ets(269:9)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const log = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(log);
                    Text.debugLine("entry/src/main/ets/pages/CloudDBTest.ets(271:13)", "entry");
                    Text.fontSize(12);
                    Text.fontColor(log.includes('✗') ? '#ff0000' : (log.includes('✓') ? '#00aa00' : '#333333'));
                    Text.width('100%');
                    Text.padding(5);
                    Text.backgroundColor(index % 2 === 0 ? '#f5f5f5' : '#ffffff');
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, this.testResults, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        Column.pop();
        // 测试结果日志
        Scroll.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "CloudDBTestPage";
    }
}
registerNamedRoute(() => new CloudDBTestPage(undefined, {}), "", { bundleName: "com.jenrimark.chronos", moduleName: "entry", pagePath: "pages/CloudDBTest", pageFullPath: "entry/src/main/ets/pages/CloudDBTest", integratedHsp: "false", moduleType: "followWithHap" });
