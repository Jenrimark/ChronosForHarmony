import { Constants } from '../../common/Constants';

/**
 * 迷你月份数据
 */
class MiniMonthData {
  year: number = 0;
  month: number = 0; // 0-11
  days: MiniDayData[] = [];
}

/**
 * 迷你日期数据
 */
class MiniDayData {
  day: number = 0;
  isCurrentMonth: boolean = true;
  isToday: boolean = false;
  isWeekend: boolean = false;
}

/**
 * 年视图组件
 * 展示12个月的缩略概览
 */
@Component
export struct YearView {
  @Prop currentYear: number = new Date().getFullYear();
  @Link selectedDate: Date;
  onMonthSelect: (year: number, month: number) => void = () => {};

  private today: Date = new Date();
  private monthNames: string[] = ['一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'];
  private weekDays: string[] = ['日', '一', '二', '三', '四', '五', '六'];

  /**
   * 生成12个月的数据
   */
  getMonthsData(): MiniMonthData[] {
    const months: MiniMonthData[] = [];
    for (let m = 0; m < 12; m++) {
      const monthData = new MiniMonthData();
      monthData.year = this.currentYear;
      monthData.month = m;
      monthData.days = this.generateMonthDays(this.currentYear, m);
      months.push(monthData);
    }
    return months;
  }

  /**
   * 生成单月的日期数据
   */
  generateMonthDays(year: number, month: number): MiniDayData[] {
    const days: MiniDayData[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayWeek = firstDay.getDay();
    
    // 上月填充
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayWeek - 1; i >= 0; i--) {
      const dayData = new MiniDayData();
      dayData.day = prevMonthLastDay - i;
      dayData.isCurrentMonth = false;
      dayData.isToday = false;
      dayData.isWeekend = false;
      days.push(dayData);
    }
    
    // 当月日期
    const daysInMonth = lastDay.getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dayData = new MiniDayData();
      dayData.day = d;
      dayData.isCurrentMonth = true;
      dayData.isToday = this.isSameDay(date, this.today);
      dayData.isWeekend = date.getDay() === 0 || date.getDay() === 6;
      days.push(dayData);
    }
    
    // 下月填充（补齐到42天或35天）
    const totalDays = days.length <= 35 ? 35 : 42;
    const remaining = totalDays - days.length;
    for (let i = 1; i <= remaining; i++) {
      const dayData = new MiniDayData();
      dayData.day = i;
      dayData.isCurrentMonth = false;
      dayData.isToday = false;
      dayData.isWeekend = false;
      days.push(dayData);
    }
    
    return days;
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
   * 判断是否当前月
   */
  isCurrentMonth(month: number): boolean {
    return this.currentYear === this.today.getFullYear() && month === this.today.getMonth();
  }

  /**
   * 判断是否选中月
   */
  isSelectedMonth(month: number): boolean {
    return this.currentYear === this.selectedDate.getFullYear() && month === this.selectedDate.getMonth();
  }

  /**
   * 构建迷你月历
   */
  @Builder
  buildMiniMonth(monthData: MiniMonthData) {
    Column() {
      // 月份标题
      Text(this.monthNames[monthData.month])
        .fontSize(11)
        .fontWeight(this.isCurrentMonth(monthData.month) ? FontWeight.Bold : FontWeight.Normal)
        .fontColor(this.isCurrentMonth(monthData.month) ? Constants.COLOR_PRIMARY : Constants.COLOR_TEXT_PRIMARY)
        .margin({ bottom: 2 })

      // 星期标题
      Row() {
        ForEach(this.weekDays, (day: string, index: number) => {
          Text(day)
            .fontSize(7)
            .fontColor(index === 0 || index === 6 ? Constants.COLOR_DANGER : Constants.COLOR_TEXT_TERTIARY)
            .width('14.28%')
            .textAlign(TextAlign.Center)
        })
      }
      .width('100%')
      .margin({ bottom: 1 })

      // 日期网格
      Grid() {
        ForEach(monthData.days, (day: MiniDayData) => {
          GridItem() {
            Text(`${day.day}`)
              .fontSize(7)
              .fontColor(this.getMiniDayColor(day))
              .fontWeight(day.isToday ? FontWeight.Bold : FontWeight.Normal)
              .width('100%')
              .height('100%')
              .textAlign(TextAlign.Center)
              .backgroundColor(day.isToday ? Constants.COLOR_PRIMARY_LIGHT : Color.Transparent)
              .borderRadius(2)
          }
        })
      }
      .columnsTemplate('1fr 1fr 1fr 1fr 1fr 1fr 1fr')
      .rowsTemplate(monthData.days.length <= 35 ? '1fr 1fr 1fr 1fr 1fr' : '1fr 1fr 1fr 1fr 1fr 1fr')
      .width('100%')
      .height(monthData.days.length <= 35 ? 45 : 54)
    }
    .width('100%')
    .padding(4)
    .backgroundColor(this.isSelectedMonth(monthData.month) ? '#FFF8F5' : Constants.COLOR_CARD_BACKGROUND)
    .borderRadius(6)
    .border({
      width: this.isCurrentMonth(monthData.month) ? 1 : 0,
      color: Constants.COLOR_PRIMARY
    })
    .onClick(() => {
      this.onMonthSelect(monthData.year, monthData.month);
    })
  }

  /**
   * 获取迷你日期颜色
   */
  getMiniDayColor(day: MiniDayData): string {
    if (!day.isCurrentMonth) {
      return Constants.COLOR_TEXT_TERTIARY;
    }
    if (day.isToday) {
      return Constants.COLOR_PRIMARY;
    }
    if (day.isWeekend) {
      return Constants.COLOR_DANGER;
    }
    return Constants.COLOR_TEXT_PRIMARY;
  }

  build() {
    Scroll() {
      Column() {
        // 年份标题
        Row() {
          Text(`${this.currentYear}年`)
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT_PRIMARY)
        }
        .width('100%')
        .justifyContent(FlexAlign.Center)
        .padding({ top: 8, bottom: 8 })

        // 12个月网格 (3x4) - 使用 Flex 布局替代 Grid 以支持滚动
        Flex({ wrap: FlexWrap.Wrap, justifyContent: FlexAlign.SpaceBetween }) {
          ForEach(this.getMonthsData(), (monthData: MiniMonthData) => {
            Column() {
              this.buildMiniMonth(monthData)
            }
            .width('32%')
            .margin({ bottom: 6 })
          })
        }
        .width('100%')
        .padding({ left: 8, right: 8, bottom: 80 })
      }
      .width('100%')
    }
    .width('100%')
    .height('100%')
    .scrollBar(BarState.Off)
    .edgeEffect(EdgeEffect.Spring)
    .backgroundColor(Constants.COLOR_BACKGROUND)
  }
}
