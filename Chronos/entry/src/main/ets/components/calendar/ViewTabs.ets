import { CalendarViewType } from '../../model/CalendarEvent';

/**
 * 视图切换标签组件
 * 实现年/月/周/日四种视图的切换
 */
@Component
export struct ViewTabs {
  @Link currentView: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void = () => {};

  private tabItems: TabItem[] = [
    { type: CalendarViewType.YEAR, label: '年' },
    { type: CalendarViewType.MONTH, label: '月' },
    { type: CalendarViewType.WEEK, label: '周' },
    { type: CalendarViewType.DAY, label: '日' }
  ];

  build() {
    Row() {
      ForEach(this.tabItems, (item: TabItem) => {
        Text(item.label)
          .fontSize(14)
          .fontWeight(this.currentView === item.type ? FontWeight.Bold : FontWeight.Normal)
          .fontColor(this.currentView === item.type ? '#FF6B35' : '#666666')
          .padding({ left: 16, right: 16, top: 8, bottom: 8 })
          .backgroundColor(this.currentView === item.type ? '#FFF3EE' : Color.Transparent)
          .borderRadius(16)
          .onClick(() => {
            if (this.currentView !== item.type) {
              this.currentView = item.type;
              this.onViewChange(item.type);
            }
          })
          .animation({
            duration: 200,
            curve: Curve.EaseInOut
          })
      })
    }
    .width('100%')
    .justifyContent(FlexAlign.Center)
    .padding({ top: 8, bottom: 8 })
    .backgroundColor('#FFFFFF')
  }
}

/**
 * 标签项数据
 */
class TabItem {
  type: CalendarViewType = CalendarViewType.MONTH;
  label: string = '';
}
