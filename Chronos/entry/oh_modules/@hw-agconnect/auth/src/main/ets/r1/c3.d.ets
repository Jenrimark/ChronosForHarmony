// @keepTs
// @ts-nocheck
import { huks } from '@kit.UniversalKeystoreKit';
export declare class HuksManager {
    private deriveHkdfInData;
    private handle;
    private huksKeyDeriveKeySize;
    private huksOptions;
    private finishOptions;
    private initOptions;
    static getKeyAlies(): string;
    static stringToUint8Array(str: String): Uint8Array;
    static uint8ArrayToString(m5: Uint8Array): string;
    publicGenKeyFunc(keyAlias: string): Promise<void>;
    publicInitFunc(keyAlias: string): Promise<void>;
    publicUpdateFunc(): Promise<void>;
    publicFinishFunc(): Promise<void>;
    publicDeleteKeyFunc(keyAlias: string): Promise<void>;
    initDeriveKey(keyAlias: string): Promise<void>;
    getAesEncryptProperties(nonce: string, iv: string): huks.HuksParam[];
    getAesDecryptProperties(g5: Uint8Array, nonce: string, iv: string): huks.HuksParam[];
    encryptData(plainText: string, keyAlias: string, nonce: string, iv: string): Promise<Uint8Array>;
    decryptData(z4: Uint8Array, keyAlias: string, nonce: string, iv: string): Promise<string | null>;
    private generateKeyItem;
    private initSession;
    private updateSession;
    private finishSession;
    private deleteKeyItem;
    private init;
    private hasKeyAlies;
}
