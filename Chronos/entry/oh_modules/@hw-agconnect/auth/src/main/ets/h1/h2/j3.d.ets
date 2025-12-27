// @keepTs
// @ts-nocheck
interface e2 {
    unicode?: number;
    ok: boolean;
}
export declare class BufferEncoder {
    buffer: number[];
    private readOffset;
    constructor();
    pushUint8(value: number): void;
    pushUnicodeWithUtf8(value: number): void;
    parseUnicodeFromUtf16(k2: number, l2: number): e2;
    pushStringWithUtf8(value: string): number;
    toUint8Array(len?: number): Uint8Array;
}
export {};
