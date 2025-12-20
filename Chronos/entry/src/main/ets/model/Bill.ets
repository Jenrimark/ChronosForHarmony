import { Constants } from '../common/Constants';

/**
 * 账单类型
 */
export enum BillType {
  INCOME = 'income',      // 收入
  EXPENSE = 'expense'     // 支出
}

/**
 * 账单分类
 */
export enum BillCategory {
  // 支出分类
  FOOD = 'food',                    // 餐饮
  TRANSPORT = 'transport',          // 交通
  SHOPPING = 'shopping',            // 购物
  ENTERTAINMENT = 'entertainment',  // 娱乐
  MEDICAL = 'medical',              // 医疗
  EDUCATION = 'education',         // 教育
  HOUSING = 'housing',              // 住房
  UTILITIES = 'utilities',          // 水电
  OTHER_EXPENSE = 'other_expense', // 其他支出
  
  // 收入分类
  SALARY = 'salary',                // 工资
  BONUS = 'bonus',                  // 奖金
  INVESTMENT = 'investment',        // 投资
  GIFT = 'gift',                    // 礼金
  OTHER_INCOME = 'other_income'     // 其他收入
}

/**
 * 账单数据接口
 */
export interface BillData {
  id?: number;
  type?: BillType;
  category?: BillCategory;
  amount?: number;
  description?: string;
  date?: Date | string;
  createTime?: Date | string;
  updateTime?: Date | string;
  tags?: string[];
}

/**
 * 账单JSON接口
 */
export interface BillJSON {
  id: number;
  type: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  createTime: string;
  updateTime: string;
  tags: string[] | string; // 后端可能返回数组或字符串
}

/**
 * 账单数据模型
 */
export class Bill {
  id: number = 0;
  type: BillType = BillType.EXPENSE;
  category: BillCategory = BillCategory.OTHER_EXPENSE;
  amount: number = 0;
  description: string = '';
  date: Date = new Date();
  createTime: Date = new Date();
  updateTime: Date = new Date();
  tags: string[] = [];

  constructor(data?: BillData) {
    if (data) {
      if (data.id !== undefined) this.id = data.id;
      if (data.type !== undefined) this.type = data.type;
      if (data.category !== undefined) this.category = data.category;
      if (data.amount !== undefined) this.amount = data.amount;
      if (data.description !== undefined) this.description = data.description;
      if (data.date !== undefined) {
        this.date = data.date instanceof Date ? data.date : new Date(data.date);
      }
      if (data.createTime !== undefined) {
        this.createTime = data.createTime instanceof Date ? data.createTime : new Date(data.createTime);
      }
      if (data.updateTime !== undefined) {
        this.updateTime = data.updateTime instanceof Date ? data.updateTime : new Date(data.updateTime);
      }
      if (data.tags !== undefined) this.tags = data.tags;
    }
  }

  /**
   * 转换为JSON对象
   */
  toJSON(): BillJSON {
    return {
      id: this.id,
      type: this.type,
      category: this.category,
      amount: this.amount,
      description: this.description,
      date: this.date.toISOString(),
      createTime: this.createTime.toISOString(),
      updateTime: this.updateTime.toISOString(),
      tags: JSON.stringify(this.tags)
    };
  }

  /**
   * 从JSON对象创建
   */
  static fromJSON(json: BillJSON): Bill {
    let tags: string[] = [];
    if (json.tags) {
      if (Array.isArray(json.tags)) {
        tags = json.tags;
      } else {
        // json.tags是string类型，需要解析
        try {
          tags = JSON.parse(json.tags as string);
        } catch (e) {
          tags = [];
        }
      }
    }
    
    return new Bill({
      id: json.id,
      type: json.type as BillType,
      category: json.category as BillCategory,
      amount: json.amount,
      description: json.description,
      date: json.date,
      createTime: json.createTime,
      updateTime: json.updateTime,
      tags: tags
    });
  }

  /**
   * 判断是否是收入
   */
  isIncome(): boolean {
    return this.type === BillType.INCOME;
  }

  /**
   * 判断是否是支出
   */
  isExpense(): boolean {
    return this.type === BillType.EXPENSE;
  }

  /**
   * 获取显示金额（带符号）
   */
  getDisplayAmount(): string {
    const sign = this.isIncome() ? '+' : '-';
    return `${sign}¥${this.amount.toFixed(2)}`;
  }
}

