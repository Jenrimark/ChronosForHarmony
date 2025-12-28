import { Constants } from '../common/Constants';
import { AuthService, UserInfo } from '../service/AuthService';
import { HolidayService } from '../service/HolidayService';
import { promptAction, UIContext } from '@kit.ArkUI';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { common } from '@kit.AbilityKit';
import auth from '@hw-agconnect/auth';

/**
 * 设置页面
 */
@Component
export struct Settings {
  @State appVersion: string = Constants.APP_VERSION;
  @State showClearDataDialog: boolean = false;
  @State showAboutDialog: boolean = false;
  @State userInfo: UserInfo | null = null;
  @State isLoading: boolean = false;
  @State cacheSize: string = '计算中...';
  @State calendarDataSource: number = Constants.DATA_SOURCE_LOCAL; // 0=本地数据, 1=API数据
  @State isSwitchingDataSource: boolean = false; // 切换数据源时的加载状态

  private authService: AuthService = AuthService.getInstance();
  private holidayService: HolidayService = HolidayService.getInstance();

  aboutToAppear() {
    // 异步加载用户信息，确保 AuthService 已初始化
    this.initAndLoadUserInfo();
    this.calculateCacheSize();
    this.loadCalendarDataSource();
  }

  /**
   * 加载日历数据源设置
   */
  loadCalendarDataSource(): void {
    this.calendarDataSource = this.holidayService.getDataSource();
  }

  /**
   * 切换日历数据源
   */
  async switchCalendarDataSource(value: boolean): Promise<void> {
    const newSource = value ? Constants.DATA_SOURCE_API : Constants.DATA_SOURCE_LOCAL;
    
    if (newSource === this.calendarDataSource) {
      return; // 没有变化，不需要切换
    }

    this.isSwitchingDataSource = true;
    
    try {
      await this.holidayService.setDataSource(newSource);
      this.calendarDataSource = newSource;
      
      const sourceName = newSource === Constants.DATA_SOURCE_LOCAL ? '本地数据' : 'API数据';
      promptAction.showToast({ 
        message: `已切换为${sourceName}，请刷新日历查看效果`,
        duration: 2000
      });
      
      hilog.info(0x0000, 'Settings', `日历数据源已切换为: ${sourceName}`);
    } catch (error) {
      console.error('切换数据源失败:', error);
      promptAction.showToast({ message: '切换失败，请重试' });
      // 恢复原状态
      this.calendarDataSource = this.holidayService.getDataSource();
    } finally {
      this.isSwitchingDataSource = false;
    }
  }

  /**
   * 初始化并加载用户信息
   */
  async initAndLoadUserInfo(): Promise<void> {
    // 确保 AuthService 的 context 已设置
    const context = getContext(this) as common.UIAbilityContext;
    await this.authService.setContext(context);
    await this.loadUserInfo();
  }

  /**
   * 加载用户信息
   */
  async loadUserInfo(): Promise<void> {
    // 先检查本地缓存（包含头像昵称）
    this.userInfo = this.authService.getCurrentUser();
    
    if (this.userInfo) {
      hilog.info(0x0000, 'Settings', '从缓存加载用户信息: %{public}s, 头像: %{public}s', 
        this.userInfo.displayName, this.userInfo.avatarUri ? '有' : '无');
    } else {
      // 尝试从服务器获取当前用户
      try {
        this.userInfo = await this.authService.getCurrentUserAsync();
        if (this.userInfo) {
          hilog.info(0x0000, 'Settings', '从服务器获取用户信息: %{public}s', this.userInfo.displayName);
        }
      } catch (e) {
        hilog.warn(0x0000, 'Settings', '获取用户信息失败');
      }
    }
  }

  /**
   * 华为账号登录
   */
  async handleLogin(): Promise<void> {
    this.isLoading = true;
    try {
      hilog.info(0x0000, 'Settings', '开始登录...');
      this.userInfo = await this.authService.login();
      if (this.userInfo) {
        hilog.info(0x0000, 'Settings', '基础登录成功，开始获取头像昵称...');
        // 登录成功后，获取头像昵称
        await this.fetchUserProfile();
        promptAction.showToast({ message: '登录成功！' });
        hilog.info(0x0000, 'Settings', '登录成功');
      } else {
        promptAction.showToast({ message: '登录失败，请重试' });
        hilog.warn(0x0000, 'Settings', '登录返回空');
      }
    } catch (e) {
      hilog.error(0x0000, 'Settings', '登录异常: %{public}s', JSON.stringify(e));
      promptAction.showToast({ message: '登录失败，请重试' });
    }
    this.isLoading = false;
  }

  /**
   * 获取用户头像昵称（使用 Account Kit）
   */
  async fetchUserProfile(): Promise<void> {
    try {
      hilog.info(0x0000, 'Settings', '开始获取用户头像昵称...');
      
      // 获取UIContext - 在组件中使用this.getUIContext()
      const uiContext: UIContext = this.getUIContext();
      
      // 使用 Account Kit 获取头像昵称
      const success = await this.authService.fetchUserProfileWithAccountKit(uiContext);
      if (success) {
        // 重新加载用户信息以更新UI
        await this.loadUserInfo();
        hilog.info(0x0000, 'Settings', '头像昵称获取成功');
      } else {
        hilog.warn(0x0000, 'Settings', '头像昵称获取失败');
      }
      
    } catch (error) {
      const err = error as BusinessError;
      hilog.error(0x0000, 'Settings', '获取头像昵称失败: Code: %{public}s, Message: %{public}s',
        String(err.code), String(err.message));
      // 获取头像昵称失败不影响登录状态，只是显示默认信息
    }
  }

  /**
   * 退出登录
   */
  async handleLogout(): Promise<void> {
    AlertDialog.show({
      title: '退出登录',
      message: '确定要退出当前账号吗？',
      primaryButton: {
        value: '取消',
        action: () => {}
      },
      secondaryButton: {
        value: '退出',
        fontColor: Constants.COLOR_DANGER,
        action: async () => {
          await this.authService.logout();
          this.userInfo = null;
          promptAction.showToast({ message: '已退出登录' });
        }
      }
    });
  }

  /**
   * 计算缓存大小
   */
  calculateCacheSize(): void {
    // 模拟计算缓存
    setTimeout(() => {
      this.cacheSize = '12.5 MB';
    }, 500);
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    AlertDialog.show({
      title: '清除缓存',
      message: '确定要清除应用缓存吗？这不会删除您的数据。',
      primaryButton: {
        value: '取消',
        action: () => {}
      },
      secondaryButton: {
        value: '清除',
        action: () => {
          // TODO: 实际清除缓存逻辑
          this.cacheSize = '0 MB';
          promptAction.showToast({ message: '缓存已清除' });
        }
      }
    });
  }

  /**
   * 清除所有数据![1766826056702](image/Settings/1766826056702.png)![1766826061508](image/Settings/1766826061508.png)![1766826073260](image/Settings/1766826073260.png)![1766826078188](image/Settings/1766826078188.png)![1766826079196](image/Settings/1766826079196.png)![1766826079413](image/Settings/1766826079413.png)![1766826079591](image/Settings/1766826079591.png)![1766826079774](image/Settings/1766826079774.png)![1766826080003](image/Settings/1766826080003.png)![1766826080109](image/Settings/1766826080109.png)
   */
  clearAllData(): void {
    AlertDialog.show({
      title: '清除所有数据',
      message: '警告：此操作将删除所有任务、账单和日程数据，且无法恢复！',
      primaryButton: {
        value: '取消',
        action: () => {}
      },
      secondaryButton: {
        value: '删除',
        fontColor: Constants.COLOR_DANGER,
        action: () => {
          // TODO: 实际清除数据逻辑
          promptAction.showToast({ message: '所有数据已清除' });
        }
      }
    });
  }

  /**
   * 显示关于对话框
   */
  showAbout(): void {
    AlertDialog.show({
      title: Constants.APP_NAME,
      message: `版本：${this.appVersion}\n\n${Constants.APP_NAME}是一款集日历、任务管理、记账于一体的时间管理应用。\n\n帮助您更好地规划时间，提高效率。\n\n© 2025 辰序团队`,
      confirm: {
        value: '确定',
        action: () => {}
      }
    });
  }

  /**
   * 反馈建议
   */
  showFeedback(): void {
    AlertDialog.show({
      title: '反馈建议',
      message: '如有问题或建议，请发送邮件至：\n\n2303532728@qq.com\n\n我们会尽快回复您！',
      confirm: {
        value: '确定',
        action: () => {}
      }
    });
  }

  /**
   * 数据备份
   */
  showDataManagement(): void {
    AlertDialog.show({
      title: '数据管理',
      message: '登录华为账号后，数据将自动同步到云端。\n\n您可以在任何设备上登录同一账号来恢复数据。',
      confirm: {
        value: '确定',
        action: () => {}
      }
    });
  }

  build() {
    Scroll() {
      Column() {
        // 用户信息/登录卡片
        Column() {
          if (this.userInfo) {
            // 已登录状态
            Row() {
              // 头像
              if (this.userInfo.avatarUri && this.userInfo.avatarUri.trim().length > 0) {
                Image(this.userInfo.avatarUri)
                  .width(60)
                  .height(60)
                  .borderRadius(30)
                  .alt('用户头像')
                  .objectFit(ImageFit.Cover)
                  .onError(() => {
                    // 如果头像加载失败，使用默认头像
                    hilog.warn(0x0000, 'Settings', '头像加载失败: %{public}s', this.userInfo?.avatarUri || '');
                  })
              } else {
                // 默认头像：显示用户名首字母
                Column() {
                  Text((this.userInfo.displayName && this.userInfo.displayName.length > 0) 
                    ? this.userInfo.displayName.charAt(0).toUpperCase() 
                    : '用')
                    .fontSize(24)
                    .fontColor('#FFFFFF')
                    .fontWeight(FontWeight.Bold)
                }
                .width(60)
                .height(60)
                .borderRadius(30)
                .backgroundColor(Constants.COLOR_PRIMARY)
                .justifyContent(FlexAlign.Center)
                .alignItems(HorizontalAlign.Center)
              }

              // 用户信息
              Column() {
                Text(this.userInfo.displayName || '华为用户')
                  .fontSize(18)
                  .fontWeight(FontWeight.Bold)
                  .fontColor(Constants.COLOR_TEXT_PRIMARY)
                  .maxLines(1)
                  .textOverflow({ overflow: TextOverflow.Ellipsis })
                Text('华为账号已登录')
                  .fontSize(14)
                  .fontColor(Constants.COLOR_TEXT_SECONDARY)
                  .margin({ top: 4 })
              }
              .alignItems(HorizontalAlign.Start)
              .margin({ left: 16 })
              .layoutWeight(1)

              // 退出按钮
              Button('退出')
                .fontSize(14)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
                .backgroundColor('#F5F5F5')
                .borderRadius(16)
                .height(32)
                .padding({ left: 16, right: 16 })
                .onClick(() => this.handleLogout())
            }
            .width('100%')
            .padding(20)
            .alignItems(VerticalAlign.Center)
          } else {
            // 未登录状态
            Column() {
              Text('🔐')
                .fontSize(40)
                .margin({ bottom: 12 })

              Text('登录华为账号')
                .fontSize(18)
                .fontWeight(FontWeight.Bold)
                .fontColor(Constants.COLOR_TEXT_PRIMARY)
                .margin({ bottom: 4 })

              Text('登录后可同步数据到云端')
                .fontSize(14)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
                .margin({ bottom: 16 })

              Button('华为账号登录')
                .width('80%')
                .height(44)
                .fontSize(16)
                .fontColor(Color.White)
                .backgroundColor(Constants.COLOR_PRIMARY)
                .borderRadius(22)
                .enabled(!this.isLoading)
                .onClick(() => this.handleLogin())

              if (this.isLoading) {
                LoadingProgress()
                  .width(24)
                  .height(24)
                  .margin({ top: 12 })
              }
            }
            .width('100%')
            .padding(24)
            .justifyContent(FlexAlign.Center)
            .alignItems(HorizontalAlign.Center)
          }
        }
        .width('100%')
        .backgroundColor('#FFFFFF')
        .borderRadius(12)
        .margin({ top: 16, left: 16, right: 16 })

        // 设置项列表
        Column() {
          // 日历数据源
          this.buildDataSourceSwitchItem()

          Divider().color('#E5E5EA').margin({ left: 16, right: 16 })

          // 数据管理
          this.buildSettingItem('数据管理', '备份和恢复数据', () => {
            this.showDataManagement();
          })

          Divider().color('#E5E5EA').margin({ left: 16, right: 16 })

          // 清除缓存
          this.buildSettingItem('清除缓存', `当前缓存：${this.cacheSize}`, () => {
            this.clearCache();
          })

          Divider().color('#E5E5EA').margin({ left: 16, right: 16 })

          // 清除所有数据
          this.buildSettingItem('清除所有数据', '删除所有任务和数据', () => {
            this.clearAllData();
          }, Constants.COLOR_DANGER)
        }
        .width('100%')
        .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
        .borderRadius(12)
        .margin({ top: 16, left: 16, right: 16 })

        // 关于
        Column() {
          this.buildSettingItem('关于应用', `版本 ${this.appVersion}`, () => {
            this.showAbout();
          })

          Divider().color('#E5E5EA').margin({ left: 16, right: 16 })

          this.buildSettingItem('反馈建议', '向我们反馈问题或建议', () => {
            this.showFeedback();
          })
        }
        .width('100%')
        .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
        .borderRadius(12)
        .margin({ top: 16, left: 16, right: 16, bottom: 32 })
      }
    }
    .width('100%')
    .height('100%')
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
        .fontSize(16)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .opacity(0.6)
    }
    .width('100%')
    .padding(16)
    .onClick(() => onClick())
  }

  @Builder
  buildDataSourceSwitchItem() {
    Row() {
      Column() {
        Text('日历数据源')
          .fontSize(16)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
        Text(this.calendarDataSource === Constants.DATA_SOURCE_LOCAL 
          ? '使用本地日历数据（离线可用）' 
          : '使用API日历数据（需要网络，数据更准确）')
          .fontSize(14)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .margin({ top: 4 })
      }
      .alignItems(HorizontalAlign.Start)
      .layoutWeight(1)

      if (this.isSwitchingDataSource) {
        LoadingProgress()
          .width(20)
          .height(20)
      } else {
        Toggle({ type: ToggleType.Switch, isOn: this.calendarDataSource === Constants.DATA_SOURCE_API })
          .selectedColor(Constants.COLOR_PRIMARY)
          .switchPointColor(Color.White)
          .onChange((isOn: boolean) => {
            this.switchCalendarDataSource(isOn);
          })
      }
    }
    .width('100%')
    .padding(16)
  }
}
