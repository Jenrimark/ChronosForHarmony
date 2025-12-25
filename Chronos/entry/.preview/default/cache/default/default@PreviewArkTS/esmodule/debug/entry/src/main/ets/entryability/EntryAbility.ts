import type AbilityConstant from "@ohos:app.ability.AbilityConstant";
import ConfigurationConstant from "@ohos:app.ability.ConfigurationConstant";
import UIAbility from "@ohos:app.ability.UIAbility";
import type Want from "@ohos:app.ability.Want";
import hilog from "@ohos:hilog";
import type window from "@ohos:window";
import { initialize } from "@normalized:N&&&@hw-agconnect/hmcore/index&1.0.5";
import cloudCommon from "@hms:core.deviceCloudGateway.cloudCommon";
import util from "@ohos:util";
import type { BusinessError as BusinessError } from "@ohos:base";
const DOMAIN = 0x0000;
export default class EntryAbility extends UIAbility {
    async onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): Promise<void> {
        try {
            this.context.getApplicationContext().setColorMode(ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET);
        }
        catch (err) {
            hilog.error(DOMAIN, 'testTag', 'Failed to set colorMode. Cause: %{public}s', JSON.stringify(err));
        }
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onCreate');
        // 初始化AGC SDK（按照官方文档规范）
        await this.initAGC();
    }
    /**
     * 初始化AGC SDK
     * 按照官方文档：读取agconnect-services.json并初始化
     */
    private async initAGC(): Promise<void> {
        try {
            // 读取agconnect-services.json文件
            const resourceManager = this.context.resourceManager;
            const rawFileContent = await resourceManager.getRawFileContent('agconnect-services.json');
            // 将ArrayBuffer转换为Uint8Array
            const uint8Array: Uint8Array = new Uint8Array(rawFileContent);
            // 使用TextDecoder解码
            const decoder: util.TextDecoder = util.TextDecoder.create('utf-8');
            const jsonString: string = decoder.decodeToString(uint8Array);
            // 初始化AGC SDK (使用 @hw-agconnect/hmcore)
            const config: any = JSON.parse(jsonString) as any;
            initialize(this.context, config);
            hilog.info(DOMAIN, 'testTag', 'AGC hmcore SDK初始化成功');
            // 同时初始化 CloudFoundationKit (使用 @kit.CloudFoundationKit)
            // 根据官方文档，cloudCommon.init() 用于需要登录的场景
            try {
                cloudCommon.init();
                hilog.info(DOMAIN, 'testTag', 'CloudFoundationKit初始化成功');
            }
            catch (cloudErr) {
                hilog.warn(DOMAIN, 'testTag', 'CloudFoundationKit初始化: %{public}s', JSON.stringify(cloudErr));
            }
        }
        catch (err) {
            hilog.error(DOMAIN, 'testTag', 'AGC SDK初始化失败: %{public}s', JSON.stringify(err));
        }
    }
    onDestroy(): void {
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onDestroy');
    }
    onWindowStageCreate(windowStage: window.WindowStage): void {
        // Main window is created, set main page for this ability
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onWindowStageCreate');
        windowStage.loadContent('pages/Main', (err: BusinessError) => {
            if (err.code) {
                hilog.error(DOMAIN, 'testTag', 'Failed to load the content. Cause: %{public}s', JSON.stringify(err));
                return;
            }
            hilog.info(DOMAIN, 'testTag', 'Succeeded in loading the content.');
        });
    }
    onWindowStageDestroy(): void {
        // Main window is destroyed, release UI related resources
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onWindowStageDestroy');
    }
    onForeground(): void {
        // Ability has brought to foreground
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onForeground');
    }
    onBackground(): void {
        // Ability has back to background
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onBackground');
    }
}
