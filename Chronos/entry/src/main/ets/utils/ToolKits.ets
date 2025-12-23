import { promptAction } from "@kit.ArkUI";

/**
 * 工具类
 * 参考harmonychat-main项目的工具类实现
 */
export default class ToolKits {
  /**
   * 仿照微信中的消息时间显示逻辑，将时间戳转换为友好的显示格式
   * 
   * @param timestamp 时间戳（单位：毫秒）
   * @param mustIncludeTime true表示输出的格式里一定会包含"时间:分钟"
   * @param timeWithSegmentStr 表示在时间字符串前带上"上午"、"下午"、"晚上"这样的描述
   * @return 输出格式形如："刚刚"、"10:30"、"昨天 12:04"、"前天 20:51"、"星期二"、"2019/2/21 12:09"等形式
   */
  static getTimeStringAutoShort2(timestamp: number, mustIncludeTime: boolean, timeWithSegmentStr: boolean): string {
    // 当前时间
    let currentDate: Date = new Date();
    // 目标判断时间
    let srcDate: Date = new Date(timestamp);

    let currentYear: number = currentDate.getFullYear();
    let currentMonth: number = (currentDate.getMonth() + 1);
    let currentDateD: number = currentDate.getDate();

    let srcYear: number = srcDate.getFullYear();
    let srcMonth: number = (srcDate.getMonth() + 1);
    let srcDateD: number = srcDate.getDate();

    let ret: string = '';

    // 要额外显示的时间分钟
    let timeExtraStr = '';
    if (mustIncludeTime) {
      timeExtraStr = " " + ToolKits.getTimeHH24Human(srcDate, timeWithSegmentStr);
    }

    // 当年
    if (currentYear === srcYear) {
      let currentTimestamp: number = currentDate.getTime();
      let srcTimestamp: number = timestamp;
      // 相差时间（单位：毫秒）
      let deltaTime: number = (currentTimestamp - srcTimestamp);

      // 当天（月份和日期一致才是）
      if (currentMonth === srcMonth && currentDateD === srcDateD) {
        // 当天只需要显示时间分钟，且必须显示"上午"、"下午"这样的时间段描述
        ret = ToolKits.getTimeHH24Human(srcDate, true);
      }
      // 当年 && 当天之外的时间（即昨天及以前的时间）
      else {
        // 昨天（以"现在"的时候为基准-1天）
        let yesterdayDate: Date = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);

        // 前天（以"现在"的时候为基准-2天）
        let beforeYesterdayDate: Date = new Date();
        beforeYesterdayDate.setDate(beforeYesterdayDate.getDate() - 2);

        if (srcMonth === (yesterdayDate.getMonth() + 1) && srcDateD === yesterdayDate.getDate()) {
          ret = "昨天" + timeExtraStr;
        }
        // "前天"判断逻辑同上
        else if (srcMonth === (beforeYesterdayDate.getMonth() + 1) && srcDateD === beforeYesterdayDate.getDate()) {
          ret = "前天" + timeExtraStr;
        } else {
          // 跟当前时间相差的小时数
          let deltaHour: number = (deltaTime / (3600 * 1000));

          // 如果小于或等 7*24小时就显示星期几
          if (deltaHour <= 7 * 24) {
            let weekday = new Array<string>(7);
            weekday[0] = "星期日";
            weekday[1] = "星期一";
            weekday[2] = "星期二";
            weekday[3] = "星期三";
            weekday[4] = "星期四";
            weekday[5] = "星期五";
            weekday[6] = "星期六";

            // 取出当前是星期几
            let weedayDesc: string = weekday[srcDate.getDay()];
            ret = weedayDesc + timeExtraStr;
          }
          // 否则直接显示完整日期时间
          else
            ret = ToolKits.formatDate(srcDate, "M月d日") + timeExtraStr;
        }
      }
    }
    // 往年
    else {
      ret = ToolKits.formatDate(srcDate, "yy年M月d日") + timeExtraStr;
    }

    return ret;
  }

  /**
   * 获取仅包含"时间:分钟"部分的字符串，24小时制，且可以显示"上午"、"下午"、"晚上"这样的描述
   */
  static getTimeHH24Human(srcDateObj: Date, timeWithSegmentStr: boolean): string {
    let ret: string = '';
    try {
      let timePattern: string = 'hh:mm';
      // 原始的时间分钟字符串
      let timeStr: string = ToolKits.formatDate(srcDateObj, timePattern);

      // 时间段描述（形如："上午"、"下午"、"晚上"这样的描述），只在中文语言下生效
      let timeSegmentStr: string = '';
      if (timeWithSegmentStr)
        timeSegmentStr = ToolKits.getTimeSegmentStr(timeStr);

      // 组合成最终的人性化时间分钟字符串形式
      ret = timeSegmentStr + timeStr;
    } catch (e) {
      console.warn("【getTimeHH24Human】计算出错：" + JSON.stringify(e));
    }

    return ret;
  }

  /**
   * 将一个两位24小时时间的转换为上午、下午这样的描述
   */
  static getTimeSegmentStr(hh24: string): string {
    let ret: string = '';
    if (hh24 && hh24.length >= 2) {
      try {
        // 取出"小时"部分
        let a = parseInt(hh24.substring(0, 2));
        if (a >= 0 && a <= 6) {
          ret = "凌晨";
        } else if (a > 6 && a <= 12) {
          ret = "上午";
        } else if (a > 12 && a <= 13) {
          ret = "中午";
        } else if (a > 13 && a <= 18) {
          ret = "下午";
        } else if (a > 18 && a <= 24) {
          ret = "晚上";
        }
      } catch (e) {
        console.warn("【getTimeSegmentStr】计算出错：" + JSON.stringify(e));
      }
    }

    return ret;
  }

  /**
   * 对Date的扩展，将 Date 转化为指定格式的String
   * 
   * @param date Date对象
   * @param fmt 格式字符串
   * @return 格式化的字符串
   */
  static formatDate(date: Date, fmt: string): string {
    let map = new Map<String, Number>();
    map.set("M+", date.getMonth() + 1); // 月份
    map.set("d+", date.getDate()); // 日
    map.set("h+", date.getHours()); // 小时
    map.set("m+", date.getMinutes()); // 分
    map.set("s+", date.getSeconds()); // 秒
    map.set("q+", Math.floor((date.getMonth() + 3) / 3)); // 季度
    map.set("S", date.getMilliseconds()); // 毫秒

    let yearMatcher = /(y+)/.exec(fmt);
    if (yearMatcher && yearMatcher.length > 0) {
      let match = yearMatcher[0];
      fmt = fmt.replace(match, (date.getFullYear() + "").substr(4 - match.length));
    }

    map.forEach((value, key) => {
      let matcher = new RegExp(`(${key})`).exec(fmt);
      if (matcher && matcher.length > 0) {
        let match = matcher[0];
        let replaceValue = '';
        if ((match.length == 1)) {
          replaceValue = `${value}`;
        } else {
          replaceValue = (("00" + value).substr(("" + value).length));
        }
        fmt = fmt.replace(match, replaceValue);
      }
    });

    return fmt;
  }

  /**
   * 显示Toast提示
   */
  static showToast(message: string, duration: number = 1500) {
    try {
      promptAction.showToast({
        message: message,
        duration: duration,
        showMode: promptAction.ToastShowMode.TOP_MOST
      });
    } catch (e) {
      console.warn("【showToast】显示Toast失败：" + JSON.stringify(e));
    }
  }
}

