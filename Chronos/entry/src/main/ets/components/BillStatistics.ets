import { Bill, BillType, BillCategory } from '../model/Bill';
import { BillService } from '../service/BillService';
import { Constants } from '../common/Constants';
import { Utils } from '../common/Utils';

/**
 * 统计时间范围类型
 */
type StatsPeriod = 'day' | 'week' | 'month' | 'year' | 'custom';

/**
 * 分类统计数据
 */
interface CategoryStats {
  category: BillCategory;
  icon: string;
  name: string;
  amount: number;
  percentage: number;
  count: number;
}

/**
 * 日统计数据
 */
interface DailyStats {
  date: string;
  dateLabel: string;
  expense: number;
  income: number;
}

/**
 * 周日期范围
 */
interface WeekDateRange {
  start: Date;
  end: Date;
}

/**
 * 账单统计组件
 */
@Component
export struct BillStatistics {
  @Link isShow: boolean;
  
  // 统计数据
  @State period: StatsPeriod = 'week';
  @State startDate: Date = new Date();
  @State endDate: Date = new Date();
  @State totalExpense: number = 0;
  @State totalIncome: number = 0;
  @State totalBalance: number = 0;
  @State categoryStats: CategoryStats[] = [];
  @State dailyStats: DailyStats[] = [];
  @State topExpenses: Bill[] = [];
  @State topIncomes: Bill[] = [];
  @State allBillsInRange: Bill[] = [];
  @State showCategoryExpenseTab: boolean = true; // 分类统计的支出/收入切换
  @State showTopBillsExpenseTab: boolean = true; // 单笔排行的支出/收入切换
  @State categoryStatsForIncome: CategoryStats[] = []; // 收入分类统计
  @State selectedDate: Date = new Date(); // 用于日期选择
  @State showYearPicker: boolean = false; // 年份选择器
  @State showMonthPicker: boolean = false; // 月份选择器
  @State showWeekPicker: boolean = false; // 周选择器
  @State showCustomRangePicker: boolean = false; // 自定义范围选择器
  @State tempSelectedYear: number = new Date().getFullYear();
  @State tempSelectedMonth: number = new Date().getMonth();
  @State tempSelectedWeek: number = 1;
  
  private billService: BillService = BillService.getInstance();

  aboutToAppear() {
    this.initDateRange();
    this.loadStatistics();
  }


  /**
   * 初始化日期范围
   */
  initDateRange(): void {
    const today = new Date();
    this.endDate = new Date(today);
    
    if (this.period === 'week') {
      // 本周
      const dayOfWeek = today.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 周一为起始
      this.startDate = new Date(today);
      this.startDate.setDate(today.getDate() - diff);
    } else if (this.period === 'month') {
      // 本月
      this.startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (this.period === 'year') {
      // 本年
      this.startDate = new Date(today.getFullYear(), 0, 1);
    }
    // custom 类型不在这里初始化，由用户选择
    
    this.startDate.setHours(0, 0, 0, 0);
    this.endDate.setHours(23, 59, 59, 999);
  }

  /**
   * 切换统计周期
   */
  switchPeriod(newPeriod: StatsPeriod): void {
    this.period = newPeriod;
    this.initDateRange();
    this.loadStatistics();
  }

  /**
   * 加载统计数据
   */
  async loadStatistics(): Promise<void> {
    try {
      const bills = await this.billService.getBillsByDateRange(this.startDate, this.endDate);
      this.allBillsInRange = bills;
      
      // 计算总收支
      this.totalExpense = this.billService.calculateExpense(bills);
      this.totalIncome = this.billService.calculateIncome(bills);
      this.totalBalance = this.totalIncome - this.totalExpense;
      
      // 计算分类统计（支出和收入）
      this.calculateCategoryStats(bills);
      this.calculateIncomeCategoryStats(bills);
      
      // 计算每日统计
      this.calculateDailyStats(bills);
      
      // 获取排行榜
      this.calculateTopBills(bills);
    } catch (error) {
      console.error('加载统计数据失败:', error);
    }
  }

  /**
   * 计算支出分类统计
   */
  calculateCategoryStats(bills: Bill[]): void {
    const expenseBills = bills.filter(b => b.isExpense());
    const categoryMap: Map<BillCategory, number> = new Map();
    const countMap: Map<BillCategory, number> = new Map();
    
    expenseBills.forEach(bill => {
      const current = categoryMap.get(bill.category) || 0;
      categoryMap.set(bill.category, current + bill.amount);
      const count = countMap.get(bill.category) || 0;
      countMap.set(bill.category, count + 1);
    });
    
    const stats: CategoryStats[] = [];
    categoryMap.forEach((amount, category) => {
      const percentage = this.totalExpense > 0 ? (amount / this.totalExpense) * 100 : 0;
      stats.push({
        category: category,
        icon: this.getCategoryIcon(category),
        name: this.getCategoryName(category),
        amount: amount,
        percentage: percentage,
        count: countMap.get(category) || 0
      });
    });
    
    // 按金额降序排列
    stats.sort((a, b) => b.amount - a.amount);
    this.categoryStats = stats;
  }

  /**
   * 计算收入分类统计
   */
  calculateIncomeCategoryStats(bills: Bill[]): void {
    const incomeBills = bills.filter(b => b.isIncome());
    const categoryMap: Map<BillCategory, number> = new Map();
    const countMap: Map<BillCategory, number> = new Map();
    
    incomeBills.forEach(bill => {
      const current = categoryMap.get(bill.category) || 0;
      categoryMap.set(bill.category, current + bill.amount);
      const count = countMap.get(bill.category) || 0;
      countMap.set(bill.category, count + 1);
    });
    
    const stats: CategoryStats[] = [];
    categoryMap.forEach((amount, category) => {
      const percentage = this.totalIncome > 0 ? (amount / this.totalIncome) * 100 : 0;
      stats.push({
        category: category,
        icon: this.getCategoryIcon(category),
        name: this.getCategoryName(category),
        amount: amount,
        percentage: percentage,
        count: countMap.get(category) || 0
      });
    });
    
    // 按金额降序排列
    stats.sort((a, b) => b.amount - a.amount);
    this.categoryStatsForIncome = stats;
  }


  /**
   * 计算每日统计
   */
  calculateDailyStats(bills: Bill[]): void {
    const dailyMap: Map<string, DailyStats> = new Map();
    
    // 初始化日期范围内的每一天
    const current = new Date(this.startDate);
    while (current <= this.endDate) {
      const dateStr = Utils.formatDate(current, 'YYYY-MM-DD');
      const dateLabel = Utils.formatDate(current, 'MM.DD');
      dailyMap.set(dateStr, {
        date: dateStr,
        dateLabel: dateLabel,
        expense: 0,
        income: 0
      });
      current.setDate(current.getDate() + 1);
    }
    
    // 统计每日数据
    bills.forEach(bill => {
      const dateStr = Utils.formatDate(bill.date, 'YYYY-MM-DD');
      const stats = dailyMap.get(dateStr);
      if (stats) {
        if (bill.isExpense()) {
          stats.expense += bill.amount;
        } else {
          stats.income += bill.amount;
        }
      }
    });
    
    // 转换为数组
    this.dailyStats = Array.from(dailyMap.values());
  }

  /**
   * 计算排行榜
   */
  calculateTopBills(bills: Bill[]): void {
    const expenses = bills.filter(b => b.isExpense()).sort((a, b) => b.amount - a.amount);
    const incomes = bills.filter(b => b.isIncome()).sort((a, b) => b.amount - a.amount);
    
    this.topExpenses = expenses.slice(0, 5);
    this.topIncomes = incomes.slice(0, 5);
  }

  /**
   * 获取日期范围显示文本
   */
  getDateRangeText(): string {
    const startStr = Utils.formatDate(this.startDate, 'YYYY.MM.DD');
    const endStr = Utils.formatDate(this.endDate, 'YYYY.MM.DD');
    return `${startStr} ~ ${endStr}`;
  }

  /**
   * 获取最大日支出（用于图表缩放）
   */
  getMaxDailyExpense(): number {
    let max = 0;
    this.dailyStats.forEach(stats => {
      if (stats.expense > max) max = stats.expense;
    });
    return max > 0 ? max : 100;
  }

  build() {
    Stack() {
      Column() {
        // 顶部导航栏
        this.buildHeader()
        
        // 可滚动内容区域
        Scroll() {
          Column() {
            // 总统计卡片
            this.buildSummaryCard()
            
            // AI分析建议
            this.buildAIAnalysis()
            
            // 消费趋势
            this.buildDailyTrend()
            
            // 分类构成
            this.buildCategoryChart()
            
            // 单笔收支排行
            this.buildTopBillsList()
            
            // 账单汇总
            this.buildBillSummary()
          }
          .width('100%')
          .padding({ bottom: 20 })
        }
        .layoutWeight(1)
        .scrollBar(BarState.Off)
      }
      .width('100%')
      .height('100%')
      .backgroundColor(Constants.COLOR_BACKGROUND)
      
      // 年份选择器
      if (this.showYearPicker) {
        Column()
          .width('100%')
          .height('100%')
          .backgroundColor('rgba(0,0,0,0.5)')
          .justifyContent(FlexAlign.End)
          .onClick(() => {
            this.showYearPicker = false;
          })
        
        Column() {
          this.buildYearPicker()
        }
        .width('100%')
        .height(300)
        .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
        .borderRadius({ topLeft: 20, topRight: 20 })
      }
      
      // 月份选择器
      if (this.showMonthPicker) {
        Column()
          .width('100%')
          .height('100%')
          .backgroundColor('rgba(0,0,0,0.5)')
          .justifyContent(FlexAlign.End)
          .onClick(() => {
            this.showMonthPicker = false;
          })
        
        Column() {
          this.buildMonthPicker()
        }
        .width('100%')
        .height(300)
        .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
        .borderRadius({ topLeft: 20, topRight: 20 })
      }
      
      // 周选择器
      if (this.showWeekPicker) {
        Column()
          .width('100%')
          .height('100%')
          .backgroundColor('rgba(0,0,0,0.5)')
          .justifyContent(FlexAlign.End)
          .onClick(() => {
            this.showWeekPicker = false;
          })
        
        Column() {
          this.buildWeekPicker()
        }
        .width('100%')
        .height(300)
        .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
        .borderRadius({ topLeft: 20, topRight: 20 })
      }
      
      // 自定义范围选择器
      if (this.showCustomRangePicker) {
        Column()
          .width('100%')
          .height('100%')
          .backgroundColor('rgba(0,0,0,0.5)')
          .justifyContent(FlexAlign.End)
          .onClick(() => {
            this.showCustomRangePicker = false;
          })
        
        Column() {
          this.buildCustomRangePicker()
        }
        .width('100%')
        .height(400)
        .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
        .borderRadius({ topLeft: 20, topRight: 20 })
      }
    }
    .width('100%')
    .height('100%')
  }


  /**
   * 构建顶部导航栏
   */
  @Builder
  buildHeader() {
    Column() {
      // 返回按钮和标题
      Row() {
        Text('←')
          .fontSize(24)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
          .onClick(() => {
            this.isShow = false;
          })
        
        Text('账单统计')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
          .margin({ left: 16 })
        
        Blank()
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 12, bottom: 12 })
      
      // 周期切换
      Row() {
        ForEach(['week', 'month', 'year', 'custom'] as StatsPeriod[], (p: StatsPeriod) => {
          Text(this.getPeriodLabel(p))
            .fontSize(14)
            .fontWeight(this.period === p ? FontWeight.Bold : FontWeight.Normal)
            .fontColor(this.period === p ? Constants.COLOR_PRIMARY : Constants.COLOR_TEXT_SECONDARY)
            .padding({ left: 16, right: 16, top: 8, bottom: 8 })
            .backgroundColor(this.period === p ? 'rgba(255, 107, 53, 0.1)' : 'transparent')
            .borderRadius(16)
            .onClick(() => {
              this.switchPeriod(p);
            })
        })
      }
      .width('100%')
      .justifyContent(FlexAlign.SpaceAround)
      .padding({ left: 16, right: 16, bottom: 12 })
      
      // 日期范围显示（可点击选择）
      Text(this.getDateRangeText())
        .fontSize(14)
        .fontColor(Constants.COLOR_PRIMARY)
        .padding({ bottom: 12 })
        .onClick(() => {
          this.showDatePicker();
        })
    }
    .width('100%')
    .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
  }

  /**
   * 获取周期标签
   */
  getPeriodLabel(period: StatsPeriod): string {
    if (period === 'week') return '周';
    if (period === 'month') return '月';
    if (period === 'year') return '年';
    return '自定义';
  }

  /**
   * 显示日期选择器
   */
  showDatePicker(): void {
    if (this.period === 'custom') {
      // 自定义：显示自定义范围选择器
      this.showCustomRangePicker = true;
    } else if (this.period === 'week') {
      // 周：显示周选择器
      this.tempSelectedYear = this.startDate.getFullYear();
      // 计算当前是第几周
      this.tempSelectedWeek = this.getWeekNumber(this.startDate);
      // 确保周数在有效范围内
      const maxWeek = this.getWeeks().length;
      if (this.tempSelectedWeek > maxWeek) {
        this.tempSelectedWeek = maxWeek;
      }
      if (this.tempSelectedWeek < 1) {
        this.tempSelectedWeek = 1;
      }
      this.showWeekPicker = true;
    } else if (this.period === 'month') {
      // 月：显示月份选择器
      this.tempSelectedYear = this.startDate.getFullYear();
      this.tempSelectedMonth = this.startDate.getMonth();
      this.showMonthPicker = true;
    } else if (this.period === 'year') {
      // 年：显示年份选择器
      this.tempSelectedYear = this.startDate.getFullYear();
      this.showYearPicker = true;
    }
  }

  /**
   * 获取年份列表
   */
  getYears(): number[] {
    const years: number[] = [];
    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 50; y <= currentYear + 50; y++) {
      years.push(y);
    }
    return years;
  }

  /**
   * 获取月份列表
   */
  getMonths(): number[] {
    const months: number[] = [];
    for (let m = 0; m < 12; m++) {
      months.push(m);
    }
    return months;
  }

  /**
   * 获取周数列表（一年最多53周）
   */
  getWeeks(): number[] {
    const weeks: number[] = [];
    // 计算该年有多少周
    const firstDay = new Date(this.tempSelectedYear, 0, 1);
    const lastDay = new Date(this.tempSelectedYear, 11, 31);
    const firstWeekDay = firstDay.getDay() === 0 ? 7 : firstDay.getDay(); // 转换为周一到周日为1-7
    const daysInYear = Math.floor((lastDay.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const totalWeeks = Math.ceil((daysInYear + firstWeekDay - 1) / 7);
    for (let w = 1; w <= totalWeeks; w++) {
      weeks.push(w);
    }
    return weeks;
  }

  /**
   * 获取日期是第几周
   */
  getWeekNumber(date: Date): number {
    const year = date.getFullYear();
    const firstDay = new Date(year, 0, 1);
    const firstWeekDay = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
    const days = Math.floor((date.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24));
    return Math.ceil((days + firstWeekDay) / 7);
  }

  /**
   * 根据年份和周数计算该周的开始和结束日期
   */
  getWeekDateRange(year: number, week: number): WeekDateRange {
    const firstDay = new Date(year, 0, 1);
    const firstWeekDay = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
    // 计算该周第一天的日期
    const daysToAdd = (week - 1) * 7 - (firstWeekDay - 1);
    const weekStart = new Date(year, 0, 1 + daysToAdd);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    const range: WeekDateRange = { start: weekStart, end: weekEnd };
    return range;
  }

  /**
   * 确认年份选择
   */
  confirmYearSelection(): void {
    this.startDate = new Date(this.tempSelectedYear, 0, 1);
    this.startDate.setHours(0, 0, 0, 0);
    this.endDate = new Date(this.tempSelectedYear, 11, 31);
    this.endDate.setHours(23, 59, 59, 999);
    this.showYearPicker = false;
    this.loadStatistics();
  }

  /**
   * 确认月份选择
   */
  confirmMonthSelection(): void {
    this.startDate = new Date(this.tempSelectedYear, this.tempSelectedMonth, 1);
    this.startDate.setHours(0, 0, 0, 0);
    const lastDay = new Date(this.tempSelectedYear, this.tempSelectedMonth + 1, 0);
    this.endDate = new Date(lastDay);
    this.endDate.setHours(23, 59, 59, 999);
    this.showMonthPicker = false;
    this.loadStatistics();
  }

  /**
   * 确认周选择
   */
  confirmWeekSelection(): void {
    const range = this.getWeekDateRange(this.tempSelectedYear, this.tempSelectedWeek);
    this.startDate = range.start;
    this.endDate = range.end;
    this.showWeekPicker = false;
    this.loadStatistics();
  }

  /**
   * 确认自定义范围选择
   */
  confirmCustomRangeSelection(): void {
    this.showCustomRangePicker = false;
    this.loadStatistics();
  }

  /**
   * 构建总统计卡片
   */
  @Builder
  buildSummaryCard() {
    Row() {
      Column() {
        Text('支出')
          .fontSize(12)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
        Text(`¥${this.totalExpense.toFixed(2)}`)
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor(Constants.COLOR_DANGER)
          .margin({ top: 4 })
      }
      .layoutWeight(1)
      .alignItems(HorizontalAlign.Center)
      
      Column() {
        Text('收入')
          .fontSize(12)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
        Text(`¥${this.totalIncome.toFixed(2)}`)
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor(Constants.COLOR_SUCCESS)
          .margin({ top: 4 })
      }
      .layoutWeight(1)
      .alignItems(HorizontalAlign.Center)
      
      Column() {
        Text('结余')
          .fontSize(12)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
        Text(`¥${this.totalBalance.toFixed(2)}`)
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor(Constants.COLOR_PRIMARY)
          .margin({ top: 4 })
      }
      .layoutWeight(1)
      .alignItems(HorizontalAlign.Center)
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
    .borderRadius(12)
    .margin({ left: 16, right: 16, top: 12 })
  }


  /**
   * 构建AI分析建议
   */
  @Builder
  buildAIAnalysis() {
    Column() {
      Row() {
        Text('🤖')
          .fontSize(20)
        Text('AI分析了解您')
          .fontSize(14)
          .fontWeight(FontWeight.Medium)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
          .margin({ left: 8 })
      }
      .width('100%')
      .margin({ bottom: 12 })
      
      Column() {
        Text('💡')
          .fontSize(24)
          .margin({ bottom: 8 })
        
        Text(this.getAIAnalysisText())
          .fontSize(13)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .textAlign(TextAlign.Center)
          .lineHeight(20)
      }
      .width('100%')
      .padding(16)
      .backgroundColor('#FFF8E1')
      .borderRadius(12)
      
      Text('更多消费分析，请记录更多~')
        .fontSize(12)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .margin({ top: 8 })
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
    .borderRadius(12)
    .margin({ left: 16, right: 16, top: 12 })
  }

  /**
   * 获取AI分析文本
   */
  getAIAnalysisText(): string {
    if (this.allBillsInRange.length === 0) {
      return '本期暂无账单记录，开始记录您的第一笔账单吧！';
    }
    
    // 找出最大支出分类
    let topCategory = '';
    let topAmount = 0;
    this.categoryStats.forEach(stat => {
      if (stat.amount > topAmount) {
        topAmount = stat.amount;
        topCategory = stat.name;
      }
    });
    
    if (topCategory) {
      const avgDaily = this.totalExpense / Math.max(this.dailyStats.length, 1);
      return `本期最大支出为「${topCategory}」，花费¥${topAmount.toFixed(2)}，` +
        `日均消费¥${avgDaily.toFixed(2)}。建议合理规划支出哦~`;
    }
    
    return '继续记录账单，获取更精准的消费分析~';
  }

  /**
   * 构建消费趋势
   */
  @Builder
  buildDailyTrend() {
    Column() {
      Text('消费趋势')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(Constants.COLOR_TEXT_PRIMARY)
        .width('100%')
        .margin({ bottom: 16 })
      
      // 简易柱状图
      Row() {
        ForEach(this.dailyStats.slice(-7), (stats: DailyStats) => {
          Column() {
            // 柱子
            Column()
              .width(24)
              .height(`${Math.max((stats.expense / this.getMaxDailyExpense()) * 100, 5)}%`)
              .backgroundColor(Constants.COLOR_PRIMARY)
              .borderRadius({ topLeft: 4, topRight: 4 })
            
            // 日期标签
            Text(stats.dateLabel)
              .fontSize(10)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
              .margin({ top: 4 })
          }
          .layoutWeight(1)
          .height(120)
          .justifyContent(FlexAlign.End)
          .alignItems(HorizontalAlign.Center)
        })
      }
      .width('100%')
      .height(140)
      .padding({ top: 20 })
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
    .borderRadius(12)
    .margin({ left: 16, right: 16, top: 12 })
  }


  /**
   * 构建分类构成
   */
  @Builder
  buildCategoryChart() {
    Column() {
      // 标题和切换
      Row() {
        Text('分类构成')
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
        
        Blank()
        
        Text('支出')
          .fontSize(13)
          .fontColor(this.showCategoryExpenseTab ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY)
          .padding({ left: 12, right: 12, top: 6, bottom: 6 })
          .backgroundColor(this.showCategoryExpenseTab ? Constants.COLOR_PRIMARY : Constants.COLOR_BACKGROUND)
          .borderRadius(14)
          .margin({ right: 8 })
          .onClick(() => { this.showCategoryExpenseTab = true; })
        
        Text('收入')
          .fontSize(13)
          .fontColor(!this.showCategoryExpenseTab ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY)
          .padding({ left: 12, right: 12, top: 6, bottom: 6 })
          .backgroundColor(!this.showCategoryExpenseTab ? Constants.COLOR_SUCCESS : Constants.COLOR_BACKGROUND)
          .borderRadius(14)
          .onClick(() => { this.showCategoryExpenseTab = false; })
      }
      .width('100%')
      .margin({ bottom: 16 })
      
      // 总金额显示
      Column() {
        Text(this.showCategoryExpenseTab ? '总支出' : '总收入')
          .fontSize(12)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
        Text(`¥${this.showCategoryExpenseTab ? this.totalExpense.toFixed(2) : this.totalIncome.toFixed(2)}`)
          .fontSize(28)
          .fontWeight(FontWeight.Bold)
          .fontColor(this.showCategoryExpenseTab ? Constants.COLOR_DANGER : Constants.COLOR_SUCCESS)
          .margin({ top: 4 })
      }
      .width('100%')
      .alignItems(HorizontalAlign.Center)
      .margin({ bottom: 20 })
      
      // 分类列表
      if ((this.showCategoryExpenseTab ? this.categoryStats : this.categoryStatsForIncome).length > 0) {
        ForEach(this.showCategoryExpenseTab ? this.categoryStats : this.categoryStatsForIncome, (stat: CategoryStats) => {
          Row() {
            // 图标
            Text(stat.icon)
              .fontSize(20)
              .width(32)
            
            // 分类名和百分比
            Column() {
              Row() {
                Text(stat.name)
                  .fontSize(14)
                  .fontColor(Constants.COLOR_TEXT_PRIMARY)
                Text(`${stat.percentage.toFixed(1)}%`)
                  .fontSize(12)
                  .fontColor(Constants.COLOR_TEXT_SECONDARY)
                  .margin({ left: 8 })
              }
              
              // 进度条
              Row() {
                Row()
                  .width(`${stat.percentage}%`)
                  .height(6)
                  .backgroundColor(Constants.COLOR_PRIMARY)
                  .borderRadius(3)
              }
              .width('100%')
              .height(6)
              .backgroundColor(Constants.COLOR_BORDER)
              .borderRadius(3)
              .margin({ top: 6 })
            }
            .layoutWeight(1)
            .margin({ left: 12 })
            
            // 金额
            Text(`¥${stat.amount.toFixed(2)}`)
              .fontSize(14)
              .fontWeight(FontWeight.Medium)
              .fontColor(Constants.COLOR_TEXT_PRIMARY)
          }
          .width('100%')
          .padding({ top: 10, bottom: 10 })
        })
      } else {
        Text('暂无数据')
          .fontSize(14)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .padding(20)
      }
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
    .borderRadius(12)
    .margin({ left: 16, right: 16, top: 12 })
  }


  /**
   * 构建单笔收支排行
   */
  @Builder
  buildTopBillsList() {
    Column() {
      // 标题和切换
      Row() {
        Text('收入排行')
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
        
        Blank()
        
        Text('支出')
          .fontSize(13)
          .fontColor(this.showTopBillsExpenseTab ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY)
          .padding({ left: 12, right: 12, top: 6, bottom: 6 })
          .backgroundColor(this.showTopBillsExpenseTab ? Constants.COLOR_PRIMARY : Constants.COLOR_BACKGROUND)
          .borderRadius(14)
          .margin({ right: 8 })
          .onClick(() => { this.showTopBillsExpenseTab = true; })
        
        Text('收入')
          .fontSize(13)
          .fontColor(!this.showTopBillsExpenseTab ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY)
          .padding({ left: 12, right: 12, top: 6, bottom: 6 })
          .backgroundColor(!this.showTopBillsExpenseTab ? Constants.COLOR_SUCCESS : Constants.COLOR_BACKGROUND)
          .borderRadius(14)
          .onClick(() => { this.showTopBillsExpenseTab = false; })
      }
      .width('100%')
      .margin({ bottom: 16 })
      
      // 排行列表
      if ((this.showTopBillsExpenseTab ? this.topExpenses : this.topIncomes).length > 0) {
        ForEach(this.showTopBillsExpenseTab ? this.topExpenses : this.topIncomes, (bill: Bill, index: number) => {
          Row() {
            // 排名
            Text(`${index + 1}`)
              .fontSize(14)
              .fontWeight(FontWeight.Bold)
              .fontColor(index < 3 ? Constants.COLOR_PRIMARY : Constants.COLOR_TEXT_SECONDARY)
              .width(24)
            
            // 图标
            Column() {
              Text(this.getCategoryIcon(bill.category))
                .fontSize(18)
            }
            .width(36)
            .height(36)
            .backgroundColor(bill.isIncome() ? 'rgba(255, 167, 38, 0.15)' : 'rgba(255, 107, 53, 0.1)')
            .borderRadius(18)
            .justifyContent(FlexAlign.Center)
            .margin({ left: 8 })
            
            // 描述
            Column() {
              Text(bill.description || this.getCategoryName(bill.category))
                .fontSize(14)
                .fontColor(Constants.COLOR_TEXT_PRIMARY)
                .maxLines(1)
                .textOverflow({ overflow: TextOverflow.Ellipsis })
              Text(Utils.formatDate(bill.date, 'MM月DD日'))
                .fontSize(12)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
                .margin({ top: 2 })
            }
            .layoutWeight(1)
            .alignItems(HorizontalAlign.Start)
            .margin({ left: 12 })
            
            // 金额
            Text(`¥${bill.amount.toFixed(2)}`)
              .fontSize(15)
              .fontWeight(FontWeight.Bold)
              .fontColor(bill.isIncome() ? Constants.COLOR_SUCCESS : Constants.COLOR_DANGER)
          }
          .width('100%')
          .padding({ top: 10, bottom: 10 })
        })
      } else {
        Text('暂无数据')
          .fontSize(14)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .padding(20)
      }
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
    .borderRadius(12)
    .margin({ left: 16, right: 16, top: 12 })
  }


  /**
   * 构建账单汇总
   */
  @Builder
  buildBillSummary() {
    Column() {
      Text('账单汇总')
        .fontSize(16)
        .fontWeight(FontWeight.Medium)
        .fontColor(Constants.COLOR_TEXT_PRIMARY)
        .width('100%')
        .margin({ bottom: 16 })
      
      // 表头
      Row() {
        Text('日期')
          .fontSize(13)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .layoutWeight(1)
          .textAlign(TextAlign.Center)
        Text(this.getAmountLabel('支出'))
          .fontSize(13)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .layoutWeight(1)
          .textAlign(TextAlign.Center)
        Text(this.getAmountLabel('收入'))
          .fontSize(13)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .layoutWeight(1)
          .textAlign(TextAlign.Center)
        Text(this.getAmountLabel('结余'))
          .fontSize(13)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .layoutWeight(1)
          .textAlign(TextAlign.Center)
      }
      .width('100%')
      .padding({ top: 10, bottom: 10 })
      .backgroundColor(Constants.COLOR_BACKGROUND)
      .borderRadius(8)
      
      // 数据行
      ForEach(this.dailyStats.slice().reverse().slice(0, 10), (stats: DailyStats) => {
        Row() {
          Text(stats.dateLabel)
            .fontSize(13)
            .fontColor(Constants.COLOR_TEXT_PRIMARY)
            .layoutWeight(1)
            .textAlign(TextAlign.Center)
          Text(this.formatAmount(stats.expense, true))
            .fontSize(13)
            .fontColor(stats.expense > 0 ? Constants.COLOR_DANGER : Constants.COLOR_TEXT_SECONDARY)
            .layoutWeight(1)
            .textAlign(TextAlign.Center)
          Text(this.formatAmount(stats.income, false))
            .fontSize(13)
            .fontColor(stats.income > 0 ? Constants.COLOR_SUCCESS : Constants.COLOR_TEXT_SECONDARY)
            .layoutWeight(1)
            .textAlign(TextAlign.Center)
          Text(this.formatBalanceAmount(stats.income - stats.expense))
            .fontSize(13)
            .fontColor((stats.income - stats.expense) >= 0 ? Constants.COLOR_PRIMARY : Constants.COLOR_DANGER)
            .layoutWeight(1)
            .textAlign(TextAlign.Center)
        }
        .width('100%')
        .padding({ top: 12, bottom: 12 })
        .borderWidth({ bottom: 1 })
        .borderColor(Constants.COLOR_DIVIDER)
      })
    }
    .width('100%')
    .padding(16)
    .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
    .borderRadius(12)
    .margin({ left: 16, right: 16, top: 12 })
  }

  /**
   * 获取分类图标
   */
  getCategoryIcon(category: BillCategory): string {
    if (category === BillCategory.FOOD) return '🍔';
    if (category === BillCategory.TRANSPORT) return '🚗';
    if (category === BillCategory.SHOPPING) return '🛍️';
    if (category === BillCategory.ENTERTAINMENT) return '🎬';
    if (category === BillCategory.MEDICAL) return '🏥';
    if (category === BillCategory.EDUCATION) return '📚';
    if (category === BillCategory.HOUSING) return '🏠';
    if (category === BillCategory.UTILITIES) return '💡';
    if (category === BillCategory.SALARY) return '💰';
    if (category === BillCategory.BONUS) return '🎁';
    if (category === BillCategory.INVESTMENT) return '📈';
    if (category === BillCategory.GIFT) return '🎁';
    return '📝';
  }

  /**
   * 获取金额标签（根据周期类型显示不同的标签）
   */
  getAmountLabel(baseLabel: string): string {
    if (this.period === 'year') {
      return `${baseLabel}(年均)`;
    } else if (this.period === 'month' || this.period === 'week') {
      return `${baseLabel}(日均)`;
    } else {
      return `${baseLabel}(总计)`;
    }
  }

  /**
   * 格式化金额显示（根据周期类型显示日均或总计）
   * 年界面：显示年均（总金额/总天数）
   * 月和周界面：显示日均（该天的金额，本身就是日均）
   * 自定义界面：显示总计（该天的总金额）
   */
  formatAmount(amount: number, isExpense: boolean): string {
    if (amount <= 0) return '-';
    
    let displayAmount = amount;
    
    if (this.period === 'year') {
      // 年界面：显示年均（总金额除以总天数）
      const days = Math.floor((this.endDate.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const totalAmount = isExpense ? this.totalExpense : this.totalIncome;
      displayAmount = days > 0 ? totalAmount / days : 0;
    } else if (this.period === 'month' || this.period === 'week') {
      // 月和周界面：显示日均（该天的金额本身就是日均，不需要额外计算）
      displayAmount = amount;
    }
    // custom 界面显示总计，直接使用amount
    
    return `¥${displayAmount.toFixed(2)}`;
  }

  /**
   * 格式化结余金额显示
   */
  formatBalanceAmount(balance: number): string {
    let displayAmount = balance;
    
    if (this.period === 'year') {
      // 年界面：显示年均结余（总结余除以总天数）
      const days = Math.floor((this.endDate.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      displayAmount = days > 0 ? this.totalBalance / days : 0;
    } else if (this.period === 'month' || this.period === 'week') {
      // 月和周界面：显示日均结余（该天的结余，本身就是日均）
      displayAmount = balance;
    }
    // custom 界面显示总计结余
    
    return `¥${displayAmount.toFixed(2)}`;
  }

  /**
   * 获取分类名称
   */
  getCategoryName(category: BillCategory): string {
    if (category === BillCategory.FOOD) return '餐饮';
    if (category === BillCategory.TRANSPORT) return '交通';
    if (category === BillCategory.SHOPPING) return '购物';
    if (category === BillCategory.ENTERTAINMENT) return '娱乐';
    if (category === BillCategory.MEDICAL) return '医疗';
    if (category === BillCategory.EDUCATION) return '教育';
    if (category === BillCategory.HOUSING) return '住房';
    if (category === BillCategory.UTILITIES) return '水电';
    if (category === BillCategory.SALARY) return '工资';
    if (category === BillCategory.BONUS) return '奖金';
    if (category === BillCategory.INVESTMENT) return '投资';
    if (category === BillCategory.GIFT) return '礼金';
    if (category === BillCategory.OTHER_EXPENSE) return '其他支出';
    if (category === BillCategory.OTHER_INCOME) return '其他收入';
    return '其他';
  }

  /**
   * 构建年份选择器
   */
  @Builder
  buildYearPicker() {
    Column() {
      Row() {
        Button('取消')
          .type(ButtonType.Normal)
          .backgroundColor(Color.Transparent)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .onClick(() => {
            this.showYearPicker = false;
          })
        
        Blank()
        
        Text('选择年份')
          .fontSize(17)
          .fontWeight(FontWeight.Medium)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
        
        Blank()
        
        Button('确定')
          .type(ButtonType.Normal)
          .backgroundColor(Color.Transparent)
          .fontColor(Constants.COLOR_PRIMARY)
          .onClick(() => {
            this.confirmYearSelection();
          })
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 12, bottom: 12 })
      
      TextPicker({ 
        range: this.getYears().map(y => `${y}年`), 
        selected: this.tempSelectedYear - (new Date().getFullYear() - 50) 
      })
        .onChange((value: string | string[], index: number | number[]) => {
          if (typeof index === 'number') {
            this.tempSelectedYear = new Date().getFullYear() - 50 + index;
          }
        })
        .height(200)
    }
    .width('100%')
    .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
  }

  /**
   * 构建月份选择器
   */
  @Builder
  buildMonthPicker() {
    Column() {
      Row() {
        Button('取消')
          .type(ButtonType.Normal)
          .backgroundColor(Color.Transparent)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .onClick(() => {
            this.showMonthPicker = false;
          })
        
        Blank()
        
        Text('选择年月')
          .fontSize(17)
          .fontWeight(FontWeight.Medium)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
        
        Blank()
        
        Button('确定')
          .type(ButtonType.Normal)
          .backgroundColor(Color.Transparent)
          .fontColor(Constants.COLOR_PRIMARY)
          .onClick(() => {
            this.confirmMonthSelection();
          })
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 12, bottom: 12 })
      
      Row() {
        TextPicker({ 
          range: this.getYears().map(y => `${y}年`), 
          selected: this.tempSelectedYear - (new Date().getFullYear() - 50) 
        })
          .layoutWeight(1)
          .onChange((value: string | string[], index: number | number[]) => {
            if (typeof index === 'number') {
              this.tempSelectedYear = new Date().getFullYear() - 50 + index;
            }
          })
        
        TextPicker({ 
          range: this.getMonths().map(m => `${m + 1}月`), 
          selected: this.tempSelectedMonth 
        })
          .layoutWeight(1)
          .onChange((value: string | string[], index: number | number[]) => {
            if (typeof index === 'number') {
              this.tempSelectedMonth = index;
            }
          })
      }
      .width('100%')
      .height(200)
    }
    .width('100%')
    .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
  }

  /**
   * 构建周选择器
   */
  @Builder
  buildWeekPicker() {
    Column() {
      Row() {
        Button('取消')
          .type(ButtonType.Normal)
          .backgroundColor(Color.Transparent)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .onClick(() => {
            this.showWeekPicker = false;
          })
        
        Blank()
        
        Text('选择周')
          .fontSize(17)
          .fontWeight(FontWeight.Medium)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
        
        Blank()
        
        Button('确定')
          .type(ButtonType.Normal)
          .backgroundColor(Color.Transparent)
          .fontColor(Constants.COLOR_PRIMARY)
          .onClick(() => {
            this.confirmWeekSelection();
          })
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 12, bottom: 12 })
      
      Row() {
        TextPicker({ 
          range: this.getYears().map(y => `${y}年`), 
          selected: this.tempSelectedYear - (new Date().getFullYear() - 50) 
        })
          .layoutWeight(1)
          .onChange((value: string | string[], index: number | number[]) => {
            if (typeof index === 'number') {
              this.tempSelectedYear = new Date().getFullYear() - 50 + index;
            }
          })
        
        TextPicker({ 
          range: this.getWeeks().map(w => `第${w}周`), 
          selected: this.tempSelectedWeek - 1 
        })
          .layoutWeight(1)
          .onChange((value: string | string[], index: number | number[]) => {
            if (typeof index === 'number') {
              this.tempSelectedWeek = index + 1;
            }
          })
      }
      .width('100%')
      .height(200)
    }
    .width('100%')
    .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
  }

  /**
   * 构建自定义范围选择器
   */
  @Builder
  buildCustomRangePicker() {
    Column() {
      Row() {
        Button('取消')
          .type(ButtonType.Normal)
          .backgroundColor(Color.Transparent)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .onClick(() => {
            this.showCustomRangePicker = false;
          })
        
        Blank()
        
        Text('选择日期范围')
          .fontSize(17)
          .fontWeight(FontWeight.Medium)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
        
        Blank()
        
        Button('确定')
          .type(ButtonType.Normal)
          .backgroundColor(Color.Transparent)
          .fontColor(Constants.COLOR_PRIMARY)
          .onClick(() => {
            this.confirmCustomRangeSelection();
          })
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 12, bottom: 12 })
      
      Column() {
        Text('开始日期')
          .fontSize(14)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .width('100%')
          .margin({ bottom: 8 })
        
        Text(Utils.formatDate(this.startDate, 'YYYY-MM-DD'))
          .fontSize(16)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
          .width('100%')
          .padding(12)
          .backgroundColor(Constants.COLOR_BACKGROUND)
          .borderRadius(8)
          .onClick(() => {
            DatePickerDialog.show({
              start: new Date('2020-1-1'),
              end: new Date('2100-12-31'),
              selected: this.startDate,
              showTime: false,
              onDateAccept: (value: Date) => {
                this.startDate = new Date(value);
                this.startDate.setHours(0, 0, 0, 0);
              }
            });
          })
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 8, bottom: 8 })
      
      Column() {
        Text('结束日期')
          .fontSize(14)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
          .width('100%')
          .margin({ bottom: 8 })
        
        Text(Utils.formatDate(this.endDate, 'YYYY-MM-DD'))
          .fontSize(16)
          .fontColor(Constants.COLOR_TEXT_PRIMARY)
          .width('100%')
          .padding(12)
          .backgroundColor(Constants.COLOR_BACKGROUND)
          .borderRadius(8)
          .onClick(() => {
            DatePickerDialog.show({
              start: this.startDate,
              end: new Date('2100-12-31'),
              selected: this.endDate < this.startDate ? this.startDate : this.endDate,
              showTime: false,
              onDateAccept: (value: Date) => {
                this.endDate = new Date(value);
                this.endDate.setHours(23, 59, 59, 999);
              }
            });
          })
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 8, bottom: 8 })
    }
    .width('100%')
    .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
  }
}
