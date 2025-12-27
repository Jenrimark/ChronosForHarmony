import auth from '@hw-agconnect/auth';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { common } from '@kit.AbilityKit';
import { buffer } from '@kit.ArkTS';
import { preferences } from '@kit.ArkData';

const TAG = 'AuthService';
const PREFERENCES_NAME = 'user_preferences';
const KEY_USER_INFO = 'user_info';

/**
 * 用户信息接口
 */
export interface UserInfo {
  uid: string;
  displayName: string;
  avatarUri: string;
  email: string;
  phone: string;
}

/**
 * 华为账号认证服务
 */
export class AuthService {
  private static instance: AuthService;
  private currentUser: UserInfo | null = null;
  private context: common.UIAbilityContext | null = null;
  private isInitialized: boolean = false;
  private dataPreferences: preferences.Preferences | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * 设置 Context 并初始化
   */
  async setContext(context: common.UIAbilityContext): Promise<void> {
    this.context = context;
    // 初始化 Preferences
    try {
      this.dataPreferences = await preferences.getPreferences(context, PREFERENCES_NAME);
      hilog.info(0x0000, TAG, 'Preferences 初始化成功');
      // 加载缓存的用户信息
      await this.loadCachedUserInfo();
    } catch (error) {
      hilog.error(0x0000, TAG, 'Preferences 初始化失败: %{public}s', String(error));
    }
  }

  /**
   * 从本地缓存加载用户信息
   */
  private async loadCachedUserInfo(): Promise<void> {
    try {
      if (!this.dataPreferences) {
        return;
      }
      const userInfoStr = await this.dataPreferences.get(KEY_USER_INFO, '') as string;
      if (userInfoStr) {
        const userInfo: UserInfo = JSON.parse(userInfoStr) as UserInfo;
        this.currentUser = userInfo;
        hilog.info(0x0000, TAG, '从缓存加载用户信息成功: %{public}s', userInfo.displayName);
      }
    } catch (error) {
      hilog.error(0x0000, TAG, '加载缓存用户信息失败: %{public}s', String(error));
    }
  }

  /**
   * 保存用户信息到本地缓存
   */
  private async saveUserInfoToCache(): Promise<void> {
    try {
      if (!this.dataPreferences || !this.currentUser) {
        return;
      }
      const userInfoStr = JSON.stringify(this.currentUser);
      await this.dataPreferences.put(KEY_USER_INFO, userInfoStr);
      await this.dataPreferences.flush();
      hilog.info(0x0000, TAG, '用户信息已保存到缓存');
    } catch (error) {
      hilog.error(0x0000, TAG, '保存用户信息到缓存失败: %{public}s', String(error));
    }
  }

  /**
   * 清除缓存的用户信息
   */
  private async clearCachedUserInfo(): Promise<void> {
    try {
      if (!this.dataPreferences) {
        return;
      }
      await this.dataPreferences.delete(KEY_USER_INFO);
      await this.dataPreferences.flush();
      hilog.info(0x0000, TAG, '缓存的用户信息已清除');
    } catch (error) {
      hilog.error(0x0000, TAG, '清除缓存用户信息失败: %{public}s', String(error));
    }
  }

  /**
   * 初始化 Auth SDK
   */
  private initAuth(): boolean {
    if (this.isInitialized) {
      return true;
    }

    if (!this.context) {
      hilog.error(0x0000, TAG, 'Context 未设置，无法初始化 Auth');
      return false;
    }

    try {
      const file: Uint8Array = this.context.resourceManager.getRawFileContentSync('agconnect-services.json');
      const str: string = buffer.from(file).toString();
      
      auth.init(this.context, str);
      this.isInitialized = true;
      hilog.info(0x0000, TAG, 'Auth SDK 初始化成功');
      return true;
    } catch (error) {
      const err = error as BusinessError;
      hilog.error(0x0000, TAG, 'Auth SDK 初始化失败: %{public}s', String(err.message));
      return false;
    }
  }

  /**
   * 华为账号登录（基础登录，不获取头像昵称）
   */
  async login(): Promise<UserInfo | null> {
    try {
      hilog.info(0x0000, TAG, '开始华为账号登录...');
      
      // 确保 Auth SDK 已初始化
      const initialized = this.initAuth();
      if (!initialized) {
        hilog.error(0x0000, TAG, 'Auth SDK 未初始化');
        return null;
      }

      // 检查是否已登录
      hilog.info(0x0000, TAG, '检查当前登录状态...');
      const currentUser = await auth.getCurrentUser();
      if (currentUser !== null) {
        hilog.info(0x0000, TAG, '用户已登录，先退出...');
        await auth.signOut();
      }

      // 执行登录
      hilog.info(0x0000, TAG, '执行华为账号登录...');
      const signInResult = await auth.signIn({
        autoCreateUser: true,
        credentialInfo: {
          kind: 'hwid'
        }
      });

      const user = signInResult.getUser();
      
      this.currentUser = {
        uid: user.getUid(),
        displayName: user.getDisplayName() || '华为用户',
        avatarUri: user.getPhotoUrl() || '',
        email: user.getEmail() || '',
        phone: user.getPhone() || ''
      };

      hilog.info(0x0000, TAG, '登录成功, uid: %{public}s', this.currentUser.uid);
      // 保存到本地缓存
      await this.saveUserInfoToCache();
      return this.currentUser;
    } catch (error) {
      const err = error as BusinessError;
      hilog.error(0x0000, TAG, '登录失败: Code: %{public}s, Message: %{public}s', 
        String(err.code), String(err.message));
      return null;
    }
  }

  /**
   * 更新用户头像昵称（从外部设置）
   */
  async updateUserProfile(displayName: string, avatarUri: string): Promise<void> {
    if (this.currentUser) {
      this.currentUser.displayName = displayName || this.currentUser.displayName;
      this.currentUser.avatarUri = avatarUri || this.currentUser.avatarUri;
      hilog.info(0x0000, TAG, '用户信息已更新 - 昵称: %{public}s', this.currentUser.displayName);
      // 保存到本地缓存
      await this.saveUserInfoToCache();
    }
  }

  /**
   * 获取当前登录用户
   */
  async getCurrentUserAsync(): Promise<UserInfo | null> {
    try {
      const initialized = this.initAuth();
      if (!initialized) {
        return null;
      }

      const user = await auth.getCurrentUser();
      if (user) {
        // 如果已有缓存的用户信息，使用缓存
        if (this.currentUser && this.currentUser.uid === user.getUid()) {
          return this.currentUser;
        }
        
        this.currentUser = {
          uid: user.getUid(),
          displayName: user.getDisplayName() || '华为用户',
          avatarUri: user.getPhotoUrl() || '',
          email: user.getEmail() || '',
          phone: user.getPhone() || ''
        };
        hilog.info(0x0000, TAG, '获取当前用户成功, uid: %{public}s', this.currentUser.uid);
        return this.currentUser;
      }
      hilog.info(0x0000, TAG, '当前没有登录用户');
      return null;
    } catch (error) {
      const err = error as BusinessError;
      hilog.error(0x0000, TAG, '获取当前用户失败: %{public}s', String(err.message));
      return null;
    }
  }

  /**
   * 退出登录
   */
  async logout(): Promise<boolean> {
    try {
      const initialized = this.initAuth();
      if (!initialized) {
        return false;
      }

      await auth.signOut();
      this.currentUser = null;
      // 清除本地缓存
      await this.clearCachedUserInfo();
      hilog.info(0x0000, TAG, '退出登录成功');
      return true;
    } catch (error) {
      const err = error as BusinessError;
      hilog.error(0x0000, TAG, '退出登录失败: %{public}s', String(err.message));
      return false;
    }
  }

  /**
   * 获取当前用户（同步）
   */
  getCurrentUser(): UserInfo | null {
    return this.currentUser;
  }

  /**
   * 是否已登录
   */
  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }
}
