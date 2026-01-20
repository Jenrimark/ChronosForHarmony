/**
 * 消息的发送状态常量
 */
export default class MsgSendStatus {
    /** 消息发送中 */
    static readonly sending: number = 0;
    /** 消息发送成功 */
    static readonly success: number = 1;
    /** 消息发送失败 */
    static readonly sendFailed: number = 2;
}
