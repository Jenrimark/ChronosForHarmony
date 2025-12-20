if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Settings_Params {
    appVersion?: string;
    showClearDataDialog?: boolean;
    currentUser?: User | null;
    userService?: UserService;
}
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import type { User } from '../model/User';
import { UserService } from "@normalized:N&&&entry/src/main/ets/service/UserService&";
export class Settings extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__appVersion = new ObservedPropertySimplePU(Constants.APP_VERSION, this, "appVersion");
        this.__showClearDataDialog = new ObservedPropertySimplePU(false, this, "showClearDataDialog");
        this.__currentUser = new ObservedPropertyObjectPU(null, this, "currentUser");
        this.userService = UserService.getInstance();
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
        if (params.currentUser !== undefined) {
            this.currentUser = params.currentUser;
        }
        if (params.userService !== undefined) {
            this.userService = params.userService;
        }
    }
    updateStateVars(params: Settings_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__appVersion.purgeDependencyOnElmtId(rmElmtId);
        this.__showClearDataDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__currentUser.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__appVersion.aboutToBeDeleted();
        this.__showClearDataDialog.aboutToBeDeleted();
        this.__currentUser.aboutToBeDeleted();
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
    private __currentUser: ObservedPropertyObjectPU<User | null>;
    get currentUser() {
        return this.__currentUser.get();
    }
    set currentUser(newValue: User | null) {
        this.__currentUser.set(newValue);
    }
    private userService: UserService;
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
        }
        catch (error) {
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/Settings.ets(43:5)", "entry");
            Scroll.width('100%');
            Scroll.flexGrow(1);
            Scroll.backgroundColor(Constants.COLOR_BACKGROUND);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Settings.ets(44:7)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 用户信息卡片
            if (this.currentUser) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Settings.ets(47:11)", "entry");
                        Column.width('100%');
                        Column.padding(32);
                        Column.justifyContent(FlexAlign.Center);
                        Column.alignItems(HorizontalAlign.Center);
                        Column.backgroundColor('#FFFFFF');
                        Column.borderRadius(12);
                        Column.margin({ top: 16, left: 16, right: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 头像
                        if (this.currentUser.hasAvatar()) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Image.create(this.currentUser.avatar);
                                    Image.debugLine("entry/src/main/ets/pages/Settings.ets(50:15)", "entry");
                                    Image.width(80);
                                    Image.height(80);
                                    Image.borderRadius(40);
                                    Image.margin({ bottom: 12 });
                                }, Image);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 默认头像
                                    Column.create();
                                    Column.debugLine("entry/src/main/ets/pages/Settings.ets(57:15)", "entry");
                                    // 默认头像
                                    Column.width(80);
                                    // 默认头像
                                    Column.height(80);
                                    // 默认头像
                                    Column.borderRadius(40);
                                    // 默认头像
                                    Column.backgroundColor(Constants.COLOR_PRIMARY);
                                    // 默认头像
                                    Column.justifyContent(FlexAlign.Center);
                                    // 默认头像
                                    Column.margin({ bottom: 12 });
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.currentUser.getDisplayName().charAt(0).toUpperCase());
                                    Text.debugLine("entry/src/main/ets/pages/Settings.ets(58:17)", "entry");
                                    Text.fontSize(32);
                                    Text.fontColor('#FFFFFF');
                                }, Text);
                                Text.pop();
                                // 默认头像
                                Column.pop();
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 用户名/昵称
                        Text.create(this.currentUser.getDisplayName());
                        Text.debugLine("entry/src/main/ets/pages/Settings.ets(71:13)", "entry");
                        // 用户名/昵称
                        Text.fontSize(18);
                        // 用户名/昵称
                        Text.fontWeight(FontWeight.Bold);
                        // 用户名/昵称
                        Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
                        // 用户名/昵称
                        Text.margin({ bottom: 4 });
                    }, Text);
                    // 用户名/昵称
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 手机号
                        if (this.currentUser.phone) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.currentUser.phone);
                                    Text.debugLine("entry/src/main/ets/pages/Settings.ets(79:15)", "entry");
                                    Text.fontSize(14);
                                    Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                                    Text.margin({ bottom: 16 });
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('未绑定手机号');
                                    Text.debugLine("entry/src/main/ets/pages/Settings.ets(84:15)", "entry");
                                    Text.fontSize(14);
                                    Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                                    Text.margin({ bottom: 16 });
                                }, Text);
                                Text.pop();
                            });
                        }
                    }, If);
                    If.pop();
                    Column.pop();
                });
            }
            // 应用信息
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 应用信息
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Settings.ets(100:9)", "entry");
            // 应用信息
            Column.width('100%');
            // 应用信息
            Column.padding(32);
            // 应用信息
            Column.justifyContent(FlexAlign.Center);
            // 应用信息
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(Constants.APP_NAME);
            Text.debugLine("entry/src/main/ets/pages/Settings.ets(101:11)", "entry");
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`版本 ${this.appVersion}`);
            Text.debugLine("entry/src/main/ets/pages/Settings.ets(107:11)", "entry");
            Text.fontSize(14);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        // 应用信息
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 设置项列表
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Settings.ets(117:9)", "entry");
            // 设置项列表
            Column.width('100%');
            // 设置项列表
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            // 设置项列表
            Column.borderRadius(12);
            // 设置项列表
            Column.margin({ top: 16, left: 16, right: 16 });
        }, Column);
        // 个人信息
        this.buildSettingItem.bind(this)('个人信息', '编辑昵称、头像、手机号', () => {
            // TODO: 跳转到个人信息编辑页面
            console.info('个人信息');
        });
        // 数据管理
        this.buildSettingItem.bind(this)('数据管理', '备份和恢复数据', () => {
            // TODO: 实现数据备份功能
            console.info('数据备份');
        });
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/pages/Settings.ets(129:11)", "entry");
            Divider.color('#E5E5EA');
            Divider.margin({ left: 16, right: 16 });
        }, Divider);
        this.buildSettingItem.bind(this)('清除缓存', '清除应用缓存数据', () => {
            // TODO: 实现清除缓存功能
            console.info('清除缓存');
        });
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/pages/Settings.ets(138:11)", "entry");
            Divider.color('#E5E5EA');
            Divider.margin({ left: 16, right: 16 });
        }, Divider);
        this.buildSettingItem.bind(this)('清除所有数据', '删除所有任务和数据', () => {
            this.showClearDataDialog = true;
        }, Constants.COLOR_DANGER);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/pages/Settings.ets(146:11)", "entry");
            Divider.color('#E5E5EA');
            Divider.margin({ left: 16, right: 16 });
        }, Divider);
        // 关于
        this.buildSettingItem.bind(this)('关于应用', '查看应用信息和帮助', () => {
            // TODO: 显示关于页面
            console.info('关于应用');
        });
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/pages/Settings.ets(156:11)", "entry");
            Divider.color('#E5E5EA');
            Divider.margin({ left: 16, right: 16 });
        }, Divider);
        this.buildSettingItem.bind(this)('反馈建议', '向我们反馈问题或建议', () => {
            // TODO: 打开反馈页面
            console.info('反馈建议');
        });
        // 设置项列表
        Column.pop();
        Column.pop();
        Scroll.pop();
    }
    buildSettingItem(title: string, subtitle: string, onClick: () => void, titleColor?: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Settings.ets(178:5)", "entry");
            Row.width('100%');
            Row.padding(16);
            Row.onClick(() => {
                onClick();
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Settings.ets(179:7)", "entry");
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.debugLine("entry/src/main/ets/pages/Settings.ets(180:9)", "entry");
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
                        Text.debugLine("entry/src/main/ets/pages/Settings.ets(184:11)", "entry");
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
            Text.debugLine("entry/src/main/ets/pages/Settings.ets(193:7)", "entry");
            Text.width(20);
            Text.height(20);
            Text.fontSize(16);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.opacity(0.6);
        }, Text);
        Text.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
