import { bytesToHex, hexToBytes } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/base/crypto/Hex&1.0.5";
import { getKey } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/base/crypto/Keys&1.0.5";
import { FrameworkCrypto } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/base/aegis/FrameworkCrypto&1.0.5";
import agccrypto from "@normalized:Y&&&libagccrypto.so&";
export class AegisAes {
    public static buildKey(rxHex: string, ryHex: string, rzHex: string, slHex: string, iterationCount: number): string {
        let password = getKey(hexToBytes(rxHex), hexToBytes(ryHex), hexToBytes(rzHex));
        return agccrypto.ohGenPbkdf2(bytesToHex(password), slHex, iterationCount);
    }
    public static async decryptWithIv(workKey: string, ivHex: string, cipher: string) {
        let result = await FrameworkCrypto.ohGenAesCbcDecryptWithIv(cipher, workKey, ivHex);
        if (result == undefined || result == '') {
            return cipher;
        }
        return result;
    }
    public static async encryptWithIv(workKey: string, ivHex: string, cipher: string) {
        let result = await FrameworkCrypto.ohGenAesCbcEncryptWithIv(cipher, workKey, ivHex);
        return result ? result : cipher;
    }
}
