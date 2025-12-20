import { User } from "@normalized:N&&&entry/src/main/ets/model/User&";
import type { UserJSON, UserData } from "@normalized:N&&&entry/src/main/ets/model/User&";
import { ApiClient } from "@normalized:N&&&entry/src/main/ets/common/ApiClient&";
/**
 * 用户信息更新请求数据类
 */
class UpdateUserInfoRequest {
    nickname?: string = '';
    avatar?: string = '';
    phone?: string = '';
}
/**
 * 用户服务类
 */
export class UserService {
    private static instance: UserService;
    private apiClient: ApiClient = ApiClient.getInstance();
    private constructor() { }
    static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }
    /**
     * 获取用户信息
     */
    async getUserInfo(userId: number): Promise<User> {
        try {
            const response = await this.apiClient.get<UserJSON>(`/users/${userId}`);
            const userData: UserData = {
                id: response.data.id,
                username: response.data.username,
                nickname: response.data.nickname,
                avatar: response.data.avatar,
                phone: response.data.phone,
                loginType: response.data.loginType,
                createTime: response.data.createTime
            };
            return new User(userData);
        }
        catch (error) {
            console.error('获取用户信息失败:', error);
            throw error instanceof Error ? error : new Error(String(error));
        }
    }
    /**
     * 更新用户昵称
     */
    async updateNickname(userId: number, nickname: string): Promise<User> {
        try {
            const requestData = new UpdateUserInfoRequest();
            requestData.nickname = nickname;
            const response = await this.apiClient.put<UserJSON>(`/users/${userId}/nickname`, requestData as Record<string, any>);
            const userData: UserData = {
                id: userId,
                username: '',
                nickname: response.data.nickname || nickname
            };
            return new User(userData);
        }
        catch (error) {
            console.error('更新昵称失败:', error);
            throw error instanceof Error ? error : new Error(String(error));
        }
    }
    /**
     * 更新用户头像
     */
    async updateAvatar(userId: number, avatarUrl: string): Promise<User> {
        try {
            const requestData = new UpdateUserInfoRequest();
            requestData.avatar = avatarUrl;
            const response = await this.apiClient.put<UserJSON>(`/users/${userId}/avatar`, requestData as Record<string, any>);
            const userData: UserData = {
                id: userId,
                username: '',
                avatar: response.data.avatar || avatarUrl
            };
            return new User(userData);
        }
        catch (error) {
            console.error('更新头像失败:', error);
            throw error instanceof Error ? error : new Error(String(error));
        }
    }
    /**
     * 更新手机号
     */
    async updatePhone(userId: number, phone: string): Promise<User> {
        try {
            const requestData = new UpdateUserInfoRequest();
            requestData.phone = phone;
            const response = await this.apiClient.put<UserJSON>(`/users/${userId}/phone`, requestData as Record<string, any>);
            const userData: UserData = {
                id: userId,
                username: '',
                phone: response.data.phone || phone
            };
            return new User(userData);
        }
        catch (error) {
            console.error('更新手机号失败:', error);
            throw error instanceof Error ? error : new Error(String(error));
        }
    }
    /**
     * 更新用户信息（可批量更新）
     */
    async updateUserInfo(userId: number, nickname?: string, avatar?: string, phone?: string): Promise<User> {
        try {
            const requestData = new UpdateUserInfoRequest();
            if (nickname !== undefined)
                requestData.nickname = nickname;
            if (avatar !== undefined)
                requestData.avatar = avatar;
            if (phone !== undefined)
                requestData.phone = phone;
            const response = await this.apiClient.put<UserJSON>(`/users/${userId}/info`, requestData as Record<string, any>);
            return new User({
                id: response.data.id,
                username: response.data.username,
                nickname: response.data.nickname,
                avatar: response.data.avatar,
                phone: response.data.phone,
                loginType: response.data.loginType
            });
        }
        catch (error) {
            console.error('更新用户信息失败:', error);
            throw error instanceof Error ? error : new Error(String(error));
        }
    }
}
