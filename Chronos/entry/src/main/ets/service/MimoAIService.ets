import { Bill, BillType, BillCategory } from '../model/Bill';
import { http } from '@kit.NetworkKit';
import { BusinessError } from '@kit.BasicServicesKit';

/**
 * MIMO API请求消息接口
 */
interface MimoMessage {
  role: string;
  content: string;
}

/**
 * MIMO API请求接口
 */
interface MimoRequest {
  model: string;
  messages: MimoMessage[];
  temperature?: number;
}

/**
 * MIMO API消息接口
 */
interface MimoResponseMessage {
  role: string;
  content: string;
}

/**
 * MIMO API选择接口
 */
interface MimoResponseChoice {
  message: MimoResponseMessage;
}

/**
 * MIMO API响应接口
 */
interface MimoResponse {
  choices: MimoResponseChoice[];
}

/**
 * 账单识别结果接口
 */
export interface BillRecognitionResult {
  type: BillType;
  category: BillCategory;
  amount?: number;
  description?: string;
}

/**
 * 小米MIMO大模型AI服务
 */
export class MimoAIService {
  private static instance: MimoAIService;
  private apiKey: string = ''; // 从环境变量或配置中获取
  private baseUrl: string = 'https://api.xiaomimimo.com/v1/chat/completions';
  private model: string = 'mimo'; // 默认模型

  private constructor() {
    // TODO: 从配置文件或环境变量读取API Key
    // this.apiKey = 'your-api-key';
  }

  static getInstance(): MimoAIService {
    if (!MimoAIService.instance) {
      MimoAIService.instance = new MimoAIService();
    }
    return MimoAIService.instance;
  }

  /**
   * 设置API Key
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * 识别账单信息（从自然语言文本）
   */
  async recognizeBill(text: string): Promise<BillRecognitionResult> {
    try {
      const prompt = this.buildPrompt(text);
      const response = await this.callMimoAPI(prompt);
      return this.parseResponse(response);
    } catch (error) {
      console.error('MIMO AI识别失败:', error);
      // 返回默认结果
      return {
        type: BillType.EXPENSE,
        category: BillCategory.OTHER_EXPENSE
      };
    }
  }

  /**
   * 构建提示词
   */
  private buildPrompt(text: string): string {
    return `请分析以下记账文本，提取账单信息并分类。

文本内容：${text}

请以JSON格式返回结果，包含以下字段：
- type: "income" 或 "expense"（收入或支出）
- category: 账单分类（food, transport, shopping, entertainment, medical, education, housing, utilities, other_expense, salary, bonus, investment, gift, other_income）
- amount: 金额（数字，如果有）
- description: 描述（如果有）

只返回JSON，不要其他文字。`;
  }

  /**
   * 调用MIMO API
   */
  private async callMimoAPI(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('MIMO API Key未设置');
    }

    const requestData: MimoRequest = {
      model: this.model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3
    };

    const httpRequest = http.createHttp();
    const response = await httpRequest.request(this.baseUrl, {
      method: http.RequestMethod.POST,
      header: {
        'api-key': this.apiKey,
        'Content-Type': 'application/json'
      },
      extraData: JSON.stringify(requestData)
    });

    const result = await response.result.toString();
    const data: MimoResponse = JSON.parse(result) as MimoResponse;

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    }

    throw new Error('MIMO API返回格式错误');
  }

  /**
   * 解析API响应
   */
  private parseResponse(responseText: string): BillRecognitionResult {
    try {
      // 尝试提取JSON（可能包含markdown代码块）
      let jsonText = responseText.trim();
      
      // 移除可能的markdown代码块标记
      if (jsonText.startsWith('```')) {
        const lines = jsonText.split('\n');
        jsonText = lines.slice(1, -1).join('\n');
      }
      
      // 移除可能的json标记
      if (jsonText.startsWith('json')) {
        jsonText = jsonText.substring(4).trim();
      }

      const result = JSON.parse(jsonText) as Record<string, ESObject>;
      
      const typeValue = result.type as string;
      const categoryValue = result.category as string;
      
      const billResult: BillRecognitionResult = {
        type: (typeValue === 'income' ? BillType.INCOME : BillType.EXPENSE),
        category: this.mapCategory(categoryValue)
      };

      if (result.amount !== undefined) {
        billResult.amount = parseFloat(String(result.amount));
      }

      if (result.description) {
        billResult.description = String(result.description);
      }

      return billResult;
    } catch (error) {
      console.error('解析MIMO响应失败:', error);
      // 返回默认结果
      return {
        type: BillType.EXPENSE,
        category: BillCategory.OTHER_EXPENSE
      };
    }
  }

  /**
   * 映射分类字符串到BillCategory枚举
   */
  private mapCategory(categoryStr: string): BillCategory {
    const categoryMap: Record<string, BillCategory> = {
      'food': BillCategory.FOOD,
      'transport': BillCategory.TRANSPORT,
      'shopping': BillCategory.SHOPPING,
      'entertainment': BillCategory.ENTERTAINMENT,
      'medical': BillCategory.MEDICAL,
      'education': BillCategory.EDUCATION,
      'housing': BillCategory.HOUSING,
      'utilities': BillCategory.UTILITIES,
      'other_expense': BillCategory.OTHER_EXPENSE,
      'salary': BillCategory.SALARY,
      'bonus': BillCategory.BONUS,
      'investment': BillCategory.INVESTMENT,
      'gift': BillCategory.GIFT,
      'other_income': BillCategory.OTHER_INCOME
    };

    const lowerCategory = categoryStr.toLowerCase();
    return categoryMap[lowerCategory] || BillCategory.OTHER_EXPENSE;
  }
}
