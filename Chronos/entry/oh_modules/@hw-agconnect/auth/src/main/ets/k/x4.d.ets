// @keepTs
// @ts-nocheck
import { AuthUser, AuthUserExtra, CredentialInfo, EmailInfo, PasswordInfo, PhoneInfo, ProviderType, SignInParam, SignInResult, TokenResult, UserProfileInfo } from "../f";
import { ReauthenticateResponse } from "../i/q/i4";
import { UserRawData } from "./q1";
import { AuthBackend } from "../i/j";
import { Interceptor } from "../h1/i1/j1/k1";
import { UserStored } from "../r1/s1";
export declare class AuthDefaultUser implements AuthUser {
    anonymous: boolean;
    uid: string;
    displayName: string;
    photoUrl: string;
    email: string;
    phone: string;
    providerId: string;
    emailVerified: number;
    passwordSetted: number;
    providerService: e6;
    tokenService: d6;
    storeManager: UserStored | undefined;
    authBackend: AuthBackend | undefined;
    static fromRawData(info: UserRawData): AuthDefaultUser;
    setStoreManager(k8: UserStored): void;
    setAuthBackend(j8: AuthBackend): void;
    toRawData(): UserRawData;
    getUid(): string;
    getEmail(): string;
    getPhone(): string;
    getDisplayName(): string;
    getPhotoUrl(): string;
    getProviderId(): string;
    isAnonymous(): boolean;
    getProviderInfo(): Map<string, string>[];
    getToken(d8: boolean): Promise<TokenResult>;
    getUserExtra(): Promise<AuthUserExtra>;
    getAccessToken(): string;
    getRefreshToken(): string;
    getEmailVerified(): boolean;
    getPasswordSetted(): boolean;
    updateProfile(userProfile: UserProfileInfo): Promise<void>;
    userReauthenticate(param: SignInParam): Promise<SignInResult>;
    reConfigUserFrom(response: ReauthenticateResponse): void;
    link(credentialInfo: CredentialInfo): Promise<SignInResult>;
    unlink(type: ProviderType): Promise<SignInResult>;
    updateEmail(z6: EmailInfo): Promise<void>;
    updatePhone(v6: PhoneInfo): Promise<void>;
    updatePassword(r6: PasswordInfo): Promise<void>;
    dispose(): Promise<void>;
    syncToStorage(): Promise<void>;
    createTokenInterceptor(): Interceptor;
    private updateAnonymousUserInfo;
    private userInfoToMap;
    private convertProvider;
}
declare class d6 {
    accessToken: string;
    accessTokenValidPeriod: number;
    refreshToken: string;
    d1: number;
    startTime: number;
    private readonly e1;
    getAccessToken(): string;
    getRefreshToken(): string;
    o(): boolean;
    t(): TokenResult;
    u(): Promise<void>;
}
declare class e6 {
    providerInfo: Array<Map<string, string>>;
    a1(info: Map<string, string>): void;
    f1(k6: number, key: string, value: string): void;
    updateEmail(j6: string): void;
    updatePhone(i6: string): void;
    b1(h6: string): void;
    c1(f6: string): number | undefined;
}
export {};
