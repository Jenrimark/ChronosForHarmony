import { Bill, BillType, BillCategory } from '../model/Bill';
import { ApiClient } from '../common/ApiClient';
import { Constants } from '../common/Constants';
import { BillRecognitionResult, BillRecognitionRequest, BillExtractResult, BillExtractRequest } from '../common/Types';

/**
 * AI服务类 - 通过API调用后端
 */
export class AIService {
  private static instance: AIService;
  private apiClient: ApiClient = ApiClient.getInstance();

  private constructor() {
    // 初始化API客户端
    this.apiClient.setBaseUrl(Constants.API_BASE_URL);
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * 智能识别账单类型和分类
   * 调用后端API进行识别
   */
  async recognizeBill(description: string, amount: number): Promise<BillRecognitionResult> {
    try {
      const response = await this.apiClient.post<BillRecognitionRequest>('/ai/recognize-bill', {
        description: description,
        amount: amount
      });

      const result: BillRecognitionResult = {
        type: response.data.type as BillType,
        category: response.data.category as BillCategory
      };
      return result;
    } catch (error) {
      console.error('AI识别失败，使用本地识别:', error);
      // 如果API调用失败，使用本地识别作为后备
      return this.localRecognizeBill(description, amount);
    }
  }

  /**
   * 智能提取账单信息
   * 调用后端API进行提取
   */
  async extractBillInfo(text: string): Promise<BillExtractResult> {
    try {
      const response = await this.apiClient.post<BillExtractRequest>('/ai/extract-bill-info', {
        text: text
      });

      const result: BillExtractResult = {
        amount: response.data.amount,
        description: response.data.description
      };
      return result;
    } catch (error) {
      console.error('AI提取失败，使用本地提取:', error);
      // 如果API调用失败，使用本地提取作为后备
      return this.localExtractBillInfo(text);
    }
  }

  /**
   * 本地识别账单（后备方案）
   */
  private localRecognizeBill(description: string, amount: number): BillRecognitionResult {
    const desc = description.toLowerCase().trim();
    
    // 收入关键词
    const incomeKeywords = ['工资', '薪资', '奖金', '红包', '收入', '收益', '利息', '分红', '退款', '报销'];
    const isIncome = incomeKeywords.some(keyword => desc.includes(keyword.toLowerCase()));
    
    if (isIncome) {
      const result: BillRecognitionResult = {
        type: BillType.INCOME,
        category: this.recognizeIncomeCategory(desc)
      };
      return result;
    }
    
    // 默认为支出
    const result: BillRecognitionResult = {
      type: BillType.EXPENSE,
      category: this.recognizeExpenseCategory(desc)
    };
    return result;
  }

  /**
   * 识别收入分类
   */
  private recognizeIncomeCategory(description: string): BillCategory {
    const desc = description.toLowerCase();
    
    if (desc.includes('工资') || desc.includes('薪资') || desc.includes('月薪')) {
      return BillCategory.SALARY;
    }
    if (desc.includes('奖金') || desc.includes('绩效')) {
      return BillCategory.BONUS;
    }
    if (desc.includes('投资') || desc.includes('理财') || desc.includes('股票') || desc.includes('基金')) {
      return BillCategory.INVESTMENT;
    }
    if (desc.includes('红包') || desc.includes('礼金') || desc.includes('礼物')) {
      return BillCategory.GIFT;
    }
    
    return BillCategory.OTHER_INCOME;
  }

  /**
   * 识别支出分类
   */
  private recognizeExpenseCategory(description: string): BillCategory {
    const desc = description.toLowerCase();
    
    // 餐饮
    if (desc.includes('餐') || desc.includes('饭') || desc.includes('吃') || 
        desc.includes('餐厅') || desc.includes('食堂') || desc.includes('外卖') ||
        desc.includes('咖啡') || desc.includes('奶茶') || desc.includes('火锅') ||
        desc.includes('烧烤') || desc.includes('小吃')) {
      return BillCategory.FOOD;
    }
    
    // 交通
    if (desc.includes('地铁') || desc.includes('公交') || desc.includes('打车') ||
        desc.includes('出租车') || desc.includes('滴滴') || desc.includes('uber') ||
        desc.includes('高铁') || desc.includes('飞机') || desc.includes('火车') ||
        desc.includes('停车') || desc.includes('油费') || desc.includes('加油')) {
      return BillCategory.TRANSPORT;
    }
    
    // 购物
    if (desc.includes('买') || desc.includes('购物') || desc.includes('超市') ||
        desc.includes('商场') || desc.includes('淘宝') || desc.includes('京东') ||
        desc.includes('衣服') || desc.includes('鞋') || desc.includes('包')) {
      return BillCategory.SHOPPING;
    }
    
    // 娱乐
    if (desc.includes('电影') || desc.includes('KTV') || desc.includes('游戏') ||
        desc.includes('旅游') || desc.includes('旅行') || desc.includes('门票') ||
        desc.includes('演唱会') || desc.includes('演出')) {
      return BillCategory.ENTERTAINMENT;
    }
    
    // 医疗
    if (desc.includes('医院') || desc.includes('看病') || desc.includes('药') ||
        desc.includes('体检') || desc.includes('医疗')) {
      return BillCategory.MEDICAL;
    }
    
    // 教育
    if (desc.includes('学费') || desc.includes('培训') || desc.includes('课程') ||
        desc.includes('书') || desc.includes('教育')) {
      return BillCategory.EDUCATION;
    }
    
    // 住房
    if (desc.includes('房租') || desc.includes('房贷') || desc.includes('物业') ||
        desc.includes('装修') || desc.includes('家具')) {
      return BillCategory.HOUSING;
    }
    
    // 水电
    if (desc.includes('电费') || desc.includes('水费') || desc.includes('燃气') ||
        desc.includes('网费') || desc.includes('话费')) {
      return BillCategory.UTILITIES;
    }
    
    return BillCategory.OTHER_EXPENSE;
  }

  /**
   * 本地提取账单信息（后备方案）
   */
  private localExtractBillInfo(text: string): BillExtractResult {
    // 提取金额（支持多种格式）
    const amountPatterns = [
      /(\d+\.?\d*)\s*元/,
      /(\d+\.?\d*)\s*块/,
      /¥\s*(\d+\.?\d*)/,
      /(\d+\.?\d*)\s*块钱/,
      /花了\s*(\d+\.?\d*)/,
      /收入\s*(\d+\.?\d*)/,
      /(\d+\.?\d*)\s*元/
    ];
    
    let amount: number | undefined = undefined;
    for (let i = 0; i < amountPatterns.length; i++) {
      const pattern = amountPatterns[i];
      const match = text.match(pattern);
      if (match) {
        amount = parseFloat(match[1]);
        break;
      }
    }
    
    // 提取描述（移除金额部分）
    let description = text;
    if (amount !== undefined) {
      description = text.replace(/\d+\.?\d*\s*(元|块|块钱|¥)/g, '').trim();
    }
    
    const result: BillExtractResult = {
      amount: amount,
      description: description || text
    };
    return result;
  }

  /**
   * 智能建议分类
   * 根据历史记录和描述建议最可能的分类
   */
  async suggestCategory(description: string, historyBills: Bill[]): Promise<BillCategory> {
    // 先使用关键词识别
    const recognized = await this.recognizeBill(description, 0);
    
    // 如果有历史记录，可以根据历史使用频率调整
    if (historyBills.length > 0) {
      const categoryCount = new Map<BillCategory, number>();
      historyBills.forEach(bill => {
        const count = categoryCount.get(bill.category) || 0;
        categoryCount.set(bill.category, count + 1);
      });
      
      // 如果识别出的分类在历史中经常使用，优先使用
      const recognizedCount = categoryCount.get(recognized.category) || 0;
      if (recognizedCount > 0) {
        return recognized.category;
      }
      
      // 否则返回历史中使用最多的分类
      let maxCount = 0;
      let mostUsedCategory = recognized.category;
      categoryCount.forEach((count, category) => {
        if (count > maxCount) {
          maxCount = count;
          mostUsedCategory = category;
        }
      });
      
      return mostUsedCategory;
    }
    
    return recognized.category;
  }
}
