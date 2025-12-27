/**
 * 智能解析结果
 */
export class ParseResult {
  title: string = '';
  date: Date | null = null;
  time: Date | null = null;
  isAllDay: boolean = false;
  location: string = '';
  hasDate: boolean = false;
  hasTime: boolean = false;
}

/**
 * 智能解析器
 * 解析自然语言输入，提取日程信息
 */
export class SmartParser {
  private static instance: SmartParser;

  private constructor() {}

  static getInstance(): SmartParser {
    if (!SmartParser.instance) {
      SmartParser.instance = new SmartParser();
    }
    return SmartParser.instance;
  }

  /**
   * 解析输入文本
   */
  parse(input: string): ParseResult {
    const result = new ParseResult();
    
    if (!input || input.trim().length === 0) {
      return result;
    }

    let text = input.trim();
    
    // 提取日期
    const dateResult = this.extractDate(text);
    if (dateResult.date !== null) {
      result.date = dateResult.date;
      result.hasDate = true;
      text = dateResult.remainingText;
    }
    
    // 提取时间
    const timeResult = this.extractTime(text);
    if (timeResult.time !== null) {
      result.time = timeResult.time;
      result.hasTime = true;
      text = timeResult.remainingText;
    }
    
    // 提取地点
    const locationResult = this.extractLocation(text);
    if (locationResult.location.length > 0) {
      result.location = locationResult.location;
      text = locationResult.remainingText;
    }
    
    // 剩余文本作为标题
    result.title = this.cleanTitle(text);
    
    // 如果有日期但没有时间，标记为全天事件
    if (result.hasDate && !result.hasTime) {
      result.isAllDay = true;
    }
    
    return result;
  }

  /**
   * 提取日期
   */
  private extractDate(text: string): DateExtractResult {
    const result = new DateExtractResult();
    result.remainingText = text;
    
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    
    // 今天
    if (text.includes('今天')) {
      result.date = new Date(year, month, day);
      result.remainingText = text.replace('今天', '');
      return result;
    }
    
    // 明天
    if (text.includes('明天')) {
      result.date = new Date(year, month, day + 1);
      result.remainingText = text.replace('明天', '');
      return result;
    }
    
    // 后天
    if (text.includes('后天')) {
      result.date = new Date(year, month, day + 2);
      result.remainingText = text.replace('后天', '');
      return result;
    }
    
    // 大后天
    if (text.includes('大后天')) {
      result.date = new Date(year, month, day + 3);
      result.remainingText = text.replace('大后天', '');
      return result;
    }
    
    // 周X / 星期X
    const weekdayResult = this.extractWeekday(text, today);
    if (weekdayResult.date !== null) {
      return weekdayResult;
    }
    
    // X月X日 / X月X号
    const monthDayResult = this.extractMonthDay(text, year);
    if (monthDayResult.date !== null) {
      return monthDayResult;
    }
    
    // YYYY年X月X日
    const fullDateResult = this.extractFullDate(text);
    if (fullDateResult.date !== null) {
      return fullDateResult;
    }
    
    return result;
  }

  /**
   * 提取周几
   */
  private extractWeekday(text: string, today: Date): DateExtractResult {
    const result = new DateExtractResult();
    result.remainingText = text;
    
    const weekdayMap: Map<string, number> = new Map();
    weekdayMap.set('周日', 0);
    weekdayMap.set('周天', 0);
    weekdayMap.set('星期日', 0);
    weekdayMap.set('星期天', 0);
    weekdayMap.set('周一', 1);
    weekdayMap.set('星期一', 1);
    weekdayMap.set('周二', 2);
    weekdayMap.set('星期二', 2);
    weekdayMap.set('周三', 3);
    weekdayMap.set('星期三', 3);
    weekdayMap.set('周四', 4);
    weekdayMap.set('星期四', 4);
    weekdayMap.set('周五', 5);
    weekdayMap.set('星期五', 5);
    weekdayMap.set('周六', 6);
    weekdayMap.set('星期六', 6);
    
    const keys = Array.from(weekdayMap.keys());
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (text.includes(key)) {
        const targetDay = weekdayMap.get(key);
        if (targetDay !== undefined) {
          const currentDay = today.getDay();
          let daysToAdd = targetDay - currentDay;
          if (daysToAdd <= 0) {
            daysToAdd += 7; // 下周
          }
          result.date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysToAdd);
          result.remainingText = text.replace(key, '');
          return result;
        }
      }
    }
    
    return result;
  }

  /**
   * 提取X月X日
   */
  private extractMonthDay(text: string, year: number): DateExtractResult {
    const result = new DateExtractResult();
    result.remainingText = text;
    
    // 匹配 X月X日 或 X月X号
    const patterns: string[] = ['月', '日', '号'];
    
    // 简单解析：查找数字+月+数字+日/号
    let monthStart = -1;
    let monthEnd = -1;
    let dayStart = -1;
    let dayEnd = -1;
    
    for (let i = 0; i < text.length; i++) {
      if (text.charAt(i) === '月') {
        monthEnd = i;
        // 向前找数字
        let j = i - 1;
        while (j >= 0 && this.isDigit(text.charAt(j))) {
          monthStart = j;
          j--;
        }
      }
      if (text.charAt(i) === '日' || text.charAt(i) === '号') {
        dayEnd = i;
        // 向前找数字
        let j = i - 1;
        while (j >= 0 && this.isDigit(text.charAt(j))) {
          dayStart = j;
          j--;
        }
      }
    }
    
    if (monthStart >= 0 && monthEnd > monthStart && dayStart >= 0 && dayEnd > dayStart) {
      const monthStr = text.substring(monthStart, monthEnd);
      const dayStr = text.substring(dayStart, dayEnd);
      const monthNum = parseInt(monthStr);
      const dayNum = parseInt(dayStr);
      
      if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31) {
        result.date = new Date(year, monthNum - 1, dayNum);
        // 移除匹配的部分
        const matchedPart = text.substring(monthStart, dayEnd + 1);
        result.remainingText = text.replace(matchedPart, '');
        return result;
      }
    }
    
    return result;
  }

  /**
   * 提取完整日期 YYYY年X月X日
   */
  private extractFullDate(text: string): DateExtractResult {
    const result = new DateExtractResult();
    result.remainingText = text;
    
    // 查找年份
    let yearStart = -1;
    let yearEnd = -1;
    
    for (let i = 0; i < text.length; i++) {
      if (text.charAt(i) === '年') {
        yearEnd = i;
        let j = i - 1;
        while (j >= 0 && this.isDigit(text.charAt(j))) {
          yearStart = j;
          j--;
        }
        break;
      }
    }
    
    if (yearStart >= 0 && yearEnd > yearStart) {
      const yearStr = text.substring(yearStart, yearEnd);
      const yearNum = parseInt(yearStr);
      
      if (yearNum >= 1900 && yearNum <= 2100) {
        // 继续解析月日
        const afterYear = text.substring(yearEnd + 1);
        const monthDayResult = this.extractMonthDay(afterYear, yearNum);
        if (monthDayResult.date !== null) {
          result.date = monthDayResult.date;
          const matchedPart = text.substring(yearStart, yearEnd + 1);
          result.remainingText = text.replace(matchedPart, '');
          result.remainingText = monthDayResult.remainingText;
          return result;
        }
      }
    }
    
    return result;
  }

  /**
   * 提取时间
   */
  private extractTime(text: string): TimeExtractResult {
    const result = new TimeExtractResult();
    result.remainingText = text;
    
    // 上午/下午X点
    const periodResult = this.extractPeriodTime(text);
    if (periodResult.time !== null) {
      return periodResult;
    }
    
    // X点X分 / X:XX
    const clockResult = this.extractClockTime(text);
    if (clockResult.time !== null) {
      return clockResult;
    }
    
    return result;
  }

  /**
   * 提取上午/下午时间
   */
  private extractPeriodTime(text: string): TimeExtractResult {
    const result = new TimeExtractResult();
    result.remainingText = text;
    
    let isPM = false;
    let periodIndex = -1;
    
    if (text.includes('下午')) {
      isPM = true;
      periodIndex = text.indexOf('下午');
    } else if (text.includes('晚上')) {
      isPM = true;
      periodIndex = text.indexOf('晚上');
    } else if (text.includes('上午')) {
      isPM = false;
      periodIndex = text.indexOf('上午');
    } else if (text.includes('早上')) {
      isPM = false;
      periodIndex = text.indexOf('早上');
    } else if (text.includes('中午')) {
      isPM = true;
      periodIndex = text.indexOf('中午');
    }
    
    if (periodIndex >= 0) {
      // 查找后面的数字+点
      const afterPeriod = text.substring(periodIndex + 2);
      let hourStart = -1;
      let hourEnd = -1;
      
      for (let i = 0; i < afterPeriod.length; i++) {
        if (this.isDigit(afterPeriod.charAt(i))) {
          if (hourStart < 0) hourStart = i;
          hourEnd = i + 1;
        } else if (afterPeriod.charAt(i) === '点' || afterPeriod.charAt(i) === ':') {
          break;
        } else if (hourStart >= 0) {
          break;
        }
      }
      
      if (hourStart >= 0) {
        const hourStr = afterPeriod.substring(hourStart, hourEnd);
        let hour = parseInt(hourStr);
        
        if (hour >= 1 && hour <= 12) {
          if (isPM && hour < 12) {
            hour += 12;
          } else if (!isPM && hour === 12) {
            hour = 0;
          }
          
          result.time = new Date(2000, 0, 1, hour, 0, 0);
          
          // 移除匹配部分
          const periodText = text.includes('下午') ? '下午' : 
                            text.includes('晚上') ? '晚上' :
                            text.includes('上午') ? '上午' :
                            text.includes('早上') ? '早上' : '中午';
          result.remainingText = text.replace(periodText, '');
          result.remainingText = result.remainingText.replace(hourStr + '点', '');
          result.remainingText = result.remainingText.replace(hourStr, '');
          
          return result;
        }
      }
    }
    
    return result;
  }

  /**
   * 提取X点X分格式时间
   */
  private extractClockTime(text: string): TimeExtractResult {
    const result = new TimeExtractResult();
    result.remainingText = text;
    
    // 查找X点
    let hourStart = -1;
    let hourEnd = -1;
    let pointIndex = -1;
    
    for (let i = 0; i < text.length; i++) {
      if (text.charAt(i) === '点') {
        pointIndex = i;
        let j = i - 1;
        while (j >= 0 && this.isDigit(text.charAt(j))) {
          hourStart = j;
          j--;
        }
        hourEnd = i;
        break;
      }
    }
    
    if (hourStart >= 0 && pointIndex > hourStart) {
      const hourStr = text.substring(hourStart, hourEnd);
      const hour = parseInt(hourStr);
      
      if (hour >= 0 && hour <= 23) {
        let minute = 0;
        let minuteEnd = pointIndex + 1;
        
        // 查找分钟
        const afterPoint = text.substring(pointIndex + 1);
        if (afterPoint.length > 0) {
          let minStart = -1;
          let minEnd = -1;
          
          for (let i = 0; i < afterPoint.length; i++) {
            if (this.isDigit(afterPoint.charAt(i))) {
              if (minStart < 0) minStart = i;
              minEnd = i + 1;
            } else if (afterPoint.charAt(i) === '分') {
              minuteEnd = pointIndex + 1 + i + 1;
              break;
            } else if (minStart >= 0) {
              break;
            }
          }
          
          if (minStart >= 0) {
            const minStr = afterPoint.substring(minStart, minEnd);
            minute = parseInt(minStr);
            if (minute < 0 || minute > 59) {
              minute = 0;
            }
          }
        }
        
        result.time = new Date(2000, 0, 1, hour, minute, 0);
        const matchedPart = text.substring(hourStart, minuteEnd);
        result.remainingText = text.replace(matchedPart, '');
        
        return result;
      }
    }
    
    // 尝试匹配 HH:MM 格式
    for (let i = 0; i < text.length - 2; i++) {
      if (text.charAt(i + 1) === ':' || text.charAt(i + 2) === ':') {
        const colonIndex = text.charAt(i + 1) === ':' ? i + 1 : i + 2;
        
        // 提取小时
        let hStart = colonIndex - 1;
        while (hStart > 0 && this.isDigit(text.charAt(hStart - 1))) {
          hStart--;
        }
        
        // 提取分钟
        let mEnd = colonIndex + 1;
        while (mEnd < text.length && this.isDigit(text.charAt(mEnd))) {
          mEnd++;
        }
        
        if (hStart < colonIndex && mEnd > colonIndex + 1) {
          const hStr = text.substring(hStart, colonIndex);
          const mStr = text.substring(colonIndex + 1, mEnd);
          const h = parseInt(hStr);
          const m = parseInt(mStr);
          
          if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
            result.time = new Date(2000, 0, 1, h, m, 0);
            const matchedPart = text.substring(hStart, mEnd);
            result.remainingText = text.replace(matchedPart, '');
            return result;
          }
        }
      }
    }
    
    return result;
  }

  /**
   * 提取地点
   */
  private extractLocation(text: string): LocationExtractResult {
    const result = new LocationExtractResult();
    result.remainingText = text;
    
    // 在XX / 地点：XX
    const locationPrefixes: string[] = ['在', '地点：', '地点:', '地址：', '地址:', '@'];
    
    for (let i = 0; i < locationPrefixes.length; i++) {
      const prefix = locationPrefixes[i];
      const index = text.indexOf(prefix);
      if (index >= 0) {
        const afterPrefix = text.substring(index + prefix.length);
        // 提取到下一个空格或结尾
        let endIndex = afterPrefix.length;
        for (let j = 0; j < afterPrefix.length; j++) {
          if (afterPrefix.charAt(j) === ' ' || afterPrefix.charAt(j) === '，' || afterPrefix.charAt(j) === ',') {
            endIndex = j;
            break;
          }
        }
        
        if (endIndex > 0) {
          result.location = afterPrefix.substring(0, endIndex).trim();
          const matchedPart = prefix + result.location;
          result.remainingText = text.replace(matchedPart, '');
          return result;
        }
      }
    }
    
    return result;
  }

  /**
   * 清理标题
   */
  private cleanTitle(text: string): string {
    let title = text.trim();
    
    // 移除多余空格
    while (title.includes('  ')) {
      title = title.replace('  ', ' ');
    }
    
    // 移除开头结尾的标点
    const punctuation = '，,。.、；;：:！!？?';
    while (title.length > 0 && punctuation.includes(title.charAt(0))) {
      title = title.substring(1);
    }
    while (title.length > 0 && punctuation.includes(title.charAt(title.length - 1))) {
      title = title.substring(0, title.length - 1);
    }
    
    return title.trim();
  }

  /**
   * 判断是否是数字字符
   */
  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }
}

/**
 * 日期提取结果
 */
class DateExtractResult {
  date: Date | null = null;
  remainingText: string = '';
}

/**
 * 时间提取结果
 */
class TimeExtractResult {
  time: Date | null = null;
  remainingText: string = '';
}

/**
 * 地点提取结果
 */
class LocationExtractResult {
  location: string = '';
  remainingText: string = '';
}
