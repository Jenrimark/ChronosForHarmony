if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface DayView_Params {
    selectedDate?: Date;
    events?: CalendarEvent[];
    calendarInfo?: MxnzpHolidayData | null;
    onEventTap?: (event: CalendarEvent) => void;
    today?: Date;
    hourHeight?: number;
}
import type { CalendarEvent } from '../../model/CalendarEvent';
import type { MxnzpHolidayData } from '../../model/Holiday';
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import { TimelineRow } from "@normalized:N&&&entry/src/main/ets/components/calendar/TimelineRow&";
import { EventBlock } from "@normalized:N&&&entry/src/main/ets/components/calendar/EventBlock&";
export class DayView extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__selectedDate = new SynchedPropertyObjectTwoWayPU(params.selectedDate, this, "selectedDate");
        this.__events = new SynchedPropertyObjectOneWayPU(params.events, this, "events");
        this.__calendarInfo = new SynchedPropertyObjectOneWayPU(params.calendarInfo, this, "calendarInfo");
        this.onEventTap = () => { };
        this.today = new Date();
        this.hourHeight = 60;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: DayView_Params) {
        if (params.events === undefined) {
            this.__events.set([]);
        }
        if (params.calendarInfo === undefined) {
            this.__calendarInfo.set(null);
        }
        if (params.onEventTap !== undefined) {
            this.onEventTap = params.onEventTap;
        }
        if (params.today !== undefined) {
            this.today = params.today;
        }
        if (params.hourHeight !== undefined) {
            this.hourHeight = params.hourHeight;
        }
    }
    updateStateVars(params: DayView_Params) {
        this.__events.reset(params.events);
        this.__calendarInfo.reset(params.calendarInfo);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__selectedDate.purgeDependencyOnElmtId(rmElmtId);
        this.__events.purgeDependencyOnElmtId(rmElmtId);
        this.__calendarInfo.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__selectedDate.aboutToBeDeleted();
        this.__events.aboutToBeDeleted();
        this.__calendarInfo.aboutToBeDeleted();
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
    private __calendarInfo: SynchedPropertySimpleOneWayPU<MxnzpHolidayData | null>;
    get calendarInfo() {
        return this.__calendarInfo.get();
    }
    set calendarInfo(newValue: MxnzpHolidayData | null) {
        this.__calendarInfo.set(newValue);
    }
    private onEventTap: (event: CalendarEvent) => void;
    private today: Date;
    private hourHeight: number;
    /**
     * 获取当天的事件
     */
    getTodayEvents(): CalendarEvent[] {
        return this.events.filter(event => this.isSameDay(event.startTime, this.selectedDate));
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
    isToday(): boolean {
        return this.isSameDay(this.selectedDate, this.today);
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
    formatDate(): string {
        const year = this.selectedDate.getFullYear();
        const month = this.selectedDate.getMonth() + 1;
        const day = this.selectedDate.getDate();
        return `${year}年${month}月${day}日`;
    }
    /**
     * 获取星期几
     */
    getWeekDay(): string {
        const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        return weekDays[this.selectedDate.getDay()];
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
            Column.debugLine("entry/src/main/ets/components/calendar/DayView.ets(88:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(Constants.COLOR_BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 日期信息头部
            Column.create();
            Column.debugLine("entry/src/main/ets/components/calendar/DayView.ets(90:7)", "entry");
            // 日期信息头部
            Column.width('100%');
            // 日期信息头部
            Column.padding(16);
            // 日期信息头部
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            // 日期信息头部
            Column.borderRadius({ bottomLeft: 16, bottomRight: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/calendar/DayView.ets(91:9)", "entry");
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/calendar/DayView.ets(92:11)", "entry");
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 公历日期
            Text.create(this.formatDate());
            Text.debugLine("entry/src/main/ets/components/calendar/DayView.ets(94:13)", "entry");
            // 公历日期
            Text.fontSize(18);
            // 公历日期
            Text.fontWeight(FontWeight.Bold);
            // 公历日期
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        // 公历日期
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 星期
            Text.create(this.getWeekDay());
            Text.debugLine("entry/src/main/ets/components/calendar/DayView.ets(100:13)", "entry");
            // 星期
            Text.fontSize(14);
            // 星期
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            // 星期
            Text.margin({ top: 4 });
        }, Text);
        // 星期
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/components/calendar/DayView.ets(107:11)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 农历信息
            if (this.calendarInfo) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/calendar/DayView.ets(111:13)", "entry");
                        Column.alignItems(HorizontalAlign.End);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.calendarInfo.lunarCalendar || '');
                        Text.debugLine("entry/src/main/ets/components/calendar/DayView.ets(112:15)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/components/calendar/DayView.ets(116:15)", "entry");
                        Row.margin({ top: 4 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.calendarInfo.yearTips) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`${this.calendarInfo.yearTips}年`);
                                    Text.debugLine("entry/src/main/ets/components/calendar/DayView.ets(118:19)", "entry");
                                    Text.fontSize(12);
                                    Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
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
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.calendarInfo.chineseZodiac) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`${this.calendarInfo.chineseZodiac}`);
                                    Text.debugLine("entry/src/main/ets/components/calendar/DayView.ets(123:19)", "entry");
                                    Text.fontSize(12);
                                    Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                                    Text.margin({ left: 8 });
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
                    Row.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 节气和星座
            if (this.calendarInfo) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/components/calendar/DayView.ets(138:11)", "entry");
                        Row.width('100%');
                        Row.margin({ top: 8 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.calendarInfo.solarTerms && this.calendarInfo.solarTerms !== '无') {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`🌿 ${this.calendarInfo.solarTerms}`);
                                    Text.debugLine("entry/src/main/ets/components/calendar/DayView.ets(140:15)", "entry");
                                    Text.fontSize(12);
                                    Text.fontColor(Constants.COLOR_SUCCESS);
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
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.calendarInfo.constellation) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`⭐ ${this.calendarInfo.constellation}`);
                                    Text.debugLine("entry/src/main/ets/components/calendar/DayView.ets(145:15)", "entry");
                                    Text.fontSize(12);
                                    Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                                    Text.margin({ left: 12 });
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
                    Row.pop();
                });
            }
            // 今日标记
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 今日标记
            if (this.isToday()) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('今天');
                        Text.debugLine("entry/src/main/ets/components/calendar/DayView.ets(157:11)", "entry");
                        Text.fontSize(12);
                        Text.fontColor('#FFFFFF');
                        Text.backgroundColor(Constants.COLOR_PRIMARY);
                        Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
                        Text.borderRadius(12);
                        Text.margin({ top: 8 });
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
        // 日期信息头部
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 时间轴滚动区域
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/components/calendar/DayView.ets(172:7)", "entry");
            // 时间轴滚动区域
            Scroll.layoutWeight(1);
            // 时间轴滚动区域
            Scroll.scrollBar(BarState.Off);
            // 时间轴滚动区域
            Scroll.edgeEffect(EdgeEffect.Spring);
            // 时间轴滚动区域
            Scroll.margin({ top: 8 });
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.debugLine("entry/src/main/ets/components/calendar/DayView.ets(173:9)", "entry");
            Stack.width('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 时间刻度行
            Column.create();
            Column.debugLine("entry/src/main/ets/components/calendar/DayView.ets(175:11)", "entry");
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
                                showCurrentTimeLine: this.isToday() && hour === this.getCurrentHour(),
                                currentMinute: this.getCurrentMinute()
                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/calendar/DayView.ets", line: 177, col: 15 });
                            ViewPU.create(componentCall);
                            let paramsLambda = () => {
                                return {
                                    hour: hour,
                                    showCurrentTimeLine: this.isToday() && hour === this.getCurrentHour(),
                                    currentMinute: this.getCurrentMinute()
                                };
                            };
                            componentCall.paramsGenerator_ = paramsLambda;
                        }
                        else {
                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                hour: hour,
                                showCurrentTimeLine: this.isToday() && hour === this.getCurrentHour(),
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
            Row.debugLine("entry/src/main/ets/components/calendar/DayView.ets(184:13)", "entry");
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
            // 事件块
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
                            }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/calendar/DayView.ets", line: 192, col: 13 });
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
            this.forEachUpdateFunction(elmtId, this.getTodayEvents(), forEachItemGenFunction);
        }, ForEach);
        // 事件块
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
