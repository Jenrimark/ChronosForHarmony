import { CalendarEvent, ReminderType, RepeatRule } from '../model/CalendarEvent';
import { EventService } from './EventService';
import ToolKits from '../utils/ToolKits';
import { FileUtils } from '../utils/FileUtils';
import { hilog } from '@kit.PerformanceAnalysisKit';

/**
 * iCalendar 日期时间解析结果
 */
interface ICSDateInfo {
  date: Date;
  isAllDay: boolean;
}

/**
 * 日程导入导出服务（iCalendar .ics）
 * 说明：
 * - 导出：将当前所有日程转换为标准 iCalendar 文本（.ics）
 * - 导入：从 .ics 文本解析出 VEVENT，批量写入本地日程
 *
 * 该服务不直接处理文件选择/保存，只负责字符串与事件之间的转换，
 * 具体文件读写由调用方（如设置页或 Ability）决定。
 */
export class EventImportExportService {
  private static instance: EventImportExportService;
  private eventService: EventService = EventService.getInstance();
  private static readonly TAG = 'EventImportExportService';
  private static readonly DOMAIN = 0x0000;

  static getInstance(): EventImportExportService {
    if (!EventImportExportService.instance) {
      EventImportExportService.instance = new EventImportExportService();
    }
    return EventImportExportService.instance;
  }

  /**
   * 导出当前所有日程为 iCalendar (.ics) 文本
   */
  async exportAllEventsToICS(): Promise<string> {
    const events: CalendarEvent[] = await this.eventService.getAllEvents();
    return this.buildICS(events);
  }

  /**
   * 从 iCalendar (.ics) 文本导入日程
   * @param icsText 完整 .ics 文本
   * @returns 实际成功导入的事件数量
   */
  async importFromICS(icsText: string): Promise<number> {
    const events: CalendarEvent[] = this.parseICS(icsText);
    let count: number = 0;
    for (const ev of events) {
      const id: number = await this.eventService.createEvent(ev);
      if (id > 0) {
        count++;
      }
    }
    ToolKits.showToast(`已从 .ics 导入 ${count} 条日程`);
    return count;
  }

  /**
   * 构建 iCalendar 文本
   */
  private buildICS(events: CalendarEvent[]): string {
    const lines: string[] = [];
    lines.push('BEGIN:VCALENDAR');
    lines.push('VERSION:2.0');
    lines.push('PRODID:-//Chronos//Chronos Calendar//CN');
    lines.push('CALSCALE:GREGORIAN');

    events.forEach((event: CalendarEvent) => {
      lines.push('BEGIN:VEVENT');

      // UID：使用应用内唯一ID，方便去重
      const uid: string = `chronos-${event.id || new Date().getTime()}`;
      lines.push(`UID:${uid}`);

      // 标题
      const summary: string = this.escapeText(event.title || '');
      if (summary.length > 0) {
        lines.push(`SUMMARY:${summary}`);
      }

      // 地点
      const location: string = this.escapeText(event.location || '');
      if (location.length > 0) {
        lines.push(`LOCATION:${location}`);
      }

      // 备注：简单把重复规则、重要性等编码到 DESCRIPTION 中
      const descParts: string[] = [];
      if (event.priority) {
        descParts.push('[重要]');
      }
      if (event.repeatRule && event.repeatRule !== RepeatRule.NONE) {
        descParts.push(`[重复:${event.repeatRule}]`);
      }
      if (event.reminder && event.reminder !== ReminderType.NONE) {
        descParts.push(`[提醒:${event.reminder}]`);
      }
      if (descParts.length > 0) {
        lines.push(`DESCRIPTION:${this.escapeText(descParts.join(' '))}`);
      }

      // 起止时间
      lines.push(`DTSTART:${this.formatICSDateTime(event.startTime, event.isAllDay)}`);
      lines.push(`DTEND:${this.formatICSDateTime(event.endTime, event.isAllDay)}`);

      lines.push('END:VEVENT');
    });

    lines.push('END:VCALENDAR');
    const ics: string = lines.join('\r\n');
    console.info('EventImportExportService: 导出 .ics 内容:\n' + ics);
    ToolKits.showToast(`已导出 ${events.length} 条日程为 .ics 文本（详见日志）`);
    return ics;
  }

  /**
   * 解析 iCalendar 文本为 CalendarEvent 数组（简化版）
   */
  private parseICS(icsText: string): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    const lines: string[] = icsText.split(/\r?\n/);

    let inEvent: boolean = false;
    let current: Record<string, string> = {};

    lines.forEach((rawLine: string) => {
      const line: string = rawLine.trim();
      if (line === 'BEGIN:VEVENT') {
        inEvent = true;
        current = {};
        return;
      }
      if (line === 'END:VEVENT') {
        if (inEvent) {
          const ev: CalendarEvent | null = this.buildEventFromFields(current);
          if (ev && ev.isValid()) {
            events.push(ev);
          }
        }
        inEvent = false;
        current = {};
        return;
      }
      if (!inEvent || line.length === 0) {
        return;
      }

      const idx: number = line.indexOf(':');
      if (idx <= 0) {
        return;
      }
      const keyPart: string = line.substring(0, idx);
      const value: string = line.substring(idx + 1);

      // 处理带参数的键，如 DTSTART;TZID=...
      const keySegments: string[] = keyPart.split(';');
      const key: string = keySegments[0].toUpperCase();
      current[key] = value;
    });

    console.info(`EventImportExportService: 从 .ics 解析出 ${events.length} 条事件`);
    return events;
  }

  /**
   * 将字段字典转换为 CalendarEvent
   */
  private buildEventFromFields(fields: Record<string, string>): CalendarEvent | null {
    const event: CalendarEvent = new CalendarEvent();

    const summary: string | undefined = fields['SUMMARY'];
    if (summary && summary.length > 0) {
      event.title = this.unescapeText(summary);
    }

    const location: string | undefined = fields['LOCATION'];
    if (location && location.length > 0) {
      event.location = this.unescapeText(location);
    }

    const dtStartRaw: string | undefined = fields['DTSTART'];
    const dtEndRaw: string | undefined = fields['DTEND'];

    if (!dtStartRaw) {
      return null;
    }

    const startInfo = this.parseICSDateTime(dtStartRaw);
    const endInfo = dtEndRaw ? this.parseICSDateTime(dtEndRaw) : null;

    event.isAllDay = startInfo.isAllDay;
    event.startTime = startInfo.date;
    if (endInfo) {
      event.endTime = endInfo.date;
    } else {
      // 没有结束时间时，默认 1 小时
      const endDate: Date = new Date(startInfo.date);
      endDate.setHours(endDate.getHours() + 1);
      event.endTime = endDate;
    }

    // 导入的默认配置
    event.reminder = ReminderType.NONE;
    event.repeatRule = RepeatRule.NONE;
    event.priority = false;
    event.calendarId = 1;

    // 时间戳按当前时间填写
    const now: Date = new Date();
    event.createdAt = now;
    event.updatedAt = now;

    return event;
  }

  /**
   * 格式化为 iCalendar 日期时间
   * - 全天事件：YYYYMMDD
   * - 非全天：YYYYMMDDTHHMMSS（本地时间）
   */
  private formatICSDateTime(date: Date, isAllDay: boolean): string {
    const y: number = date.getFullYear();
    const m: number = date.getMonth() + 1;
    const d: number = date.getDate();
    const hh: number = date.getHours();
    const mm: number = date.getMinutes();
    const ss: number = date.getSeconds();

    const pad = (n: number): string => (n < 10 ? '0' + n : '' + n);

    if (isAllDay) {
      return `${y}${pad(m)}${pad(d)}`;
    }
    return `${y}${pad(m)}${pad(d)}T${pad(hh)}${pad(mm)}${pad(ss)}`;
  }

  /**
   * 解析 iCalendar 日期时间（简化版，不处理时区/Z）
   */
  private parseICSDateTime(value: string): ICSDateInfo {
    const trimmed: string = value.trim();
    // 全天：YYYYMMDD
    if (trimmed.length === 8) {
      const year: number = Number.parseInt(trimmed.substring(0, 4));
      const month: number = Number.parseInt(trimmed.substring(4, 6)) - 1;
      const day: number = Number.parseInt(trimmed.substring(6, 8));
      const info: ICSDateInfo = { date: new Date(year, month, day, 0, 0, 0), isAllDay: true };
      return info;
    }

    // 日期时间：YYYYMMDDTHHMMSS 或 YYYYMMDDTHHMMSSZ
    const tIndex: number = trimmed.indexOf('T');
    if (tIndex === 8) {
      const datePart: string = trimmed.substring(0, 8);
      const timePart: string = trimmed.substring(9, 15); // 忽略末尾的 Z

      const year: number = Number.parseInt(datePart.substring(0, 4));
      const month: number = Number.parseInt(datePart.substring(4, 6)) - 1;
      const day: number = Number.parseInt(datePart.substring(6, 8));

      const hour: number = Number.parseInt(timePart.substring(0, 2));
      const minute: number = Number.parseInt(timePart.substring(2, 4));
      const second: number = Number.parseInt(timePart.substring(4, 6));

      const info: ICSDateInfo = { date: new Date(year, month, day, hour, minute, second), isAllDay: false };
      return info;
    }

    // 兜底：当前时间
    const fallback: ICSDateInfo = { date: new Date(), isAllDay: false };
    return fallback;
  }

  /**
   * 文本转义：处理逗号、分号、换行等
   */
  private escapeText(text: string): string {
    let result: string = text.replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;');
    return result;
  }

  /**
   * 反转义文本
   */
  private unescapeText(text: string): string {
    let result: string = text.replace(/\\n/g, '\n')
      .replace(/\\,/g, ',')
      .replace(/\\;/g, ';')
      .replace(/\\\\/g, '\\');
    return result;
  }

  /**
   * 从文件 URI 导入 .ics 日程
   * @param uri 文档类 URI（从 DocumentViewPicker 返回）
   * @returns 实际成功导入的事件数量
   */
  async importFromICSFile(uri: string): Promise<number> {
    try {
      hilog.info(EventImportExportService.DOMAIN, EventImportExportService.TAG, 
        `开始从文件导入: ${uri}`);
      
      // 验证 URI
      if (!FileUtils.isValidUri(uri)) {
        const invalidUriError = new Error('无效的文件 URI');
        throw invalidUriError;
      }
      
      // 读取文件内容
      const icsText = await FileUtils.readTextFromUri(uri);
      
      if (!icsText || icsText.trim().length === 0) {
        const emptyContentError = new Error('文件内容为空');
        throw emptyContentError;
      }
      
      hilog.info(EventImportExportService.DOMAIN, EventImportExportService.TAG, 
        `文件内容长度: ${icsText.length}`);
      
      // 解析并导入
      const count = await this.importFromICS(icsText);
      
      hilog.info(EventImportExportService.DOMAIN, EventImportExportService.TAG, 
        `成功导入 ${count} 条日程`);
      
      return count;
    } catch (error) {
      const err = error as Error;
      hilog.error(EventImportExportService.DOMAIN, EventImportExportService.TAG, 
        `导入失败: ${err.message}`);
      const importError = new Error(`导入失败: ${err.message}`);
      throw importError;
    }
  }

  /**
   * 导出所有日程到文件 URI
   * @param uri 文档类 URI（从 DocumentViewPicker 返回）
   */
  async exportToICSFile(uri: string): Promise<void> {
    try {
      hilog.info(EventImportExportService.DOMAIN, EventImportExportService.TAG, 
        `开始导出到文件: ${uri}`);
      
      // 验证 URI
      if (!FileUtils.isValidUri(uri)) {
        const invalidUriError = new Error('无效的文件 URI');
        throw invalidUriError;
      }
      
      // 生成 .ics 内容
      const icsText = await this.exportAllEventsToICS();
      
      // 写入文件
      await FileUtils.writeTextToUri(uri, icsText);
      
      hilog.info(EventImportExportService.DOMAIN, EventImportExportService.TAG, 
        '导出成功');
      
      ToolKits.showToast('日程已导出到文件');
    } catch (error) {
      const err = error as Error;
      hilog.error(EventImportExportService.DOMAIN, EventImportExportService.TAG, 
        `导出失败: ${err.message}`);
      const exportError = new Error(`导出失败: ${err.message}`);
      throw exportError;
    }
  }
}

