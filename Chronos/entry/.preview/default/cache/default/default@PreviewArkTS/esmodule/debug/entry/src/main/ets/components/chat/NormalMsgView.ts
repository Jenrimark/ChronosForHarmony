if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface NormalMsgView_Params {
    message?: ChatMessage;
    // 发送状态（0:发送中, 1:成功, 2:失败）
    sendStatus?: number;
}
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import type { ChatMessage } from '../../pages/Chat';
import MsgSendStatus from "@normalized:N&&&entry/src/main/ets/components/chat/MsgSendStatus&";
import ToolKits from "@normalized:N&&&entry/src/main/ets/utils/ToolKits&";
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
export class NormalMsgView extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.message = undefined;
        this.sendStatus = MsgSendStatus.success;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: NormalMsgView_Params) {
        if (params.message !== undefined) {
            this.message = params.message;
        }
        if (params.sendStatus !== undefined) {
            this.sendStatus = params.sendStatus;
        }
    }
    updateStateVars(params: NormalMsgView_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private message?: ChatMessage;
    // 发送状态（0:发送中, 1:成功, 2:失败）
    private sendStatus?: number;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/chat/NormalMsgView.ets(48:5)", "entry");
            Row.width("100%");
            Row.alignItems(VerticalAlign.Top);
            Row.justifyContent(FlexAlign.Start);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.message) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.message.isUser) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 用户消息：先放空白填充，然后气泡，最后头像
                                    Blank.create();
                                    Blank.debugLine("entry/src/main/ets/components/chat/NormalMsgView.ets(52:11)", "entry");
                                }, Blank);
                                // 用户消息：先放空白填充，然后气泡，最后头像
                                Blank.pop();
                                this.MessageBubbleColumn.bind(this)();
                                this.AvatarImage.bind(this)(true);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                // AI消息：先头像，然后气泡
                                this.AvatarImage.bind(this)(false);
                                this.MessageBubbleColumn.bind(this)();
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Row.pop();
    }
    MessageBubbleColumn(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.message) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/chat/NormalMsgView.ets(70:7)", "entry");
                        Column.alignItems(this.message.isUser ? HorizontalAlign.End : HorizontalAlign.Start);
                        Column.constraintSize({ maxWidth: '70%' });
                        Column.margin(this.message.isUser ? { right: 8 } : { left: 8 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 昵称显示（仅对收到的消息显示）
                        if (!this.message.isUser) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.NicknameText.bind(this)('辰序助手');
                            });
                        }
                        // 使用Flex布局解决文本超长时尾部挤出屏幕的问题
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 使用Flex布局解决文本超长时尾部挤出屏幕的问题
                        Flex.create({ direction: FlexDirection.Row, wrap: FlexWrap.NoWrap, justifyContent: (this.message.isUser ? FlexAlign.End : FlexAlign.Start) });
                        Flex.debugLine("entry/src/main/ets/components/chat/NormalMsgView.ets(77:9)", "entry");
                    }, Flex);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 消息状态图标的显示：只有"发出"的消息需要显示
                        if (this.message.isUser) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.SendStatusIcon.bind(this)();
                            });
                        }
                        // 消息内容
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    // 消息内容
                    this.MessageContent.bind(this)();
                    // 使用Flex布局解决文本超长时尾部挤出屏幕的问题
                    Flex.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    NicknameText(nickname: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(nickname);
            Text.debugLine("entry/src/main/ets/components/chat/NormalMsgView.ets(95:5)", "entry");
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.fontSize(11);
            Text.margin({ bottom: 4, left: 12 });
        }, Text);
        Text.pop();
    }
    AvatarImage(isUser: boolean, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 使用简单的圆形背景作为头像，实际项目中可以使用图片资源
            Column.create();
            Column.debugLine("entry/src/main/ets/components/chat/NormalMsgView.ets(104:5)", "entry");
            // 使用简单的圆形背景作为头像，实际项目中可以使用图片资源
            Column.width(40);
            // 使用简单的圆形背景作为头像，实际项目中可以使用图片资源
            Column.height(40);
            // 使用简单的圆形背景作为头像，实际项目中可以使用图片资源
            Column.borderRadius(20);
            // 使用简单的圆形背景作为头像，实际项目中可以使用图片资源
            Column.backgroundColor(isUser ? Constants.COLOR_PRIMARY : Constants.COLOR_PRIMARY_LIGHT);
            // 使用简单的圆形背景作为头像，实际项目中可以使用图片资源
            Column.justifyContent(FlexAlign.Center);
            // 使用简单的圆形背景作为头像，实际项目中可以使用图片资源
            Column.margin(isUser ? { left: 8, right: 12 } : { left: 12, right: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(isUser ? '我' : '助');
            Text.debugLine("entry/src/main/ets/components/chat/NormalMsgView.ets(105:7)", "entry");
            Text.fontSize(16);
            Text.fontColor(Color.White);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        // 使用简单的圆形背景作为头像，实际项目中可以使用图片资源
        Column.pop();
    }
    SendStatusIcon(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 只有"发出"的消息有消息状态ui的显示
            // 发送失败
            if (this.sendStatus === MsgSendStatus.sendFailed) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('⚠');
                        Text.debugLine("entry/src/main/ets/components/chat/NormalMsgView.ets(123:7)", "entry");
                        Text.fontSize(16);
                        Text.fontColor(Constants.COLOR_DANGER);
                        Text.margin({ top: 3, right: 7 });
                        Text.onClick(() => {
                            ToolKits.showToast('本条消息发送失败！');
                        });
                    }, Text);
                    Text.pop();
                });
            }
            // 发送中和发送成功都不显示任何图标（删除转圈圈提示）
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    MessageContent(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.message) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.message.isUser) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 用户消息：简单文本显示
                                    Text.create(this.message.content);
                                    Text.debugLine("entry/src/main/ets/components/chat/NormalMsgView.ets(139:9)", "entry");
                                    // 用户消息：简单文本显示
                                    Text.fontSize(14);
                                    // 用户消息：简单文本显示
                                    Text.fontColor(Constants.COLOR_TEXT_ON_PRIMARY);
                                    // 用户消息：简单文本显示
                                    Text.lineHeight(20);
                                    // 用户消息：简单文本显示
                                    Text.padding({
                                        top: 12,
                                        bottom: 12,
                                        left: 14,
                                        right: 16
                                    });
                                    // 用户消息：简单文本显示
                                    Text.backgroundColor(Constants.COLOR_PRIMARY);
                                    // 用户消息：简单文本显示
                                    Text.borderRadius(12);
                                }, Text);
                                // 用户消息：简单文本显示
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // AI消息：支持Markdown格式化显示
                                    Column.create();
                                    Column.debugLine("entry/src/main/ets/components/chat/NormalMsgView.ets(153:9)", "entry");
                                    // AI消息：支持Markdown格式化显示
                                    Column.width('100%');
                                    // AI消息：支持Markdown格式化显示
                                    Column.alignItems(HorizontalAlign.Start);
                                    // AI消息：支持Markdown格式化显示
                                    Column.padding({
                                        top: 12,
                                        bottom: 12,
                                        left: 14,
                                        right: 14
                                    });
                                    // AI消息：支持Markdown格式化显示
                                    Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
                                    // AI消息：支持Markdown格式化显示
                                    Column.borderRadius(12);
                                    // AI消息：支持Markdown格式化显示
                                    Column.border({
                                        width: 1,
                                        color: Constants.COLOR_BORDER
                                    });
                                }, Column);
                                this.buildFormattedContent.bind(this)(this.message.content);
                                // AI消息：支持Markdown格式化显示
                                Column.pop();
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
            else /**
             * 构建格式化的内容（支持Markdown）
             */ {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    /**
     * 构建格式化的内容（支持Markdown）
     */
    buildFormattedContent(content: string, parent = null) {
        this.buildFormattedLines.bind(this)(content);
    }
    /**
     * 构建格式化的行
     */
    buildFormattedLines(content: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/chat/NormalMsgView.ets(187:5)", "entry");
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const line = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (line.isEmpty) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 空行
                                Blank.create();
                                Blank.debugLine("entry/src/main/ets/components/chat/NormalMsgView.ets(191:11)", "entry");
                                // 空行
                                Blank.height(4);
                            }, Blank);
                            // 空行
                            Blank.pop();
                        });
                    }
                    else if (line.isUnorderedList) {
                        this.ifElseBranchUpdateFunction(1, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 无序列表项
                                Row.create();
                                Row.debugLine("entry/src/main/ets/components/chat/NormalMsgView.ets(195:11)", "entry");
                                // 无序列表项
                                Row.width('100%');
                                // 无序列表项
                                Row.margin({ bottom: 6 });
                                // 无序列表项
                                Row.alignItems(VerticalAlign.Top);
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create('•');
                                Text.debugLine("entry/src/main/ets/components/chat/NormalMsgView.ets(196:13)", "entry");
                                Text.fontSize(16);
                                Text.fontColor(Constants.COLOR_PRIMARY);
                                Text.margin({ right: 8 });
                            }, Text);
                            Text.pop();
                            this.buildFormattedText.bind(this)(line.text);
                            // 无序列表项
                            Row.pop();
                        });
                    }
                    else if (line.isOrderedList) {
                        this.ifElseBranchUpdateFunction(2, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 有序列表 - 固定序号宽度，确保文字对齐
                                Row.create();
                                Row.debugLine("entry/src/main/ets/components/chat/NormalMsgView.ets(207:11)", "entry");
                                // 有序列表 - 固定序号宽度，确保文字对齐
                                Row.width('100%');
                                // 有序列表 - 固定序号宽度，确保文字对齐
                                Row.margin({ bottom: 6 });
                                // 有序列表 - 固定序号宽度，确保文字对齐
                                Row.alignItems(VerticalAlign.Top);
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(line.number);
                                Text.debugLine("entry/src/main/ets/components/chat/NormalMsgView.ets(208:13)", "entry");
                                Text.fontSize(14);
                                Text.fontColor(Constants.COLOR_PRIMARY);
                                Text.fontWeight(FontWeight.Medium);
                                Text.width(24);
                                Text.textAlign(TextAlign.Start);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.debugLine("entry/src/main/ets/components/chat/NormalMsgView.ets(214:13)", "entry");
                                Column.layoutWeight(1);
                                Column.alignItems(HorizontalAlign.Start);
                            }, Column);
                            this.buildFormattedText.bind(this)(line.text);
                            Column.pop();
                            // 有序列表 - 固定序号宽度，确保文字对齐
                            Row.pop();
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(3, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 普通文本
                                Column.create();
                                Column.debugLine("entry/src/main/ets/components/chat/NormalMsgView.ets(225:11)", "entry");
                                // 普通文本
                                Column.width('100%');
                                // 普通文本
                                Column.margin({ bottom: line.isLast ? 0 : 6 });
                            }, Column);
                            this.buildFormattedText.bind(this)(line.text);
                            // 普通文本
                            Column.pop();
                        });
                    }
                }, If);
                If.pop();
            };
            this.forEachUpdateFunction(elmtId, this.splitContentToLines(content), forEachItemGenFunction, (line: LineItem, index: number) => `${index}-${(line.text ?? '').substring(0, 10)}`, true, true);
        }, ForEach);
        ForEach.pop();
        Column.pop();
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
            }
            else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
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
            }
            else {
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
                }
                else {
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
    buildFormattedText(text: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (text && text.trim()) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.shouldShowPlainText(text)) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 如果没有spans或spans为空，直接显示原文本
                                    Text.create(text);
                                    Text.debugLine("entry/src/main/ets/components/chat/NormalMsgView.ets(315:9)", "entry");
                                    // 如果没有spans或spans为空，直接显示原文本
                                    Text.fontSize(14);
                                    // 如果没有spans或spans为空，直接显示原文本
                                    Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
                                    // 如果没有spans或spans为空，直接显示原文本
                                    Text.lineHeight(22);
                                }, Text);
                                // 如果没有spans或spans为空，直接显示原文本
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create();
                                    Text.debugLine("entry/src/main/ets/components/chat/NormalMsgView.ets(320:9)", "entry");
                                    Text.fontSize(14);
                                    Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
                                    Text.lineHeight(22);
                                }, Text);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = (_item, index: number) => {
                                        const span = _item;
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            If.create();
                                            if (span.text) {
                                                this.ifElseBranchUpdateFunction(0, () => {
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Span.create(span.text);
                                                        Span.debugLine("entry/src/main/ets/components/chat/NormalMsgView.ets(323:15)", "entry");
                                                        Span.fontSize(14);
                                                        Span.fontColor(Constants.COLOR_TEXT_PRIMARY);
                                                        Span.fontWeight(span.bold ? FontWeight.Bold : FontWeight.Normal);
                                                        Span.fontStyle(span.italic ? FontStyle.Italic : FontStyle.Normal);
                                                    }, Span);
                                                });
                                            }
                                            else {
                                                this.ifElseBranchUpdateFunction(1, () => {
                                                });
                                            }
                                        }, If);
                                        If.pop();
                                    };
                                    this.forEachUpdateFunction(elmtId, this.parseMarkdownSpans(text), forEachItemGenFunction, (span: TextSpan, index: number) => `${index}-${(span.text ?? '').substring(0, 5)}`, true, true);
                                }, ForEach);
                                ForEach.pop();
                                Text.pop();
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
            else /**
             * 解析Markdown文本为Span数组
             */ {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
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
    rerender() {
        this.updateDirtyElements();
    }
}
