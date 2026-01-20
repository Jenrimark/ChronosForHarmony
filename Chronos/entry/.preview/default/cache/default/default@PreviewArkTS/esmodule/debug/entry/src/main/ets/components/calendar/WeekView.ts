if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface WeekView_Params {
    selectedDate?: Date;
    events?: CalendarEvent[];
    onEventTap?: (event: CalendarEvent) => void;
    onDateSelect?: (date: Date) => void;
    today?: Date;
    hourHeight?: number;
    weekDays?: string[];
}
import type { CalendarEvent } from '../../model/CalendarEvent';
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import { TimelineRow } from "@normalized:N&&&entry/src/main/ets/components/calendar/TimelineRow&";
import { EventBlock } from "@normalized:N&&&entry/src/main/ets/components/calendar/EventBlock&";
export class WeekView extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__selectedDate = new SynchedPropertyObjectTwoWayPU(params.selectedDate, this, "selectedDate");
        this.__events = new SynchedPropertyObjectOneWayPU(params.events, this, "events");
        this.onEventTap = () => { };
        this.onDateSelect = () => { };
        this.today = new Date();
        this.hourHeight = 60;
        this.weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: WeekView_Params) {
        if (params.events === undefined) {
            this.__events.set([]);
        }
        if (params.onEventTap !== undefined) {
            this.onEventTap = params.onEventTap;
        }
        if (params.onDateSelect !== undefined) {
            this.onDateSelect = params.onDateSelect;
        }
        if (params.today !== undefined) {
            this.today = params.today;
        }
        if (params.hourHeight !== undefined) {
            this.hourHeight = params.hourHeight;
        }
        if (params.weekDays !== undefined) {
            this.weekDays = params.weekDays;
        }
    }
    updateStateVars(params: WeekView_Params) {
        this.__events.reset(params.events);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__selectedDate.purgeDependencyOnElmtId(rmElmtId);
        this.__events.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__selectedDate.aboutToBeDeleted();
        this.__events.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __selectedDate: SynchedPropertySimpleOneWayPU<Date>;
    get selectedDate() {
        return this.__selectedDate.get();
    }
    set selectedDate(newValue: Date) {
        this.__selectedDate.set(newValue);
    }
    private __events: SynchedPropertySimpleOneWayPU<CalendarEvent[]>;
    get events() {
        return this.__events.get();
    }
    set events(newValue: CalendarEvent[]) {
        this.__events.set(newValue);
    }
    private onEventTap: (event: CalendarEvent) => void;
    private onDateSelect: (date: Date) => void;
    private today: Date;
    private hourHeight: number;
    private weekDays: string[];
    /**
     * 获取本周的日期数组
     */
    getWeekDates(): Date[] {
        const dates: Date[] = [];
        const current = new Date(this.selectedDate);
        const dayOfWeek = current.getDay();
        // 找到本周日（周的开始）
        const sunday = new Date(current);
        sunday.setDate(current.getDate() - dayOfWeek);
        for (let i = 0; i < 7; i++) {
            const date = new Date(sunday);
            date.setDate(sunday.getDate() + i);
            dates.push(date);
        }
        return dates;
    }
    /**
     * 获取指定日期的事件
     */
    getEventsForDate(date: Date): CalendarEvent[] {
        return this.events.filter(event => this.isSameDay(event.startTime, date));
    }
    /**
     * 判断是否同一天
     */
    isSameDay(date1: Date, date2: Date): boolean {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    }
    /**
     * 判断是否今天
     */
    isToday(date: Date): boolean {
        return this.isSameDay(date, this.today);
    }
    /**
     * 判断是否选中日期
     */
    isSelected(date: Date): boolean {
        return this.isSameDay(date, this.selectedDate);
    }
    /**
     * 获取当前小时
     */
    getCurrentHour(): number {
        return this.today.getHours();
    }
    /**
     * 获取当前分钟
     */
    getCurrentMinute(): number {
        return this.today.getMinutes();
    }
    /**
     * 格式化日期显示
     */
    formatDateHeader(date: Date): string {
        return `${date.getDate()}`;
    }
    /**
     * 生成24小时数组
     */
    getHours(): number[] {
        const hours: number[] = [];
        for (let i = 0; i < 24; i++) {
            hours.push(i);
        }
        return hours;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/calendar/WeekView.ets(105:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(Constants.COLOR_BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 周日期头部
            Row.create();
            Row.debugLine("entry/src/main/ets/components/calendar/WeekView.ets(107:7)", "entry");
            // 周日期头部
            Row.width('100%');
            // 周日期头部
            Row.padding({ top: 8, bottom: 8, left: 8, right: 8 });
            // 周日期头部
            Row.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 时间列占位
            Column.create();
            Column.debugLine("entry/src/main/ets/components/calendar/WeekView.ets(109:9)", "entry");
            // 时间列占位
            Column.width(45);
        }, Column);
        // 时间列占位
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 7天日期
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const date = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.debugLine("entry/src/main/ets/components/calendar/WeekView.ets(114:11)", "entry");
                    Column.layoutWeight(1);
                    Column.onClick(() => {
                        this.onDateSelect(date);
                    });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(this.weekDays[index]);
                    Text.debugLine("entry/src/main/ets/components/calendar/WeekView.ets(115:13)", "entry");
                    Text.fontSize(11);
                    Text.fontColor(this.isToday(date) ? Constants.COLOR_PRIMARY : Constants.COLOR_TEXT_SECONDARY);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(this.formatDateHeader(date));
                    Text.debugLine("entry/src/main/ets/components/calendar/WeekView.ets(119:13)", "entry");
                    Text.fontSize(16);
                    Text.fontWeight(this.isToday(date) ? FontWeight.Bold : FontWeight.Normal);
                    Text.fontColor(this.isToday(date) ? '#FFFFFF' : Constants.COLOR_TEXT_PRIMARY);
                    Text.width(28);
                    Text.height(28);
                    Text.textAlign(TextAlign.Center);
                    Text.backgroundColor(this.isToday(date) ? Constants.COLOR_PRIMARY : Color.Transparent);
                    Text.borderRadius(14);
                    Text.margin({ top: 4 });
                }, Text);
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.getWeekDates(), forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        // 7天日期
        ForEach.pop();
        // 周日期头部
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 时间轴滚动区域
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/components/calendar/WeekView.ets(141:7)", "entry");
            // 时间轴滚动区域
            Scroll.layoutWeight(1);
            // 时间轴滚动区域
            Scroll.scrollBar(BarState.Off);
            // 时间轴滚动区域
            Scroll.edgeEffect(EdgeEffect.Spring);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.debugLine("entry/src/main/ets/components/calendar/WeekView.ets(142:9)", "entry");
            Stack.width('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 时间刻度行
            Column.create();
            Column.debugLine("entry/src/main/ets/components/calendar/WeekView.ets(144:11)", "entry");
            // 时间刻度行
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const hour = _item;
                {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        if (isInitialRender) {
                            let componentCall = new TimelineRow(this, {
                                hour: hour,
                                showCurrentTimeLine: hour === this.getCurrentHour(),
                                currentMinute: this.getCurrentMinute()
                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/calendar/WeekView.ets", line: 146, col: 15 });
                            ViewPU.create(componentCall);
                            let paramsLambda = () => {
                                return {
                                    hour: hour,
                                    showCurrentTimeLine: hour === this.getCurrentHour(),
                                    currentMinute: this.getCurrentMinute()
                                };
                            };
                            componentCall.paramsGenerator_ = paramsLambda;
                        }
                        else {
                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                hour: hour,
                                showCurrentTimeLine: hour === this.getCurrentHour(),
                                currentMinute: this.getCurrentMinute()
                            });
                        }
                    }, { name: "TimelineRow" });
                }
            };
            this.forEachUpdateFunction(elmtId, this.getHours(), forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底部留白给导航栏
            Row.create();
            Row.debugLine("entry/src/main/ets/components/calendar/WeekView.ets(153:13)", "entry");
            // 底部留白给导航栏
            Row.width('100%');
            // 底部留白给导航栏
            Row.height(80);
        }, Row);
        // 底部留白给导航栏
        Row.pop();
        // 时间刻度行
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 事件块（简化版：只显示选中日期的事件）
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const event = _item;
                {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        if (isInitialRender) {
                            let componentCall = new EventBlock(this, {
                                event: event,
                                hourHeight: this.hourHeight,
                                onEventTap: this.onEventTap
                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/calendar/WeekView.ets", line: 161, col: 13 });
                            ViewPU.create(componentCall);
                            let paramsLambda = () => {
                                return {
                                    event: event,
                                    hourHeight: this.hourHeight,
                                    onEventTap: this.onEventTap
                                };
                            };
                            componentCall.paramsGenerator_ = paramsLambda;
                        }
                        else {
                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                event: event,
                                hourHeight: this.hourHeight
                            });
                        }
                    }, { name: "EventBlock" });
                }
            };
            this.forEachUpdateFunction(elmtId, this.getEventsForDate(ObservedObject.GetRawObject(this.selectedDate)), forEachItemGenFunction);
        }, ForEach);
        // 事件块（简化版：只显示选中日期的事件）
        ForEach.pop();
        Stack.pop();
        // 时间轴滚动区域
        Scroll.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
