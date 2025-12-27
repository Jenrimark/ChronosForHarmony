// @keepTs
// @ts-nocheck
export declare class FrameworkCrypto {
    static ohGenAesCbcEncryptWithIv(plain: string, u1: string, iv: string): Promise<string>;
    static ohGenAesCbcDecryptWithIv(plain: string, l1: string, iv: string): Promise<string>;
}
