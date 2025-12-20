if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Main_Params {
    currentIndex?: number;
    tabs?: TabContent[];
}
import { CalendarPage } from "@normalized:N&&&entry/src/main/ets/pages/Calendar&";
import { Tasks } from "@normalized:N&&&entry/src/main/ets/pages/Tasks&";
import { Chat } from "@normalized:N&&&entry/src/main/ets/pages/Chat&";
import { Settings } from "@normalized:N&&&entry/src/main/ets/pages/Settings&";
import { Accounting } from "@normalized:N&&&entry/src/main/ets/pages/Accounting&";
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
class Main extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentIndex = new ObservedPropertySimplePU(0, this, "currentIndex");
        this.__tabs = new ObservedPropertyObjectPU([], this, "tabs");
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
    }
    updateStateVars(params: Main_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__tabs.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentIndex.aboutToBeDeleted();
        this.__tabs.aboutToBeDeleted();
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
                title: '对话',
                icon: '💬',
                component: Chat
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Main.ets(62:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.padding({ top: 0 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 内容区域
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Main.ets(64:7)", "entry");
            // 内容区域
            Column.layoutWeight(1);
            // 内容区域
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.currentIndex === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new CalendarPage(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Main.ets", line: 66, col: 11 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {};
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "CalendarPage" });
                    }
                });
            }
            else if (this.currentIndex === 1) {
                this.ifElseBranchUpdateFunction(1, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new Tasks(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Main.ets", line: 68, col: 11 });
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
                                let componentCall = new Accounting(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Main.ets", line: 70, col: 11 });
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
                                let componentCall = new Chat(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Main.ets", line: 72, col: 11 });
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
                                let componentCall = new Settings(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Main.ets", line: 74, col: 11 });
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
            // 底部导航栏
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Main.ets(81:7)", "entry");
            // 底部导航栏
            Row.width('100%');
            // 底部导航栏
            Row.height(60);
            // 底部导航栏
            Row.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            // 底部导航栏
            Row.border({ width: { top: 1 }, color: Constants.COLOR_DIVIDER });
            // 底部导航栏
            Row.padding({ bottom: 0 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const tab = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.debugLine("entry/src/main/ets/pages/Main.ets(83:11)", "entry");
                    Column.layoutWeight(1);
                    Column.justifyContent(FlexAlign.Center);
                    Column.padding({ top: 8, bottom: 8 });
                    Column.onClick(() => {
                        this.onTabChange(index);
                    });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(tab.icon);
                    Text.debugLine("entry/src/main/ets/pages/Main.ets(84:13)", "entry");
                    Text.fontSize(24);
                    Text.margin({ bottom: 4 });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(tab.title);
                    Text.debugLine("entry/src/main/ets/pages/Main.ets(87:13)", "entry");
                    Text.fontSize(12);
                    Text.fontColor(this.currentIndex === index
                        ? Constants.COLOR_PRIMARY
                        : Constants.COLOR_TEXT_SECONDARY);
                }, Text);
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.tabs, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        // 底部导航栏
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
    icon: string;
    component: any;
}
registerNamedRoute(() => new Main(undefined, {}), "", { bundleName: "com.jenrimark.chronos", moduleName: "entry", pagePath: "pages/Main", pageFullPath: "entry/src/main/ets/pages/Main", integratedHsp: "false", moduleType: "followWithHap" });
