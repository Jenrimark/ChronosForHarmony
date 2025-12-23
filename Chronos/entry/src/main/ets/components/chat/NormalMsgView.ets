import { Constants } from '../../common/Constants';
import { ChatMessage } from '../../pages/Chat';
import MsgSendStatus from './MsgSendStatus';
import ToolKits from '../../utils/ToolKits';

/**
 * 行项接口（用于格式化内容）
 */
interface LineItem {
  text: string;
  isEmpty: boolean;
  isUnorderedList: boolean;
  isOrderedList: boolean;
  number: string;
  isLast: boolean;
}

/**
 * 文本Span接口（用于Markdown格式化）
 */
interface TextSpan {
  text: string;
  bold: boolean;
  italic: boolean;
}

/**
 * 匹配结果接口
 */
interface MatchResult {
  start: number;
  end: number;
  text: string;
  bold: boolean;
}

/**
 * 普通聊天消息UI组件
 * 参考harmonychat-main项目的设计，但使用当前项目的主题色
 */
@Component
export struct NormalMsgView {
  message?: ChatMessage;
  // 发送状态（0:发送中, 1:成功, 2:失败）
  sendStatus?: number = MsgSendStatus.success;

  build() {
    Row() {
      if (this.message) {
        if (this.message.isUser) {
          // 用户消息：先放空白填充，然后气泡，最后头像
          Blank()
          this.MessageBubbleColumn()
          this.AvatarImage(true)
        } else {
          // AI消息：先头像，然后气泡
          this.AvatarImage(false)
          this.MessageBubbleColumn()
        }
      }
    }
    .width("100%")
    .alignItems(VerticalAlign.Top)
    .justifyContent(FlexAlign.Start)
  }

  @Builder
  MessageBubbleColumn() {
    if (this.message) {
      Column() {
        // 昵称显示（仅对收到的消息显示）
        if (!this.message.isUser) {
          this.NicknameText('辰序助手')
        }

        // 使用Flex布局解决文本超长时尾部挤出屏幕的问题
        Flex({ direction: FlexDirection.Row, wrap: FlexWrap.NoWrap, justifyContent: (this.message.isUser ? FlexAlign.End : FlexAlign.Start) }) {
          // 消息状态图标的显示：只有"发出"的消息需要显示
          if (this.message.isUser) {
            this.SendStatusIcon()
          }

          // 消息内容
          this.MessageContent()
        }
      }
      .alignItems(this.message.isUser ? HorizontalAlign.End : HorizontalAlign.Start)
      .constraintSize({ maxWidth: '70%' })
      .margin(this.message.isUser ? { right: 8 } : { left: 8 })
    }
  }

  @Builder
  NicknameText(nickname: string) {
    Text(nickname)
      .fontColor(Constants.COLOR_TEXT_SECONDARY)
      .fontSize(11)
      .margin({ bottom: 4, left: 12 })
  }

  @Builder
  AvatarImage(isUser: boolean) {
    // 使用简单的圆形背景作为头像，实际项目中可以使用图片资源
    Column() {
      Text(isUser ? '我' : '助')
        .fontSize(16)
        .fontColor(Color.White)
        .fontWeight(FontWeight.Medium)
    }
    .width(40)
    .height(40)
    .borderRadius(20)
    .backgroundColor(isUser ? Constants.COLOR_PRIMARY : Constants.COLOR_PRIMARY_LIGHT)
    .justifyContent(FlexAlign.Center)
    .margin(isUser ? { left: 8, right: 12 } : { left: 12, right: 8 })
  }

  @Builder
  SendStatusIcon() {
    // 只有"发出"的消息有消息状态ui的显示
    // 发送失败
    if (this.sendStatus === MsgSendStatus.sendFailed) {
      Text('⚠')
        .fontSize(16)
        .fontColor(Constants.COLOR_DANGER)
        .margin({ top: 3, right: 7 })
        .onClick(() => {
          ToolKits.showToast('本条消息发送失败！')
        })
    }
    // 发送中和发送成功都不显示任何图标（删除转圈圈提示）
  }

  @Builder
  MessageContent() {
    if (this.message) {
      if (this.message.isUser) {
        // 用户消息：简单文本显示
        Text(this.message.content)
          .fontSize(14)
          .fontColor(Constants.COLOR_TEXT_ON_PRIMARY)
          .lineHeight(20)
          .padding({
            top: 12,
            bottom: 12,
            left: 14,
            right: 16
          })
          .backgroundColor(Constants.COLOR_PRIMARY)
          .borderRadius(12)
      } else {
        // AI消息：支持Markdown格式化显示
        Column() {
          this.buildFormattedContent(this.message.content)
        }
        .width('100%')
        .alignItems(HorizontalAlign.Start)
        .padding({
          top: 12,
          bottom: 12,
          left: 14,
          right: 14
        })
        .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
        .borderRadius(12)
        .border({
          width: 1,
          color: Constants.COLOR_BORDER
        })
      }
    }
  }

  /**
   * 构建格式化的内容（支持Markdown）
   */
  @Builder
  buildFormattedContent(content: string) {
    this.buildFormattedLines(content)
  }

  /**
   * 构建格式化的行
   */
  @Builder
  buildFormattedLines(content: string) {
    Column() {
      ForEach(this.splitContentToLines(content), (line: LineItem, index: number) => {
        if (line.isEmpty) {
          // 空行
          Blank()
            .height(4)
        } else if (line.isUnorderedList) {
          // 无序列表项
          Row() {
            Text(' ')
              .fontSize(16)
              .fontColor(Constants.COLOR_PRIMARY)
              .margin({ right: 8 })
            this.buildFormattedText(line.text)
          }
          .width('100%')
          .margin({ bottom: 6 })
          .margin({ right: 8 })
          .alignItems(VerticalAlign.Top)
         } else if (line.isOrderedList) {
           // 有序列表 - 固定序号宽度，确保文字对齐
           Row() {
             // 显示列表序号（如：1. 2. 3.）
             Text(line.number)
               .fontSize(14)  // 设置序号字体大小为14
               .fontColor(Constants.COLOR_PRIMARY)  // 使用主题色作为序号颜色
               .fontWeight(FontWeight.Medium)  // 设置序号字体为中等粗细
               .width(24)  // 固定序号宽度为24，确保对齐
               .textAlign(TextAlign.Start)  // 序号左对齐
             // 包裹文字内容的列容器
             Column() {
               // 构建格式化的文本内容（支持加粗等Markdown格式）
               this.buildFormattedText(line.text)
             }
             .layoutWeight(1)  // 文字部分占据剩余的所有空间
             .alignItems(HorizontalAlign.Start)  // 文字内容左对齐
           }
           .width('100%')  // 整个Row占满父容器宽度
           .margin({ bottom: 6 })  // 列表项底部留6像素间距
           .alignItems(VerticalAlign.Top)  // Row内容顶部对齐（序号和文字都从顶部开始）
         } else {
          // 普通文本
          Column() {
            this.buildFormattedText(line.text)
          }
          .width('100%')
          .margin({ bottom: line.isLast ? 0 : 6 })
        }
      }, (line: LineItem, index: number) => `${index}-${(line.text ?? '').substring(0, 10)}`)
    }
    .width('100%')
    .alignItems(HorizontalAlign.Start)
  }

  /**
   * 将内容分割为行
   */
  splitContentToLines(content: string): LineItem[] {
    const safeContent: string = content ?? '';
    const lines: string[] = safeContent.split('\n');
    const totalLines: number = lines.length;
    const result: LineItem[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed === '') {
        result.push({
          text: '',
          isEmpty: true,
          isUnorderedList: false,
          isOrderedList: false,
          number: '',
          isLast: i === totalLines - 1
        });
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        // 无序列表：移除开头的 "- " 或 "* "
        const textAfterBullet = trimmed.substring(2).trim();
        result.push({
          text: textAfterBullet,
          isEmpty: false,
          isUnorderedList: true,
          isOrderedList: false,
          number: '',
          isLast: i === totalLines - 1
        });
      } else {
        const orderedMatch = trimmed.match(/^(\d+\.)\s+(.*)/);
        if (orderedMatch) {
          // 有序列表：提取序号和文本
          result.push({
            text: orderedMatch[2] || '',
            isEmpty: false,
            isUnorderedList: false,
            isOrderedList: true,
            number: orderedMatch[1],
            isLast: i === totalLines - 1
          });
        } else {
          // 普通文本：直接使用原文本
          result.push({
            text: line,
            isEmpty: false,
            isUnorderedList: false,
            isOrderedList: false,
            number: '',
            isLast: i === totalLines - 1
          });
        }
      }
    }

    return result;
  }

  /**
   * 构建格式化的文本（支持加粗、斜体等）
   */
  /**
   * 检查文本是否需要直接显示（无Markdown格式）
   */
  shouldShowPlainText(text: string): boolean {
    const spans = this.parseMarkdownSpans(text);
    return spans.length === 0 || (spans.length === 1 && !spans[0].text);
  }

  @Builder
  buildFormattedText(text: string) {
    if (text && text.trim()) {
      if (this.shouldShowPlainText(text)) {
        // 如果没有spans或spans为空，直接显示原文本
        Text(text)
          .fontSize(14)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
          .lineHeight(22)
      } else {
        Text() {
          ForEach(this.parseMarkdownSpans(text), (span: TextSpan, index: number) => {
            if (span.text) {
              Span(span.text)
                .fontSize(14)
                .fontColor(Constants.COLOR_TEXT_PRIMARY)
                .fontWeight(span.bold ? FontWeight.Bold : FontWeight.Normal)
                .fontStyle(span.italic ? FontStyle.Italic : FontStyle.Normal)
            }
          }, (span: TextSpan, index: number) => `${index}-${(span.text ?? '').substring(0, 5)}`)
        }
        .fontSize(14)
        .fontColor(Constants.COLOR_TEXT_PRIMARY)
        .lineHeight(22)
      }
    }
  }

  /**
   * 解析Markdown文本为Span数组
   */
  parseMarkdownSpans(text: string): TextSpan[] {
    const spans: TextSpan[] = [];

    // 匹配加粗 **text** 或 __text__
    const boldRegex = /\*\*(.*?)\*\*|__(.*?)__/g;
    let match: RegExpExecArray | null = null;
    const matches: MatchResult[] = [];

    while ((match = boldRegex.exec(text)) !== null) {
      const matchResult: MatchResult = {
        start: match.index,
        end: match.index + match[0].length,
        text: match[1] || match[2] || '',
        bold: true
      };
      matches.push(matchResult);
    }

    // 如果没有匹配，返回普通文本
    if (matches.length === 0) {
      spans.push({ text: text, bold: false, italic: false });
      return spans;
    }

    // 按位置排序
    matches.sort((a, b) => a.start - b.start);

    // 构建Span数组
    let lastIndex = 0;
    for (const m of matches) {
      // 添加加粗前的普通文本
      if (m.start > lastIndex) {
        const normalText = text.substring(lastIndex, m.start);
        if (normalText) {
          spans.push({ text: normalText, bold: false, italic: false });
        }
      }

      // 添加加粗文本
      spans.push({ text: m.text, bold: true, italic: false });
      lastIndex = m.end;
    }

    // 添加剩余文本
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      if (remainingText) {
        spans.push({ text: remainingText, bold: false, italic: false });
      }
    }

    return spans.length > 0 ? spans : [{ text: text, bold: false, italic: false }];
  }
}


