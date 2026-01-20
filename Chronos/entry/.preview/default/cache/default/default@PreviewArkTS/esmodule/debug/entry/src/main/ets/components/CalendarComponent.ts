if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CalendarComponent_Params {
    selectedDate?: Date;
    tasks?: Task[];
    holidays?: Holiday[];
    selectedDateChanged?: Date;
    monthChangeTrigger?: number;
    currentMonth?: Date;
    calendarDays?: Date[];
    lastMonthKey?: number;
}
import { Utils } from "@normalized:N&&&entry/src/main/ets/common/Utils&";
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import type { Task } from '../model/Task';
import type { Holiday } from '../model/Holiday';
export class CalendarComponent extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__selectedDate = new SynchedPropertyObjectOneWayPU(params.selectedDate, this, "selectedDate");
        this.__tasks = new SynchedPropertyObjectOneWayPU(params.tasks, this, "tasks");
        this.__holidays = new SynchedPropertyObjectOneWayPU(params.holidays, this, "holidays");
        this.__selectedDateChanged = new SynchedPropertyObjectTwoWayPU(params.selectedDateChanged, this, "selectedDateChanged");
        this.__monthChangeTrigger = new SynchedPropertySimpleTwoWayPU(params.monthChangeTrigger, this, "monthChangeTrigger");
        this.__currentMonth = new ObservedPropertyObjectPU(new Date(), this, "currentMonth");
        this.__calendarDays = new ObservedPropertyObjectPU([], this, "calendarDays");
        this.lastMonthKey = 0;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CalendarComponent_Params) {
        if (params.selectedDate === undefined) {
            this.__selectedDate.set(new Date());
        }
        if (params.tasks === undefined) {
            this.__tasks.set([]);
        }
        if (params.holidays === undefined) {
            this.__holidays.set([]);
        }
        if (params.currentMonth !== undefined) {
            this.currentMonth = params.currentMonth;
        }
        if (params.calendarDays !== undefined) {
            this.calendarDays = params.calendarDays;
        }
        if (params.lastMonthKey !== undefined) {
            this.lastMonthKey = params.lastMonthKey;
        }
    }
    updateStateVars(params: CalendarComponent_Params) {
        this.__selectedDate.reset(params.selectedDate);
        this.__tasks.reset(params.tasks);
        this.__holidays.reset(params.holidays);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__selectedDate.purgeDependencyOnElmtId(rmElmtId);
        this.__tasks.purgeDependencyOnElmtId(rmElmtId);
        this.__holidays.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedDateChanged.purgeDependencyOnElmtId(rmElmtId);
        this.__monthChangeTrigger.purgeDependencyOnElmtId(rmElmtId);
        this.__currentMonth.purgeDependencyOnElmtId(rmElmtId);
        this.__calendarDays.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__selectedDate.aboutToBeDeleted();
        this.__tasks.aboutToBeDeleted();
        this.__holidays.aboutToBeDeleted();
        this.__selectedDateChanged.aboutToBeDeleted();
        this.__monthChangeTrigger.aboutToBeDeleted();
        this.__currentMonth.aboutToBeDeleted();
        this.__calendarDays.aboutToBeDeleted();
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
    private __tasks: SynchedPropertySimpleOneWayPU<Task[]>;
    get tasks() {
        return this.__tasks.get();
    }
    set tasks(newValue: Task[]) {
        this.__tasks.set(newValue);
    }
    private __holidays: SynchedPropertySimpleOneWayPU<Holiday[]>;
    get holidays() {
        return this.__holidays.get();
    }
    set holidays(newValue: Holiday[]) {
        this.__holidays.set(newValue);
    }
    private __selectedDateChanged: SynchedPropertySimpleOneWayPU<Date>;
    get selectedDateChanged() {
        return this.__selectedDateChanged.get();
    }
    set selectedDateChanged(newValue: Date) {
        this.__selectedDateChanged.set(newValue);
    }
    private __monthChangeTrigger: SynchedPropertySimpleTwoWayPU<number>;
    get monthChangeTrigger() {
        return this.__monthChangeTrigger.get();
    }
    set monthChangeTrigger(newValue: number) {
        this.__monthChangeTrigger.set(newValue);
    }
    private __currentMonth: ObservedPropertyObjectPU<Date>;
    get currentMonth() {
        return this.__currentMonth.get();
    }
    set currentMonth(newValue: Date) {
        this.__currentMonth.set(newValue);
    }
    private __calendarDays: ObservedPropertyObjectPU<Date[]>;
    get calendarDays() {
        return this.__calendarDays.get();
    }
    set calendarDays(newValue: Date[]) {
        this.__calendarDays.set(newValue);
    }
    private lastMonthKey: number;
    aboutToAppear() {
        const monthKey = this.currentMonth.getFullYear() * 100 + this.currentMonth.getMonth();
        this.lastMonthKey = monthKey;
        this.updateCalendarDays();
    }
    /**
     * 更新日历天数
     */
    updateCalendarDays(): void {
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // 周一为0
        const days: Date[] = [];
        // 填充上个月的日期
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            days.push(new Date(year, month - 1, prevMonthLastDay - i));
        }
        // 填充当前月的日期
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }
        // 填充下个月的日期（补齐42天）
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push(new Date(year, month + 1, i));
        }
        this.calendarDays = days;
    }
    /**
     * 获取日期对应的任务数量
     */
    getTaskCountForDate(date: Date): number {
        return this.tasks.filter(task => {
            if (!task.dueDate)
                return false;
            return Utils.isSameDay(date, task.dueDate);
        }).length;
    }
    /**
     * 获取日期对应的节假日
     */
    getHolidaysForDate(date: Date): Holiday[] {
        return this.holidays.filter(holiday => {
            return Utils.isSameDay(date, holiday.date);
        });
    }
    /**
     * 判断日期是否有节假日
     */
    hasHoliday(date: Date): boolean {
        return this.getHolidaysForDate(date).length > 0;
    }
    /**
     * 获取节假日的显示名称（取第一个）
     */
    getHolidayName(date: Date): string {
        const holidays = this.getHolidaysForDate(date);
        if (holidays.length > 0) {
            return holidays[0].name;
        }
        return '';
    }
    /**
     * 判断日期是否是今天
     */
    isToday(date: Date): boolean {
        return Utils.isSameDay(date, new Date());
    }
    /**
     * 判断日期是否被选中
     */
    isSelected(date: Date): boolean {
        return Utils.isSameDay(date, this.selectedDate);
    }
    /**
     * 判断日期是否是当前月
     */
    isCurrentMonth(date: Date): boolean {
        return date.getMonth() === this.currentMonth.getMonth() &&
            date.getFullYear() === this.currentMonth.getFullYear();
    }
    /**
     * 上一个月
     */
    prevMonth(): void {
        const newDate = new Date(this.currentMonth);
        newDate.setMonth(newDate.getMonth() - 1);
        this.currentMonth = newDate;
        const monthKey = this.currentMonth.getFullYear() * 100 + this.currentMonth.getMonth();
        if (monthKey !== this.lastMonthKey) {
            this.lastMonthKey = monthKey;
            // 编码月份信息：year*10000 + month*100
            this.monthChangeTrigger = this.currentMonth.getFullYear() * 10000 + this.currentMonth.getMonth() * 100;
        }
        this.updateCalendarDays();
    }
    /**
     * 下一个月
     */
    nextMonth(): void {
        const newDate = new Date(this.currentMonth);
        newDate.setMonth(newDate.getMonth() + 1);
        this.currentMonth = newDate;
        const monthKey = this.currentMonth.getFullYear() * 100 + this.currentMonth.getMonth();
        if (monthKey !== this.lastMonthKey) {
            this.lastMonthKey = monthKey;
            // 编码月份信息：year*10000 + month*100
            this.monthChangeTrigger = this.currentMonth.getFullYear() * 10000 + this.currentMonth.getMonth() * 100;
        }
        this.updateCalendarDays();
    }
    /**
     * 选择日期
     */
    selectDate(date: Date): void {
        this.selectedDateChanged = date;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/CalendarComponent.ets(158:5)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 月份导航栏
            Row.create();
            Row.debugLine("entry/src/main/ets/components/CalendarComponent.ets(160:7)", "entry");
            // 月份导航栏
            Row.width('100%');
            // 月份导航栏
            Row.padding({ left: 16, right: 16, top: 8, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('<');
            Text.debugLine("entry/src/main/ets/components/CalendarComponent.ets(161:9)", "entry");
            Text.fontSize(20);
            Text.fontColor(Constants.COLOR_PRIMARY);
            Text.fontWeight(FontWeight.Bold);
            Text.width(40);
            Text.height(40);
            Text.textAlign(TextAlign.Center);
            Text.onClick(() => this.prevMonth());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.currentMonth.getFullYear()}年${this.currentMonth.getMonth() + 1}月`);
            Text.debugLine("entry/src/main/ets/components/CalendarComponent.ets(170:9)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('>');
            Text.debugLine("entry/src/main/ets/components/CalendarComponent.ets(177:9)", "entry");
            Text.fontSize(20);
            Text.fontColor(Constants.COLOR_PRIMARY);
            Text.fontWeight(FontWeight.Bold);
            Text.width(40);
            Text.height(40);
            Text.textAlign(TextAlign.Center);
            Text.onClick(() => this.nextMonth());
        }, Text);
        Text.pop();
        // 月份导航栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 星期标题
            Row.create();
            Row.debugLine("entry/src/main/ets/components/CalendarComponent.ets(190:7)", "entry");
            // 星期标题
            Row.width('100%');
            // 星期标题
            Row.padding({ left: 8, right: 8, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const day = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(day);
                    Text.debugLine("entry/src/main/ets/components/CalendarComponent.ets(192:11)", "entry");
                    Text.fontSize(14);
                    Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                    Text.layoutWeight(1);
                    Text.textAlign(TextAlign.Center);
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, ['一', '二', '三', '四', '五', '六', '日'], forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        // 星期标题
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 日历网格
            Grid.create();
            Grid.debugLine("entry/src/main/ets/components/CalendarComponent.ets(203:7)", "entry");
            // 日历网格
            Grid.columnsTemplate('1fr 1fr 1fr 1fr 1fr 1fr 1fr');
            // 日历网格
            Grid.rowsTemplate('1fr 1fr 1fr 1fr 1fr 1fr');
            // 日历网格
            Grid.width('100%');
            // 日历网格
            Grid.height(300);
            // 日历网格
            Grid.padding({ left: 8, right: 8 });
        }, Grid);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const date = _item;
                {
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        GridItem.create(() => { }, false);
                        GridItem.debugLine("entry/src/main/ets/components/CalendarComponent.ets(205:11)", "entry");
                    };
                    const observedDeepRender = () => {
                        this.observeComponentCreation2(itemCreation2, GridItem);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Column.create();
                            Column.debugLine("entry/src/main/ets/components/CalendarComponent.ets(206:13)", "entry");
                            Column.width('100%');
                            Column.height('100%');
                            Column.justifyContent(FlexAlign.Center);
                            Column.backgroundColor(this.isSelected(date)
                                ? Constants.COLOR_PRIMARY
                                : (this.isToday(date) ? Constants.COLOR_PRIMARY : Color.Transparent));
                            Column.borderRadius(4);
                            Column.onClick(() => {
                                if (this.isCurrentMonth(date)) {
                                    this.selectDate(date);
                                }
                            });
                        }, Column);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(date.getDate().toString());
                            Text.debugLine("entry/src/main/ets/components/CalendarComponent.ets(207:15)", "entry");
                            Text.fontSize(14);
                            Text.fontColor(this.isCurrentMonth(date)
                                ? (this.isToday(date) ? Constants.COLOR_TEXT_ON_PRIMARY : Constants.COLOR_TEXT_PRIMARY)
                                : Constants.COLOR_TEXT_SECONDARY);
                            Text.fontWeight(this.isToday(date) ? FontWeight.Bold : FontWeight.Normal);
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            if (this.hasHoliday(date)) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(this.getHolidayName(date));
                                        Text.debugLine("entry/src/main/ets/components/CalendarComponent.ets(217:17)", "entry");
                                        Text.fontSize(9);
                                        Text.fontColor(Constants.COLOR_PRIMARY_LIGHT);
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
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            if (this.getTaskCountForDate(date) > 0) {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(this.getTaskCountForDate(date).toString());
                                        Text.debugLine("entry/src/main/ets/components/CalendarComponent.ets(226:17)", "entry");
                                        Text.fontSize(10);
                                        Text.fontColor(Constants.COLOR_PRIMARY);
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
                        GridItem.pop();
                    };
                    observedDeepRender();
                }
            };
            this.forEachUpdateFunction(elmtId, this.calendarDays, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        // 日历网格
        Grid.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
