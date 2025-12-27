import { CalendarEvent } from '../../model/CalendarEvent';
import { Constants } from '../../common/Constants';

/**
 * 事件块组件
 * 在时间轴上显示日程事件
 */
@Component
export struct EventBlock {
  @Prop event: CalendarEvent = new CalendarEvent();
  @Prop hourHeight: number = 60; // 每小时的高度
  onEventTap: (event: CalendarEvent) => void = () => {};

  /**
   * 计算事件块的顶部位置
   */
  getTopPosition(): number {
    const startHour = this.event.startTime.getHours();
    const startMinute = this.event.startTime.getMinutes();
    return (startHour + startMinute / 60) * this.hourHeight;
  }

  /**
   * 计算事件块的高度
   */
  getBlockHeight(): number {
    const startTime = this.event.startTime.getTime();
    const endTime = this.event.endTime.getTime();
    const durationHours = (endTime - startTime) / (1000 * 60 * 60);
    const height = durationHours * this.hourHeight;
    // 最小高度20
    return Math.max(height, 20);
  }

  /**
   * 格式化时间显示
   */
  formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const h = hours < 10 ? `0${hours}` : `${hours}`;
    const m = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${h}:${m}`;
  }

  /**
   * 获取事件颜色
   */
  getEventColor(): string {
    // 可以根据事件类型或重要性返回不同颜色
    if (this.event.priority) {
      return '#FF6B35';
    }
    return Constants.COLOR_PRIMARY;
  }

  build() {
    Column() {
      // 事件标题
      Text(this.event.title)
        .fontSize(12)
        .fontColor('#FFFFFF')
        .fontWeight(FontWeight.Medium)
        .maxLines(1)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
        .width('100%')

      // 时间范围（如果高度足够）
      if (this.getBlockHeight() > 35) {
        Text(`${this.formatTime(this.event.startTime)} - ${this.formatTime(this.event.endTime)}`)
          .fontSize(10)
          .fontColor('rgba(255,255,255,0.8)')
          .margin({ top: 2 })
      }

      // 地点（如果高度足够且有地点）
      if (this.getBlockHeight() > 50 && this.event.location.length > 0) {
        Text(`📍 ${this.event.location}`)
          .fontSize(10)
          .fontColor('rgba(255,255,255,0.7)')
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .margin({ top: 2 })
      }
    }
    .width('90%')
    .height(this.getBlockHeight())
    .padding(6)
    .backgroundColor(this.getEventColor())
    .borderRadius(6)
    .position({ x: 50, y: this.getTopPosition() })
    .onClick(() => {
      this.onEventTap(this.event);
    })
  }
}
