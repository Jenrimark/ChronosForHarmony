import { CalendarPage } from './Calendar';
import { Tasks } from './Tasks';
import { Statistics } from './Statistics';
import { Settings } from './Settings';
import { Accounting } from './Accounting';
import { Constants } from '../common/Constants';

/**
 * 主页面 - 包含底部导航栏
 */
@Entry
@Component
struct Main {
  @State currentIndex: number = 0;
  @State tabs: TabContent[] = [];

  aboutToAppear() {
    this.initTabs();
  }

  /**
   * 初始化标签页
   */
  initTabs(): void {
    this.tabs = [
      {
        title: '日历',
        icon: '📅',
        component: CalendarPage
      },
      {
        title: '任务',
        icon: '📋',
        component: Tasks
      },
      {
        title: '记账',
        icon: '💰',
        component: Accounting
      },
      {
        title: '统计',
        icon: '📊',
        component: Statistics
      },
      {
        title: '设置',
        icon: '⚙️',
        component: Settings
      }
    ];
  }

  /**
   * 切换标签页
   */
  onTabChange(index: number): void {
    this.currentIndex = index;
  }

  build() {
    Column() {
      // 内容区域
      Column() {
        if (this.currentIndex === 0) {
          CalendarPage()
        } else if (this.currentIndex === 1) {
          Tasks()
        } else if (this.currentIndex === 2) {
          Accounting()
        } else if (this.currentIndex === 3) {
          Statistics()
        } else {
          Settings()
        }
      }
      .layoutWeight(1)
      .width('100%')

      // 底部导航栏
      Row() {
        ForEach(this.tabs, (tab: TabContent, index: number) => {
          Column() {
            Text(tab.icon)
              .fontSize(24)
              .margin({ bottom: 4 })
            Text(tab.title)
              .fontSize(12)
              .fontColor(
                this.currentIndex === index
                  ? Constants.COLOR_PRIMARY
                  : Constants.COLOR_TEXT_SECONDARY
              )
          }
          .layoutWeight(1)
          .justifyContent(FlexAlign.Center)
          .padding({ top: 8, bottom: 8 })
          .onClick(() => {
            this.onTabChange(index);
          })
        })
      }
      .width('100%')
      .height(60)
      .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
      .border({ width: { top: 1 }, color: Constants.COLOR_DIVIDER })
      .padding({ bottom: 0 })
    }
    .width('100%')
    .height('100%')
    .padding({ top: 0 })
  }
}

/**
 * 标签页内容接口
 */
interface TabContent {
  title: string;
  icon: string;
  component: ESObject;
}

