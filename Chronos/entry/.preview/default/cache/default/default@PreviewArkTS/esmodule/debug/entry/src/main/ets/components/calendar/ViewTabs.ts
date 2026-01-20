if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ViewTabs_Params {
    currentView?: CalendarViewType;
    onViewChange?: (view: CalendarViewType) => void;
    tabItems?: TabItem[];
}
import { CalendarViewType } from "@normalized:N&&&entry/src/main/ets/model/CalendarEvent&";
export class ViewTabs extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentView = new SynchedPropertySimpleTwoWayPU(params.currentView, this, "currentView");
        this.onViewChange = () => { };
        this.tabItems = [
            { type: CalendarViewType.YEAR, label: '年' },
            { type: CalendarViewType.MONTH, label: '月' },
            { type: CalendarViewType.WEEK, label: '周' },
            { type: CalendarViewType.DAY, label: '日' }
        ];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ViewTabs_Params) {
        if (params.onViewChange !== undefined) {
            this.onViewChange = params.onViewChange;
        }
        if (params.tabItems !== undefined) {
            this.tabItems = params.tabItems;
        }
    }
    updateStateVars(params: ViewTabs_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentView.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentView.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentView: SynchedPropertySimpleTwoWayPU<CalendarViewType>;
    get currentView() {
        return this.__currentView.get();
    }
    set currentView(newValue: CalendarViewType) {
        this.__currentView.set(newValue);
    }
    private onViewChange: (view: CalendarViewType) => void;
    private tabItems: TabItem[];
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/calendar/ViewTabs.ets(20:5)", "entry");
            Row.width('100%');
            Row.justifyContent(FlexAlign.Center);
            Row.padding({ top: 8, bottom: 8 });
            Row.backgroundColor('#FFFFFF');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(item.label);
                    Text.debugLine("entry/src/main/ets/components/calendar/ViewTabs.ets(22:9)", "entry");
                    Context.animation({
                        duration: 200,
                        curve: Curve.EaseInOut
                    });
                    Text.fontSize(14);
                    Text.fontWeight(this.currentView === item.type ? FontWeight.Bold : FontWeight.Normal);
                    Text.fontColor(this.currentView === item.type ? '#FF6B35' : '#666666');
                    Text.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                    Text.backgroundColor(this.currentView === item.type ? '#FFF3EE' : Color.Transparent);
                    Text.borderRadius(16);
                    Text.onClick(() => {
                        if (this.currentView !== item.type) {
                            this.currentView = item.type;
                            this.onViewChange(item.type);
                        }
                    });
                    Context.animation(null);
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, this.tabItems, forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
/**
 * 标签项数据
 */
class TabItem {
    type: CalendarViewType = CalendarViewType.MONTH;
    label: string = '';
}
