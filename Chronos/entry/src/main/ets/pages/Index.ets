import { router } from '@kit.ArkUI';
import { AuthService, UserInfo } from '../service/AuthService';
import { promptAction } from '@kit.ArkUI';

/**
 * 登录首页
 */
@Entry
@Component
struct Index {
  @State isLoading: boolean = false;
  @State userInfo: UserInfo | null = null;
  @State loginStatus: string = '欢迎使用辰序';

  private authService: AuthService = AuthService.getInstance();

  aboutToAppear(): void {
    // 尝试获取当前用户
    this.tryGetCurrentUser();
  }

  /**
   * 尝试获取当前登录用户
   */
  async tryGetCurrentUser(): Promise<void> {
    this.isLoading = true;
    try {
      const user: UserInfo | null = await this.authService.getCurrentUserAsync();
      if (user) {
        this.userInfo = user;
        this.loginStatus = `欢迎回来，${user.displayName}`;
      }
    } catch (e) {
      console.info('获取用户信息失败，需要手动登录');
    }
    this.isLoading = false;
  }

  /**
   * 华为账号登录
   */
  async handleHuaweiLogin(): Promise<void> {
    this.isLoading = true;
    this.loginStatus = '正在登录...';
    try {
      const user: UserInfo | null = await this.authService.login();
      if (user) {
        this.userInfo = user;
        this.loginStatus = `登录成功，${user.displayName}`;
        promptAction.showToast({ message: '登录成功！' });
      } else {
        this.loginStatus = '登录失败，请重试';
        promptAction.showToast({ message: '登录失败，请重试' });
      }
    } catch (e) {
      this.loginStatus = '登录失败，请重试';
      promptAction.showToast({ message: '登录失败，请重试' });
    }
    this.isLoading = false;
  }

  /**
   * 跳转到主页
   */
  goToMain(): void {
    router.pushUrl({ url: 'pages/Main' });
  }

  /**
   * 退出登录
   */
  async handleLogout(): Promise<void> {
    await this.authService.logout();
    this.userInfo = null;
    this.loginStatus = '欢迎使用辰序';
    promptAction.showToast({ message: '已退出登录' });
  }

  build() {
    Column() {
      // Logo 区域
      Column() {
        Text('📅')
          .fontSize(80)
          .margin({ bottom: 16 })

        Text('辰序')
          .fontSize(32)
          .fontWeight(FontWeight.Bold)
          .fontColor('#333333')

        Text('时间管理 · 任务追踪 · 智能记账')
          .fontSize(14)
          .fontColor('#666666')
          .margin({ top: 8 })
      }
      .margin({ top: 100, bottom: 60 })

      // 状态显示
      Text(this.loginStatus)
        .fontSize(16)
        .fontColor('#666666')
        .margin({ bottom: 40 })

      // 用户信息（已登录时显示）
      if (this.userInfo) {
        Column() {
          if (this.userInfo.avatarUri) {
            Image(this.userInfo.avatarUri)
              .width(60)
              .height(60)
              .borderRadius(30)
              .margin({ bottom: 8 })
          }
          Text(this.userInfo.displayName)
            .fontSize(18)
            .fontWeight(FontWeight.Medium)
            .fontColor('#333333')
        }
        .margin({ bottom: 30 })
      }

      // 按钮区域
      Column() {
        // 进入主页按钮
        Button('进入主页')
          .width('80%')
          .height(50)
          .fontSize(18)
          .fontColor(Color.White)
          .backgroundColor('#4FC3F7')
          .borderRadius(25)
          .margin({ bottom: 16 })
          .onClick(() => this.goToMain())

        // 华为账号登录按钮
        if (!this.userInfo) {
          Button() {
            Row() {
              Text('🔐')
                .fontSize(20)
                .margin({ right: 8 })
              Text('华为账号登录')
                .fontSize(16)
                .fontColor('#333333')
            }
          }
          .width('80%')
          .height(50)
          .backgroundColor('#FFFFFF')
          .borderRadius(25)
          .border({ width: 1, color: '#DDDDDD' })
          .enabled(!this.isLoading)
          .onClick(() => this.handleHuaweiLogin())
        } else {
          // 退出登录按钮
          Button('退出登录')
            .width('80%')
            .height(50)
            .fontSize(16)
            .fontColor('#666666')
            .backgroundColor('#F5F5F5')
            .borderRadius(25)
            .onClick(() => this.handleLogout())
        }
      }
      .width('100%')

      // 加载指示器
      if (this.isLoading) {
        LoadingProgress()
          .width(40)
          .height(40)
          .margin({ top: 20 })
      }

      // 底部提示
      Blank()

      Text('登录后可同步数据到云端')
        .fontSize(12)
        .fontColor('#999999')
        .margin({ bottom: 40 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#FAFAFA')
  }
}
