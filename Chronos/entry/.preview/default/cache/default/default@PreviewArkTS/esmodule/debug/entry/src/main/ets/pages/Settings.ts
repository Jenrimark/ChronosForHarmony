if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Settings_Params {
    appVersion?: string;
    showClearDataDialog?: boolean;
    showAboutDialog?: boolean;
    userInfo?: UserInfo | null;
    isLoading?: boolean;
    cacheSize?: string;
    calendarDataSource?: number;
    isSwitchingDataSource?: boolean;
    authService?: AuthService;
    holidayService?: HolidayService;
}
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import { AuthService } from "@normalized:N&&&entry/src/main/ets/service/AuthService&";
import type { UserInfo } from "@normalized:N&&&entry/src/main/ets/service/AuthService&";
import { HolidayService } from "@normalized:N&&&entry/src/main/ets/service/HolidayService&";
import promptAction from "@ohos:promptAction";
import type { UIContext } from "@ohos:arkui.UIContext";
import hilog from "@ohos:hilog";
import type { BusinessError } from "@ohos:base";
import type common from "@ohos:app.ability.common";
export class Settings extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__appVersion = new ObservedPropertySimplePU(Constants.APP_VERSION, this, "appVersion");
        this.__showClearDataDialog = new ObservedPropertySimplePU(false, this, "showClearDataDialog");
        this.__showAboutDialog = new ObservedPropertySimplePU(false, this, "showAboutDialog");
        this.__userInfo = new ObservedPropertyObjectPU(null, this, "userInfo");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__cacheSize = new ObservedPropertySimplePU('计算中...', this, "cacheSize");
        this.__calendarDataSource = new ObservedPropertySimplePU(Constants.DATA_SOURCE_LOCAL, this, "calendarDataSource");
        this.__isSwitchingDataSource = new ObservedPropertySimplePU(false, this, "isSwitchingDataSource");
        this.authService = AuthService.getInstance();
        this.holidayService = HolidayService.getInstance();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Settings_Params) {
        if (params.appVersion !== undefined) {
            this.appVersion = params.appVersion;
        }
        if (params.showClearDataDialog !== undefined) {
            this.showClearDataDialog = params.showClearDataDialog;
        }
        if (params.showAboutDialog !== undefined) {
            this.showAboutDialog = params.showAboutDialog;
        }
        if (params.userInfo !== undefined) {
            this.userInfo = params.userInfo;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.cacheSize !== undefined) {
            this.cacheSize = params.cacheSize;
        }
        if (params.calendarDataSource !== undefined) {
            this.calendarDataSource = params.calendarDataSource;
        }
        if (params.isSwitchingDataSource !== undefined) {
            this.isSwitchingDataSource = params.isSwitchingDataSource;
        }
        if (params.authService !== undefined) {
            this.authService = params.authService;
        }
        if (params.holidayService !== undefined) {
            this.holidayService = params.holidayService;
        }
    }
    updateStateVars(params: Settings_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__appVersion.purgeDependencyOnElmtId(rmElmtId);
        this.__showClearDataDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__showAboutDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__userInfo.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__cacheSize.purgeDependencyOnElmtId(rmElmtId);
        this.__calendarDataSource.purgeDependencyOnElmtId(rmElmtId);
        this.__isSwitchingDataSource.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__appVersion.aboutToBeDeleted();
        this.__showClearDataDialog.aboutToBeDeleted();
        this.__showAboutDialog.aboutToBeDeleted();
        this.__userInfo.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__cacheSize.aboutToBeDeleted();
        this.__calendarDataSource.aboutToBeDeleted();
        this.__isSwitchingDataSource.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __appVersion: ObservedPropertySimplePU<string>;
    get appVersion() {
        return this.__appVersion.get();
    }
    set appVersion(newValue: string) {
        this.__appVersion.set(newValue);
    }
    private __showClearDataDialog: ObservedPropertySimplePU<boolean>;
    get showClearDataDialog() {
        return this.__showClearDataDialog.get();
    }
    set showClearDataDialog(newValue: boolean) {
        this.__showClearDataDialog.set(newValue);
    }
    private __showAboutDialog: ObservedPropertySimplePU<boolean>;
    get showAboutDialog() {
        return this.__showAboutDialog.get();
    }
    set showAboutDialog(newValue: boolean) {
        this.__showAboutDialog.set(newValue);
    }
    private __userInfo: ObservedPropertyObjectPU<UserInfo | null>;
    get userInfo() {
        return this.__userInfo.get();
    }
    set userInfo(newValue: UserInfo | null) {
        this.__userInfo.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __cacheSize: ObservedPropertySimplePU<string>;
    get cacheSize() {
        return this.__cacheSize.get();
    }
    set cacheSize(newValue: string) {
        this.__cacheSize.set(newValue);
    }
    private __calendarDataSource: ObservedPropertySimplePU<number>; // 0=本地数据, 1=API数据
    get calendarDataSource() {
        return this.__calendarDataSource.get();
    }
    set calendarDataSource(newValue: number) {
        this.__calendarDataSource.set(newValue);
    }
    private __isSwitchingDataSource: ObservedPropertySimplePU<boolean>; // 切换数据源时的加载状态
    get isSwitchingDataSource() {
        return this.__isSwitchingDataSource.get();
    }
    set isSwitchingDataSource(newValue: boolean) {
        this.__isSwitchingDataSource.set(newValue);
    }
    private authService: AuthService;
    private holidayService: HolidayService;
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
        }
        catch (error) {
            console.error('切换数据源失败:', error);
            promptAction.showToast({ message: '切换失败，请重试' });
            // 恢复原状态
            this.calendarDataSource = this.holidayService.getDataSource();
        }
        finally {
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
            hilog.info(0x0000, 'Settings', '从缓存加载用户信息: %{public}s, 头像: %{public}s', this.userInfo.displayName, this.userInfo.avatarUri ? '有' : '无');
        }
        else {
            // 尝试从服务器获取当前用户
            try {
                this.userInfo = await this.authService.getCurrentUserAsync();
                if (this.userInfo) {
                    hilog.info(0x0000, 'Settings', '从服务器获取用户信息: %{public}s', this.userInfo.displayName);
                }
            }
            catch (e) {
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
            }
            else {
                promptAction.showToast({ message: '登录失败，请重试' });
                hilog.warn(0x0000, 'Settings', '登录返回空');
            }
        }
        catch (e) {
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
            }
            else {
                hilog.warn(0x0000, 'Settings', '头像昵称获取失败');
            }
        }
        catch (error) {
            const err = error as BusinessError;
            hilog.error(0x0000, 'Settings', '获取头像昵称失败: Code: %{public}s, Message: %{public}s', String(err.code), String(err.message));
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
                action: () => { }
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
                action: () => { }
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
                action: () => { }
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
                action: () => { }
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
                action: () => { }
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
                action: () => { }
            }
        });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/Settings.ets(280:5)", "entry");
            Scroll.width('100%');
            Scroll.height('100%');
            Scroll.backgroundColor(Constants.COLOR_BACKGROUND);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Settings.ets(281:7)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户信息/登录卡片
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Settings.ets(283:9)", "entry");
            // 用户信息/登录卡片
            Column.width('100%');
            // 用户信息/登录卡片
            Column.backgroundColor('#FFFFFF');
            // 用户信息/登录卡片
            Column.borderRadius(12);
            // 用户信息/登录卡片
            Column.margin({ top: 16, left: 16, right: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.userInfo) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 已登录状态
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/Settings.ets(286:13)", "entry");
                        // 已登录状态
                        Row.width('100%');
                        // 已登录状态
                        Row.padding(20);
                        // 已登录状态
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 头像
                        if (this.userInfo.avatarUri && this.userInfo.avatarUri.trim().length > 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Image.create(this.userInfo.avatarUri);
                                    Image.debugLine("entry/src/main/ets/pages/Settings.ets(289:17)", "entry");
                                    Image.width(60);
                                    Image.height(60);
                                    Image.borderRadius(30);
                                    Image.alt('用户头像');
                                    Image.objectFit(ImageFit.Cover);
                                    Image.onError(() => {
                                        // 如果头像加载失败，使用默认头像
                                        hilog.warn(0x0000, 'Settings', '头像加载失败: %{public}s', this.userInfo?.avatarUri || '');
                                    });
                                }, Image);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 默认头像：显示用户名首字母
                                    Column.create();
                                    Column.debugLine("entry/src/main/ets/pages/Settings.ets(301:17)", "entry");
                                    // 默认头像：显示用户名首字母
                                    Column.width(60);
                                    // 默认头像：显示用户名首字母
                                    Column.height(60);
                                    // 默认头像：显示用户名首字母
                                    Column.borderRadius(30);
                                    // 默认头像：显示用户名首字母
                                    Column.backgroundColor(Constants.COLOR_PRIMARY);
                                    // 默认头像：显示用户名首字母
                                    Column.justifyContent(FlexAlign.Center);
                                    // 默认头像：显示用户名首字母
                                    Column.alignItems(HorizontalAlign.Center);
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create((this.userInfo.displayName && this.userInfo.displayName.length > 0)
                                        ? this.userInfo.displayName.charAt(0).toUpperCase()
                                        : '用');
                                    Text.debugLine("entry/src/main/ets/pages/Settings.ets(302:19)", "entry");
                                    Text.fontSize(24);
                                    Text.fontColor('#FFFFFF');
                                    Text.fontWeight(FontWeight.Bold);
                                }, Text);
                                Text.pop();
                                // 默认头像：显示用户名首字母
                                Column.pop();
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 用户信息
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Settings.ets(318:15)", "entry");
                        // 用户信息
                        Column.alignItems(HorizontalAlign.Start);
                        // 用户信息
                        Column.margin({ left: 16 });
                        // 用户信息
                        Column.layoutWeight(1);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.userInfo.displayName || '华为用户');
                        Text.debugLine("entry/src/main/ets/pages/Settings.ets(319:17)", "entry");
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
                        Text.maxLines(1);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('华为账号已登录');
                        Text.debugLine("entry/src/main/ets/pages/Settings.ets(325:17)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                    // 用户信息
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 退出按钮
                        Button.createWithLabel('退出');
                        Button.debugLine("entry/src/main/ets/pages/Settings.ets(335:15)", "entry");
                        // 退出按钮
                        Button.fontSize(14);
                        // 退出按钮
                        Button.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        // 退出按钮
                        Button.backgroundColor('#F5F5F5');
                        // 退出按钮
                        Button.borderRadius(16);
                        // 退出按钮
                        Button.height(32);
                        // 退出按钮
                        Button.padding({ left: 16, right: 16 });
                        // 退出按钮
                        Button.onClick(() => this.handleLogout());
                    }, Button);
                    // 退出按钮
                    Button.pop();
                    // 已登录状态
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 未登录状态
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Settings.ets(349:13)", "entry");
                        // 未登录状态
                        Column.width('100%');
                        // 未登录状态
                        Column.padding(24);
                        // 未登录状态
                        Column.justifyContent(FlexAlign.Center);
                        // 未登录状态
                        Column.alignItems(HorizontalAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('🔐');
                        Text.debugLine("entry/src/main/ets/pages/Settings.ets(350:15)", "entry");
                        Text.fontSize(40);
                        Text.margin({ bottom: 12 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('登录华为账号');
                        Text.debugLine("entry/src/main/ets/pages/Settings.ets(354:15)", "entry");
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
                        Text.margin({ bottom: 4 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('登录后可同步数据到云端');
                        Text.debugLine("entry/src/main/ets/pages/Settings.ets(360:15)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.margin({ bottom: 16 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('华为账号登录');
                        Button.debugLine("entry/src/main/ets/pages/Settings.ets(365:15)", "entry");
                        Button.width('80%');
                        Button.height(44);
                        Button.fontSize(16);
                        Button.fontColor(Color.White);
                        Button.backgroundColor(Constants.COLOR_PRIMARY);
                        Button.borderRadius(22);
                        Button.enabled(!this.isLoading);
                        Button.onClick(() => this.handleLogin());
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.isLoading) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    LoadingProgress.create();
                                    LoadingProgress.debugLine("entry/src/main/ets/pages/Settings.ets(376:17)", "entry");
                                    LoadingProgress.width(24);
                                    LoadingProgress.height(24);
                                    LoadingProgress.margin({ top: 12 });
                                }, LoadingProgress);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    // 未登录状态
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        // 用户信息/登录卡片
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 设置项列表
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Settings.ets(394:9)", "entry");
            // 设置项列表
            Column.width('100%');
            // 设置项列表
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            // 设置项列表
            Column.borderRadius(12);
            // 设置项列表
            Column.margin({ top: 16, left: 16, right: 16 });
        }, Column);
        // 日历数据源
        this.buildDataSourceSwitchItem.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/pages/Settings.ets(398:11)", "entry");
            Divider.color('#E5E5EA');
            Divider.margin({ left: 16, right: 16 });
        }, Divider);
        // 数据管理
        this.buildSettingItem.bind(this)('数据管理', '备份和恢复数据', () => {
            this.showDataManagement();
        });
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/pages/Settings.ets(405:11)", "entry");
            Divider.color('#E5E5EA');
            Divider.margin({ left: 16, right: 16 });
        }, Divider);
        // 清除缓存
        this.buildSettingItem.bind(this)('清除缓存', `当前缓存：${this.cacheSize}`, () => {
            this.clearCache();
        });
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/pages/Settings.ets(412:11)", "entry");
            Divider.color('#E5E5EA');
            Divider.margin({ left: 16, right: 16 });
        }, Divider);
        // 清除所有数据
        this.buildSettingItem.bind(this)('清除所有数据', '删除所有任务和数据', () => {
            this.clearAllData();
        }, Constants.COLOR_DANGER);
        // 设置项列表
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 关于
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Settings.ets(425:9)", "entry");
            // 关于
            Column.width('100%');
            // 关于
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            // 关于
            Column.borderRadius(12);
            // 关于
            Column.margin({ top: 16, left: 16, right: 16, bottom: 32 });
        }, Column);
        this.buildSettingItem.bind(this)('关于应用', `版本 ${this.appVersion}`, () => {
            this.showAbout();
        });
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/pages/Settings.ets(430:11)", "entry");
            Divider.color('#E5E5EA');
            Divider.margin({ left: 16, right: 16 });
        }, Divider);
        this.buildSettingItem.bind(this)('反馈建议', '向我们反馈问题或建议', () => {
            this.showFeedback();
        });
        // 关于
        Column.pop();
        Column.pop();
        Scroll.pop();
    }
    buildSettingItem(title: string, subtitle: string, onClick: () => void, titleColor?: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Settings.ets(449:5)", "entry");
            Row.width('100%');
            Row.padding(16);
            Row.onClick(() => onClick());
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Settings.ets(450:7)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.debugLine("entry/src/main/ets/pages/Settings.ets(451:9)", "entry");
            Text.fontSize(16);
            Text.fontColor(titleColor || Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (subtitle) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(subtitle);
                        Text.debugLine("entry/src/main/ets/pages/Settings.ets(455:11)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('>');
            Text.debugLine("entry/src/main/ets/pages/Settings.ets(464:7)", "entry");
            Text.fontSize(16);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.opacity(0.6);
        }, Text);
        Text.pop();
        Row.pop();
    }
    buildDataSourceSwitchItem(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Settings.ets(476:5)", "entry");
            Row.width('100%');
            Row.padding(16);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Settings.ets(477:7)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('日历数据源');
            Text.debugLine("entry/src/main/ets/pages/Settings.ets(478:9)", "entry");
            Text.fontSize(16);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.calendarDataSource === Constants.DATA_SOURCE_LOCAL
                ? '使用本地日历数据（离线可用）'
                : '使用API日历数据（需要网络，数据更准确）');
            Text.debugLine("entry/src/main/ets/pages/Settings.ets(481:9)", "entry");
            Text.fontSize(14);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isSwitchingDataSource) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.debugLine("entry/src/main/ets/pages/Settings.ets(492:9)", "entry");
                        LoadingProgress.width(20);
                        LoadingProgress.height(20);
                    }, LoadingProgress);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Toggle.create({ type: ToggleType.Switch, isOn: this.calendarDataSource === Constants.DATA_SOURCE_API });
                        Toggle.debugLine("entry/src/main/ets/pages/Settings.ets(496:9)", "entry");
                        Toggle.selectedColor(Constants.COLOR_PRIMARY);
                        Toggle.switchPointColor(Color.White);
                        Toggle.onChange((isOn: boolean) => {
                            this.switchCalendarDataSource(isOn);
                        });
                    }, Toggle);
                    Toggle.pop();
                });
            }
        }, If);
        If.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
