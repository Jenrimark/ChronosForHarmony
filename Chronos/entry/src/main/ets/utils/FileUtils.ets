import { fileIo } from '@kit.CoreFileKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { util } from '@kit.ArkTS';

/**
 * 文件工具类
 * 用于处理用户文件 URI 的读写操作
 */
export class FileUtils {
  private static readonly TAG: string = 'FileUtils';
  private static readonly DOMAIN: number = 0x0000;

  /**
   * 从用户文件 URI 读取文本内容
   * @param uri 文档类 URI（从 DocumentViewPicker 返回）
   * @returns 文件文本内容
   */
  static async readTextFromUri(uri: string): Promise<string> {
    try {
      hilog.info(FileUtils.DOMAIN, FileUtils.TAG, `开始读取文件: ${uri}`);
      
      // 打开文件（只读模式）
      const file = fileIo.openSync(uri, fileIo.OpenMode.READ_ONLY);
      
      try {
        // 获取文件大小
        const stat = fileIo.statSync(file.fd);
        const fileSize = stat.size;
        
        hilog.info(FileUtils.DOMAIN, FileUtils.TAG, `文件大小: ${fileSize} bytes`);
        
        if (fileSize === 0) {
          const emptyError = new Error('文件为空');
          throw emptyError;
        }
        
        // 读取文件内容
        const buffer = new ArrayBuffer(fileSize);
        const readLen = fileIo.readSync(file.fd, buffer);
        
        hilog.info(FileUtils.DOMAIN, FileUtils.TAG, `实际读取: ${readLen} bytes`);
        
        // 将 ArrayBuffer 转换为字符串
        const uint8Array = new Uint8Array(buffer);
        const text = FileUtils.arrayBufferToString(uint8Array);
        
        hilog.info(FileUtils.DOMAIN, FileUtils.TAG, `文件读取成功，内容长度: ${text.length}`);
        
        return text;
      } finally {
        // 确保关闭文件
        fileIo.closeSync(file.fd);
      }
    } catch (error) {
      const err = error as BusinessError;
      hilog.error(FileUtils.DOMAIN, FileUtils.TAG, 
        `读取文件失败: Code: ${err.code}, Message: ${err.message}`);
      const readError = new Error(`读取文件失败: ${err.message}`);
      throw readError;
    }
  }

  /**
   * 将文本内容写入用户文件 URI
   * @param uri 文档类 URI（从 DocumentViewPicker 返回）
   * @param text 要写入的文本内容
   */
  static async writeTextToUri(uri: string, text: string): Promise<void> {
    try {
      hilog.info(FileUtils.DOMAIN, FileUtils.TAG, `开始写入文件: ${uri}`);
      
      // 打开文件（读写模式 + 创建模式）
      // DocumentViewPicker save 返回的 URI 需要使用 READ_WRITE | CREATE 模式
      const file = fileIo.openSync(uri, fileIo.OpenMode.READ_WRITE | fileIo.OpenMode.CREATE);
      
      try {
        // 将字符串转换为 ArrayBuffer
        const buffer = FileUtils.stringToArrayBuffer(text);
        
        // 写入文件
        const writeLen = fileIo.writeSync(file.fd, buffer);
        
        hilog.info(FileUtils.DOMAIN, FileUtils.TAG, `文件写入成功: ${writeLen} bytes`);
      } finally {
        // 确保关闭文件
        fileIo.closeSync(file.fd);
      }
    } catch (error) {
      const err = error as BusinessError;
      hilog.error(FileUtils.DOMAIN, FileUtils.TAG, 
        `写入文件失败: Code: ${err.code}, Message: ${err.message}`);
      const writeError = new Error(`写入文件失败: ${err.message}`);
      throw writeError;
    }
  }

  /**
   * 将 Uint8Array 转换为字符串（UTF-8）
   */
  private static arrayBufferToString(uint8Array: Uint8Array): string {
    const decoder = new util.TextDecoder('utf-8', { ignoreBOM: true });
    return decoder.decodeWithStream(uint8Array, { stream: false });
  }

  /**
   * 将字符串转换为 ArrayBuffer（UTF-8）
   */
  private static stringToArrayBuffer(text: string): ArrayBuffer {
    const encoder = new util.TextEncoder();
    return encoder.encodeInto(text);
  }

  /**
   * 检查 URI 是否有效
   */
  static isValidUri(uri: string): boolean {
    if (!uri || uri.trim().length === 0) {
      return false;
    }
    // 文档类 URI 通常以 file:// 开头
    return uri.startsWith('file://');
  }

  /**
   * 从 URI 中提取文件名
   */
  static getFileNameFromUri(uri: string): string {
    try {
      const parts = uri.split('/');
      const fileName = parts[parts.length - 1];
      // 解码 URI 编码的文件名
      return decodeURIComponent(fileName);
    } catch (error) {
      hilog.warn(FileUtils.DOMAIN, FileUtils.TAG, `提取文件名失败: ${error}`);
      return 'unknown';
    }
  }
}
