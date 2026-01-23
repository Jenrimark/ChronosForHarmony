import { router } from '@kit.ArkUI';
import { AuthService, UserInfo } from '../service/AuthService';
import { promptAction } from '@kit.ArkUI';
import { Constants } from '../common/Constants';
import { IconComponent, IconType } from '../components/IconComponent';
import { AnimationUtils, ButtonAnimationUtils, LoadingAnimationUtils } from '../utils/AnimationUtils';

/**
 * 登录首页 - 优化版
 * 改进点：
 * 1. 使用图标组件替代 emoji
 * 2. 使用新的色彩系统
 * 3. 添加流畅的动画效果
 * 4. 改进交互反馈
 * 5. 优化视觉层次
 */
@Entry
@Component
struct Index {
  @State isLoading: boolean = false;
  @State userInfo: UserInfo | null = null;
  @State loginStatus: string = '欢迎使用辰序';
  @State @Watch('onLoadingChange') loadingTrigger: number = 0;
  @State showContent: boolean = false;

  private authService: AuthService = AuthService.getInstance();

  aboutToAppear(): void {
    // 延迟显示内容，创建淡入效果
    setTimeout(() => {
      this.showContent = true;
    }, 100);
    
    // 尝试获取当前用户
    this.tryGetCurrentUser();
  }

  /**
   * 监听加载状态变化
   */
  onLoadingChange() {
    // 触发动画
  }

  /**
   * 尝试获取当前登录用户
   */
  async tryGetCurrentUser(): Promise<void> {
    this.isLoading = true;
    this.loadingTrigger++;
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
    this.loadingTrigger++;
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
      if (this.showContent) {
        // Logo 区域 - 使用图标组件
        Column() {
          // 使用图标组件替代 emoji
          IconComponent({
            iconType: IconType.CALENDAR,
            iconSize: 80,
            iconColor: Constants.COLOR_PRIMARY
          })
          .margin({ bottom: Constants.SPACING_MD })

          Text('辰序')
            .fontSize(Constants.FONT_SIZE_4XL)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT_PRIMARY)

          Text('时间管理 · 任务追踪 · 智能记账')
            .fontSize(Constants.FONT_SIZE_SM)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .margin({ top: Constants.SPACING_SM })
        }
        .margin({ top: 100, bottom: 60 })
        .opacity(this.showContent ? 1 : 0)
        .animation(AnimationUtils.fadeIn(400))

        // 状态显示
        Text(this.loginStatus)
          .fontSize(Constants.FONT_SIZE_BASE)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .margin({ bottom: Constants.SPACING_XL })
          .opacity(this.showContent ? 1 : 0)
          .animation(AnimationUtils.fadeIn(500))

        // 用户信息（已登录时显示）
        if (this.userInfo) {
          Column() {
            if (this.userInfo.avatarUri) {
              Image(this.userInfo.avatarUri)
                .width(60)
                .height(60)
                .borderRadius(Constants.BORDER_RADIUS_FULL)
                .margin({ bottom: Constants.SPACING_SM })
                .border({
                  width: 2,
                  color: Constants.COLOR_PRIMARY_LIGHT
                })
            }
            Text(this.userInfo.displayName)
              .fontSize(Constants.FONT_SIZE_LG)
              .fontWeight(FontWeight.Medium)
              .fontColor(Constants.COLOR_TEXT_PRIMARY)
          }
          .margin({ bottom: Constants.SPACING_LG })
          .opacity(this.showContent ? 1 : 0)
          .animation(AnimationUtils.fadeIn(600))
        }

        // 按钮区域
        Column() {
          // 进入主页按钮 - 主要操作
          Button('进入主页')
            .width('80%')
            .height(50)
            .fontSize(Constants.FONT_SIZE_LG)
            .fontWeight(FontWeight.Medium)
            .fontColor(Constants.COLOR_TEXT_ON_PRIMARY)
            .backgroundColor(Constants.COLOR_PRIMARY)
            .borderRadius(Constants.BORDER_RADIUS_XL)
            .margin({ bottom: Constants.SPACING_MD })
            .shadow({
              radius: 12,
              color: Constants.COLOR_SHADOW_PRIMARY,
              offsetX: 0,
              offsetY: 4
            })
            .stateEffect(true)
            .hoverEffect(HoverEffect.Scale)
            .onClick(() => this.goToMain())
            .animation(ButtonAnimationUtils.hover())

          // 华为账号登录按钮
          if (!this.userInfo) {
            Button() {
              Row() {
                // 使用图标组件替代 emoji
                IconComponent({
                  iconType: IconType.LOCK,
                  iconSize: 20,
                  iconColor: Constants.COLOR_TEXT_PRIMARY
                })
                .margin({ right: Constants.SPACING_SM })
                
                Text('华为账号登录')
                  .fontSize(Constants.FONT_SIZE_BASE)
                  .fontColor(Constants.COLOR_TEXT_PRIMARY)
              }
            }
            .width('80%')
            .height(50)
            .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
            .borderRadius(Constants.BORDER_RADIUS_XL)
            .border({ 
              width: 1, 
              color: Constants.COLOR_BORDER 
            })
            .enabled(!this.isLoading)
            .stateEffect(true)
            .hoverEffect(HoverEffect.Scale)
            .onClick(() => this.handleHuaweiLogin())
            .animation(ButtonAnimationUtils.hover())
          } else {
            // 退出登录按钮
            Button('退出登录')
              .width('80%')
              .height(50)
              .fontSize(Constants.FONT_SIZE_BASE)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
              .backgroundColor(Constants.COLOR_BACKGROUND)
              .borderRadius(Constants.BORDER_RADIUS_XL)
              .stateEffect(true)
              .hoverEffect(HoverEffect.Scale)
              .onClick(() => this.handleLogout())
              .animation(ButtonAnimationUtils.hover())
          }
        }
        .width('100%')
        .opacity(this.showContent ? 1 : 0)
        .animation(AnimationUtils.fadeIn(700))

        // 加载指示器 - 优化动画
        if (this.isLoading) {
          Column() {
            LoadingProgress()
              .width(40)
              .height(40)
              .color(Constants.COLOR_PRIMARY)
          }
          .margin({ top: Constants.SPACING_LG })
          .opacity(1)
          .animation(AnimationUtils.fadeIn(200))
        }

        // 底部提示
        Blank()

        Row() {
          IconComponent({
            iconType: IconType.INFO,
            iconSize: 14,
            iconColor: Constants.COLOR_TEXT_TERTIARY
          })
          .margin({ right: Constants.SPACING_XS })
          
          Text('登录后可同步数据到云端')
            .fontSize(Constants.FONT_SIZE_XS)
            .fontColor(Constants.COLOR_TEXT_TERTIARY)
        }
        .margin({ bottom: Constants.SPACING_XL })
        .opacity(this.showContent ? 1 : 0)
        .animation(AnimationUtils.fadeIn(800))
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Constants.COLOR_BACKGROUND)
  }
}
