import ToolKits from '../../utils/ToolKits';
import { ChatMessage } from '../../pages/Chat';

/**
 * 聊天消息时间显示组件
 * 参考harmonychat-main项目的设计
 */
@Component
export struct MsgTimeView {
  message?: ChatMessage;
  // 是否需要显示时间（超过2分钟才显示，仿微信逻辑）
  showTime?: boolean = false;

  build() {
    // 需要显示消息时间的才显示，否则不需要显示
    if (this.showTime && this.message) {
      Text(ToolKits.getTimeStringAutoShort2(this.message.timestamp.getTime(), true, true))
        .fontSize(12)
        .fontColor('#979ca6')
        .margin({ bottom: 13 })
        .textAlign(TextAlign.Center)
        .width('100%')
    }
  }
}

