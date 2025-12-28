import { http } from '@kit.NetworkKit';
import { Constants } from '../common/Constants';
import { BillType, Bill } from '../model/Bill';
import { Task } from '../model/Task';
import { CalendarEvent } from '../model/CalendarEvent';

/**
 * 聊天消息接口
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * MIMO API请求消息接口
 */
interface MimoMessage {
  role: string;
  content: string;
}

/**
 * MIMO API响应格式配置
 */
interface MimoResponseFormat {
  type: string;
}

/**
 * MIMO API请求接口
 */
interface MimoRequest {
  model: string;
  messages: MimoMessage[];
  temperature?: number;
  response_format?: MimoResponseFormat;
  max_completion_tokens?: number;
  stream?: boolean;
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
  finish_reason?: string;
}

/**
 * MIMO API使用情况接口
 */
interface MimoUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

/**
 * MIMO API响应接口
 */
interface MimoResponse {
  choices: MimoResponseChoice[];
  id?: string;
  model?: string;
  usage?: MimoUsage;
}

/**
 * MIMO API流式响应增量接口
 */
interface MimoStreamDelta {
  content?: string;
  role?: string;
}

/**
 * MIMO API流式响应选择接口
 */
interface MimoStreamChoice {
  delta: MimoStreamDelta;
  finish_reason?: string;
}

/**
 * MIMO API流式响应接口
 */
interface MimoStreamResponse {
  choices: MimoStreamChoice[];
  id?: string;
  model?: string;
}

/**
 * API錯誤詳情接口
 */
interface ApiErrorDetails {
  hasChoices: boolean;
  choicesLength: number;
  firstChoice: string;
}

/**
 * API響應解析信息接口
 */
interface ApiResponseParseInfo {
  hasChoices: boolean;
  choicesLength: number;
  hasMessage: boolean;
  hasContent: boolean;
}

/**
 * 聊天服务 - 集成MIMO AI
 */
export class ChatService {
  private static instance: ChatService;
  private apiKey: string = Constants.MIMO_API_KEY;
  private baseUrl: string = Constants.MIMO_API_URL;
  private model: string = 'mimo-v2-flash'; // 默认模型
  private conversationHistory: ChatMessage[] = [];

  private constructor() {
    // 初始化系统消息
    this.conversationHistory = [
      {
        role: 'system',
        content: '你是辰序助手，一个智能的生活管理助手。你可以帮助用户管理任务、记账、提供建议等。请用友好、专业的语气回复用户。'
      }
    ];
  }

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  /**
   * 发送消息并获取AI回复（流式输出）
   */
  async sendMessageStream(
    userMessage: string,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    if (!this.apiKey || this.apiKey === '') {
      throw new Error('MIMO API Key未设置');
    }

    // 添加用户消息到历史记录
    this.conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    let fullResponse = '';

    try {
      // 调用流式API
      await this.callMimoAPIStream((chunk: string) => {
        fullResponse += chunk;
        onChunk(chunk);
      });
      
      // 添加AI回复到历史记录
      this.conversationHistory.push({
        role: 'assistant',
        content: fullResponse
      });

      return fullResponse;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('发送消息失败:', errorMessage);
      throw new Error(`发送消息失败: ${errorMessage}`);
    }
  }

  /**
   * 发送消息并获取AI回复（兼容旧接口）
   */
  async sendMessage(userMessage: string): Promise<string> {
    let fullResponse = '';
    await this.sendMessageStream(userMessage, (chunk: string) => {
      fullResponse += chunk;
    });
    return fullResponse;
  }

  /**
   * 调用MIMO API（流式输出）
   * 由于HarmonyOS http模块可能不支持真正的流式响应，先使用非流式请求，然后模拟流式输出
   */
  private async callMimoAPIStream(onChunk: (chunk: string) => void): Promise<void> {
    // 构建请求消息列表
    const messages: MimoMessage[] = [];
    for (const msg of this.conversationHistory) {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    }

    // 使用非流式请求（更可靠）
    const requestData: MimoRequest = {
      model: this.model,
      messages: messages,
      temperature: 0.7
      // 不使用 stream: true，因为HarmonyOS可能不支持
    };

    const httpRequest = http.createHttp();
    
    try {
      const response = await httpRequest.request(this.baseUrl, {
        method: http.RequestMethod.POST,
        header: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        extraData: JSON.stringify(requestData),
        connectTimeout: 30000,
        readTimeout: 30000
      });

      if (response.responseCode !== 200) {
        const errorText = await response.result.toString();
        console.error('MIMO API错误响应:', errorText);
        console.error('请求URL:', this.baseUrl);
        console.error('请求体:', JSON.stringify(requestData));
        throw new Error(`MIMO API请求失败，状态码: ${response.responseCode}，错误信息: ${errorText}`);
      }

      const result = await response.result.toString();
      console.info('MIMO API响应状态码:', response.responseCode);
      console.info('MIMO API响应内容:', result.substring(0, 500)); // 打印前500字符用于调试
      
      // 解析JSON响应
      try {
        const data: MimoResponse = JSON.parse(result) as MimoResponse;
        const parseInfo: ApiResponseParseInfo = {
          hasChoices: !!data.choices,
          choicesLength: data.choices?.length || 0,
          hasMessage: !!data.choices?.[0]?.message,
          hasContent: !!data.choices?.[0]?.message?.content
        };
        console.info('解析後的數據結構:', JSON.stringify(parseInfo));
        
        if (data.choices && data.choices.length > 0 && data.choices[0].message?.content) {
          // 获取完整内容
          const fullContent = data.choices[0].message.content;
          console.info('获取到AI响应，内容长度:', fullContent.length);
          
          if (!fullContent || fullContent.trim() === '') {
            throw new Error('API返回的內容為空');
          }
          
          // 为了更好的体验，先立即输出一部分内容
          console.info('准备开始流式输出，内容长度:', fullContent.length);
          if (fullContent.length > 20) {
            const firstChunk = fullContent.substring(0, 20);
            console.info('输出第一批内容，长度:', firstChunk.length);
            onChunk(firstChunk);
            // 然后快速输出剩余内容
            const remainingContent = fullContent.substring(20);
            console.info('准备输出剩余内容，长度:', remainingContent.length);
            await this.simulateStreamOutput(remainingContent, onChunk);
          } else {
            // 内容很短，直接输出
            console.info('内容较短，直接输出全部');
            onChunk(fullContent);
          }
          console.info('流式输出完成');
        } else {
          // 更詳細的錯誤信息
          const errorDetails: ApiErrorDetails = {
            hasChoices: !!data.choices,
            choicesLength: data.choices?.length || 0,
            firstChoice: data.choices?.[0] ? JSON.stringify(data.choices[0]).substring(0, 200) : 'null'
          };
          console.error('MIMO API返回格式錯誤，詳情:', JSON.stringify(errorDetails));
          throw new Error(`MIMO API返回格式错误：choices为空或格式不正确。響應數據: ${JSON.stringify(errorDetails)}`);
        }
      } catch (parseError) {
        const errorMsg = parseError instanceof Error ? parseError.message : String(parseError);
        console.error('解析響應失敗，原始響應:', result.substring(0, 1000));
        console.error('解析錯誤詳情:', errorMsg);
        throw new Error(`解析MIMO API响应失败: ${errorMsg}。請檢查API響應格式是否正確。`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('调用MIMO API失败:', errorMessage);
      throw new Error(`MIMO API调用失败: ${errorMessage}`);
    } finally {
      httpRequest.destroy();
    }
  }

  /**
   * 模拟流式输出（逐词显示，快速更新）
   */
  private async simulateStreamOutput(
    content: string,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    console.info('simulateStreamOutput开始，内容长度:', content.length);
    // 如果内容很短，直接一次性输出
    if (content.length <= 50) {
      console.info('内容较短，直接输出全部');
      onChunk(content);
      console.info('simulateStreamOutput完成（短内容）');
      return;
    }
    
    // 按词分组，实现打字机效果
    const words = content.split(/(\s+)/); // 保留空格
    const chunkSize = 5; // 每次显示5个词，加快速度
    console.info('分词完成，总词数:', words.length, '每批大小:', chunkSize);
    
    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize).join('');
      console.info(`输出第${Math.floor(i / chunkSize) + 1}批内容，长度:`, chunk.length);
      onChunk(chunk);
      // 减少延迟，加快显示速度
      if (i + chunkSize < words.length) {
        await new Promise<void>((resolve: () => void) => setTimeout(resolve, 20));
      }
    }
    console.info('simulateStreamOutput完成（长内容）');
  }

  /**
   * 调用MIMO API（非流式，兼容旧接口）
   */
  private async callMimoAPI(): Promise<string> {
    let fullResponse = '';
    await this.callMimoAPIStream((chunk: string) => {
      fullResponse += chunk;
    });
    return fullResponse;
  }

  /**
   * 更新系统消息，包含用户的所有数据
   */
  updateSystemMessageWithData(
    tasks: Task[],
    events: CalendarEvent[],
    bills: Bill[]
  ): void {
    let systemContent = '你是辰序助手，一个智能的生活管理助手。你可以帮助用户管理任务、记账、提供建议等。请用友好、专业的语气回复用户。\n\n';
    
    systemContent += '以下是用户当前的本地数据库内容，你可以随时查询和使用这些信息来回答用户的问题：\n\n';
    
    // 任务列表
    systemContent += '=== 任务列表 ===\n';
    if (tasks.length === 0) {
      systemContent += '暂无任务。\n';
    } else {
      tasks.forEach((task, index) => {
        const statusText = task.status === 'completed' ? '已完成' : 
                          task.status === 'in_progress' ? '进行中' : '待办';
        const priorityText = task.priority === 3 ? '高' : 
                             task.priority === 2 ? '中' : '低';
        const dueDateText = task.dueDate ? 
          `截止日期：${this.formatDateForAI(new Date(task.dueDate))}` : '无截止日期';
        systemContent += `${index + 1}. ${task.title || '无标题'}\n`;
        if (task.description) {
          systemContent += `   描述：${task.description}\n`;
        }
        systemContent += `   状态：${statusText} | 优先级：${priorityText} | ${dueDateText}\n`;
        if (task.tags && task.tags.length > 0) {
          systemContent += `   标签：${task.tags.join(', ')}\n`;
        }
        systemContent += '\n';
      });
    }
    
    systemContent += '\n=== 日程安排 ===\n';
    if (events.length === 0) {
      systemContent += '暂无日程。\n';
    } else {
      events.forEach((event, index) => {
        // 处理startTime和endTime（可能是Date对象或时间戳）
        const startDate = event.startTime instanceof Date ? event.startTime : new Date(event.startTime);
        const endDate = event.endTime instanceof Date ? event.endTime : new Date(event.endTime);
        const timeText = event.isAllDay ? 
          `全天：${this.formatDateForAI(startDate)}` :
          `${this.formatDateForAI(startDate)} ${this.formatTimeForAI(startDate)} - ${this.formatTimeForAI(endDate)}`;
        systemContent += `${index + 1}. ${event.title || '无标题'}\n`;
        systemContent += `   时间：${timeText}\n`;
        if (event.location) {
          systemContent += `   地点：${event.location}\n`;
        }
        if (event.reminder && event.reminder !== 'none') {
          systemContent += `   提醒：${event.reminder}\n`;
        }
        if (event.repeatRule && event.repeatRule !== 'none') {
          systemContent += `   重复：${event.repeatRule}\n`;
        }
        systemContent += '\n';
      });
    }
    
    systemContent += '\n=== 记账信息 ===\n';
    if (bills.length === 0) {
      systemContent += '暂无账单记录。\n';
    } else {
      // 按日期分组显示
      const billsByDate = new Map<string, Bill[]>();
      bills.forEach(bill => {
        const dateKey = this.formatDateForAI(new Date(bill.date));
        if (!billsByDate.has(dateKey)) {
          billsByDate.set(dateKey, []);
        }
        const dateBills = billsByDate.get(dateKey);
        if (dateBills) {
          dateBills.push(bill);
        }
      });
      
      const sortedDates = Array.from(billsByDate.keys()).sort().reverse(); // 最新的在前
      sortedDates.forEach(date => {
        const dateBills = billsByDate.get(date);
        if (!dateBills) {
          return;
        }
        systemContent += `${date}：\n`;
        dateBills.forEach((bill, index) => {
          // Bill对象有isIncome方法
          const isIncome = bill.isIncome();
          const typeText = isIncome ? '收入' : '支出';
          const categoryText = this.getCategoryName(bill.category || '');
          systemContent += `   ${index + 1}. ${typeText} ¥${bill.amount.toFixed(2)} - ${categoryText}`;
          if (bill.description) {
            systemContent += ` (${bill.description})`;
          }
          systemContent += '\n';
        });
        systemContent += '\n';
      });
    }
    
    systemContent += '\n请根据以上信息回答用户的问题。如果用户询问具体的数据，请准确引用上述信息。';
    
    // 更新系统消息
    if (this.conversationHistory.length > 0 && this.conversationHistory[0].role === 'system') {
      this.conversationHistory[0].content = systemContent;
    } else {
      this.conversationHistory.unshift({
        role: 'system',
        content: systemContent
      });
    }
  }
  
  /**
   * 格式化日期用于AI显示
   */
  private formatDateForAI(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  /**
   * 格式化时间用于AI显示
   */
  private formatTimeForAI(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  /**
   * 获取分类名称
   */
  private getCategoryName(category: string): string {
    const categoryMap: Map<string, string> = new Map([
      ['food', '餐饮'],
      ['transport', '交通'],
      ['shopping', '购物'],
      ['entertainment', '娱乐'],
      ['medical', '医疗'],
      ['education', '教育'],
      ['housing', '住房'],
      ['utilities', '水电'],
      ['salary', '工资'],
      ['bonus', '奖金'],
      ['investment', '投资'],
      ['gift', '礼金'],
      ['other_expense', '其他支出'],
      ['other_income', '其他收入']
    ]);
    return categoryMap.get(category) || category;
  }

  /**
   * 清空对话历史
   */
  clearHistory(): void {
    this.conversationHistory = [
      {
        role: 'system',
        content: '你是辰序助手，一个智能的生活管理助手。你可以帮助用户管理任务、记账、提供建议等。请用友好、专业的语气回复用户。'
      }
    ];
  }

  /**
   * 获取对话历史
   */
  getHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }
}

