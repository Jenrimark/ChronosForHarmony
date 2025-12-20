/**
 * AI配置 - 用于存储MIMO API Key
 * 注意：实际使用时应该从配置文件或环境变量读取，不要硬编码
 */
export class AIConfig {
  // TODO: 从配置文件或环境变量读取
  static readonly MIMO_API_KEY: string = ''; // 请在这里设置你的MIMO API Key
  
  /**
   * 获取MIMO API Key
   */
  static getMimoApiKey(): string {
    return AIConfig.MIMO_API_KEY;
  }
}
