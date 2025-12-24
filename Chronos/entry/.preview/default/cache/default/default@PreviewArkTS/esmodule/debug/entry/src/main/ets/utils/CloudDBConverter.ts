import { Task } from "@normalized:N&&&entry/src/main/ets/model/Task&";
import { TaskCloudDB } from "@normalized:N&&&entry/src/main/ets/model/clouddb/TaskCloudDB&";
import { Bill } from "@normalized:N&&&entry/src/main/ets/model/Bill&";
import { BillCloudDB } from "@normalized:N&&&entry/src/main/ets/model/clouddb/BillCloudDB&";
/**
 * Cloud DB数据转换工具类
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
    static taskToCloudDB(task: Task, userId: string = 'default'): TaskCloudDB {
        const cloudDB = new TaskCloudDB({
            id: task.id > 0 ? task.id.toString() : this.generateId(),
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate ? task.dueDate.toISOString() : null,
            createTime: task.createTime.toISOString(),
            updateTime: task.updateTime.toISOString(),
            completedTime: task.completedTime ? task.completedTime.toISOString() : null,
            tags: JSON.stringify(task.tags || []),
            userId: userId
        });
        return cloudDB;
    }
    /**
     * 将TaskCloudDB转换为Task
     */
    static cloudDBToTask(cloudDB: TaskCloudDB): Task {
        let tags: string[] = [];
        try {
            tags = JSON.parse(cloudDB.tags || '[]');
        }
        catch (e) {
            tags = [];
        }
        return new Task({
            id: parseInt(cloudDB.id) || 0,
            title: cloudDB.title,
            description: cloudDB.description,
            status: cloudDB.status,
            priority: cloudDB.priority,
            dueDate: cloudDB.dueDate ? new Date(cloudDB.dueDate) : null,
            createTime: cloudDB.createTime ? new Date(cloudDB.createTime) : new Date(),
            updateTime: cloudDB.updateTime ? new Date(cloudDB.updateTime) : new Date(),
            completedTime: cloudDB.completedTime ? new Date(cloudDB.completedTime) : null,
            tags: tags
        });
    }
    /**
     * 将Bill转换为BillCloudDB
     */
    static billToCloudDB(bill: Bill, userId: string = 'default'): BillCloudDB {
        const cloudDB = new BillCloudDB({
            id: bill.id > 0 ? bill.id.toString() : this.generateId(),
            type: bill.type,
            category: bill.category,
            amount: bill.amount,
            description: bill.description,
            date: bill.date.toISOString(),
            createTime: bill.createTime.toISOString(),
            updateTime: bill.updateTime.toISOString(),
            tags: JSON.stringify(bill.tags || []),
            userId: userId
        });
        return cloudDB;
    }
    /**
     * 将BillCloudDB转换为Bill
     */
    static cloudDBToBill(cloudDB: BillCloudDB): Bill {
        let tags: string[] = [];
        try {
            tags = JSON.parse(cloudDB.tags || '[]');
        }
        catch (e) {
            tags = [];
        }
        return new Bill({
            id: parseInt(cloudDB.id) || 0,
            type: cloudDB.type as any,
            category: cloudDB.category as any,
            amount: cloudDB.amount,
            description: cloudDB.description,
            date: cloudDB.date ? new Date(cloudDB.date) : new Date(),
            createTime: cloudDB.createTime ? new Date(cloudDB.createTime) : new Date(),
            updateTime: cloudDB.updateTime ? new Date(cloudDB.updateTime) : new Date(),
            tags: tags
        });
    }
    /**
     * 获取当前用户ID（临时实现，后续可以从UserService获取）
     */
    static getCurrentUserId(): string {
        // TODO: 从UserService或AuthService获取当前登录用户ID
        // 暂时返回默认值
        return 'default_user';
    }
}
