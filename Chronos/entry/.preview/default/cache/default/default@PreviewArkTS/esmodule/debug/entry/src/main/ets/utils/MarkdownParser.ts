/**
 * Markdown 解析工具类
 * 简化版本的 Markdown 解析器，支持代码块、加粗、列表等基本格式
 */
export interface MarkdownBlock {
    type: 'text' | 'code';
    content: string;
    language?: string; // 代码块的语言
}
export default class MarkdownParser {
    /**
     * 解析 Markdown 内容，分离文本和代码块
     * 参考 highlightCode 函数的逻辑
     */
    static parseMarkdown(content: string): MarkdownBlock[] {
        const blocks: MarkdownBlock[] = [];
        const parts = content.split('```');
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (i % 2 === 0) {
                // 偶数索引：普通文本部分
                if (part.trim() !== '') {
                    blocks.push({
                        type: 'text',
                        content: part
                    });
                }
            }
            else {
                // 奇数索引：代码块部分
                if (part.trim() !== '') {
                    // 尝试提取语言标识（第一行）
                    const lines = part.split('\n');
                    const firstLine = lines[0].trim();
                    let language = '';
                    let codeContent = part;
                    // 检查第一行是否为语言标识（常见语言标识）
                    const languagePattern = /^(javascript|typescript|python|java|cpp|c|html|css|json|xml|bash|shell|sql|markdown|yaml|yml|rust|go|php|ruby|swift|kotlin|dart)$/i;
                    if (languagePattern.test(firstLine)) {
                        language = firstLine.toLowerCase();
                        codeContent = lines.slice(1).join('\n');
                    }
                    blocks.push({
                        type: 'code',
                        content: codeContent.trim(),
                        language: language || 'plaintext'
                    });
                }
            }
        }
        return blocks;
    }
    /**
     * 解析文本内容中的 Markdown 格式（加粗、斜体等）
     */
    static parseInlineMarkdown(text: string): TextSpan[] {
        const spans: TextSpan[] = [];
        // 匹配加粗 **text** 或 __text__
        const boldRegex = /\*\*(.*?)\*\*|__(.*?)__/g;
        const italicRegex = /\*(.*?)\*|_(.*?)_/g;
        const matches: MatchResult[] = [];
        let match: RegExpExecArray | null = null;
        // 收集所有匹配项
        while ((match = boldRegex.exec(text)) !== null) {
            matches.push({
                start: match.index,
                end: match.index + match[0].length,
                text: match[1] || match[2] || '',
                bold: true,
                italic: false
            });
        }
        // 重置正则表达式
        italicRegex.lastIndex = 0;
        while ((match = italicRegex.exec(text)) !== null) {
            // 检查是否已经被加粗匹配包含
            const isInBold = matches.some(m => match!.index >= m.start && match!.index < m.end);
            if (!isInBold) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[1] || match[2] || '',
                    bold: false,
                    italic: true
                });
            }
        }
        // 如果没有匹配，返回普通文本
        if (matches.length === 0) {
            spans.push({ text: text, bold: false, italic: false });
            return spans;
        }
        // 按位置排序
        matches.sort((a, b) => a.start - b.start);
        // 构建 Span 数组
        let lastIndex = 0;
        for (const m of matches) {
            // 添加格式化前的普通文本
            if (m.start > lastIndex) {
                const normalText = text.substring(lastIndex, m.start);
                if (normalText) {
                    spans.push({ text: normalText, bold: false, italic: false });
                }
            }
            // 添加格式化文本
            spans.push({ text: m.text, bold: m.bold, italic: m.italic });
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
    /**
     * 分割文本为行（处理列表等）
     */
    static splitTextToLines(text: string): string[] {
        return text.split('\n');
    }
}
/**
 * 文本 Span 接口
 */
export interface TextSpan {
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
    italic: boolean;
}
