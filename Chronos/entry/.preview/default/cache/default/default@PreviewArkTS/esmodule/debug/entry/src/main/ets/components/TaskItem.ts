if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface TaskItem_Params {
    task?: Task;
    onTapAction?: number;
    onCompleteAction?: number;
    onDeleteAction?: number;
    actionId?: number;
}
import { Task } from "@normalized:N&&&entry/src/main/ets/model/Task&";
import { Utils } from "@normalized:N&&&entry/src/main/ets/common/Utils&";
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
export class TaskItem extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__task = new SynchedPropertyObjectOneWayPU(params.task, this, "task");
        this.__onTapAction = new SynchedPropertySimpleTwoWayPU(params.onTapAction, this, "onTapAction");
        this.__onCompleteAction = new SynchedPropertySimpleTwoWayPU(params.onCompleteAction, this, "onCompleteAction");
        this.__onDeleteAction = new SynchedPropertySimpleTwoWayPU(params.onDeleteAction, this, "onDeleteAction");
        this.__actionId = new ObservedPropertySimplePU(0, this, "actionId");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: TaskItem_Params) {
        if (params.task === undefined) {
            this.__task.set(new Task());
        }
        if (params.actionId !== undefined) {
            this.actionId = params.actionId;
        }
    }
    updateStateVars(params: TaskItem_Params) {
        this.__task.reset(params.task);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__task.purgeDependencyOnElmtId(rmElmtId);
        this.__onTapAction.purgeDependencyOnElmtId(rmElmtId);
        this.__onCompleteAction.purgeDependencyOnElmtId(rmElmtId);
        this.__onDeleteAction.purgeDependencyOnElmtId(rmElmtId);
        this.__actionId.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__task.aboutToBeDeleted();
        this.__onTapAction.aboutToBeDeleted();
        this.__onCompleteAction.aboutToBeDeleted();
        this.__onDeleteAction.aboutToBeDeleted();
        this.__actionId.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __task: SynchedPropertySimpleOneWayPU<Task>;
    get task() {
        return this.__task.get();
    }
    set task(newValue: Task) {
        this.__task.set(newValue);
    }
    private __onTapAction: SynchedPropertySimpleTwoWayPU<number>;
    get onTapAction() {
        return this.__onTapAction.get();
    }
    set onTapAction(newValue: number) {
        this.__onTapAction.set(newValue);
    }
    private __onCompleteAction: SynchedPropertySimpleTwoWayPU<number>;
    get onCompleteAction() {
        return this.__onCompleteAction.get();
    }
    set onCompleteAction(newValue: number) {
        this.__onCompleteAction.set(newValue);
    }
    private __onDeleteAction: SynchedPropertySimpleTwoWayPU<number>;
    get onDeleteAction() {
        return this.__onDeleteAction.get();
    }
    set onDeleteAction(newValue: number) {
        this.__onDeleteAction.set(newValue);
    }
    private __actionId: ObservedPropertySimplePU<number>;
    get actionId() {
        return this.__actionId.get();
    }
    set actionId(newValue: number) {
        this.__actionId.set(newValue);
    }
    aboutToAppear() {
        this.actionId = this.task.id;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/TaskItem.ets(22:5)", "entry");
            Row.width('100%');
            Row.padding({ top: 16, bottom: 16, left: 16, right: 14 });
            Row.backgroundColor(this.task.status === Constants.TASK_STATUS_COMPLETED
                ? Constants.COLOR_BACKGROUND
                : Constants.COLOR_CARD_BACKGROUND);
            Row.borderRadius(14);
            Row.margin({ bottom: 10 });
            Row.shadow(this.task.status === Constants.TASK_STATUS_COMPLETED ? {
                radius: 0,
                color: 'transparent',
                offsetX: 0,
                offsetY: 0
            } : {
                radius: 8,
                color: 'rgba(0, 0, 0, 0.04)',
                offsetX: 0,
                offsetY: 2
            });
            Row.opacity(this.task.status === Constants.TASK_STATUS_COMPLETED
                ? 0.75
                : 1.0);
            Row.onClick(() => {
                this.onTapAction = this.task.id;
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 完成状态圆圈按钮
            if (this.task.status === Constants.TASK_STATUS_COMPLETED) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 已完成：实心圆圈带对勾
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/TaskItem.ets(26:9)", "entry");
                        // 已完成：实心圆圈带对勾
                        Column.width(26);
                        // 已完成：实心圆圈带对勾
                        Column.height(26);
                        // 已完成：实心圆圈带对勾
                        Column.borderRadius(13);
                        // 已完成：实心圆圈带对勾
                        Column.backgroundColor(Constants.COLOR_SUCCESS);
                        // 已完成：实心圆圈带对勾
                        Column.justifyContent(FlexAlign.Center);
                        // 已完成：实心圆圈带对勾
                        Column.onClick(() => {
                            this.onCompleteAction = this.task.id;
                        });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('✓');
                        Text.debugLine("entry/src/main/ets/components/TaskItem.ets(27:11)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#FFFFFF');
                        Text.fontWeight(FontWeight.Bold);
                    }, Text);
                    Text.pop();
                    // 已完成：实心圆圈带对勾
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 未完成：空心圆圈，带主题色边框
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/TaskItem.ets(42:9)", "entry");
                        // 未完成：空心圆圈，带主题色边框
                        Column.width(26);
                        // 未完成：空心圆圈，带主题色边框
                        Column.height(26);
                        // 未完成：空心圆圈，带主题色边框
                        Column.borderRadius(13);
                        // 未完成：空心圆圈，带主题色边框
                        Column.border({ width: 2, color: Constants.COLOR_PRIMARY_LIGHT });
                        // 未完成：空心圆圈，带主题色边框
                        Column.backgroundColor('transparent');
                        // 未完成：空心圆圈，带主题色边框
                        Column.onClick(() => {
                            this.onCompleteAction = this.task.id;
                        });
                    }, Column);
                    // 未完成：空心圆圈，带主题色边框
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 任务信息
            Column.create();
            Column.debugLine("entry/src/main/ets/components/TaskItem.ets(54:7)", "entry");
            // 任务信息
            Column.layoutWeight(1);
            // 任务信息
            Column.alignItems(HorizontalAlign.Start);
            // 任务信息
            Column.margin({ left: 14 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.task.title);
            Text.debugLine("entry/src/main/ets/components/TaskItem.ets(55:9)", "entry");
            Text.fontSize(16);
            Text.fontColor(this.task.status === Constants.TASK_STATUS_COMPLETED
                ? Constants.COLOR_TEXT_TERTIARY
                : Constants.COLOR_TEXT_PRIMARY);
            Text.fontWeight(this.task.status === Constants.TASK_STATUS_COMPLETED
                ? FontWeight.Normal
                : FontWeight.Medium);
            Text.decoration(this.task.status === Constants.TASK_STATUS_COMPLETED
                ? { type: TextDecorationType.LineThrough, color: Constants.COLOR_TEXT_TERTIARY }
                : { type: TextDecorationType.None });
            Text.maxLines(2);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.task.description) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.task.description);
                        Text.debugLine("entry/src/main/ets/components/TaskItem.ets(76:11)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.maxLines(2);
                        Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        Text.margin({ top: 6 });
                    }, Text);
                    Text.pop();
                });
            }
            // 任务元信息
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 任务元信息
            Row.create();
            Row.debugLine("entry/src/main/ets/components/TaskItem.ets(85:9)", "entry");
            // 任务元信息
            Row.width('100%');
            // 任务元信息
            Row.margin({ top: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 优先级标签 - 美化样式
            Text.create(Utils.getPriorityText(this.task.priority));
            Text.debugLine("entry/src/main/ets/components/TaskItem.ets(87:11)", "entry");
            // 优先级标签 - 美化样式
            Text.fontSize(11);
            // 优先级标签 - 美化样式
            Text.fontWeight(FontWeight.Medium);
            // 优先级标签 - 美化样式
            Text.fontColor('#FFFFFF');
            // 优先级标签 - 美化样式
            Text.backgroundColor(Utils.getPriorityColor(this.task.priority));
            // 优先级标签 - 美化样式
            Text.padding({ left: 8, right: 8, top: 3, bottom: 3 });
            // 优先级标签 - 美化样式
            Text.borderRadius(10);
        }, Text);
        // 优先级标签 - 美化样式
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 截止日期
            if (this.task.dueDate) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/components/TaskItem.ets(97:13)", "entry");
                        Row.margin({ left: 10 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('📅');
                        Text.debugLine("entry/src/main/ets/components/TaskItem.ets(98:15)", "entry");
                        Text.fontSize(12);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(Utils.formatDate(this.task.dueDate, 'MM-DD'));
                        Text.debugLine("entry/src/main/ets/components/TaskItem.ets(100:15)", "entry");
                        Text.fontSize(12);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor(this.task.isOverdue()
                            ? Constants.COLOR_DANGER
                            : (this.task.isDueToday() ? Constants.COLOR_WARNING : Constants.COLOR_TEXT_SECONDARY));
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/components/TaskItem.ets(113:11)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 状态标签 - 美化样式
            Text.create(Utils.getStatusText(this.task.status));
            Text.debugLine("entry/src/main/ets/components/TaskItem.ets(116:11)", "entry");
            // 状态标签 - 美化样式
            Text.fontSize(11);
            // 状态标签 - 美化样式
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            // 状态标签 - 美化样式
            Text.backgroundColor(Constants.COLOR_BACKGROUND);
            // 状态标签 - 美化样式
            Text.padding({ left: 8, right: 8, top: 3, bottom: 3 });
            // 状态标签 - 美化样式
            Text.borderRadius(10);
        }, Text);
        // 状态标签 - 美化样式
        Text.pop();
        // 任务元信息
        Row.pop();
        // 任务信息
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 删除按钮 - 美化样式
            Column.create();
            Column.debugLine("entry/src/main/ets/components/TaskItem.ets(131:7)", "entry");
            // 删除按钮 - 美化样式
            Column.width(32);
            // 删除按钮 - 美化样式
            Column.height(32);
            // 删除按钮 - 美化样式
            Column.borderRadius(16);
            // 删除按钮 - 美化样式
            Column.backgroundColor(Constants.COLOR_BACKGROUND);
            // 删除按钮 - 美化样式
            Column.justifyContent(FlexAlign.Center);
            // 删除按钮 - 美化样式
            Column.onClick(() => {
                this.onDeleteAction = this.task.id;
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('×');
            Text.debugLine("entry/src/main/ets/components/TaskItem.ets(132:9)", "entry");
            Text.fontSize(18);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        // 删除按钮 - 美化样式
        Column.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
