if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface BillStatistics_Params {
    isShow?: boolean;
    period?: StatsPeriod;
    startDate?: Date;
    endDate?: Date;
    totalExpense?: number;
    totalIncome?: number;
    totalBalance?: number;
    categoryStats?: CategoryStats[];
    dailyStats?: DailyStats[];
    topExpenses?: Bill[];
    topIncomes?: Bill[];
    allBillsInRange?: Bill[];
    showCategoryExpenseTab?: boolean;
    showTopBillsExpenseTab?: boolean;
    categoryStatsForIncome?: CategoryStats[];
    selectedDate?: Date;
    showYearPicker?: boolean;
    showMonthPicker?: boolean;
    showWeekPicker?: boolean;
    showCustomRangePicker?: boolean;
    tempSelectedYear?: number;
    tempSelectedMonth?: number;
    tempSelectedWeek?: number;
    billService?: BillService;
}
import { BillCategory } from "@normalized:N&&&entry/src/main/ets/model/Bill&";
import type { Bill } from "@normalized:N&&&entry/src/main/ets/model/Bill&";
import { BillService } from "@normalized:N&&&entry/src/main/ets/service/BillService&";
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import { Utils } from "@normalized:N&&&entry/src/main/ets/common/Utils&";
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
export class BillStatistics extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__isShow = new SynchedPropertySimpleTwoWayPU(params.isShow, this, "isShow");
        this.__period = new ObservedPropertySimplePU('week', this, "period");
        this.__startDate = new ObservedPropertyObjectPU(new Date(), this, "startDate");
        this.__endDate = new ObservedPropertyObjectPU(new Date(), this, "endDate");
        this.__totalExpense = new ObservedPropertySimplePU(0, this, "totalExpense");
        this.__totalIncome = new ObservedPropertySimplePU(0, this, "totalIncome");
        this.__totalBalance = new ObservedPropertySimplePU(0, this, "totalBalance");
        this.__categoryStats = new ObservedPropertyObjectPU([], this, "categoryStats");
        this.__dailyStats = new ObservedPropertyObjectPU([], this, "dailyStats");
        this.__topExpenses = new ObservedPropertyObjectPU([], this, "topExpenses");
        this.__topIncomes = new ObservedPropertyObjectPU([], this, "topIncomes");
        this.__allBillsInRange = new ObservedPropertyObjectPU([], this, "allBillsInRange");
        this.__showCategoryExpenseTab = new ObservedPropertySimplePU(true, this, "showCategoryExpenseTab");
        this.__showTopBillsExpenseTab = new ObservedPropertySimplePU(true, this, "showTopBillsExpenseTab");
        this.__categoryStatsForIncome = new ObservedPropertyObjectPU([], this, "categoryStatsForIncome");
        this.__selectedDate = new ObservedPropertyObjectPU(new Date(), this, "selectedDate");
        this.__showYearPicker = new ObservedPropertySimplePU(false, this, "showYearPicker");
        this.__showMonthPicker = new ObservedPropertySimplePU(false, this, "showMonthPicker");
        this.__showWeekPicker = new ObservedPropertySimplePU(false, this, "showWeekPicker");
        this.__showCustomRangePicker = new ObservedPropertySimplePU(false, this, "showCustomRangePicker");
        this.__tempSelectedYear = new ObservedPropertySimplePU(new Date().getFullYear(), this, "tempSelectedYear");
        this.__tempSelectedMonth = new ObservedPropertySimplePU(new Date().getMonth(), this, "tempSelectedMonth");
        this.__tempSelectedWeek = new ObservedPropertySimplePU(1, this, "tempSelectedWeek");
        this.billService = BillService.getInstance();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: BillStatistics_Params) {
        if (params.period !== undefined) {
            this.period = params.period;
        }
        if (params.startDate !== undefined) {
            this.startDate = params.startDate;
        }
        if (params.endDate !== undefined) {
            this.endDate = params.endDate;
        }
        if (params.totalExpense !== undefined) {
            this.totalExpense = params.totalExpense;
        }
        if (params.totalIncome !== undefined) {
            this.totalIncome = params.totalIncome;
        }
        if (params.totalBalance !== undefined) {
            this.totalBalance = params.totalBalance;
        }
        if (params.categoryStats !== undefined) {
            this.categoryStats = params.categoryStats;
        }
        if (params.dailyStats !== undefined) {
            this.dailyStats = params.dailyStats;
        }
        if (params.topExpenses !== undefined) {
            this.topExpenses = params.topExpenses;
        }
        if (params.topIncomes !== undefined) {
            this.topIncomes = params.topIncomes;
        }
        if (params.allBillsInRange !== undefined) {
            this.allBillsInRange = params.allBillsInRange;
        }
        if (params.showCategoryExpenseTab !== undefined) {
            this.showCategoryExpenseTab = params.showCategoryExpenseTab;
        }
        if (params.showTopBillsExpenseTab !== undefined) {
            this.showTopBillsExpenseTab = params.showTopBillsExpenseTab;
        }
        if (params.categoryStatsForIncome !== undefined) {
            this.categoryStatsForIncome = params.categoryStatsForIncome;
        }
        if (params.selectedDate !== undefined) {
            this.selectedDate = params.selectedDate;
        }
        if (params.showYearPicker !== undefined) {
            this.showYearPicker = params.showYearPicker;
        }
        if (params.showMonthPicker !== undefined) {
            this.showMonthPicker = params.showMonthPicker;
        }
        if (params.showWeekPicker !== undefined) {
            this.showWeekPicker = params.showWeekPicker;
        }
        if (params.showCustomRangePicker !== undefined) {
            this.showCustomRangePicker = params.showCustomRangePicker;
        }
        if (params.tempSelectedYear !== undefined) {
            this.tempSelectedYear = params.tempSelectedYear;
        }
        if (params.tempSelectedMonth !== undefined) {
            this.tempSelectedMonth = params.tempSelectedMonth;
        }
        if (params.tempSelectedWeek !== undefined) {
            this.tempSelectedWeek = params.tempSelectedWeek;
        }
        if (params.billService !== undefined) {
            this.billService = params.billService;
        }
    }
    updateStateVars(params: BillStatistics_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isShow.purgeDependencyOnElmtId(rmElmtId);
        this.__period.purgeDependencyOnElmtId(rmElmtId);
        this.__startDate.purgeDependencyOnElmtId(rmElmtId);
        this.__endDate.purgeDependencyOnElmtId(rmElmtId);
        this.__totalExpense.purgeDependencyOnElmtId(rmElmtId);
        this.__totalIncome.purgeDependencyOnElmtId(rmElmtId);
        this.__totalBalance.purgeDependencyOnElmtId(rmElmtId);
        this.__categoryStats.purgeDependencyOnElmtId(rmElmtId);
        this.__dailyStats.purgeDependencyOnElmtId(rmElmtId);
        this.__topExpenses.purgeDependencyOnElmtId(rmElmtId);
        this.__topIncomes.purgeDependencyOnElmtId(rmElmtId);
        this.__allBillsInRange.purgeDependencyOnElmtId(rmElmtId);
        this.__showCategoryExpenseTab.purgeDependencyOnElmtId(rmElmtId);
        this.__showTopBillsExpenseTab.purgeDependencyOnElmtId(rmElmtId);
        this.__categoryStatsForIncome.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedDate.purgeDependencyOnElmtId(rmElmtId);
        this.__showYearPicker.purgeDependencyOnElmtId(rmElmtId);
        this.__showMonthPicker.purgeDependencyOnElmtId(rmElmtId);
        this.__showWeekPicker.purgeDependencyOnElmtId(rmElmtId);
        this.__showCustomRangePicker.purgeDependencyOnElmtId(rmElmtId);
        this.__tempSelectedYear.purgeDependencyOnElmtId(rmElmtId);
        this.__tempSelectedMonth.purgeDependencyOnElmtId(rmElmtId);
        this.__tempSelectedWeek.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isShow.aboutToBeDeleted();
        this.__period.aboutToBeDeleted();
        this.__startDate.aboutToBeDeleted();
        this.__endDate.aboutToBeDeleted();
        this.__totalExpense.aboutToBeDeleted();
        this.__totalIncome.aboutToBeDeleted();
        this.__totalBalance.aboutToBeDeleted();
        this.__categoryStats.aboutToBeDeleted();
        this.__dailyStats.aboutToBeDeleted();
        this.__topExpenses.aboutToBeDeleted();
        this.__topIncomes.aboutToBeDeleted();
        this.__allBillsInRange.aboutToBeDeleted();
        this.__showCategoryExpenseTab.aboutToBeDeleted();
        this.__showTopBillsExpenseTab.aboutToBeDeleted();
        this.__categoryStatsForIncome.aboutToBeDeleted();
        this.__selectedDate.aboutToBeDeleted();
        this.__showYearPicker.aboutToBeDeleted();
        this.__showMonthPicker.aboutToBeDeleted();
        this.__showWeekPicker.aboutToBeDeleted();
        this.__showCustomRangePicker.aboutToBeDeleted();
        this.__tempSelectedYear.aboutToBeDeleted();
        this.__tempSelectedMonth.aboutToBeDeleted();
        this.__tempSelectedWeek.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __isShow: SynchedPropertySimpleTwoWayPU<boolean>;
    get isShow() {
        return this.__isShow.get();
    }
    set isShow(newValue: boolean) {
        this.__isShow.set(newValue);
    }
    // 统计数据
    private __period: ObservedPropertySimplePU<StatsPeriod>;
    get period() {
        return this.__period.get();
    }
    set period(newValue: StatsPeriod) {
        this.__period.set(newValue);
    }
    private __startDate: ObservedPropertyObjectPU<Date>;
    get startDate() {
        return this.__startDate.get();
    }
    set startDate(newValue: Date) {
        this.__startDate.set(newValue);
    }
    private __endDate: ObservedPropertyObjectPU<Date>;
    get endDate() {
        return this.__endDate.get();
    }
    set endDate(newValue: Date) {
        this.__endDate.set(newValue);
    }
    private __totalExpense: ObservedPropertySimplePU<number>;
    get totalExpense() {
        return this.__totalExpense.get();
    }
    set totalExpense(newValue: number) {
        this.__totalExpense.set(newValue);
    }
    private __totalIncome: ObservedPropertySimplePU<number>;
    get totalIncome() {
        return this.__totalIncome.get();
    }
    set totalIncome(newValue: number) {
        this.__totalIncome.set(newValue);
    }
    private __totalBalance: ObservedPropertySimplePU<number>;
    get totalBalance() {
        return this.__totalBalance.get();
    }
    set totalBalance(newValue: number) {
        this.__totalBalance.set(newValue);
    }
    private __categoryStats: ObservedPropertyObjectPU<CategoryStats[]>;
    get categoryStats() {
        return this.__categoryStats.get();
    }
    set categoryStats(newValue: CategoryStats[]) {
        this.__categoryStats.set(newValue);
    }
    private __dailyStats: ObservedPropertyObjectPU<DailyStats[]>;
    get dailyStats() {
        return this.__dailyStats.get();
    }
    set dailyStats(newValue: DailyStats[]) {
        this.__dailyStats.set(newValue);
    }
    private __topExpenses: ObservedPropertyObjectPU<Bill[]>;
    get topExpenses() {
        return this.__topExpenses.get();
    }
    set topExpenses(newValue: Bill[]) {
        this.__topExpenses.set(newValue);
    }
    private __topIncomes: ObservedPropertyObjectPU<Bill[]>;
    get topIncomes() {
        return this.__topIncomes.get();
    }
    set topIncomes(newValue: Bill[]) {
        this.__topIncomes.set(newValue);
    }
    private __allBillsInRange: ObservedPropertyObjectPU<Bill[]>;
    get allBillsInRange() {
        return this.__allBillsInRange.get();
    }
    set allBillsInRange(newValue: Bill[]) {
        this.__allBillsInRange.set(newValue);
    }
    private __showCategoryExpenseTab: ObservedPropertySimplePU<boolean>; // 分类统计的支出/收入切换
    get showCategoryExpenseTab() {
        return this.__showCategoryExpenseTab.get();
    }
    set showCategoryExpenseTab(newValue: boolean) {
        this.__showCategoryExpenseTab.set(newValue);
    }
    private __showTopBillsExpenseTab: ObservedPropertySimplePU<boolean>; // 单笔排行的支出/收入切换
    get showTopBillsExpenseTab() {
        return this.__showTopBillsExpenseTab.get();
    }
    set showTopBillsExpenseTab(newValue: boolean) {
        this.__showTopBillsExpenseTab.set(newValue);
    }
    private __categoryStatsForIncome: ObservedPropertyObjectPU<CategoryStats[]>; // 收入分类统计
    get categoryStatsForIncome() {
        return this.__categoryStatsForIncome.get();
    }
    set categoryStatsForIncome(newValue: CategoryStats[]) {
        this.__categoryStatsForIncome.set(newValue);
    }
    private __selectedDate: ObservedPropertyObjectPU<Date>; // 用于日期选择
    get selectedDate() {
        return this.__selectedDate.get();
    }
    set selectedDate(newValue: Date) {
        this.__selectedDate.set(newValue);
    }
    private __showYearPicker: ObservedPropertySimplePU<boolean>; // 年份选择器
    get showYearPicker() {
        return this.__showYearPicker.get();
    }
    set showYearPicker(newValue: boolean) {
        this.__showYearPicker.set(newValue);
    }
    private __showMonthPicker: ObservedPropertySimplePU<boolean>; // 月份选择器
    get showMonthPicker() {
        return this.__showMonthPicker.get();
    }
    set showMonthPicker(newValue: boolean) {
        this.__showMonthPicker.set(newValue);
    }
    private __showWeekPicker: ObservedPropertySimplePU<boolean>; // 周选择器
    get showWeekPicker() {
        return this.__showWeekPicker.get();
    }
    set showWeekPicker(newValue: boolean) {
        this.__showWeekPicker.set(newValue);
    }
    private __showCustomRangePicker: ObservedPropertySimplePU<boolean>; // 自定义范围选择器
    get showCustomRangePicker() {
        return this.__showCustomRangePicker.get();
    }
    set showCustomRangePicker(newValue: boolean) {
        this.__showCustomRangePicker.set(newValue);
    }
    private __tempSelectedYear: ObservedPropertySimplePU<number>;
    get tempSelectedYear() {
        return this.__tempSelectedYear.get();
    }
    set tempSelectedYear(newValue: number) {
        this.__tempSelectedYear.set(newValue);
    }
    private __tempSelectedMonth: ObservedPropertySimplePU<number>;
    get tempSelectedMonth() {
        return this.__tempSelectedMonth.get();
    }
    set tempSelectedMonth(newValue: number) {
        this.__tempSelectedMonth.set(newValue);
    }
    private __tempSelectedWeek: ObservedPropertySimplePU<number>;
    get tempSelectedWeek() {
        return this.__tempSelectedWeek.get();
    }
    set tempSelectedWeek(newValue: number) {
        this.__tempSelectedWeek.set(newValue);
    }
    private billService: BillService;
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
        }
        else if (this.period === 'month') {
            // 本月
            this.startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        }
        else if (this.period === 'year') {
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
        }
        catch (error) {
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
            // 确保账单日期是Date对象
            const billDate = bill.date instanceof Date ? bill.date : new Date(bill.date);
            // 重置时间部分，只比较日期
            const normalizedBillDate = new Date(billDate.getFullYear(), billDate.getMonth(), billDate.getDate());
            const dateStr = Utils.formatDate(normalizedBillDate, 'YYYY-MM-DD');
            const stats = dailyMap.get(dateStr);
            if (stats) {
                if (bill.isExpense()) {
                    stats.expense += bill.amount;
                }
                else {
                    stats.income += bill.amount;
                }
            }
            else {
                // 如果找不到匹配的日期，可能是账单日期在范围外，记录日志
                console.warn(`BillStatistics: 账单日期 ${dateStr} 不在统计范围内 (${Utils.formatDate(this.startDate, 'YYYY-MM-DD')} ~ ${Utils.formatDate(this.endDate, 'YYYY-MM-DD')})`);
            }
        });
        // 转换为数组并按日期排序
        this.dailyStats = Array.from(dailyMap.values()).sort((a, b) => {
            return a.date.localeCompare(b.date);
        });
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
        const displayStats = this.getDisplayStats();
        displayStats.forEach(stats => {
            if (stats.expense > max)
                max = stats.expense;
        });
        return max > 0 ? max : 100;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.debugLine("entry/src/main/ets/components/BillStatistics.ets(289:5)", "entry");
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(290:7)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(Constants.COLOR_BACKGROUND);
        }, Column);
        // 顶部导航栏
        this.buildHeader.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 可滚动内容区域
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/components/BillStatistics.ets(295:9)", "entry");
            // 可滚动内容区域
            Scroll.layoutWeight(1);
            // 可滚动内容区域
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(296:11)", "entry");
            Column.width('100%');
            Column.padding({ bottom: 20 });
        }, Column);
        // 总统计卡片
        this.buildSummaryCard.bind(this)();
        // AI分析建议
        this.buildAIAnalysis.bind(this)();
        // 消费趋势
        this.buildDailyTrend.bind(this)();
        // 分类构成
        this.buildCategoryChart.bind(this)();
        // 单笔收支排行
        this.buildTopBillsList.bind(this)();
        // 账单汇总
        this.buildBillSummary.bind(this)();
        Column.pop();
        // 可滚动内容区域
        Scroll.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 年份选择器
            if (this.showYearPicker) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(327:9)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('rgba(0,0,0,0.5)');
                        Column.justifyContent(FlexAlign.End);
                        Column.onClick(() => {
                            this.showYearPicker = false;
                        });
                    }, Column);
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(336:9)", "entry");
                        Column.width('100%');
                        Column.height(300);
                        Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
                        Column.borderRadius({ topLeft: 20, topRight: 20 });
                    }, Column);
                    this.buildYearPicker.bind(this)();
                    Column.pop();
                });
            }
            // 月份选择器
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 月份选择器
            if (this.showMonthPicker) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(347:9)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('rgba(0,0,0,0.5)');
                        Column.justifyContent(FlexAlign.End);
                        Column.onClick(() => {
                            this.showMonthPicker = false;
                        });
                    }, Column);
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(356:9)", "entry");
                        Column.width('100%');
                        Column.height(300);
                        Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
                        Column.borderRadius({ topLeft: 20, topRight: 20 });
                    }, Column);
                    this.buildMonthPicker.bind(this)();
                    Column.pop();
                });
            }
            // 周选择器
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 周选择器
            if (this.showWeekPicker) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(367:9)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('rgba(0,0,0,0.5)');
                        Column.justifyContent(FlexAlign.End);
                        Column.onClick(() => {
                            this.showWeekPicker = false;
                        });
                    }, Column);
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(376:9)", "entry");
                        Column.width('100%');
                        Column.height(300);
                        Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
                        Column.borderRadius({ topLeft: 20, topRight: 20 });
                    }, Column);
                    this.buildWeekPicker.bind(this)();
                    Column.pop();
                });
            }
            // 自定义范围选择器
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 自定义范围选择器
            if (this.showCustomRangePicker) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(387:9)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('rgba(0,0,0,0.5)');
                        Column.justifyContent(FlexAlign.End);
                        Column.onClick(() => {
                            this.showCustomRangePicker = false;
                        });
                    }, Column);
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(396:9)", "entry");
                        Column.width('100%');
                        Column.height(400);
                        Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
                        Column.borderRadius({ topLeft: 20, topRight: 20 });
                    }, Column);
                    this.buildCustomRangePicker.bind(this)();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
    }
    /**
     * 构建顶部导航栏
     */
    buildHeader(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(415:5)", "entry");
            Column.width('100%');
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 返回按钮和标题
            Row.create();
            Row.debugLine("entry/src/main/ets/components/BillStatistics.ets(417:7)", "entry");
            // 返回按钮和标题
            Row.width('100%');
            // 返回按钮和标题
            Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('←');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(418:9)", "entry");
            Text.fontSize(24);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            Text.onClick(() => {
                this.isShow = false;
            });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('账单统计');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(425:9)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            Text.margin({ left: 16 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/components/BillStatistics.ets(431:9)", "entry");
        }, Blank);
        Blank.pop();
        // 返回按钮和标题
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 周期切换
            Row.create();
            Row.debugLine("entry/src/main/ets/components/BillStatistics.ets(437:7)", "entry");
            // 周期切换
            Row.width('100%');
            // 周期切换
            Row.justifyContent(FlexAlign.SpaceAround);
            // 周期切换
            Row.padding({ left: 16, right: 16, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const p = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(this.getPeriodLabel(p));
                    Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(439:11)", "entry");
                    Text.fontSize(14);
                    Text.fontWeight(this.period === p ? FontWeight.Bold : FontWeight.Normal);
                    Text.fontColor(this.period === p ? Constants.COLOR_PRIMARY : Constants.COLOR_TEXT_SECONDARY);
                    Text.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                    Text.backgroundColor(this.period === p ? 'rgba(255, 107, 53, 0.1)' : 'transparent');
                    Text.borderRadius(16);
                    Text.onClick(() => {
                        this.switchPeriod(p);
                    });
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, ['week', 'month', 'year', 'custom'] as StatsPeriod[], forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        // 周期切换
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 日期范围显示（可点击选择）
            Text.create(this.getDateRangeText());
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(456:7)", "entry");
            // 日期范围显示（可点击选择）
            Text.fontSize(14);
            // 日期范围显示（可点击选择）
            Text.fontColor(Constants.COLOR_PRIMARY);
            // 日期范围显示（可点击选择）
            Text.padding({ bottom: 12 });
            // 日期范围显示（可点击选择）
            Text.onClick(() => {
                this.showDatePicker();
            });
        }, Text);
        // 日期范围显示（可点击选择）
        Text.pop();
        Column.pop();
    }
    /**
     * 获取周期标签
     */
    getPeriodLabel(period: StatsPeriod): string {
        if (period === 'week')
            return '周';
        if (period === 'month')
            return '月';
        if (period === 'year')
            return '年';
        return '自定义';
    }
    /**
     * 显示日期选择器
     */
    showDatePicker(): void {
        if (this.period === 'custom') {
            // 自定义：显示自定义范围选择器
            this.showCustomRangePicker = true;
        }
        else if (this.period === 'week') {
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
        }
        else if (this.period === 'month') {
            // 月：显示月份选择器
            this.tempSelectedYear = this.startDate.getFullYear();
            this.tempSelectedMonth = this.startDate.getMonth();
            this.showMonthPicker = true;
        }
        else if (this.period === 'year') {
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
    buildSummaryCard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/BillStatistics.ets(628:5)", "entry");
            Row.width('100%');
            Row.padding(16);
            Row.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Row.borderRadius(12);
            Row.margin({ left: 16, right: 16, top: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(629:7)", "entry");
            Column.layoutWeight(1);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('支出');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(630:9)", "entry");
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`¥${this.totalExpense.toFixed(2)}`);
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(633:9)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_DANGER);
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(642:7)", "entry");
            Column.layoutWeight(1);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('收入');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(643:9)", "entry");
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`¥${this.totalIncome.toFixed(2)}`);
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(646:9)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_SUCCESS);
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(655:7)", "entry");
            Column.layoutWeight(1);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('结余');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(656:9)", "entry");
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`¥${this.totalBalance.toFixed(2)}`);
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(659:9)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_PRIMARY);
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
    }
    /**
     * 构建AI分析建议
     */
    buildAIAnalysis(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(681:5)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Column.borderRadius(12);
            Column.margin({ left: 16, right: 16, top: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/BillStatistics.ets(682:7)", "entry");
            Row.width('100%');
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('🤖');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(683:9)", "entry");
            Text.fontSize(20);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AI分析了解您');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(685:9)", "entry");
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(694:7)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor('#FFF8E1');
            Column.borderRadius(12);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('💡');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(695:9)", "entry");
            Text.fontSize(24);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getAIAnalysisText());
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(699:9)", "entry");
            Text.fontSize(13);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.textAlign(TextAlign.Center);
            Text.lineHeight(20);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('更多消费分析，请记录更多~');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(710:7)", "entry");
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.margin({ top: 8 });
        }, Text);
        Text.pop();
        Column.pop();
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
     * 获取要显示的统计数据
     */
    getDisplayStats(): DailyStats[] {
        if (this.period === 'year') {
            // 年视图：显示每月的数据（按月汇总）
            return this.getMonthlyStats();
        }
        else if (this.period === 'month') {
            // 月视图：显示最近30天或全部天数（最多显示30个点）
            return this.dailyStats.length > 30 ? this.dailyStats.slice(-30) : this.dailyStats;
        }
        else if (this.period === 'week') {
            // 周视图：显示全部7天
            return this.dailyStats;
        }
        else {
            // 自定义视图：如果超过30天，只显示最近30天，否则显示全部
            return this.dailyStats.length > 30 ? this.dailyStats.slice(-30) : this.dailyStats;
        }
    }
    /**
     * 构建消费趋势
     */
    buildDailyTrend(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(773:5)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Column.borderRadius(12);
            Column.margin({ left: 16, right: 16, top: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('消费趋势');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(774:7)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            Text.width('100%');
            Text.margin({ bottom: 16 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.getDisplayStats().length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无数据');
                        Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(782:9)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.width('100%');
                        Text.height(120);
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 简易柱状图
                        Row.create();
                        Row.debugLine("entry/src/main/ets/components/BillStatistics.ets(790:9)", "entry");
                        // 简易柱状图
                        Row.width('100%');
                        // 简易柱状图
                        Row.height(140);
                        // 简易柱状图
                        Row.padding({ top: 20 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const stats = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(792:13)", "entry");
                                Column.layoutWeight(1);
                                Column.height(120);
                                Column.justifyContent(FlexAlign.End);
                                Column.alignItems(HorizontalAlign.Center);
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 柱子
                                Column.create();
                                Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(794:15)", "entry");
                                // 柱子
                                Column.width(24);
                                // 柱子
                                Column.height(`${Math.max((stats.expense / this.getMaxDailyExpense()) * 100, 5)}%`);
                                // 柱子
                                Column.backgroundColor(Constants.COLOR_PRIMARY);
                                // 柱子
                                Column.borderRadius({ topLeft: 4, topRight: 4 });
                            }, Column);
                            // 柱子
                            Column.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 日期标签
                                Text.create(stats.dateLabel);
                                Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(801:15)", "entry");
                                // 日期标签
                                Text.fontSize(10);
                                // 日期标签
                                Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                                // 日期标签
                                Text.margin({ top: 4 });
                            }, Text);
                            // 日期标签
                            Text.pop();
                            Column.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.getDisplayStats(), forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    // 简易柱状图
                    Row.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    /**
     * 获取月度统计数据（用于年视图）
     */
    getMonthlyStats(): DailyStats[] {
        const monthlyMap: Map<string, DailyStats> = new Map();
        // 按月汇总
        this.dailyStats.forEach(stat => {
            const monthKey = stat.date.substring(0, 7); // YYYY-MM
            const existing = monthlyMap.get(monthKey);
            if (existing) {
                existing.expense += stat.expense;
                existing.income += stat.income;
            }
            else {
                monthlyMap.set(monthKey, {
                    date: monthKey,
                    dateLabel: monthKey.substring(5),
                    expense: stat.expense,
                    income: stat.income
                });
            }
        });
        return Array.from(monthlyMap.values()).sort((a, b) => a.date.localeCompare(b.date));
    }
    /**
     * 构建分类构成
     */
    buildCategoryChart(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(856:5)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Column.borderRadius(12);
            Column.margin({ left: 16, right: 16, top: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题和切换
            Row.create();
            Row.debugLine("entry/src/main/ets/components/BillStatistics.ets(858:7)", "entry");
            // 标题和切换
            Row.width('100%');
            // 标题和切换
            Row.margin({ bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('分类构成');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(859:9)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/components/BillStatistics.ets(864:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('支出');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(866:9)", "entry");
            Text.fontSize(13);
            Text.fontColor(this.showCategoryExpenseTab ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY);
            Text.padding({ left: 12, right: 12, top: 6, bottom: 6 });
            Text.backgroundColor(this.showCategoryExpenseTab ? Constants.COLOR_PRIMARY : Constants.COLOR_BACKGROUND);
            Text.borderRadius(14);
            Text.margin({ right: 8 });
            Text.onClick(() => { this.showCategoryExpenseTab = true; });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('收入');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(875:9)", "entry");
            Text.fontSize(13);
            Text.fontColor(!this.showCategoryExpenseTab ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY);
            Text.padding({ left: 12, right: 12, top: 6, bottom: 6 });
            Text.backgroundColor(!this.showCategoryExpenseTab ? Constants.COLOR_SUCCESS : Constants.COLOR_BACKGROUND);
            Text.borderRadius(14);
            Text.onClick(() => { this.showCategoryExpenseTab = false; });
        }, Text);
        Text.pop();
        // 标题和切换
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 总金额显示
            Column.create();
            Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(887:7)", "entry");
            // 总金额显示
            Column.width('100%');
            // 总金额显示
            Column.alignItems(HorizontalAlign.Center);
            // 总金额显示
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.showCategoryExpenseTab ? '总支出' : '总收入');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(888:9)", "entry");
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`¥${this.showCategoryExpenseTab ? this.totalExpense.toFixed(2) : this.totalIncome.toFixed(2)}`);
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(891:9)", "entry");
            Text.fontSize(28);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.showCategoryExpenseTab ? Constants.COLOR_DANGER : Constants.COLOR_SUCCESS);
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        // 总金额显示
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 分类列表
            if ((this.showCategoryExpenseTab ? this.categoryStats : this.categoryStatsForIncome).length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const stat = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.debugLine("entry/src/main/ets/components/BillStatistics.ets(904:11)", "entry");
                                Row.width('100%');
                                Row.padding({ top: 10, bottom: 10 });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 图标
                                Text.create(stat.icon);
                                Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(906:13)", "entry");
                                // 图标
                                Text.fontSize(20);
                                // 图标
                                Text.width(32);
                            }, Text);
                            // 图标
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 分类名和百分比
                                Column.create();
                                Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(911:13)", "entry");
                                // 分类名和百分比
                                Column.layoutWeight(1);
                                // 分类名和百分比
                                Column.margin({ left: 12 });
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.debugLine("entry/src/main/ets/components/BillStatistics.ets(912:15)", "entry");
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(stat.name);
                                Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(913:17)", "entry");
                                Text.fontSize(14);
                                Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(`${stat.percentage.toFixed(1)}%`);
                                Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(916:17)", "entry");
                                Text.fontSize(12);
                                Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                                Text.margin({ left: 8 });
                            }, Text);
                            Text.pop();
                            Row.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 进度条
                                Row.create();
                                Row.debugLine("entry/src/main/ets/components/BillStatistics.ets(923:15)", "entry");
                                // 进度条
                                Row.width('100%');
                                // 进度条
                                Row.height(6);
                                // 进度条
                                Row.backgroundColor(Constants.COLOR_BORDER);
                                // 进度条
                                Row.borderRadius(3);
                                // 进度条
                                Row.margin({ top: 6 });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.debugLine("entry/src/main/ets/components/BillStatistics.ets(924:17)", "entry");
                                Row.width(`${stat.percentage}%`);
                                Row.height(6);
                                Row.backgroundColor(Constants.COLOR_PRIMARY);
                                Row.borderRadius(3);
                            }, Row);
                            Row.pop();
                            // 进度条
                            Row.pop();
                            // 分类名和百分比
                            Column.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 金额
                                Text.create(`¥${stat.amount.toFixed(2)}`);
                                Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(940:13)", "entry");
                                // 金额
                                Text.fontSize(14);
                                // 金额
                                Text.fontWeight(FontWeight.Medium);
                                // 金额
                                Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
                            }, Text);
                            // 金额
                            Text.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.showCategoryExpenseTab ? this.categoryStats : this.categoryStatsForIncome, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无数据');
                        Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(949:9)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.padding(20);
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    /**
     * 构建单笔收支排行
     */
    buildTopBillsList(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(968:5)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Column.borderRadius(12);
            Column.margin({ left: 16, right: 16, top: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题和切换
            Row.create();
            Row.debugLine("entry/src/main/ets/components/BillStatistics.ets(970:7)", "entry");
            // 标题和切换
            Row.width('100%');
            // 标题和切换
            Row.margin({ bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('收入排行');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(971:9)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/components/BillStatistics.ets(976:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('支出');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(978:9)", "entry");
            Text.fontSize(13);
            Text.fontColor(this.showTopBillsExpenseTab ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY);
            Text.padding({ left: 12, right: 12, top: 6, bottom: 6 });
            Text.backgroundColor(this.showTopBillsExpenseTab ? Constants.COLOR_PRIMARY : Constants.COLOR_BACKGROUND);
            Text.borderRadius(14);
            Text.margin({ right: 8 });
            Text.onClick(() => { this.showTopBillsExpenseTab = true; });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('收入');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(987:9)", "entry");
            Text.fontSize(13);
            Text.fontColor(!this.showTopBillsExpenseTab ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY);
            Text.padding({ left: 12, right: 12, top: 6, bottom: 6 });
            Text.backgroundColor(!this.showTopBillsExpenseTab ? Constants.COLOR_SUCCESS : Constants.COLOR_BACKGROUND);
            Text.borderRadius(14);
            Text.onClick(() => { this.showTopBillsExpenseTab = false; });
        }, Text);
        Text.pop();
        // 标题和切换
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 排行列表
            if ((this.showTopBillsExpenseTab ? this.topExpenses : this.topIncomes).length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const bill = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.debugLine("entry/src/main/ets/components/BillStatistics.ets(1001:11)", "entry");
                                Row.width('100%');
                                Row.padding({ top: 10, bottom: 10 });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 排名
                                Text.create(`${index + 1}`);
                                Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(1003:13)", "entry");
                                // 排名
                                Text.fontSize(14);
                                // 排名
                                Text.fontWeight(FontWeight.Bold);
                                // 排名
                                Text.fontColor(index < 3 ? Constants.COLOR_PRIMARY : Constants.COLOR_TEXT_SECONDARY);
                                // 排名
                                Text.width(24);
                            }, Text);
                            // 排名
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 图标
                                Column.create();
                                Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(1010:13)", "entry");
                                // 图标
                                Column.width(36);
                                // 图标
                                Column.height(36);
                                // 图标
                                Column.backgroundColor(bill.isIncome() ? 'rgba(255, 167, 38, 0.15)' : 'rgba(255, 107, 53, 0.1)');
                                // 图标
                                Column.borderRadius(18);
                                // 图标
                                Column.justifyContent(FlexAlign.Center);
                                // 图标
                                Column.margin({ left: 8 });
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(this.getCategoryIcon(bill.category));
                                Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(1011:15)", "entry");
                                Text.fontSize(18);
                            }, Text);
                            Text.pop();
                            // 图标
                            Column.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 描述
                                Column.create();
                                Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(1022:13)", "entry");
                                // 描述
                                Column.layoutWeight(1);
                                // 描述
                                Column.alignItems(HorizontalAlign.Start);
                                // 描述
                                Column.margin({ left: 12 });
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(bill.description || this.getCategoryName(bill.category));
                                Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(1023:15)", "entry");
                                Text.fontSize(14);
                                Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
                                Text.maxLines(1);
                                Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(Utils.formatDate(bill.date, 'MM月DD日'));
                                Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(1028:15)", "entry");
                                Text.fontSize(12);
                                Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                                Text.margin({ top: 2 });
                            }, Text);
                            Text.pop();
                            // 描述
                            Column.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 金额
                                Text.create(`¥${bill.amount.toFixed(2)}`);
                                Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(1038:13)", "entry");
                                // 金额
                                Text.fontSize(15);
                                // 金额
                                Text.fontWeight(FontWeight.Bold);
                                // 金额
                                Text.fontColor(bill.isIncome() ? Constants.COLOR_SUCCESS : Constants.COLOR_DANGER);
                            }, Text);
                            // 金额
                            Text.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.showTopBillsExpenseTab ? this.topExpenses : this.topIncomes, forEachItemGenFunction, undefined, true, false);
                    }, ForEach);
                    ForEach.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无数据');
                        Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(1047:9)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.padding(20);
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    /**
     * 构建账单汇总
     */
    buildBillSummary(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(1066:5)", "entry");
            Column.width('100%');
            Column.padding(16);
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Column.borderRadius(12);
            Column.margin({ left: 16, right: 16, top: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('账单汇总');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(1067:7)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            Text.width('100%');
            Text.margin({ bottom: 16 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 表头
            Row.create();
            Row.debugLine("entry/src/main/ets/components/BillStatistics.ets(1075:7)", "entry");
            // 表头
            Row.width('100%');
            // 表头
            Row.padding({ top: 10, bottom: 10 });
            // 表头
            Row.backgroundColor(Constants.COLOR_BACKGROUND);
            // 表头
            Row.borderRadius(8);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('日期');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(1076:9)", "entry");
            Text.fontSize(13);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getAmountLabel('支出'));
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(1081:9)", "entry");
            Text.fontSize(13);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getAmountLabel('收入'));
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(1086:9)", "entry");
            Text.fontSize(13);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getAmountLabel('结余'));
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(1091:9)", "entry");
            Text.fontSize(13);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        // 表头
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 数据行
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const stats = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.debugLine("entry/src/main/ets/components/BillStatistics.ets(1104:9)", "entry");
                    Row.width('100%');
                    Row.padding({ top: 12, bottom: 12 });
                    Row.borderWidth({ bottom: 1 });
                    Row.borderColor(Constants.COLOR_DIVIDER);
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(stats.dateLabel);
                    Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(1105:11)", "entry");
                    Text.fontSize(13);
                    Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
                    Text.layoutWeight(1);
                    Text.textAlign(TextAlign.Center);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(this.formatAmount(stats.expense, true));
                    Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(1110:11)", "entry");
                    Text.fontSize(13);
                    Text.fontColor(stats.expense > 0 ? Constants.COLOR_DANGER : Constants.COLOR_TEXT_SECONDARY);
                    Text.layoutWeight(1);
                    Text.textAlign(TextAlign.Center);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(this.formatAmount(stats.income, false));
                    Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(1115:11)", "entry");
                    Text.fontSize(13);
                    Text.fontColor(stats.income > 0 ? Constants.COLOR_SUCCESS : Constants.COLOR_TEXT_SECONDARY);
                    Text.layoutWeight(1);
                    Text.textAlign(TextAlign.Center);
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(this.formatBalanceAmount(stats.income - stats.expense));
                    Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(1120:11)", "entry");
                    Text.fontSize(13);
                    Text.fontColor((stats.income - stats.expense) >= 0 ? Constants.COLOR_PRIMARY : Constants.COLOR_DANGER);
                    Text.layoutWeight(1);
                    Text.textAlign(TextAlign.Center);
                }, Text);
                Text.pop();
                Row.pop();
            };
            this.forEachUpdateFunction(elmtId, this.dailyStats.slice().reverse().slice(0, 10), forEachItemGenFunction);
        }, ForEach);
        // 数据行
        ForEach.pop();
        Column.pop();
    }
    /**
     * 获取分类图标
     */
    getCategoryIcon(category: BillCategory): string {
        if (category === BillCategory.FOOD)
            return '🍔';
        if (category === BillCategory.TRANSPORT)
            return '🚗';
        if (category === BillCategory.SHOPPING)
            return '🛍️';
        if (category === BillCategory.ENTERTAINMENT)
            return '🎬';
        if (category === BillCategory.MEDICAL)
            return '🏥';
        if (category === BillCategory.EDUCATION)
            return '📚';
        if (category === BillCategory.HOUSING)
            return '🏠';
        if (category === BillCategory.UTILITIES)
            return '💡';
        if (category === BillCategory.SALARY)
            return '💰';
        if (category === BillCategory.BONUS)
            return '🎁';
        if (category === BillCategory.INVESTMENT)
            return '📈';
        if (category === BillCategory.GIFT)
            return '🎁';
        return '📝';
    }
    /**
     * 获取金额标签（根据周期类型显示不同的标签）
     */
    getAmountLabel(baseLabel: string): string {
        if (this.period === 'year') {
            return `${baseLabel}(年均)`;
        }
        else if (this.period === 'month' || this.period === 'week') {
            return `${baseLabel}(日均)`;
        }
        else {
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
        if (amount <= 0)
            return '-';
        let displayAmount = amount;
        if (this.period === 'year') {
            // 年界面：显示年均（总金额除以总天数）
            const days = Math.floor((this.endDate.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            const totalAmount = isExpense ? this.totalExpense : this.totalIncome;
            displayAmount = days > 0 ? totalAmount / days : 0;
        }
        else if (this.period === 'month' || this.period === 'week') {
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
        }
        else if (this.period === 'month' || this.period === 'week') {
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
        if (category === BillCategory.FOOD)
            return '餐饮';
        if (category === BillCategory.TRANSPORT)
            return '交通';
        if (category === BillCategory.SHOPPING)
            return '购物';
        if (category === BillCategory.ENTERTAINMENT)
            return '娱乐';
        if (category === BillCategory.MEDICAL)
            return '医疗';
        if (category === BillCategory.EDUCATION)
            return '教育';
        if (category === BillCategory.HOUSING)
            return '住房';
        if (category === BillCategory.UTILITIES)
            return '水电';
        if (category === BillCategory.SALARY)
            return '工资';
        if (category === BillCategory.BONUS)
            return '奖金';
        if (category === BillCategory.INVESTMENT)
            return '投资';
        if (category === BillCategory.GIFT)
            return '礼金';
        if (category === BillCategory.OTHER_EXPENSE)
            return '其他支出';
        if (category === BillCategory.OTHER_INCOME)
            return '其他收入';
        return '其他';
    }
    /**
     * 构建年份选择器
     */
    buildYearPicker(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(1241:5)", "entry");
            Column.width('100%');
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/BillStatistics.ets(1242:7)", "entry");
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('取消');
            Button.debugLine("entry/src/main/ets/components/BillStatistics.ets(1243:9)", "entry");
            Button.type(ButtonType.Normal);
            Button.backgroundColor(Color.Transparent);
            Button.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Button.onClick(() => {
                this.showYearPicker = false;
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/components/BillStatistics.ets(1251:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('选择年份');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(1253:9)", "entry");
            Text.fontSize(17);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/components/BillStatistics.ets(1258:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('确定');
            Button.debugLine("entry/src/main/ets/components/BillStatistics.ets(1260:9)", "entry");
            Button.type(ButtonType.Normal);
            Button.backgroundColor(Color.Transparent);
            Button.fontColor(Constants.COLOR_PRIMARY);
            Button.onClick(() => {
                this.confirmYearSelection();
            });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextPicker.create({
                range: this.getYears().map(y => `${y}年`),
                selected: this.tempSelectedYear - (new Date().getFullYear() - 50)
            });
            TextPicker.debugLine("entry/src/main/ets/components/BillStatistics.ets(1271:7)", "entry");
            TextPicker.onChange((value: string | string[], index: number | number[]) => {
                if (typeof index === 'number') {
                    this.tempSelectedYear = new Date().getFullYear() - 50 + index;
                }
            });
            TextPicker.height(200);
        }, TextPicker);
        TextPicker.pop();
        Column.pop();
    }
    /**
     * 构建月份选择器
     */
    buildMonthPicker(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(1291:5)", "entry");
            Column.width('100%');
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/BillStatistics.ets(1292:7)", "entry");
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('取消');
            Button.debugLine("entry/src/main/ets/components/BillStatistics.ets(1293:9)", "entry");
            Button.type(ButtonType.Normal);
            Button.backgroundColor(Color.Transparent);
            Button.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Button.onClick(() => {
                this.showMonthPicker = false;
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/components/BillStatistics.ets(1301:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('选择年月');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(1303:9)", "entry");
            Text.fontSize(17);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/components/BillStatistics.ets(1308:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('确定');
            Button.debugLine("entry/src/main/ets/components/BillStatistics.ets(1310:9)", "entry");
            Button.type(ButtonType.Normal);
            Button.backgroundColor(Color.Transparent);
            Button.fontColor(Constants.COLOR_PRIMARY);
            Button.onClick(() => {
                this.confirmMonthSelection();
            });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/BillStatistics.ets(1321:7)", "entry");
            Row.width('100%');
            Row.height(200);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextPicker.create({
                range: this.getYears().map(y => `${y}年`),
                selected: this.tempSelectedYear - (new Date().getFullYear() - 50)
            });
            TextPicker.debugLine("entry/src/main/ets/components/BillStatistics.ets(1322:9)", "entry");
            TextPicker.layoutWeight(1);
            TextPicker.onChange((value: string | string[], index: number | number[]) => {
                if (typeof index === 'number') {
                    this.tempSelectedYear = new Date().getFullYear() - 50 + index;
                }
            });
        }, TextPicker);
        TextPicker.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextPicker.create({
                range: this.getMonths().map(m => `${m + 1}月`),
                selected: this.tempSelectedMonth
            });
            TextPicker.debugLine("entry/src/main/ets/components/BillStatistics.ets(1333:9)", "entry");
            TextPicker.layoutWeight(1);
            TextPicker.onChange((value: string | string[], index: number | number[]) => {
                if (typeof index === 'number') {
                    this.tempSelectedMonth = index;
                }
            });
        }, TextPicker);
        TextPicker.pop();
        Row.pop();
        Column.pop();
    }
    /**
     * 构建周选择器
     */
    buildWeekPicker(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(1356:5)", "entry");
            Column.width('100%');
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/BillStatistics.ets(1357:7)", "entry");
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('取消');
            Button.debugLine("entry/src/main/ets/components/BillStatistics.ets(1358:9)", "entry");
            Button.type(ButtonType.Normal);
            Button.backgroundColor(Color.Transparent);
            Button.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Button.onClick(() => {
                this.showWeekPicker = false;
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/components/BillStatistics.ets(1366:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('选择周');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(1368:9)", "entry");
            Text.fontSize(17);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/components/BillStatistics.ets(1373:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('确定');
            Button.debugLine("entry/src/main/ets/components/BillStatistics.ets(1375:9)", "entry");
            Button.type(ButtonType.Normal);
            Button.backgroundColor(Color.Transparent);
            Button.fontColor(Constants.COLOR_PRIMARY);
            Button.onClick(() => {
                this.confirmWeekSelection();
            });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/BillStatistics.ets(1386:7)", "entry");
            Row.width('100%');
            Row.height(200);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextPicker.create({
                range: this.getYears().map(y => `${y}年`),
                selected: this.tempSelectedYear - (new Date().getFullYear() - 50)
            });
            TextPicker.debugLine("entry/src/main/ets/components/BillStatistics.ets(1387:9)", "entry");
            TextPicker.layoutWeight(1);
            TextPicker.onChange((value: string | string[], index: number | number[]) => {
                if (typeof index === 'number') {
                    this.tempSelectedYear = new Date().getFullYear() - 50 + index;
                }
            });
        }, TextPicker);
        TextPicker.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextPicker.create({
                range: this.getWeeks().map(w => `第${w}周`),
                selected: this.tempSelectedWeek - 1
            });
            TextPicker.debugLine("entry/src/main/ets/components/BillStatistics.ets(1398:9)", "entry");
            TextPicker.layoutWeight(1);
            TextPicker.onChange((value: string | string[], index: number | number[]) => {
                if (typeof index === 'number') {
                    this.tempSelectedWeek = index + 1;
                }
            });
        }, TextPicker);
        TextPicker.pop();
        Row.pop();
        Column.pop();
    }
    /**
     * 构建自定义范围选择器
     */
    buildCustomRangePicker(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(1421:5)", "entry");
            Column.width('100%');
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/BillStatistics.ets(1422:7)", "entry");
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('取消');
            Button.debugLine("entry/src/main/ets/components/BillStatistics.ets(1423:9)", "entry");
            Button.type(ButtonType.Normal);
            Button.backgroundColor(Color.Transparent);
            Button.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Button.onClick(() => {
                this.showCustomRangePicker = false;
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/components/BillStatistics.ets(1431:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('选择日期范围');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(1433:9)", "entry");
            Text.fontSize(17);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/components/BillStatistics.ets(1438:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('确定');
            Button.debugLine("entry/src/main/ets/components/BillStatistics.ets(1440:9)", "entry");
            Button.type(ButtonType.Normal);
            Button.backgroundColor(Color.Transparent);
            Button.fontColor(Constants.COLOR_PRIMARY);
            Button.onClick(() => {
                this.confirmCustomRangeSelection();
            });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(1451:7)", "entry");
            Column.width('100%');
            Column.padding({ left: 16, right: 16, top: 8, bottom: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('开始日期');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(1452:9)", "entry");
            Text.fontSize(14);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.width('100%');
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(Utils.formatDate(ObservedObject.GetRawObject(this.startDate), 'YYYY-MM-DD'));
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(1458:9)", "entry");
            Text.fontSize(16);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            Text.width('100%');
            Text.padding(12);
            Text.backgroundColor(Constants.COLOR_BACKGROUND);
            Text.borderRadius(8);
            Text.onClick(() => {
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
            });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/BillStatistics.ets(1481:7)", "entry");
            Column.width('100%');
            Column.padding({ left: 16, right: 16, top: 8, bottom: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('结束日期');
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(1482:9)", "entry");
            Text.fontSize(14);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.width('100%');
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(Utils.formatDate(ObservedObject.GetRawObject(this.endDate), 'YYYY-MM-DD'));
            Text.debugLine("entry/src/main/ets/components/BillStatistics.ets(1488:9)", "entry");
            Text.fontSize(16);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            Text.width('100%');
            Text.padding(12);
            Text.backgroundColor(Constants.COLOR_BACKGROUND);
            Text.borderRadius(8);
            Text.onClick(() => {
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
            });
        }, Text);
        Text.pop();
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
