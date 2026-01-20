if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CalendarNewPage_Params {
    currentView?: CalendarViewType;
    selectedDate?: Date;
    currentMonth?: Date;
    currentYear?: number;
    calendarDays?: CalendarDayData[];
    events?: CalendarEvent[];
    allTasks?: Task[];
    selectedDateTasks?: Task[];
    selectedDateEvents?: CalendarEvent[];
    selectedCalendarInfo?: MxnzpHolidayData | null;
    isLoading?: boolean;
    showDetail?: boolean;
    showEventSheet?: boolean;
    showMenu?: boolean;
    showJumpDate?: boolean;
    showSearch?: boolean;
    editingEvent?: CalendarEvent | null;
    swipeStartX?: number;
    taskService?: TaskService;
    holidayService?: HolidayService;
    eventService?: EventService;
    today?: Date;
    solarTermsList?: string[];
}
import { CalendarViewType } from "@normalized:N&&&entry/src/main/ets/model/CalendarEvent&";
import type { CalendarEvent } from "@normalized:N&&&entry/src/main/ets/model/CalendarEvent&";
import type { MxnzpHolidayData } from '../model/Holiday';
import type { Task } from '../model/Task';
import { TaskService } from "@normalized:N&&&entry/src/main/ets/service/TaskService&";
import { HolidayService } from "@normalized:N&&&entry/src/main/ets/service/HolidayService&";
import { EventService } from "@normalized:N&&&entry/src/main/ets/service/EventService&";
import { Utils } from "@normalized:N&&&entry/src/main/ets/common/Utils&";
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import { TaskItem } from "@normalized:N&&&entry/src/main/ets/components/TaskItem&";
import { ViewTabs } from "@normalized:N&&&entry/src/main/ets/components/calendar/ViewTabs&";
import { DateCell, CalendarDayData } from "@normalized:N&&&entry/src/main/ets/components/calendar/DateCell&";
import { YearView } from "@normalized:N&&&entry/src/main/ets/components/calendar/YearView&";
import { WeekView } from "@normalized:N&&&entry/src/main/ets/components/calendar/WeekView&";
import { DayView } from "@normalized:N&&&entry/src/main/ets/components/calendar/DayView&";
import { EventSheet } from "@normalized:N&&&entry/src/main/ets/components/calendar/EventSheet&";
import { CalendarMenu, SearchResultItem } from "@normalized:N&&&entry/src/main/ets/components/calendar/CalendarMenu&";
export class CalendarNewPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentView = new ObservedPropertySimplePU(CalendarViewType.MONTH, this, "currentView");
        this.__selectedDate = new ObservedPropertyObjectPU(new Date(), this, "selectedDate");
        this.__currentMonth = new ObservedPropertyObjectPU(new Date(), this, "currentMonth");
        this.__currentYear = new ObservedPropertySimplePU(new Date().getFullYear(), this, "currentYear");
        this.__calendarDays = new ObservedPropertyObjectPU([], this, "calendarDays");
        this.__events = new ObservedPropertyObjectPU([], this, "events");
        this.__allTasks = new ObservedPropertyObjectPU([], this, "allTasks");
        this.__selectedDateTasks = new ObservedPropertyObjectPU([], this, "selectedDateTasks");
        this.__selectedDateEvents = new ObservedPropertyObjectPU([], this, "selectedDateEvents");
        this.__selectedCalendarInfo = new ObservedPropertyObjectPU(null, this, "selectedCalendarInfo");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__showDetail = new ObservedPropertySimplePU(false, this, "showDetail");
        this.__showEventSheet = new ObservedPropertySimplePU(false, this, "showEventSheet");
        this.__showMenu = new ObservedPropertySimplePU(false, this, "showMenu");
        this.__showJumpDate = new ObservedPropertySimplePU(false, this, "showJumpDate");
        this.__showSearch = new ObservedPropertySimplePU(false, this, "showSearch");
        this.__editingEvent = new ObservedPropertyObjectPU(null, this, "editingEvent");
        this.swipeStartX = 0;
        this.taskService = TaskService.getInstance();
        this.holidayService = HolidayService.getInstance();
        this.eventService = EventService.getInstance();
        this.today = new Date();
        this.solarTermsList = [
            '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
            '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
            '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
            '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'
        ];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CalendarNewPage_Params) {
        if (params.currentView !== undefined) {
            this.currentView = params.currentView;
        }
        if (params.selectedDate !== undefined) {
            this.selectedDate = params.selectedDate;
        }
        if (params.currentMonth !== undefined) {
            this.currentMonth = params.currentMonth;
        }
        if (params.currentYear !== undefined) {
            this.currentYear = params.currentYear;
        }
        if (params.calendarDays !== undefined) {
            this.calendarDays = params.calendarDays;
        }
        if (params.events !== undefined) {
            this.events = params.events;
        }
        if (params.allTasks !== undefined) {
            this.allTasks = params.allTasks;
        }
        if (params.selectedDateTasks !== undefined) {
            this.selectedDateTasks = params.selectedDateTasks;
        }
        if (params.selectedDateEvents !== undefined) {
            this.selectedDateEvents = params.selectedDateEvents;
        }
        if (params.selectedCalendarInfo !== undefined) {
            this.selectedCalendarInfo = params.selectedCalendarInfo;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.showDetail !== undefined) {
            this.showDetail = params.showDetail;
        }
        if (params.showEventSheet !== undefined) {
            this.showEventSheet = params.showEventSheet;
        }
        if (params.showMenu !== undefined) {
            this.showMenu = params.showMenu;
        }
        if (params.showJumpDate !== undefined) {
            this.showJumpDate = params.showJumpDate;
        }
        if (params.showSearch !== undefined) {
            this.showSearch = params.showSearch;
        }
        if (params.editingEvent !== undefined) {
            this.editingEvent = params.editingEvent;
        }
        if (params.swipeStartX !== undefined) {
            this.swipeStartX = params.swipeStartX;
        }
        if (params.taskService !== undefined) {
            this.taskService = params.taskService;
        }
        if (params.holidayService !== undefined) {
            this.holidayService = params.holidayService;
        }
        if (params.eventService !== undefined) {
            this.eventService = params.eventService;
        }
        if (params.today !== undefined) {
            this.today = params.today;
        }
        if (params.solarTermsList !== undefined) {
            this.solarTermsList = params.solarTermsList;
        }
    }
    updateStateVars(params: CalendarNewPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentView.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedDate.purgeDependencyOnElmtId(rmElmtId);
        this.__currentMonth.purgeDependencyOnElmtId(rmElmtId);
        this.__currentYear.purgeDependencyOnElmtId(rmElmtId);
        this.__calendarDays.purgeDependencyOnElmtId(rmElmtId);
        this.__events.purgeDependencyOnElmtId(rmElmtId);
        this.__allTasks.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedDateTasks.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedDateEvents.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedCalendarInfo.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__showDetail.purgeDependencyOnElmtId(rmElmtId);
        this.__showEventSheet.purgeDependencyOnElmtId(rmElmtId);
        this.__showMenu.purgeDependencyOnElmtId(rmElmtId);
        this.__showJumpDate.purgeDependencyOnElmtId(rmElmtId);
        this.__showSearch.purgeDependencyOnElmtId(rmElmtId);
        this.__editingEvent.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentView.aboutToBeDeleted();
        this.__selectedDate.aboutToBeDeleted();
        this.__currentMonth.aboutToBeDeleted();
        this.__currentYear.aboutToBeDeleted();
        this.__calendarDays.aboutToBeDeleted();
        this.__events.aboutToBeDeleted();
        this.__allTasks.aboutToBeDeleted();
        this.__selectedDateTasks.aboutToBeDeleted();
        this.__selectedDateEvents.aboutToBeDeleted();
        this.__selectedCalendarInfo.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__showDetail.aboutToBeDeleted();
        this.__showEventSheet.aboutToBeDeleted();
        this.__showMenu.aboutToBeDeleted();
        this.__showJumpDate.aboutToBeDeleted();
        this.__showSearch.aboutToBeDeleted();
        this.__editingEvent.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentView: ObservedPropertySimplePU<CalendarViewType>;
    get currentView() {
        return this.__currentView.get();
    }
    set currentView(newValue: CalendarViewType) {
        this.__currentView.set(newValue);
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
    private __currentYear: ObservedPropertySimplePU<number>;
    get currentYear() {
        return this.__currentYear.get();
    }
    set currentYear(newValue: number) {
        this.__currentYear.set(newValue);
    }
    private __calendarDays: ObservedPropertyObjectPU<CalendarDayData[]>;
    get calendarDays() {
        return this.__calendarDays.get();
    }
    set calendarDays(newValue: CalendarDayData[]) {
        this.__calendarDays.set(newValue);
    }
    private __events: ObservedPropertyObjectPU<CalendarEvent[]>;
    get events() {
        return this.__events.get();
    }
    set events(newValue: CalendarEvent[]) {
        this.__events.set(newValue);
    }
    private __allTasks: ObservedPropertyObjectPU<Task[]>;
    get allTasks() {
        return this.__allTasks.get();
    }
    set allTasks(newValue: Task[]) {
        this.__allTasks.set(newValue);
    }
    private __selectedDateTasks: ObservedPropertyObjectPU<Task[]>;
    get selectedDateTasks() {
        return this.__selectedDateTasks.get();
    }
    set selectedDateTasks(newValue: Task[]) {
        this.__selectedDateTasks.set(newValue);
    }
    private __selectedDateEvents: ObservedPropertyObjectPU<CalendarEvent[]>;
    get selectedDateEvents() {
        return this.__selectedDateEvents.get();
    }
    set selectedDateEvents(newValue: CalendarEvent[]) {
        this.__selectedDateEvents.set(newValue);
    }
    private __selectedCalendarInfo: ObservedPropertyObjectPU<MxnzpHolidayData | null>;
    get selectedCalendarInfo() {
        return this.__selectedCalendarInfo.get();
    }
    set selectedCalendarInfo(newValue: MxnzpHolidayData | null) {
        this.__selectedCalendarInfo.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __showDetail: ObservedPropertySimplePU<boolean>;
    get showDetail() {
        return this.__showDetail.get();
    }
    set showDetail(newValue: boolean) {
        this.__showDetail.set(newValue);
    }
    // 弹窗状态
    private __showEventSheet: ObservedPropertySimplePU<boolean>;
    get showEventSheet() {
        return this.__showEventSheet.get();
    }
    set showEventSheet(newValue: boolean) {
        this.__showEventSheet.set(newValue);
    }
    private __showMenu: ObservedPropertySimplePU<boolean>;
    get showMenu() {
        return this.__showMenu.get();
    }
    set showMenu(newValue: boolean) {
        this.__showMenu.set(newValue);
    }
    private __showJumpDate: ObservedPropertySimplePU<boolean>;
    get showJumpDate() {
        return this.__showJumpDate.get();
    }
    set showJumpDate(newValue: boolean) {
        this.__showJumpDate.set(newValue);
    }
    private __showSearch: ObservedPropertySimplePU<boolean>;
    get showSearch() {
        return this.__showSearch.get();
    }
    set showSearch(newValue: boolean) {
        this.__showSearch.set(newValue);
    }
    private __editingEvent: ObservedPropertyObjectPU<CalendarEvent | null>;
    get editingEvent() {
        return this.__editingEvent.get();
    }
    set editingEvent(newValue: CalendarEvent | null) {
        this.__editingEvent.set(newValue);
    }
    // 滑动相关
    private swipeStartX: number;
    private taskService: TaskService;
    private holidayService: HolidayService;
    private eventService: EventService;
    private today: Date;
    // 24节气列表
    private readonly solarTermsList: string[];
    aboutToAppear() {
        this.loadData();
    }
    /**
     * 加载所有数据
     */
    async loadData(): Promise<void> {
        await this.loadTasks();
        await this.loadEvents();
        await this.loadCalendarData();
    }
    /**
     * 加载任务
     */
    async loadTasks(): Promise<void> {
        this.allTasks = await this.taskService.getAllTasks();
        this.updateSelectedDateTasks();
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
     * 更新选中日期的日程事件
     */
    updateSelectedDateEvents(): void {
        const filtered = this.events.filter(event => event.isOnDate(this.selectedDate));
        this.selectedDateEvents = [...filtered];
    }
    /**
     * 判断是否是真正的24节气
     */
    isRealSolarTerm(solarTerms: string): boolean {
        if (!solarTerms || solarTerms === '无') {
            return false;
        }
        if (solarTerms.includes('后') || solarTerms.includes('前')) {
            return false;
        }
        return this.solarTermsList.includes(solarTerms);
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
        await this.taskService.deleteTask(task);
        await this.loadTasks();
    }
    /**
     * 加载日程事件
     */
    async loadEvents(): Promise<void> {
        this.events = await this.eventService.getAllEvents();
        this.updateSelectedDateEvents();
    }
    /**
     * 加载日历数据
     */
    async loadCalendarData(): Promise<void> {
        this.isLoading = true;
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            await this.holidayService.getHolidayByDate(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        this.updateCalendarDays();
        this.isLoading = false;
        await this.loadSelectedDateInfo();
    }
    /**
     * 加载选中日期信息
     */
    async loadSelectedDateInfo(): Promise<void> {
        this.selectedCalendarInfo = await this.holidayService.getCalendarInfo(this.selectedDate);
        // 调试日志
        if (this.selectedCalendarInfo) {
            console.info(`CalendarNew: 选中日期信息 - suit: "${this.selectedCalendarInfo.suit}", avoid: "${this.selectedCalendarInfo.avoid}"`);
            console.info(`CalendarNew: 完整calendarInfo:`, JSON.stringify(this.selectedCalendarInfo));
        }
        else {
            console.warn('CalendarNew: selectedCalendarInfo 为 null');
        }
        this.updateSelectedDateTasks();
        this.updateSelectedDateEvents();
        this.showDetail = true;
    }
    /**
     * 更新日历日期数组
     */
    updateCalendarDays(): void {
        const days: CalendarDayData[] = [];
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const firstDayWeek = firstDay.getDay();
        const startDay = firstDayWeek === 0 ? 6 : firstDayWeek - 1;
        // 上月日期
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startDay - 1; i >= 0; i--) {
            const date = new Date(year, month - 1, prevMonthLastDay - i);
            days.push(this.createCalendarDay(date, false));
        }
        // 当月日期
        const daysInMonth = lastDay.getDate();
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            days.push(this.createCalendarDay(date, true));
        }
        // 下月日期
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            const date = new Date(year, month + 1, i);
            days.push(this.createCalendarDay(date, false));
        }
        this.calendarDays = days;
    }
    /**
     * 创建日历日期项
     */
    createCalendarDay(date: Date, isCurrentMonth: boolean): CalendarDayData {
        const day = new CalendarDayData();
        day.date = date;
        day.isCurrentMonth = isCurrentMonth;
        day.isToday = Utils.isSameDay(date, this.today);
        day.isSelected = Utils.isSameDay(date, this.selectedDate);
        day.taskCount = this.getTaskCountForDate(date);
        day.eventCount = this.getEventCountForDate(date);
        const dateKey = this.getDateKey(date);
        day.calendarInfo = this.holidayService.getCalendarFromCache(dateKey);
        day.holiday = this.holidayService.getHolidayFromCache(dateKey);
        return day;
    }
    /**
     * 获取日期键
     */
    getDateKey(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    /**
     * 获取任务数量
     */
    getTaskCountForDate(date: Date): number {
        return this.allTasks.filter(task => {
            if (!task.dueDate)
                return false;
            return Utils.isSameDay(date, task.dueDate);
        }).length;
    }
    /**
     * 获取事件数量
     */
    getEventCountForDate(date: Date): number {
        return this.events.filter(event => event.isOnDate(date)).length;
    }
    /**
     * 视图切换
     */
    onViewChange(view: CalendarViewType): void {
        this.currentView = view;
        if (view === CalendarViewType.YEAR) {
            this.currentYear = this.selectedDate.getFullYear();
        }
    }
    /**
     * 选择日期
     */
    async onDateSelect(day: CalendarDayData): Promise<void> {
        if (!day.isCurrentMonth) {
            this.currentMonth = new Date(day.date.getFullYear(), day.date.getMonth(), 1);
            await this.loadCalendarData();
        }
        this.selectedDate = day.date;
        this.updateCalendarDays();
        await this.loadSelectedDateInfo();
    }
    /**
     * 从年视图选择月份
     */
    async onMonthSelect(year: number, month: number): Promise<void> {
        this.currentMonth = new Date(year, month, 1);
        this.selectedDate = new Date(year, month, 1);
        this.currentView = CalendarViewType.MONTH;
        await this.loadCalendarData();
    }
    /**
     * 上一个月/年
     */
    async prevPeriod(): Promise<void> {
        if (this.currentView === CalendarViewType.YEAR) {
            this.currentYear--;
        }
        else {
            const newMonth = new Date(this.currentMonth);
            newMonth.setMonth(newMonth.getMonth() - 1);
            this.currentMonth = newMonth;
            await this.loadCalendarData();
        }
    }
    /**
     * 下一个月/年
     */
    async nextPeriod(): Promise<void> {
        if (this.currentView === CalendarViewType.YEAR) {
            this.currentYear++;
        }
        else {
            const newMonth = new Date(this.currentMonth);
            newMonth.setMonth(newMonth.getMonth() + 1);
            this.currentMonth = newMonth;
            await this.loadCalendarData();
        }
    }
    /**
     * 新建日程
     */
    createEvent(): void {
        this.editingEvent = null;
        this.showEventSheet = true;
    }
    /**
     * 编辑日程
     */
    editEvent(event: CalendarEvent): void {
        this.editingEvent = event;
        this.showEventSheet = true;
    }
    /**
     * 保存日程
     */
    async saveEvent(event: CalendarEvent): Promise<void> {
        if (event.id > 0) {
            await this.eventService.updateEvent(event);
        }
        else {
            await this.eventService.createEvent(event);
        }
        await this.loadEvents();
        this.updateCalendarDays();
    }
    /**
     * 删除日程
     */
    async deleteEvent(event: CalendarEvent): Promise<void> {
        await this.eventService.deleteEvent(event.id);
        await this.loadEvents();
        this.updateCalendarDays();
        this.updateSelectedDateEvents();
    }
    /**
     * 构建日程项
     */
    buildEventItem(event: CalendarEvent, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/CalendarNew.ets(372:5)", "entry");
            Row.width('100%');
            Row.padding(16);
            Row.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Row.borderRadius(12);
            Row.margin({ bottom: 8 });
            Row.onClick(() => {
                this.editEvent(event);
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 时间
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CalendarNew.ets(374:7)", "entry");
            // 时间
            Column.width(60);
            // 时间
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (event.isAllDay) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('全天');
                        Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(376:11)", "entry");
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(Utils.formatDate(event.startTime, 'HH:mm'));
                        Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(380:11)", "entry");
                        Text.fontSize(14);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor(Constants.COLOR_PRIMARY);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (event.endTime) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(Utils.formatDate(event.endTime, 'HH:mm'));
                                    Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(385:13)", "entry");
                                    Text.fontSize(12);
                                    Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
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
                });
            }
        }, If);
        If.pop();
        // 时间
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 日程信息
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CalendarNew.ets(396:7)", "entry");
            // 日程信息
            Column.alignItems(HorizontalAlign.Start);
            // 日程信息
            Column.layoutWeight(1);
            // 日程信息
            Column.margin({ left: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(event.title);
            Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(397:9)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            Text.maxLines(2);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (event.location) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`📍 ${event.location}`);
                        Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(405:11)", "entry");
                        Text.fontSize(13);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.margin({ top: 4 });
                        Text.maxLines(1);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
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
        // 日程信息
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 重要标记
            if (event.priority) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('⭐');
                        Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(419:9)", "entry");
                        Text.fontSize(18);
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
    }
    /**
     * 跳转到日期
     */
    async jumpToDate(date: Date): Promise<void> {
        this.selectedDate = date;
        this.currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        this.currentYear = date.getFullYear();
        await this.loadCalendarData();
    }
    /**
     * 搜索日程
     */
    async searchEvents(keyword: string): Promise<SearchResultItem[]> {
        const results = await this.eventService.searchEvents(keyword);
        return results.map(event => {
            const item = new SearchResultItem();
            item.id = event.id;
            item.title = event.title;
            item.date = event.startTime;
            return item;
        });
    }
    /**
     * 获取标题文本
     */
    getTitleText(): string {
        if (this.currentView === CalendarViewType.YEAR) {
            return `${this.currentYear}年`;
        }
        return `${this.currentMonth.getFullYear()}年${this.currentMonth.getMonth() + 1}月`;
    }
    /**
     * 构建月视图
     */
    buildMonthView(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CalendarNew.ets(472:5)", "entry");
            Column.width('100%');
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Column.borderRadius(12);
            Column.margin({ left: 16, right: 16, bottom: 12 });
            Column.padding({ top: 8, bottom: 8 });
            Gesture.create(GesturePriority.Low);
            PanGesture.create({ direction: PanDirection.Horizontal });
            PanGesture.onActionStart((event: GestureEvent) => {
                this.swipeStartX = event.offsetX;
            });
            PanGesture.onActionEnd((event: GestureEvent) => {
                const deltaX = event.offsetX - this.swipeStartX;
                if (Math.abs(deltaX) > 50) {
                    if (deltaX > 0) {
                        this.prevPeriod();
                    }
                    else {
                        this.nextPeriod();
                    }
                }
            });
            PanGesture.pop();
            Gesture.pop();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 星期标题
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/CalendarNew.ets(474:7)", "entry");
            // 星期标题
            Row.width('100%');
            // 星期标题
            Row.height(40);
            // 星期标题
            Row.padding({ left: 8, right: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const day = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(day);
                    Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(476:11)", "entry");
                    Text.fontSize(14);
                    Text.fontColor(index >= 5 ? Constants.COLOR_DANGER : Constants.COLOR_TEXT_SECONDARY);
                    Text.width('14.28%');
                    Text.textAlign(TextAlign.Center);
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, ['一', '二', '三', '四', '五', '六', '日'], forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        // 星期标题
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 日期网格（支持滑动翻页）
            Grid.create();
            Grid.debugLine("entry/src/main/ets/pages/CalendarNew.ets(488:7)", "entry");
            // 日期网格（支持滑动翻页）
            Grid.columnsTemplate('1fr 1fr 1fr 1fr 1fr 1fr 1fr');
            // 日期网格（支持滑动翻页）
            Grid.rowsTemplate('1fr 1fr 1fr 1fr 1fr 1fr');
            // 日期网格（支持滑动翻页）
            Grid.width('100%');
            // 日期网格（支持滑动翻页）
            Grid.height(360);
            // 日期网格（支持滑动翻页）
            Grid.padding({ left: 8, right: 8, top: 8, bottom: 8 });
        }, Grid);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const day = _item;
                {
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        GridItem.create(() => { }, false);
                        GridItem.debugLine("entry/src/main/ets/pages/CalendarNew.ets(490:11)", "entry");
                    };
                    const observedDeepRender = () => {
                        this.observeComponentCreation2(itemCreation2, GridItem);
                        {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                if (isInitialRender) {
                                    let componentCall = new DateCell(this, {
                                        day: day,
                                        onSelect: (d: CalendarDayData) => {
                                            this.onDateSelect(d);
                                        }
                                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/CalendarNew.ets", line: 491, col: 13 });
                                    ViewPU.create(componentCall);
                                    let paramsLambda = () => {
                                        return {
                                            day: day,
                                            onSelect: (d: CalendarDayData) => {
                                                this.onDateSelect(d);
                                            }
                                        };
                                    };
                                    componentCall.paramsGenerator_ = paramsLambda;
                                }
                                else {
                                    this.updateStateVarsOfChildByElmtId(elmtId, {
                                        day: day
                                    });
                                }
                            }, { name: "DateCell" });
                        }
                        GridItem.pop();
                    };
                    observedDeepRender();
                }
            };
            this.forEachUpdateFunction(elmtId, this.calendarDays, forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        // 日期网格（支持滑动翻页）
        Grid.pop();
        Column.pop();
    }
    /**
     * 构建详情区域
     */
    buildDetailSection(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CalendarNew.ets(534:5)", "entry");
            Column.width('100%');
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Column.borderRadius({ topLeft: 20, topRight: 20 });
            Column.padding({ bottom: 16 });
            Column.flexShrink(0);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 日期信息
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/CalendarNew.ets(536:7)", "entry");
            // 日期信息
            Row.width('100%');
            // 日期信息
            Row.padding({ left: 16, right: 16, top: 16, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CalendarNew.ets(537:9)", "entry");
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(Utils.formatDate(ObservedObject.GetRawObject(this.selectedDate), 'MM月DD日'));
            Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(538:11)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/CalendarNew.ets(543:11)", "entry");
            Row.margin({ top: 4 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(Utils.formatDate(ObservedObject.GetRawObject(this.selectedDate), 'YYYY年'));
            Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(544:13)", "entry");
            Text.fontSize(13);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.selectedCalendarInfo) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${this.selectedCalendarInfo.lunarCalendar}`);
                        Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(549:15)", "entry");
                        Text.fontSize(13);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.margin({ left: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${this.selectedCalendarInfo.yearTips}年`);
                        Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(554:15)", "entry");
                        Text.fontSize(13);
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 节气、星座、属相
            if (this.selectedCalendarInfo) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/CalendarNew.ets(564:13)", "entry");
                        Row.margin({ top: 6 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.isRealSolarTerm(this.selectedCalendarInfo.solarTerms)) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`🌿 ${this.selectedCalendarInfo.solarTerms}`);
                                    Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(566:17)", "entry");
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
                        Text.create(`⭐ ${this.selectedCalendarInfo.constellation}`);
                        Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(570:15)", "entry");
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.margin({ left: 8 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`🐾 ${this.selectedCalendarInfo.chineseZodiac}`);
                        Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(574:15)", "entry");
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.margin({ left: 8 });
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
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/CalendarNew.ets(584:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 节假日/工作日标签
            if (this.selectedCalendarInfo) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/CalendarNew.ets(588:11)", "entry");
                        Column.padding({ left: 12, right: 12, top: 6, bottom: 6 });
                        Column.backgroundColor(this.selectedCalendarInfo.type === 0 ? '#F5F5F5' : Constants.COLOR_PRIMARY);
                        Column.borderRadius(16);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.selectedCalendarInfo.typeDes);
                        Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(589:13)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(this.selectedCalendarInfo.type === 0 ? Constants.COLOR_TEXT_SECONDARY : '#FFFFFF');
                        Text.fontWeight(FontWeight.Medium);
                    }, Text);
                    Text.pop();
                    Column.pop();
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
            // 宜忌信息（API数据源时显示）
            if (this.selectedCalendarInfo &&
                (this.selectedCalendarInfo.suit && this.selectedCalendarInfo.suit.trim() ||
                    this.selectedCalendarInfo.avoid && this.selectedCalendarInfo.avoid.trim())) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/CalendarNew.ets(606:9)", "entry");
                        Column.width('100%');
                        Column.padding({ left: 16, right: 16, bottom: 12 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.selectedCalendarInfo.suit && this.selectedCalendarInfo.suit.trim()) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.debugLine("entry/src/main/ets/pages/CalendarNew.ets(608:13)", "entry");
                                    Row.width('100%');
                                    Row.margin({ bottom: 4 });
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('宜');
                                    Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(609:15)", "entry");
                                    Text.fontSize(12);
                                    Text.fontColor('#FFFFFF');
                                    Text.backgroundColor(Constants.COLOR_SUCCESS);
                                    Text.padding({ left: 6, right: 6, top: 2, bottom: 2 });
                                    Text.borderRadius(4);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.selectedCalendarInfo.suit.replace(/\./g, ' ').trim());
                                    Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(615:15)", "entry");
                                    Text.fontSize(12);
                                    Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                                    Text.margin({ left: 8 });
                                    Text.maxLines(2);
                                    Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                    Text.layoutWeight(1);
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
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.selectedCalendarInfo.avoid && this.selectedCalendarInfo.avoid.trim()) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.debugLine("entry/src/main/ets/pages/CalendarNew.ets(628:13)", "entry");
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('忌');
                                    Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(629:15)", "entry");
                                    Text.fontSize(12);
                                    Text.fontColor('#FFFFFF');
                                    Text.backgroundColor(Constants.COLOR_DANGER);
                                    Text.padding({ left: 6, right: 6, top: 2, bottom: 2 });
                                    Text.borderRadius(4);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.selectedCalendarInfo.avoid.replace(/\./g, ' ').trim());
                                    Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(635:15)", "entry");
                                    Text.fontSize(12);
                                    Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                                    Text.margin({ left: 8 });
                                    Text.maxLines(2);
                                    Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                    Text.layoutWeight(1);
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
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/pages/CalendarNew.ets(650:7)", "entry");
            Divider.color(Constants.COLOR_DIVIDER);
            Divider.margin({ left: 16, right: 16 });
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 日程列表（在任务列表之前）
            if (this.selectedDateEvents.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/CalendarNew.ets(656:9)", "entry");
                        Row.width('100%');
                        Row.padding({ left: 16, right: 16, top: 12, bottom: 8 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('日程安排');
                        Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(657:11)", "entry");
                        Text.fontSize(15);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/CalendarNew.ets(662:11)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`共 ${this.selectedDateEvents.length} 项`);
                        Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(664:11)", "entry");
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/CalendarNew.ets(671:9)", "entry");
                        Column.width('100%');
                        Column.padding({ left: 16, right: 16, bottom: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const event = _item;
                            this.buildEventItem.bind(this)(event);
                        };
                        this.forEachUpdateFunction(elmtId, this.selectedDateEvents, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                });
            }
            // 任务列表
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 任务列表
            if (this.selectedDateTasks.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/CalendarNew.ets(682:9)", "entry");
                        Row.width('100%');
                        Row.padding({ left: 16, right: 16, top: this.selectedDateEvents.length > 0 ? 12 : 12, bottom: 8 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('任务列表');
                        Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(683:11)", "entry");
                        Text.fontSize(15);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/CalendarNew.ets(688:11)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`共 ${this.selectedDateTasks.length} 项`);
                        Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(690:11)", "entry");
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/CalendarNew.ets(697:9)", "entry");
                        Column.width('100%');
                        Column.padding({ left: 16, right: 16, bottom: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const task = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                __Common__.create();
                                __Common__.margin({ bottom: 8 });
                            }, __Common__);
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new TaskItem(this, {
                                            task: task,
                                            onTap: (task: Task) => {
                                                // 点击任务的处理（可以打开详情或编辑）
                                            },
                                            onComplete: (task: Task) => {
                                                this.onTaskComplete(task);
                                            },
                                            onDelete: (task: Task) => {
                                                this.onTaskDelete(task);
                                            }
                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/CalendarNew.ets", line: 699, col: 13 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                task: task,
                                                onTap: (task: Task) => {
                                                    // 点击任务的处理（可以打开详情或编辑）
                                                },
                                                onComplete: (task: Task) => {
                                                    this.onTaskComplete(task);
                                                },
                                                onDelete: (task: Task) => {
                                                    this.onTaskDelete(task);
                                                }
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
                            __Common__.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.selectedDateTasks, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                });
            }
            // 如果没有任务和日程，显示空状态
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 如果没有任务和日程，显示空状态
            if (this.selectedDateTasks.length === 0 && this.selectedDateEvents.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/CalendarNew.ets(720:9)", "entry");
                        Column.width('100%');
                        Column.height(120);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('📅');
                        Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(721:11)", "entry");
                        Text.fontSize(40);
                        Text.opacity(0.3);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('这一天没有任务和日程');
                        Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(724:11)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.margin({ top: 12 });
                    }, Text);
                    Text.pop();
                    Column.pop();
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.debugLine("entry/src/main/ets/pages/CalendarNew.ets(742:5)", "entry");
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CalendarNew.ets(743:7)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(Constants.COLOR_BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部导航
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/CalendarNew.ets(745:9)", "entry");
            // 顶部导航
            Row.width('100%');
            // 顶部导航
            Row.height(56);
            // 顶部导航
            Row.padding({ left: 8, right: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('‹');
            Button.debugLine("entry/src/main/ets/pages/CalendarNew.ets(746:11)", "entry");
            Button.type(ButtonType.Normal);
            Button.fontSize(24);
            Button.fontColor(Constants.COLOR_TEXT_PRIMARY);
            Button.backgroundColor(Color.Transparent);
            Button.width(44);
            Button.height(44);
            Button.onClick(() => this.prevPeriod());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/CalendarNew.ets(755:11)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/CalendarNew.ets(757:11)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getTitleText());
            Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(758:13)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载中...');
                        Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(764:15)", "entry");
                        Text.fontSize(11);
                        Text.fontColor(Constants.COLOR_TEXT_TERTIARY);
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
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/CalendarNew.ets(770:11)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 菜单按钮
            Button.createWithLabel('⋮');
            Button.debugLine("entry/src/main/ets/pages/CalendarNew.ets(773:11)", "entry");
            // 菜单按钮
            Button.type(ButtonType.Normal);
            // 菜单按钮
            Button.fontSize(20);
            // 菜单按钮
            Button.fontColor(Constants.COLOR_TEXT_PRIMARY);
            // 菜单按钮
            Button.backgroundColor(Color.Transparent);
            // 菜单按钮
            Button.width(44);
            // 菜单按钮
            Button.height(44);
            // 菜单按钮
            Button.onClick(() => {
                this.showMenu = !this.showMenu;
            });
        }, Button);
        // 菜单按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('›');
            Button.debugLine("entry/src/main/ets/pages/CalendarNew.ets(784:11)", "entry");
            Button.type(ButtonType.Normal);
            Button.fontSize(24);
            Button.fontColor(Constants.COLOR_TEXT_PRIMARY);
            Button.backgroundColor(Color.Transparent);
            Button.width(44);
            Button.height(44);
            Button.onClick(() => this.nextPeriod());
        }, Button);
        Button.pop();
        // 顶部导航
        Row.pop();
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 视图切换标签
                    ViewTabs(this, {
                        currentView: this.__currentView,
                        onViewChange: (view: CalendarViewType) => this.onViewChange(view)
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/CalendarNew.ets", line: 798, col: 9 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            currentView: this.currentView,
                            onViewChange: (view: CalendarViewType) => this.onViewChange(view)
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "ViewTabs" });
        }
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 视图内容
            if (this.currentView === CalendarViewType.YEAR) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new YearView(this, {
                                    currentYear: this.currentYear,
                                    selectedDate: this.__selectedDate,
                                    onMonthSelect: (year: number, month: number) => this.onMonthSelect(year, month)
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/CalendarNew.ets", line: 805, col: 11 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        currentYear: this.currentYear,
                                        selectedDate: this.selectedDate,
                                        onMonthSelect: (year: number, month: number) => this.onMonthSelect(year, month)
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    currentYear: this.currentYear
                                });
                            }
                        }, { name: "YearView" });
                    }
                });
            }
            else if (this.currentView === CalendarViewType.MONTH) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.debugLine("entry/src/main/ets/pages/CalendarNew.ets(811:11)", "entry");
                        Scroll.layoutWeight(1);
                        Scroll.scrollBar(BarState.Off);
                        Scroll.edgeEffect(EdgeEffect.Spring);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/CalendarNew.ets(812:13)", "entry");
                        Column.width('100%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 日历视图
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/CalendarNew.ets(814:15)", "entry");
                        // 日历视图
                        Column.margin({ bottom: 12 });
                    }, Column);
                    this.buildMonthView.bind(this)();
                    // 日历视图
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 详情区域
                        if (this.showDetail) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.buildDetailSection.bind(this)();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create();
                                    Column.debugLine("entry/src/main/ets/pages/CalendarNew.ets(823:17)", "entry");
                                    Column.width('100%');
                                    Column.height(200);
                                    Column.justifyContent(FlexAlign.Center);
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('点击日期查看详情');
                                    Text.debugLine("entry/src/main/ets/pages/CalendarNew.ets(824:19)", "entry");
                                    Text.fontSize(14);
                                    Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                                }, Text);
                                Text.pop();
                                Column.pop();
                            });
                        }
                    }, If);
                    If.pop();
                    Column.pop();
                    Scroll.pop();
                });
            }
            else if (this.currentView === CalendarViewType.WEEK) {
                this.ifElseBranchUpdateFunction(2, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new WeekView(this, {
                                    selectedDate: this.__selectedDate,
                                    events: this.events,
                                    onEventTap: (event: CalendarEvent) => this.editEvent(event),
                                    onDateSelect: (date: Date) => {
                                        this.selectedDate = date;
                                    }
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/CalendarNew.ets", line: 839, col: 11 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        selectedDate: this.selectedDate,
                                        events: this.events,
                                        onEventTap: (event: CalendarEvent) => this.editEvent(event),
                                        onDateSelect: (date: Date) => {
                                            this.selectedDate = date;
                                        }
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    events: this.events
                                });
                            }
                        }, { name: "WeekView" });
                    }
                });
            }
            else if (this.currentView === CalendarViewType.DAY) {
                this.ifElseBranchUpdateFunction(3, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new DayView(this, {
                                    selectedDate: this.__selectedDate,
                                    events: this.events,
                                    calendarInfo: this.selectedCalendarInfo,
                                    onEventTap: (event: CalendarEvent) => this.editEvent(event)
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/CalendarNew.ets", line: 848, col: 11 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        selectedDate: this.selectedDate,
                                        events: this.events,
                                        calendarInfo: this.selectedCalendarInfo,
                                        onEventTap: (event: CalendarEvent) => this.editEvent(event)
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    events: this.events,
                                    calendarInfo: this.selectedCalendarInfo
                                });
                            }
                        }, { name: "DayView" });
                    }
                });
            }
            else {
                this.ifElseBranchUpdateFunction(4, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 菜单弹出层
            if (this.showMenu) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/CalendarNew.ets(862:9)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('rgba(0,0,0,0.3)');
                        Column.onClick(() => {
                            this.showMenu = false;
                        });
                    }, Column);
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/CalendarNew.ets(870:9)", "entry");
                        Column.position({ x: '50%', y: 100 });
                    }, Column);
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new CalendarMenu(this, {
                                    isShow: this.__showMenu,
                                    onJumpToDate: () => {
                                        this.showJumpDate = true;
                                    },
                                    onSearch: () => {
                                        this.showSearch = true;
                                    },
                                    onSettings: () => { },
                                    onHelp: () => { }
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/CalendarNew.ets", line: 871, col: 11 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        isShow: this.showMenu,
                                        onJumpToDate: () => {
                                            this.showJumpDate = true;
                                        },
                                        onSearch: () => {
                                            this.showSearch = true;
                                        },
                                        onSettings: () => { },
                                        onHelp: () => { }
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "CalendarMenu" });
                    }
                    Column.pop();
                });
            }
            // 添加日程悬浮按钮
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 添加日程悬浮按钮
            Button.createWithLabel('+');
            Button.debugLine("entry/src/main/ets/pages/CalendarNew.ets(887:7)", "entry");
            // 添加日程悬浮按钮
            Button.type(ButtonType.Circle);
            // 添加日程悬浮按钮
            Button.width(60);
            // 添加日程悬浮按钮
            Button.height(60);
            // 添加日程悬浮按钮
            Button.fontSize(36);
            // 添加日程悬浮按钮
            Button.fontWeight(FontWeight.Medium);
            // 添加日程悬浮按钮
            Button.fontColor('#FFFFFF');
            // 添加日程悬浮按钮
            Button.backgroundColor(Constants.COLOR_PRIMARY);
            // 添加日程悬浮按钮
            Button.shadow({
                radius: 12,
                color: 'rgba(255, 107, 53, 0.4)',
                offsetX: 0,
                offsetY: 4
            });
            // 添加日程悬浮按钮
            Button.position({ x: '100%', y: '100%' });
            // 添加日程悬浮按钮
            Button.translate({ x: -76, y: -76 });
            // 添加日程悬浮按钮
            Button.zIndex(10);
            // 添加日程悬浮按钮
            Button.onClick(() => {
                this.createEvent();
            });
        }, Button);
        // 添加日程悬浮按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 日程编辑弹窗
            if (this.showEventSheet) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/CalendarNew.ets(910:9)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.position({ x: 0, y: 0 });
                        Column.zIndex(100);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 半透明遮罩
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/CalendarNew.ets(912:11)", "entry");
                        // 半透明遮罩
                        Column.width('100%');
                        // 半透明遮罩
                        Column.height('100%');
                        // 半透明遮罩
                        Column.backgroundColor('#000000');
                        // 半透明遮罩
                        Column.opacity(0.5);
                        // 半透明遮罩
                        Column.onClick(() => {
                            this.showEventSheet = false;
                        });
                    }, Column);
                    // 半透明遮罩
                    Column.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/CalendarNew.ets(926:9)", "entry");
                        Column.width('100%');
                        Column.height('90%');
                        Column.backgroundColor(Constants.COLOR_BACKGROUND);
                        Column.borderRadius({ topLeft: 20, topRight: 20 });
                        Column.position({ x: 0, y: '10%' });
                        Column.zIndex(101);
                    }, Column);
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new EventSheet(this, {
                                    isShow: this.__showEventSheet,
                                    editEvent: this.editingEvent,
                                    selectedDate: this.__selectedDate,
                                    onSave: (event: CalendarEvent) => this.saveEvent(event),
                                    onDelete: (event: CalendarEvent) => this.deleteEvent(event)
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/CalendarNew.ets", line: 927, col: 11 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        isShow: this.showEventSheet,
                                        editEvent: this.editingEvent,
                                        selectedDate: this.selectedDate,
                                        onSave: (event: CalendarEvent) => this.saveEvent(event),
                                        onDelete: (event: CalendarEvent) => this.deleteEvent(event)
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    editEvent: this.editingEvent
                                });
                            }
                        }, { name: "EventSheet" });
                    }
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
