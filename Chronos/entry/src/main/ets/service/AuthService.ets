import { User, UserJSON } from '../model/User';
import { ApiClient } from '../common/ApiClient';

/**
 * 登录请求数据类
 */
class LoginRequest {
  username: string = '';
  password: string = '';
}

/**
 * 注册请求数据类
 */
class RegisterRequest {
  username: string = '';
  password: string = '';
  nickname?: string = '';
}

/**
 * 微信登录请求数据类
 */
class WechatLoginRequest {
  openId: string = '';
  unionId?: string = '';
  nickname?: string = '';
  avatar?: string = '';
}

/**
 * 登录响应数据接口
 */
export interface LoginResponse {
  token: string;
  user: UserJSON;
}

/**
 * 认证服务类
 */
export class AuthService {
  private static instance: AuthService;
  private apiClient: ApiClient = ApiClient.getInstance();

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * 用户名密码登录
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const requestData = new LoginRequest();
      requestData.username = username;
      requestData.password = password;
      const response = await this.apiClient.post<LoginResponse>('/auth/login', requestData as Record<string, ESObject>);
      
      // 保存token
      if (response.data.token) {
        this.apiClient.setToken(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('登录失败:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * 注册
   */
  async register(username: string, password: string, nickname?: string): Promise<LoginResponse> {
    try {
      const requestData = new RegisterRequest();
      requestData.username = username;
      requestData.password = password;
      requestData.nickname = nickname;
      const response = await this.apiClient.post<LoginResponse>('/auth/register', requestData as Record<string, ESObject>);
      
      // 保存token
      if (response.data.token) {
        this.apiClient.setToken(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('注册失败:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * 微信登录
   */
  async wechatLogin(openId: string, unionId?: string, nickname?: string, avatar?: string): Promise<LoginResponse> {
    try {
      const requestData = new WechatLoginRequest();
      requestData.openId = openId;
      requestData.unionId = unionId;
      requestData.nickname = nickname;
      requestData.avatar = avatar;
      const response = await this.apiClient.post<LoginResponse>('/auth/wechat/login', requestData as Record<string, ESObject>);
      
      // 保存token
      if (response.data.token) {
        this.apiClient.setToken(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('微信登录失败:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * 退出登录
   */
  logout(): void {
    this.apiClient.setToken('');
  }

  /**
   * 是否已登录
   */
  isLoggedIn(): boolean {
    return this.apiClient.getToken().length > 0;
  }
}
