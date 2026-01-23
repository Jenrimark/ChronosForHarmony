if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Main_Params {
    currentIndex?: number;
    tabs?: TabContent[];
    showContent?: boolean;
}
import { CalendarNewPage } from "@normalized:N&&&entry/src/main/ets/pages/CalendarNew&";
import { Tasks } from "@normalized:N&&&entry/src/main/ets/pages/Tasks&";
import { Chat } from "@normalized:N&&&entry/src/main/ets/pages/Chat&";
import { Settings } from "@normalized:N&&&entry/src/main/ets/pages/Settings&";
import { Accounting } from "@normalized:N&&&entry/src/main/ets/pages/Accounting&";
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import { IconComponent, IconType } from "@normalized:N&&&entry/src/main/ets/components/IconComponent&";
import { AnimationUtils } from "@normalized:N&&&entry/src/main/ets/utils/AnimationUtils&";
class Main extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentIndex = new ObservedPropertySimplePU(0, this, "currentIndex");
        this.__tabs = new ObservedPropertyObjectPU([], this, "tabs");
        this.__showContent = new ObservedPropertySimplePU(false, this, "showContent");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Main_Params) {
        if (params.currentIndex !== undefined) {
            this.currentIndex = params.currentIndex;
        }
        if (params.tabs !== undefined) {
            this.tabs = params.tabs;
        }
        if (params.showContent !== undefined) {
            this.showContent = params.showContent;
        }
    }
    updateStateVars(params: Main_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__tabs.purgeDependencyOnElmtId(rmElmtId);
        this.__showContent.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentIndex.aboutToBeDeleted();
        this.__tabs.aboutToBeDeleted();
        this.__showContent.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentIndex: ObservedPropertySimplePU<number>;
    get currentIndex() {
        return this.__currentIndex.get();
    }
    set currentIndex(newValue: number) {
        this.__currentIndex.set(newValue);
    }
    private __tabs: ObservedPropertyObjectPU<TabContent[]>;
    get tabs() {
        return this.__tabs.get();
    }
    set tabs(newValue: TabContent[]) {
        this.__tabs.set(newValue);
    }
    private __showContent: ObservedPropertySimplePU<boolean>;
    get showContent() {
        return this.__showContent.get();
    }
    set showContent(newValue: boolean) {
        this.__showContent.set(newValue);
    }
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Main.ets(70:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(Constants.COLOR_BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 内容区域
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Main.ets(72:7)", "entry");
            Context.animation(AnimationUtils.fadeIn(Constants.ANIMATION_DURATION_NORMAL));
            // 内容区域
            Column.layoutWeight(1);
            // 内容区域
            Column.width('100%');
            // 内容区域
            Column.opacity(this.showContent ? 1 : 0);
            Context.animation(null);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.currentIndex === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new CalendarNewPage(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Main.ets", line: 74, col: 11 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {};
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "CalendarNewPage" });
                    }
                });
            }
            else if (this.currentIndex === 1) {
                this.ifElseBranchUpdateFunction(1, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new Tasks(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Main.ets", line: 76, col: 11 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {};
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "Tasks" });
                    }
                });
            }
            else if (this.currentIndex === 2) {
                this.ifElseBranchUpdateFunction(2, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new Accounting(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Main.ets", line: 78, col: 11 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {};
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "Accounting" });
                    }
                });
            }
            else if (this.currentIndex === 3) {
                this.ifElseBranchUpdateFunction(3, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new Chat(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Main.ets", line: 80, col: 11 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {};
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "Chat" });
                    }
                });
            }
            else {
                this.ifElseBranchUpdateFunction(4, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new Settings(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Main.ets", line: 82, col: 11 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {};
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "Settings" });
                    }
                });
            }
        }, If);
        If.pop();
        // 内容区域
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底部导航栏 - 优化版
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Main.ets(91:7)", "entry");
            // 底部导航栏 - 优化版
            Row.width('100%');
            // 底部导航栏 - 优化版
            Row.height(64);
            // 底部导航栏 - 优化版
            Row.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            // 底部导航栏 - 优化版
            Row.border({
                width: { top: 1 },
                color: Constants.COLOR_BORDER
            });
            // 底部导航栏 - 优化版
            Row.padding({
                left: Constants.SPACING_XS,
                right: Constants.SPACING_XS,
                bottom: Constants.SPACING_XS
            });
            // 底部导航栏 - 优化版
            Row.shadow({
                radius: 8,
                color: Constants.COLOR_SHADOW_LIGHT,
                offsetX: 0,
                offsetY: -2
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const tab = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.debugLine("entry/src/main/ets/pages/Main.ets(93:11)", "entry");
                    Context.animation({
                        duration: Constants.ANIMATION_DURATION_FAST,
                        curve: Curve.EaseInOut
                    });
                    Column.layoutWeight(1);
                    Column.justifyContent(FlexAlign.Center);
                    Column.padding({
                        top: Constants.SPACING_SM,
                        bottom: Constants.SPACING_SM
                    });
                    Column.backgroundColor(this.currentIndex === index
                        ? Constants.COLOR_PRIMARY_LIGHTER
                        : 'transparent');
                    Column.borderRadius(Constants.BORDER_RADIUS_SM);
                    Column.onClick(() => {
                        this.onTabChange(index);
                    });
                    Context.animation(null);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    __Common__.create();
                    Context.animation({
                        duration: Constants.ANIMATION_DURATION_FAST,
                        curve: Curve.EaseInOut
                    });
                    __Common__.margin({ bottom: Constants.SPACING_XS });
                    Context.animation(null);
                }, __Common__);
                {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        if (isInitialRender) {
                            let componentCall = new 
                            // 使用图标组件替代 emoji
                            IconComponent(this, {
                                iconType: tab.iconType,
                                iconSize: 24,
                                iconColor: this.currentIndex === index
                                    ? Constants.COLOR_PRIMARY
                                    : Constants.COLOR_TEXT_TERTIARY
                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Main.ets", line: 95, col: 13 });
                            ViewPU.create(componentCall);
                            let paramsLambda = () => {
                                return {
                                    iconType: tab.iconType,
                                    iconSize: 24,
                                    iconColor: this.currentIndex === index
                                        ? Constants.COLOR_PRIMARY
                                        : Constants.COLOR_TEXT_TERTIARY
                                };
                            };
                            componentCall.paramsGenerator_ = paramsLambda;
                        }
                        else {
                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                iconType: tab.iconType,
                                iconSize: 24,
                                iconColor: this.currentIndex === index
                                    ? Constants.COLOR_PRIMARY
                                    : Constants.COLOR_TEXT_TERTIARY
                            });
                        }
                    }, { name: "IconComponent" });
                }
                __Common__.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(tab.title);
                    Text.debugLine("entry/src/main/ets/pages/Main.ets(108:13)", "entry");
                    Context.animation({
                        duration: Constants.ANIMATION_DURATION_FAST,
                        curve: Curve.EaseInOut
                    });
                    Text.fontSize(Constants.FONT_SIZE_XS);
                    Text.fontWeight(this.currentIndex === index ? FontWeight.Medium : FontWeight.Normal);
                    Text.fontColor(this.currentIndex === index
                        ? Constants.COLOR_PRIMARY
                        : Constants.COLOR_TEXT_TERTIARY);
                    Context.animation(null);
                }, Text);
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.tabs, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        // 底部导航栏 - 优化版
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Main";
    }
}
/**
 * 标签页内容接口
 */
interface TabContent {
    title: string;
    iconType: IconType;
    component: any;
}
registerNamedRoute(() => new Main(undefined, {}), "", { bundleName: "com.jenrimark.chronos", moduleName: "entry", pagePath: "pages/Main", pageFullPath: "entry/src/main/ets/pages/Main", integratedHsp: "false", moduleType: "followWithHap" });
