if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface EventBlock_Params {
    event?: CalendarEvent;
    hourHeight?: number;
    onEventTap?: (event: CalendarEvent) => void;
}
import { CalendarEvent } from "@normalized:N&&&entry/src/main/ets/model/CalendarEvent&";
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
export class EventBlock extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__event = new SynchedPropertyObjectOneWayPU(params.event, this, "event");
        this.__hourHeight = new SynchedPropertySimpleOneWayPU(params.hourHeight, this, "hourHeight");
        this.onEventTap = () => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: EventBlock_Params) {
        if (params.event === undefined) {
            this.__event.set(new CalendarEvent());
        }
        if (params.hourHeight === undefined) {
            this.__hourHeight.set(60);
        }
        if (params.onEventTap !== undefined) {
            this.onEventTap = params.onEventTap;
        }
    }
    updateStateVars(params: EventBlock_Params) {
        this.__event.reset(params.event);
        this.__hourHeight.reset(params.hourHeight);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__event.purgeDependencyOnElmtId(rmElmtId);
        this.__hourHeight.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__event.aboutToBeDeleted();
        this.__hourHeight.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __event: SynchedPropertySimpleOneWayPU<CalendarEvent>;
    get event() {
        return this.__event.get();
    }
    set event(newValue: CalendarEvent) {
        this.__event.set(newValue);
    }
    private __hourHeight: SynchedPropertySimpleOneWayPU<number>; // 每小时的高度
    get hourHeight() {
        return this.__hourHeight.get();
    }
    set hourHeight(newValue: number) {
        this.__hourHeight.set(newValue);
    }
    private onEventTap: (event: CalendarEvent) => void;
    /**
     * 计算事件块的顶部位置
     */
    getTopPosition(): number {
        const startHour = this.event.startTime.getHours();
        const startMinute = this.event.startTime.getMinutes();
        return (startHour + startMinute / 60) * this.hourHeight;
    }
    /**
     * 计算事件块的高度
     */
    getBlockHeight(): number {
        const startTime = this.event.startTime.getTime();
        const endTime = this.event.endTime.getTime();
        const durationHours = (endTime - startTime) / (1000 * 60 * 60);
        const height = durationHours * this.hourHeight;
        // 最小高度20
        return Math.max(height, 20);
    }
    /**
     * 格式化时间显示
     */
    formatTime(date: Date): string {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const h = hours < 10 ? `0${hours}` : `${hours}`;
        const m = minutes < 10 ? `0${minutes}` : `${minutes}`;
        return `${h}:${m}`;
    }
    /**
     * 获取事件颜色
     */
    getEventColor(): string {
        // 可以根据事件类型或重要性返回不同颜色
        if (this.event.priority) {
            return '#FF6B35';
        }
        return Constants.COLOR_PRIMARY;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/calendar/EventBlock.ets(58:5)", "entry");
            Column.width('90%');
            Column.height(this.getBlockHeight());
            Column.padding(6);
            Column.backgroundColor(this.getEventColor());
            Column.borderRadius(6);
            Column.position({ x: 50, y: this.getTopPosition() });
            Column.onClick(() => {
                this.onEventTap(ObservedObject.GetRawObject(this.event));
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 事件标题
            Text.create(this.event.title);
            Text.debugLine("entry/src/main/ets/components/calendar/EventBlock.ets(60:7)", "entry");
            // 事件标题
            Text.fontSize(12);
            // 事件标题
            Text.fontColor('#FFFFFF');
            // 事件标题
            Text.fontWeight(FontWeight.Medium);
            // 事件标题
            Text.maxLines(1);
            // 事件标题
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            // 事件标题
            Text.width('100%');
        }, Text);
        // 事件标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 时间范围（如果高度足够）
            if (this.getBlockHeight() > 35) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${this.formatTime(this.event.startTime)} - ${this.formatTime(this.event.endTime)}`);
                        Text.debugLine("entry/src/main/ets/components/calendar/EventBlock.ets(70:9)", "entry");
                        Text.fontSize(10);
                        Text.fontColor('rgba(255,255,255,0.8)');
                        Text.margin({ top: 2 });
                    }, Text);
                    Text.pop();
                });
            }
            // 地点（如果高度足够且有地点）
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 地点（如果高度足够且有地点）
            if (this.getBlockHeight() > 50 && this.event.location.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`📍 ${this.event.location}`);
                        Text.debugLine("entry/src/main/ets/components/calendar/EventBlock.ets(78:9)", "entry");
                        Text.fontSize(10);
                        Text.fontColor('rgba(255,255,255,0.7)');
                        Text.maxLines(1);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        Text.margin({ top: 2 });
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
    }
    rerender() {
        this.updateDirtyElements();
    }
}
