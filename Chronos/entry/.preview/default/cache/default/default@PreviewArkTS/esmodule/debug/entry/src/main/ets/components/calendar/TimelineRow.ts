if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface TimelineRow_Params {
    hour?: number;
    showCurrentTimeLine?: boolean;
    currentMinute?: number;
}
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
export class TimelineRow extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__hour = new SynchedPropertySimpleOneWayPU(params.hour, this, "hour");
        this.__showCurrentTimeLine = new SynchedPropertySimpleOneWayPU(params.showCurrentTimeLine, this, "showCurrentTimeLine");
        this.__currentMinute = new SynchedPropertySimpleOneWayPU(params.currentMinute, this, "currentMinute");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: TimelineRow_Params) {
        if (params.hour === undefined) {
            this.__hour.set(0);
        }
        if (params.showCurrentTimeLine === undefined) {
            this.__showCurrentTimeLine.set(false);
        }
        if (params.currentMinute === undefined) {
            this.__currentMinute.set(0);
        }
    }
    updateStateVars(params: TimelineRow_Params) {
        this.__hour.reset(params.hour);
        this.__showCurrentTimeLine.reset(params.showCurrentTimeLine);
        this.__currentMinute.reset(params.currentMinute);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__hour.purgeDependencyOnElmtId(rmElmtId);
        this.__showCurrentTimeLine.purgeDependencyOnElmtId(rmElmtId);
        this.__currentMinute.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__hour.aboutToBeDeleted();
        this.__showCurrentTimeLine.aboutToBeDeleted();
        this.__currentMinute.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __hour: SynchedPropertySimpleOneWayPU<number>;
    get hour() {
        return this.__hour.get();
    }
    set hour(newValue: number) {
        this.__hour.set(newValue);
    }
    private __showCurrentTimeLine: SynchedPropertySimpleOneWayPU<boolean>;
    get showCurrentTimeLine() {
        return this.__showCurrentTimeLine.get();
    }
    set showCurrentTimeLine(newValue: boolean) {
        this.__showCurrentTimeLine.set(newValue);
    }
    private __currentMinute: SynchedPropertySimpleOneWayPU<number>;
    get currentMinute() {
        return this.__currentMinute.get();
    }
    set currentMinute(newValue: number) {
        this.__currentMinute.set(newValue);
    }
    /**
     * 格式化小时显示
     */
    formatHour(): string {
        if (this.hour < 10) {
            return `0${this.hour}:00`;
        }
        return `${this.hour}:00`;
    }
    /**
     * 计算当前时间线位置（百分比）
     */
    getCurrentTimePosition(): number {
        return (this.currentMinute / 60) * 100;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/calendar/TimelineRow.ets(31:5)", "entry");
            Row.width('100%');
            Row.height(60);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 时间刻度
            Text.create(this.formatHour());
            Text.debugLine("entry/src/main/ets/components/calendar/TimelineRow.ets(33:7)", "entry");
            // 时间刻度
            Text.fontSize(11);
            // 时间刻度
            Text.fontColor(Constants.COLOR_TEXT_TERTIARY);
            // 时间刻度
            Text.width(45);
            // 时间刻度
            Text.textAlign(TextAlign.End);
            // 时间刻度
            Text.padding({ right: 8 });
        }, Text);
        // 时间刻度
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 时间槽区域
            Stack.create();
            Stack.debugLine("entry/src/main/ets/components/calendar/TimelineRow.ets(41:7)", "entry");
            // 时间槽区域
            Stack.layoutWeight(1);
            // 时间槽区域
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 分隔线
            Divider.create();
            Divider.debugLine("entry/src/main/ets/components/calendar/TimelineRow.ets(43:9)", "entry");
            // 分隔线
            Divider.color(Constants.COLOR_DIVIDER);
            // 分隔线
            Divider.width('100%');
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 当前时间红线
            if (this.showCurrentTimeLine) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/components/calendar/TimelineRow.ets(49:11)", "entry");
                        Row.width('100%');
                        Row.height(2);
                        Row.backgroundColor(Constants.COLOR_DANGER);
                        Row.position({ x: 0, y: `${this.getCurrentTimePosition()}%` });
                    }, Row);
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 红点
                        Circle.create();
                        Circle.debugLine("entry/src/main/ets/components/calendar/TimelineRow.ets(56:11)", "entry");
                        // 红点
                        Circle.width(8);
                        // 红点
                        Circle.height(8);
                        // 红点
                        Circle.fill(Constants.COLOR_DANGER);
                        // 红点
                        Circle.position({ x: -4, y: `${this.getCurrentTimePosition()}%` });
                    }, Circle);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 时间槽区域
        Stack.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
