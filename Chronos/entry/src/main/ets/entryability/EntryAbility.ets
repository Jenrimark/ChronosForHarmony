import { AbilityConstant, ConfigurationConstant, UIAbility, Want } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { window } from '@kit.ArkUI';
import { initialize } from '@hw-agconnect/hmcore';
import util from '@ohos.util';
import { BusinessError } from '@kit.BasicServicesKit';

const DOMAIN = 0x0000;

export default class EntryAbility extends UIAbility {
  async onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): Promise<void> {
    try {
      this.context.getApplicationContext().setColorMode(ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET);
    } catch (err) {
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
      
      // 初始化AGC SDK
      const config: ESObject = JSON.parse(jsonString) as ESObject;
      initialize(this.context, config);
      hilog.info(DOMAIN, 'testTag', 'AGC SDK初始化成功');
    } catch (err) {
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