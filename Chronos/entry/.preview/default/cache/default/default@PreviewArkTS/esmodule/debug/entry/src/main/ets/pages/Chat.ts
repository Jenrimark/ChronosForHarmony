if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Chat_Params {
    messages?: ChatMessage[];
    inputText?: string;
}
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
export class Chat extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__messages = new ObservedPropertyObjectPU([], this, "messages");
        this.__inputText = new ObservedPropertySimplePU('', this, "inputText");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Chat_Params) {
        if (params.messages !== undefined) {
            this.messages = params.messages;
        }
        if (params.inputText !== undefined) {
            this.inputText = params.inputText;
        }
    }
    updateStateVars(params: Chat_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__messages.purgeDependencyOnElmtId(rmElmtId);
        this.__inputText.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__messages.aboutToBeDeleted();
        this.__inputText.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __messages: ObservedPropertyObjectPU<ChatMessage[]>;
    get messages() {
        return this.__messages.get();
    }
    set messages(newValue: ChatMessage[]) {
        this.__messages.set(newValue);
    }
    private __inputText: ObservedPropertySimplePU<string>;
    get inputText() {
        return this.__inputText.get();
    }
    set inputText(newValue: string) {
        this.__inputText.set(newValue);
    }
    aboutToAppear() {
        // 初始化欢迎消息
        this.messages = [
            {
                id: 1,
                content: '你好！我是辰序助手，有什么可以帮助你的吗？',
                isUser: false,
                timestamp: new Date()
            }
        ];
    }
    /**
     * 发送消息
     */
    sendMessage(): void {
        if (!this.inputText.trim()) {
            return;
        }
        // 添加用户消息
        const userMessage: ChatMessage = {
            id: this.messages.length + 1,
            content: this.inputText,
            isUser: true,
            timestamp: new Date()
        };
        this.messages.push(userMessage);
        const currentInput = this.inputText;
        this.inputText = '';
        // 模拟AI回复（可以后续接入真实的AI服务）
        setTimeout(() => {
            const aiMessage: ChatMessage = {
                id: this.messages.length + 1,
                content: this.getAIResponse(currentInput),
                isUser: false,
                timestamp: new Date()
            };
            this.messages.push(aiMessage);
        }, 500);
    }
    /**
     * 获取AI回复（简单模拟，后续可以接入真实AI）
     */
    getAIResponse(input: string): string {
        const lowerInput = input.toLowerCase();
        if (lowerInput.includes('任务') || lowerInput.includes('todo')) {
            return '你可以通过任务页面管理你的任务。创建任务后，点击左侧的圆圈可以标记为完成。';
        }
        else if (lowerInput.includes('记账') || lowerInput.includes('账单')) {
            return '记账功能可以帮助你记录收入和支出，支持AI智能识别分类。';
        }
        else if (lowerInput.includes('帮助') || lowerInput.includes('help')) {
            return '我可以帮助你了解辰序应用的功能。你可以问我关于任务管理、记账、统计等问题。';
        }
        else {
            return '我理解你的问题。如果你需要帮助，可以问我关于任务管理、记账等功能的问题。';
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Chat.ets(71:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(Constants.COLOR_BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 消息列表
            List.create();
            List.debugLine("entry/src/main/ets/pages/Chat.ets(73:7)", "entry");
            // 消息列表
            List.layoutWeight(1);
            // 消息列表
            List.width('100%');
            // 消息列表
            List.padding({ left: 16, right: 16, top: 16 });
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const message = _item;
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
                        ListItem.debugLine("entry/src/main/ets/pages/Chat.ets(75:11)", "entry");
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.buildMessageItem.bind(this)(message);
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(itemCreation2, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(elmtId, this.messages, forEachItemGenFunction, (message: ChatMessage) => message.id.toString(), false, false);
        }, ForEach);
        ForEach.pop();
        // 消息列表
        List.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 输入区域
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Chat.ets(85:7)", "entry");
            // 输入区域
            Row.width('100%');
            // 输入区域
            Row.padding({ left: 16, right: 16, top: 8, bottom: 16 });
            // 输入区域
            Row.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '输入消息...', text: this.inputText });
            TextInput.debugLine("entry/src/main/ets/pages/Chat.ets(86:9)", "entry");
            TextInput.layoutWeight(1);
            TextInput.height(40);
            TextInput.onChange((value: string) => {
                this.inputText = value;
            });
            TextInput.onSubmit(() => {
                this.sendMessage();
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('发送');
            Button.debugLine("entry/src/main/ets/pages/Chat.ets(96:9)", "entry");
            Button.type(ButtonType.Normal);
            Button.height(40);
            Button.backgroundColor(Constants.COLOR_PRIMARY);
            Button.fontColor('#FFFFFF');
            Button.margin({ left: 8 });
            Button.onClick(() => {
                this.sendMessage();
            });
        }, Button);
        Button.pop();
        // 输入区域
        Row.pop();
        Column.pop();
    }
    buildMessageItem(message: ChatMessage, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Chat.ets(117:5)", "entry");
            Row.width('100%');
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (message.isUser) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/Chat.ets(119:9)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.buildUserMessage.bind(this)(message.content);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.buildAIMessage.bind(this)(message.content);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/Chat.ets(123:9)", "entry");
                    }, Blank);
                    Blank.pop();
                });
            }
        }, If);
        If.pop();
        Row.pop();
    }
    buildUserMessage(content: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Chat.ets(132:5)", "entry");
            Column.backgroundColor(Constants.COLOR_PRIMARY);
            Column.borderRadius(12);
            Column.constraintSize({ maxWidth: '70%' });
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(content);
            Text.debugLine("entry/src/main/ets/pages/Chat.ets(133:7)", "entry");
            Text.fontSize(14);
            Text.fontColor('#FFFFFF');
            Text.padding({ left: 12, right: 12, top: 8, bottom: 8 });
        }, Text);
        Text.pop();
        Column.pop();
    }
    buildAIMessage(content: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Chat.ets(146:5)", "entry");
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Column.borderRadius(12);
            Column.border({ width: 1, color: Constants.COLOR_BORDER });
            Column.constraintSize({ maxWidth: '70%' });
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(content);
            Text.debugLine("entry/src/main/ets/pages/Chat.ets(147:7)", "entry");
            Text.fontSize(14);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            Text.padding({ left: 12, right: 12, top: 8, bottom: 8 });
        }, Text);
        Text.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
/**
 * 聊天消息接口
 */
interface ChatMessage {
    id: number;
    content: string;
    isUser: boolean;
    timestamp: Date;
}
