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
    tapActionId?: number;
    completeActionId?: number;
    deleteActionId?: number;
    taskService?: TaskService;
}
import { TaskItem } from "@normalized:N&&&entry/src/main/ets/components/TaskItem&";
import { TaskService } from "@normalized:N&&&entry/src/main/ets/service/TaskService&";
import { Task } from "@normalized:N&&&entry/src/main/ets/model/Task&";
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import { Utils } from "@normalized:N&&&entry/src/main/ets/common/Utils&";
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
        this.__tapActionId = new ObservedPropertySimplePU(0, this, "tapActionId");
        this.__completeActionId = new ObservedPropertySimplePU(0, this, "completeActionId");
        this.__deleteActionId = new ObservedPropertySimplePU(0, this, "deleteActionId");
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
        if (params.tapActionId !== undefined) {
            this.tapActionId = params.tapActionId;
        }
        if (params.completeActionId !== undefined) {
            this.completeActionId = params.completeActionId;
        }
        if (params.deleteActionId !== undefined) {
            this.deleteActionId = params.deleteActionId;
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
        this.__tapActionId.purgeDependencyOnElmtId(rmElmtId);
        this.__completeActionId.purgeDependencyOnElmtId(rmElmtId);
        this.__deleteActionId.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__tasks.aboutToBeDeleted();
        this.__allTasks.aboutToBeDeleted();
        this.__filteredTasks.aboutToBeDeleted();
        this.__filterStatus.aboutToBeDeleted();
        this.__searchKeyword.aboutToBeDeleted();
        this.__showAddDialog.aboutToBeDeleted();
        this.__newTask.aboutToBeDeleted();
        this.__tapActionId.aboutToBeDeleted();
        this.__completeActionId.aboutToBeDeleted();
        this.__deleteActionId.aboutToBeDeleted();
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
    private taskService: TaskService;
    aboutToAppear() {
        this.loadTasks();
        // 初始化过滤后的任务列表
        this.filteredTasks = [];
    }
    /**
     * 加载任务
     */
    async loadTasks(): Promise<void> {
        // 先加载所有任务用于统计
        this.allTasks = await this.taskService.getAllTasks();
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
    /**
     * 应用搜索过滤
     */
    applySearchFilter(): void {
        if (!this.searchKeyword || !this.searchKeyword.trim()) {
            // 如果没有搜索关键词，直接使用当前筛选的任务列表
            this.filteredTasks = this.tasks;
            return;
        }
        // 根据关键词过滤任务标题
        const keyword = this.searchKeyword.trim().toLowerCase();
        this.filteredTasks = this.tasks.filter(task => task.title.toLowerCase().includes(keyword));
    }
    /**
     * 搜索关键词变化
     */
    onSearchChange(keyword: string): void {
        this.searchKeyword = keyword;
        this.applySearchFilter();
    }
    /**
     * 获取已完成任务数量
     */
    getCompletedCount(): number {
        return this.allTasks.filter(t => t.status === Constants.TASK_STATUS_COMPLETED).length;
    }
    /**
     * 获取未完成任务数量
     */
    getPendingCount(): number {
        return this.allTasks.filter(t => t.status !== Constants.TASK_STATUS_COMPLETED).length;
    }
    /**
     * 切换筛选状态
     */
    onFilterChange(status: string): void {
        this.filterStatus = status;
        this.loadTasks();
        // 筛选状态改变后，如果有关键词，重新应用搜索过滤
        if (this.searchKeyword) {
            this.applySearchFilter();
        }
    }
    /**
     * 监听状态变化
     */
    aboutToUpdate() {
        if (this.completeActionId > 0) {
            const task = this.tasks.find(t => t.id === this.completeActionId);
            if (task) {
                this.onTaskComplete(task);
            }
            this.completeActionId = 0;
        }
        if (this.deleteActionId > 0) {
            const task = this.tasks.find(t => t.id === this.deleteActionId);
            if (task) {
                this.onTaskDelete(task);
            }
            this.deleteActionId = 0;
        }
        if (this.tapActionId > 0) {
            const task = this.tasks.find(t => t.id === this.tapActionId);
            if (task) {
                this.onTaskTap(task);
            }
            this.tapActionId = 0;
        }
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
        // TODO: 跳转到任务编辑页面
        console.info('点击任务:', task.title);
    }
    /**
     * 显示添加任务对话框
     */
    showAddTaskDialog(): void {
        this.newTask = new Task();
        this.newTask.priority = Constants.PRIORITY_LOW; // 默认低优先级
        this.showAddDialog = true;
    }
    /**
     * 添加任务
     */
    async addTask(): Promise<void> {
        // 验证任务标题不能为空
        if (!this.newTask.title || !this.newTask.title.trim()) {
            return;
        }
        try {
            // 创建任务
            await this.taskService.createTask(this.newTask);
            // 关闭对话框
            this.showAddDialog = false;
            // 重新加载任务列表
            await this.loadTasks();
            // 重置新建任务对象
            this.newTask = new Task();
            this.newTask.priority = Constants.PRIORITY_LOW;
        }
        catch (error) {
            console.error('添加任务失败:', error);
            // 可以在这里添加错误提示
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.debugLine("entry/src/main/ets/pages/Tasks.ets(189:5)", "entry");
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Tasks.ets(190:7)", "entry");
            Column.width('100%');
            Column.flexGrow(1);
            Column.backgroundColor(Constants.COLOR_BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 统计数据卡片
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Tasks.ets(192:9)", "entry");
            // 统计数据卡片
            Row.width('100%');
            // 统计数据卡片
            Row.padding({ left: 16, right: 16, top: 16, bottom: 12 });
            // 统计数据卡片
            Row.justifyContent(FlexAlign.SpaceAround);
        }, Row);
        this.buildStatCard.bind(this)('全部任务', this.allTasks.length.toString(), Constants.COLOR_PRIMARY);
        this.buildStatCard.bind(this)('已完成', this.getCompletedCount().toString(), Constants.COLOR_SUCCESS);
        this.buildStatCard.bind(this)('未完成', this.getPendingCount().toString(), Constants.COLOR_WARNING);
        // 统计数据卡片
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索框
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Tasks.ets(202:9)", "entry");
            // 搜索框
            Row.width('100%');
            // 搜索框
            Row.padding({ left: 16, right: 16, top: 0, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '搜索任务...', text: this.searchKeyword });
            TextInput.debugLine("entry/src/main/ets/pages/Tasks.ets(203:11)", "entry");
            TextInput.layoutWeight(1);
            TextInput.height(40);
            TextInput.fontSize(14);
            TextInput.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            TextInput.borderRadius(20);
            TextInput.padding({ left: 16, right: 16 });
            TextInput.onChange((value: string) => {
                this.onSearchChange(value);
            });
        }, TextInput);
        // 搜索框
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 筛选标签栏
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Tasks.ets(218:9)", "entry");
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
            If.create();
            // 任务列表
            if (this.filteredTasks.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Tasks.ets(230:11)", "entry");
                        Column.width('100%');
                        Column.layoutWeight(1);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.searchKeyword ? '未找到匹配的任务' : '暂无任务');
                        Text.debugLine("entry/src/main/ets/pages/Tasks.ets(231:13)", "entry");
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
                        List.create();
                        List.debugLine("entry/src/main/ets/pages/Tasks.ets(239:11)", "entry");
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
                                    ListItem.debugLine("entry/src/main/ets/pages/Tasks.ets(241:15)", "entry");
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
                                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Tasks.ets", line: 242, col: 17 });
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
                        this.forEachUpdateFunction(elmtId, this.filteredTasks, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 添加按钮 - 悬浮样式
            Button.createWithLabel('+');
            Button.debugLine("entry/src/main/ets/pages/Tasks.ets(257:9)", "entry");
            // 添加按钮 - 悬浮样式
            Button.type(ButtonType.Circle);
            // 添加按钮 - 悬浮样式
            Button.width(60);
            // 添加按钮 - 悬浮样式
            Button.height(60);
            // 添加按钮 - 悬浮样式
            Button.fontSize(36);
            // 添加按钮 - 悬浮样式
            Button.fontWeight(FontWeight.Medium);
            // 添加按钮 - 悬浮样式
            Button.fontColor(Constants.COLOR_TEXT_ON_PRIMARY);
            // 添加按钮 - 悬浮样式
            Button.backgroundColor(Constants.COLOR_PRIMARY);
            // 添加按钮 - 悬浮样式
            Button.shadow({
                radius: 12,
                color: 'rgba(255, 107, 53, 0.4)',
                offsetX: 0,
                offsetY: 4
            });
            // 添加按钮 - 悬浮样式
            Button.margin({ right: 20, bottom: 20 });
            // 添加按钮 - 悬浮样式
            Button.alignSelf(ItemAlign.End);
            // 添加按钮 - 悬浮样式
            Button.onClick(() => this.showAddTaskDialog());
        }, Button);
        // 添加按钮 - 悬浮样式
        Button.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 添加任务对话框
            if (this.showAddDialog) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildAddTaskDialog.bind(this)();
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
    buildAddTaskDialog(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Tasks.ets(290:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('rgba(0, 0, 0, 0.5)');
            Column.justifyContent(FlexAlign.Center);
            Column.onClick(() => {
                // 点击背景区域关闭对话框
                this.showAddDialog = false;
                // 重置表单
                this.newTask = new Task();
                this.newTask.priority = Constants.PRIORITY_LOW;
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Tasks.ets(291:7)", "entry");
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
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(293:9)", "entry");
            // 对话框标题
            Text.fontSize(22);
            // 对话框标题
            Text.fontWeight(FontWeight.Bold);
            // 对话框标题
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            // 对话框标题
            Text.margin({ bottom: 20 });
        }, Text);
        // 对话框标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 任务标题输入框
            Text.create('任务标题');
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(300:9)", "entry");
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
            TextInput.debugLine("entry/src/main/ets/pages/Tasks.ets(307:9)", "entry");
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
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(321:9)", "entry");
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
            TextArea.debugLine("entry/src/main/ets/pages/Tasks.ets(328:9)", "entry");
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
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(342:9)", "entry");
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
            Row.debugLine("entry/src/main/ets/pages/Tasks.ets(349:9)", "entry");
            Row.width('100%');
            Row.height(48);
            Row.padding({ left: 12, right: 12 });
            Row.backgroundColor(Constants.COLOR_BACKGROUND);
            Row.borderRadius(12);
            Row.margin({ bottom: 16 });
            Row.onClick(() => {
                // 设置为明天作为默认截止日期
                if (!this.newTask.dueDate) {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    this.newTask.dueDate = tomorrow;
                }
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.newTask.dueDate ? Utils.formatDate(this.newTask.dueDate, 'YYYY-MM-DD') : '点击选择日期');
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(350:11)", "entry");
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
                        Text.create('×');
                        Text.debugLine("entry/src/main/ets/pages/Tasks.ets(356:13)", "entry");
                        Text.fontSize(18);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.padding({ left: 8, right: 8 });
                        Text.onClick(() => {
                            this.newTask.dueDate = null;
                        });
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
            // 优先级选择
            Text.create('优先级');
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(381:9)", "entry");
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
            Row.debugLine("entry/src/main/ets/pages/Tasks.ets(388:9)", "entry");
            Row.width('100%');
            Row.margin({ bottom: 24 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 低优先级按钮
            Button.createWithLabel('低');
            Button.debugLine("entry/src/main/ets/pages/Tasks.ets(390:11)", "entry");
            // 低优先级按钮
            Button.type(ButtonType.Normal);
            // 低优先级按钮
            Button.layoutWeight(1);
            // 低优先级按钮
            Button.height(44);
            // 低优先级按钮
            Button.fontSize(15);
            // 低优先级按钮
            Button.fontWeight(FontWeight.Medium);
            // 低优先级按钮
            Button.backgroundColor(this.newTask.priority === Constants.PRIORITY_LOW
                ? '#FFA726'
                : Constants.COLOR_BACKGROUND);
            // 低优先级按钮
            Button.fontColor(this.newTask.priority === Constants.PRIORITY_LOW
                ? Constants.COLOR_TEXT_ON_PRIMARY
                : Constants.COLOR_TEXT_SECONDARY);
            // 低优先级按钮
            Button.borderRadius(10);
            // 低优先级按钮
            Button.onClick(() => {
                this.newTask.priority = Constants.PRIORITY_LOW;
            });
        }, Button);
        // 低优先级按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 中优先级按钮
            Button.createWithLabel('中');
            Button.debugLine("entry/src/main/ets/pages/Tasks.ets(412:11)", "entry");
            // 中优先级按钮
            Button.type(ButtonType.Normal);
            // 中优先级按钮
            Button.layoutWeight(1);
            // 中优先级按钮
            Button.height(44);
            // 中优先级按钮
            Button.fontSize(15);
            // 中优先级按钮
            Button.fontWeight(FontWeight.Medium);
            // 中优先级按钮
            Button.backgroundColor(this.newTask.priority === Constants.PRIORITY_MEDIUM
                ? '#FF8F00'
                : Constants.COLOR_BACKGROUND);
            // 中优先级按钮
            Button.fontColor(this.newTask.priority === Constants.PRIORITY_MEDIUM
                ? Constants.COLOR_TEXT_ON_PRIMARY
                : Constants.COLOR_TEXT_SECONDARY);
            // 中优先级按钮
            Button.borderRadius(10);
            // 中优先级按钮
            Button.margin({ left: 10 });
            // 中优先级按钮
            Button.onClick(() => {
                this.newTask.priority = Constants.PRIORITY_MEDIUM;
            });
        }, Button);
        // 中优先级按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 高优先级按钮
            Button.createWithLabel('高');
            Button.debugLine("entry/src/main/ets/pages/Tasks.ets(435:11)", "entry");
            // 高优先级按钮
            Button.type(ButtonType.Normal);
            // 高优先级按钮
            Button.layoutWeight(1);
            // 高优先级按钮
            Button.height(44);
            // 高优先级按钮
            Button.fontSize(15);
            // 高优先级按钮
            Button.fontWeight(FontWeight.Medium);
            // 高优先级按钮
            Button.backgroundColor(this.newTask.priority === Constants.PRIORITY_HIGH
                ? Constants.COLOR_DANGER
                : Constants.COLOR_BACKGROUND);
            // 高优先级按钮
            Button.fontColor(this.newTask.priority === Constants.PRIORITY_HIGH
                ? Constants.COLOR_TEXT_ON_PRIMARY
                : Constants.COLOR_TEXT_SECONDARY);
            // 高优先级按钮
            Button.borderRadius(10);
            // 高优先级按钮
            Button.margin({ left: 10 });
            // 高优先级按钮
            Button.onClick(() => {
                this.newTask.priority = Constants.PRIORITY_HIGH;
            });
        }, Button);
        // 高优先级按钮
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 操作按钮行
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Tasks.ets(461:9)", "entry");
            // 操作按钮行
            Row.width('100%');
            // 操作按钮行
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('取消');
            Button.debugLine("entry/src/main/ets/pages/Tasks.ets(462:11)", "entry");
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
                // 重置表单
                this.newTask = new Task();
                this.newTask.priority = Constants.PRIORITY_LOW;
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('确定');
            Button.debugLine("entry/src/main/ets/pages/Tasks.ets(478:11)", "entry");
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
    buildFilterButton(status: string, label: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(label);
            Button.debugLine("entry/src/main/ets/pages/Tasks.ets(527:5)", "entry");
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
    buildStatCard(title: string, value: string, color: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Tasks.ets(559:5)", "entry");
            Column.layoutWeight(1);
            Column.padding({ top: 16, bottom: 16, left: 12, right: 12 });
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Column.borderRadius(12);
            Column.margin({ left: 6, right: 6 });
            Column.justifyContent(FlexAlign.Center);
            Column.shadow({
                radius: 8,
                color: 'rgba(0, 0, 0, 0.06)',
                offsetX: 0,
                offsetY: 2
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(value);
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(560:7)", "entry");
            Text.fontSize(28);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(color);
            Text.margin({ bottom: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(565:7)", "entry");
            Text.fontSize(13);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
