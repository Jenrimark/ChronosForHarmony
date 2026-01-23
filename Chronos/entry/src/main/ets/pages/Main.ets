import { CalendarNewPage } from './CalendarNew';
import { Tasks } from './Tasks';
import { Chat } from './Chat';
import { Settings } from './Settings';
import { Accounting } from './Accounting';
import { Constants } from '../common/Constants';
import { IconComponent, IconType } from '../components/IconComponent';
import { AnimationUtils } from '../utils/AnimationUtils';

/**
 * 主页面 - 包含底部导航栏
 * 优化版：使用图标组件、添加动画效果、改进交互反馈
 */
@Entry
@Component
struct Main {
  @State currentIndex: number = 0;
  @State tabs: TabContent[] = [];
  @State showContent: boolean = false;

  aboutToAppear() {
    this.initTabs();
    // 延迟显示内容，创建淡入效果
    setTimeout(() => {
      this.showContent = true;
    }, 50);
  }

  /**
   * 初始化标签页
   */
  initTabs(): void {
    this.tabs = [
      {
        title: '日历',
        iconType: IconType.CALENDAR,
        component: CalendarNewPage
      },
      {
        title: '任务',
        iconType: IconType.TASK,
        component: Tasks
      },
      {
        title: '记账',
        iconType: IconType.BILL,
        component: Accounting
      },
      {
        title: '对话',
        iconType: IconType.CHAT,
        component: Chat
      },
      {
        title: '设置',
        iconType: IconType.SETTINGS,
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
          CalendarNewPage()
        } else if (this.currentIndex === 1) {
          Tasks()
        } else if (this.currentIndex === 2) {
          Accounting()
        } else if (this.currentIndex === 3) {
          Chat()
        } else {
          Settings()
        }
      }
      .layoutWeight(1)
      .width('100%')
      .opacity(this.showContent ? 1 : 0)
      .animation(AnimationUtils.fadeIn(Constants.ANIMATION_DURATION_NORMAL))

      // 底部导航栏 - 优化版
      Row() {
        ForEach(this.tabs, (tab: TabContent, index: number) => {
          // 使用 Button 替代 Column，更好地控制点击效果
          Button({ type: ButtonType.Normal }) {
            Column() {
              // 使用图标组件替代 emoji
              IconComponent({
                iconType: tab.iconType,
                iconSize: 24,
                iconColor: this.currentIndex === index
                  ? Constants.COLOR_PRIMARY
                  : Constants.COLOR_TEXT_TERTIARY
              })
              .margin({ bottom: Constants.SPACING_XS })

              Text(tab.title)
                .fontSize(Constants.FONT_SIZE_XS)
                .fontWeight(this.currentIndex === index ? FontWeight.Medium : FontWeight.Normal)
                .fontColor(
                  this.currentIndex === index
                    ? Constants.COLOR_PRIMARY
                    : Constants.COLOR_TEXT_TERTIARY
                )
            }
            .justifyContent(FlexAlign.Center)
          }
          .layoutWeight(1)
          .height(56)
          .padding({
            top: Constants.SPACING_SM,
            bottom: Constants.SPACING_SM
          })
          .backgroundColor(
            this.currentIndex === index
              ? Constants.COLOR_PRIMARY_LIGHTER
              : 'transparent'
          )
          .borderRadius(Constants.BORDER_RADIUS_SM)
          .stateEffect(false)  // 禁用默认的黑色点击效果
          .onClick(() => {
            this.onTabChange(index);
          })
        })
      }
      .width('100%')
      .height(64)
      .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
      .border({
        width: { top: 1 },
        color: Constants.COLOR_BORDER
      })
      .padding({
        left: Constants.SPACING_XS,
        right: Constants.SPACING_XS,
        bottom: Constants.SPACING_XS
      })
      .shadow({
        radius: 8,
        color: Constants.COLOR_SHADOW_LIGHT,
        offsetX: 0,
        offsetY: -2
      })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Constants.COLOR_BACKGROUND)
  }
}

/**
 * 标签页内容接口
 */
interface TabContent {
  title: string;
  iconType: IconType;
  component: ESObject;
}

