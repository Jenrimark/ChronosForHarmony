import { speechRecognizer } from '@kit.CoreSpeechKit';
import { BusinessError } from '@kit.BasicServicesKit';

/**
 * 语音识别服务类
 * 使用HarmonyOS的speechRecognizer API实现语音转文字功能
 */
export class SpeechRecognitionService {
  private static instance: SpeechRecognitionService;
  private asrEngine: speechRecognizer.SpeechRecognitionEngine | null = null;
  private sessionId: string = '';
  private recognitionText: string = '';
  private isRecognizing: boolean = false;

  private constructor() {}

  static getInstance(): SpeechRecognitionService {
    if (!SpeechRecognitionService.instance) {
      SpeechRecognitionService.instance = new SpeechRecognitionService();
    }
    return SpeechRecognitionService.instance;
  }

  /**
   * 初始化语音识别引擎
   */
  async initEngine(): Promise<void> {
    try {
      if (this.asrEngine) {
        console.info('语音识别引擎已初始化');
        return;
      }

      // 设置创建引擎参数
      const extraParams: Record<string, Object> = {
        "locate": "CN",
        "recognizerMode": "short"
      };
      
      const initParamsInfo: speechRecognizer.CreateEngineParams = {
        language: 'zh-CN',
        online: 1, // 离线模式
        extraParams: extraParams
      };

      // 创建引擎
      this.asrEngine = await speechRecognizer.createEngine(initParamsInfo);
      console.info('语音识别引擎初始化成功');
    } catch (error) {
      console.error('初始化语音识别引擎失败:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  /**
   * 开始语音识别
   * @param onResult 识别结果回调
   * @param onError 错误回调
   */
  async startRecognition(
    onResult?: (text: string) => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    try {
      if (!this.asrEngine) {
        await this.initEngine();
      }

      if (this.isRecognizing) {
        console.warn('语音识别已在进行中');
        return;
      }

      if (!this.asrEngine) {
        throw new Error('语音识别引擎未初始化');
      }

      // 生成会话ID
      this.sessionId = `session_${new Date().getTime()}`;
      this.recognitionText = '';
      this.isRecognizing = true;

      // 设置回调监听器
      const listener: speechRecognizer.RecognitionListener = {
        onStart: (sessionId: string, eventMessage: string) => {
          console.info(`语音识别开始: ${sessionId}, ${eventMessage}`);
        },
        onEvent: (sessionId: string, eventCode: number, eventMessage: string) => {
          console.info(`语音识别事件: ${sessionId}, ${eventCode}, ${eventMessage}`);
        },
        onResult: (sessionId: string, result: speechRecognizer.SpeechRecognitionResult) => {
          if (result.result) {
            this.recognitionText = result.result;
            console.info(`识别结果: ${result.result}, isFinal: ${result.isFinal}`);
            
            // 如果是最终结果，调用回调
            if (result.isFinal && onResult) {
              onResult(result.result);
            }
          }
        },
        onComplete: (sessionId: string, eventMessage: string) => {
          console.info(`语音识别完成: ${sessionId}, ${eventMessage}`);
          this.isRecognizing = false;
          
          // 返回最终识别结果
          if (onResult && this.recognitionText) {
            onResult(this.recognitionText);
          }
        },
        onError: (sessionId: string, errorCode: number, errorMessage: string) => {
          console.error(`语音识别错误: ${sessionId}, ${errorCode}, ${errorMessage}`);
          this.isRecognizing = false;
          
          if (onError) {
            onError(new Error(`语音识别失败: ${errorMessage} (${errorCode})`));
          }
        }
      };

      this.asrEngine.setListener(listener);

      // 设置开始识别参数
      // recognitionMode: 0 表示实时录音识别（需要应用开启录音权限）
      const recognizerParams: speechRecognizer.StartParams = {
        sessionId: this.sessionId,
        audioInfo: {
          audioType: 'pcm',
          sampleRate: 16000,
          soundChannel: 1,
          sampleBit: 16
        },
        extraParams: {
          'recognitionMode': 0 // 实时录音识别模式
        }
      };

      // 开始识别
      this.asrEngine.startListening(recognizerParams);
      console.info('开始语音识别');
    } catch (error) {
      console.error('开始语音识别失败:', error);
      this.isRecognizing = false;
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  /**
   * 结束语音识别
   */
  async finishRecognition(): Promise<string> {
    try {
      if (!this.asrEngine || !this.isRecognizing) {
        return this.recognitionText;
      }

      if (this.sessionId) {
        this.asrEngine.finish(this.sessionId);
      }

      this.isRecognizing = false;
      const result = this.recognitionText;
      this.recognitionText = '';
      
      console.info('结束语音识别，结果:', result);
      return result;
    } catch (error) {
      console.error('结束语音识别失败:', error);
      this.isRecognizing = false;
      const result = this.recognitionText;
      this.recognitionText = '';
      return result;
    }
  }

  /**
   * 取消语音识别
   */
  async cancelRecognition(): Promise<void> {
    try {
      if (!this.asrEngine || !this.isRecognizing) {
        return;
      }

      if (this.sessionId) {
        this.asrEngine.cancel(this.sessionId);
      }

      this.isRecognizing = false;
      this.recognitionText = '';
      console.info('取消语音识别');
    } catch (error) {
      console.error('取消语音识别失败:', error);
      this.isRecognizing = false;
      this.recognitionText = '';
    }
  }

  /**
   * 获取当前识别文本
   */
  getRecognitionText(): string {
    return this.recognitionText;
  }

  /**
   * 获取识别状态
   */
  isRecognizingNow(): boolean {
    return this.isRecognizing;
  }

  /**
   * 关闭引擎，释放资源
   */
  shutdown(): void {
    try {
      if (this.asrEngine) {
        this.asrEngine.shutdown();
        this.asrEngine = null;
        this.isRecognizing = false;
        this.recognitionText = '';
        this.sessionId = '';
        console.info('语音识别引擎已关闭');
      }
    } catch (error) {
      console.error('关闭语音识别引擎失败:', error);
    }
  }
}

