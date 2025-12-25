import { BillItem } from '../components/BillItem';
import { BillService } from '../service/BillService';
import { Bill, BillType, BillCategory } from '../model/Bill';
import { Constants } from '../common/Constants';
import { Utils } from '../common/Utils';
import { MimoAIService, BillRecognitionResult } from '../service/MimoAIService';
import { AudioRecorderService } from '../service/AudioRecorderService';
import { SpeechRecognitionService } from '../service/SpeechRecognitionService';
import { common } from '@kit.AbilityKit';

/**
 * 账单分组接口
 */
interface BillGroup {
  date: string;
  bills: Bill[];
}

/**
 * AI记账页面 - 参考截图设计
 */
@Component
export struct Accounting {
  @State bills: Bill[] = [];
  @State todayBills: Bill[] = [];
  @State todayIncome: number = 0;
  @State todayExpense: number = 0;
  @State monthExpense: number = 0;
  @State monthIncome: number = 0;
  @State monthBalance: number = 0;
  
  // 输入栏相关状态
  @State showInputBar: boolean = false;
  @State inputText: string = '';
  @State isRecording: boolean = false;
  @State isProcessing: boolean = false;
  @State recordingDuration: number = 0; // 录音时长（秒）
  @State recordingTimer: number = 0; // 录音计时器ID
  @State isLongPressing: boolean = false; // 是否正在长按
  private longPressTimer: number = 0; // 长按计时器ID
  
  // 账单详情
  @State selectedBill: Bill | null = null;
  @State showBillDetail: boolean = false;
  
  // 历史账单分组数据
  @State historyBillGroups: BillGroup[] = [];

  private billService: BillService = BillService.getInstance();
  private aiService: MimoAIService = MimoAIService.getInstance();
  private audioRecorderService: AudioRecorderService = AudioRecorderService.getInstance();
  private speechRecognitionService: SpeechRecognitionService = SpeechRecognitionService.getInstance();

  aboutToAppear() {
    this.loadBills();
    this.loadStatistics();
    // 设置MIMO API Key（从配置中读取）
    // TODO: 从配置文件或用户设置中读取API Key
    const apiKey = Constants.MIMO_API_KEY;
    if (apiKey && apiKey.length > 0) {
      this.aiService.setApiKey(apiKey);
    }
    // 设置录音服务的上下文
    // 注意：getContext已废弃，这里暂时不设置context
    // 后续可以通过其他方式获取context，或者修改AudioRecorderService不需要context
    // this.audioRecorderService.setContext(context);
  }

  /**
   * 加载账单
   */
  async loadBills(): Promise<void> {
    const allBills = await this.billService.getAllBills();
    this.bills = [...allBills];
    
    // 筛选今天的账单
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.todayBills = allBills.filter(bill => {
      const billDate = new Date(bill.date);
      billDate.setHours(0, 0, 0, 0);
      return billDate.getTime() === today.getTime();
    });
    
    // 加载历史账单分组
    const historyBills = allBills.filter(bill => {
      const billDate = new Date(bill.date);
      billDate.setHours(0, 0, 0, 0);
      return billDate.getTime() < today.getTime();
    });
    this.historyBillGroups = this.groupBillsByDate(historyBills);
  }

  /**
   * 加载统计数据
   */
  async loadStatistics(): Promise<void> {
    const todayBills = await this.billService.getTodayBills();
    const monthBills = await this.billService.getMonthBills();
    
    this.todayIncome = this.billService.calculateIncome(todayBills);
    this.todayExpense = this.billService.calculateExpense(todayBills);
    this.monthIncome = this.billService.calculateIncome(monthBills);
    this.monthExpense = this.billService.calculateExpense(monthBills);
    this.monthBalance = this.monthIncome - this.monthExpense;
  }

  /**
   * 点击加号 - 展开输入栏
   */
  onAddButtonClick(): void {
    this.showInputBar = true;
    this.inputText = '';
  }

  /**
   * 长按加号 - 开始录音模式
   */
  async onAddButtonLongPress(): Promise<void> {
    try {
      // 检查权限
      const hasPermission = await this.audioRecorderService.checkPermission();
      if (!hasPermission) {
        console.error('没有麦克风权限');
        // TODO: 显示权限请求提示
        return;
      }

      // 初始化语音识别引擎
      try {
        await this.speechRecognitionService.initEngine();
      } catch (error) {
        console.error('初始化语音识别引擎失败:', error);
        // 即使识别引擎初始化失败，也继续录音流程
      }

      // 开始录音
      await this.audioRecorderService.startRecording();
    this.isRecording = true;
    this.showInputBar = true;
      this.recordingDuration = 0;
      
      // 开始语音识别
      try {
        await this.speechRecognitionService.startRecognition(
          (text: string) => {
            // 实时更新识别结果（中间结果）
            if (text && text.trim()) {
              this.inputText = text;
            }
          },
          (error: Error) => {
            console.error('语音识别错误:', error);
          }
        );
      } catch (error) {
        console.error('启动语音识别失败:', error);
        // 即使识别启动失败，也继续录音流程
      }
      
      // 开始计时
      this.startRecordingTimer();
      
      console.info('开始录音和语音识别...');
    } catch (error) {
      console.error('开始录音失败:', error);
      this.isRecording = false;
    }
  }

  /**
   * 开始录音计时
   */
  startRecordingTimer(): void {
    const timerId = setInterval(() => {
      this.recordingDuration++;
    }, 1000);
    // 将timer ID存储为number类型
    this.recordingTimer = timerId as number;
  }

  /**
   * 停止录音计时
   */
  stopRecordingTimer(): void {
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = 0;
    }
  }

  /**
   * 停止录音并识别
   */
  async stopRecording(): Promise<void> {
    try {
      // 停止录音
      const filePath = await this.audioRecorderService.stopRecording();
      this.isRecording = false;
      this.stopRecordingTimer();
      
      console.info('停止录音，文件路径:', filePath);
      
      // 结束语音识别并获取结果
      let recognitionText = '';
      try {
        recognitionText = await this.speechRecognitionService.finishRecognition();
        console.info('语音识别结果:', recognitionText);
      } catch (error) {
        console.error('获取语音识别结果失败:', error);
      }
      
      // 如果识别结果为空，使用时长作为提示
      if (!recognitionText || !recognitionText.trim()) {
        this.inputText = '录音内容：' + this.formatDuration(this.recordingDuration);
      } else {
        this.inputText = recognitionText;
      }
      
      // 自动发送识别
      await this.onSendInput();
      
      this.recordingDuration = 0;
    } catch (error) {
      console.error('停止录音失败:', error);
      this.isRecording = false;
      this.stopRecordingTimer();
      
      // 确保取消语音识别
      try {
        await this.speechRecognitionService.cancelRecognition();
      } catch (err) {
        console.error('取消语音识别失败:', err);
      }
    }
  }

  /**
   * 取消录音
   */
  async cancelRecording(): Promise<void> {
    try {
      await this.audioRecorderService.cancelRecording();
      
      // 取消语音识别
      try {
        await this.speechRecognitionService.cancelRecognition();
      } catch (error) {
        console.error('取消语音识别失败:', error);
      }
      
      this.isRecording = false;
      this.stopRecordingTimer();
      this.recordingDuration = 0;
      this.showInputBar = false;
      console.info('取消录音');
    } catch (error) {
      console.error('取消录音失败:', error);
    }
  }

  /**
   * 格式化录音时长
   */
  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * 发送输入文本到AI识别
   */
  async onSendInput(): Promise<void> {
    if (!this.inputText.trim()) {
      return;
    }

    this.isProcessing = true;
    
    try {
      // 调用MIMO AI识别账单
      const result: BillRecognitionResult = await this.aiService.recognizeBill(this.inputText);
      
      // 创建账单
      const bill = new Bill();
      bill.type = result.type;
      bill.category = result.category;
      bill.amount = result.amount || 0;
      bill.description = result.description || this.inputText;
      bill.date = new Date();
      
      // 保存账单
      await this.billService.createBill(bill);
      
      // 刷新数据
      await this.loadBills();
      await this.loadStatistics();
      
      // 清空输入
      this.inputText = '';
      this.showInputBar = false;
    } catch (error) {
      console.error('AI识别失败:', error);
      // TODO: 显示错误提示
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * 关闭输入栏
   */
  async onCloseInputBar(): Promise<void> {
    // 如果正在录音，先取消录音
    if (this.isRecording) {
      await this.cancelRecording();
    }
    this.showInputBar = false;
    this.inputText = '';
    this.isRecording = false;
    this.stopRecordingTimer();
    this.recordingDuration = 0;
  }

  /**
   * 点击账单查看详情
   */
  onBillTap(bill: Bill): void {
    this.selectedBill = bill;
    this.showBillDetail = true;
  }

  build() {
    Stack() {
      Column() {
        // 顶部统计卡片
        this.buildSummaryCard()
        
        // 今天的账单列表
        this.buildTodayBillsList()
        
        // 历史账单列表
        this.buildHistoryBillsList()
      }
      .width('100%')
      .flexGrow(1)
      .backgroundColor(Constants.COLOR_BACKGROUND)

      // 右下角加号按钮
      this.buildAddButton()

      // 输入栏遮罩层和输入栏（点击加号时显示）
      if (this.showInputBar) {
        // 半透明遮罩层
        Column()
          .width('100%')
          .height('100%')
          .backgroundColor('#000000')
          .opacity(0.3)
          .onClick(() => {
            this.onCloseInputBar();
          })

        // 输入栏
        this.buildInputBar()
      }

      // 账单详情弹窗
      if (this.showBillDetail && this.selectedBill) {
        this.buildBillDetail()
      }
    }
    .width('100%')
    .height('100%')
  }

  /**
   * 构建顶部统计卡片
   */
  @Builder
  buildSummaryCard() {
    Column() {
      // 12月支出标题
      Row() {
        Text('12月支出')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
        
        Blank()
        
        Text('👁')
          .fontSize(20)
      }
      .width('100%')
      .margin({ bottom: 16 })

      // 支出金额
      Text(`¥${this.monthExpense.toFixed(2)}`)
        .fontSize(36)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT_PRIMARY)
        .margin({ bottom: 16 })

      // 收入和结余
      Row() {
        Column() {
          Text('收入')
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
          Text(`¥${this.monthIncome.toFixed(2)}`)
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_SUCCESS)
            .margin({ top: 6 })
        }
        .alignItems(HorizontalAlign.Start)

        Blank()

        Column() {
          Text('结余')
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
          Text(`¥${this.monthBalance.toFixed(2)}`)
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_PRIMARY)
            .margin({ top: 6 })
        }
        .alignItems(HorizontalAlign.End)
      }
      .width('100%')
      .margin({ bottom: 20 })

      // 月预算进度条
      Row() {
        Text('月预算66%')
          .fontSize(13)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
        
        Blank()
        
        Text('剩余 ¥407.25')
          .fontSize(13)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
      }
      .width('100%')
      .margin({ bottom: 10 })

      // 进度条（使用Row模拟）
      Row() {
        Row()
          .width('66%')
          .height(8)
          .backgroundColor(Constants.COLOR_PRIMARY)
          .borderRadius(4)
      }
      .width('100%')
      .height(8)
      .backgroundColor(Constants.COLOR_BORDER)
      .borderRadius(4)
    }
    .width('100%')
    .padding(24)
    .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
    .borderRadius(16)
    .margin({ top: 16, left: 16, right: 16, bottom: 12 })
    .shadow({
      radius: 12,
      color: 'rgba(0, 0, 0, 0.06)',
      offsetX: 0,
      offsetY: 4
    })
  }

  /**
   * 构建今天的账单列表
   */
  @Builder
  buildTodayBillsList() {
    Column() {
      // 标题
      Row() {
        Text(`今天 ${Utils.formatDate(new Date(), 'MM月DD日')} (${this.getWeekDay()})`)
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
        
        Blank()
        
        Text('>')
          .fontSize(16)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 12, bottom: 8 })

      // 今日统计
      Text(`支出¥${this.todayExpense.toFixed(2)} | 收入¥${this.todayIncome.toFixed(2)}`)
        .fontSize(14)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .padding({ left: 16, right: 16, bottom: 12 })

      // 账单列表
      if (this.todayBills.length === 0) {
        Column() {
          Text('今天还没有账单')
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
        }
        .width('100%')
        .padding(20)
      } else {
        Column() {
          ForEach(this.todayBills, (bill: Bill) => {
            this.buildBillItem(bill)
          })
        }
        .width('100%')
        .padding({ left: 16, right: 16 })
      }
    }
    .width('100%')
    .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
    .borderRadius(12)
    .margin({ left: 16, right: 16, bottom: 12 })
  }

  /**
   * 构建历史账单列表
   */
  @Builder
  buildHistoryBillsList() {
    if (this.historyBillGroups.length > 0) {
      Column() {
        ForEach(this.historyBillGroups, (group: BillGroup) => {
          Column() {
            // 日期标题
            Row() {
              Text(group.date)
                .fontSize(14)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
              
              Blank()
              
              Text('>')
                .fontSize(14)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
            }
            .width('100%')
            .padding({ left: 16, right: 16, top: 12, bottom: 8 })

            // 该日期的账单
            Column() {
              ForEach(group.bills, (bill: Bill) => {
                this.buildBillItem(bill)
              })
            }
            .width('100%')
            .padding({ left: 16, right: 16, bottom: 8 })
          }
          .width('100%')
          .backgroundColor('#FFFFFF')
          .borderRadius(12)
          .margin({ left: 16, right: 16, bottom: 12 })
        })
      }
      .width('100%')
    }
  }

  /**
   * 构建单个账单项
   */
  @Builder
  buildBillItem(bill: Bill) {
    Row() {
      // 时间
      Text(Utils.formatDate(bill.date, 'HH:mm'))
        .fontSize(14)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .width(50)

      // 分类图标和名称
      Row() {
        // 图标背景圆
        Column() {
          Text(this.getCategoryIcon(bill.category))
            .fontSize(18)
        }
        .width(36)
        .height(36)
        .backgroundColor(bill.isIncome() ? 'rgba(255, 167, 38, 0.15)' : 'rgba(255, 107, 53, 0.1)')
        .borderRadius(18)
        .justifyContent(FlexAlign.Center)
        
        Text(this.getCategoryName(bill.category))
          .fontSize(15)
          .fontWeight(FontWeight.Medium)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
          .margin({ left: 10 })
      }
      .layoutWeight(1)
      .margin({ left: 12 })

      // 金额
      Text(bill.getDisplayAmount())
        .fontSize(17)
        .fontWeight(FontWeight.Bold)
        .fontColor(
          bill.isIncome() ? Constants.COLOR_SUCCESS : Constants.COLOR_DANGER
        )
    }
    .width('100%')
    .padding({ top: 14, bottom: 14, left: 12, right: 12 })
    .backgroundColor(Constants.COLOR_BACKGROUND)
    .borderRadius(12)
    .margin({ bottom: 10 })
    .onClick(() => {
      this.onBillTap(bill);
    })
  }

  /**
   * 构建加号按钮
   */
  @Builder
  buildAddButton() {
    Button('+')
      .type(ButtonType.Circle)
      .width(60)
      .height(60)
      .fontSize(36)
      .fontWeight(FontWeight.Medium)
      .fontColor(Constants.COLOR_TEXT_ON_PRIMARY)
      .backgroundColor(this.isRecording ? Constants.COLOR_DANGER : Constants.COLOR_PRIMARY)
      .shadow({
        radius: 12,
        color: this.isRecording ? 'rgba(230, 81, 0, 0.4)' : 'rgba(255, 107, 53, 0.4)',
        offsetX: 0,
        offsetY: 4
      })
      .position({ x: '100%', y: '100%' })
      .translate({ x: -76, y: -76 })
      .zIndex(20)
      .onClick(() => {
        if (this.isRecording) {
          // 如果正在录音，点击停止录音
          this.stopRecording();
        } else if (!this.isLongPressing) {
          // 如果不是长按，展开输入栏
        this.onAddButtonClick();
        }
        // 重置长按状态
        this.isLongPressing = false;
      })
      .onTouch((event) => {
        // 使用事件对象的type属性，不导入类型
        if (event.type === 0 && !this.isRecording) { // 0 表示 Down
          // 开始长按计时
          const timerId = setTimeout(() => {
            this.isLongPressing = true;
            this.onAddButtonLongPress();
          }, 500);
          this.longPressTimer = timerId as number;
        } else if (event.type === 1 || event.type === 3) { // 1 表示 Up, 3 表示 Cancel
          // 取消长按计时
          if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = 0;
          }
          this.isLongPressing = false;
        }
      })
  }

  /**
   * 构建输入栏
   */
  @Builder
  buildInputBar() {
    Column() {
      // 录音状态显示
      if (this.isRecording) {
        Row() {
          // 录音动画指示器
          Column() {
            Text('●')
              .fontSize(20)
              .fontColor(Constants.COLOR_DANGER)
          }
          .width(24)
          .height(24)
          .justifyContent(FlexAlign.Center)
          .animation({
            iterations: -1,
            duration: 1000,
            curve: Curve.EaseInOut
          })

          // 录音时长
          Text(`录音中 ${this.formatDuration(this.recordingDuration)}`)
            .fontSize(15)
            .fontWeight(FontWeight.Medium)
            .fontColor(Constants.COLOR_DANGER)
            .margin({ left: 10 })

          Blank()

          // 停止录音按钮
          Button('停止')
            .type(ButtonType.Normal)
            .height(36)
            .fontSize(14)
            .fontWeight(FontWeight.Medium)
            .backgroundColor(Constants.COLOR_DANGER)
            .fontColor('#FFFFFF')
            .borderRadius(18)
            .padding({ left: 16, right: 16 })
            .margin({ left: 8 })
            .onClick(() => {
              this.stopRecording();
            })
        }
        .width('100%')
        .padding(14)
        .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
        .borderRadius(12)
        .margin({ bottom: 10 })
      }

      Row() {
        // 输入框
        TextInput({ 
          placeholder: this.isRecording ? '正在录音...' : '输入账单描述，如：午餐15元',
          text: this.inputText
        })
          .layoutWeight(1)
          .height(44)
          .fontSize(15)
          .backgroundColor(Constants.COLOR_BACKGROUND)
          .borderRadius(22)
          .padding({ left: 16, right: 16 })
          .enabled(!this.isRecording)
          .onChange((value: string) => {
            this.inputText = value;
          })

        // 发送按钮
        Button('发送')
          .type(ButtonType.Normal)
          .height(44)
          .fontSize(15)
          .fontWeight(FontWeight.Medium)
          .backgroundColor(Constants.COLOR_PRIMARY)
          .fontColor(Constants.COLOR_TEXT_ON_PRIMARY)
          .borderRadius(22)
          .padding({ left: 20, right: 20 })
          .margin({ left: 10 })
          .shadow({
            radius: 6,
            color: 'rgba(255, 107, 53, 0.3)',
            offsetX: 0,
            offsetY: 2
          })
          .enabled(!this.isProcessing && !this.isRecording && this.inputText.trim().length > 0)
          .onClick(() => {
            this.onSendInput();
          })

        // 关闭按钮
        Button('×')
          .type(ButtonType.Circle)
          .fontSize(20)
          .backgroundColor(Constants.COLOR_BACKGROUND)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .width(36)
          .height(36)
          .margin({ left: 10 })
          .onClick(() => {
            this.onCloseInputBar();
          })
      }
      .width('100%')
      .padding(14)
      .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
      .borderRadius(16)
    }
    .width('100%')
    .padding({ left: 16, right: 16, top: 16, bottom: 16 })
    .backgroundColor(Constants.COLOR_BACKGROUND_SECONDARY)
    .borderRadius({ topLeft: 20, topRight: 20 })
    .alignItems(HorizontalAlign.Start)
    .position({ x: 0, y: '100%' })
    .translate({ y: this.isRecording ? -200 : -140 })
    .zIndex(100)
    .shadow({
      radius: 16,
      color: 'rgba(0, 0, 0, 0.1)',
      offsetX: 0,
      offsetY: -4
    })
  }

  /**
   * 构建账单详情
   */
  @Builder
  buildBillDetail() {
    if (this.selectedBill !== null) {
      Column() {
        // 半透明背景
        Column()
          .width('100%')
          .height('100%')
          .backgroundColor('#000000')
          .opacity(0.5)
          .onClick(() => {
            this.showBillDetail = false;
            this.selectedBill = null;
          })
      }
      .width('100%')
      .height('100%')
      .position({ x: 0, y: 0 })
      .zIndex(200)

      Column() {
        // 详情内容
        Column() {
          Text('账单详情')
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT_PRIMARY)
            .margin({ bottom: 24 })

          // 金额显示
          Column() {
            Text(this.selectedBill.getDisplayAmount())
              .fontSize(36)
              .fontWeight(FontWeight.Bold)
              .fontColor(
                this.selectedBill.isIncome() ? Constants.COLOR_SUCCESS : Constants.COLOR_DANGER
              )
          }
          .width('100%')
          .padding(20)
          .backgroundColor(this.selectedBill.isIncome() ? 'rgba(255, 167, 38, 0.1)' : 'rgba(255, 107, 53, 0.08)')
          .borderRadius(12)
          .margin({ bottom: 20 })

          // 分类
          Row() {
            Text('分类')
              .fontSize(15)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
            Blank()
            Row() {
              Text(this.getCategoryIcon(this.selectedBill.category))
                .fontSize(16)
              Text(this.getCategoryName(this.selectedBill.category))
                .fontSize(15)
                .fontWeight(FontWeight.Medium)
                .fontColor(Constants.COLOR_TEXT_PRIMARY)
                .margin({ left: 6 })
            }
          }
          .width('100%')
          .padding({ top: 14, bottom: 14 })
          .borderWidth({ bottom: 1 })
          .borderColor(Constants.COLOR_DIVIDER)

          // 描述
          if (this.selectedBill.description) {
            Row() {
              Text('描述')
                .fontSize(15)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
              Blank()
              Text(this.selectedBill.description)
                .fontSize(15)
                .fontColor(Constants.COLOR_TEXT_PRIMARY)
            }
            .width('100%')
            .padding({ top: 14, bottom: 14 })
            .borderWidth({ bottom: 1 })
            .borderColor(Constants.COLOR_DIVIDER)
          }

          // 时间
          Row() {
            Text('时间')
              .fontSize(15)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
            Blank()
            Text(Utils.formatDate(this.selectedBill.date, Constants.DATETIME_FORMAT))
              .fontSize(15)
              .fontColor(Constants.COLOR_TEXT_PRIMARY)
          }
          .width('100%')
          .padding({ top: 14, bottom: 14 })
        }
        .width('100%')
        .padding(24)
        .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
        .borderRadius(20)

        // 关闭按钮
        Button('关闭')
          .type(ButtonType.Normal)
          .width('100%')
          .height(50)
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .backgroundColor(Constants.COLOR_PRIMARY)
          .fontColor(Constants.COLOR_TEXT_ON_PRIMARY)
          .borderRadius(25)
          .margin({ top: 16 })
          .shadow({
            radius: 8,
            color: 'rgba(255, 107, 53, 0.3)',
            offsetX: 0,
            offsetY: 2
          })
          .onClick(() => {
            this.showBillDetail = false;
            this.selectedBill = null;
          })
      }
      .width('90%')
      .padding(20)
      .position({ x: '5%', y: '20%' })
      .zIndex(201)
    }
  }

  /**
   * 获取分类图标
   */
  private getCategoryIcon(category: BillCategory): string {
    if (category === BillCategory.FOOD) {
      return '🍔';
    } else if (category === BillCategory.TRANSPORT) {
      return '🚗';
    } else if (category === BillCategory.SHOPPING) {
      return '🛍️';
    } else if (category === BillCategory.ENTERTAINMENT) {
      return '🎬';
    } else if (category === BillCategory.MEDICAL) {
      return '🏥';
    } else if (category === BillCategory.EDUCATION) {
      return '📚';
    } else if (category === BillCategory.HOUSING) {
      return '🏠';
    } else if (category === BillCategory.UTILITIES) {
      return '💡';
    } else if (category === BillCategory.SALARY) {
      return '💰';
    } else if (category === BillCategory.BONUS) {
      return '🎁';
    } else if (category === BillCategory.INVESTMENT) {
      return '📈';
    } else if (category === BillCategory.GIFT) {
      return '🎁';
    } else {
      return '📝';
    }
  }

  /**
   * 获取分类名称
   */
  private getCategoryName(category: BillCategory): string {
    if (category === BillCategory.FOOD) {
      return '餐饮';
    } else if (category === BillCategory.TRANSPORT) {
      return '交通';
    } else if (category === BillCategory.SHOPPING) {
      return '购物';
    } else if (category === BillCategory.ENTERTAINMENT) {
      return '娱乐';
    } else if (category === BillCategory.MEDICAL) {
      return '医疗';
    } else if (category === BillCategory.EDUCATION) {
      return '教育';
    } else if (category === BillCategory.HOUSING) {
      return '住房';
    } else if (category === BillCategory.UTILITIES) {
      return '水电';
    } else if (category === BillCategory.SALARY) {
      return '工资';
    } else if (category === BillCategory.BONUS) {
      return '奖金';
    } else if (category === BillCategory.INVESTMENT) {
      return '投资';
    } else if (category === BillCategory.GIFT) {
      return '礼金';
    } else if (category === BillCategory.OTHER_EXPENSE) {
      return '其他支出';
    } else if (category === BillCategory.OTHER_INCOME) {
      return '其他收入';
    } else {
      return '其他';
    }
  }

  /**
   * 获取星期几
   */
  private getWeekDay(): string {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[new Date().getDay()];
  }

  /**
   * 按日期分组账单
   */
  private groupBillsByDate(bills: Bill[]): BillGroup[] {
    const groups: Map<string, Bill[]> = new Map();
    
    bills.forEach(bill => {
      const dateStr = Utils.formatDate(bill.date, 'MM月DD日');
      if (!groups.has(dateStr)) {
        groups.set(dateStr, []);
      }
      groups.get(dateStr)?.push(bill);
    });

    const result: BillGroup[] = [];
    groups.forEach((bills, date) => {
      const group: BillGroup = {
        date: date,
        bills: bills
      };
      result.push(group);
    });

    // 按日期倒序排列
    result.sort((a: BillGroup, b: BillGroup): number => {
      return b.date.localeCompare(a.date);
    });

    return result;
  }
}