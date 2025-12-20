if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Tasks_Params {
    tasks?: Task[];
    allTasks?: Task[];
    filterStatus?: string;
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
export class Tasks extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__tasks = new ObservedPropertyObjectPU([], this, "tasks");
        this.__allTasks = new ObservedPropertyObjectPU([], this, "allTasks");
        this.__filterStatus = new ObservedPropertySimplePU('all', this, "filterStatus");
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
        if (params.filterStatus !== undefined) {
            this.filterStatus = params.filterStatus;
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
        this.__filterStatus.purgeDependencyOnElmtId(rmElmtId);
        this.__showAddDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__newTask.purgeDependencyOnElmtId(rmElmtId);
        this.__tapActionId.purgeDependencyOnElmtId(rmElmtId);
        this.__completeActionId.purgeDependencyOnElmtId(rmElmtId);
        this.__deleteActionId.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__tasks.aboutToBeDeleted();
        this.__allTasks.aboutToBeDeleted();
        this.__filterStatus.aboutToBeDeleted();
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
    private __filterStatus: ObservedPropertySimplePU<string>; // all, pending, in_progress, completed
    get filterStatus() {
        return this.__filterStatus.get();
    }
    set filterStatus(newValue: string) {
        this.__filterStatus.set(newValue);
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
        this.showAddDialog = true;
    }
    /**
     * 添加任务
     */
    async addTask(): Promise<void> {
        if (!this.newTask.title.trim()) {
            return;
        }
        await this.taskService.createTask(this.newTask);
        this.showAddDialog = false;
        await this.loadTasks();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.debugLine("entry/src/main/ets/pages/Tasks.ets(140:5)", "entry");
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Tasks.ets(141:7)", "entry");
            Column.width('100%');
            Column.flexGrow(1);
            Column.backgroundColor(Constants.COLOR_BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 统计数据卡片
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Tasks.ets(143:9)", "entry");
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
            // 筛选标签栏
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Tasks.ets(153:9)", "entry");
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
            if (this.tasks.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Tasks.ets(165:11)", "entry");
                        Column.width('100%');
                        Column.layoutWeight(1);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无任务');
                        Text.debugLine("entry/src/main/ets/pages/Tasks.ets(166:13)", "entry");
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
                        List.debugLine("entry/src/main/ets/pages/Tasks.ets(174:11)", "entry");
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
                                    ListItem.debugLine("entry/src/main/ets/pages/Tasks.ets(176:15)", "entry");
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
                                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Tasks.ets", line: 177, col: 17 });
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
                        this.forEachUpdateFunction(elmtId, this.tasks, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 添加按钮
            Button.createWithLabel('+');
            Button.debugLine("entry/src/main/ets/pages/Tasks.ets(192:9)", "entry");
            // 添加按钮
            Button.type(ButtonType.Circle);
            // 添加按钮
            Button.width(56);
            // 添加按钮
            Button.height(56);
            // 添加按钮
            Button.fontSize(32);
            // 添加按钮
            Button.fontColor(Constants.COLOR_TEXT_ON_PRIMARY);
            // 添加按钮
            Button.backgroundColor(Constants.COLOR_PRIMARY);
            // 添加按钮
            Button.margin({ right: 16, bottom: 16 });
            // 添加按钮
            Button.alignSelf(ItemAlign.End);
            // 添加按钮
            Button.onClick(() => this.showAddTaskDialog());
        }, Button);
        // 添加按钮
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
            Column.debugLine("entry/src/main/ets/pages/Tasks.ets(218:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('rgba(0, 0, 0, 0.5)');
            Column.justifyContent(FlexAlign.Center);
            Column.onClick(() => {
                this.showAddDialog = false;
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Tasks.ets(219:7)", "entry");
            Column.width('80%');
            Column.padding(24);
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(12);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('添加任务');
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(220:9)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: 16 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入任务标题' });
            TextInput.debugLine("entry/src/main/ets/pages/Tasks.ets(225:9)", "entry");
            TextInput.width('100%');
            TextInput.height(40);
            TextInput.onChange((value: string) => {
                this.newTask.title = value;
            });
            TextInput.margin({ bottom: 12 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入任务描述（可选）' });
            TextInput.debugLine("entry/src/main/ets/pages/Tasks.ets(233:9)", "entry");
            TextInput.width('100%');
            TextInput.height(80);
            TextInput.type(InputType.Normal);
            TextInput.onChange((value: string) => {
                this.newTask.description = value;
            });
            TextInput.margin({ bottom: 16 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Tasks.ets(242:9)", "entry");
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceAround);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('取消');
            Button.debugLine("entry/src/main/ets/pages/Tasks.ets(243:11)", "entry");
            Button.type(ButtonType.Normal);
            Button.layoutWeight(1);
            Button.onClick(() => {
                this.showAddDialog = false;
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('确定');
            Button.debugLine("entry/src/main/ets/pages/Tasks.ets(250:11)", "entry");
            Button.type(ButtonType.Normal);
            Button.layoutWeight(1);
            Button.backgroundColor(Constants.COLOR_PRIMARY);
            Button.fontColor('#FFFFFF');
            Button.onClick(() => {
                this.addTask();
            });
        }, Button);
        Button.pop();
        Row.pop();
        Column.pop();
        Column.pop();
    }
    buildFilterButton(status: string, label: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(label);
            Button.debugLine("entry/src/main/ets/pages/Tasks.ets(278:5)", "entry");
            Button.type(ButtonType.Normal);
            Button.fontSize(14);
            Button.fontColor(this.filterStatus === status
                ? Constants.COLOR_TEXT_ON_PRIMARY
                : Constants.COLOR_TEXT_PRIMARY);
            Button.backgroundColor(this.filterStatus === status
                ? Constants.COLOR_PRIMARY
                : Constants.COLOR_CARD_BACKGROUND);
            Button.borderRadius(16);
            Button.padding({ left: 16, right: 16, top: 6, bottom: 6 });
            Button.onClick(() => this.onFilterChange(status));
        }, Button);
        Button.pop();
    }
    buildStatCard(title: string, value: string, color: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Tasks.ets(298:5)", "entry");
            Column.layoutWeight(1);
            Column.padding(12);
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Column.borderRadius(8);
            Column.margin({ left: 4, right: 4 });
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(value);
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(299:7)", "entry");
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(color);
            Text.margin({ bottom: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Text.debugLine("entry/src/main/ets/pages/Tasks.ets(304:7)", "entry");
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
