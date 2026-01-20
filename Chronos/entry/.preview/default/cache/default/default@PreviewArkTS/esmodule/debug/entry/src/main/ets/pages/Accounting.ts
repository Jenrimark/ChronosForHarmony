if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Accounting_Params {
    bills?: Bill[];
    todayBills?: Bill[];
    todayIncome?: number;
    todayExpense?: number;
    monthExpense?: number;
    monthIncome?: number;
    monthBalance?: number;
    showAddBillDialog?: boolean;
    inputText?: string;
    isRecording?: boolean;
    isProcessing?: boolean;
    recordingDuration?: number;
    recordingTimer?: number;
    isLongPressing?: boolean;
    longPressTimer?: number;
    selectedType?: BillType;
    selectedCategory?: BillCategory;
    amountText?: string;
    description?: string;
    selectedBill?: Bill | null;
    showBillDetail?: boolean;
    historyBillGroups?: BillGroup[];
    monthBudget?: number;
    showBudgetDialog?: boolean;
    budgetInputText?: string;
    BUDGET_KEY?: string;
    showStatistics?: boolean;
    expenseCategories?: CategoryItem[];
    incomeCategories?: CategoryItem[];
    billService?: BillService;
    aiService?: MimoAIService;
    audioRecorderService?: AudioRecorderService;
    speechRecognitionService?: SpeechRecognitionService;
}
import { BillService } from "@normalized:N&&&entry/src/main/ets/service/BillService&";
import { Bill, BillType, BillCategory } from "@normalized:N&&&entry/src/main/ets/model/Bill&";
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import { Utils } from "@normalized:N&&&entry/src/main/ets/common/Utils&";
import { MimoAIService } from "@normalized:N&&&entry/src/main/ets/service/MimoAIService&";
import type { BillRecognitionResult } from "@normalized:N&&&entry/src/main/ets/service/MimoAIService&";
import { AudioRecorderService } from "@normalized:N&&&entry/src/main/ets/service/AudioRecorderService&";
import { SpeechRecognitionService } from "@normalized:N&&&entry/src/main/ets/service/SpeechRecognitionService&";
import { BillStatistics } from "@normalized:N&&&entry/src/main/ets/components/BillStatistics&";
import promptAction from "@ohos:promptAction";
import type common from "@ohos:app.ability.common";
import preferences from "@ohos:data.preferences";
/**
 * 账单分组接口
 */
interface BillGroup {
    date: string;
    bills: Bill[];
}
/**
 * 分类项接口
 */
interface CategoryItem {
    category: BillCategory;
    icon: string;
    name: string;
}
export class Accounting extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__bills = new ObservedPropertyObjectPU([], this, "bills");
        this.__todayBills = new ObservedPropertyObjectPU([], this, "todayBills");
        this.__todayIncome = new ObservedPropertySimplePU(0, this, "todayIncome");
        this.__todayExpense = new ObservedPropertySimplePU(0, this, "todayExpense");
        this.__monthExpense = new ObservedPropertySimplePU(0, this, "monthExpense");
        this.__monthIncome = new ObservedPropertySimplePU(0, this, "monthIncome");
        this.__monthBalance = new ObservedPropertySimplePU(0, this, "monthBalance");
        this.__showAddBillDialog = new ObservedPropertySimplePU(false, this, "showAddBillDialog");
        this.__inputText = new ObservedPropertySimplePU('', this, "inputText");
        this.__isRecording = new ObservedPropertySimplePU(false, this, "isRecording");
        this.__isProcessing = new ObservedPropertySimplePU(false, this, "isProcessing");
        this.__recordingDuration = new ObservedPropertySimplePU(0, this, "recordingDuration");
        this.__recordingTimer = new ObservedPropertySimplePU(0, this, "recordingTimer");
        this.__isLongPressing = new ObservedPropertySimplePU(false, this, "isLongPressing");
        this.longPressTimer = 0;
        this.__selectedType = new ObservedPropertySimplePU(BillType.EXPENSE, this, "selectedType");
        this.__selectedCategory = new ObservedPropertySimplePU(BillCategory.FOOD, this, "selectedCategory");
        this.__amountText = new ObservedPropertySimplePU('', this, "amountText");
        this.__description = new ObservedPropertySimplePU('', this, "description");
        this.__selectedBill = new ObservedPropertyObjectPU(null, this, "selectedBill");
        this.__showBillDetail = new ObservedPropertySimplePU(false, this, "showBillDetail");
        this.__historyBillGroups = new ObservedPropertyObjectPU([], this, "historyBillGroups");
        this.__monthBudget = new ObservedPropertySimplePU(0, this, "monthBudget");
        this.__showBudgetDialog = new ObservedPropertySimplePU(false, this, "showBudgetDialog");
        this.__budgetInputText = new ObservedPropertySimplePU('', this, "budgetInputText");
        this.BUDGET_KEY = 'month_budget';
        this.__showStatistics = new ObservedPropertySimplePU(false, this, "showStatistics");
        this.expenseCategories = [
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
        this.incomeCategories = [
            { category: BillCategory.SALARY, icon: '💰', name: '工资' },
            { category: BillCategory.BONUS, icon: '🎁', name: '奖金' },
            { category: BillCategory.INVESTMENT, icon: '📈', name: '投资' },
            { category: BillCategory.GIFT, icon: '🎀', name: '礼金' },
            { category: BillCategory.OTHER_INCOME, icon: '📝', name: '其他' }
        ];
        this.billService = BillService.getInstance();
        this.aiService = MimoAIService.getInstance();
        this.audioRecorderService = AudioRecorderService.getInstance();
        this.speechRecognitionService = SpeechRecognitionService.getInstance();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Accounting_Params) {
        if (params.bills !== undefined) {
            this.bills = params.bills;
        }
        if (params.todayBills !== undefined) {
            this.todayBills = params.todayBills;
        }
        if (params.todayIncome !== undefined) {
            this.todayIncome = params.todayIncome;
        }
        if (params.todayExpense !== undefined) {
            this.todayExpense = params.todayExpense;
        }
        if (params.monthExpense !== undefined) {
            this.monthExpense = params.monthExpense;
        }
        if (params.monthIncome !== undefined) {
            this.monthIncome = params.monthIncome;
        }
        if (params.monthBalance !== undefined) {
            this.monthBalance = params.monthBalance;
        }
        if (params.showAddBillDialog !== undefined) {
            this.showAddBillDialog = params.showAddBillDialog;
        }
        if (params.inputText !== undefined) {
            this.inputText = params.inputText;
        }
        if (params.isRecording !== undefined) {
            this.isRecording = params.isRecording;
        }
        if (params.isProcessing !== undefined) {
            this.isProcessing = params.isProcessing;
        }
        if (params.recordingDuration !== undefined) {
            this.recordingDuration = params.recordingDuration;
        }
        if (params.recordingTimer !== undefined) {
            this.recordingTimer = params.recordingTimer;
        }
        if (params.isLongPressing !== undefined) {
            this.isLongPressing = params.isLongPressing;
        }
        if (params.longPressTimer !== undefined) {
            this.longPressTimer = params.longPressTimer;
        }
        if (params.selectedType !== undefined) {
            this.selectedType = params.selectedType;
        }
        if (params.selectedCategory !== undefined) {
            this.selectedCategory = params.selectedCategory;
        }
        if (params.amountText !== undefined) {
            this.amountText = params.amountText;
        }
        if (params.description !== undefined) {
            this.description = params.description;
        }
        if (params.selectedBill !== undefined) {
            this.selectedBill = params.selectedBill;
        }
        if (params.showBillDetail !== undefined) {
            this.showBillDetail = params.showBillDetail;
        }
        if (params.historyBillGroups !== undefined) {
            this.historyBillGroups = params.historyBillGroups;
        }
        if (params.monthBudget !== undefined) {
            this.monthBudget = params.monthBudget;
        }
        if (params.showBudgetDialog !== undefined) {
            this.showBudgetDialog = params.showBudgetDialog;
        }
        if (params.budgetInputText !== undefined) {
            this.budgetInputText = params.budgetInputText;
        }
        if (params.BUDGET_KEY !== undefined) {
            this.BUDGET_KEY = params.BUDGET_KEY;
        }
        if (params.showStatistics !== undefined) {
            this.showStatistics = params.showStatistics;
        }
        if (params.expenseCategories !== undefined) {
            this.expenseCategories = params.expenseCategories;
        }
        if (params.incomeCategories !== undefined) {
            this.incomeCategories = params.incomeCategories;
        }
        if (params.billService !== undefined) {
            this.billService = params.billService;
        }
        if (params.aiService !== undefined) {
            this.aiService = params.aiService;
        }
        if (params.audioRecorderService !== undefined) {
            this.audioRecorderService = params.audioRecorderService;
        }
        if (params.speechRecognitionService !== undefined) {
            this.speechRecognitionService = params.speechRecognitionService;
        }
    }
    updateStateVars(params: Accounting_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__bills.purgeDependencyOnElmtId(rmElmtId);
        this.__todayBills.purgeDependencyOnElmtId(rmElmtId);
        this.__todayIncome.purgeDependencyOnElmtId(rmElmtId);
        this.__todayExpense.purgeDependencyOnElmtId(rmElmtId);
        this.__monthExpense.purgeDependencyOnElmtId(rmElmtId);
        this.__monthIncome.purgeDependencyOnElmtId(rmElmtId);
        this.__monthBalance.purgeDependencyOnElmtId(rmElmtId);
        this.__showAddBillDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__inputText.purgeDependencyOnElmtId(rmElmtId);
        this.__isRecording.purgeDependencyOnElmtId(rmElmtId);
        this.__isProcessing.purgeDependencyOnElmtId(rmElmtId);
        this.__recordingDuration.purgeDependencyOnElmtId(rmElmtId);
        this.__recordingTimer.purgeDependencyOnElmtId(rmElmtId);
        this.__isLongPressing.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedType.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedCategory.purgeDependencyOnElmtId(rmElmtId);
        this.__amountText.purgeDependencyOnElmtId(rmElmtId);
        this.__description.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedBill.purgeDependencyOnElmtId(rmElmtId);
        this.__showBillDetail.purgeDependencyOnElmtId(rmElmtId);
        this.__historyBillGroups.purgeDependencyOnElmtId(rmElmtId);
        this.__monthBudget.purgeDependencyOnElmtId(rmElmtId);
        this.__showBudgetDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__budgetInputText.purgeDependencyOnElmtId(rmElmtId);
        this.__showStatistics.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__bills.aboutToBeDeleted();
        this.__todayBills.aboutToBeDeleted();
        this.__todayIncome.aboutToBeDeleted();
        this.__todayExpense.aboutToBeDeleted();
        this.__monthExpense.aboutToBeDeleted();
        this.__monthIncome.aboutToBeDeleted();
        this.__monthBalance.aboutToBeDeleted();
        this.__showAddBillDialog.aboutToBeDeleted();
        this.__inputText.aboutToBeDeleted();
        this.__isRecording.aboutToBeDeleted();
        this.__isProcessing.aboutToBeDeleted();
        this.__recordingDuration.aboutToBeDeleted();
        this.__recordingTimer.aboutToBeDeleted();
        this.__isLongPressing.aboutToBeDeleted();
        this.__selectedType.aboutToBeDeleted();
        this.__selectedCategory.aboutToBeDeleted();
        this.__amountText.aboutToBeDeleted();
        this.__description.aboutToBeDeleted();
        this.__selectedBill.aboutToBeDeleted();
        this.__showBillDetail.aboutToBeDeleted();
        this.__historyBillGroups.aboutToBeDeleted();
        this.__monthBudget.aboutToBeDeleted();
        this.__showBudgetDialog.aboutToBeDeleted();
        this.__budgetInputText.aboutToBeDeleted();
        this.__showStatistics.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __bills: ObservedPropertyObjectPU<Bill[]>;
    get bills() {
        return this.__bills.get();
    }
    set bills(newValue: Bill[]) {
        this.__bills.set(newValue);
    }
    private __todayBills: ObservedPropertyObjectPU<Bill[]>;
    get todayBills() {
        return this.__todayBills.get();
    }
    set todayBills(newValue: Bill[]) {
        this.__todayBills.set(newValue);
    }
    private __todayIncome: ObservedPropertySimplePU<number>;
    get todayIncome() {
        return this.__todayIncome.get();
    }
    set todayIncome(newValue: number) {
        this.__todayIncome.set(newValue);
    }
    private __todayExpense: ObservedPropertySimplePU<number>;
    get todayExpense() {
        return this.__todayExpense.get();
    }
    set todayExpense(newValue: number) {
        this.__todayExpense.set(newValue);
    }
    private __monthExpense: ObservedPropertySimplePU<number>;
    get monthExpense() {
        return this.__monthExpense.get();
    }
    set monthExpense(newValue: number) {
        this.__monthExpense.set(newValue);
    }
    private __monthIncome: ObservedPropertySimplePU<number>;
    get monthIncome() {
        return this.__monthIncome.get();
    }
    set monthIncome(newValue: number) {
        this.__monthIncome.set(newValue);
    }
    private __monthBalance: ObservedPropertySimplePU<number>;
    get monthBalance() {
        return this.__monthBalance.get();
    }
    set monthBalance(newValue: number) {
        this.__monthBalance.set(newValue);
    }
    // 记账对话框状态
    private __showAddBillDialog: ObservedPropertySimplePU<boolean>;
    get showAddBillDialog() {
        return this.__showAddBillDialog.get();
    }
    set showAddBillDialog(newValue: boolean) {
        this.__showAddBillDialog.set(newValue);
    }
    // AI记账相关状态
    private __inputText: ObservedPropertySimplePU<string>;
    get inputText() {
        return this.__inputText.get();
    }
    set inputText(newValue: string) {
        this.__inputText.set(newValue);
    }
    private __isRecording: ObservedPropertySimplePU<boolean>;
    get isRecording() {
        return this.__isRecording.get();
    }
    set isRecording(newValue: boolean) {
        this.__isRecording.set(newValue);
    }
    private __isProcessing: ObservedPropertySimplePU<boolean>;
    get isProcessing() {
        return this.__isProcessing.get();
    }
    set isProcessing(newValue: boolean) {
        this.__isProcessing.set(newValue);
    }
    private __recordingDuration: ObservedPropertySimplePU<number>; // 录音时长（秒）
    get recordingDuration() {
        return this.__recordingDuration.get();
    }
    set recordingDuration(newValue: number) {
        this.__recordingDuration.set(newValue);
    }
    private __recordingTimer: ObservedPropertySimplePU<number>; // 录音计时器ID
    get recordingTimer() {
        return this.__recordingTimer.get();
    }
    set recordingTimer(newValue: number) {
        this.__recordingTimer.set(newValue);
    }
    private __isLongPressing: ObservedPropertySimplePU<boolean>; // 是否正在长按
    get isLongPressing() {
        return this.__isLongPressing.get();
    }
    set isLongPressing(newValue: boolean) {
        this.__isLongPressing.set(newValue);
    }
    private longPressTimer: number; // 长按计时器ID
    // 手动记账相关状态
    private __selectedType: ObservedPropertySimplePU<BillType>;
    get selectedType() {
        return this.__selectedType.get();
    }
    set selectedType(newValue: BillType) {
        this.__selectedType.set(newValue);
    }
    private __selectedCategory: ObservedPropertySimplePU<BillCategory>;
    get selectedCategory() {
        return this.__selectedCategory.get();
    }
    set selectedCategory(newValue: BillCategory) {
        this.__selectedCategory.set(newValue);
    }
    private __amountText: ObservedPropertySimplePU<string>;
    get amountText() {
        return this.__amountText.get();
    }
    set amountText(newValue: string) {
        this.__amountText.set(newValue);
    }
    private __description: ObservedPropertySimplePU<string>;
    get description() {
        return this.__description.get();
    }
    set description(newValue: string) {
        this.__description.set(newValue);
    }
    // 账单详情
    private __selectedBill: ObservedPropertyObjectPU<Bill | null>;
    get selectedBill() {
        return this.__selectedBill.get();
    }
    set selectedBill(newValue: Bill | null) {
        this.__selectedBill.set(newValue);
    }
    private __showBillDetail: ObservedPropertySimplePU<boolean>;
    get showBillDetail() {
        return this.__showBillDetail.get();
    }
    set showBillDetail(newValue: boolean) {
        this.__showBillDetail.set(newValue);
    }
    // 历史账单分组数据
    private __historyBillGroups: ObservedPropertyObjectPU<BillGroup[]>;
    get historyBillGroups() {
        return this.__historyBillGroups.get();
    }
    set historyBillGroups(newValue: BillGroup[]) {
        this.__historyBillGroups.set(newValue);
    }
    // 月预算相关状态
    private __monthBudget: ObservedPropertySimplePU<number>;
    get monthBudget() {
        return this.__monthBudget.get();
    }
    set monthBudget(newValue: number) {
        this.__monthBudget.set(newValue);
    }
    private __showBudgetDialog: ObservedPropertySimplePU<boolean>;
    get showBudgetDialog() {
        return this.__showBudgetDialog.get();
    }
    set showBudgetDialog(newValue: boolean) {
        this.__showBudgetDialog.set(newValue);
    }
    private __budgetInputText: ObservedPropertySimplePU<string>;
    get budgetInputText() {
        return this.__budgetInputText.get();
    }
    set budgetInputText(newValue: string) {
        this.__budgetInputText.set(newValue);
    }
    private readonly BUDGET_KEY: string;
    // 统计页面状态
    private __showStatistics: ObservedPropertySimplePU<boolean>;
    get showStatistics() {
        return this.__showStatistics.get();
    }
    set showStatistics(newValue: boolean) {
        this.__showStatistics.set(newValue);
    }
    // 支出分类列表
    private expenseCategories: CategoryItem[];
    // 收入分类列表
    private incomeCategories: CategoryItem[];
    private billService: BillService;
    private aiService: MimoAIService;
    private audioRecorderService: AudioRecorderService;
    private speechRecognitionService: SpeechRecognitionService;
    aboutToAppear() {
        this.loadBills();
        this.loadStatistics();
        this.loadBudget();
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
     * 加载月预算
     */
    async loadBudget(): Promise<void> {
        try {
            const context = getContext(this) as common.UIAbilityContext;
            const store = await preferences.getPreferences(context, 'accounting_prefs');
            const budget = await store.get(this.BUDGET_KEY, 0);
            this.monthBudget = budget as number;
        }
        catch (error) {
            console.error('加载预算失败:', error);
            this.monthBudget = 0;
        }
    }
    /**
     * 保存月预算
     */
    async saveBudget(budget: number): Promise<void> {
        try {
            const context = getContext(this) as common.UIAbilityContext;
            const store = await preferences.getPreferences(context, 'accounting_prefs');
            await store.put(this.BUDGET_KEY, budget);
            await store.flush();
            this.monthBudget = budget;
            promptAction.showToast({ message: '预算设置成功' });
        }
        catch (error) {
            console.error('保存预算失败:', error);
            promptAction.showToast({ message: '保存失败，请重试' });
        }
    }
    /**
     * 获取预算使用百分比
     */
    getBudgetPercentage(): number {
        if (this.monthBudget <= 0) {
            return 0;
        }
        const percentage = (this.monthExpense / this.monthBudget) * 100;
        return Math.min(percentage, 100);
    }
    /**
     * 获取预算剩余金额
     */
    getBudgetRemaining(): number {
        return Math.max(this.monthBudget - this.monthExpense, 0);
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
        // 按创建时间倒序排列（最新的在前面）
        this.todayBills.sort((a: Bill, b: Bill): number => {
            return b.createTime.getTime() - a.createTime.getTime();
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
     * 显示添加账单对话框
     */
    openAddBillDialog(): void {
        this.showAddBillDialog = true;
        this.inputText = '';
        // 重置手动记账表单
        this.selectedType = BillType.EXPENSE;
        this.selectedCategory = BillCategory.FOOD;
        this.amountText = '';
        this.description = '';
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
            }
            catch (error) {
                console.error('初始化语音识别引擎失败:', error);
                // 即使识别引擎初始化失败，也继续录音流程
            }
            // 开始录音
            await this.audioRecorderService.startRecording();
            this.isRecording = true;
            this.recordingDuration = 0;
            // 开始语音识别
            try {
                await this.speechRecognitionService.startRecognition((text: string) => {
                    // 实时更新识别结果（中间结果）
                    if (text && text.trim()) {
                        this.inputText = text;
                    }
                }, (error: Error) => {
                    console.error('语音识别错误:', error);
                });
            }
            catch (error) {
                console.error('启动语音识别失败:', error);
                // 即使识别启动失败，也继续录音流程
            }
            // 开始计时
            this.startRecordingTimer();
            console.info('开始录音和语音识别...');
        }
        catch (error) {
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
            }
            catch (error) {
                console.error('获取语音识别结果失败:', error);
            }
            // 如果识别结果为空，使用时长作为提示
            if (!recognitionText || !recognitionText.trim()) {
                this.inputText = '录音内容：' + this.formatDuration(this.recordingDuration);
            }
            else {
                this.inputText = recognitionText;
            }
            // 自动发送识别
            await this.onSendInput();
            this.recordingDuration = 0;
        }
        catch (error) {
            console.error('停止录音失败:', error);
            this.isRecording = false;
            this.stopRecordingTimer();
            // 确保取消语音识别
            try {
                await this.speechRecognitionService.cancelRecognition();
            }
            catch (err) {
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
            }
            catch (error) {
                console.error('取消语音识别失败:', error);
            }
            this.isRecording = false;
            this.stopRecordingTimer();
            this.recordingDuration = 0;
            console.info('取消录音');
        }
        catch (error) {
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
        }
        catch (error) {
            console.error('AI识别失败:', error);
            // TODO: 显示错误提示
        }
        finally {
            this.isProcessing = false;
        }
    }
    /**
     * 关闭添加账单对话框
     */
    async closeAddBillDialog(): Promise<void> {
        // 如果正在录音，先取消录音
        if (this.isRecording) {
            await this.cancelRecording();
        }
        this.showAddBillDialog = false;
        this.inputText = '';
        this.isRecording = false;
        this.stopRecordingTimer();
        this.recordingDuration = 0;
        this.resetManualForm();
    }
    /**
     * 点击账单查看详情
     */
    onBillTap(bill: Bill): void {
        this.selectedBill = bill;
        this.showBillDetail = true;
    }
    /**
     * 删除账单
     */
    async onBillDelete(bill: Bill): Promise<void> {
        try {
            AlertDialog.show({
                title: '确认删除',
                message: `确定要删除这笔${bill.isIncome() ? '收入' : '支出'}记录吗？`,
                primaryButton: {
                    value: '取消',
                    action: () => { }
                },
                secondaryButton: {
                    value: '删除',
                    fontColor: Constants.COLOR_DANGER,
                    action: async () => {
                        try {
                            await this.billService.deleteBill(bill);
                            promptAction.showToast({ message: '账单已删除' });
                            await this.loadBills();
                            await this.loadStatistics();
                        }
                        catch (error) {
                            console.error('删除账单失败:', error);
                            promptAction.showToast({ message: '删除失败，请重试' });
                        }
                    }
                }
            });
        }
        catch (error) {
            console.error('删除账单失败:', error);
            promptAction.showToast({ message: '删除失败，请重试' });
        }
    }
    /**
     * 手动记账保存
     */
    async saveManualBill(): Promise<void> {
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
        try {
            await this.billService.createBill(bill);
            await this.loadBills();
            await this.loadStatistics();
            promptAction.showToast({ message: '账单已保存' });
            await this.closeAddBillDialog();
        }
        catch (error) {
            console.error('保存账单失败:', error);
            promptAction.showToast({ message: '保存失败，请重试' });
        }
    }
    /**
     * 重置手动记账表单
     */
    resetManualForm(): void {
        this.selectedType = BillType.EXPENSE;
        this.selectedCategory = BillCategory.FOOD;
        this.amountText = '';
        this.description = '';
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.debugLine("entry/src/main/ets/pages/Accounting.ets(520:5)", "entry");
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 统计页面（全屏覆盖）
            if (this.showStatistics) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new BillStatistics(this, {
                                    isShow: this.__showStatistics
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Accounting.ets", line: 523, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        isShow: this.showStatistics
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "BillStatistics" });
                    }
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Accounting.ets(527:9)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor(Constants.COLOR_BACKGROUND);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 顶部统计卡片 - 使用 flexShrink 而不是固定高度，让内容完整显示
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Accounting.ets(529:11)", "entry");
                        // 顶部统计卡片 - 使用 flexShrink 而不是固定高度，让内容完整显示
                        Column.flexShrink(0);
                    }, Column);
                    this.buildSummaryCard.bind(this)();
                    // 顶部统计卡片 - 使用 flexShrink 而不是固定高度，让内容完整显示
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 增加间距，让账单部分往下移动
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/Accounting.ets(535:11)", "entry");
                        // 增加间距，让账单部分往下移动
                        Blank.height(8);
                    }, Blank);
                    // 增加间距，让账单部分往下移动
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 账单列表区域 - 可滚动
                        Scroll.create();
                        Scroll.debugLine("entry/src/main/ets/pages/Accounting.ets(539:11)", "entry");
                        // 账单列表区域 - 可滚动
                        Scroll.layoutWeight(1);
                        // 账单列表区域 - 可滚动
                        Scroll.width('100%');
                        // 账单列表区域 - 可滚动
                        Scroll.scrollBar(BarState.Auto);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Accounting.ets(540:13)", "entry");
                        Column.width('100%');
                    }, Column);
                    // 今天的账单列表
                    this.buildTodayBillsList.bind(this)();
                    // 历史账单列表
                    this.buildHistoryBillsList.bind(this)();
                    Column.pop();
                    // 账单列表区域 - 可滚动
                    Scroll.pop();
                    Column.pop();
                    // 右下角加号按钮
                    this.buildAddButton.bind(this)();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 添加账单对话框
                        if (this.showAddBillDialog) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.buildAddBillDialog.bind(this)();
                            });
                        }
                        // 账单详情弹窗
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 账单详情弹窗
                        if (this.showBillDetail && this.selectedBill) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.buildBillDetail.bind(this)();
                            });
                        }
                        // 预算设置弹窗
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 预算设置弹窗
                        if (this.showBudgetDialog) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.buildBudgetDialog.bind(this)();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
        }, If);
        If.pop();
        Stack.pop();
    }
    /**
     * 构建顶部统计卡片
     */
    buildSummaryCard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Accounting.ets(585:5)", "entry");
            Column.width('100%');
            Column.padding(24);
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Column.borderRadius(16);
            Column.margin({ top: 16, left: 16, right: 16, bottom: 12 });
            Column.shadow({
                radius: 12,
                color: 'rgba(0, 0, 0, 0.06)',
                offsetX: 0,
                offsetY: 4
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 月份支出标题（动态显示当前月份）
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(587:7)", "entry");
            // 月份支出标题（动态显示当前月份）
            Row.width('100%');
            // 月份支出标题（动态显示当前月份）
            Row.margin({ bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${new Date().getMonth() + 1}月支出`);
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(588:9)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/Accounting.ets(593:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(595:9)", "entry");
            Row.padding({ left: 12, right: 12, top: 6, bottom: 6 });
            Row.backgroundColor('rgba(255, 107, 53, 0.1)');
            Row.borderRadius(16);
            Row.onClick(() => {
                this.showStatistics = true;
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📊');
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(596:11)", "entry");
            Text.fontSize(18);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('统计');
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(598:11)", "entry");
            Text.fontSize(14);
            Text.fontColor(Constants.COLOR_PRIMARY);
            Text.margin({ left: 4 });
        }, Text);
        Text.pop();
        Row.pop();
        // 月份支出标题（动态显示当前月份）
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 支出金额
            Text.create(`¥${this.monthExpense.toFixed(2)}`);
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(614:7)", "entry");
            // 支出金额
            Text.fontSize(36);
            // 支出金额
            Text.fontWeight(FontWeight.Bold);
            // 支出金额
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            // 支出金额
            Text.margin({ bottom: 16 });
        }, Text);
        // 支出金额
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 收入和结余
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(621:7)", "entry");
            // 收入和结余
            Row.width('100%');
            // 收入和结余
            Row.margin({ bottom: 24 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Accounting.ets(622:9)", "entry");
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('收入');
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(623:11)", "entry");
            Text.fontSize(14);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`¥${this.monthIncome.toFixed(2)}`);
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(626:11)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_SUCCESS);
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/Accounting.ets(634:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Accounting.ets(636:9)", "entry");
            Column.alignItems(HorizontalAlign.End);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('结余');
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(637:11)", "entry");
            Text.fontSize(14);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`¥${this.monthBalance.toFixed(2)}`);
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(640:11)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_PRIMARY);
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        Column.pop();
        // 收入和结余
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 月预算进度条（可点击设置）
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Accounting.ets(652:7)", "entry");
            // 月预算进度条（可点击设置）
            Column.width('100%');
            // 月预算进度条（可点击设置）
            Column.padding({ top: 16, bottom: 16 });
            // 月预算进度条（可点击设置）
            Column.onClick(() => {
                this.budgetInputText = this.monthBudget > 0 ? this.monthBudget.toString() : '';
                this.showBudgetDialog = true;
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(653:9)", "entry");
            Row.width('100%');
            Row.margin({ bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.monthBudget > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Accounting.ets(655:13)", "entry");
                        Column.alignItems(HorizontalAlign.Start);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('月预算');
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(656:15)", "entry");
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${this.getBudgetPercentage().toFixed(0)}%`);
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(659:15)", "entry");
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(Constants.COLOR_PRIMARY);
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Accounting.ets(667:13)", "entry");
                        Column.alignItems(HorizontalAlign.Start);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('月预算');
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(668:15)", "entry");
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('点击设置');
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(671:15)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(Constants.COLOR_PRIMARY);
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/Accounting.ets(679:11)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.monthBudget > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Accounting.ets(682:13)", "entry");
                        Column.alignItems(HorizontalAlign.End);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('剩余');
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(683:15)", "entry");
                        Text.fontSize(12);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`¥${this.getBudgetRemaining().toFixed(2)}`);
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(686:15)", "entry");
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(this.getBudgetRemaining() > 0 ? Constants.COLOR_SUCCESS : Constants.COLOR_DANGER);
                        Text.margin({ top: 4 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('⚙️ 设置');
                        Button.debugLine("entry/src/main/ets/pages/Accounting.ets(694:13)", "entry");
                        Button.type(ButtonType.Normal);
                        Button.fontSize(13);
                        Button.fontColor('#FFFFFF');
                        Button.backgroundColor(Constants.COLOR_PRIMARY);
                        Button.borderRadius(16);
                        Button.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                        Button.onClick(() => {
                            this.budgetInputText = '';
                            this.showBudgetDialog = true;
                        });
                    }, Button);
                    Button.pop();
                });
            }
        }, If);
        If.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 使用 Progress 组件显示进度条
            Progress.create({
                value: this.monthBudget > 0 ? this.getBudgetPercentage() : 0,
                total: 100
            });
            Progress.debugLine("entry/src/main/ets/pages/Accounting.ets(711:9)", "entry");
            // 使用 Progress 组件显示进度条
            Progress.color(this.monthBudget > 0 && this.getBudgetPercentage() >= 100 ? Constants.COLOR_DANGER : Constants.COLOR_PRIMARY);
            // 使用 Progress 组件显示进度条
            Progress.style({
                borderWidth: 0,
                enableScanEffect: false,
                fontColor: Color.Transparent,
                showDefaultPercentage: false
            });
            // 使用 Progress 组件显示进度条
            Progress.width('100%');
            // 使用 Progress 组件显示进度条
            Progress.height(12);
            // 使用 Progress 组件显示进度条
            Progress.margin({ top: 4 });
        }, Progress);
        // 月预算进度条（可点击设置）
        Column.pop();
        Column.pop();
    }
    /**
     * 构建今天的账单列表
     */
    buildTodayBillsList(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Accounting.ets(751:5)", "entry");
            Column.width('100%');
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Column.borderRadius(12);
            Column.margin({ left: 16, right: 16, bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(753:7)", "entry");
            // 标题
            Row.width('100%');
            // 标题
            Row.padding({ left: 16, right: 16, top: 12, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`今天 ${Utils.formatDate(new Date(), 'MM月DD日')} (${this.getWeekDay()})`);
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(754:9)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/Accounting.ets(759:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('>');
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(761:9)", "entry");
            Text.fontSize(16);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        // 标题
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 今日统计
            Text.create(`支出¥${this.todayExpense.toFixed(2)} | 收入¥${this.todayIncome.toFixed(2)}`);
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(769:7)", "entry");
            // 今日统计
            Text.fontSize(14);
            // 今日统计
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            // 今日统计
            Text.padding({ left: 16, right: 16, bottom: 12 });
        }, Text);
        // 今日统计
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 账单列表
            if (this.todayBills.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Accounting.ets(776:9)", "entry");
                        Column.width('100%');
                        Column.padding(20);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('今天还没有账单');
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(777:11)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create();
                        List.debugLine("entry/src/main/ets/pages/Accounting.ets(784:9)", "entry");
                        List.width('100%');
                        List.padding({ left: 16, right: 16 });
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const bill = _item;
                            {
                                const itemCreation = (elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    ListItem.create(deepRenderFunction, true);
                                    if (!isInitialRender) {
                                        ListItem.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                };
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    ListItem.create(deepRenderFunction, true);
                                    ListItem.swipeAction({
                                        end: this.buildSwipeDeleteButton.bind(this, bill)
                                    });
                                    ListItem.debugLine("entry/src/main/ets/pages/Accounting.ets(786:13)", "entry");
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.buildBillItemContent.bind(this)(bill);
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.todayBills, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    /**
     * 构建左滑删除按钮
     */
    buildSwipeDeleteButton(bill: Bill, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(809:5)", "entry");
            Row.height('100%');
            Row.justifyContent(FlexAlign.End);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('删除');
            Button.debugLine("entry/src/main/ets/pages/Accounting.ets(810:7)", "entry");
            Button.type(ButtonType.Normal);
            Button.width(80);
            Button.height('100%');
            Button.fontSize(15);
            Button.fontWeight(FontWeight.Medium);
            Button.fontColor('#FFFFFF');
            Button.backgroundColor(Constants.COLOR_DANGER);
            Button.borderRadius({ topRight: 12, bottomRight: 12 });
            Button.onClick(() => {
                this.onBillDelete(bill);
            });
        }, Button);
        Button.pop();
        Row.pop();
    }
    /**
     * 构建历史账单列表
     */
    buildHistoryBillsList(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.historyBillGroups.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Accounting.ets(833:7)", "entry");
                        Column.width('100%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const group = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.debugLine("entry/src/main/ets/pages/Accounting.ets(835:11)", "entry");
                                Column.width('100%');
                                Column.backgroundColor('#FFFFFF');
                                Column.borderRadius(12);
                                Column.margin({ left: 16, right: 16, bottom: 12 });
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 日期标题
                                Row.create();
                                Row.debugLine("entry/src/main/ets/pages/Accounting.ets(837:13)", "entry");
                                // 日期标题
                                Row.width('100%');
                                // 日期标题
                                Row.padding({ left: 16, right: 16, top: 12, bottom: 8 });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(group.date);
                                Text.debugLine("entry/src/main/ets/pages/Accounting.ets(838:15)", "entry");
                                Text.fontSize(14);
                                Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Blank.create();
                                Blank.debugLine("entry/src/main/ets/pages/Accounting.ets(842:15)", "entry");
                            }, Blank);
                            Blank.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create('>');
                                Text.debugLine("entry/src/main/ets/pages/Accounting.ets(844:15)", "entry");
                                Text.fontSize(14);
                                Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                            }, Text);
                            Text.pop();
                            // 日期标题
                            Row.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 该日期的账单
                                List.create();
                                List.debugLine("entry/src/main/ets/pages/Accounting.ets(852:13)", "entry");
                                // 该日期的账单
                                List.width('100%');
                                // 该日期的账单
                                List.padding({ left: 16, right: 16, bottom: 8 });
                            }, List);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                ForEach.create();
                                const forEachItemGenFunction = _item => {
                                    const bill = _item;
                                    {
                                        const itemCreation = (elmtId, isInitialRender) => {
                                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                            ListItem.create(deepRenderFunction, true);
                                            if (!isInitialRender) {
                                                ListItem.pop();
                                            }
                                            ViewStackProcessor.StopGetAccessRecording();
                                        };
                                        const itemCreation2 = (elmtId, isInitialRender) => {
                                            ListItem.create(deepRenderFunction, true);
                                            ListItem.swipeAction({
                                                end: this.buildSwipeDeleteButton.bind(this, bill)
                                            });
                                            ListItem.debugLine("entry/src/main/ets/pages/Accounting.ets(854:17)", "entry");
                                        };
                                        const deepRenderFunction = (elmtId, isInitialRender) => {
                                            itemCreation(elmtId, isInitialRender);
                                            this.buildBillItemContent.bind(this)(bill);
                                            ListItem.pop();
                                        };
                                        this.observeComponentCreation2(itemCreation2, ListItem);
                                        ListItem.pop();
                                    }
                                };
                                this.forEachUpdateFunction(elmtId, group.bills, forEachItemGenFunction);
                            }, ForEach);
                            ForEach.pop();
                            // 该日期的账单
                            List.pop();
                            Column.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.historyBillGroups, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                });
            }
            else /**
             * 构建单个账单项内容
             */ {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    /**
     * 构建单个账单项内容
     */
    buildBillItemContent(bill: Bill, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(880:5)", "entry");
            Row.width('100%');
            Row.padding({ top: 14, bottom: 14, left: 12, right: 12 });
            Row.backgroundColor(Constants.COLOR_BACKGROUND);
            Row.borderRadius(12);
            Row.margin({ bottom: 10 });
            Row.onClick(() => {
                this.onBillTap(bill);
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 时间
            Text.create(Utils.formatDate(bill.date, 'HH:mm'));
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(882:7)", "entry");
            // 时间
            Text.fontSize(14);
            // 时间
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            // 时间
            Text.width(50);
        }, Text);
        // 时间
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 分类图标和名称
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(888:7)", "entry");
            // 分类图标和名称
            Row.layoutWeight(1);
            // 分类图标和名称
            Row.margin({ left: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 图标背景圆
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Accounting.ets(890:9)", "entry");
            // 图标背景圆
            Column.width(36);
            // 图标背景圆
            Column.height(36);
            // 图标背景圆
            Column.backgroundColor(bill.isIncome() ? 'rgba(255, 167, 38, 0.15)' : 'rgba(255, 107, 53, 0.1)');
            // 图标背景圆
            Column.borderRadius(18);
            // 图标背景圆
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getCategoryIcon(bill.category));
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(891:11)", "entry");
            Text.fontSize(18);
        }, Text);
        Text.pop();
        // 图标背景圆
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getCategoryName(bill.category));
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(900:9)", "entry");
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            Text.margin({ left: 10 });
        }, Text);
        Text.pop();
        // 分类图标和名称
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 金额
            Text.create(bill.getDisplayAmount());
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(910:7)", "entry");
            // 金额
            Text.fontSize(17);
            // 金额
            Text.fontWeight(FontWeight.Bold);
            // 金额
            Text.fontColor(bill.isIncome() ? Constants.COLOR_SUCCESS : Constants.COLOR_DANGER);
        }, Text);
        // 金额
        Text.pop();
        Row.pop();
    }
    /**
     * 构建单个账单项（兼容旧代码）
     */
    buildBillItem(bill: Bill, parent = null) {
        this.buildBillItemContent.bind(this)(bill);
    }
    /**
     * 构建加号按钮
     */
    buildAddButton(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // AI记账按钮
            Button.createWithLabel('+');
            Button.debugLine("entry/src/main/ets/pages/Accounting.ets(941:5)", "entry");
            // AI记账按钮
            Button.type(ButtonType.Circle);
            // AI记账按钮
            Button.width(60);
            // AI记账按钮
            Button.height(60);
            // AI记账按钮
            Button.fontSize(36);
            // AI记账按钮
            Button.fontWeight(FontWeight.Medium);
            // AI记账按钮
            Button.fontColor('#FFFFFF');
            // AI记账按钮
            Button.backgroundColor(this.isRecording ? Constants.COLOR_DANGER : Constants.COLOR_PRIMARY);
            // AI记账按钮
            Button.shadow({
                radius: 12,
                color: this.isRecording ? 'rgba(230, 81, 0, 0.4)' : 'rgba(255, 107, 53, 0.4)',
                offsetX: 0,
                offsetY: 4
            });
            // AI记账按钮
            Button.position({ x: '100%', y: '100%' });
            // AI记账按钮
            Button.translate({ x: -76, y: -76 });
            // AI记账按钮
            Button.zIndex(20);
            // AI记账按钮
            Button.onClick(() => {
                if (this.isRecording) {
                    this.stopRecording();
                }
                else if (!this.isLongPressing) {
                    this.openAddBillDialog();
                }
                this.isLongPressing = false;
            });
            // AI记账按钮
            Button.onTouch((event) => {
                if (event.type === 0 && !this.isRecording) {
                    const timerId = setTimeout(() => {
                        this.isLongPressing = true;
                        this.onAddButtonLongPress();
                    }, 500);
                    this.longPressTimer = timerId as number;
                }
                else if (event.type === 1 || event.type === 3) {
                    if (this.longPressTimer) {
                        clearTimeout(this.longPressTimer);
                        this.longPressTimer = 0;
                    }
                    this.isLongPressing = false;
                }
            });
        }, Button);
        // AI记账按钮
        Button.pop();
    }
    /**
     * 获取当前分类列表
     */
    getCurrentCategories(): CategoryItem[] {
        return this.selectedType === BillType.EXPENSE
            ? this.expenseCategories
            : this.incomeCategories;
    }
    /**
     * 构建添加账单对话框（参考Tasks界面）
     */
    buildAddBillDialog(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Accounting.ets(997:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('rgba(0, 0, 0, 0.5)');
            Column.justifyContent(FlexAlign.Center);
            Column.onClick(() => {
                this.closeAddBillDialog();
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Accounting.ets(998:7)", "entry");
            Column.width('90%');
            Column.padding(24);
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(20);
            Column.shadow({
                radius: 20,
                color: 'rgba(0, 0, 0, 0.15)',
                offsetX: 0,
                offsetY: 8
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 对话框标题
            Text.create('记账');
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1000:9)", "entry");
            // 对话框标题
            Text.fontSize(22);
            // 对话框标题
            Text.fontWeight(FontWeight.Bold);
            // 对话框标题
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            // 对话框标题
            Text.margin({ bottom: 20 });
        }, Text);
        // 对话框标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 可滚动内容区域
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/pages/Accounting.ets(1007:9)", "entry");
            // 可滚动内容区域
            Scroll.height(400);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Accounting.ets(1008:11)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 类型切换
            Text.create('类型');
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1010:13)", "entry");
            // 类型切换
            Text.fontSize(15);
            // 类型切换
            Text.fontWeight(FontWeight.Medium);
            // 类型切换
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            // 类型切换
            Text.margin({ bottom: 8 });
            // 类型切换
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        // 类型切换
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(1017:13)", "entry");
            Row.width('100%');
            Row.justifyContent(FlexAlign.Center);
            Row.margin({ bottom: 20 });
        }, Row);
        this.buildTypeButton.bind(this)('支出', BillType.EXPENSE);
        this.buildTypeButton.bind(this)('收入', BillType.INCOME);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 金额输入
            Text.create(this.selectedType === BillType.EXPENSE ? '支出金额' : '收入金额');
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1026:13)", "entry");
            // 金额输入
            Text.fontSize(15);
            // 金额输入
            Text.fontWeight(FontWeight.Medium);
            // 金额输入
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            // 金额输入
            Text.margin({ bottom: 8 });
            // 金额输入
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        // 金额输入
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(1033:13)", "entry");
            Row.width('100%');
            Row.justifyContent(FlexAlign.Center);
            Row.margin({ bottom: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('¥');
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1034:15)", "entry");
            Text.fontSize(32);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '0.00', text: this.amountText });
            TextInput.debugLine("entry/src/main/ets/pages/Accounting.ets(1039:15)", "entry");
            TextInput.type(InputType.NUMBER_DECIMAL);
            TextInput.fontSize(32);
            TextInput.fontWeight(FontWeight.Bold);
            TextInput.fontColor(Constants.COLOR_TEXT_PRIMARY);
            TextInput.backgroundColor('transparent');
            TextInput.layoutWeight(1);
            TextInput.onChange((value: string) => {
                this.amountText = value;
            });
        }, TextInput);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 分类选择
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Accounting.ets(1055:13)", "entry");
            // 分类选择
            Column.width('100%');
            // 分类选择
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('选择分类');
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1056:15)", "entry");
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            Text.margin({ bottom: 12 });
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        Text.pop();
        this.buildCategoryGrid.bind(this)();
        // 分类选择
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 备注输入
            Text.create('备注（可选）');
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1069:13)", "entry");
            // 备注输入
            Text.fontSize(15);
            // 备注输入
            Text.fontWeight(FontWeight.Medium);
            // 备注输入
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            // 备注输入
            Text.margin({ bottom: 8 });
            // 备注输入
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        // 备注输入
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '添加备注', text: this.description });
            TextInput.debugLine("entry/src/main/ets/pages/Accounting.ets(1076:13)", "entry");
            TextInput.width('100%');
            TextInput.height(44);
            TextInput.fontSize(15);
            TextInput.backgroundColor(Constants.COLOR_BACKGROUND);
            TextInput.borderRadius(12);
            TextInput.padding({ left: 12, right: 12 });
            TextInput.onChange((value: string) => {
                this.description = value;
            });
            TextInput.margin({ bottom: 24 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 分隔线
            Divider.create();
            Divider.debugLine("entry/src/main/ets/pages/Accounting.ets(1089:13)", "entry");
            // 分隔线
            Divider.color(Constants.COLOR_DIVIDER);
            // 分隔线
            Divider.margin({ bottom: 16 });
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // AI记账区域
            Text.create('AI记账');
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1094:13)", "entry");
            // AI记账区域
            Text.fontSize(15);
            // AI记账区域
            Text.fontWeight(FontWeight.Medium);
            // AI记账区域
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            // AI记账区域
            Text.margin({ bottom: 8 });
            // AI记账区域
            Text.alignSelf(ItemAlign.Start);
        }, Text);
        // AI记账区域
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 录音状态显示
            if (this.isRecording) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/Accounting.ets(1103:15)", "entry");
                        Row.width('100%');
                        Row.padding(14);
                        Row.backgroundColor(Constants.COLOR_BACKGROUND);
                        Row.borderRadius(12);
                        Row.margin({ bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 录音动画指示器
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Accounting.ets(1105:17)", "entry");
                        Context.animation({
                            iterations: -1,
                            duration: 1000,
                            curve: Curve.EaseInOut
                        });
                        // 录音动画指示器
                        Column.width(24);
                        // 录音动画指示器
                        Column.height(24);
                        // 录音动画指示器
                        Column.justifyContent(FlexAlign.Center);
                        Context.animation(null);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('●');
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1106:19)", "entry");
                        Text.fontSize(20);
                        Text.fontColor(Constants.COLOR_DANGER);
                    }, Text);
                    Text.pop();
                    // 录音动画指示器
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 录音时长
                        Text.create(`录音中 ${this.formatDuration(this.recordingDuration)}`);
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1120:17)", "entry");
                        // 录音时长
                        Text.fontSize(15);
                        // 录音时长
                        Text.fontWeight(FontWeight.Medium);
                        // 录音时长
                        Text.fontColor(Constants.COLOR_DANGER);
                        // 录音时长
                        Text.margin({ left: 10 });
                    }, Text);
                    // 录音时长
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/Accounting.ets(1126:17)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 停止录音按钮
                        Button.createWithLabel('停止');
                        Button.debugLine("entry/src/main/ets/pages/Accounting.ets(1129:17)", "entry");
                        // 停止录音按钮
                        Button.type(ButtonType.Normal);
                        // 停止录音按钮
                        Button.height(36);
                        // 停止录音按钮
                        Button.fontSize(14);
                        // 停止录音按钮
                        Button.fontWeight(FontWeight.Medium);
                        // 停止录音按钮
                        Button.backgroundColor(Constants.COLOR_DANGER);
                        // 停止录音按钮
                        Button.fontColor('#FFFFFF');
                        // 停止录音按钮
                        Button.borderRadius(18);
                        // 停止录音按钮
                        Button.padding({ left: 16, right: 16 });
                        // 停止录音按钮
                        Button.margin({ left: 8 });
                        // 停止录音按钮
                        Button.onClick(() => {
                            this.stopRecording();
                        });
                    }, Button);
                    // 停止录音按钮
                    Button.pop();
                    Row.pop();
                });
            }
            // AI输入栏
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // AI输入栏
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(1151:13)", "entry");
            // AI输入栏
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 输入框
            TextInput.create({
                placeholder: this.isRecording ? '正在录音...' : '语音或文字输入，如：午餐15元',
                text: this.inputText
            });
            TextInput.debugLine("entry/src/main/ets/pages/Accounting.ets(1153:15)", "entry");
            // 输入框
            TextInput.layoutWeight(1);
            // 输入框
            TextInput.height(44);
            // 输入框
            TextInput.fontSize(15);
            // 输入框
            TextInput.backgroundColor(Constants.COLOR_BACKGROUND);
            // 输入框
            TextInput.borderRadius(22);
            // 输入框
            TextInput.padding({ left: 16, right: 16 });
            // 输入框
            TextInput.enabled(!this.isRecording);
            // 输入框
            TextInput.onChange((value: string) => {
                this.inputText = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 录音按钮
            Button.createWithLabel('🎤');
            Button.debugLine("entry/src/main/ets/pages/Accounting.ets(1169:15)", "entry");
            // 录音按钮
            Button.type(ButtonType.Circle);
            // 录音按钮
            Button.width(44);
            // 录音按钮
            Button.height(44);
            // 录音按钮
            Button.fontSize(20);
            // 录音按钮
            Button.backgroundColor(Constants.COLOR_BACKGROUND);
            // 录音按钮
            Button.fontColor(Constants.COLOR_PRIMARY);
            // 录音按钮
            Button.margin({ left: 8 });
            // 录音按钮
            Button.enabled(!this.isProcessing && !this.isRecording);
            // 录音按钮
            Button.onClick(() => {
                this.onAddButtonLongPress();
            });
        }, Button);
        // 录音按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 发送按钮
            Button.createWithLabel('➤');
            Button.debugLine("entry/src/main/ets/pages/Accounting.ets(1183:15)", "entry");
            // 发送按钮
            Button.type(ButtonType.Circle);
            // 发送按钮
            Button.width(44);
            // 发送按钮
            Button.height(44);
            // 发送按钮
            Button.fontSize(20);
            // 发送按钮
            Button.fontWeight(FontWeight.Medium);
            // 发送按钮
            Button.backgroundColor(Constants.COLOR_PRIMARY);
            // 发送按钮
            Button.fontColor('#FFFFFF');
            // 发送按钮
            Button.margin({ left: 8 });
            // 发送按钮
            Button.enabled(!this.isProcessing && !this.isRecording && this.inputText.trim().length > 0);
            // 发送按钮
            Button.onClick(() => {
                this.onSendInput();
            });
        }, Button);
        // 发送按钮
        Button.pop();
        // AI输入栏
        Row.pop();
        Column.pop();
        // 可滚动内容区域
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 操作按钮行
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(1204:9)", "entry");
            // 操作按钮行
            Row.width('100%');
            // 操作按钮行
            Row.justifyContent(FlexAlign.SpaceBetween);
            // 操作按钮行
            Row.margin({ top: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('取消');
            Button.debugLine("entry/src/main/ets/pages/Accounting.ets(1205:11)", "entry");
            Button.type(ButtonType.Normal);
            Button.layoutWeight(1);
            Button.height(48);
            Button.fontSize(16);
            Button.fontWeight(FontWeight.Medium);
            Button.backgroundColor(Constants.COLOR_BACKGROUND);
            Button.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Button.borderRadius(12);
            Button.onClick(() => {
                this.closeAddBillDialog();
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('保存');
            Button.debugLine("entry/src/main/ets/pages/Accounting.ets(1218:11)", "entry");
            Button.type(ButtonType.Normal);
            Button.layoutWeight(1);
            Button.height(48);
            Button.fontSize(16);
            Button.fontWeight(FontWeight.Medium);
            Button.backgroundColor(Constants.COLOR_PRIMARY);
            Button.fontColor(Constants.COLOR_TEXT_ON_PRIMARY);
            Button.borderRadius(12);
            Button.margin({ left: 16 });
            Button.shadow({
                radius: 8,
                color: 'rgba(255, 107, 53, 0.3)',
                offsetX: 0,
                offsetY: 2
            });
            Button.onClick(() => {
                this.saveManualBill();
            });
        }, Button);
        Button.pop();
        // 操作按钮行
        Row.pop();
        Column.pop();
        Column.pop();
    }
    /**
     * 构建类型切换按钮
     */
    buildTypeButton(label: string, type: BillType, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(label);
            Button.debugLine("entry/src/main/ets/pages/Accounting.ets(1267:5)", "entry");
            Button.type(ButtonType.Normal);
            Button.width(100);
            Button.height(40);
            Button.fontSize(15);
            Button.fontWeight(FontWeight.Medium);
            Button.backgroundColor(this.selectedType === type ? Constants.COLOR_PRIMARY : Constants.COLOR_BACKGROUND);
            Button.fontColor(this.selectedType === type ? '#FFFFFF' : Constants.COLOR_TEXT_SECONDARY);
            Button.borderRadius(20);
            Button.margin({ left: 8, right: 8 });
            Button.onClick(() => {
                this.selectedType = type;
                // 切换类型时重置分类
                if (type === BillType.EXPENSE) {
                    this.selectedCategory = BillCategory.FOOD;
                }
                else {
                    this.selectedCategory = BillCategory.SALARY;
                }
            });
        }, Button);
        Button.pop();
    }
    /**
     * 构建分类网格
     */
    buildCategoryGrid(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ wrap: FlexWrap.Wrap, justifyContent: FlexAlign.Start });
            Flex.debugLine("entry/src/main/ets/pages/Accounting.ets(1293:5)", "entry");
            Flex.width('100%');
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.debugLine("entry/src/main/ets/pages/Accounting.ets(1295:9)", "entry");
                    Column.width('33.33%');
                    Column.padding(8);
                    Column.onClick(() => {
                        this.selectedCategory = item.category;
                    });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.debugLine("entry/src/main/ets/pages/Accounting.ets(1296:11)", "entry");
                    Column.width(50);
                    Column.height(50);
                    Column.backgroundColor(this.selectedCategory === item.category
                        ? (this.selectedType === BillType.EXPENSE ? 'rgba(255, 107, 53, 0.15)' : 'rgba(255, 167, 38, 0.15)')
                        : Constants.COLOR_BACKGROUND);
                    Column.borderRadius(25);
                    Column.justifyContent(FlexAlign.Center);
                    Column.border({
                        width: this.selectedCategory === item.category ? 2 : 0,
                        color: this.selectedType === BillType.EXPENSE ? Constants.COLOR_PRIMARY : Constants.COLOR_SUCCESS
                    });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(item.icon);
                    Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1297:13)", "entry");
                    Text.fontSize(24);
                }, Text);
                Text.pop();
                Column.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(item.name);
                    Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1312:11)", "entry");
                    Text.fontSize(12);
                    Text.fontColor(this.selectedCategory === item.category
                        ? Constants.COLOR_TEXT_PRIMARY
                        : Constants.COLOR_TEXT_SECONDARY);
                    Text.margin({ top: 6 });
                }, Text);
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.getCurrentCategories(), forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        Flex.pop();
    }
    /**
     * 构建输入栏
     */
    buildInputBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Accounting.ets(1335:5)", "entry");
            Column.width('100%');
            Column.padding({ left: 16, right: 16, top: 16, bottom: 16 });
            Column.backgroundColor(Constants.COLOR_BACKGROUND_SECONDARY);
            Column.borderRadius({ topLeft: 20, topRight: 20 });
            Column.alignItems(HorizontalAlign.Start);
            Column.position({ x: 0, y: '100%' });
            Column.translate({ y: this.isRecording ? -260 : -180 });
            Column.zIndex(100);
            Column.shadow({
                radius: 16,
                color: 'rgba(0, 0, 0, 0.1)',
                offsetX: 0,
                offsetY: -4
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 录音状态显示
            if (this.isRecording) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/Accounting.ets(1338:9)", "entry");
                        Row.width('100%');
                        Row.padding(14);
                        Row.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
                        Row.borderRadius(12);
                        Row.margin({ bottom: 10 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 录音动画指示器
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Accounting.ets(1340:11)", "entry");
                        Context.animation({
                            iterations: -1,
                            duration: 1000,
                            curve: Curve.EaseInOut
                        });
                        // 录音动画指示器
                        Column.width(24);
                        // 录音动画指示器
                        Column.height(24);
                        // 录音动画指示器
                        Column.justifyContent(FlexAlign.Center);
                        Context.animation(null);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('●');
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1341:13)", "entry");
                        Text.fontSize(20);
                        Text.fontColor(Constants.COLOR_DANGER);
                    }, Text);
                    Text.pop();
                    // 录音动画指示器
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 录音时长
                        Text.create(`录音中 ${this.formatDuration(this.recordingDuration)}`);
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1355:11)", "entry");
                        // 录音时长
                        Text.fontSize(15);
                        // 录音时长
                        Text.fontWeight(FontWeight.Medium);
                        // 录音时长
                        Text.fontColor(Constants.COLOR_DANGER);
                        // 录音时长
                        Text.margin({ left: 10 });
                    }, Text);
                    // 录音时长
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/Accounting.ets(1361:11)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 停止录音按钮
                        Button.createWithLabel('停止');
                        Button.debugLine("entry/src/main/ets/pages/Accounting.ets(1364:11)", "entry");
                        // 停止录音按钮
                        Button.type(ButtonType.Normal);
                        // 停止录音按钮
                        Button.height(36);
                        // 停止录音按钮
                        Button.fontSize(14);
                        // 停止录音按钮
                        Button.fontWeight(FontWeight.Medium);
                        // 停止录音按钮
                        Button.backgroundColor(Constants.COLOR_DANGER);
                        // 停止录音按钮
                        Button.fontColor('#FFFFFF');
                        // 停止录音按钮
                        Button.borderRadius(18);
                        // 停止录音按钮
                        Button.padding({ left: 16, right: 16 });
                        // 停止录音按钮
                        Button.margin({ left: 8 });
                        // 停止录音按钮
                        Button.onClick(() => {
                            this.stopRecording();
                        });
                    }, Button);
                    // 停止录音按钮
                    Button.pop();
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(1385:7)", "entry");
            Row.width('100%');
            Row.padding(14);
            Row.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Row.borderRadius(16);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 输入框
            TextInput.create({
                placeholder: this.isRecording ? '正在录音...' : '输入账单描述，如：午餐15元',
                text: this.inputText
            });
            TextInput.debugLine("entry/src/main/ets/pages/Accounting.ets(1387:9)", "entry");
            // 输入框
            TextInput.layoutWeight(1);
            // 输入框
            TextInput.height(44);
            // 输入框
            TextInput.fontSize(15);
            // 输入框
            TextInput.backgroundColor(Constants.COLOR_BACKGROUND);
            // 输入框
            TextInput.borderRadius(22);
            // 输入框
            TextInput.padding({ left: 16, right: 16 });
            // 输入框
            TextInput.enabled(!this.isRecording);
            // 输入框
            TextInput.onChange((value: string) => {
                this.inputText = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 录音按钮
            Button.createWithLabel('🎤');
            Button.debugLine("entry/src/main/ets/pages/Accounting.ets(1403:9)", "entry");
            // 录音按钮
            Button.type(ButtonType.Circle);
            // 录音按钮
            Button.width(44);
            // 录音按钮
            Button.height(44);
            // 录音按钮
            Button.fontSize(20);
            // 录音按钮
            Button.backgroundColor(Constants.COLOR_BACKGROUND);
            // 录音按钮
            Button.fontColor(Constants.COLOR_PRIMARY);
            // 录音按钮
            Button.margin({ left: 8 });
            // 录音按钮
            Button.enabled(!this.isProcessing && !this.isRecording);
            // 录音按钮
            Button.onClick(() => {
                this.onAddButtonLongPress();
            });
        }, Button);
        // 录音按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 发送按钮（箭头）
            Button.createWithLabel('➤');
            Button.debugLine("entry/src/main/ets/pages/Accounting.ets(1417:9)", "entry");
            // 发送按钮（箭头）
            Button.type(ButtonType.Circle);
            // 发送按钮（箭头）
            Button.width(44);
            // 发送按钮（箭头）
            Button.height(44);
            // 发送按钮（箭头）
            Button.fontSize(20);
            // 发送按钮（箭头）
            Button.fontWeight(FontWeight.Medium);
            // 发送按钮（箭头）
            Button.backgroundColor(Constants.COLOR_PRIMARY);
            // 发送按钮（箭头）
            Button.fontColor('#FFFFFF');
            // 发送按钮（箭头）
            Button.margin({ left: 8 });
            // 发送按钮（箭头）
            Button.enabled(!this.isProcessing && !this.isRecording && this.inputText.trim().length > 0);
            // 发送按钮（箭头）
            Button.onClick(() => {
                this.onSendInput();
            });
        }, Button);
        // 发送按钮（箭头）
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 关闭按钮
            Button.createWithLabel('×');
            Button.debugLine("entry/src/main/ets/pages/Accounting.ets(1432:9)", "entry");
            // 关闭按钮
            Button.type(ButtonType.Circle);
            // 关闭按钮
            Button.fontSize(20);
            // 关闭按钮
            Button.backgroundColor(Constants.COLOR_BACKGROUND);
            // 关闭按钮
            Button.fontColor(Constants.COLOR_TEXT_SECONDARY);
            // 关闭按钮
            Button.width(36);
            // 关闭按钮
            Button.height(36);
            // 关闭按钮
            Button.margin({ left: 10 });
            // 关闭按钮
            Button.onClick(() => {
                this.closeAddBillDialog();
            });
        }, Button);
        // 关闭按钮
        Button.pop();
        Row.pop();
        Column.pop();
    }
    /**
     * 构建账单详情
     */
    buildBillDetail(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.selectedBill !== null) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Accounting.ets(1471:7)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.position({ x: 0, y: 0 });
                        Column.zIndex(200);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 半透明背景
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Accounting.ets(1473:9)", "entry");
                        // 半透明背景
                        Column.width('100%');
                        // 半透明背景
                        Column.height('100%');
                        // 半透明背景
                        Column.backgroundColor('#000000');
                        // 半透明背景
                        Column.opacity(0.5);
                        // 半透明背景
                        Column.onClick(() => {
                            this.showBillDetail = false;
                            this.selectedBill = null;
                        });
                    }, Column);
                    // 半透明背景
                    Column.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Accounting.ets(1488:7)", "entry");
                        Column.width('90%');
                        Column.padding(20);
                        Column.position({ x: '5%', y: '20%' });
                        Column.zIndex(201);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 详情内容
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Accounting.ets(1490:9)", "entry");
                        // 详情内容
                        Column.width('100%');
                        // 详情内容
                        Column.padding(24);
                        // 详情内容
                        Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
                        // 详情内容
                        Column.borderRadius(20);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('账单详情');
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1491:11)", "entry");
                        Text.fontSize(20);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
                        Text.margin({ bottom: 24 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 金额显示
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Accounting.ets(1498:11)", "entry");
                        // 金额显示
                        Column.width('100%');
                        // 金额显示
                        Column.padding(20);
                        // 金额显示
                        Column.backgroundColor(this.selectedBill.isIncome() ? 'rgba(255, 167, 38, 0.1)' : 'rgba(255, 107, 53, 0.08)');
                        // 金额显示
                        Column.borderRadius(12);
                        // 金额显示
                        Column.margin({ bottom: 20 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.selectedBill.getDisplayAmount());
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1499:13)", "entry");
                        Text.fontSize(36);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(this.selectedBill.isIncome() ? Constants.COLOR_SUCCESS : Constants.COLOR_DANGER);
                    }, Text);
                    Text.pop();
                    // 金额显示
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 分类
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/Accounting.ets(1513:11)", "entry");
                        // 分类
                        Row.width('100%');
                        // 分类
                        Row.padding({ top: 14, bottom: 14 });
                        // 分类
                        Row.borderWidth({ bottom: 1 });
                        // 分类
                        Row.borderColor(Constants.COLOR_DIVIDER);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('分类');
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1514:13)", "entry");
                        Text.fontSize(15);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/Accounting.ets(1517:13)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/Accounting.ets(1518:13)", "entry");
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.getCategoryIcon(this.selectedBill.category));
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1519:15)", "entry");
                        Text.fontSize(16);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.getCategoryName(this.selectedBill.category));
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1521:15)", "entry");
                        Text.fontSize(15);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
                        Text.margin({ left: 6 });
                    }, Text);
                    Text.pop();
                    Row.pop();
                    // 分类
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 描述
                        if (this.selectedBill.description) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.debugLine("entry/src/main/ets/pages/Accounting.ets(1535:13)", "entry");
                                    Row.width('100%');
                                    Row.padding({ top: 14, bottom: 14 });
                                    Row.borderWidth({ bottom: 1 });
                                    Row.borderColor(Constants.COLOR_DIVIDER);
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('描述');
                                    Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1536:15)", "entry");
                                    Text.fontSize(15);
                                    Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Blank.create();
                                    Blank.debugLine("entry/src/main/ets/pages/Accounting.ets(1539:15)", "entry");
                                }, Blank);
                                Blank.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.selectedBill.description);
                                    Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1540:15)", "entry");
                                    Text.fontSize(15);
                                    Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
                                }, Text);
                                Text.pop();
                                Row.pop();
                            });
                        }
                        // 时间
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 时间
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/Accounting.ets(1551:11)", "entry");
                        // 时间
                        Row.width('100%');
                        // 时间
                        Row.padding({ top: 14, bottom: 14 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('时间');
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1552:13)", "entry");
                        Text.fontSize(15);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/Accounting.ets(1555:13)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(Utils.formatDate(this.selectedBill.date, Constants.DATETIME_FORMAT));
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1556:13)", "entry");
                        Text.fontSize(15);
                        Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
                    }, Text);
                    Text.pop();
                    // 时间
                    Row.pop();
                    // 详情内容
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 关闭按钮
                        Button.createWithLabel('关闭');
                        Button.debugLine("entry/src/main/ets/pages/Accounting.ets(1569:9)", "entry");
                        // 关闭按钮
                        Button.type(ButtonType.Normal);
                        // 关闭按钮
                        Button.width('100%');
                        // 关闭按钮
                        Button.height(50);
                        // 关闭按钮
                        Button.fontSize(16);
                        // 关闭按钮
                        Button.fontWeight(FontWeight.Medium);
                        // 关闭按钮
                        Button.backgroundColor(Constants.COLOR_PRIMARY);
                        // 关闭按钮
                        Button.fontColor(Constants.COLOR_TEXT_ON_PRIMARY);
                        // 关闭按钮
                        Button.borderRadius(25);
                        // 关闭按钮
                        Button.margin({ top: 16 });
                        // 关闭按钮
                        Button.shadow({
                            radius: 8,
                            color: 'rgba(255, 107, 53, 0.3)',
                            offsetX: 0,
                            offsetY: 2
                        });
                        // 关闭按钮
                        Button.onClick(() => {
                            this.showBillDetail = false;
                            this.selectedBill = null;
                        });
                    }, Button);
                    // 关闭按钮
                    Button.pop();
                    Column.pop();
                });
            }
            else /**
             * 构建预算设置弹窗
             */ {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    /**
     * 构建预算设置弹窗
     */
    buildBudgetDialog(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 半透明背景
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Accounting.ets(1603:5)", "entry");
            // 半透明背景
            Column.width('100%');
            // 半透明背景
            Column.height('100%');
            // 半透明背景
            Column.backgroundColor('#000000');
            // 半透明背景
            Column.opacity(0.5);
            // 半透明背景
            Column.onClick(() => {
                this.showBudgetDialog = false;
            });
            // 半透明背景
            Column.position({ x: 0, y: 0 });
            // 半透明背景
            Column.zIndex(300);
        }, Column);
        // 半透明背景
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 弹窗内容
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Accounting.ets(1615:5)", "entry");
            // 弹窗内容
            Column.width('90%');
            // 弹窗内容
            Column.padding(24);
            // 弹窗内容
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            // 弹窗内容
            Column.borderRadius(20);
            // 弹窗内容
            Column.position({ x: '5%', y: '30%' });
            // 弹窗内容
            Column.zIndex(301);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('设置月预算');
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1616:7)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            Text.margin({ bottom: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('设置每月预算金额，帮助您控制支出');
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1622:7)", "entry");
            Text.fontSize(14);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Text.margin({ bottom: 24 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 预算输入框
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(1628:7)", "entry");
            // 预算输入框
            Row.width('100%');
            // 预算输入框
            Row.margin({ bottom: 24 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('¥');
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(1629:9)", "entry");
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            Text.margin({ right: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入预算金额', text: this.budgetInputText });
            TextInput.debugLine("entry/src/main/ets/pages/Accounting.ets(1635:9)", "entry");
            TextInput.type(InputType.Number);
            TextInput.layoutWeight(1);
            TextInput.height(50);
            TextInput.fontSize(24);
            TextInput.fontWeight(FontWeight.Bold);
            TextInput.backgroundColor(Constants.COLOR_BACKGROUND);
            TextInput.borderRadius(12);
            TextInput.padding({ left: 16, right: 16 });
            TextInput.onChange((value: string) => {
                this.budgetInputText = value;
            });
        }, TextInput);
        // 预算输入框
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 快捷金额选择
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(1652:7)", "entry");
            // 快捷金额选择
            Row.width('100%');
            // 快捷金额选择
            Row.margin({ bottom: 24 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const amount = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Button.createWithLabel(`${amount}`);
                    Button.debugLine("entry/src/main/ets/pages/Accounting.ets(1654:11)", "entry");
                    Button.type(ButtonType.Normal);
                    Button.height(36);
                    Button.fontSize(14);
                    Button.backgroundColor(Constants.COLOR_BACKGROUND);
                    Button.fontColor(Constants.COLOR_TEXT_PRIMARY);
                    Button.borderRadius(18);
                    Button.padding({ left: 16, right: 16 });
                    Button.margin({ right: 8 });
                    Button.onClick(() => {
                        this.budgetInputText = amount.toString();
                    });
                }, Button);
                Button.pop();
            };
            this.forEachUpdateFunction(elmtId, [1000, 2000, 3000, 5000], forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        // 快捷金额选择
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 按钮组
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(1672:7)", "entry");
            // 按钮组
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('取消');
            Button.debugLine("entry/src/main/ets/pages/Accounting.ets(1673:9)", "entry");
            Button.type(ButtonType.Normal);
            Button.layoutWeight(1);
            Button.height(48);
            Button.fontSize(16);
            Button.backgroundColor(Constants.COLOR_BACKGROUND);
            Button.fontColor(Constants.COLOR_TEXT_PRIMARY);
            Button.borderRadius(24);
            Button.margin({ right: 12 });
            Button.onClick(() => {
                this.showBudgetDialog = false;
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('确定');
            Button.debugLine("entry/src/main/ets/pages/Accounting.ets(1686:9)", "entry");
            Button.type(ButtonType.Normal);
            Button.layoutWeight(1);
            Button.height(48);
            Button.fontSize(16);
            Button.fontWeight(FontWeight.Medium);
            Button.backgroundColor(Constants.COLOR_PRIMARY);
            Button.fontColor(Constants.COLOR_TEXT_ON_PRIMARY);
            Button.borderRadius(24);
            Button.onClick(() => {
                const budget = parseFloat(this.budgetInputText);
                if (!isNaN(budget) && budget >= 0) {
                    this.saveBudget(budget);
                    this.showBudgetDialog = false;
                }
                else {
                    promptAction.showToast({ message: '请输入有效的预算金额' });
                }
            });
        }, Button);
        Button.pop();
        // 按钮组
        Row.pop();
        // 弹窗内容
        Column.pop();
    }
    /**
     * 获取分类图标
     */
    private getCategoryIcon(category: BillCategory): string {
        if (category === BillCategory.FOOD) {
            return '🍔';
        }
        else if (category === BillCategory.TRANSPORT) {
            return '🚗';
        }
        else if (category === BillCategory.SHOPPING) {
            return '🛍️';
        }
        else if (category === BillCategory.ENTERTAINMENT) {
            return '🎬';
        }
        else if (category === BillCategory.MEDICAL) {
            return '🏥';
        }
        else if (category === BillCategory.EDUCATION) {
            return '📚';
        }
        else if (category === BillCategory.HOUSING) {
            return '🏠';
        }
        else if (category === BillCategory.UTILITIES) {
            return '💡';
        }
        else if (category === BillCategory.SALARY) {
            return '💰';
        }
        else if (category === BillCategory.BONUS) {
            return '🎁';
        }
        else if (category === BillCategory.INVESTMENT) {
            return '📈';
        }
        else if (category === BillCategory.GIFT) {
            return '🎁';
        }
        else {
            return '📝';
        }
    }
    /**
     * 获取分类名称
     */
    private getCategoryName(category: BillCategory): string {
        if (category === BillCategory.FOOD) {
            return '餐饮';
        }
        else if (category === BillCategory.TRANSPORT) {
            return '交通';
        }
        else if (category === BillCategory.SHOPPING) {
            return '购物';
        }
        else if (category === BillCategory.ENTERTAINMENT) {
            return '娱乐';
        }
        else if (category === BillCategory.MEDICAL) {
            return '医疗';
        }
        else if (category === BillCategory.EDUCATION) {
            return '教育';
        }
        else if (category === BillCategory.HOUSING) {
            return '住房';
        }
        else if (category === BillCategory.UTILITIES) {
            return '水电';
        }
        else if (category === BillCategory.SALARY) {
            return '工资';
        }
        else if (category === BillCategory.BONUS) {
            return '奖金';
        }
        else if (category === BillCategory.INVESTMENT) {
            return '投资';
        }
        else if (category === BillCategory.GIFT) {
            return '礼金';
        }
        else if (category === BillCategory.OTHER_EXPENSE) {
            return '其他支出';
        }
        else if (category === BillCategory.OTHER_INCOME) {
            return '其他收入';
        }
        else {
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
        groups.forEach((groupBills, date) => {
            // 每组内按创建时间倒序排列（最新的在前面）
            groupBills.sort((a: Bill, b: Bill): number => {
                return b.createTime.getTime() - a.createTime.getTime();
            });
            const group: BillGroup = {
                date: date,
                bills: groupBills
            };
            result.push(group);
        });
        // 按日期倒序排列
        result.sort((a: BillGroup, b: BillGroup): number => {
            return b.date.localeCompare(a.date);
        });
        return result;
    }
    rerender() {
        this.updateDirtyElements();
    }
}
