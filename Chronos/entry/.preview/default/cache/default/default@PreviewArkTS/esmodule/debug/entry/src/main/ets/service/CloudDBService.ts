import { AGConnectCloudDB, CloudDBZoneConfig, CloudDBZoneQuery } from "@normalized:undefined";
import type { CloudDBZone, CloudDBZoneSnapshot } from "@normalized:undefined";
import type { Context as Context } from "@ohos:abilityAccessCtrl";
import { TaskCloudDB } from "@normalized:N&&&entry/src/main/ets/model/clouddb/TaskCloudDB&";
import { BillCloudDB } from "@normalized:N&&&entry/src/main/ets/model/clouddb/BillCloudDB&";
/**
 * Cloud DB服务类
 * 实现端云协同：优先读写本地缓存，网络空闲时自动同步云端
 */
export class CloudDBService {
    private static instance: CloudDBService;
    private cloudDBZone: CloudDBZone | null = null;
    private readonly ZONE_NAME = 'ChronosZone'; // 存储区名称，需要在AGC控制台创建
    private isInitialized: boolean = false;
    private constructor() { }
    static getInstance(): CloudDBService {
        if (!CloudDBService.instance) {
            CloudDBService.instance = new CloudDBService();
        }
        return CloudDBService.instance;
    }
    /**
     * 初始化Cloud DB
     * @param context 应用上下文
     */
    async init(context: Context): Promise<void> {
        if (this.isInitialized) {
            console.info('Cloud DB已经初始化');
            return;
        }
        try {
            // 1. 初始化AGConnect
            await AGConnectCloudDB.initialize(context);
            const cloudDB = await AGConnectCloudDB.getInstance();
            // 2. 创建存储区配置
            const config = new CloudDBZoneConfig(this.ZONE_NAME);
            // 启用本地持久化存储（关键：实现离线可用）
            config.persistenceEnabled = true;
            // 设置同步模式为缓存模式（优先本地，后台同步云端）
            // CloudDBZoneSyncProperty.CLOUDDBZONE_CLOUD_CACHE 是默认模式
            // 3. 打开存储区
            this.cloudDBZone = await cloudDB.openCloudDBZone(config);
            this.isInitialized = true;
            console.info('Cloud DB初始化成功');
        }
        catch (error) {
            console.error('Cloud DB初始化失败:', JSON.stringify(error));
            throw new Error('Cloud DB初始化失败: ' + JSON.stringify(error));
        }
    }
    /**
     * 检查是否已初始化
     */
    private checkInitialized(): void {
        if (!this.isInitialized || !this.cloudDBZone) {
            throw new Error('Cloud DB未初始化，请先调用init()方法');
        }
    }
    // ==================== 任务相关操作 ====================
    /**
     * 添加或更新任务（Upsert操作）
     * 数据会立即存入本地，随后静默上传云端
     */
    async upsertTask(task: TaskCloudDB): Promise<number> {
        this.checkInitialized();
        try {
            const result = await this.cloudDBZone!.executeUpsert(task);
            console.info('任务保存成功，影响行数：' + result);
            return result;
        }
        catch (error) {
            console.error('保存任务失败:', JSON.stringify(error));
            throw error;
        }
    }
    /**
     * 删除任务
     */
    async deleteTask(taskId: string): Promise<number> {
        this.checkInitialized();
        try {
            const task = new TaskCloudDB({ id: taskId });
            const result = await this.cloudDBZone!.executeDelete(task);
            console.info('任务删除成功，影响行数：' + result);
            return result;
        }
        catch (error) {
            console.error('删除任务失败:', JSON.stringify(error));
            throw error;
        }
    }
    /**
     * 查询所有任务
     */
    async queryAllTasks(userId?: string): Promise<TaskCloudDB[]> {
        this.checkInitialized();
        try {
            let query = CloudDBZoneQuery.where(TaskCloudDB);
            if (userId) {
                query = query.equalTo('userId', userId);
            }
            query = query.orderByDesc('createTime');
            const snapshot: CloudDBZoneSnapshot<TaskCloudDB> = await this.cloudDBZone!.executeQuery(query);
            const tasks = snapshot.getSnapshotObjects();
            snapshot.release();
            return tasks;
        }
        catch (error) {
            console.error('查询任务失败:', JSON.stringify(error));
            return [];
        }
    }
    /**
     * 根据状态查询任务
     */
    async queryTasksByStatus(status: string, userId?: string): Promise<TaskCloudDB[]> {
        this.checkInitialized();
        try {
            let query = CloudDBZoneQuery.where(TaskCloudDB)
                .equalTo('status', status);
            if (userId) {
                query = query.equalTo('userId', userId);
            }
            query = query.orderByDesc('createTime');
            const snapshot: CloudDBZoneSnapshot<TaskCloudDB> = await this.cloudDBZone!.executeQuery(query);
            const tasks = snapshot.getSnapshotObjects();
            snapshot.release();
            return tasks;
        }
        catch (error) {
            console.error('查询任务失败:', JSON.stringify(error));
            return [];
        }
    }
    /**
     * 根据ID查询任务
     */
    async queryTaskById(taskId: string): Promise<TaskCloudDB | null> {
        this.checkInitialized();
        try {
            const query = CloudDBZoneQuery.where(TaskCloudDB)
                .equalTo('id', taskId);
            const snapshot: CloudDBZoneSnapshot<TaskCloudDB> = await this.cloudDBZone!.executeQuery(query);
            const tasks = snapshot.getSnapshotObjects();
            snapshot.release();
            return tasks.length > 0 ? tasks[0] : null;
        }
        catch (error) {
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
            let query = CloudDBZoneQuery.where(TaskCloudDB)
                .greaterThanOrEqualTo('dueDate', startDate)
                .lessThanOrEqualTo('dueDate', endDate);
            if (userId) {
                query = query.equalTo('userId', userId);
            }
            query = query.orderByAsc('dueDate');
            const snapshot: CloudDBZoneSnapshot<TaskCloudDB> = await this.cloudDBZone!.executeQuery(query);
            const tasks = snapshot.getSnapshotObjects();
            snapshot.release();
            return tasks;
        }
        catch (error) {
            console.error('查询任务失败:', JSON.stringify(error));
            return [];
        }
    }
    // ==================== 账单相关操作 ====================
    /**
     * 添加或更新账单（Upsert操作）
     */
    async upsertBill(bill: BillCloudDB): Promise<number> {
        this.checkInitialized();
        try {
            const result = await this.cloudDBZone!.executeUpsert(bill);
            console.info('账单保存成功，影响行数：' + result);
            return result;
        }
        catch (error) {
            console.error('保存账单失败:', JSON.stringify(error));
            throw error;
        }
    }
    /**
     * 删除账单
     */
    async deleteBill(billId: string): Promise<number> {
        this.checkInitialized();
        try {
            const bill = new BillCloudDB({ id: billId });
            const result = await this.cloudDBZone!.executeDelete(bill);
            console.info('账单删除成功，影响行数：' + result);
            return result;
        }
        catch (error) {
            console.error('删除账单失败:', JSON.stringify(error));
            throw error;
        }
    }
    /**
     * 查询所有账单
     */
    async queryAllBills(userId?: string): Promise<BillCloudDB[]> {
        this.checkInitialized();
        try {
            let query = CloudDBZoneQuery.where(BillCloudDB);
            if (userId) {
                query = query.equalTo('userId', userId);
            }
            query = query.orderByDesc('date');
            const snapshot: CloudDBZoneSnapshot<BillCloudDB> = await this.cloudDBZone!.executeQuery(query);
            const bills = snapshot.getSnapshotObjects();
            snapshot.release();
            return bills;
        }
        catch (error) {
            console.error('查询账单失败:', JSON.stringify(error));
            return [];
        }
    }
    /**
     * 根据类型查询账单
     */
    async queryBillsByType(type: string, userId?: string): Promise<BillCloudDB[]> {
        this.checkInitialized();
        try {
            let query = CloudDBZoneQuery.where(BillCloudDB)
                .equalTo('type', type);
            if (userId) {
                query = query.equalTo('userId', userId);
            }
            query = query.orderByDesc('date');
            const snapshot: CloudDBZoneSnapshot<BillCloudDB> = await this.cloudDBZone!.executeQuery(query);
            const bills = snapshot.getSnapshotObjects();
            snapshot.release();
            return bills;
        }
        catch (error) {
            console.error('查询账单失败:', JSON.stringify(error));
            return [];
        }
    }
    /**
     * 根据日期范围查询账单
     */
    async queryBillsByDateRange(startDate: string, endDate: string, userId?: string): Promise<BillCloudDB[]> {
        this.checkInitialized();
        try {
            let query = CloudDBZoneQuery.where(BillCloudDB)
                .greaterThanOrEqualTo('date', startDate)
                .lessThanOrEqualTo('date', endDate);
            if (userId) {
                query = query.equalTo('userId', userId);
            }
            query = query.orderByDesc('date');
            const snapshot: CloudDBZoneSnapshot<BillCloudDB> = await this.cloudDBZone!.executeQuery(query);
            const bills = snapshot.getSnapshotObjects();
            snapshot.release();
            return bills;
        }
        catch (error) {
            console.error('查询账单失败:', JSON.stringify(error));
            return [];
        }
    }
    /**
     * 根据ID查询账单
     */
    async queryBillById(billId: string): Promise<BillCloudDB | null> {
        this.checkInitialized();
        try {
            const query = CloudDBZoneQuery.where(BillCloudDB)
                .equalTo('id', billId);
            const snapshot: CloudDBZoneSnapshot<BillCloudDB> = await this.cloudDBZone!.executeQuery(query);
            const bills = snapshot.getSnapshotObjects();
            snapshot.release();
            return bills.length > 0 ? bills[0] : null;
        }
        catch (error) {
            console.error('查询账单失败:', JSON.stringify(error));
            return null;
        }
    }
    /**
     * 关闭Cloud DB连接
     */
    async close(): Promise<void> {
        if (this.cloudDBZone) {
            try {
                const cloudDB = await AGConnectCloudDB.getInstance();
                await cloudDB.closeCloudDBZone(this.cloudDBZone);
                this.cloudDBZone = null;
                this.isInitialized = false;
                console.info('Cloud DB连接已关闭');
            }
            catch (error) {
                console.error('关闭Cloud DB连接失败:', JSON.stringify(error));
            }
        }
    }
}
