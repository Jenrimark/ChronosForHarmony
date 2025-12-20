import { Constants } from '../common/Constants';
import { User } from '../model/User';
import { UserService } from '../service/UserService';

/**
 * 设置页面
 */
@Component
export struct Settings {
  @State appVersion: string = Constants.APP_VERSION;
  @State showClearDataDialog: boolean = false;
  @State currentUser: User | null = null;
  
  private userService: UserService = UserService.getInstance();

  aboutToAppear() {
    this.loadUserInfo();
  }

  /**
   * 加载用户信息（这里使用示例userId，实际应从登录状态获取）
   */
  async loadUserInfo(): Promise<void> {
    try {
      // TODO: 从登录状态获取userId
      const userId = 1; // 示例ID
      this.currentUser = await this.userService.getUserInfo(userId);
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  }

  /**
   * 清除所有数据
   */
  async clearAllData(): Promise<void> {
    // TODO: 实现清除所有数据的功能
    console.info('清除所有数据');
    this.showClearDataDialog = false;
  }

  build() {
    Scroll() {
      Column() {
        // 用户信息卡片
        if (this.currentUser) {
          Column() {
            // 头像
            if (this.currentUser.hasAvatar()) {
              Image(this.currentUser.avatar)
                .width(80)
                .height(80)
                .borderRadius(40)
                .margin({ bottom: 12 })
            } else {
              // 默认头像
              Column() {
                Text(this.currentUser.getDisplayName().charAt(0).toUpperCase())
                  .fontSize(32)
                  .fontColor('#FFFFFF')
              }
              .width(80)
              .height(80)
              .borderRadius(40)
              .backgroundColor(Constants.COLOR_PRIMARY)
              .justifyContent(FlexAlign.Center)
              .margin({ bottom: 12 })
            }
            
            // 用户名/昵称
            Text(this.currentUser.getDisplayName())
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .fontColor(Constants.COLOR_TEXT_PRIMARY)
              .margin({ bottom: 4 })
            
            // 手机号
            if (this.currentUser.phone) {
              Text(this.currentUser.phone)
                .fontSize(14)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
                .margin({ bottom: 16 })
            } else {
              Text('未绑定手机号')
                .fontSize(14)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
                .margin({ bottom: 16 })
            }
          }
          .width('100%')
          .padding(32)
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Center)
          .backgroundColor('#FFFFFF')
          .borderRadius(12)
          .margin({ top: 16, left: 16, right: 16 })
        }

        // 应用信息
        Column() {
          Text(Constants.APP_NAME)
            .fontSize(24)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT_PRIMARY)
            .margin({ bottom: 8 })

          Text(`版本 ${this.appVersion}`)
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
        }
        .width('100%')
        .padding(32)
        .justifyContent(FlexAlign.Center)
        .alignItems(HorizontalAlign.Center)

        // 设置项列表
        Column() {
          // 个人信息
          this.buildSettingItem('个人信息', '编辑昵称、头像、手机号', () => {
            // TODO: 跳转到个人信息编辑页面
            console.info('个人信息');
          })
          // 数据管理
          this.buildSettingItem('数据管理', '备份和恢复数据', () => {
            // TODO: 实现数据备份功能
            console.info('数据备份');
          })

          Divider()
            .color('#E5E5EA')
            .margin({ left: 16, right: 16 })

          this.buildSettingItem('清除缓存', '清除应用缓存数据', () => {
            // TODO: 实现清除缓存功能
            console.info('清除缓存');
          })

          Divider()
            .color('#E5E5EA')
            .margin({ left: 16, right: 16 })

          this.buildSettingItem('清除所有数据', '删除所有任务和数据', () => {
            this.showClearDataDialog = true;
          }, Constants.COLOR_DANGER)

          Divider()
            .color('#E5E5EA')
            .margin({ left: 16, right: 16 })

          // 关于
          this.buildSettingItem('关于应用', '查看应用信息和帮助', () => {
            // TODO: 显示关于页面
            console.info('关于应用');
          })

          Divider()
            .color('#E5E5EA')
            .margin({ left: 16, right: 16 })

          this.buildSettingItem('反馈建议', '向我们反馈问题或建议', () => {
            // TODO: 打开反馈页面
            console.info('反馈建议');
          })
        }
        .width('100%')
        .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
        .borderRadius(12)
        .margin({ top: 16, left: 16, right: 16 })
      }
    }
    .width('100%')
    .flexGrow(1)
    .backgroundColor(Constants.COLOR_BACKGROUND)
  }

  @Builder
  buildSettingItem(title: string, subtitle: string, onClick: () => void, titleColor?: string) {
    Row() {
      Column() {
        Text(title)
          .fontSize(16)
          .fontColor(titleColor || Constants.COLOR_TEXT_PRIMARY)
        if (subtitle) {
          Text(subtitle)
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .margin({ top: 4 })
        }
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)

      Text('>')
        .width(20)
        .height(20)
        .fontSize(16)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .opacity(0.6)
    }
    .width('100%')
    .padding(16)
    .onClick(() => {
      onClick();
    })
  }
}

