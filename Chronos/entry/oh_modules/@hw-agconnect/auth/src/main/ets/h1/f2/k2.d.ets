// @keepTs
// @ts-nocheck
export declare class AegisAes {
    static buildKey(e1: string, f1: string, g1: string, h1: string, i1: number): Promise<string>;
    static decryptWithIv(b1: string, c1: string, d1: string): Promise<string>;
    static encryptWithIv(t: string, u: string, a1: string): Promise<string>;
    static uint8ArrayToHexStr(data: Uint8Array): string;
}
