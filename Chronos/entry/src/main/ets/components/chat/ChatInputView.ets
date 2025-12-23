import { Constants } from '../../common/Constants';

/**
 * 聊天界面输入区组件
 * 参考harmonychat-main项目的设计，但使用当前项目的主题色
 */
@Component
export struct ChatInputView {
  @State messageInput: string = '';
  @Prop isSending: boolean = false;

  onSendClick?: (message: string) => void;

  build() {
    Row() {
      TextInput({
        placeholder: "请输入聊天内容，按发送键提交",
        text: $$this.messageInput
      })
        .backgroundColor('#f5f7fa')
        .layoutWeight(1)
        .height(40)
        .maxLength(1000)
        .fontSize(14)
        .borderRadius(8)
        .padding({ left: 12, right: 12 })
        .placeholderFont({ size: 14 })
        .placeholderColor('#a1a7af')
        .onSubmit(() => {
          if (this.messageInput.trim() && !this.isSending && this.onSendClick) {
            const message = this.messageInput.trim();
            this.messageInput = '';
            this.onSendClick(message);
          }
        })

      Button("发送", { type: ButtonType.Normal, stateEffect: true })
        .width(60)
        .height(40)
        .borderRadius(8)
        .padding(0)
        .fontSize(14)
        .backgroundColor(Constants.COLOR_PRIMARY)
        .fontColor(Constants.COLOR_TEXT_ON_PRIMARY)
        .fontWeight(500)
        .enabled(!this.isSending && this.messageInput.trim().length > 0)
        .onClick(() => {
          if (this.messageInput.trim() && this.onSendClick) {
            const message = this.messageInput.trim();
            this.messageInput = '';
            this.onSendClick(message);
          }
        })
    }
    .height(60)
    .width('100%')
    .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
    .padding({ left: 12, right: 12, top: 10, bottom: 10 })
    .alignItems(VerticalAlign.Center)
    .shadow({
      radius: 10,
      color: "#10000000",
      offsetX: 0,
      offsetY: -2
    })
  }
}

