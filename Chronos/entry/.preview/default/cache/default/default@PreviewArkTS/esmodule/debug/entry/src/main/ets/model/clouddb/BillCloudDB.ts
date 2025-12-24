/**
 * 账单Cloud DB对象类型
 * 注意：这个类需要与AGC控制台中定义的对象类型结构完全一致
 */
export class BillCloudDB {
    // 主键字段（必须）
    id: string = '';
    // 账单字段
    type: string = 'expense'; // income, expense
    category: string = 'other_expense'; // 分类枚举值
    amount: number = 0; // Double类型，在TypeScript中使用number
    description: string = ''; // 可空字段，但使用空字符串作为默认值
    date: string = ''; // ISO日期字符串
    createTime: string = ''; // ISO日期字符串
    updateTime: string = ''; // ISO日期字符串
    tags: string = '[]'; // JSON字符串数组
    // 用户ID（用于多用户隔离）
    userId: string = '';
    constructor(data?: Partial<BillCloudDB>) {
        if (data) {
            if (data.id !== undefined)
                this.id = data.id;
            if (data.type !== undefined)
                this.type = data.type;
            if (data.category !== undefined)
                this.category = data.category;
            if (data.amount !== undefined)
                this.amount = data.amount;
            if (data.description !== undefined)
                this.description = data.description;
            if (data.date !== undefined)
                this.date = data.date;
            if (data.createTime !== undefined)
                this.createTime = data.createTime;
            if (data.updateTime !== undefined)
                this.updateTime = data.updateTime;
            if (data.tags !== undefined)
                this.tags = data.tags;
            if (data.userId !== undefined)
                this.userId = data.userId;
        }
    }
}
