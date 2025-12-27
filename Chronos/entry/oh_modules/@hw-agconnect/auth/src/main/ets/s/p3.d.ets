// @keepTs
// @ts-nocheck
export declare class UserInfo {
    private uid;
    private displayName;
    private photoUrl;
    private phone;
    private email;
    private provider;
    private openId;
    private emailVerified;
    private passwordSetted;
    constructor();
    getUid(): string;
    setUid(uid: string): void;
    getDisplayName(): string;
    setDisplayName(displayName: string): void;
    getPhotoUrl(): string;
    setPhotoUrl(g3: string): void;
    getPhone(): string;
    setPhone(phone: string): void;
    getEmail(): string;
    setEmail(email: string): void;
    getProvider(): number;
    setProvider(f3: number): void;
    getOpenId(): string;
    setOpenId(e3: string): void;
    getEmailVerified(): number;
    setEmailVerified(d3: number): void;
    getPasswordSetted(): number;
    setPasswordSetted(c3: number): void;
}
