import { Bill, BillType, BillCategory } from '../model/Bill';
import { Constants } from '../common/Constants';
import { promptAction } from '@kit.ArkUI';

/**
 * 分类项接口
 */
interface CategoryItem {
  category: BillCategory;
  icon: string;
  name: string;
}

/**
 * 手动记账弹窗组件
 */
@Component
export struct ManualBillSheet {
  @Link isShow: boolean;
  onSave: (bill: Bill) => void = () => {};

  @State selectedType: BillType = BillType.EXPENSE;
  @State selectedCategory: BillCategory = BillCategory.FOOD;
  @State amountText: string = '';
  @State description: string = '';

  // 支出分类列表
  private expenseCategories: CategoryItem[] = [
    { category: BillCategory.FOOD, icon: '🍔', name: '餐饮' },
    { category: BillCategory.TRANSPORT, icon: '🚗', name: '交通' },
    { category: BillCategory.SHOPPING, icon: '🛍️', name: '购物' },
    { category: BillCategory.ENTERTAINMENT, icon: '🎬', name: '娱乐' },
    { category: BillCategory.MEDICAL, icon: '🏥', name: '医疗' },
    { category: BillCategory.EDUCATION, icon: '📚', name: '教育' },
    { category: BillCategory.HOUSING, icon: '🏠', name: '住房' },
    { category: BillCategory.UTILITIES, icon: '💡', name: '水电' },
    { category: BillCategory.OTHER_EXPENSE, icon: '📝', name: '其他' }
  ];

  // 收入分类列表
  private incomeCategories: CategoryItem[] = [
    { category: BillCategory.SALARY, icon: '💰', name: '工资' },
    { category: BillCategory.BONUS, icon: '🎁', name: '奖金' },
    { category: BillCategory.INVESTMENT, icon: '📈', name: '投资' },
    { category: BillCategory.GIFT, icon: '🎀', name: '礼金' },
    { category: BillCategory.OTHER_INCOME, icon: '📝', name: '其他' }
  ];

  /**
   * 获取当前分类列表
   */
  getCurrentCategories(): CategoryItem[] {
    return this.selectedType === BillType.EXPENSE
      ? this.expenseCategories
      : this.incomeCategories;
  }

  build() {
    Stack() {
      // 半透明遮罩
      Column()
        .width('100%')
        .height('100%')
        .backgroundColor('#000000')
        .opacity(0.5)
        .onClick(() => {
          this.isShow = false;
        })

      // 弹窗内容
      Column() {
        // 标题栏
        Row() {
          Text('×')
            .fontSize(24)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .onClick(() => {
              this.isShow = false;
            })

          Text('手动记账')
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT_PRIMARY)
            .layoutWeight(1)
            .textAlign(TextAlign.Center)

          Text('保存')
            .fontSize(16)
            .fontColor(Constants.COLOR_PRIMARY)
            .fontWeight(FontWeight.Medium)
            .onClick(() => {
              this.saveBill();
            })
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 16, bottom: 12 })

        // 类型切换
        Row() {
          this.buildTypeButton('支出', BillType.EXPENSE)
          this.buildTypeButton('收入', BillType.INCOME)
        }
        .width('100%')
        .padding({ left: 16, right: 16, bottom: 16 })
        .justifyContent(FlexAlign.Center)

        // 金额输入
        Column() {
          Text(this.selectedType === BillType.EXPENSE ? '支出金额' : '收入金额')
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .margin({ bottom: 8 })

          Row() {
            Text('¥')
              .fontSize(32)
              .fontWeight(FontWeight.Bold)
              .fontColor(Constants.COLOR_TEXT_PRIMARY)

            TextInput({ placeholder: '0.00', text: this.amountText })
              .type(InputType.NUMBER_DECIMAL)
              .fontSize(32)
              .fontWeight(FontWeight.Bold)
              .fontColor(Constants.COLOR_TEXT_PRIMARY)
              .backgroundColor('transparent')
              .layoutWeight(1)
              .onChange((value: string) => {
                this.amountText = value;
              })
          }
          .width('100%')
          .justifyContent(FlexAlign.Center)
        }
        .width('100%')
        .padding({ left: 16, right: 16, bottom: 20 })

        // 分类选择
        Column() {
          Text('选择分类')
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .margin({ bottom: 12 })
            .alignSelf(ItemAlign.Start)

          this.buildCategoryGrid()
        }
        .width('100%')
        .padding({ left: 16, right: 16, bottom: 16 })

        // 备注输入
        Column() {
          Text('备注')
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .margin({ bottom: 8 })
            .alignSelf(ItemAlign.Start)

          TextInput({ placeholder: '添加备注（可选）', text: this.description })
            .width('100%')
            .height(44)
            .fontSize(15)
            .backgroundColor(Constants.COLOR_BACKGROUND)
            .borderRadius(8)
            .padding({ left: 12, right: 12 })
            .onChange((value: string) => {
              this.description = value;
            })
        }
        .width('100%')
        .padding({ left: 16, right: 16, bottom: 24 })

        // 保存按钮
        Button('保存账单')
          .type(ButtonType.Normal)
          .width('90%')
          .height(50)
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .backgroundColor(Constants.COLOR_PRIMARY)
          .fontColor('#FFFFFF')
          .borderRadius(25)
          .onClick(() => {
            this.saveBill();
          })
      }
      .width('100%')
      .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
      .borderRadius({ topLeft: 20, topRight: 20 })
      .position({ x: 0, y: '100%' })
      .translate({ y: -480 })
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  buildTypeButton(label: string, type: BillType) {
    Button(label)
      .type(ButtonType.Normal)
      .width(100)
      .height(40)
      .fontSize(15)
      .fontWeight(FontWeight.Medium)
      .backgroundColor(this.selectedType === type ? Constants.COLOR_PRIMARY : Constants.COLOR_BACKGROUND)
      .fontColor(this.selectedType === type ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY)
      .borderRadius(20)
      .margin({ left: 8, right: 8 })
      .onClick(() => {
        this.selectedType = type;
        // 切换类型时重置分类
        if (type === BillType.EXPENSE) {
          this.selectedCategory = BillCategory.FOOD;
        } else {
          this.selectedCategory = BillCategory.SALARY;
        }
      })
  }

  @Builder
  buildCategoryGrid() {
    Flex({ wrap: FlexWrap.Wrap, justifyContent: FlexAlign.Start }) {
      ForEach(this.getCurrentCategories(), (item: CategoryItem) => {
        Column() {
          Column() {
            Text(item.icon)
              .fontSize(24)
          }
          .width(50)
          .height(50)
          .backgroundColor(this.selectedCategory === item.category
            ? (this.selectedType === BillType.EXPENSE ? 'rgba(255, 107, 53, 0.15)' : 'rgba(255, 167, 38, 0.15)')
            : Constants.COLOR_BACKGROUND)
          .borderRadius(25)
          .justifyContent(FlexAlign.Center)
          .border({
            width: this.selectedCategory === item.category ? 2 : 0,
            color: this.selectedType === BillType.EXPENSE ? Constants.COLOR_PRIMARY : Constants.COLOR_SUCCESS
          })

          Text(item.name)
            .fontSize(12)
            .fontColor(this.selectedCategory === item.category
              ? Constants.COLOR_TEXT_PRIMARY
              : Constants.COLOR_TEXT_SECONDARY)
            .margin({ top: 6 })
        }
        .width('33.33%')
        .padding(8)
        .onClick(() => {
          this.selectedCategory = item.category;
        })
      })
    }
    .width('100%')
  }

  /**
   * 保存账单
   */
  saveBill(): void {
    const amount = parseFloat(this.amountText);
    if (isNaN(amount) || amount <= 0) {
      promptAction.showToast({ message: '请输入有效金额' });
      return;
    }

    const bill = new Bill();
    bill.type = this.selectedType;
    bill.category = this.selectedCategory;
    bill.amount = amount;
    bill.description = this.description;
    bill.date = new Date();

    this.onSave(bill);
    this.resetForm();
    this.isShow = false;
  }

  /**
   * 重置表单
   */
  resetForm(): void {
    this.selectedType = BillType.EXPENSE;
    this.selectedCategory = BillCategory.FOOD;
    this.amountText = '';
    this.description = '';
  }
}
