if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Chat_Params {
    messages?: ChatMessage[];
    inputText?: string;
    isSending?: boolean;
    apiStatus?: string;
    scroller?: Scroller;
    chatService?: ChatService;
}
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import { ChatService } from "@normalized:N&&&entry/src/main/ets/service/ChatService&";
import { NormalMsgView } from "@normalized:N&&&entry/src/main/ets/components/chat/NormalMsgView&";
import { ChatInputView } from "@normalized:N&&&entry/src/main/ets/components/chat/ChatInputView&";
import { MsgTimeView } from "@normalized:N&&&entry/src/main/ets/components/chat/MsgTimeView&";
import MsgSendStatus from "@normalized:N&&&entry/src/main/ets/components/chat/MsgSendStatus&";
export class Chat extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__messages = new ObservedPropertyObjectPU([], this, "messages");
        this.__inputText = new ObservedPropertySimplePU('', this, "inputText");
        this.__isSending = new ObservedPropertySimplePU(false, this, "isSending");
        this.__apiStatus = new ObservedPropertySimplePU('', this, "apiStatus");
        this.scroller = new Scroller();
        this.chatService = ChatService.getInstance();
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
        if (params.isSending !== undefined) {
            this.isSending = params.isSending;
        }
        if (params.apiStatus !== undefined) {
            this.apiStatus = params.apiStatus;
        }
        if (params.scroller !== undefined) {
            this.scroller = params.scroller;
        }
        if (params.chatService !== undefined) {
            this.chatService = params.chatService;
        }
    }
    updateStateVars(params: Chat_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__messages.purgeDependencyOnElmtId(rmElmtId);
        this.__inputText.purgeDependencyOnElmtId(rmElmtId);
        this.__isSending.purgeDependencyOnElmtId(rmElmtId);
        this.__apiStatus.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__messages.aboutToBeDeleted();
        this.__inputText.aboutToBeDeleted();
        this.__isSending.aboutToBeDeleted();
        this.__apiStatus.aboutToBeDeleted();
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
    private __isSending: ObservedPropertySimplePU<boolean>; // 是否正在发送消息
    get isSending() {
        return this.__isSending.get();
    }
    set isSending(newValue: boolean) {
        this.__isSending.set(newValue);
    }
    private __apiStatus: ObservedPropertySimplePU<string>; // API测试状态
    get apiStatus() {
        return this.__apiStatus.get();
    }
    set apiStatus(newValue: string) {
        this.__apiStatus.set(newValue);
    }
    // 聊天列表的滚动条组件
    private scroller: Scroller;
    private chatService: ChatService;
    aboutToAppear() {
        // 初始化欢迎消息
        this.messages = [
            {
                id: 1,
                content: '你好！我是辰序助手，很高兴为你服务！😊\n\n无论你是想管理日常任务、记录收支、规划日程，还是需要一些实用建议，我都可以帮你。\n\n今天有什么我可以协助你的吗？',
                isUser: false,
                timestamp: new Date(),
                sendStatus: MsgSendStatus.success
            }
        ];
    }
    /**
     * 判断是否需要显示消息时间（仿微信逻辑：超过2分钟才显示）
     */
    shouldShowTime(currentMsg: ChatMessage, previousMsg: ChatMessage | null): boolean {
        if (!previousMsg) {
            return true; // 第一条消息显示时间
        }
        const timeDiff = currentMsg.timestamp.getTime() - previousMsg.timestamp.getTime();
        return timeDiff > 2 * 60 * 1000; // 超过2分钟
    }
    /**
     * 滚动消息列表到最底部
     */
    scrollToBottom() {
        setTimeout(() => {
            this.scroller.scrollEdge(Edge.Bottom);
        }, 100);
    }
    /**
     * 测试API连接
     */
    async testAPI(): Promise<void> {
        this.apiStatus = '测试中...';
        try {
            const testMessage = '你好';
            const response = await this.chatService.sendMessage(testMessage);
            this.apiStatus = `✅ API正常：${response.substring(0, 50)}...`;
            // 添加测试消息到聊天记录
            const testUserMsg: ChatMessage = {
                id: this.messages.length + 1,
                content: `[测试] ${testMessage}`,
                isUser: true,
                timestamp: new Date(),
                sendStatus: MsgSendStatus.success
            };
            const testAiMsg: ChatMessage = {
                id: this.messages.length + 2,
                content: `[测试回复] ${response}`,
                isUser: false,
                timestamp: new Date()
            };
            const newTestMessages: ChatMessage[] = [];
            for (let i = 0; i < this.messages.length; i++) {
                newTestMessages.push(this.messages[i]);
            }
            newTestMessages.push(testUserMsg);
            newTestMessages.push(testAiMsg);
            this.messages = newTestMessages;
            this.scrollToBottom();
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.apiStatus = `❌ API错误：${errorMessage}`;
            console.error('API测试失败:', errorMessage);
        }
    }
    /**
     * 发送消息（流式输出）
     */
    async sendMessage(): Promise<void> {
        if (!this.inputText.trim() || this.isSending) {
            return;
        }
        const currentInput = this.inputText.trim();
        // 先清空輸入框，改善用戶體驗
        this.inputText = '';
        this.isSending = true;
        // 添加用户消息
        const userMessage: ChatMessage = {
            id: this.messages.length + 1,
            content: currentInput,
            isUser: true,
            timestamp: new Date(),
            sendStatus: MsgSendStatus.sending
        };
        const newMessages1: ChatMessage[] = [];
        for (let i = 0; i < this.messages.length; i++) {
            newMessages1.push(this.messages[i]);
        }
        newMessages1.push(userMessage);
        this.messages = newMessages1;
        this.scrollToBottom();
        // 添加一个加载中的AI消息占位
        const loadingMessageId = this.messages.length + 1;
        const loadingMessage: ChatMessage = {
            id: loadingMessageId,
            content: '',
            isUser: false,
            timestamp: new Date()
        };
        const newMessages2: ChatMessage[] = [];
        for (let i = 0; i < this.messages.length; i++) {
            newMessages2.push(this.messages[i]);
        }
        newMessages2.push(loadingMessage);
        this.messages = newMessages2;
        this.scrollToBottom();
        try {
            // 使用局部变量累积内容，避免在异步回调中频繁读取状态
            let accumulatedContent: string = '';
            // 调用流式API获取AI回复
            await this.chatService.sendMessageStream(currentInput, (chunk: string) => {
                console.info('收到chunk，长度:', chunk.length, '内容预览:', chunk.substring(0, 20));
                // 累积内容
                accumulatedContent += chunk;
                console.info('累积内容总长度:', accumulatedContent.length);
                // 从当前状态中查找加载消息的索引
                const loadingIndex = this.messages.findIndex((msg: ChatMessage) => msg.id === loadingMessageId);
                if (loadingIndex < 0) {
                    console.error('未找到加载消息，loadingMessageId:', loadingMessageId);
                    return;
                }
                const currentLoadingMsg = this.messages[loadingIndex];
                // 创建新数组，替换目标消息
                const updatedMessages: ChatMessage[] = [];
                for (let i = 0; i < this.messages.length; i++) {
                    if (i === loadingIndex) {
                        // 更新加载中的消息，有内容后不再显示loading状态
                        updatedMessages.push({
                            id: currentLoadingMsg.id,
                            content: accumulatedContent,
                            isUser: currentLoadingMsg.isUser,
                            timestamp: new Date(),
                            sendStatus: MsgSendStatus.success
                        });
                    }
                    else if (this.messages[i].id === userMessage.id) {
                        // 同时更新用户消息状态为成功（如果还没有更新）
                        const originalMsg = this.messages[i];
                        updatedMessages.push({
                            id: originalMsg.id,
                            content: originalMsg.content,
                            isUser: originalMsg.isUser,
                            timestamp: originalMsg.timestamp,
                            sendStatus: MsgSendStatus.success
                        });
                    }
                    else {
                        updatedMessages.push(this.messages[i]);
                    }
                }
                // 确保状态更新触发UI刷新
                this.messages = updatedMessages;
                this.scrollToBottom();
            });
            // 流式输出完成后，确保用户消息状态为成功（双重保险）
            const finalUserMsgIndex = this.messages.findIndex((msg: ChatMessage) => msg.id === userMessage.id);
            if (finalUserMsgIndex >= 0 && this.messages[finalUserMsgIndex].sendStatus === MsgSendStatus.sending) {
                const updatedMessages: ChatMessage[] = [];
                for (let i = 0; i < this.messages.length; i++) {
                    if (i === finalUserMsgIndex) {
                        const originalMsg = this.messages[i];
                        updatedMessages.push({
                            id: originalMsg.id,
                            content: originalMsg.content,
                            isUser: originalMsg.isUser,
                            timestamp: originalMsg.timestamp,
                            sendStatus: MsgSendStatus.success
                        });
                    }
                    else {
                        updatedMessages.push(this.messages[i]);
                    }
                }
                this.messages = updatedMessages;
            }
        }
        catch (error) {
            // 错误处理
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('发送消息失败:', errorMessage);
            // 更新用户消息状态为失败
            const userMsgIndex = this.messages.findIndex((msg: ChatMessage) => msg.id === userMessage.id);
            if (userMsgIndex >= 0) {
                const updatedMessages: ChatMessage[] = [];
                for (let i = 0; i < this.messages.length; i++) {
                    if (i === userMsgIndex) {
                        // 手动复制对象并更新sendStatus
                        const originalMsg = this.messages[i];
                        updatedMessages.push({
                            id: originalMsg.id,
                            content: originalMsg.content,
                            isUser: originalMsg.isUser,
                            timestamp: originalMsg.timestamp,
                            sendStatus: MsgSendStatus.sendFailed
                        });
                    }
                    else {
                        updatedMessages.push(this.messages[i]);
                    }
                }
                this.messages = updatedMessages;
            }
            // 更新错误消息
            let friendlyErrorMessage = '抱歉，發送消息時出現錯誤';
            if (errorMessage.includes('網絡') || errorMessage.includes('network') || errorMessage.includes('timeout')) {
                friendlyErrorMessage = '網絡連接失敗，請檢查網絡設置';
            }
            else if (errorMessage.includes('API') || errorMessage.includes('MIMO')) {
                friendlyErrorMessage = 'AI服務暫時無法使用，請稍後再試';
            }
            else if (errorMessage.includes('解析') || errorMessage.includes('parse')) {
                friendlyErrorMessage = '服務響應格式錯誤，請稍後再試';
            }
            else {
                friendlyErrorMessage = `發送失敗：${errorMessage.substring(0, 100)}`;
            }
            const errorMsg: ChatMessage = {
                id: loadingMessageId,
                content: friendlyErrorMessage,
                isUser: false,
                timestamp: new Date()
            };
            const loadingIndex = this.messages.findIndex((msg: ChatMessage) => msg.id === loadingMessageId);
            if (loadingIndex >= 0) {
                const updatedMessages: ChatMessage[] = [];
                for (let i = 0; i < this.messages.length; i++) {
                    if (i === loadingIndex) {
                        updatedMessages.push(errorMsg);
                    }
                    else {
                        updatedMessages.push(this.messages[i]);
                    }
                }
                this.messages = updatedMessages;
            }
        }
        finally {
            this.isSending = false;
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Chat.ets(281:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(Constants.COLOR_BACKGROUND);
            Column.expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM]);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // API测试状态栏（开发时显示）
            if (this.apiStatus) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/Chat.ets(284:9)", "entry");
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.apiStatus);
                        Text.debugLine("entry/src/main/ets/pages/Chat.ets(285:11)", "entry");
                        Text.fontSize(12);
                        Text.fontColor(this.apiStatus.startsWith('✅') ? Constants.COLOR_SUCCESS : Constants.COLOR_DANGER);
                        Text.margin({ left: 16, right: 16, top: 8, bottom: 4 });
                    }, Text);
                    Text.pop();
                    Row.pop();
                });
            }
            // 测试按钮（开发时显示）
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 测试按钮（开发时显示）
            if (this.apiStatus) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/Chat.ets(295:9)", "entry");
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('测试API连接');
                        Button.debugLine("entry/src/main/ets/pages/Chat.ets(296:11)", "entry");
                        Button.type(ButtonType.Normal);
                        Button.fontSize(12);
                        Button.backgroundColor(Constants.COLOR_INFO);
                        Button.fontColor('#FFFFFF');
                        Button.height(32);
                        Button.margin({ left: 16, right: 16, bottom: 8 });
                        Button.enabled(!this.isSending);
                        Button.onClick(() => {
                            this.testAPI();
                        });
                    }, Button);
                    Button.pop();
                    Row.pop();
                });
            }
            // 聊天界面内容区
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 聊天界面内容区
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Chat.ets(312:7)", "entry");
            // 聊天界面内容区
            Column.layoutWeight(1);
            // 聊天界面内容区
            Column.backgroundColor(Constants.COLOR_BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            List.create({ scroller: this.scroller });
            List.debugLine("entry/src/main/ets/pages/Chat.ets(313:9)", "entry");
            List.onTouch(() => {
                // 点击列表区域时，可以收起软键盘
                // ToolKits.hideSoftInputMethod(this.getUIContext());
            });
            List.scrollBar(BarState.Off);
            List.edgeEffect(EdgeEffect.Spring);
            List.width("100%");
            List.height('100%');
            List.layoutWeight(1);
            List.listDirection(Axis.Vertical);
            List.backgroundColor(Constants.COLOR_BACKGROUND);
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
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
                        ListItem.margin({ top: index === 0 ? 15 : 0, bottom: 15 });
                        ListItem.debugLine("entry/src/main/ets/pages/Chat.ets(315:13)", "entry");
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Column.create();
                            Column.debugLine("entry/src/main/ets/pages/Chat.ets(316:15)", "entry");
                        }, Column);
                        {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                if (isInitialRender) {
                                    let componentCall = new 
                                    // 显示消息时间
                                    MsgTimeView(this, {
                                        message: message,
                                        showTime: this.shouldShowTime(message, index > 0 ? this.messages[index - 1] : null)
                                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Chat.ets", line: 318, col: 17 });
                                    ViewPU.create(componentCall);
                                    let paramsLambda = () => {
                                        return {
                                            message: message,
                                            showTime: this.shouldShowTime(message, index > 0 ? this.messages[index - 1] : null)
                                        };
                                    };
                                    componentCall.paramsGenerator_ = paramsLambda;
                                }
                                else {
                                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                                }
                            }, { name: "MsgTimeView" });
                        }
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            If.create();
                            // 显示消息内容
                            if (!message.content || message.content.trim() === '') {
                                this.ifElseBranchUpdateFunction(0, () => {
                                    // 加载中的消息
                                    this.buildLoadingMessage.bind(this)();
                                });
                            }
                            else {
                                this.ifElseBranchUpdateFunction(1, () => {
                                    {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            if (isInitialRender) {
                                                let componentCall = new NormalMsgView(this, {
                                                    message: message,
                                                    sendStatus: message.sendStatus ?? MsgSendStatus.success
                                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Chat.ets", line: 328, col: 19 });
                                                ViewPU.create(componentCall);
                                                let paramsLambda = () => {
                                                    return {
                                                        message: message,
                                                        sendStatus: message.sendStatus ?? MsgSendStatus.success
                                                    };
                                                };
                                                componentCall.paramsGenerator_ = paramsLambda;
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                                            }
                                        }, { name: "NormalMsgView" });
                                    }
                                });
                            }
                        }, If);
                        If.pop();
                        Column.pop();
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(itemCreation2, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(elmtId, this.messages, forEachItemGenFunction, (message: ChatMessage) => `${message.id}-${message.content.length}-${message.timestamp.getTime()}`, true, false);
        }, ForEach);
        ForEach.pop();
        List.pop();
        // 聊天界面内容区
        Column.pop();
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 底部消息输入区
                    ChatInputView(this, {
                        isSending: this.isSending,
                        onSendClick: (message: string) => {
                            this.inputText = message;
                            this.sendMessage();
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Chat.ets", line: 354, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            isSending: this.isSending,
                            onSendClick: (message: string) => {
                                this.inputText = message;
                                this.sendMessage();
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        isSending: this.isSending
                    });
                }
            }, { name: "ChatInputView" });
        }
        Column.pop();
    }
    buildLoadingMessage(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Chat.ets(370:5)", "entry");
            Row.width('100%');
            Row.alignItems(VerticalAlign.Top);
            Row.justifyContent(FlexAlign.Start);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // AI头像
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Chat.ets(372:7)", "entry");
            // AI头像
            Column.width(40);
            // AI头像
            Column.height(40);
            // AI头像
            Column.borderRadius(20);
            // AI头像
            Column.backgroundColor(Constants.COLOR_PRIMARY_LIGHT);
            // AI头像
            Column.justifyContent(FlexAlign.Center);
            // AI头像
            Column.margin({ left: 12, right: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('助');
            Text.debugLine("entry/src/main/ets/pages/Chat.ets(373:9)", "entry");
            Text.fontSize(16);
            Text.fontColor(Color.White);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        // AI头像
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 加载动画 - 简单的三个点
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Chat.ets(386:7)", "entry");
            // 加载动画 - 简单的三个点
            Row.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            // 加载动画 - 简单的三个点
            Row.borderRadius(12);
            // 加载动画 - 简单的三个点
            Row.border({ width: 1, color: Constants.COLOR_BORDER });
            // 加载动画 - 简单的三个点
            Row.padding({ left: 14, right: 14, top: 12, bottom: 12 });
            // 加载动画 - 简单的三个点
            Row.constraintSize({ maxWidth: '70%' });
            // 加载动画 - 简单的三个点
            Row.margin({ right: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('●');
            Text.debugLine("entry/src/main/ets/pages/Chat.ets(387:9)", "entry");
            Text.fontSize(8);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.margin({ right: 3 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('●');
            Text.debugLine("entry/src/main/ets/pages/Chat.ets(391:9)", "entry");
            Text.fontSize(8);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.margin({ right: 3 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('●');
            Text.debugLine("entry/src/main/ets/pages/Chat.ets(395:9)", "entry");
            Text.fontSize(8);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        // 加载动画 - 简单的三个点
        Row.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
/**
 * 聊天消息接口
 */
export interface ChatMessage {
    id: number;
    content: string;
    isUser: boolean;
    timestamp: Date;
    sendStatus?: number; // 发送状态（0:发送中, 1:成功, 2:失败）
}
