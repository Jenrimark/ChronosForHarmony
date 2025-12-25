import cloudDatabase from "@hms:core.deviceCloudGateway.cloudDatabase";
import hilog from "@ohos:hilog";
import { TaskCloudDB } from "@normalized:N&&&entry/src/main/ets/model/clouddb/TaskCloudDB&";
import { BillCloudDB } from "@normalized:N&&&entry/src/main/ets/model/clouddb/BillCloudDB&";
// 存储区名称
const ZONE_NAME: string = 'ChronosZone';
const TAG: string = 'CloudDBService';
const DOMAIN: number = 0x0000;
export class CloudDBService {
    private static instance: CloudDBService;
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
     */
    async init(): Promise<void> {
        if (this.isInitialized) {
            hilog.info(DOMAIN, TAG, 'Cloud DB已经初始化');
            return;
        }
        this.isInitialized = true;
        hilog.info(DOMAIN, TAG, 'Cloud DB服务初始化成功');
    }
    // ==================== 任务相关操作 ====================
    /**
     * 添加或更新任务
     * 参考官方文档: https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/cloudfoundation-database-upsert
     */
    async upsertTask(task: TaskCloudDB): Promise<TaskCloudDB> {
        try {
            hilog.info(DOMAIN, TAG, '准备保存任务: %{public}s', task.id);
            let databaseZone = cloudDatabase.zone(ZONE_NAME);
            let record = await databaseZone.upsert(task);
            hilog.info(DOMAIN, TAG, '任务保存成功，影响记录数: %{public}d', record);
            return task;
        }
        catch (err) {
            const error = err as Error;
            hilog.error(DOMAIN, TAG, '保存任务失败, code: %{public}s, message: %{public}s', (err as Record<string, string>).code || '', error.message || JSON.stringify(err));
            throw new Error('保存任务失败: ' + (error.message || JSON.stringify(err)));
        }
    }
    /**
     * 删除任务
     * 参考官方文档: https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/cloudfoundation-database-delete
     */
    async deleteTask(taskId: string): Promise<void> {
        try {
            let databaseZone = cloudDatabase.zone(ZONE_NAME);
            let taskToDelete = new TaskCloudDB();
            taskToDelete.id = taskId;
            let deleteNum = await databaseZone.delete(taskToDelete);
            hilog.info(DOMAIN, TAG, '任务删除成功，删除记录数: %{public}d', deleteNum);
        }
        catch (err) {
            const error = err as Error;
            hilog.error(DOMAIN, TAG, '删除任务失败, code: %{public}s, message: %{public}s', (err as Record<string, string>).code || '', error.message || JSON.stringify(err));
            throw new Error('删除任务失败: ' + (error.message || JSON.stringify(err)));
        }
    }
    /**
     * 查询所有任务
     * 参考官方文档: https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/cloudfoundation-database-query
     */
    async queryAllTasks(userId?: string): Promise<TaskCloudDB[]> {
        try {
            let databaseZone = cloudDatabase.zone(ZONE_NAME);
            let condition = new cloudDatabase.DatabaseQuery(TaskCloudDB);
            let resultArray = await databaseZone.query(condition);
            hilog.info(DOMAIN, TAG, '查询任务成功，数量: %{public}d', resultArray.length);
            return resultArray as TaskCloudDB[];
        }
        catch (err) {
            const error = err as Error;
            hilog.error(DOMAIN, TAG, '查询任务失败, code: %{public}s, message: %{public}s', (err as Record<string, string>).code || '', error.message || JSON.stringify(err));
            return [];
        }
    }
    /**
     * 根据状态查询任务
     */
    async queryTasksByStatus(status: string, userId?: string): Promise<TaskCloudDB[]> {
        try {
            let databaseZone = cloudDatabase.zone(ZONE_NAME);
            let condition = new cloudDatabase.DatabaseQuery(TaskCloudDB);
            condition.equalTo('status', status);
            let resultArray = await databaseZone.query(condition);
            return resultArray as TaskCloudDB[];
        }
        catch (err) {
            const error = err as Error;
            hilog.error(DOMAIN, TAG, '查询任务失败, code: %{public}s, message: %{public}s', (err as Record<string, string>).code || '', error.message || JSON.stringify(err));
            return [];
        }
    }
    /**
     * 根据ID查询任务
     */
    async queryTaskById(taskId: string): Promise<TaskCloudDB | null> {
        try {
            let databaseZone = cloudDatabase.zone(ZONE_NAME);
            let condition = new cloudDatabase.DatabaseQuery(TaskCloudDB);
            condition.equalTo('id', taskId);
            let resultArray = await databaseZone.query(condition);
            return resultArray.length > 0 ? resultArray[0] as TaskCloudDB : null;
        }
        catch (err) {
            const error = err as Error;
            hilog.error(DOMAIN, TAG, '查询任务失败, code: %{public}s, message: %{public}s', (err as Record<string, string>).code || '', error.message || JSON.stringify(err));
            return null;
        }
    }
    /**
     * 根据日期范围查询任务
     */
    async queryTasksByDateRange(startDate: string, endDate: string, userId?: string): Promise<TaskCloudDB[]> {
        try {
            let databaseZone = cloudDatabase.zone(ZONE_NAME);
            let condition = new cloudDatabase.DatabaseQuery(TaskCloudDB);
            condition.greaterThanOrEqualTo('dueDate', startDate)
                .lessThanOrEqualTo('dueDate', endDate);
            let resultArray = await databaseZone.query(condition);
            return resultArray as TaskCloudDB[];
        }
        catch (err) {
            const error = err as Error;
            hilog.error(DOMAIN, TAG, '查询任务失败, code: %{public}s, message: %{public}s', (err as Record<string, string>).code || '', error.message || JSON.stringify(err));
            return [];
        }
    }
    // ==================== 账单相关操作 ====================
    /**
     * 添加或更新账单
     */
    async upsertBill(bill: BillCloudDB): Promise<BillCloudDB> {
        try {
            hilog.info(DOMAIN, TAG, '准备保存账单: %{public}s', bill.id);
            let databaseZone = cloudDatabase.zone(ZONE_NAME);
            let record = await databaseZone.upsert(bill);
            hilog.info(DOMAIN, TAG, '账单保存成功，影响记录数: %{public}d', record);
            return bill;
        }
        catch (err) {
            const error = err as Error;
            hilog.error(DOMAIN, TAG, '保存账单失败, code: %{public}s, message: %{public}s', (err as Record<string, string>).code || '', error.message || JSON.stringify(err));
            throw new Error('保存账单失败: ' + (error.message || JSON.stringify(err)));
        }
    }
    /**
     * 删除账单
     */
    async deleteBill(billId: string): Promise<void> {
        try {
            let databaseZone = cloudDatabase.zone(ZONE_NAME);
            let billToDelete = new BillCloudDB();
            billToDelete.id = billId;
            let deleteNum = await databaseZone.delete(billToDelete);
            hilog.info(DOMAIN, TAG, '账单删除成功，删除记录数: %{public}d', deleteNum);
        }
        catch (err) {
            const error = err as Error;
            hilog.error(DOMAIN, TAG, '删除账单失败, code: %{public}s, message: %{public}s', (err as Record<string, string>).code || '', error.message || JSON.stringify(err));
            throw new Error('删除账单失败: ' + (error.message || JSON.stringify(err)));
        }
    }
    /**
     * 查询所有账单
     */
    async queryAllBills(userId?: string): Promise<BillCloudDB[]> {
        try {
            let databaseZone = cloudDatabase.zone(ZONE_NAME);
            let condition = new cloudDatabase.DatabaseQuery(BillCloudDB);
            let resultArray = await databaseZone.query(condition);
            hilog.info(DOMAIN, TAG, '查询账单成功，数量: %{public}d', resultArray.length);
            return resultArray as BillCloudDB[];
        }
        catch (err) {
            const error = err as Error;
            hilog.error(DOMAIN, TAG, '查询账单失败, code: %{public}s, message: %{public}s', (err as Record<string, string>).code || '', error.message || JSON.stringify(err));
            return [];
        }
    }
    /**
     * 根据类型查询账单
     */
    async queryBillsByType(type: string, userId?: string): Promise<BillCloudDB[]> {
        try {
            let databaseZone = cloudDatabase.zone(ZONE_NAME);
            let condition = new cloudDatabase.DatabaseQuery(BillCloudDB);
            condition.equalTo('type', type);
            let resultArray = await databaseZone.query(condition);
            return resultArray as BillCloudDB[];
        }
        catch (err) {
            const error = err as Error;
            hilog.error(DOMAIN, TAG, '查询账单失败, code: %{public}s, message: %{public}s', (err as Record<string, string>).code || '', error.message || JSON.stringify(err));
            return [];
        }
    }
    /**
     * 根据日期范围查询账单
     */
    async queryBillsByDateRange(startDate: string, endDate: string, userId?: string): Promise<BillCloudDB[]> {
        try {
            let databaseZone = cloudDatabase.zone(ZONE_NAME);
            let condition = new cloudDatabase.DatabaseQuery(BillCloudDB);
            condition.greaterThanOrEqualTo('date', startDate)
                .lessThanOrEqualTo('date', endDate);
            let resultArray = await databaseZone.query(condition);
            return resultArray as BillCloudDB[];
        }
        catch (err) {
            const error = err as Error;
            hilog.error(DOMAIN, TAG, '查询账单失败, code: %{public}s, message: %{public}s', (err as Record<string, string>).code || '', error.message || JSON.stringify(err));
            return [];
        }
    }
    /**
     * 根据ID查询账单
     */
    async queryBillById(billId: string): Promise<BillCloudDB | null> {
        try {
            let databaseZone = cloudDatabase.zone(ZONE_NAME);
            let condition = new cloudDatabase.DatabaseQuery(BillCloudDB);
            condition.equalTo('id', billId);
            let resultArray = await databaseZone.query(condition);
            return resultArray.length > 0 ? resultArray[0] as BillCloudDB : null;
        }
        catch (err) {
            const error = err as Error;
            hilog.error(DOMAIN, TAG, '查询账单失败, code: %{public}s, message: %{public}s', (err as Record<string, string>).code || '', error.message || JSON.stringify(err));
            return null;
        }
    }
}
