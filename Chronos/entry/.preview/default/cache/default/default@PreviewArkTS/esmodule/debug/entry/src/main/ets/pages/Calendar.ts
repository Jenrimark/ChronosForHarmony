if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CalendarPage_Params {
    selectedDate?: Date;
    currentMonth?: Date;
    calendarDays?: CalendarDay[];
    selectedDateTasks?: Task[];
    allTasks?: Task[];
    holidays?: Holiday[];
    tapActionId?: number;
    completeActionId?: number;
    deleteActionId?: number;
    showDetail?: boolean;
    taskService?: TaskService;
    holidayService?: HolidayService;
    today?: Date;
}
import { TaskItem } from "@normalized:N&&&entry/src/main/ets/components/TaskItem&";
import { TaskService } from "@normalized:N&&&entry/src/main/ets/service/TaskService&";
import { HolidayService } from "@normalized:N&&&entry/src/main/ets/service/HolidayService&";
import type { Task } from '../model/Task';
import type { Holiday } from '../model/Holiday';
import { Utils } from "@normalized:N&&&entry/src/main/ets/common/Utils&";
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
/**
 * 日历日期项
 */
interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    taskCount: number;
    holidays: Holiday[];
    lunarDate: string; // 农历日期字符串（暂时为空，待SDK支持后实现）
}
export class CalendarPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__selectedDate = new ObservedPropertyObjectPU(new Date(), this, "selectedDate");
        this.__currentMonth = new ObservedPropertyObjectPU(new Date(), this, "currentMonth");
        this.__calendarDays = new ObservedPropertyObjectPU([], this, "calendarDays");
        this.__selectedDateTasks = new ObservedPropertyObjectPU([], this, "selectedDateTasks");
        this.__allTasks = new ObservedPropertyObjectPU([], this, "allTasks");
        this.__holidays = new ObservedPropertyObjectPU([], this, "holidays");
        this.__tapActionId = new ObservedPropertySimplePU(0, this, "tapActionId");
        this.__completeActionId = new ObservedPropertySimplePU(0, this, "completeActionId");
        this.__deleteActionId = new ObservedPropertySimplePU(0, this, "deleteActionId");
        this.__showDetail = new ObservedPropertySimplePU(false, this, "showDetail");
        this.taskService = TaskService.getInstance();
        this.holidayService = HolidayService.getInstance();
        this.today = new Date();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CalendarPage_Params) {
        if (params.selectedDate !== undefined) {
            this.selectedDate = params.selectedDate;
        }
        if (params.currentMonth !== undefined) {
            this.currentMonth = params.currentMonth;
        }
        if (params.calendarDays !== undefined) {
            this.calendarDays = params.calendarDays;
        }
        if (params.selectedDateTasks !== undefined) {
            this.selectedDateTasks = params.selectedDateTasks;
        }
        if (params.allTasks !== undefined) {
            this.allTasks = params.allTasks;
        }
        if (params.holidays !== undefined) {
            this.holidays = params.holidays;
        }
        if (params.tapActionId !== undefined) {
            this.tapActionId = params.tapActionId;
        }
        if (params.completeActionId !== undefined) {
            this.completeActionId = params.completeActionId;
        }
        if (params.deleteActionId !== undefined) {
            this.deleteActionId = params.deleteActionId;
        }
        if (params.showDetail !== undefined) {
            this.showDetail = params.showDetail;
        }
        if (params.taskService !== undefined) {
            this.taskService = params.taskService;
        }
        if (params.holidayService !== undefined) {
            this.holidayService = params.holidayService;
        }
        if (params.today !== undefined) {
            this.today = params.today;
        }
    }
    updateStateVars(params: CalendarPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__selectedDate.purgeDependencyOnElmtId(rmElmtId);
        this.__currentMonth.purgeDependencyOnElmtId(rmElmtId);
        this.__calendarDays.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedDateTasks.purgeDependencyOnElmtId(rmElmtId);
        this.__allTasks.purgeDependencyOnElmtId(rmElmtId);
        this.__holidays.purgeDependencyOnElmtId(rmElmtId);
        this.__tapActionId.purgeDependencyOnElmtId(rmElmtId);
        this.__completeActionId.purgeDependencyOnElmtId(rmElmtId);
        this.__deleteActionId.purgeDependencyOnElmtId(rmElmtId);
        this.__showDetail.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__selectedDate.aboutToBeDeleted();
        this.__currentMonth.aboutToBeDeleted();
        this.__calendarDays.aboutToBeDeleted();
        this.__selectedDateTasks.aboutToBeDeleted();
        this.__allTasks.aboutToBeDeleted();
        this.__holidays.aboutToBeDeleted();
        this.__tapActionId.aboutToBeDeleted();
        this.__completeActionId.aboutToBeDeleted();
        this.__deleteActionId.aboutToBeDeleted();
        this.__showDetail.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __selectedDate: ObservedPropertyObjectPU<Date>;
    get selectedDate() {
        return this.__selectedDate.get();
    }
    set selectedDate(newValue: Date) {
        this.__selectedDate.set(newValue);
    }
    private __currentMonth: ObservedPropertyObjectPU<Date>;
    get currentMonth() {
        return this.__currentMonth.get();
    }
    set currentMonth(newValue: Date) {
        this.__currentMonth.set(newValue);
    }
    private __calendarDays: ObservedPropertyObjectPU<CalendarDay[]>;
    get calendarDays() {
        return this.__calendarDays.get();
    }
    set calendarDays(newValue: CalendarDay[]) {
        this.__calendarDays.set(newValue);
    }
    private __selectedDateTasks: ObservedPropertyObjectPU<Task[]>;
    get selectedDateTasks() {
        return this.__selectedDateTasks.get();
    }
    set selectedDateTasks(newValue: Task[]) {
        this.__selectedDateTasks.set(newValue);
    }
    private __allTasks: ObservedPropertyObjectPU<Task[]>;
    get allTasks() {
        return this.__allTasks.get();
    }
    set allTasks(newValue: Task[]) {
        this.__allTasks.set(newValue);
    }
    private __holidays: ObservedPropertyObjectPU<Holiday[]>;
    get holidays() {
        return this.__holidays.get();
    }
    set holidays(newValue: Holiday[]) {
        this.__holidays.set(newValue);
    }
    private __tapActionId: ObservedPropertySimplePU<number>;
    get tapActionId() {
        return this.__tapActionId.get();
    }
    set tapActionId(newValue: number) {
        this.__tapActionId.set(newValue);
    }
    private __completeActionId: ObservedPropertySimplePU<number>;
    get completeActionId() {
        return this.__completeActionId.get();
    }
    set completeActionId(newValue: number) {
        this.__completeActionId.set(newValue);
    }
    private __deleteActionId: ObservedPropertySimplePU<number>;
    get deleteActionId() {
        return this.__deleteActionId.get();
    }
    set deleteActionId(newValue: number) {
        this.__deleteActionId.set(newValue);
    }
    private __showDetail: ObservedPropertySimplePU<boolean>; // 是否显示详情
    get showDetail() {
        return this.__showDetail.get();
    }
    set showDetail(newValue: boolean) {
        this.__showDetail.set(newValue);
    }
    private taskService: TaskService;
    private holidayService: HolidayService;
    private today: Date;
    aboutToAppear() {
        this.loadTasks();
        this.loadHolidays();
        this.updateCalendarDays();
    }
    /**
     * 加载所有任务
     */
    async loadTasks(): Promise<void> {
        const tasks = await this.taskService.getAllTasks();
        this.allTasks = [...tasks];
        this.updateSelectedDateTasks();
        this.updateCalendarDays();
    }
    /**
     * 加载节假日
     */
    async loadHolidays(): Promise<void> {
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        const loadedHolidays = await this.holidayService.getHolidaysByMonth(year, month);
        this.holidays = [...loadedHolidays];
        this.updateCalendarDays();
    }
    /**
     * 更新日历日期数组
     */
    updateCalendarDays(): void {
        const days: CalendarDay[] = [];
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        // 获取当月第一天和最后一天
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        // 获取当月第一天是星期几（0=周日，1=周一...）
        const firstDayWeek = firstDay.getDay();
        const startDay = firstDayWeek === 0 ? 6 : firstDayWeek - 1; // 转换为周一为0
        // 获取上个月的最后几天
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startDay - 1; i >= 0; i--) {
            const date = new Date(year, month - 1, prevMonthLastDay - i);
            days.push(this.createCalendarDay(date, false));
        }
        // 获取当月的所有日期
        const daysInMonth = lastDay.getDate();
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            days.push(this.createCalendarDay(date, true));
        }
        // 补齐到6行（42天）
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            const date = new Date(year, month + 1, i);
            days.push(this.createCalendarDay(date, false));
        }
        this.calendarDays = [...days];
    }
    /**
     * 获取农历日期字符串
     * TODO: 待SDK支持@kit.I18nKit后实现
     */
    getLunarDate(date: Date): string {
        // 暂时返回空字符串，待SDK支持农历API后实现
        // 示例实现（需要@kit.I18nKit支持）：
        // const lunarCalendar = i18n.Calendar.getInstance('chinese');
        // lunarCalendar.setTime(date);
        // const lunarDay = lunarCalendar.getField('d');
        // return this.formatLunarDay(lunarDay);
        return '';
    }
    /**
     * 格式化农历日为中文数字
     */
    formatLunarDay(day: number): string {
        const lunarDayNames = [
            '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
            '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
            '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
        ];
        if (day >= 0 && day < lunarDayNames.length) {
            return lunarDayNames[day];
        }
        return '';
    }
    /**
     * 获取完整农历日期字符串（用于详情显示）
     * TODO: 待SDK支持@kit.I18nKit后实现
     */
    getFullLunarDate(date: Date): string {
        // 暂时返回空字符串，待SDK支持农历API后实现
        return '';
    }
    /**
     * 创建日历日期项
     */
    createCalendarDay(date: Date, isCurrentMonth: boolean): CalendarDay {
        const isToday = Utils.isSameDay(date, this.today);
        const isSelected = Utils.isSameDay(date, this.selectedDate);
        const taskCount = this.getTaskCountForDate(date);
        const dateHolidays = this.getHolidaysForDate(date);
        const lunarDate = this.getLunarDate(date);
        return {
            date: date,
            isCurrentMonth: isCurrentMonth,
            isToday: isToday,
            isSelected: isSelected,
            taskCount: taskCount,
            holidays: dateHolidays,
            lunarDate: lunarDate
        };
    }
    /**
     * 更新选中日期的任务
     */
    updateSelectedDateTasks(): void {
        const filtered = this.allTasks.filter(task => {
            if (!task.dueDate)
                return false;
            return Utils.isSameDay(task.dueDate, this.selectedDate);
        });
        this.selectedDateTasks = [...filtered];
    }
    /**
     * 监听状态变化
     */
    aboutToUpdate() {
        if (this.completeActionId > 0) {
            const task = this.allTasks.find(t => t.id === this.completeActionId);
            if (task) {
                this.onTaskComplete(task);
            }
            this.completeActionId = 0;
        }
        if (this.deleteActionId > 0) {
            const task = this.allTasks.find(t => t.id === this.deleteActionId);
            if (task) {
                this.onTaskDelete(task);
            }
            this.deleteActionId = 0;
        }
        if (this.tapActionId > 0) {
            const task = this.allTasks.find(t => t.id === this.tapActionId);
            if (task) {
                this.onTaskTap(task);
            }
            this.tapActionId = 0;
        }
        this.updateSelectedDateTasks();
    }
    /**
     * 完成任务
     */
    async onTaskComplete(task: Task): Promise<void> {
        if (task.status === Constants.TASK_STATUS_COMPLETED) {
            await this.taskService.uncompleteTask(task);
        }
        else {
            await this.taskService.completeTask(task);
        }
        await this.loadTasks();
    }
    /**
     * 删除任务
     */
    async onTaskDelete(task: Task): Promise<void> {
        await this.taskService.deleteTask(task.id);
        await this.loadTasks();
    }
    /**
     * 跳转到任务详情/编辑
     */
    onTaskTap(task: Task): void {
        console.info('点击任务:', task.title);
    }
    /**
     * 选择日期
     */
    onDateSelect(day: CalendarDay): void {
        if (!day.isCurrentMonth) {
            // 如果点击的是上个月或下个月的日期，切换月份
            this.currentMonth = new Date(day.date.getFullYear(), day.date.getMonth(), 1);
            this.loadHolidays();
        }
        this.selectedDate = day.date;
        this.updateSelectedDateTasks();
        this.showDetail = true; // 显示详情
    }
    /**
     * 上一个月
     */
    prevMonth(): void {
        const newMonth = new Date(this.currentMonth);
        newMonth.setMonth(newMonth.getMonth() - 1);
        this.currentMonth = newMonth;
        this.loadHolidays();
        this.updateCalendarDays();
    }
    /**
     * 下一个月
     */
    nextMonth(): void {
        const newMonth = new Date(this.currentMonth);
        newMonth.setMonth(newMonth.getMonth() + 1);
        this.currentMonth = newMonth;
        this.loadHolidays();
        this.updateCalendarDays();
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
     * 获取日期对应的任务数量
     */
    getTaskCountForDate(date: Date): number {
        return this.allTasks.filter(task => {
            if (!task.dueDate)
                return false;
            return Utils.isSameDay(date, task.dueDate);
        }).length;
    }
    /**
     * 构建日历网格
     */
    buildCalendarGrid(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Calendar.ets(294:5)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 星期标题行
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Calendar.ets(296:7)", "entry");
            // 星期标题行
            Row.width('100%');
            // 星期标题行
            Row.height(40);
            // 星期标题行
            Row.padding({ left: 8, right: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const day = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(day);
                    Text.debugLine("entry/src/main/ets/pages/Calendar.ets(298:11)", "entry");
                    Text.fontSize(14);
                    Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                    Text.width('14.28%');
                    Text.textAlign(TextAlign.Center);
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, ['一', '二', '三', '四', '五', '六', '日'], forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        // 星期标题行
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 日期网格
            Grid.create();
            Grid.debugLine("entry/src/main/ets/pages/Calendar.ets(310:7)", "entry");
            // 日期网格
            Grid.columnsTemplate('1fr 1fr 1fr 1fr 1fr 1fr 1fr');
            // 日期网格
            Grid.rowsTemplate('1fr 1fr 1fr 1fr 1fr 1fr');
            // 日期网格
            Grid.width('100%');
            // 日期网格
            Grid.height(360);
            // 日期网格
            Grid.padding({ left: 8, right: 8, top: 8, bottom: 8 });
        }, Grid);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const day = _item;
                {
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        GridItem.create(() => { }, false);
                        GridItem.debugLine("entry/src/main/ets/pages/Calendar.ets(312:11)", "entry");
                    };
                    const observedDeepRender = () => {
                        this.observeComponentCreation2(itemCreation2, GridItem);
                        this.buildCalendarDay.bind(this)(day);
                        GridItem.pop();
                    };
                    observedDeepRender();
                }
            };
            this.forEachUpdateFunction(elmtId, this.calendarDays, forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        // 日期网格
        Grid.pop();
        Column.pop();
    }
    /**
     * 构建单个日期单元格
     */
    buildCalendarDay(day: CalendarDay, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Calendar.ets(331:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.backgroundColor(day.isSelected ? Constants.COLOR_PRIMARY_LIGHT : 'transparent');
            Column.borderRadius(8);
            Column.onClick(() => {
                this.onDateSelect(day);
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 日期数字
            Text.create(`${day.date.getDate()}`);
            Text.debugLine("entry/src/main/ets/pages/Calendar.ets(333:7)", "entry");
            // 日期数字
            Text.fontSize(16);
            // 日期数字
            Text.fontWeight(day.isToday || day.isSelected ? FontWeight.Bold : FontWeight.Normal);
            // 日期数字
            Text.fontColor(this.getDateTextColor(day));
            // 日期数字
            Text.margin({ bottom: 2 });
        }, Text);
        // 日期数字
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 农历日期
            if (day.lunarDate && day.isCurrentMonth) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(day.lunarDate);
                        Text.debugLine("entry/src/main/ets/pages/Calendar.ets(341:9)", "entry");
                        Text.fontSize(10);
                        Text.fontColor(this.getLunarTextColor(day));
                        Text.margin({ bottom: 2 });
                    }, Text);
                    Text.pop();
                });
            }
            // 任务/节假日标记
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 任务/节假日标记
            if (day.taskCount > 0 || day.holidays.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/Calendar.ets(349:9)", "entry");
                        Row.justifyContent(FlexAlign.Center);
                        Row.height(12);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (day.taskCount > 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('●');
                                    Text.debugLine("entry/src/main/ets/pages/Calendar.ets(351:13)", "entry");
                                    Text.fontSize(8);
                                    Text.fontColor(Constants.COLOR_PRIMARY);
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
                        if (day.holidays.length > 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('●');
                                    Text.debugLine("entry/src/main/ets/pages/Calendar.ets(356:13)", "entry");
                                    Text.fontSize(8);
                                    Text.fontColor(Constants.COLOR_DANGER);
                                    Text.margin({ left: day.taskCount > 0 ? 2 : 0 });
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
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    /**
     * 获取农历文字颜色
     */
    getLunarTextColor(day: CalendarDay): string {
        if (!day.isCurrentMonth) {
            return Constants.COLOR_TEXT_TERTIARY;
        }
        if (day.holidays.length > 0) {
            return Constants.COLOR_DANGER;
        }
        return Constants.COLOR_TEXT_SECONDARY;
    }
    /**
     * 获取日期文字颜色
     */
    getDateTextColor(day: CalendarDay): string {
        if (!day.isCurrentMonth) {
            return Constants.COLOR_TEXT_TERTIARY;
        }
        if (day.isToday || day.isSelected) {
            return Constants.COLOR_PRIMARY;
        }
        if (day.holidays.length > 0) {
            return Constants.COLOR_DANGER;
        }
        return Constants.COLOR_TEXT_PRIMARY;
    }
    /**
     * 构建详情区域
     */
    buildDetailSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Calendar.ets(410:5)", "entry");
            Column.width('100%');
            Column.layoutWeight(1);
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Column.borderRadius({ topLeft: 20, topRight: 20 });
            Column.padding({ bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 日期信息
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Calendar.ets(412:7)", "entry");
            // 日期信息
            Row.width('100%');
            // 日期信息
            Row.padding({ left: 16, right: 16, top: 16, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Calendar.ets(413:9)", "entry");
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(Utils.formatDate(ObservedObject.GetRawObject(this.selectedDate), 'MM月DD日'));
            Text.debugLine("entry/src/main/ets/pages/Calendar.ets(414:11)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Calendar.ets(418:11)", "entry");
            Row.margin({ top: 4 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(Utils.formatDate(ObservedObject.GetRawObject(this.selectedDate), 'YYYY年'));
            Text.debugLine("entry/src/main/ets/pages/Calendar.ets(419:13)", "entry");
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.getFullLunarDate(ObservedObject.GetRawObject(this.selectedDate))) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.getFullLunarDate(ObservedObject.GetRawObject(this.selectedDate)));
                        Text.debugLine("entry/src/main/ets/pages/Calendar.ets(423:15)", "entry");
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/Calendar.ets(433:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 节假日显示
            if (this.getHolidaysForDate(ObservedObject.GetRawObject(this.selectedDate)).length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/Calendar.ets(437:11)", "entry");
                        Row.padding({ left: 12, right: 12, top: 6, bottom: 6 });
                        Row.backgroundColor(Constants.COLOR_PRIMARY_LIGHT);
                        Row.borderRadius(16);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('🎉');
                        Text.debugLine("entry/src/main/ets/pages/Calendar.ets(438:13)", "entry");
                        Text.fontSize(16);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.getHolidaysForDate(ObservedObject.GetRawObject(this.selectedDate))[0].name);
                        Text.debugLine("entry/src/main/ets/pages/Calendar.ets(440:13)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(Constants.COLOR_PRIMARY);
                        Text.margin({ left: 4 });
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 日期信息
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 任务列表
            if (this.selectedDateTasks.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Calendar.ets(455:9)", "entry");
                        Column.width('100%');
                        Column.height(150);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('📝');
                        Text.debugLine("entry/src/main/ets/pages/Calendar.ets(456:11)", "entry");
                        Text.fontSize(48);
                        Text.opacity(0.3);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('这一天没有任务');
                        Text.debugLine("entry/src/main/ets/pages/Calendar.ets(459:11)", "entry");
                        Text.fontSize(16);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.margin({ top: 16 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/Calendar.ets(468:9)", "entry");
                        Row.width('100%');
                        Row.padding({ left: 16, right: 16, top: 12, bottom: 8 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('任务列表');
                        Text.debugLine("entry/src/main/ets/pages/Calendar.ets(469:11)", "entry");
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/Calendar.ets(474:11)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`共 ${this.selectedDateTasks.length} 项`);
                        Text.debugLine("entry/src/main/ets/pages/Calendar.ets(476:11)", "entry");
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create();
                        List.debugLine("entry/src/main/ets/pages/Calendar.ets(483:9)", "entry");
                        List.width('100%');
                        List.layoutWeight(1);
                        List.padding({ left: 16, right: 16 });
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const task = _item;
                            {
                                const itemCreation = (elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    ListItem.create(deepRenderFunction, true);
                                    if (!isInitialRender) {
                                        ListItem.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                };
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    ListItem.create(deepRenderFunction, true);
                                    ListItem.debugLine("entry/src/main/ets/pages/Calendar.ets(485:13)", "entry");
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            if (isInitialRender) {
                                                let componentCall = new TaskItem(this, {
                                                    task: task,
                                                    onTapAction: this.__tapActionId,
                                                    onCompleteAction: this.__completeActionId,
                                                    onDeleteAction: this.__deleteActionId
                                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Calendar.ets", line: 486, col: 15 });
                                                ViewPU.create(componentCall);
                                                let paramsLambda = () => {
                                                    return {
                                                        task: task,
                                                        onTapAction: this.tapActionId,
                                                        onCompleteAction: this.completeActionId,
                                                        onDeleteAction: this.deleteActionId
                                                    };
                                                };
                                                componentCall.paramsGenerator_ = paramsLambda;
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                                    task: task
                                                });
                                            }
                                        }, { name: "TaskItem" });
                                    }
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.selectedDateTasks, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Calendar.ets(508:5)", "entry");
            Column.width('100%');
            Column.flexGrow(1);
            Column.backgroundColor(Constants.COLOR_BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部月份导航
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Calendar.ets(510:7)", "entry");
            // 顶部月份导航
            Row.width('100%');
            // 顶部月份导航
            Row.height(56);
            // 顶部月份导航
            Row.padding({ left: 16, right: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('‹');
            Button.debugLine("entry/src/main/ets/pages/Calendar.ets(511:9)", "entry");
            Button.type(ButtonType.Normal);
            Button.fontSize(20);
            Button.fontColor(Constants.COLOR_TEXT_PRIMARY);
            Button.backgroundColor('transparent');
            Button.width(40);
            Button.height(40);
            Button.onClick(() => {
                this.prevMonth();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/Calendar.ets(522:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.currentMonth.getFullYear()}年${this.currentMonth.getMonth() + 1}月`);
            Text.debugLine("entry/src/main/ets/pages/Calendar.ets(524:9)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/Calendar.ets(529:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('›');
            Button.debugLine("entry/src/main/ets/pages/Calendar.ets(531:9)", "entry");
            Button.type(ButtonType.Normal);
            Button.fontSize(20);
            Button.fontColor(Constants.COLOR_TEXT_PRIMARY);
            Button.backgroundColor('transparent');
            Button.width(40);
            Button.height(40);
            Button.onClick(() => {
                this.nextMonth();
            });
        }, Button);
        Button.pop();
        // 顶部月份导航
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 日历网格
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Calendar.ets(547:7)", "entry");
            // 日历网格
            Column.width('100%');
            // 日历网格
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            // 日历网格
            Column.borderRadius(12);
            // 日历网格
            Column.margin({ left: 16, right: 16, bottom: 12 });
            // 日历网格
            Column.padding({ top: 12, bottom: 12 });
        }, Column);
        this.buildCalendarGrid.bind(this)();
        // 日历网格
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 详情区域（可下拉展开）
            if (this.showDetail) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildDetailSection.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 底部提示
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Calendar.ets(561:9)", "entry");
                        // 底部提示
                        Column.width('100%');
                        // 底部提示
                        Column.padding({ top: 20, bottom: 20 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('点击日期查看详情');
                        Text.debugLine("entry/src/main/ets/pages/Calendar.ets(562:11)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.margin({ bottom: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('↓');
                        Text.debugLine("entry/src/main/ets/pages/Calendar.ets(566:11)", "entry");
                        Text.fontSize(20);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.opacity(0.5);
                    }, Text);
                    Text.pop();
                    // 底部提示
                    Column.pop();
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
