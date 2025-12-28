import { AbilityConstant, ConfigurationConstant, UIAbility, Want } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { window } from '@kit.ArkUI';
import { initialize } from '@hw-agconnect/hmcore';
import { cloudCommon } from '@kit.CloudFoundationKit';
import util from '@ohos.util';
import { BusinessError } from '@kit.BasicServicesKit';
import { HolidayService } from '../service/HolidayService';
import { EventService } from '../service/EventService';
import { AuthService } from '../service/AuthService';
import { LocalDBService } from '../service/LocalDBService';
import { SyncService } from '../service/SyncService';

const DOMAIN = 0x0000;
const TAG = 'EntryAbility';

export default class EntryAbility extends UIAbility {
  async onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): Promise<void> {
    try {
      this.context.getApplicationContext().setColorMode(ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET);
    } catch (err) {
      hilog.error(DOMAIN, TAG, 'Failed to set colorMode. Cause: %{public}s', JSON.stringify(err));
    }
    hilog.info(DOMAIN, TAG, '%{public}s', 'Ability onCreate');
    
    // 首先初始化AGC SDK（必须在其他AGC服务之前）
    await this.initAGC();
    
    // 初始化HolidayService的Context（用于读取本地万年历数据）
    await HolidayService.getInstance().setContext(this.context);
    hilog.info(DOMAIN, TAG, 'HolidayService Context已设置');
    
    // 初始化EventService（日程服务）
    const eventService = EventService.getInstance();
    eventService.setContext(this.context);
    await eventService.initialize();
    hilog.info(DOMAIN, TAG, 'EventService 初始化完成');
    
    // 初始化AuthService的Context（异步初始化Preferences）
    // 注意：必须在 AGC SDK 初始化之后
    await AuthService.getInstance().setContext(this.context);
    hilog.info(DOMAIN, TAG, 'AuthService Context已设置');
    
    // 初始化本地数据库服务（离线优先模式）
    const localDB = LocalDBService.getInstance();
    localDB.setContext(this.context);
    await localDB.init();
    hilog.info(DOMAIN, TAG, 'LocalDBService 初始化完成');
    
    // 初始化同步服务
    const syncService = SyncService.getInstance();
    await syncService.init();
    hilog.info(DOMAIN, TAG, 'SyncService 初始化完成');
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
      const config: ESObject = JSON.parse(jsonString) as ESObject;
      initialize(this.context, config);
      hilog.info(DOMAIN, TAG, 'AGC hmcore SDK初始化成功');
      
      // 初始化 CloudFoundationKit
      // 注意：根据权限设置，写入数据需要用户登录
      try {
        // 初始化云服务
        cloudCommon.init();
        hilog.info(DOMAIN, TAG, 'CloudFoundationKit初始化成功');
      } catch (cloudErr) {
        hilog.warn(DOMAIN, TAG, 'CloudFoundationKit初始化: %{public}s', JSON.stringify(cloudErr));
      }
    } catch (err) {
      hilog.error(DOMAIN, TAG, 'AGC SDK初始化失败: %{public}s', JSON.stringify(err));
    }
  }

  onDestroy(): void {
    hilog.info(DOMAIN, TAG, '%{public}s', 'Ability onDestroy');
  }

  onWindowStageCreate(windowStage: window.WindowStage): void {
    // Main window is created, set main page for this ability
    hilog.info(DOMAIN, TAG, '%{public}s', 'Ability onWindowStageCreate');

    windowStage.loadContent('pages/Main', (err: BusinessError) => {
      if (err.code) {
        hilog.error(DOMAIN, TAG, 'Failed to load the content. Cause: %{public}s', JSON.stringify(err));
        return;
      }
      hilog.info(DOMAIN, TAG, 'Succeeded in loading the content.');
    });
  }

  onWindowStageDestroy(): void {
    // Main window is destroyed, release UI related resources
    hilog.info(DOMAIN, TAG, '%{public}s', 'Ability onWindowStageDestroy');
  }

  onForeground(): void {
    // Ability has brought to foreground
    hilog.info(DOMAIN, TAG, '%{public}s', 'Ability onForeground');
  }

  onBackground(): void {
    // Ability has back to background
    hilog.info(DOMAIN, TAG, '%{public}s', 'Ability onBackground');
  }
}