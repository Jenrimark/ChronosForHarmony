import { Constants } from '../common/Constants';

/**
 * 对话页面
 */
@Component
export struct Chat {
  @State messages: ChatMessage[] = [];
  @State inputText: string = '';

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
    } else if (lowerInput.includes('记账') || lowerInput.includes('账单')) {
      return '记账功能可以帮助你记录收入和支出，支持AI智能识别分类。';
    } else if (lowerInput.includes('帮助') || lowerInput.includes('help')) {
      return '我可以帮助你了解辰序应用的功能。你可以问我关于任务管理、记账、统计等问题。';
    } else {
      return '我理解你的问题。如果你需要帮助，可以问我关于任务管理、记账等功能的问题。';
    }
  }

  build() {
    Column() {
      // 消息列表
      List() {
        ForEach(this.messages, (message: ChatMessage) => {
          ListItem() {
            this.buildMessageItem(message)
          }
        }, (message: ChatMessage) => message.id.toString())
      }
      .layoutWeight(1)
      .width('100%')
      .padding({ left: 16, right: 16, top: 16 })

      // 输入区域
      Row() {
        TextInput({ placeholder: '输入消息...', text: this.inputText })
          .layoutWeight(1)
          .height(40)
          .onChange((value: string) => {
            this.inputText = value;
          })
          .onSubmit(() => {
            this.sendMessage();
          })

        Button('发送')
          .type(ButtonType.Normal)
          .height(40)
          .backgroundColor(Constants.COLOR_PRIMARY)
          .fontColor('#FFFFFF')
          .margin({ left: 8 })
          .onClick(() => {
            this.sendMessage();
          })
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 8, bottom: 16 })
      .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Constants.COLOR_BACKGROUND)
  }

  @Builder
  buildMessageItem(message: ChatMessage) {
    Row() {
      if (message.isUser) {
        Blank()
        this.buildUserMessage(message.content)
      } else {
        this.buildAIMessage(message.content)
        Blank()
      }
    }
    .width('100%')
    .margin({ bottom: 12 })
  }

  @Builder
  buildUserMessage(content: string) {
    Column() {
      Text(content)
        .fontSize(14)
        .fontColor('#FFFFFF')
        .padding({ left: 12, right: 12, top: 8, bottom: 8 })
    }
    .backgroundColor(Constants.COLOR_PRIMARY)
    .borderRadius(12)
    .constraintSize({ maxWidth: '70%' })
    .alignItems(HorizontalAlign.Start)
  }

  @Builder
  buildAIMessage(content: string) {
    Column() {
      Text(content)
        .fontSize(14)
        .fontColor(Constants.COLOR_TEXT_PRIMARY)
        .padding({ left: 12, right: 12, top: 8, bottom: 8 })
    }
    .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
    .borderRadius(12)
    .border({ width: 1, color: Constants.COLOR_BORDER })
    .constraintSize({ maxWidth: '70%' })
    .alignItems(HorizontalAlign.Start)
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

