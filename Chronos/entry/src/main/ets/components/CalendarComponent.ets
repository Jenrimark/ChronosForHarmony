import { Utils } from '../common/Utils';
import { Constants } from '../common/Constants';
import { Task } from '../model/Task';
import { Holiday } from '../model/Holiday';

/**
 * 日历组件
 */
@Component
export struct CalendarComponent {
  @Prop selectedDate: Date = new Date();
  @Prop tasks: Task[] = [];
  @Prop holidays: Holiday[] = [];
  @Link selectedDateChanged: Date;
  @Link monthChangeTrigger: number;

  @State currentMonth: Date = new Date();
  @State calendarDays: Date[] = [];
  private lastMonthKey: number = 0;

  aboutToAppear() {
    const monthKey = this.currentMonth.getFullYear() * 100 + this.currentMonth.getMonth();
    this.lastMonthKey = monthKey;
    this.updateCalendarDays();
  }

  /**
   * 更新日历天数
   */
  updateCalendarDays(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // 周一为0

    const days: Date[] = [];
    
    // 填充上个月的日期
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonthLastDay - i));
    }

    // 填充当前月的日期
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    // 填充下个月的日期（补齐42天）
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    this.calendarDays = days;
  }

  /**
   * 获取日期对应的任务数量
   */
  getTaskCountForDate(date: Date): number {
    return this.tasks.filter(task => {
      if (!task.dueDate) return false;
      return Utils.isSameDay(date, task.dueDate);
    }).length;
  }

  /**
   * 获取日期对应的节假日
   */
  getHolidaysForDate(date: Date): Holiday[] {
    return this.holidays.filter(holiday => {
      return Utils.isSameDay(date, holiday.date);
    });
  }

  /**
   * 判断日期是否有节假日
   */
  hasHoliday(date: Date): boolean {
    return this.getHolidaysForDate(date).length > 0;
  }

  /**
   * 获取节假日的显示名称（取第一个）
   */
  getHolidayName(date: Date): string {
    const holidays = this.getHolidaysForDate(date);
    if (holidays.length > 0) {
      return holidays[0].name;
    }
    return '';
  }

  /**
   * 判断日期是否是今天
   */
  isToday(date: Date): boolean {
    return Utils.isSameDay(date, new Date());
  }

  /**
   * 判断日期是否被选中
   */
  isSelected(date: Date): boolean {
    return Utils.isSameDay(date, this.selectedDate);
  }

  /**
   * 判断日期是否是当前月
   */
  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentMonth.getMonth() &&
      date.getFullYear() === this.currentMonth.getFullYear();
  }

  /**
   * 上一个月
   */
  prevMonth(): void {
    const newDate = new Date(this.currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    this.currentMonth = newDate;
    const monthKey = this.currentMonth.getFullYear() * 100 + this.currentMonth.getMonth();
    if (monthKey !== this.lastMonthKey) {
      this.lastMonthKey = monthKey;
      // 编码月份信息：year*10000 + month*100
      this.monthChangeTrigger = this.currentMonth.getFullYear() * 10000 + this.currentMonth.getMonth() * 100;
    }
    this.updateCalendarDays();
  }

  /**
   * 下一个月
   */
  nextMonth(): void {
    const newDate = new Date(this.currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    this.currentMonth = newDate;
    const monthKey = this.currentMonth.getFullYear() * 100 + this.currentMonth.getMonth();
    if (monthKey !== this.lastMonthKey) {
      this.lastMonthKey = monthKey;
      // 编码月份信息：year*10000 + month*100
      this.monthChangeTrigger = this.currentMonth.getFullYear() * 10000 + this.currentMonth.getMonth() * 100;
    }
    this.updateCalendarDays();
  }

  /**
   * 选择日期
   */
  selectDate(date: Date): void {
    this.selectedDateChanged = date;
  }

  build() {
    Column() {
      // 月份导航栏
      Row() {
        Text('<')
          .fontSize(20)
          .fontColor(Constants.COLOR_PRIMARY)
          .fontWeight(FontWeight.Bold)
          .width(40)
          .height(40)
          .textAlign(TextAlign.Center)
          .onClick(() => this.prevMonth())

        Text(`${this.currentMonth.getFullYear()}年${this.currentMonth.getMonth() + 1}月`)
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
          .layoutWeight(1)
          .textAlign(TextAlign.Center)

        Text('>')
          .fontSize(20)
          .fontColor(Constants.COLOR_PRIMARY)
          .fontWeight(FontWeight.Bold)
          .width(40)
          .height(40)
          .textAlign(TextAlign.Center)
          .onClick(() => this.nextMonth())
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 8, bottom: 8 })

      // 星期标题
      Row() {
        ForEach(['一', '二', '三', '四', '五', '六', '日'], (day: string) => {
          Text(day)
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .layoutWeight(1)
            .textAlign(TextAlign.Center)
        })
      }
      .width('100%')
      .padding({ left: 8, right: 8, bottom: 8 })

      // 日历网格
      Grid() {
        ForEach(this.calendarDays, (date: Date, index: number) => {
          GridItem() {
            Column() {
              Text(date.getDate().toString())
                .fontSize(14)
                .fontColor(
                  this.isCurrentMonth(date)
                    ? (this.isToday(date) ? Constants.COLOR_TEXT_ON_PRIMARY : Constants.COLOR_TEXT_PRIMARY)
                    : Constants.COLOR_TEXT_SECONDARY
                )
                .fontWeight(this.isToday(date) ? FontWeight.Bold : FontWeight.Normal)

              if (this.hasHoliday(date)) {
                Text(this.getHolidayName(date))
                  .fontSize(9)
                  .fontColor(Constants.COLOR_PRIMARY_LIGHT)
                  .maxLines(1)
                  .textOverflow({ overflow: TextOverflow.Ellipsis })
                  .margin({ top: 2 })
              }

              if (this.getTaskCountForDate(date) > 0) {
                Text(this.getTaskCountForDate(date).toString())
                  .fontSize(10)
                  .fontColor(Constants.COLOR_PRIMARY)
                  .margin({ top: 2 })
              }
            }
            .width('100%')
            .height('100%')
            .justifyContent(FlexAlign.Center)
            .backgroundColor(
              this.isSelected(date)
                ? Constants.COLOR_PRIMARY
                : (this.isToday(date) ? Constants.COLOR_PRIMARY : Color.Transparent)
            )
            .borderRadius(4)
            .onClick(() => {
              if (this.isCurrentMonth(date)) {
                this.selectDate(date);
              }
            })
          }
        })
      }
      .columnsTemplate('1fr 1fr 1fr 1fr 1fr 1fr 1fr')
      .rowsTemplate('1fr 1fr 1fr 1fr 1fr 1fr')
      .width('100%')
      .height(300)
      .padding({ left: 8, right: 8 })
    }
    .width('100%')
  }
}
