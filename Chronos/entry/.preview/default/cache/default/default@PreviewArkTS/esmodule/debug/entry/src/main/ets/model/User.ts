/**
 * 用户数据接口
 */
export interface UserData {
    id?: number;
    username?: string;
    nickname?: string;
    avatar?: string;
    phone?: string;
    loginType?: string;
    createTime?: string;
}
/**
 * 用户JSON接口
 */
export interface UserJSON {
    id: number;
    username: string;
    nickname?: string;
    avatar?: string;
    phone?: string;
    loginType?: string;
    createTime?: string;
}
/**
 * 用户模型
 */
export class User {
    id: number = 0;
    username: string = '';
    nickname: string = '';
    avatar: string = '';
    phone: string = '';
    loginType: string = 'password';
    createTime: Date = new Date();
    constructor(data?: UserData) {
        if (data) {
            if (data.id !== undefined)
                this.id = data.id;
            if (data.username !== undefined)
                this.username = data.username;
            if (data.nickname !== undefined)
                this.nickname = data.nickname;
            if (data.avatar !== undefined)
                this.avatar = data.avatar;
            if (data.phone !== undefined)
                this.phone = data.phone;
            if (data.loginType !== undefined)
                this.loginType = data.loginType;
            if (data.createTime) {
                this.createTime = new Date(data.createTime);
            }
        }
    }
    /**
     * 获取显示名称（优先使用昵称）
     */
    getDisplayName(): string {
        return this.nickname || this.username;
    }
    /**
     * 是否有头像
     */
    hasAvatar(): boolean {
        return (this.avatar !== null && this.avatar !== undefined && this.avatar.length > 0);
    }
}
