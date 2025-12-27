import { Constants } from '../../common/Constants';

/**
 * 日历快捷菜单组件
 */
@Component
export struct CalendarMenu {
  @Link isShow: boolean;
  onCreateEvent: () => void = () => {};
  onJumpToDate: () => void = () => {};
  onSearch: () => void = () => {};
  onSettings: () => void = () => {};
  onHelp: () => void = () => {};

  /**
   * 构建菜单项
   */
  @Builder
  buildMenuItem(icon: string, label: string, onClick: () => void) {
    Row() {
      Text(icon)
        .fontSize(18)
        .width(30)
      
      Text(label)
        .fontSize(15)
        .fontColor(Constants.COLOR_TEXT_PRIMARY)
        .layoutWeight(1)
    }
    .width('100%')
    .padding({ left: 16, right: 16, top: 14, bottom: 14 })
    .onClick(() => {
      onClick();
      this.isShow = false;
    })
  }

  build() {
    Column() {
      this.buildMenuItem('➕', '新建日程', this.onCreateEvent)
      
      Divider()
        .color(Constants.COLOR_DIVIDER)
        .margin({ left: 46 })
      
      this.buildMenuItem('📅', '跳转到指定日期', this.onJumpToDate)
      
      Divider()
        .color(Constants.COLOR_DIVIDER)
        .margin({ left: 46 })
      
      this.buildMenuItem('🔍', '搜索日程', this.onSearch)
      
      Divider()
        .color(Constants.COLOR_DIVIDER)
        .margin({ left: 46 })
      
      this.buildMenuItem('⚙️', '设置', this.onSettings)
      
      Divider()
        .color(Constants.COLOR_DIVIDER)
        .margin({ left: 46 })
      
      this.buildMenuItem('❓', '帮助与反馈', this.onHelp)
    }
    .width(200)
    .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
    .borderRadius(12)
    .shadow({
      radius: 16,
      color: 'rgba(0,0,0,0.1)',
      offsetX: 0,
      offsetY: 4
    })
  }
}

/**
 * 日期跳转弹窗组件
 */
@Component
export struct JumpToDateSheet {
  @Link isShow: boolean;
  @Link targetDate: Date;
  onConfirm: (date: Date) => void = () => {};

  @State selectedYear: number = new Date().getFullYear();
  @State selectedMonth: number = new Date().getMonth();
  @State selectedDay: number = new Date().getDate();

  aboutToAppear() {
    this.selectedYear = this.targetDate.getFullYear();
    this.selectedMonth = this.targetDate.getMonth();
    this.selectedDay = this.targetDate.getDate();
  }

  /**
   * 获取年份列表
   */
  getYears(): number[] {
    const years: number[] = [];
    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 50; y <= currentYear + 50; y++) {
      years.push(y);
    }
    return years;
  }

  /**
   * 获取月份列表
   */
  getMonths(): number[] {
    const months: number[] = [];
    for (let m = 0; m < 12; m++) {
      months.push(m);
    }
    return months;
  }

  /**
   * 获取日期列表
   */
  getDays(): number[] {
    const days: number[] = [];
    const daysInMonth = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }
    return days;
  }

  /**
   * 确认选择
   */
  confirm(): void {
    const date = new Date(this.selectedYear, this.selectedMonth, this.selectedDay);
    this.onConfirm(date);
    this.isShow = false;
  }

  build() {
    Column() {
      // 头部
      Row() {
        Button('取消')
          .type(ButtonType.Normal)
          .backgroundColor(Color.Transparent)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .onClick(() => {
            this.isShow = false;
          })
        
        Blank()
        
        Text('跳转到日期')
          .fontSize(17)
          .fontWeight(FontWeight.Medium)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
        
        Blank()
        
        Button('确定')
          .type(ButtonType.Normal)
          .backgroundColor(Color.Transparent)
          .fontColor(Constants.COLOR_PRIMARY)
          .onClick(() => {
            this.confirm();
          })
      }
      .width('100%')
      .padding({ left: 8, right: 8, top: 12, bottom: 12 })

      // 日期选择器
      Row() {
        // 年
        TextPicker({ range: this.getYears().map(y => `${y}年`), selected: this.selectedYear - (new Date().getFullYear() - 50) })
          .layoutWeight(1)
          .onChange((value: string | string[], index: number | number[]) => {
            if (typeof index === 'number') {
              this.selectedYear = new Date().getFullYear() - 50 + index;
            }
          })

        // 月
        TextPicker({ range: this.getMonths().map(m => `${m + 1}月`), selected: this.selectedMonth })
          .layoutWeight(1)
          .onChange((value: string | string[], index: number | number[]) => {
            if (typeof index === 'number') {
              this.selectedMonth = index;
            }
          })

        // 日
        TextPicker({ range: this.getDays().map(d => `${d}日`), selected: this.selectedDay - 1 })
          .layoutWeight(1)
          .onChange((value: string | string[], index: number | number[]) => {
            if (typeof index === 'number') {
              this.selectedDay = index + 1;
            }
          })
      }
      .width('100%')
      .height(200)
      .padding({ left: 16, right: 16 })

      // 快捷按钮
      Row() {
        Button('今天')
          .type(ButtonType.Normal)
          .backgroundColor(Constants.COLOR_PRIMARY_LIGHT)
          .fontColor(Constants.COLOR_PRIMARY)
          .onClick(() => {
            const today = new Date();
            this.selectedYear = today.getFullYear();
            this.selectedMonth = today.getMonth();
            this.selectedDay = today.getDate();
          })
      }
      .width('100%')
      .justifyContent(FlexAlign.Center)
      .padding({ top: 16, bottom: 32 })
    }
    .width('100%')
    .backgroundColor(Constants.COLOR_BACKGROUND)
  }
}

/**
 * 搜索日程弹窗组件
 */
@Component
export struct SearchEventSheet {
  @Link isShow: boolean;
  @State keyword: string = '';
  @State searchResults: SearchResultItem[] = [];
  onSearch: (keyword: string) => Promise<SearchResultItem[]> = async () => [];
  onSelectEvent: (eventId: number) => void = () => {};

  /**
   * 执行搜索
   */
  async doSearch(): Promise<void> {
    if (this.keyword.trim().length === 0) {
      this.searchResults = [];
      return;
    }
    this.searchResults = await this.onSearch(this.keyword);
  }

  /**
   * 格式化日期
   */
  formatDate(date: Date): string {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  }

  build() {
    Column() {
      // 搜索框
      Row() {
        Text('🔍')
          .fontSize(18)
          .margin({ right: 8 })
        
        TextInput({ placeholder: '搜索日程标题或地点', text: this.keyword })
          .layoutWeight(1)
          .backgroundColor(Color.Transparent)
          .onChange((value: string) => {
            this.keyword = value;
            this.doSearch();
          })
        
        if (this.keyword.length > 0) {
          Text('✕')
            .fontSize(16)
            .fontColor(Constants.COLOR_TEXT_TERTIARY)
            .onClick(() => {
              this.keyword = '';
              this.searchResults = [];
            })
        }
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 12, bottom: 12 })
      .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
      .borderRadius(8)
      .margin({ left: 16, right: 16, top: 16 })

      // 搜索结果
      if (this.searchResults.length === 0 && this.keyword.length > 0) {
        Column() {
          Text('😔')
            .fontSize(40)
            .opacity(0.3)
          Text('没有找到相关日程')
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .margin({ top: 12 })
        }
        .width('100%')
        .height(200)
        .justifyContent(FlexAlign.Center)
      } else {
        List() {
          ForEach(this.searchResults, (item: SearchResultItem) => {
            ListItem() {
              Row() {
                Column() {
                  Text(item.title)
                    .fontSize(15)
                    .fontColor(Constants.COLOR_TEXT_PRIMARY)
                  
                  Text(this.formatDate(item.date))
                    .fontSize(12)
                    .fontColor(Constants.COLOR_TEXT_SECONDARY)
                    .margin({ top: 4 })
                }
                .alignItems(HorizontalAlign.Start)
                .layoutWeight(1)

                Text('›')
                  .fontSize(18)
                  .fontColor(Constants.COLOR_TEXT_TERTIARY)
              }
              .width('100%')
              .padding({ left: 16, right: 16, top: 12, bottom: 12 })
              .onClick(() => {
                this.onSelectEvent(item.id);
                this.isShow = false;
              })
            }
          })
        }
        .width('100%')
        .layoutWeight(1)
        .divider({
          strokeWidth: 1,
          color: Constants.COLOR_DIVIDER,
          startMargin: 16,
          endMargin: 16
        })
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Constants.COLOR_BACKGROUND)
  }
}

/**
 * 搜索结果项
 */
export class SearchResultItem {
  id: number = 0;
  title: string = '';
  date: Date = new Date();
}
