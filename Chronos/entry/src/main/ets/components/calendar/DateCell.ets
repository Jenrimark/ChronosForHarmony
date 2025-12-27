import { MxnzpHolidayData, Holiday } from '../../model/Holiday';
import { Constants } from '../../common/Constants';

/**
 * 日历日期项数据
 */
export class CalendarDayData {
  date: Date = new Date();
  isCurrentMonth: boolean = true;
  isToday: boolean = false;
  isSelected: boolean = false;
  taskCount: number = 0;
  eventCount: number = 0;
  holiday: Holiday | null = null;
  calendarInfo: MxnzpHolidayData | null = null;
}

/**
 * 日期单元格组件
 * 显示单个日期的信息，包括公历、农历、节日、节气、事件指示器
 */
@Component
export struct DateCell {
  @Prop day: CalendarDayData = new CalendarDayData();
  onSelect: (day: CalendarDayData) => void = () => {};

  /**
   * 24节气列表
   */
  private readonly solarTermsList: string[] = [
    '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
    '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
    '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
    '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'
  ];

  /**
   * 判断是否是真正的24节气
   */
  isRealSolarTerm(solarTerms: string): boolean {
    if (!solarTerms || solarTerms === '无') {
      return false;
    }
    if (solarTerms.includes('后') || solarTerms.includes('前')) {
      return false;
    }
    return this.solarTermsList.includes(solarTerms);
  }

  /**
   * 获取显示文本
   * 优先级：节日 > 节气 > 农历
   */
  getDisplayText(): string {
    if (!this.day.calendarInfo) {
      return '';
    }
    
    // 1. 节假日显示节日名称
    if (this.day.holiday && this.day.holiday.dayType === 2 && this.day.calendarInfo.typeDes) {
      const festivalName = this.day.calendarInfo.typeDes;
      if (festivalName !== '工作日' && festivalName !== '休息日') {
        return festivalName;
      }
    }
    
    // 2. 24节气
    if (this.isRealSolarTerm(this.day.calendarInfo.solarTerms)) {
      return this.day.calendarInfo.solarTerms;
    }
    
    // 3. 农历日期
    return this.day.calendarInfo.lunarCalendar || '';
  }

  /**
   * 获取副标题文字颜色
   */
  getSubTextColor(): string {
    if (!this.day.isCurrentMonth) {
      return Constants.COLOR_TEXT_TERTIARY;
    }
    // 节假日红色
    if (this.day.holiday && this.day.holiday.dayType === 2) {
      return Constants.COLOR_DANGER;
    }
    // 节气绿色
    if (this.day.calendarInfo && this.isRealSolarTerm(this.day.calendarInfo.solarTerms)) {
      return Constants.COLOR_SUCCESS;
    }
    return Constants.COLOR_TEXT_TERTIARY;
  }

  /**
   * 获取日期数字颜色
   */
  getDateTextColor(): string {
    if (!this.day.isCurrentMonth) {
      return Constants.COLOR_TEXT_TERTIARY;
    }
    if (this.day.isSelected) {
      return '#FFFFFF'; // 选中时白色字体
    }
    if (this.day.isToday) {
      return Constants.COLOR_PRIMARY;
    }
    // 周末红色
    const weekDay = this.day.date.getDay();
    if (weekDay === 0 || weekDay === 6) {
      return Constants.COLOR_DANGER;
    }
    if (this.day.holiday && this.day.holiday.dayType === 2) {
      return Constants.COLOR_DANGER;
    }
    return Constants.COLOR_TEXT_PRIMARY;
  }

  /**
   * 获取背景色
   */
  getBackgroundColor(): ResourceColor {
    if (this.day.isSelected) {
      return Constants.COLOR_PRIMARY; // 选中时使用主橙色
    }
    if (this.day.isToday) {
      return '#FFF0E8';
    }
    return Color.Transparent;
  }

  build() {
    Column() {
      // 日期数字
      Text(`${this.day.date.getDate()}`)
        .fontSize(16)
        .fontWeight(this.day.isToday || this.day.isSelected ? FontWeight.Bold : FontWeight.Normal)
        .fontColor(this.getDateTextColor())
        .margin({ bottom: 2 })

      // 农历/节气/节日
      if (this.day.isCurrentMonth && this.day.calendarInfo) {
        Text(this.getDisplayText())
          .fontSize(9)
          .fontColor(this.getSubTextColor())
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Clip })
      }

      // 事件/任务指示器
      Row() {
        // 日程事件指示器
        if (this.day.eventCount > 0) {
          Text('●')
            .fontSize(6)
            .fontColor('#FF6B35')
        }
        // 任务指示器
        if (this.day.taskCount > 0) {
          Text('●')
            .fontSize(6)
            .fontColor(Constants.COLOR_PRIMARY)
            .margin({ left: this.day.eventCount > 0 ? 2 : 0 })
        }
        // 节假日标记
        // dayType: 0=工作日, 1=休息日, 2=节假日
        // 只有休息日和节假日才显示标记
        if (this.day.holiday && (this.day.holiday.dayType === 1 || this.day.holiday.dayType === 2)) {
          Text('休')
            .fontSize(8)
            .fontColor(Constants.COLOR_DANGER)
            .margin({ left: (this.day.taskCount > 0 || this.day.eventCount > 0) ? 2 : 0 })
        }
      }
      .justifyContent(FlexAlign.Center)
      .height(10)
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .backgroundColor(this.getBackgroundColor())
    .borderRadius(8)
    .onClick(() => {
      this.onSelect(this.day);
    })
  }
}
