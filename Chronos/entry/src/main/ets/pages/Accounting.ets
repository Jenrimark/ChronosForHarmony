import { BillItem } from '../components/BillItem';
import { BillService } from '../service/BillService';
import { Bill, BillType, BillCategory } from '../model/Bill';
import { Constants } from '../common/Constants';
import { Utils } from '../common/Utils';
import { MimoAIService, BillRecognitionResult } from '../service/MimoAIService';

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
  
  // 账单详情
  @State selectedBill: Bill | null = null;
  @State showBillDetail: boolean = false;
  
  // 历史账单分组数据
  @State historyBillGroups: BillGroup[] = [];

  private billService: BillService = BillService.getInstance();
  private aiService: MimoAIService = MimoAIService.getInstance();

  aboutToAppear() {
    this.loadBills();
    this.loadStatistics();
    // 设置MIMO API Key（从配置中读取）
    // TODO: 从配置文件或用户设置中读取API Key
    const apiKey = Constants.MIMO_API_KEY;
    if (apiKey && apiKey.length > 0) {
      this.aiService.setApiKey(apiKey);
    }
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
  onAddButtonLongPress(): void {
    this.isRecording = true;
    this.showInputBar = true;
    // TODO: 实现录音功能
    console.info('开始录音...');
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
  onCloseInputBar(): void {
    this.showInputBar = false;
    this.inputText = '';
    this.isRecording = false;
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

      // 输入栏（点击加号时显示）
      if (this.showInputBar) {
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
        .fontSize(32)
        .fontWeight(FontWeight.Bold)
        .fontColor(Constants.COLOR_TEXT_PRIMARY)
        .margin({ bottom: 12 })

      // 收入和结余
      Row() {
        Column() {
          Text('收入')
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
          Text(`¥${this.monthIncome.toFixed(2)}`)
            .fontSize(18)
            .fontWeight(FontWeight.Medium)
            .fontColor(Constants.COLOR_SUCCESS)
            .margin({ top: 4 })
        }
        .alignItems(HorizontalAlign.Start)

        Blank()

        Column() {
          Text('结余')
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
          Text(`¥${this.monthBalance.toFixed(2)}`)
            .fontSize(18)
            .fontWeight(FontWeight.Medium)
            .fontColor(Constants.COLOR_PRIMARY)
            .margin({ top: 4 })
        }
        .alignItems(HorizontalAlign.End)
      }
      .width('100%')
      .margin({ bottom: 16 })

      // 月预算进度条
      Row() {
        Text('月预算66%')
          .fontSize(12)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
        
        Blank()
        
        Text('剩余 ¥407.25')
          .fontSize(12)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
      }
      .width('100%')
      .margin({ bottom: 8 })

      // 进度条（使用Row模拟）
      Row() {
        Row()
          .width('66%')
          .height(6)
          .backgroundColor(Constants.COLOR_PRIMARY)
          .borderRadius(3)
      }
      .width('100%')
      .height(6)
      .backgroundColor(Constants.COLOR_BORDER)
      .borderRadius(3)
    }
    .width('100%')
    .padding(20)
    .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
    .borderRadius(12)
    .margin({ top: 16, left: 16, right: 16, bottom: 12 })
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
        Text(this.getCategoryIcon(bill.category))
          .fontSize(20)
        Text(this.getCategoryName(bill.category))
          .fontSize(16)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
          .margin({ left: 8 })
      }
      .layoutWeight(1)
      .margin({ left: 12 })

      // 金额
      Text(bill.getDisplayAmount())
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(
          bill.isIncome() ? Constants.COLOR_SUCCESS : Constants.COLOR_DANGER
        )
    }
    .width('100%')
    .padding(12)
    .backgroundColor(Constants.COLOR_BACKGROUND_SECONDARY)
    .borderRadius(8)
    .margin({ bottom: 8 })
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
      .width(56)
      .height(56)
      .fontSize(32)
      .fontColor(Constants.COLOR_TEXT_ON_PRIMARY)
      .backgroundColor(Constants.COLOR_PRIMARY)
      .position({ x: '100%', y: '100%' })
      .margin({ right: 16, bottom: 16 })
      .onClick(() => {
        this.onAddButtonClick();
      })
  }

  /**
   * 构建输入栏
   */
  @Builder
  buildInputBar() {
    Column() {
      Row() {
        // 输入框
        TextInput({ placeholder: this.isRecording ? '正在录音...' : '输入账单描述，如：午餐15元' })
          .layoutWeight(1)
          .fontSize(16)
          .onChange((value: string) => {
            this.inputText = value;
          })

        // 发送按钮
        Button('发送')
          .type(ButtonType.Normal)
          .fontSize(14)
          .backgroundColor(Constants.COLOR_PRIMARY)
          .fontColor(Constants.COLOR_TEXT_ON_PRIMARY)
          .margin({ left: 8 })
          .enabled(!this.isProcessing && this.inputText.trim().length > 0)
          .onClick(() => {
            this.onSendInput();
          })

        // 关闭按钮
        Button('×')
          .type(ButtonType.Normal)
          .fontSize(20)
          .backgroundColor(Constants.COLOR_BORDER)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
          .width(32)
          .height(32)
          .margin({ left: 8 })
          .onClick(() => {
            this.onCloseInputBar();
          })
      }
      .width('100%')
      .padding(12)
      .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
      .borderRadius(8)
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Constants.COLOR_BACKGROUND_SECONDARY)
    .position({ x: 0, y: '100%' })
    .translate({ y: -80 })
  }

  /**
   * 构建账单详情
   */
  @Builder
  buildBillDetail() {
    if (this.selectedBill !== null) {
      Column() {
        // 详情内容
        Column() {
          Text('账单详情')
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .margin({ bottom: 20 })

          Row() {
            Text('金额：')
            Text(this.selectedBill.getDisplayAmount())
              .fontSize(20)
              .fontWeight(FontWeight.Bold)
              .fontColor(
                this.selectedBill.isIncome() ? Constants.COLOR_SUCCESS : Constants.COLOR_DANGER
              )
          }
          .width('100%')
          .margin({ bottom: 12 })

          Row() {
            Text('分类：')
            Text(this.getCategoryName(this.selectedBill.category))
          }
          .width('100%')
          .margin({ bottom: 12 })

          if (this.selectedBill.description) {
            Row() {
              Text('描述：')
              Text(this.selectedBill.description)
            }
            .width('100%')
            .margin({ bottom: 12 })
          }

          Row() {
            Text('时间：')
            Text(Utils.formatDate(this.selectedBill.date, Constants.DATETIME_FORMAT))
          }
          .width('100%')
        }
        .width('100%')
        .padding(20)
        .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
        .borderRadius(12)

        // 关闭按钮
        Button('关闭')
          .type(ButtonType.Normal)
          .width('100%')
          .margin({ top: 12 })
          .onClick(() => {
            this.showBillDetail = false;
            this.selectedBill = null;
          })
      }
      .width('90%')
      .padding(20)
      .backgroundColor(Constants.COLOR_BACKGROUND)
      .borderRadius(16)
      .position({ x: '5%', y: '20%' })
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