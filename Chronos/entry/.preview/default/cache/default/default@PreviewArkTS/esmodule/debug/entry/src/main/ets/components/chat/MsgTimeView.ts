if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MsgTimeView_Params {
    message?: ChatMessage;
    // 是否需要显示时间（超过2分钟才显示，仿微信逻辑）
    showTime?: boolean;
}
import ToolKits from "@normalized:N&&&entry/src/main/ets/utils/ToolKits&";
import type { ChatMessage } from '../../pages/Chat';
export class MsgTimeView extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.message = undefined;
        this.showTime = false;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MsgTimeView_Params) {
        if (params.message !== undefined) {
            this.message = params.message;
        }
        if (params.showTime !== undefined) {
            this.showTime = params.showTime;
        }
    }
    updateStateVars(params: MsgTimeView_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private message?: ChatMessage;
    // 是否需要显示时间（超过2分钟才显示，仿微信逻辑）
    private showTime?: boolean;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 需要显示消息时间的才显示，否则不需要显示
            if (this.showTime && this.message) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(ToolKits.getTimeStringAutoShort2(this.message.timestamp.getTime(), true, true));
                        Text.debugLine("entry/src/main/ets/components/chat/MsgTimeView.ets(17:7)", "entry");
                        Text.fontSize(12);
                        Text.fontColor('#979ca6');
                        Text.margin({ bottom: 13 });
                        Text.textAlign(TextAlign.Center);
                        Text.width('100%');
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
    }
    rerender() {
        this.updateDirtyElements();
    }
}
