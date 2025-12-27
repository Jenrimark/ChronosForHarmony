import { CalendarEvent } from '../../model/CalendarEvent';
import { MxnzpHolidayData } from '../../model/Holiday';
import { Constants } from '../../common/Constants';
import { TimelineRow } from './TimelineRow';
import { EventBlock } from './EventBlock';

/**
 * 日视图组件
 * 展示单日的详细时间轴视图
 */
@Component
export struct DayView {
  @Link selectedDate: Date;
  @Prop events: CalendarEvent[] = [];
  @Prop calendarInfo: MxnzpHolidayData | null = null;
  onEventTap: (event: CalendarEvent) => void = () => {};

  private today: Date = new Date();
  private hourHeight: number = 60;

  /**
   * 获取当天的事件
   */
  getTodayEvents(): CalendarEvent[] {
    return this.events.filter(event => this.isSameDay(event.startTime, this.selectedDate));
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
  isToday(): boolean {
    return this.isSameDay(this.selectedDate, this.today);
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
  formatDate(): string {
    const year = this.selectedDate.getFullYear();
    const month = this.selectedDate.getMonth() + 1;
    const day = this.selectedDate.getDate();
    return `${year}年${month}月${day}日`;
  }

  /**
   * 获取星期几
   */
  getWeekDay(): string {
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return weekDays[this.selectedDate.getDay()];
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
      // 日期信息头部
      Column() {
        Row() {
          Column() {
            // 公历日期
            Text(this.formatDate())
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .fontColor(Constants.COLOR_TEXT_PRIMARY)
            
            // 星期
            Text(this.getWeekDay())
              .fontSize(14)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
              .margin({ top: 4 })
          }
          .alignItems(HorizontalAlign.Start)

          Blank()

          // 农历信息
          if (this.calendarInfo) {
            Column() {
              Text(this.calendarInfo.lunarCalendar || '')
                .fontSize(14)
                .fontColor(Constants.COLOR_TEXT_PRIMARY)
              
              Row() {
                if (this.calendarInfo.yearTips) {
                  Text(`${this.calendarInfo.yearTips}年`)
                    .fontSize(12)
                    .fontColor(Constants.COLOR_TEXT_SECONDARY)
                }
                if (this.calendarInfo.chineseZodiac) {
                  Text(`${this.calendarInfo.chineseZodiac}`)
                    .fontSize(12)
                    .fontColor(Constants.COLOR_TEXT_SECONDARY)
                    .margin({ left: 8 })
                }
              }
              .margin({ top: 4 })
            }
            .alignItems(HorizontalAlign.End)
          }
        }
        .width('100%')

        // 节气和星座
        if (this.calendarInfo) {
          Row() {
            if (this.calendarInfo.solarTerms && this.calendarInfo.solarTerms !== '无') {
              Text(`🌿 ${this.calendarInfo.solarTerms}`)
                .fontSize(12)
                .fontColor(Constants.COLOR_SUCCESS)
            }
            if (this.calendarInfo.constellation) {
              Text(`⭐ ${this.calendarInfo.constellation}`)
                .fontSize(12)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
                .margin({ left: 12 })
            }
          }
          .width('100%')
          .margin({ top: 8 })
        }

        // 今日标记
        if (this.isToday()) {
          Text('今天')
            .fontSize(12)
            .fontColor('#FFFFFF')
            .backgroundColor(Constants.COLOR_PRIMARY)
            .padding({ left: 8, right: 8, top: 4, bottom: 4 })
            .borderRadius(12)
            .margin({ top: 8 })
        }
      }
      .width('100%')
      .padding(16)
      .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
      .borderRadius({ bottomLeft: 16, bottomRight: 16 })

      // 时间轴滚动区域
      Scroll() {
        Stack() {
          // 时间刻度行
          Column() {
            ForEach(this.getHours(), (hour: number) => {
              TimelineRow({
                hour: hour,
                showCurrentTimeLine: this.isToday() && hour === this.getCurrentHour(),
                currentMinute: this.getCurrentMinute()
              })
            })
            // 底部留白给导航栏
            Row()
              .width('100%')
              .height(80)
          }
          .width('100%')

          // 事件块
          ForEach(this.getTodayEvents(), (event: CalendarEvent) => {
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
      .margin({ top: 8 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Constants.COLOR_BACKGROUND)
  }
}
