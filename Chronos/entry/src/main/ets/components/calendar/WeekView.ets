import { CalendarEvent } from '../../model/CalendarEvent';
import { Constants } from '../../common/Constants';
import { TimelineRow } from './TimelineRow';
import { EventBlock } from './EventBlock';

/**
 * 周视图组件
 * 展示一周的时间轴视图
 */
@Component
export struct WeekView {
  @Link selectedDate: Date;
  @Prop events: CalendarEvent[] = [];
  onEventTap: (event: CalendarEvent) => void = () => {};
  onDateSelect: (date: Date) => void = () => {};

  private today: Date = new Date();
  private hourHeight: number = 60;
  private weekDays: string[] = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  /**
   * 获取本周的日期数组
   */
  getWeekDates(): Date[] {
    const dates: Date[] = [];
    const current = new Date(this.selectedDate);
    const dayOfWeek = current.getDay();
    
    // 找到本周日（周的开始）
    const sunday = new Date(current);
    sunday.setDate(current.getDate() - dayOfWeek);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  }

  /**
   * 获取指定日期的事件
   */
  getEventsForDate(date: Date): CalendarEvent[] {
    return this.events.filter(event => this.isSameDay(event.startTime, date));
  }

  /**
   * 判断是否同一天
   */
  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  /**
   * 判断是否今天
   */
  isToday(date: Date): boolean {
    return this.isSameDay(date, this.today);
  }

  /**
   * 判断是否选中日期
   */
  isSelected(date: Date): boolean {
    return this.isSameDay(date, this.selectedDate);
  }

  /**
   * 获取当前小时
   */
  getCurrentHour(): number {
    return this.today.getHours();
  }

  /**
   * 获取当前分钟
   */
  getCurrentMinute(): number {
    return this.today.getMinutes();
  }

  /**
   * 格式化日期显示
   */
  formatDateHeader(date: Date): string {
    return `${date.getDate()}`;
  }

  /**
   * 生成24小时数组
   */
  getHours(): number[] {
    const hours: number[] = [];
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }
    return hours;
  }

  build() {
    Column() {
      // 周日期头部
      Row() {
        // 时间列占位
        Column()
          .width(45)

        // 7天日期
        ForEach(this.getWeekDates(), (date: Date, index: number) => {
          Column() {
            Text(this.weekDays[index])
              .fontSize(11)
              .fontColor(this.isToday(date) ? Constants.COLOR_PRIMARY : Constants.COLOR_TEXT_SECONDARY)
            
            Text(this.formatDateHeader(date))
              .fontSize(16)
              .fontWeight(this.isToday(date) ? FontWeight.Bold : FontWeight.Normal)
              .fontColor(this.isToday(date) ? '#FFFFFF' : Constants.COLOR_TEXT_PRIMARY)
              .width(28)
              .height(28)
              .textAlign(TextAlign.Center)
              .backgroundColor(this.isToday(date) ? Constants.COLOR_PRIMARY : Color.Transparent)
              .borderRadius(14)
              .margin({ top: 4 })
          }
          .layoutWeight(1)
          .onClick(() => {
            this.onDateSelect(date);
          })
        })
      }
      .width('100%')
      .padding({ top: 8, bottom: 8, left: 8, right: 8 })
      .backgroundColor(Constants.COLOR_CARD_BACKGROUND)

      // 时间轴滚动区域
      Scroll() {
        Stack() {
          // 时间刻度行
          Column() {
            ForEach(this.getHours(), (hour: number) => {
              TimelineRow({
                hour: hour,
                showCurrentTimeLine: hour === this.getCurrentHour(),
                currentMinute: this.getCurrentMinute()
              })
            })
            // 底部留白给导航栏
            Row()
              .width('100%')
              .height(80)
          }
          .width('100%')

          // 事件块（简化版：只显示选中日期的事件）
          ForEach(this.getEventsForDate(this.selectedDate), (event: CalendarEvent) => {
            EventBlock({
              event: event,
              hourHeight: this.hourHeight,
              onEventTap: this.onEventTap
            })
          })
        }
        .width('100%')
      }
      .layoutWeight(1)
      .scrollBar(BarState.Off)
      .edgeEffect(EdgeEffect.Spring)
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Constants.COLOR_BACKGROUND)
  }
}
