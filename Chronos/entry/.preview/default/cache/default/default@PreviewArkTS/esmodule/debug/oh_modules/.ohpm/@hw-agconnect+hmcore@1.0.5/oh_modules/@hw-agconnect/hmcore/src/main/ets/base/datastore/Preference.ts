import data_preferences from "@ohos:data.preferences";
import type common from "@ohos:app.ability.common";
import type { ICrypto } from '../crypto/ICrypto';
import { Logger } from "@normalized:N&&&@hw-agconnect/hmcore/src/main/ets/base/log/Logger&1.0.5";
export class Preferences {
    static async get(context: common.Context, fileName: string, key: string, crypto?: ICrypto): Promise<string> {
        try {
            let preferences = await data_preferences.getPreferences(context, fileName);
            let value = await preferences.get(key, '');
            if (crypto) {
                value = await crypto.decrypt(value as string);
            }
            return Promise.resolve(value as string);
        }
        catch (e) {
            // 使用新的鸿蒙版本有极低的概率解密老的数据失败，如果解密失败需要删除旧的缓存
            Logger.error('Preferences', 'decrypt data error.' + JSON.stringify(e));
            await this.delete(context, fileName, key);
            return Promise.resolve(null);
        }
    }
    static async put(context: common.Context, fileName: string, key: string, value: string, crypto?: ICrypto): Promise<boolean> {
        try {
            let preferences = await data_preferences.getPreferences(context, fileName);
            if (crypto) {
                value = await crypto.encrypt(value);
            }
            await preferences.put(key, value);
            await preferences.flush();
            return Promise.resolve(true);
        }
        catch (e) {
            Logger.error('Preferences', 'encrypt data error.' + JSON.stringify(e));
            return Promise.resolve(false);
        }
    }
    static async delete(context: common.Context, fileName: string, key: string): Promise<boolean> {
        try {
            let preferences = await data_preferences.getPreferences(context, fileName);
            await preferences.delete(key);
            await preferences.flush();
            return Promise.resolve(true);
        }
        catch (e) {
            Logger.error('Preferences', 'delete data error.' + JSON.stringify(e));
            return Promise.resolve(false);
        }
    }
}
