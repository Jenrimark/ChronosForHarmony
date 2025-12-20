import { Bill, BillType, BillCategory } from '../model/Bill';
import { Utils } from '../common/Utils';
import { Constants } from '../common/Constants';

/**
 * 账单项组件
 */
@Component
export struct BillItem {
  @Prop bill: Bill = new Bill();
  @Link onTapAction: number;
  @Link onDeleteAction: number;
  
  @State actionId: number = 0;

  aboutToAppear() {
    this.actionId = this.bill.id;
  }

  /**
   * 获取分类图标
   */
  getCategoryIcon(category: BillCategory): string {
    switch (category) {
      case BillCategory.FOOD:
        return '🍔';
      case BillCategory.TRANSPORT:
        return '🚗';
      case BillCategory.SHOPPING:
        return '🛍️';
      case BillCategory.ENTERTAINMENT:
        return '🎬';
      case BillCategory.MEDICAL:
        return '🏥';
      case BillCategory.EDUCATION:
        return '📚';
      case BillCategory.HOUSING:
        return '🏠';
      case BillCategory.UTILITIES:
        return '💡';
      case BillCategory.SALARY:
        return '💰';
      case BillCategory.BONUS:
        return '🎁';
      case BillCategory.INVESTMENT:
        return '📈';
      case BillCategory.GIFT:
        return '🎁';
      default:
        return '📝';
    }
  }

  /**
   * 获取分类名称
   */
  getCategoryName(category: BillCategory): string {
    switch (category) {
      case BillCategory.FOOD:
        return '餐饮';
      case BillCategory.TRANSPORT:
        return '交通';
      case BillCategory.SHOPPING:
        return '购物';
      case BillCategory.ENTERTAINMENT:
        return '娱乐';
      case BillCategory.MEDICAL:
        return '医疗';
      case BillCategory.EDUCATION:
        return '教育';
      case BillCategory.HOUSING:
        return '住房';
      case BillCategory.UTILITIES:
        return '水电';
      case BillCategory.SALARY:
        return '工资';
      case BillCategory.BONUS:
        return '奖金';
      case BillCategory.INVESTMENT:
        return '投资';
      case BillCategory.GIFT:
        return '礼金';
      case BillCategory.OTHER_EXPENSE:
        return '其他支出';
      case BillCategory.OTHER_INCOME:
        return '其他收入';
      default:
        return '其他';
    }
  }

  build() {
    Row() {
      // 分类图标
      Text(this.getCategoryIcon(this.bill.category))
        .fontSize(32)
        .width(48)
        .height(48)
        .textAlign(TextAlign.Center)
        .backgroundColor(this.bill.isIncome() ? '#E8F5E9' : '#FFF3E0')
        .borderRadius(24)

      // 账单信息
      Column() {
        Row() {
          Text(this.getCategoryName(this.bill.category))
            .fontSize(16)
            .fontColor(Constants.COLOR_TEXT_PRIMARY)
            .fontWeight(FontWeight.Medium)

          Blank()

          Text(this.bill.getDisplayAmount())
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .fontColor(
              this.bill.isIncome()
                ? Constants.COLOR_SUCCESS
                : Constants.COLOR_DANGER
            )
        }
        .width('100%')

        if (this.bill.description) {
          Text(this.bill.description)
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
            .margin({ top: 4 })
        }

        Row() {
          Text(Utils.formatDate(this.bill.date, 'MM-DD HH:mm'))
            .fontSize(12)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)

          if (this.bill.tags && this.bill.tags.length > 0) {
            Text(this.bill.tags.join(' '))
              .fontSize(12)
              .fontColor(Constants.COLOR_PRIMARY)
              .margin({ left: 8 })
          }
        }
        .width('100%')
        .margin({ top: 4 })
      }
      .layoutWeight(1)
      .alignItems(HorizontalAlign.Start)
      .margin({ left: 12 })

      // 删除按钮
      Text('×')
        .width(24)
        .height(24)
        .fontSize(20)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .textAlign(TextAlign.Center)
        .onClick(() => {
          this.onDeleteAction = this.bill.id;
        })
    }
    .width('100%')
    .padding(16)
    .backgroundColor('#FFFFFF')
    .borderRadius(8)
    .margin({ bottom: 8 })
    .onClick(() => {
      this.onTapAction = this.bill.id;
    })
  }
}

