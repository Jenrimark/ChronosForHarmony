import { Constants } from '../../common/Constants';

/**
 * 时间轴行组件
 * 显示时间刻度和当前时间线
 */
@Component
export struct TimelineRow {
  @Prop hour: number = 0;
  @Prop showCurrentTimeLine: boolean = false;
  @Prop currentMinute: number = 0;

  /**
   * 格式化小时显示
   */
  formatHour(): string {
    if (this.hour < 10) {
      return `0${this.hour}:00`;
    }
    return `${this.hour}:00`;
  }

  /**
   * 计算当前时间线位置（百分比）
   */
  getCurrentTimePosition(): number {
    return (this.currentMinute / 60) * 100;
  }

  build() {
    Row() {
      // 时间刻度
      Text(this.formatHour())
        .fontSize(11)
        .fontColor(Constants.COLOR_TEXT_TERTIARY)
        .width(45)
        .textAlign(TextAlign.End)
        .padding({ right: 8 })

      // 时间槽区域
      Stack() {
        // 分隔线
        Divider()
          .color(Constants.COLOR_DIVIDER)
          .width('100%')

        // 当前时间红线
        if (this.showCurrentTimeLine) {
          Row()
            .width('100%')
            .height(2)
            .backgroundColor(Constants.COLOR_DANGER)
            .position({ x: 0, y: `${this.getCurrentTimePosition()}%` })
          
          // 红点
          Circle()
            .width(8)
            .height(8)
            .fill(Constants.COLOR_DANGER)
            .position({ x: -4, y: `${this.getCurrentTimePosition()}%` })
        }
      }
      .layoutWeight(1)
      .height('100%')
    }
    .width('100%')
    .height(60)
  }
}
