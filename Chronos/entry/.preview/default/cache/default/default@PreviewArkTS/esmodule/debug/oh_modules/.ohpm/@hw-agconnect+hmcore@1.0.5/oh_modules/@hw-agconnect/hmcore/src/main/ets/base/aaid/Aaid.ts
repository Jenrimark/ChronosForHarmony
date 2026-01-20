import type common from "@ohos:app.ability.common";
import { AegisRandom } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/base/aegis/AegisRandom&1.0.5";
import { Preferences } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/base/datastore/Preference&1.0.5";
import { FakeSync } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/base/util/FakeSync&1.0.5";
import type { AsyncFactory } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/base/util/FakeSync&1.0.5";
const STORAGE_AAID_FILE: string = "ohos_agconnect_aaid_file";
const STORAGE_AAID_KEY: string = "ohos_agconnect_aaid_key";
class Aaid {
    private aaid: string;
    async get(context: common.Context): Promise<string> {
        if (this.aaid) {
            return this.aaid;
        }
        this.aaid = await FakeSync.createWithPromise(new AGConnectAaid(context));
        return this.aaid;
    }
}
export default new Aaid();
export class AGConnectAaid implements AsyncFactory<string> {
    private context: common.Context;
    constructor(context: common.Context) {
        this.context = context;
    }
    instanceName(): string {
        return 'agconnect_aaid';
    }
    async create(): Promise<string> {
        let storageAaid = await Preferences.get(this.context, STORAGE_AAID_FILE, STORAGE_AAID_KEY);
        if (storageAaid != '') {
            return Promise.resolve(storageAaid);
        }
        storageAaid = await this.getRandomString();
        await Preferences.put(this.context, STORAGE_AAID_FILE, STORAGE_AAID_KEY, storageAaid);
        return Promise.resolve(storageAaid);
    }
    /**
     * aaid生成
     * @returns 返回格式：xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
     */
    private async getRandomString(): Promise<string> {
        let resultStr = await AegisRandom.generatedRandomHex(4)
            + '-' + await AegisRandom.generatedRandomHex(2)
            + '-' + await AegisRandom.generatedRandomHex(2)
            + '-' + await AegisRandom.generatedRandomHex(2)
            + '-' + await AegisRandom.generatedRandomHex(6);
        return resultStr;
    }
}
