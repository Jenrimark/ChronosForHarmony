import { Bill, BillType, BillCategory } from '../model/Bill';
import { AIService } from '../service/AIService';
import { Constants } from '../common/Constants';
import { CategoryOption } from '../common/Types';

/**
 * 收入分类选项
 */
const INCOME_CATEGORIES: CategoryOption[] = [
  { cat: BillCategory.SALARY, name: '工资' },
  { cat: BillCategory.BONUS, name: '奖金' },
  { cat: BillCategory.INVESTMENT, name: '投资' },
  { cat: BillCategory.GIFT, name: '礼金' },
  { cat: BillCategory.OTHER_INCOME, name: '其他' }
];

/**
 * 支出分类选项
 */
const EXPENSE_CATEGORIES: CategoryOption[] = [
  { cat: BillCategory.FOOD, name: '餐饮' },
  { cat: BillCategory.TRANSPORT, name: '交通' },
  { cat: BillCategory.SHOPPING, name: '购物' },
  { cat: BillCategory.ENTERTAINMENT, name: '娱乐' },
  { cat: BillCategory.MEDICAL, name: '医疗' },
  { cat: BillCategory.EDUCATION, name: '教育' },
  { cat: BillCategory.HOUSING, name: '住房' },
  { cat: BillCategory.UTILITIES, name: '水电' },
  { cat: BillCategory.OTHER_EXPENSE, name: '其他' }
];

/**
 * 账单表单组件
 */
@Component
export struct BillForm {
  @Prop bill: Bill = new Bill();
  @Link onConfirm: number;
  @Link onCancel: number;
  
  @State showForm: boolean = true;
  @State inputText: string = '';
  @State selectedType: BillType = BillType.EXPENSE;
  @State selectedCategory: BillCategory = BillCategory.OTHER_EXPENSE;
  @State amount: number = 0;
  @State description: string = '';
  @State isRecognizing: boolean = false;

  private aiService: AIService = AIService.getInstance();

  aboutToAppear() {
    if (this.bill.id > 0) {
      // 编辑模式
      this.selectedType = this.bill.type;
      this.selectedCategory = this.bill.category;
      this.amount = this.bill.amount;
      this.description = this.bill.description;
      this.inputText = `${this.bill.description} ${this.bill.amount}元`;
    }
  }

  /**
   * AI智能识别
   */
  async recognizeInput(): Promise<void> {
    if (!this.inputText.trim()) {
      return;
    }

    this.isRecognizing = true;
    
    try {
      // 提取金额和描述
      const extracted = await this.aiService.extractBillInfo(this.inputText);
      
      if (extracted.amount !== undefined) {
        this.amount = extracted.amount;
      }
      
      if (extracted.description) {
        this.description = extracted.description;
      }
      
      // 识别类型和分类
      const recognized = await this.aiService.recognizeBill(
        this.description || this.inputText,
        this.amount
      );
      
      this.selectedType = recognized.type;
      this.selectedCategory = recognized.category;
    } catch (err) {
      console.error('AI识别失败:', err);
    } finally {
      this.isRecognizing = false;
    }
  }

  /**
   * 确认保存
   */
  confirm(): void {
    this.bill.type = this.selectedType;
    this.bill.category = this.selectedCategory;
    this.bill.amount = this.amount;
    this.bill.description = this.description;
    this.bill.date = new Date();
    
    this.onConfirm = 1;
  }

  /**
   * 取消
   */
  cancel(): void {
    this.onCancel = 1;
  }

  build() {
    Column() {
      Column() {
        Text(this.bill.id > 0 ? '编辑账单' : '添加账单')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .margin({ bottom: 16 })

        // AI输入框
        Column() {
          Text('智能输入（支持自然语言）')
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .alignSelf(ItemAlign.Start)
            .margin({ bottom: 8 })

          Row() {
            TextInput({ placeholder: '例如：午餐麻辣烫45.5元' })
              .layoutWeight(1)
              .height(40)
              .onChange((value: string) => {
                this.inputText = value;
              })

            Button('识别')
              .type(ButtonType.Normal)
              .fontSize(14)
              .height(40)
              .backgroundColor(Constants.COLOR_PRIMARY)
              .fontColor('#FFFFFF')
              .margin({ left: 8 })
              .enabled(!this.isRecognizing)
              .onClick(() => {
                this.recognizeInput();
              })
          }
          .width('100%')

          if (this.isRecognizing) {
            Text('AI识别中...')
              .fontSize(12)
              .fontColor(Constants.COLOR_PRIMARY)
              .margin({ top: 4 })
          }
        }
        .width('100%')
        .margin({ bottom: 16 })

        Divider()
          .color('#E5E5EA')
          .margin({ bottom: 16 })

        // 类型选择
        Column() {
          Text('类型')
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_PRIMARY)
            .alignSelf(ItemAlign.Start)
            .margin({ bottom: 8 })

          Row() {
            Button('支出')
              .type(ButtonType.Normal)
              .layoutWeight(1)
              .fontColor(
                this.selectedType === BillType.EXPENSE
                  ? Constants.COLOR_TEXT_ON_PRIMARY
                  : Constants.COLOR_TEXT_PRIMARY
              )
              .backgroundColor(
                this.selectedType === BillType.EXPENSE
                  ? Constants.COLOR_DANGER
                  : Constants.COLOR_CARD_BACKGROUND
              )
              .onClick(() => {
                this.selectedType = BillType.EXPENSE;
                if (this.selectedCategory === BillCategory.SALARY ||
                    this.selectedCategory === BillCategory.BONUS ||
                    this.selectedCategory === BillCategory.INVESTMENT ||
                    this.selectedCategory === BillCategory.GIFT ||
                    this.selectedCategory === BillCategory.OTHER_INCOME) {
                  this.selectedCategory = BillCategory.OTHER_EXPENSE;
                }
              })

            Button('收入')
              .type(ButtonType.Normal)
              .layoutWeight(1)
              .fontColor(
                this.selectedType === BillType.INCOME
                  ? Constants.COLOR_TEXT_ON_PRIMARY
                  : Constants.COLOR_TEXT_PRIMARY
              )
              .backgroundColor(
                this.selectedType === BillType.INCOME
                  ? Constants.COLOR_SUCCESS
                  : Constants.COLOR_CARD_BACKGROUND
              )
              .margin({ left: 8 })
              .onClick(() => {
                this.selectedType = BillType.INCOME;
                if (this.selectedCategory !== BillCategory.SALARY &&
                    this.selectedCategory !== BillCategory.BONUS &&
                    this.selectedCategory !== BillCategory.INVESTMENT &&
                    this.selectedCategory !== BillCategory.GIFT &&
                    this.selectedCategory !== BillCategory.OTHER_INCOME) {
                  this.selectedCategory = BillCategory.OTHER_INCOME;
                }
              })
          }
          .width('100%')
        }
        .width('100%')
        .margin({ bottom: 16 })

        // 分类选择
        Column() {
          Text('分类')
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_PRIMARY)
            .alignSelf(ItemAlign.Start)
            .margin({ bottom: 8 })

          this.buildCategorySelector()
        }
        .width('100%')
        .margin({ bottom: 16 })

        // 金额输入
        Column() {
          Text('金额')
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_PRIMARY)
            .alignSelf(ItemAlign.Start)
            .margin({ bottom: 8 })

          TextInput({ placeholder: '请输入金额', text: this.amount > 0 ? this.amount.toString() : '' })
            .width('100%')
            .height(40)
            .type(InputType.Number)
            .onChange((value: string) => {
              const num = parseFloat(value);
              if (!isNaN(num)) {
                this.amount = num;
              }
            })
        }
        .width('100%')
        .margin({ bottom: 16 })

        // 描述输入
        Column() {
          Text('描述')
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_PRIMARY)
            .alignSelf(ItemAlign.Start)
            .margin({ bottom: 8 })

          TextInput({ placeholder: '请输入描述', text: this.description })
            .width('100%')
            .height(60)
            .onChange((value: string) => {
              this.description = value;
            })
        }
        .width('100%')
        .margin({ bottom: 16 })

        // 按钮
        Row() {
          Button('取消')
            .type(ButtonType.Normal)
            .layoutWeight(1)
            .onClick(() => {
              this.cancel();
            })

          Button('确定')
            .type(ButtonType.Normal)
            .layoutWeight(1)
            .backgroundColor(Constants.COLOR_PRIMARY)
            .fontColor(Constants.COLOR_TEXT_ON_PRIMARY)
            .margin({ left: 8 })
            .onClick(() => {
              this.confirm();
            })
        }
        .width('100%')
      }
      .width('90%')
      .padding(24)
      .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
      .borderRadius(12)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('rgba(0, 0, 0, 0.5)')
    .justifyContent(FlexAlign.Center)
    .onClick(() => {
      this.cancel();
    })
  }

  /**
   * 获取当前分类列表
   */
  private getCategories(): CategoryOption[] {
    return this.selectedType === BillType.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  }

  @Builder
  buildCategorySelector() {
    Column() {
      Row() {
        ForEach(this.getCategories().slice(0, 3) as CategoryOption[], (item: CategoryOption) => {
          Button(item.name)
            .type(ButtonType.Normal)
            .layoutWeight(1)
            .fontSize(12)
            .fontColor(
              this.selectedCategory === item.cat
                ? Constants.COLOR_TEXT_ON_PRIMARY
                : Constants.COLOR_TEXT_PRIMARY
            )
            .backgroundColor(
              this.selectedCategory === item.cat
                ? Constants.COLOR_PRIMARY
                : Constants.COLOR_CARD_BACKGROUND
            )
            .padding({ left: 8, right: 8, top: 6, bottom: 6 })
            .margin({ right: 8 })
            .onClick(() => {
              this.selectedCategory = item.cat;
            })
        })
      }
      .width('100%')
      .margin({ bottom: 8 })

      if (this.getCategories().length > 3) {
        Row() {
          ForEach(this.getCategories().slice(3, 6) as CategoryOption[], (item: CategoryOption) => {
            Button(item.name)
              .type(ButtonType.Normal)
              .layoutWeight(1)
              .fontSize(12)
              .fontColor(
                this.selectedCategory === item.cat
                  ? '#FFFFFF'
                  : Constants.COLOR_TEXT_PRIMARY
              )
              .backgroundColor(
                this.selectedCategory === item.cat
                  ? Constants.COLOR_PRIMARY
                  : '#FFFFFF'
              )
              .padding({ left: 8, right: 8, top: 6, bottom: 6 })
              .margin({ right: 8 })
              .onClick(() => {
                this.selectedCategory = item.cat;
              })
          })
        }
        .width('100%')
        .margin({ bottom: 8 })
      }

      if (this.getCategories().length > 6) {
        Row() {
          ForEach(this.getCategories().slice(6) as CategoryOption[], (item: CategoryOption) => {
            Button(item.name)
              .type(ButtonType.Normal)
              .layoutWeight(1)
              .fontSize(12)
              .fontColor(
                this.selectedCategory === item.cat
                  ? '#FFFFFF'
                  : Constants.COLOR_TEXT_PRIMARY
              )
              .backgroundColor(
                this.selectedCategory === item.cat
                  ? Constants.COLOR_PRIMARY
                  : '#FFFFFF'
              )
              .padding({ left: 8, right: 8, top: 6, bottom: 6 })
              .margin({ right: 8 })
              .onClick(() => {
                this.selectedCategory = item.cat;
              })
          })
        }
        .width('100%')
      }
    }
    .width('100%')
  }
}

