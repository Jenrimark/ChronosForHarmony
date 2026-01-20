import { RX_HEX } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/base/crypto/Constant&1.0.5";
import { Preferences } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/base/datastore/Preference&1.0.5";
import { AegisRandom } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/base/aegis/AegisRandom&1.0.5";
import { AegisAes } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/base/aegis/AegisAes&1.0.5";
import { AesCrypto } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/base/crypto/AesCrypto&1.0.5";
import { getCore } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/core/hmcore&1.0.5";
import type { ICrypto } from './ICrypto';
import { FakeSync } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/base/util/FakeSync&1.0.5";
import type { AsyncFactory } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/base/util/FakeSync&1.0.5";
import { Logger } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/base/log/Logger&1.0.5";
/**
 * 提供统一的默认AesCrypto，防止重复迭代消耗性能
 */
class DefaultCrypto {
    private crypto: ICrypto | undefined;
    public async get(): Promise<ICrypto> {
        if (!this.crypto) {
            this.crypto = await FakeSync.createWithPromise(new DefaultAesCrypto());
        }
        return this.crypto;
    }
}
const FILE_NAME: string = 'AGC_DEFAULT_AES';
const KEY_RY_HEX: string = 'RY_HEX';
const KEY_RZ_HEX: string = 'RZ_HEX';
const KEY_SL_HEX: string = 'sl_HEX';
const KEY_LENGTH: number = 32;
const SALT_LENGTH: number = 16;
const ITERATION_COUNT: number = 1000;
export class DefaultAesCrypto implements AsyncFactory<AesCrypto> {
    instanceName(): string {
        return 'DefaultCrypto';
    }
    async create(): Promise<AesCrypto> {
        Logger.info('DefaultAesCrypto', 'create start');
        let context = getCore().context;
        let rxHex = RX_HEX;
        let ryHex = await Preferences.get(context, FILE_NAME, KEY_RY_HEX);
        let rZHex = await Preferences.get(context, FILE_NAME, KEY_RZ_HEX);
        let slHex = await Preferences.get(context, FILE_NAME, KEY_SL_HEX);
        if (!isValid(ryHex, KEY_LENGTH * 2) || !isValid(rZHex, KEY_LENGTH * 2) || !isValid(slHex, SALT_LENGTH * 2)) {
            ryHex = await AegisRandom.generatedRandomHex(KEY_LENGTH);
            rZHex = await AegisRandom.generatedRandomHex(KEY_LENGTH);
            slHex = await AegisRandom.generatedRandomHex(SALT_LENGTH);
            await Preferences.put(context, FILE_NAME, KEY_RY_HEX, ryHex);
            await Preferences.put(context, FILE_NAME, KEY_RZ_HEX, rZHex);
            await Preferences.put(context, FILE_NAME, KEY_SL_HEX, slHex);
        }
        let aesKey = AegisAes.buildKey(rxHex, ryHex, rZHex, slHex, ITERATION_COUNT);
        Logger.info('DefaultAesCrypto', 'create end');
        return new AesCrypto(aesKey);
    }
}
function isValid(hex: string, length: number) {
    if (hex && hex.length == length) {
        return true;
    }
    return false;
}
export default new DefaultCrypto();
