if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Tasks_Params {
    tasks?: Task[];
    allTasks?: Task[];
    filteredTasks?: Task[];
    filterStatus?: string;
    searchKeyword?: string;
    showAddDialog?: boolean;
    newTask?: Task;
    sortType?: string;
    showDatePicker?: boolean;
    tempSelectedDate?: Date;
    monthChangeTrigger?: number;
    totalCount?: number;
    completedCount?: number;
    pendingCount?: number;
    showDetailDialog?: boolean;
    selectedTask?: Task | null;
    taskService?: TaskService;
}
import { TaskItem } from "@normalized:N&&&entry/src/main/ets/components/TaskItem&";
import { TaskService } from "@normalized:N&&&entry/src/main/ets/service/TaskService&";
import { Task } from "@normalized:N&&&entry/src/main/ets/model/Task&";
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import { Utils } from "@normalized:N&&&entry/src/main/ets/common/Utils&";
import promptAction from "@ohos:promptAction";
import { CalendarComponent } from "@normalized:N&&&entry/src/main/ets/components/CalendarComponent&";
import { IconComponent, IconType } from "@normalized:N&&&entry/src/main/ets/components/IconComponent&";
import { ButtonAnimationUtils } from "@normalized:N&&&entry/src/main/ets/utils/AnimationUtils&";
export class Tasks extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__tasks = new ObservedPropertyObjectPU([], this, "tasks");
        this.__allTasks = new ObservedPropertyObjectPU([], this, "allTasks");
        this.__filteredTasks = new ObservedPropertyObjectPU([], this, "filteredTasks");
        this.__filterStatus = new ObservedPropertySimplePU('all', this, "filterStatus");
        this.__searchKeyword = new ObservedPropertySimplePU('', this, "searchKeyword");
        this.__showAddDialog = new ObservedPropertySimplePU(false, this, "showAddDialog");
        this.__newTask = new ObservedPropertyObjectPU(new Task(), this, "newTask");
        this.__sortType = new ObservedPropertySimplePU('createTime', this, "sortType");
        this.__showDatePicker = new ObservedPropertySimplePU(false, this, "showDatePicker");
        this.__tempSelectedDate = new ObservedPropertyObjectPU(new Date(), this, "tempSelectedDate");
        this.__monthChangeTrigger = new ObservedPropertySimplePU(0, this, "monthChangeTrigger");
        this.__totalCount = new ObservedPropertySimplePU(0, this, "totalCount");
        this.__completedCount = new ObservedPropertySimplePU(0, this, "completedCount");
        this.__pendingCount = new ObservedPropertySimplePU(0, this, "pendingCount");
        this.__showDetailDialog = new ObservedPropertySimplePU(false, this, "showDetailDialog");
        this.__selectedTask = new ObservedPropertyObjectPU(null, this, "selectedTask");
        this.taskService = TaskService.getInstance();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Tasks_Params) {
        if (params.tasks !== undefined) {
            this.tasks = params.tasks;
        }
        if (params.allTasks !== undefined) {
            this.allTasks = params.allTasks;
        }
        if (params.filteredTasks !== undefined) {
            this.filteredTasks = params.filteredTasks;
        }
        if (params.filterStatus !== undefined) {
            this.filterStatus = params.filterStatus;
        }
        if (params.searchKeyword !== undefined) {
            this.searchKeyword = params.searchKeyword;
        }
        if (params.showAddDialog !== undefined) {
            this.showAddDialog = params.showAddDialog;
        }
        if (params.newTask !== undefined) {
            this.newTask = params.newTask;
        }
        if (params.sortType !== undefined) {
            this.sortType = params.sortType;
        }
        if (params.showDatePicker !== undefined) {
            this.showDatePicker = params.showDatePicker;
        }
        if (params.tempSelectedDate !== undefined) {
            this.tempSelectedDate = params.tempSelectedDate;
        }
        if (params.monthChangeTrigger !== undefined) {
            this.monthChangeTrigger = params.monthChangeTrigger;
        }
        if (params.totalCount !== undefined) {
            this.totalCount = params.totalCount;
        }
        if (params.completedCount !== undefined) {
            this.completedCount = params.completedCount;
        }
        if (params.pendingCount !== undefined) {
            this.pendingCount = params.pendingCount;
        }
        if (params.showDetailDialog !== undefined) {
            this.showDetailDialog = params.showDetailDialog;
        }
        if (params.selectedTask !== undefined) {
            this.selectedTask = params.selectedTask;
        }
        if (params.taskService !== undefined) {
            this.taskService = params.taskService;
        }
    }
    updateStateVars(params: Tasks_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__tasks.purgeDependencyOnElmtId(rmElmtId);
        this.__allTasks.purgeDependencyOnElmtId(rmElmtId);
        this.__filteredTasks.purgeDependencyOnElmtId(rmElmtId);
        this.__filterStatus.purgeDependencyOnElmtId(rmElmtId);
        this.__searchKeyword.purgeDependencyOnElmtId(rmElmtId);
        this.__showAddDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__newTask.purgeDependencyOnElmtId(rmElmtId);
        this.__sortType.purgeDependencyOnElmtId(rmElmtId);
        this.__showDatePicker.purgeDependencyOnElmtId(rmElmtId);
        this.__tempSelectedDate.purgeDependencyOnElmtId(rmElmtId);
        this.__monthChangeTrigger.purgeDependencyOnElmtId(rmElmtId);
        this.__totalCount.purgeDependencyOnElmtId(rmElmtId);
        this.__completedCount.purgeDependencyOnElmtId(rmElmtId);
        this.__pendingCount.purgeDependencyOnElmtId(rmElmtId);
        this.__showDetailDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedTask.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__tasks.aboutToBeDeleted();
        this.__allTasks.aboutToBeDeleted();
        this.__filteredTasks.aboutToBeDeleted();
        this.__filterStatus.aboutToBeDeleted();
        this.__searchKeyword.aboutToBeDeleted();
        this.__showAddDialog.aboutToBeDeleted();
        this.__newTask.aboutToBeDeleted();
        this.__sortType.aboutToBeDeleted();
        this.__showDatePicker.aboutToBeDeleted();
        this.__tempSelectedDate.aboutToBeDeleted();
        this.__monthChangeTrigger.aboutToBeDeleted();
        this.__totalCount.aboutToBeDeleted();
        this.__completedCount.aboutToBeDeleted();
        this.__pendingCount.aboutToBeDeleted();
        this.__showDetailDialog.aboutToBeDeleted();
        this.__selectedTask.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __tasks: ObservedPropertyObjectPU<Task[]>;
    get tasks() {
        return this.__tasks.get();
    }
    set tasks(newValue: Task[]) {
        this.__tasks.set(newValue);
    }
    private __allTasks: ObservedPropertyObjectPU<Task[]>; // 所有任务，用于统计
    get allTasks() {
        return this.__allTasks.get();
    }
    set allTasks(newValue: Task[]) {
        this.__allTasks.set(newValue);
    }
    private __filteredTasks: ObservedPropertyObjectPU<Task[]>; // 过滤后的任务列表
    get filteredTasks() {
        return this.__filteredTasks.get();
    }
    set filteredTasks(newValue: Task[]) {
        this.__filteredTasks.set(newValue);
    }
    private __filterStatus: ObservedPropertySimplePU<string>; // all, pending, in_progress, completed
    get filterStatus() {
        return this.__filterStatus.get();
    }
    set filterStatus(newValue: string) {
        this.__filterStatus.set(newValue);
    }
    private __searchKeyword: ObservedPropertySimplePU<string>; // 搜索关键词
    get searchKeyword() {
        return this.__searchKeyword.get();
    }
    set searchKeyword(newValue: string) {
        this.__searchKeyword.set(newValue);
    }
    private __showAddDialog: ObservedPropertySimplePU<boolean>;
    get showAddDialog() {
        return this.__showAddDialog.get();
    }
    set showAddDialog(newValue: boolean) {
        this.__showAddDialog.set(newValue);
    }
    private __newTask: ObservedPropertyObjectPU<Task>;
    get newTask() {
        return this.__newTask.get();
    }
    set newTask(newValue: Task) {
        this.__newTask.set(newValue);
    }
    private __sortType: ObservedPropertySimplePU<string>; // 排序方式：priority(重要性), dueDate(截止时间), createTime(创建时间)
    get sortType() {
        return this.__sortType.get();
    }
    set sortType(newValue: string) {
        this.__sortType.set(newValue);
    }
    private __showDatePicker: ObservedPropertySimplePU<boolean>; // 显示日期选择器
    get showDatePicker() {
        return this.__showDatePicker.get();
    }
    set showDatePicker(newValue: boolean) {
        this.__showDatePicker.set(newValue);
    }
    private __tempSelectedDate: ObservedPropertyObjectPU<Date>; // 临时选择的日期
    get tempSelectedDate() {
        return this.__tempSelectedDate.get();
    }
    set tempSelectedDate(newValue: Date) {
        this.__tempSelectedDate.set(newValue);
    }
    private __monthChangeTrigger: ObservedPropertySimplePU<number>; // 月份变化触发器
    get monthChangeTrigger() {
        return this.__monthChangeTrigger.get();
    }
    set monthChangeTrigger(newValue: number) {
        this.__monthChangeTrigger.set(newValue);
    }
    // 统计数据 - 使用 @State 确保 UI 更新
    private __totalCount: ObservedPropertySimplePU<number>;
    get totalCount() {
        return this.__totalCount.get();
    }
    set totalCount(newValue: number) {
        this.__totalCount.set(newValue);
    }
    private __completedCount: ObservedPropertySimplePU<number>;
    get completedCount() {
        return this.__completedCount.get();
    }
    set completedCount(newValue: number) {
        this.__completedCount.set(newValue);
    }
    private __pendingCount: ObservedPropertySimplePU<number>;
    get pendingCount() {
        return this.__pendingCount.get();
    }
    set pendingCount(newValue: number) {
        this.__pendingCount.set(newValue);
    }
    // 任务详情弹窗状态
    private __showDetailDialog: ObservedPropertySimplePU<boolean>;
    get showDetailDialog() {
        return this.__showDetailDialog.get();
    }
    set showDetailDialog(newValue: boolean) {
        this.__showDetailDialog.set(newValue);
    }
    private __selectedTask: ObservedPropertyObjectPU<Task | null>;
    get selectedTask() {
        return this.__selectedTask.get();
    }
    set selectedTask(newValue: Task | null) {
        this.__selectedTask.set(newValue);
    }
    private taskService: TaskService;
    aboutToAppear() {
        this.loadTasks();
    }
    /**
     * 加载任务
     */
    async loadTasks(): Promise<void> {
        try {
            // 先加载所有任务用于统计
            this.allTasks = await this.taskService.getAllTasks();
            // 更新统计数据
            this.updateStatistics();
            // 然后根据筛选状态加载任务列表
            if (this.filterStatus === 'all') {
                this.tasks = this.allTasks;
            }
            else {
                this.tasks = await this.taskService.getTasksByStatus(this.filterStatus);
            }
            // 应用搜索过滤
            this.applySearchFilter();
        }
        catch (error) {
            console.error('加载任务失败:', error);
            promptAction.showToast({ message: '加载任务失败' });
        }
    }
    /**
     * 更新统计数据
     */
    updateStatistics(): void {
        this.totalCount = this.allTasks.length;
        this.completedCount = this.allTasks.filter(t => t.status === Constants.TASK_STATUS_COMPLETED).length;
        this.pendingCount = this.allTasks.filter(t => t.status !== Constants.TASK_STATUS_COMPLETED).length;
    }
    /**
     * 应用搜索过滤
     */
    applySearchFilter(): void {
        let tasks = this.tasks;
        // 应用搜索过滤
        if (this.searchKeyword && this.searchKeyword.trim()) {
            const keyword = this.searchKeyword.trim().toLowerCase();
            tasks = tasks.filter(task => task.title.toLowerCase().includes(keyword));
        }
        // 应用排序
        this.filteredTasks = this.applySort(tasks);
    }
    /**
     * 应用排序
     */
    applySort(tasks: Task[]): Task[] {
        const sortedTasks = [...tasks];
        // 先分离已完成和未完成的任务
        const completedTasks = sortedTasks.filter(t => t.status === Constants.TASK_STATUS_COMPLETED);
        const activeTasks = sortedTasks.filter(t => t.status !== Constants.TASK_STATUS_COMPLETED);
        let sortedActiveTasks: Task[] = [];
        let sortedCompletedTasks: Task[] = [];
        if (this.sortType === 'priority') {
            // 重要性排序：重要程度从高到低（priority从高到低）
            sortedActiveTasks = activeTasks.sort((a, b) => {
                return b.priority - a.priority;
            });
            sortedCompletedTasks = completedTasks.sort((a, b) => {
                return b.priority - a.priority;
            });
        }
        else if (this.sortType === 'dueDate') {
            // 截止时间排序：截止时间早的在前
            sortedActiveTasks = activeTasks.sort((a, b) => {
                // 没有截止日期的排在最后
                if (!a.dueDate && !b.dueDate)
                    return 0;
                if (!a.dueDate)
                    return 1;
                if (!b.dueDate)
                    return -1;
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            });
            sortedCompletedTasks = completedTasks.sort((a, b) => {
                if (!a.dueDate && !b.dueDate)
                    return 0;
                if (!a.dueDate)
                    return 1;
                if (!b.dueDate)
                    return -1;
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            });
        }
        else if (this.sortType === 'createTime') {
            // 创建时间排序：创建时间越晚越在前面
            sortedActiveTasks = activeTasks.sort((a, b) => {
                return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
            });
            sortedCompletedTasks = completedTasks.sort((a, b) => {
                return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
            });
        }
        else {
            sortedActiveTasks = activeTasks;
            sortedCompletedTasks = completedTasks;
        }
        // 未完成的任务在前，已完成的任务在后
        return [...sortedActiveTasks, ...sortedCompletedTasks];
    }
    /**
     * 搜索关键词变化
     */
    onSearchChange(keyword: string): void {
        this.searchKeyword = keyword;
        this.applySearchFilter();
    }
    /**
     * 切换筛选状态
     */
    onFilterChange(status: string): void {
        this.filterStatus = status;
        this.loadTasks();
    }
    /**
     * 完成/取消完成任务 - 直接回调处理
     */
    async onTaskComplete(task: Task): Promise<void> {
        try {
            if (task.status === Constants.TASK_STATUS_COMPLETED) {
                await this.taskService.uncompleteTask(task);
                promptAction.showToast({ message: '已取消完成' });
            }
            else {
                await this.taskService.completeTask(task);
                promptAction.showToast({ message: '任务已完成' });
            }
            await this.loadTasks();
        }
        catch (error) {
            console.error('更新任务状态失败:', error);
            promptAction.showToast({ message: '操作失败，请重试' });
        }
    }
    /**
     * 删除任务 - 直接回调处理
     */
    async onTaskDelete(task: Task): Promise<void> {
        try {
            // 显示确认对话框
            AlertDialog.show({
                title: '确认删除',
                message: `确定要删除任务"${task.title}"吗？`,
                primaryButton: {
                    value: '取消',
                    action: () => { }
                },
                secondaryButton: {
                    value: '删除',
                    fontColor: Constants.COLOR_DANGER,
                    action: async () => {
                        try {
                            await this.taskService.deleteTask(task);
                            promptAction.showToast({ message: '任务已删除' });
                            await this.loadTasks();
                        }
                        catch (error) {
                            console.error('删除任务失败:', error);
                            promptAction.showToast({ message: '删除失败，请重试' });
                        }
                    }
                }
            });
        }
        catch (error) {
            console.error('删除任务失败:', error);
            promptAction.showToast({ message: '删除失败，请重试' });
        }
    }
    /**
     * 点击任务查看详情
     */
    onTaskTap(task: Task): void {
        this.selectedTask = task;
        this.showDetailDialog = true;
    }
    /**
     * 显示添加任务对话框
     */
    showAddTaskDialog(): void {
        this.newTask = new Task();
        this.newTask.priority = Constants.PRIORITY_LOW;
        this.showAddDialog = true;
    }
    /**
     * 添加任务
     */
    async addTask(): Promise<void> {
        if (!this.newTask.title || !this.newTask.title.trim()) {
            promptAction.showToast({ message: '请输入任务标题' });
            return;
        }
        try {
            await this.taskService.createTask(this.newTask);
            this.showAddDialog = false;
            await this.loadTasks();
            this.newTask = new Task();
            this.newTask.priority = Constants.PRIORITY_LOW;
            promptAction.showToast({ message: '任务已添加' });
        }
        catch (error) {
            console.error('添加任务失败:', error);
            promptAction.showToast({ message: '添加失败，请重试' });
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.debugLine("entry/src/main/ets/pages/Tasks.ets(258:5)", "entry");
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Tasks.ets(259:7)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(Constants.COLOR_BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 统计数据卡片 - 直接内联渲染以确保响应式更新
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Tasks.ets(261:9)", "entry");
            // 统计数据卡片 - 直接内联渲染以确保响应式更新
            Row.width('100%');
            // 统计数据卡片 - 直接内联渲染以确保响应式更新
            Row.padding({ left: 16, right: 16, top: 16, bottom: 12 });
            // 统计数据卡片 - 直接内联渲染以确保响应式更新
            Row.justifyContent(FlexAlign.SpaceAround);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 全部任务卡片
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Tasks.ets(263:11)", "entry");
            // 全部任务卡片
            Column.layoutWeight(1);
            // 全部任务卡片
            Column.padding({ top: 16, bottom: 16, left: 12, right: 12 });
            // 全部任务卡片
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            // 全部任务卡片
            Column.borderRadius(12);
            // 全部任务卡片
            Column.margin({ left: 6, right: 6 });
            // 全部任务卡片
            Column.justifyContent(FlexAlign.Center);
            // 全部任务卡片
            Column.shadow({
                radius: 8,
                color: 'rgba(0, 0, 0, 0.06)',
                offsetX: 0,
                offsetY: 2
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.totalCount.toString());
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(264:13)", "entry");
            Text.fontSize(28);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_PRIMARY);
            Text.margin({ bottom: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('全部任务');
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(269:13)", "entry");
            Text.fontSize(13);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        // 全部任务卡片
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 已完成卡片
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Tasks.ets(287:11)", "entry");
            // 已完成卡片
            Column.layoutWeight(1);
            // 已完成卡片
            Column.padding({ top: 16, bottom: 16, left: 12, right: 12 });
            // 已完成卡片
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            // 已完成卡片
            Column.borderRadius(12);
            // 已完成卡片
            Column.margin({ left: 6, right: 6 });
            // 已完成卡片
            Column.justifyContent(FlexAlign.Center);
            // 已完成卡片
            Column.shadow({
                radius: 8,
                color: 'rgba(0, 0, 0, 0.06)',
                offsetX: 0,
                offsetY: 2
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.completedCount.toString());
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(288:13)", "entry");
            Text.fontSize(28);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_SUCCESS);
            Text.margin({ bottom: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('已完成');
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(293:13)", "entry");
            Text.fontSize(13);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        // 已完成卡片
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 未完成卡片
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Tasks.ets(311:11)", "entry");
            // 未完成卡片
            Column.layoutWeight(1);
            // 未完成卡片
            Column.padding({ top: 16, bottom: 16, left: 12, right: 12 });
            // 未完成卡片
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            // 未完成卡片
            Column.borderRadius(12);
            // 未完成卡片
            Column.margin({ left: 6, right: 6 });
            // 未完成卡片
            Column.justifyContent(FlexAlign.Center);
            // 未完成卡片
            Column.shadow({
                radius: 8,
                color: 'rgba(0, 0, 0, 0.06)',
                offsetX: 0,
                offsetY: 2
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.pendingCount.toString());
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(312:13)", "entry");
            Text.fontSize(28);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_WARNING);
            Text.margin({ bottom: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('未完成');
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(317:13)", "entry");
            Text.fontSize(13);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        // 未完成卡片
        Column.pop();
        // 统计数据卡片 - 直接内联渲染以确保响应式更新
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索框
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Tasks.ets(339:9)", "entry");
            // 搜索框
            Row.width('100%');
            // 搜索框
            Row.padding({ left: Constants.SPACING_MD, right: Constants.SPACING_MD, bottom: Constants.SPACING_SM });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Tasks.ets(340:11)", "entry");
            Row.width('100%');
            Row.height(44);
            Row.padding({ left: Constants.SPACING_MD, right: Constants.SPACING_MD });
            Row.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Row.borderRadius(Constants.BORDER_RADIUS_XL);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            __Common__.create();
            __Common__.margin({ right: Constants.SPACING_SM });
        }, __Common__);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new IconComponent(this, {
                        iconType: IconType.SEARCH,
                        iconSize: 18,
                        iconColor: Constants.COLOR_TEXT_TERTIARY
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Tasks.ets", line: 341, col: 13 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            iconType: IconType.SEARCH,
                            iconSize: 18,
                            iconColor: Constants.COLOR_TEXT_TERTIARY
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        iconType: IconType.SEARCH,
                        iconSize: 18,
                        iconColor: Constants.COLOR_TEXT_TERTIARY
                    });
                }
            }, { name: "IconComponent" });
        }
        __Common__.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '搜索任务...', text: this.searchKeyword });
            TextInput.debugLine("entry/src/main/ets/pages/Tasks.ets(348:13)", "entry");
            TextInput.layoutWeight(1);
            TextInput.height(40);
            TextInput.fontSize(Constants.FONT_SIZE_SM);
            TextInput.backgroundColor('transparent');
            TextInput.border({ width: 0 });
            TextInput.onChange((value: string) => {
                this.onSearchChange(value);
            });
        }, TextInput);
        Row.pop();
        // 搜索框
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 筛选标签栏
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Tasks.ets(368:9)", "entry");
            // 筛选标签栏
            Row.width('100%');
            // 筛选标签栏
            Row.padding({ left: 16, right: 16, top: 8, bottom: 8 });
            // 筛选标签栏
            Row.justifyContent(FlexAlign.SpaceAround);
        }, Row);
        this.buildFilterButton.bind(this)('all', '全部');
        this.buildFilterButton.bind(this)(Constants.TASK_STATUS_PENDING, '待办');
        this.buildFilterButton.bind(this)(Constants.TASK_STATUS_IN_PROGRESS, '进行中');
        this.buildFilterButton.bind(this)(Constants.TASK_STATUS_COMPLETED, '已完成');
        // 筛选标签栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 排序方式选择
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Tasks.ets(379:9)", "entry");
            // 排序方式选择
            Row.width('100%');
            // 排序方式选择
            Row.padding({ left: 16, right: 16, top: 8, bottom: 12 });
            // 排序方式选择
            Row.justifyContent(FlexAlign.Start);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('排序方式：');
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(380:11)", "entry");
            Text.fontSize(14);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.margin({ right: 12 });
        }, Text);
        Text.pop();
        this.buildSortButton.bind(this)('priority', '重要性');
        this.buildSortButton.bind(this)('dueDate', '截止时间');
        this.buildSortButton.bind(this)('createTime', '创建时间');
        // 排序方式选择
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 任务列表 - 可滚动区域
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/Tasks.ets(394:9)", "entry");
            // 任务列表 - 可滚动区域
            Scroll.width('100%');
            // 任务列表 - 可滚动区域
            Scroll.layoutWeight(1);
            // 任务列表 - 可滚动区域
            Scroll.scrollBar(BarState.Auto);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.filteredTasks.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Tasks.ets(396:13)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.Center);
                        Column.padding({ top: 100 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.searchKeyword ? '未找到匹配的任务' : '暂无任务');
                        Text.debugLine("entry/src/main/ets/pages/Tasks.ets(397:15)", "entry");
                        Text.fontSize(16);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Tasks.ets(406:13)", "entry");
                        Column.width('100%');
                        Column.padding({ left: 16, right: 16, bottom: 80 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const task = _item;
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new TaskItem(this, {
                                            task: task,
                                            onComplete: (t: Task) => this.onTaskComplete(t),
                                            onDelete: (t: Task) => this.onTaskDelete(t),
                                            onTap: (t: Task) => this.onTaskTap(t)
                                        }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Tasks.ets", line: 408, col: 17 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                task: task,
                                                onComplete: (t: Task) => this.onTaskComplete(t),
                                                onDelete: (t: Task) => this.onTaskDelete(t),
                                                onTap: (t: Task) => this.onTaskTap(t)
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
                        };
                        this.forEachUpdateFunction(elmtId, this.filteredTasks, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        // 任务列表 - 可滚动区域
        Scroll.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 添加按钮 - 悬浮在最上层
            Button.createWithChild();
            Button.debugLine("entry/src/main/ets/pages/Tasks.ets(429:7)", "entry");
            Context.animation(ButtonAnimationUtils.hover());
            // 添加按钮 - 悬浮在最上层
            Button.type(ButtonType.Circle);
            // 添加按钮 - 悬浮在最上层
            Button.width(60);
            // 添加按钮 - 悬浮在最上层
            Button.height(60);
            // 添加按钮 - 悬浮在最上层
            Button.backgroundColor(Constants.COLOR_PRIMARY);
            // 添加按钮 - 悬浮在最上层
            Button.shadow({
                radius: 12,
                color: Constants.COLOR_SHADOW_PRIMARY,
                offsetX: 0,
                offsetY: 4
            });
            // 添加按钮 - 悬浮在最上层
            Button.position({ x: '100%', y: '100%' });
            // 添加按钮 - 悬浮在最上层
            Button.translate({ x: -80, y: -80 });
            // 添加按钮 - 悬浮在最上层
            Button.zIndex(Constants.Z_INDEX_MODAL);
            // 添加按钮 - 悬浮在最上层
            Button.onClick(() => this.showAddTaskDialog());
            Context.animation(null);
        }, Button);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new IconComponent(this, {
                        iconType: IconType.ADD,
                        iconSize: 28,
                        iconColor: Constants.COLOR_TEXT_ON_PRIMARY
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Tasks.ets", line: 430, col: 9 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            iconType: IconType.ADD,
                            iconSize: 28,
                            iconColor: Constants.COLOR_TEXT_ON_PRIMARY
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        iconType: IconType.ADD,
                        iconSize: 28,
                        iconColor: Constants.COLOR_TEXT_ON_PRIMARY
                    });
                }
            }, { name: "IconComponent" });
        }
        // 添加按钮 - 悬浮在最上层
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 添加任务对话框
            if (this.showAddDialog) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildAddTaskDialog.bind(this)();
                });
            }
            // 任务详情对话框
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 任务详情对话框
            if (this.showDetailDialog && this.selectedTask) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildTaskDetailDialog.bind(this)();
                });
            }
            // 日期选择器弹窗
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 日期选择器弹窗
            if (this.showDatePicker) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildDatePickerDialog.bind(this)();
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
    buildTaskDetailDialog(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Tasks.ets(473:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('rgba(0, 0, 0, 0.5)');
            Column.justifyContent(FlexAlign.Center);
            Column.onClick(() => {
                this.showDetailDialog = false;
                this.selectedTask = null;
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Tasks.ets(474:7)", "entry");
            Column.width('90%');
            Column.padding(24);
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(20);
            Column.shadow({
                radius: 20,
                color: 'rgba(0, 0, 0, 0.15)',
                offsetX: 0,
                offsetY: 8
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 对话框标题
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Tasks.ets(476:9)", "entry");
            // 对话框标题
            Row.width('100%');
            // 对话框标题
            Row.margin({ bottom: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('任务详情');
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(477:11)", "entry");
            Text.fontSize(Constants.FONT_SIZE_XL);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/Tasks.ets(482:11)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            __Common__.create();
            __Common__.onClick(() => {
                this.showDetailDialog = false;
                this.selectedTask = null;
            });
        }, __Common__);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new IconComponent(this, {
                        iconType: IconType.CLOSE,
                        iconSize: 24,
                        iconColor: Constants.COLOR_TEXT_SECONDARY
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Tasks.ets", line: 484, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            iconType: IconType.CLOSE,
                            iconSize: 24,
                            iconColor: Constants.COLOR_TEXT_SECONDARY
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        iconType: IconType.CLOSE,
                        iconSize: 24,
                        iconColor: Constants.COLOR_TEXT_SECONDARY
                    });
                }
            }, { name: "IconComponent" });
        }
        __Common__.pop();
        // 对话框标题
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 任务标题
            Text.create(this.selectedTask?.title || '');
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(498:9)", "entry");
            // 任务标题
            Text.fontSize(18);
            // 任务标题
            Text.fontWeight(FontWeight.Medium);
            // 任务标题
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            // 任务标题
            Text.width('100%');
            // 任务标题
            Text.margin({ bottom: 12 });
        }, Text);
        // 任务标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 任务描述
            if (this.selectedTask?.description) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.selectedTask.description);
                        Text.debugLine("entry/src/main/ets/pages/Tasks.ets(507:11)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.width('100%');
                        Text.margin({ bottom: 16 });
                    }, Text);
                    Text.pop();
                });
            }
            // 详情信息
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 详情信息
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Tasks.ets(515:9)", "entry");
            // 详情信息
            Column.width('100%');
            // 详情信息
            Column.backgroundColor(Constants.COLOR_BACKGROUND);
            // 详情信息
            Column.borderRadius(12);
            // 详情信息
            Column.padding(12);
            // 详情信息
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 状态
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Tasks.ets(517:11)", "entry");
            // 状态
            Row.width('100%');
            // 状态
            Row.padding({ top: 10, bottom: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('状态');
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(518:13)", "entry");
            Text.fontSize(14);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.width(80);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(Utils.getStatusText(this.selectedTask?.status || ''));
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(522:13)", "entry");
            Text.fontSize(14);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        Text.pop();
        // 状态
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 优先级
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Tasks.ets(530:11)", "entry");
            // 优先级
            Row.width('100%');
            // 优先级
            Row.padding({ top: 10, bottom: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('优先级');
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(531:13)", "entry");
            Text.fontSize(14);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.width(80);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(Utils.getPriorityText(this.selectedTask?.priority || 1));
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(535:13)", "entry");
            Text.fontSize(14);
            Text.fontColor(Utils.getPriorityColor(this.selectedTask?.priority || 1));
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        // 优先级
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 截止日期
            if (this.selectedTask?.dueDate) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/Tasks.ets(545:13)", "entry");
                        Row.width('100%');
                        Row.padding({ top: 10, bottom: 10 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('截止日期');
                        Text.debugLine("entry/src/main/ets/pages/Tasks.ets(546:15)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.width(80);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(Utils.formatDate(this.selectedTask.dueDate, 'YYYY-MM-DD'));
                        Text.debugLine("entry/src/main/ets/pages/Tasks.ets(550:15)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(this.selectedTask.isOverdue()
                            ? Constants.COLOR_DANGER
                            : Constants.COLOR_TEXT_PRIMARY);
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
            // 创建时间
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 创建时间
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Tasks.ets(563:11)", "entry");
            // 创建时间
            Row.width('100%');
            // 创建时间
            Row.padding({ top: 10, bottom: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('创建时间');
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(564:13)", "entry");
            Text.fontSize(14);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.width(80);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(Utils.formatDate(this.selectedTask?.createTime || new Date(), 'YYYY-MM-DD HH:mm'));
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(568:13)", "entry");
            Text.fontSize(14);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        Text.pop();
        // 创建时间
        Row.pop();
        // 详情信息
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 操作按钮
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Tasks.ets(582:9)", "entry");
            // 操作按钮
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 完成/取消完成按钮
            Button.createWithLabel(this.selectedTask?.status === Constants.TASK_STATUS_COMPLETED ? '取消完成' : '完成');
            Button.debugLine("entry/src/main/ets/pages/Tasks.ets(584:11)", "entry");
            // 完成/取消完成按钮
            Button.type(ButtonType.Normal);
            // 完成/取消完成按钮
            Button.layoutWeight(1);
            // 完成/取消完成按钮
            Button.height(44);
            // 完成/取消完成按钮
            Button.fontSize(15);
            // 完成/取消完成按钮
            Button.fontWeight(FontWeight.Medium);
            // 完成/取消完成按钮
            Button.backgroundColor(Constants.COLOR_SUCCESS);
            // 完成/取消完成按钮
            Button.fontColor('#FFFFFF');
            // 完成/取消完成按钮
            Button.borderRadius(10);
            // 完成/取消完成按钮
            Button.onClick(() => {
                if (this.selectedTask) {
                    this.onTaskComplete(ObservedObject.GetRawObject(this.selectedTask));
                    this.showDetailDialog = false;
                    this.selectedTask = null;
                }
            });
        }, Button);
        // 完成/取消完成按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 删除按钮
            Button.createWithLabel('删除');
            Button.debugLine("entry/src/main/ets/pages/Tasks.ets(602:11)", "entry");
            // 删除按钮
            Button.type(ButtonType.Normal);
            // 删除按钮
            Button.layoutWeight(1);
            // 删除按钮
            Button.height(44);
            // 删除按钮
            Button.fontSize(15);
            // 删除按钮
            Button.fontWeight(FontWeight.Medium);
            // 删除按钮
            Button.backgroundColor(Constants.COLOR_DANGER);
            // 删除按钮
            Button.fontColor('#FFFFFF');
            // 删除按钮
            Button.borderRadius(10);
            // 删除按钮
            Button.margin({ left: 12 });
            // 删除按钮
            Button.onClick(() => {
                if (this.selectedTask) {
                    this.showDetailDialog = false;
                    this.onTaskDelete(ObservedObject.GetRawObject(this.selectedTask));
                    this.selectedTask = null;
                }
            });
        }, Button);
        // 删除按钮
        Button.pop();
        // 操作按钮
        Row.pop();
        Column.pop();
        Column.pop();
    }
    buildAddTaskDialog(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Tasks.ets(645:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('rgba(0, 0, 0, 0.5)');
            Column.justifyContent(FlexAlign.Center);
            Column.onClick(() => {
                this.showAddDialog = false;
                this.newTask = new Task();
                this.newTask.priority = Constants.PRIORITY_LOW;
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Tasks.ets(646:7)", "entry");
            Column.width('90%');
            Column.padding(24);
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(20);
            Column.shadow({
                radius: 20,
                color: 'rgba(0, 0, 0, 0.15)',
                offsetX: 0,
                offsetY: 8
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 对话框标题
            Text.create('添加任务');
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(648:9)", "entry");
            // 对话框标题
            Text.fontSize(Constants.FONT_SIZE_2XL);
            // 对话框标题
            Text.fontWeight(FontWeight.Bold);
            // 对话框标题
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            // 对话框标题
            Text.margin({ bottom: Constants.SPACING_LG });
        }, Text);
        // 对话框标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 任务标题输入框
            Text.create('任务标题');
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(655:9)", "entry");
            // 任务标题输入框
            Text.fontSize(15);
            // 任务标题输入框
            Text.fontWeight(FontWeight.Medium);
            // 任务标题输入框
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            // 任务标题输入框
            Text.margin({ bottom: 8 });
            // 任务标题输入框
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        // 任务标题输入框
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入任务标题', text: this.newTask.title });
            TextInput.debugLine("entry/src/main/ets/pages/Tasks.ets(662:9)", "entry");
            TextInput.width('100%');
            TextInput.height(48);
            TextInput.maxLength(100);
            TextInput.fontSize(15);
            TextInput.backgroundColor(Constants.COLOR_BACKGROUND);
            TextInput.borderRadius(12);
            TextInput.padding({ left: 12, right: 12 });
            TextInput.onChange((value: string) => {
                this.newTask.title = value;
            });
            TextInput.margin({ bottom: 16 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 任务描述输入框
            Text.create('任务描述（可选）');
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(676:9)", "entry");
            // 任务描述输入框
            Text.fontSize(15);
            // 任务描述输入框
            Text.fontWeight(FontWeight.Medium);
            // 任务描述输入框
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            // 任务描述输入框
            Text.margin({ bottom: 8 });
            // 任务描述输入框
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        // 任务描述输入框
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextArea.create({ placeholder: '请输入任务描述', text: this.newTask.description });
            TextArea.debugLine("entry/src/main/ets/pages/Tasks.ets(683:9)", "entry");
            TextArea.width('100%');
            TextArea.height(80);
            TextArea.maxLength(500);
            TextArea.fontSize(14);
            TextArea.backgroundColor(Constants.COLOR_BACKGROUND);
            TextArea.borderRadius(12);
            TextArea.padding(12);
            TextArea.onChange((value: string) => {
                this.newTask.description = value;
            });
            TextArea.margin({ bottom: 16 });
        }, TextArea);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 截止日期选择
            Text.create('截止日期（可选）');
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(697:9)", "entry");
            // 截止日期选择
            Text.fontSize(15);
            // 截止日期选择
            Text.fontWeight(FontWeight.Medium);
            // 截止日期选择
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            // 截止日期选择
            Text.margin({ bottom: 8 });
            // 截止日期选择
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        // 截止日期选择
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Tasks.ets(704:9)", "entry");
            Row.width('100%');
            Row.height(48);
            Row.padding({ left: 12, right: 12 });
            Row.backgroundColor(Constants.COLOR_BACKGROUND);
            Row.borderRadius(12);
            Row.margin({ bottom: 16 });
            Row.onClick(() => {
                this.tempSelectedDate = this.newTask.dueDate || new Date();
                this.showDatePicker = true;
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.newTask.dueDate ? Utils.formatDate(this.newTask.dueDate, 'YYYY-MM-DD') : '点击选择日期');
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(705:11)", "entry");
            Text.fontSize(15);
            Text.fontColor(this.newTask.dueDate ? Constants.COLOR_TEXT_PRIMARY : Constants.COLOR_TEXT_SECONDARY);
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.newTask.dueDate) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        __Common__.create();
                        __Common__.padding({ left: Constants.SPACING_SM, right: Constants.SPACING_SM });
                        __Common__.onClick(() => {
                            this.newTask.dueDate = null;
                        });
                    }, __Common__);
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new IconComponent(this, {
                                    iconType: IconType.CLOSE,
                                    iconSize: 18,
                                    iconColor: Constants.COLOR_TEXT_SECONDARY
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Tasks.ets", line: 711, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        iconType: IconType.CLOSE,
                                        iconSize: 18,
                                        iconColor: Constants.COLOR_TEXT_SECONDARY
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    iconType: IconType.CLOSE,
                                    iconSize: 18,
                                    iconColor: Constants.COLOR_TEXT_SECONDARY
                                });
                            }
                        }, { name: "IconComponent" });
                    }
                    __Common__.pop();
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
            // 优先级选择
            Text.create('优先级');
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(734:9)", "entry");
            // 优先级选择
            Text.fontSize(15);
            // 优先级选择
            Text.fontWeight(FontWeight.Medium);
            // 优先级选择
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            // 优先级选择
            Text.margin({ bottom: 12 });
            // 优先级选择
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        // 优先级选择
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Tasks.ets(741:9)", "entry");
            Row.width('100%');
            Row.margin({ bottom: 24 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('低');
            Button.debugLine("entry/src/main/ets/pages/Tasks.ets(742:11)", "entry");
            Button.type(ButtonType.Normal);
            Button.layoutWeight(1);
            Button.height(44);
            Button.fontSize(15);
            Button.fontWeight(FontWeight.Medium);
            Button.backgroundColor(this.newTask.priority === Constants.PRIORITY_LOW
                ? '#FFA726'
                : Constants.COLOR_BACKGROUND);
            Button.fontColor(this.newTask.priority === Constants.PRIORITY_LOW
                ? Constants.COLOR_TEXT_ON_PRIMARY
                : Constants.COLOR_TEXT_SECONDARY);
            Button.borderRadius(10);
            Button.onClick(() => {
                this.newTask.priority = Constants.PRIORITY_LOW;
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('中');
            Button.debugLine("entry/src/main/ets/pages/Tasks.ets(763:11)", "entry");
            Button.type(ButtonType.Normal);
            Button.layoutWeight(1);
            Button.height(44);
            Button.fontSize(15);
            Button.fontWeight(FontWeight.Medium);
            Button.backgroundColor(this.newTask.priority === Constants.PRIORITY_MEDIUM
                ? '#FF8F00'
                : Constants.COLOR_BACKGROUND);
            Button.fontColor(this.newTask.priority === Constants.PRIORITY_MEDIUM
                ? Constants.COLOR_TEXT_ON_PRIMARY
                : Constants.COLOR_TEXT_SECONDARY);
            Button.borderRadius(10);
            Button.margin({ left: 10 });
            Button.onClick(() => {
                this.newTask.priority = Constants.PRIORITY_MEDIUM;
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('高');
            Button.debugLine("entry/src/main/ets/pages/Tasks.ets(785:11)", "entry");
            Button.type(ButtonType.Normal);
            Button.layoutWeight(1);
            Button.height(44);
            Button.fontSize(15);
            Button.fontWeight(FontWeight.Medium);
            Button.backgroundColor(this.newTask.priority === Constants.PRIORITY_HIGH
                ? Constants.COLOR_DANGER
                : Constants.COLOR_BACKGROUND);
            Button.fontColor(this.newTask.priority === Constants.PRIORITY_HIGH
                ? Constants.COLOR_TEXT_ON_PRIMARY
                : Constants.COLOR_TEXT_SECONDARY);
            Button.borderRadius(10);
            Button.margin({ left: 10 });
            Button.onClick(() => {
                this.newTask.priority = Constants.PRIORITY_HIGH;
            });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 操作按钮行
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Tasks.ets(811:9)", "entry");
            // 操作按钮行
            Row.width('100%');
            // 操作按钮行
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('取消');
            Button.debugLine("entry/src/main/ets/pages/Tasks.ets(812:11)", "entry");
            Button.type(ButtonType.Normal);
            Button.layoutWeight(1);
            Button.height(48);
            Button.fontSize(16);
            Button.fontWeight(FontWeight.Medium);
            Button.backgroundColor(Constants.COLOR_BACKGROUND);
            Button.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Button.borderRadius(12);
            Button.onClick(() => {
                this.showAddDialog = false;
                this.newTask = new Task();
                this.newTask.priority = Constants.PRIORITY_LOW;
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('确定');
            Button.debugLine("entry/src/main/ets/pages/Tasks.ets(827:11)", "entry");
            Button.type(ButtonType.Normal);
            Button.layoutWeight(1);
            Button.height(48);
            Button.fontSize(16);
            Button.fontWeight(FontWeight.Medium);
            Button.backgroundColor(Constants.COLOR_PRIMARY);
            Button.fontColor(Constants.COLOR_TEXT_ON_PRIMARY);
            Button.borderRadius(12);
            Button.margin({ left: 16 });
            Button.shadow({
                radius: 8,
                color: 'rgba(255, 107, 53, 0.3)',
                offsetX: 0,
                offsetY: 2
            });
            Button.onClick(() => {
                this.addTask();
            });
        }, Button);
        Button.pop();
        // 操作按钮行
        Row.pop();
        Column.pop();
        Column.pop();
    }
    /**
     * 构建日期选择器弹窗
     */
    buildDatePickerDialog(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Tasks.ets(877:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('rgba(0, 0, 0, 0.5)');
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
            Column.onClick(() => {
                this.showDatePicker = false;
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Tasks.ets(878:7)", "entry");
            Column.width('90%');
            Column.padding(24);
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(20);
            Column.shadow({
                radius: 20,
                color: 'rgba(0, 0, 0, 0.15)',
                offsetX: 0,
                offsetY: 8
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 对话框标题
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Tasks.ets(880:9)", "entry");
            // 对话框标题
            Row.width('100%');
            // 对话框标题
            Row.margin({ bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('选择截止日期');
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(881:11)", "entry");
            Text.fontSize(Constants.FONT_SIZE_XL);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/Tasks.ets(886:11)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            __Common__.create();
            __Common__.onClick(() => {
                this.showDatePicker = false;
            });
        }, __Common__);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new IconComponent(this, {
                        iconType: IconType.CLOSE,
                        iconSize: 24,
                        iconColor: Constants.COLOR_TEXT_SECONDARY
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Tasks.ets", line: 888, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            iconType: IconType.CLOSE,
                            iconSize: 24,
                            iconColor: Constants.COLOR_TEXT_SECONDARY
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        iconType: IconType.CLOSE,
                        iconSize: 24,
                        iconColor: Constants.COLOR_TEXT_SECONDARY
                    });
                }
            }, { name: "IconComponent" });
        }
        __Common__.pop();
        // 对话框标题
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            __Common__.create();
            __Common__.width('100%');
            __Common__.margin({ bottom: 20 });
        }, __Common__);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 日历组件
                    CalendarComponent(this, {
                        selectedDate: this.tempSelectedDate,
                        tasks: [],
                        holidays: [],
                        selectedDateChanged: this.__tempSelectedDate,
                        monthChangeTrigger: this.__monthChangeTrigger
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Tasks.ets", line: 901, col: 9 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            selectedDate: this.tempSelectedDate,
                            tasks: [],
                            holidays: [],
                            selectedDateChanged: this.tempSelectedDate,
                            monthChangeTrigger: this.monthChangeTrigger
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        selectedDate: this.tempSelectedDate,
                        tasks: [],
                        holidays: []
                    });
                }
            }, { name: "CalendarComponent" });
        }
        __Common__.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 操作按钮
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Tasks.ets(912:9)", "entry");
            // 操作按钮
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('取消');
            Button.debugLine("entry/src/main/ets/pages/Tasks.ets(913:11)", "entry");
            Button.type(ButtonType.Normal);
            Button.layoutWeight(1);
            Button.height(44);
            Button.fontSize(15);
            Button.fontWeight(FontWeight.Medium);
            Button.backgroundColor(Constants.COLOR_BACKGROUND);
            Button.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Button.borderRadius(10);
            Button.onClick(() => {
                this.showDatePicker = false;
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('确定');
            Button.debugLine("entry/src/main/ets/pages/Tasks.ets(926:11)", "entry");
            Button.type(ButtonType.Normal);
            Button.layoutWeight(1);
            Button.height(44);
            Button.fontSize(15);
            Button.fontWeight(FontWeight.Medium);
            Button.backgroundColor(Constants.COLOR_PRIMARY);
            Button.fontColor(Constants.COLOR_TEXT_ON_PRIMARY);
            Button.borderRadius(10);
            Button.margin({ left: 12 });
            Button.onClick(() => {
                this.newTask.dueDate = new Date(this.tempSelectedDate);
                this.newTask.dueDate.setHours(0, 0, 0, 0);
                this.showDatePicker = false;
            });
        }, Button);
        Button.pop();
        // 操作按钮
        Row.pop();
        Column.pop();
        Column.pop();
    }
    buildFilterButton(status: string, label: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(label);
            Button.debugLine("entry/src/main/ets/pages/Tasks.ets(967:5)", "entry");
            Button.type(ButtonType.Normal);
            Button.fontSize(14);
            Button.fontWeight(this.filterStatus === status ? FontWeight.Medium : FontWeight.Normal);
            Button.fontColor(this.filterStatus === status
                ? Constants.COLOR_TEXT_ON_PRIMARY
                : Constants.COLOR_TEXT_SECONDARY);
            Button.backgroundColor(this.filterStatus === status
                ? Constants.COLOR_PRIMARY
                : Constants.COLOR_CARD_BACKGROUND);
            Button.borderRadius(20);
            Button.padding({ left: 18, right: 18, top: 8, bottom: 8 });
            Button.shadow(this.filterStatus === status ? {
                radius: 6,
                color: 'rgba(255, 107, 53, 0.3)',
                offsetX: 0,
                offsetY: 2
            } : {
                radius: 0,
                color: 'transparent',
                offsetX: 0,
                offsetY: 0
            });
            Button.onClick(() => this.onFilterChange(status));
        }, Button);
        Button.pop();
    }
    /**
     * 切换排序方式
     */
    onSortChange(sortType: string): void {
        this.sortType = sortType;
        this.applySearchFilter();
    }
    buildSortButton(sortType: string, label: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(label);
            Button.debugLine("entry/src/main/ets/pages/Tasks.ets(1007:5)", "entry");
            Button.type(ButtonType.Normal);
            Button.fontSize(13);
            Button.fontWeight(this.sortType === sortType ? FontWeight.Medium : FontWeight.Normal);
            Button.fontColor(this.sortType === sortType
                ? Constants.COLOR_TEXT_ON_PRIMARY
                : Constants.COLOR_TEXT_SECONDARY);
            Button.backgroundColor(this.sortType === sortType
                ? Constants.COLOR_PRIMARY
                : Constants.COLOR_CARD_BACKGROUND);
            Button.borderRadius(16);
            Button.padding({ left: 14, right: 14, top: 6, bottom: 6 });
            Button.margin({ right: 8 });
            Button.onClick(() => this.onSortChange(sortType));
        }, Button);
        Button.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
