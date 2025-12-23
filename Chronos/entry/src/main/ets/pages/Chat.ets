import { Constants } from '../common/Constants';
import { ChatService } from '../service/ChatService';
import { NormalMsgView } from '../components/chat/NormalMsgView';
import { ChatInputView } from '../components/chat/ChatInputView';
import { MsgTimeView } from '../components/chat/MsgTimeView';
import MsgSendStatus from '../components/chat/MsgSendStatus';

/**
 * 对话页面
 * 参考harmonychat-main项目的设计，使用改进的UI组件
 */
@Component
export struct Chat {
  @State messages: ChatMessage[] = [];
  @State inputText: string = '';
  @State isSending: boolean = false; // 是否正在发送消息
  @State apiStatus: string = ''; // API测试状态

  // 聊天列表的滚动条组件
  private scroller: Scroller = new Scroller();

  private chatService: ChatService = ChatService.getInstance();

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
    } catch (error) {
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
      await this.chatService.sendMessageStream(
        currentInput,
        (chunk: string) => {
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
            } else if (this.messages[i].id === userMessage.id) {
              // 同时更新用户消息状态为成功（如果还没有更新）
              const originalMsg = this.messages[i];
              updatedMessages.push({
                id: originalMsg.id,
                content: originalMsg.content,
                isUser: originalMsg.isUser,
                timestamp: originalMsg.timestamp,
                sendStatus: MsgSendStatus.success
              });
            } else {
              updatedMessages.push(this.messages[i]);
            }
          }

          // 确保状态更新触发UI刷新
          this.messages = updatedMessages;
          this.scrollToBottom();
        }
      );

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
          } else {
            updatedMessages.push(this.messages[i]);
          }
        }
        this.messages = updatedMessages;
      }
    } catch (error) {
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
          } else {
            updatedMessages.push(this.messages[i]);
          }
        }
        this.messages = updatedMessages;
      }

      // 更新错误消息
      let friendlyErrorMessage = '抱歉，發送消息時出現錯誤';
      if (errorMessage.includes('網絡') || errorMessage.includes('network') || errorMessage.includes('timeout')) {
        friendlyErrorMessage = '網絡連接失敗，請檢查網絡設置';
      } else if (errorMessage.includes('API') || errorMessage.includes('MIMO')) {
        friendlyErrorMessage = 'AI服務暫時無法使用，請稍後再試';
      } else if (errorMessage.includes('解析') || errorMessage.includes('parse')) {
        friendlyErrorMessage = '服務響應格式錯誤，請稍後再試';
      } else {
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
          } else {
            updatedMessages.push(this.messages[i]);
          }
        }
        this.messages = updatedMessages;
      }
    } finally {
      this.isSending = false;
    }
  }

  build() {
    Column() {
      // API测试状态栏（开发时显示）
      if (this.apiStatus) {
        Row() {
          Text(this.apiStatus)
            .fontSize(12)
            .fontColor(this.apiStatus.startsWith('✅') ? Constants.COLOR_SUCCESS : Constants.COLOR_DANGER)
            .margin({ left: 16, right: 16, top: 8, bottom: 4 })
        }
        .width('100%')
      }

      // 测试按钮（开发时显示）
      if (this.apiStatus) {
        Row() {
          Button('测试API连接')
            .type(ButtonType.Normal)
            .fontSize(12)
            .backgroundColor(Constants.COLOR_INFO)
            .fontColor('#FFFFFF')
            .height(32)
            .margin({ left: 16, right: 16, bottom: 8 })
            .enabled(!this.isSending)
            .onClick(() => {
              this.testAPI();
            })
        }
        .width('100%')
      }

      // 聊天界面内容区
      Column() {
        List({ scroller: this.scroller }) {
          ForEach(this.messages, (message: ChatMessage, index: number) => {
            ListItem() {
              Column() {
                // 显示消息时间
                MsgTimeView({
                  message: message,
                  showTime: this.shouldShowTime(message, index > 0 ? this.messages[index - 1] : null)
                })

                // 显示消息内容
                if (!message.content || message.content.trim() === '') {
                  // 加载中的消息
                  this.buildLoadingMessage()
                } else {
                  NormalMsgView({
                    message: message,
                    sendStatus: message.sendStatus ?? MsgSendStatus.success
                  })
                }
              }
            }
            .margin({ top: index === 0 ? 15 : 0, bottom: 15 })
          }, (message: ChatMessage) => `${message.id}-${message.content.length}-${message.timestamp.getTime()}`)
        }
        .onTouch(() => {
          // 点击列表区域时，可以收起软键盘
          // ToolKits.hideSoftInputMethod(this.getUIContext());
        })
        .scrollBar(BarState.Off)
        .edgeEffect(EdgeEffect.Spring)
        .width("100%")
        .height('100%')
        .layoutWeight(1)
        .listDirection(Axis.Vertical)
        .backgroundColor(Constants.COLOR_BACKGROUND)
      }
      .layoutWeight(1)
      .backgroundColor(Constants.COLOR_BACKGROUND)

      // 底部消息输入区
      ChatInputView({
        isSending: this.isSending,
        onSendClick: (message: string) => {
          this.inputText = message;
          this.sendMessage();
        }
      })
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Constants.COLOR_BACKGROUND)
    .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
  }

  @Builder
  buildLoadingMessage() {
    Row() {
      // AI头像
      Column() {
        Text('助')
          .fontSize(16)
          .fontColor(Color.White)
          .fontWeight(FontWeight.Medium)
      }
      .width(40)
      .height(40)
      .borderRadius(20)
      .backgroundColor(Constants.COLOR_PRIMARY_LIGHT)
      .justifyContent(FlexAlign.Center)
      .margin({ left: 12, right: 8 })

      // 加载动画 - 简单的三个点
      Row() {
        Text('●')
          .fontSize(8)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .margin({ right: 3 })
        Text('●')
          .fontSize(8)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .margin({ right: 3 })
        Text('●')
          .fontSize(8)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
      }
      .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
      .borderRadius(12)
      .border({ width: 1, color: Constants.COLOR_BORDER })
      .padding({ left: 14, right: 14, top: 12, bottom: 12 })
      .constraintSize({ maxWidth: '70%' })
      .margin({ right: 8 })
    }
    .width('100%')
    .alignItems(VerticalAlign.Top)
    .justifyContent(FlexAlign.Start)
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
