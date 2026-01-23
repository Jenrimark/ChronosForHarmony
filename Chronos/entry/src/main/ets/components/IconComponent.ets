import { Constants } from '../common/Constants';

/**
 * 图标类型枚举
 */
export enum IconType {
  // 导航图标
  CALENDAR = 'calendar',
  TASK = 'task',
  BILL = 'bill',
  STATISTICS = 'statistics',
  SETTINGS = 'settings',
  
  // 操作图标
  ADD = 'add',
  DELETE = 'delete',
  EDIT = 'edit',
  COMPLETE = 'complete',
  CLOSE = 'close',
  BACK = 'back',
  FORWARD = 'forward',
  
  // 状态图标
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info',
  
  // 功能图标
  SEARCH = 'search',
  FILTER = 'filter',
  SORT = 'sort',
  REFRESH = 'refresh',
  LOCK = 'lock',
  UNLOCK = 'unlock',
  
  // 分类图标
  FOOD = 'food',
  TRANSPORT = 'transport',
  SHOPPING = 'shopping',
  ENTERTAINMENT = 'entertainment',
  MEDICAL = 'medical',
  EDUCATION = 'education',
  HOUSING = 'housing',
  UTILITIES = 'utilities',
  SALARY = 'salary',
  BONUS = 'bonus',
  INVESTMENT = 'investment',
  GIFT = 'gift',
  
  // 其他
  MORE = 'more',
  VOICE = 'voice',
  AI = 'ai',
  CHART = 'chart',
  CHAT = 'chat',
  LEAF = 'leaf',
  STAR = 'star'
}

/**
 * 图标组件 - 统一的图标系统
 * 使用 HarmonyOS SymbolGlyph 替代 emoji
 */
@Component
export struct IconComponent {
  @Prop iconType: IconType;
  @Prop iconSize: number = 24;
  @Prop iconColor: string | Resource = Constants.COLOR_TEXT_PRIMARY;
  @Prop @Watch('onEffectChange') effectStrategy?: SymbolEffectStrategy;

  /**
   * 获取系统图标资源
   */
  private getSymbolResource(): Resource {
    const iconMap: Record<string, Resource> = {
      // 导航图标
      [IconType.CALENDAR]: $r('sys.symbol.calendar'),
      [IconType.TASK]: $r('sys.symbol.checkmark_circle'),
      [IconType.BILL]: $r('sys.symbol.creditcard'),
      [IconType.STATISTICS]: $r('sys.symbol.circle'),  // 临时使用 circle
      [IconType.SETTINGS]: $r('sys.symbol.circle'),    // 临时使用 circle
      
      // 操作图标
      [IconType.ADD]: $r('sys.symbol.plus_circle'),
      [IconType.DELETE]: $r('sys.symbol.trash'),
      [IconType.EDIT]: $r('sys.symbol.circle'),        // 临时使用 circle
      [IconType.COMPLETE]: $r('sys.symbol.checkmark'),
      [IconType.CLOSE]: $r('sys.symbol.xmark'),
      [IconType.BACK]: $r('sys.symbol.chevron_left'),
      [IconType.FORWARD]: $r('sys.symbol.chevron_right'),
      
      // 状态图标
      [IconType.SUCCESS]: $r('sys.symbol.checkmark_circle_fill'),
      [IconType.WARNING]: $r('sys.symbol.exclamationmark_triangle'),
      [IconType.ERROR]: $r('sys.symbol.xmark_circle'),
      [IconType.INFO]: $r('sys.symbol.info_circle'),
      
      // 功能图标
      [IconType.SEARCH]: $r('sys.symbol.magnifyingglass'),
      [IconType.FILTER]: $r('sys.symbol.circle'),      // 临时使用 circle
      [IconType.SORT]: $r('sys.symbol.circle'),        // 临时使用 circle
      [IconType.REFRESH]: $r('sys.symbol.arrow_clockwise'),
      [IconType.LOCK]: $r('sys.symbol.lock'),
      [IconType.UNLOCK]: $r('sys.symbol.lock_open'),
      
      // 分类图标
      [IconType.FOOD]: $r('sys.symbol.fork_knife'),
      [IconType.TRANSPORT]: $r('sys.symbol.car'),
      [IconType.SHOPPING]: $r('sys.symbol.cart'),
      [IconType.ENTERTAINMENT]: $r('sys.symbol.film'),
      [IconType.MEDICAL]: $r('sys.symbol.cross_case'),
      [IconType.EDUCATION]: $r('sys.symbol.book'),
      [IconType.HOUSING]: $r('sys.symbol.house'),
      [IconType.UTILITIES]: $r('sys.symbol.lightbulb'),
      [IconType.SALARY]: $r('sys.symbol.circle'),      // 临时使用 circle
      [IconType.BONUS]: $r('sys.symbol.gift'),
      [IconType.INVESTMENT]: $r('sys.symbol.circle'),  // 临时使用 circle
      [IconType.GIFT]: $r('sys.symbol.gift_fill'),
      
      // 其他
      [IconType.MORE]: $r('sys.symbol.ellipsis_circle'),
      [IconType.VOICE]: $r('sys.symbol.mic'),
      [IconType.AI]: $r('sys.symbol.star'),
      [IconType.CHART]: $r('sys.symbol.circle'),       // 临时使用 circle
      [IconType.CHAT]: $r('sys.symbol.message'),
      [IconType.LEAF]: $r('sys.symbol.leaf'),
      [IconType.STAR]: $r('sys.symbol.star')
    };

    return iconMap[this.iconType] || $r('sys.symbol.questionmark_circle');
  }

  /**
   * 监听效果变化
   */
  onEffectChange() {
    // 效果变化时的处理
  }

  build() {
    SymbolGlyph(this.getSymbolResource())
      .fontSize(this.iconSize)
      .fontColor([this.iconColor])
      .symbolEffect(this.effectStrategy)
  }
}

/**
 * 图标按钮组件 - 带交互效果的图标
 */
@Component
export struct IconButton {
  @Prop iconType: IconType;
  @Prop iconSize: number = 24;
  @Prop iconColor: string | Resource = Constants.COLOR_TEXT_PRIMARY;
  @Prop bgColor: string | Resource = 'transparent';
  @Prop btnPadding: number = 8;
  @Prop btnBorderRadius: number = Constants.BORDER_RADIUS_SM;
  @Prop btnAccessibilityText: string = '';
  @Prop onBtnClick?: () => void;

  build() {
    Column() {
      IconComponent({
        iconType: this.iconType,
        iconSize: this.iconSize,
        iconColor: this.iconColor
      })
    }
    .width(this.iconSize + this.btnPadding * 2)
    .height(this.iconSize + this.btnPadding * 2)
    .padding(this.btnPadding)
    .backgroundColor(this.bgColor)
    .borderRadius(this.btnBorderRadius)
    .justifyContent(FlexAlign.Center)
    .hoverEffect(HoverEffect.Scale)
    .accessibilityText(this.btnAccessibilityText)
    .onClick(() => {
      if (this.onBtnClick) {
        this.onBtnClick();
      }
    })
  }
}

/**
 * 分类图标组件 - 带背景圆圈的图标
 */
@Component
export struct CategoryIcon {
  @Prop iconType: IconType;
  @Prop containerSize: number = 36;
  @Prop innerIconSize: number = 20;
  @Prop bgColor: string | Resource = Constants.COLOR_PRIMARY_LIGHT;
  @Prop innerIconColor: string | Resource = Constants.COLOR_PRIMARY;

  build() {
    Column() {
      IconComponent({
        iconType: this.iconType,
        iconSize: this.innerIconSize,
        iconColor: this.innerIconColor
      })
    }
    .width(this.containerSize)
    .height(this.containerSize)
    .backgroundColor(this.bgColor)
    .borderRadius(this.containerSize / 2)
    .justifyContent(FlexAlign.Center)
  }
}
