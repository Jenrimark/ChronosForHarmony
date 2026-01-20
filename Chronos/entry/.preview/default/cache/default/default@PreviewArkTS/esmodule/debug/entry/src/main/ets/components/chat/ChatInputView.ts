if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ChatInputView_Params {
    messageInput?: string;
    isSending?: boolean;
    onSendClick?: (message: string) => void;
}
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
export class ChatInputView extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__messageInput = new ObservedPropertySimplePU('', this, "messageInput");
        this.__isSending = new SynchedPropertySimpleOneWayPU(params.isSending, this, "isSending");
        this.onSendClick = undefined;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ChatInputView_Params) {
        if (params.messageInput !== undefined) {
            this.messageInput = params.messageInput;
        }
        if (params.isSending === undefined) {
            this.__isSending.set(false);
        }
        if (params.onSendClick !== undefined) {
            this.onSendClick = params.onSendClick;
        }
    }
    updateStateVars(params: ChatInputView_Params) {
        this.__isSending.reset(params.isSending);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__messageInput.purgeDependencyOnElmtId(rmElmtId);
        this.__isSending.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__messageInput.aboutToBeDeleted();
        this.__isSending.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __messageInput: ObservedPropertySimplePU<string>;
    get messageInput() {
        return this.__messageInput.get();
    }
    set messageInput(newValue: string) {
        this.__messageInput.set(newValue);
    }
    private __isSending: SynchedPropertySimpleOneWayPU<boolean>;
    get isSending() {
        return this.__isSending.get();
    }
    set isSending(newValue: boolean) {
        this.__isSending.set(newValue);
    }
    private onSendClick?: (message: string) => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/chat/ChatInputView.ets(15:5)", "entry");
            Row.height(60);
            Row.width('100%');
            Row.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Row.padding({ left: 12, right: 12, top: 10, bottom: 10 });
            Row.alignItems(VerticalAlign.Center);
            Row.shadow({
                radius: 10,
                color: "#10000000",
                offsetX: 0,
                offsetY: -2
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({
                placeholder: "请输入聊天内容，按发送键提交",
                text: { value: this.messageInput, changeEvent: newValue => { this.messageInput = newValue; } }
            });
            TextInput.debugLine("entry/src/main/ets/components/chat/ChatInputView.ets(16:7)", "entry");
            TextInput.backgroundColor('#f5f7fa');
            TextInput.layoutWeight(1);
            TextInput.height(40);
            TextInput.maxLength(1000);
            TextInput.fontSize(14);
            TextInput.borderRadius(8);
            TextInput.padding({ left: 12, right: 12 });
            TextInput.placeholderFont({ size: 14 });
            TextInput.placeholderColor('#a1a7af');
            TextInput.onSubmit(() => {
                if (this.messageInput.trim() && !this.isSending && this.onSendClick) {
                    const message = this.messageInput.trim();
                    this.messageInput = '';
                    this.onSendClick(message);
                }
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel("发送", { type: ButtonType.Normal, stateEffect: true });
            Button.debugLine("entry/src/main/ets/components/chat/ChatInputView.ets(37:7)", "entry");
            Button.width(60);
            Button.height(40);
            Button.borderRadius(8);
            Button.padding(0);
            Button.fontSize(14);
            Button.backgroundColor(Constants.COLOR_PRIMARY);
            Button.fontColor(Constants.COLOR_TEXT_ON_PRIMARY);
            Button.fontWeight(500);
            Button.enabled(!this.isSending && this.messageInput.trim().length > 0);
            Button.onClick(() => {
                if (this.messageInput.trim() && this.onSendClick) {
                    const message = this.messageInput.trim();
                    this.messageInput = '';
                    this.onSendClick(message);
                }
            });
        }, Button);
        Button.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
