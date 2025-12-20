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
    showInputBar?: boolean;
    inputText?: string;
    isRecording?: boolean;
    isProcessing?: boolean;
    recordingDuration?: number;
    recordingTimer?: number;
    isLongPressing?: boolean;
    longPressTimer?: number;
    selectedBill?: Bill | null;
    showBillDetail?: boolean;
    historyBillGroups?: BillGroup[];
    billService?: BillService;
    aiService?: MimoAIService;
    audioRecorderService?: AudioRecorderService;
    speechRecognitionService?: SpeechRecognitionService;
}
import { BillService } from "@normalized:N&&&entry/src/main/ets/service/BillService&";
import { Bill, BillCategory } from "@normalized:N&&&entry/src/main/ets/model/Bill&";
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
import { Utils } from "@normalized:N&&&entry/src/main/ets/common/Utils&";
import { MimoAIService } from "@normalized:N&&&entry/src/main/ets/service/MimoAIService&";
import type { BillRecognitionResult } from "@normalized:N&&&entry/src/main/ets/service/MimoAIService&";
import { AudioRecorderService } from "@normalized:N&&&entry/src/main/ets/service/AudioRecorderService&";
import { SpeechRecognitionService } from "@normalized:N&&&entry/src/main/ets/service/SpeechRecognitionService&";
/**
 * 账单分组接口
 */
interface BillGroup {
    date: string;
    bills: Bill[];
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
        this.__showInputBar = new ObservedPropertySimplePU(false, this, "showInputBar");
        this.__inputText = new ObservedPropertySimplePU('', this, "inputText");
        this.__isRecording = new ObservedPropertySimplePU(false, this, "isRecording");
        this.__isProcessing = new ObservedPropertySimplePU(false, this, "isProcessing");
        this.__recordingDuration = new ObservedPropertySimplePU(0, this, "recordingDuration");
        this.__recordingTimer = new ObservedPropertySimplePU(0, this, "recordingTimer");
        this.__isLongPressing = new ObservedPropertySimplePU(false, this, "isLongPressing");
        this.longPressTimer = 0;
        this.__selectedBill = new ObservedPropertyObjectPU(null, this, "selectedBill");
        this.__showBillDetail = new ObservedPropertySimplePU(false, this, "showBillDetail");
        this.__historyBillGroups = new ObservedPropertyObjectPU([], this, "historyBillGroups");
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
        if (params.showInputBar !== undefined) {
            this.showInputBar = params.showInputBar;
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
        if (params.selectedBill !== undefined) {
            this.selectedBill = params.selectedBill;
        }
        if (params.showBillDetail !== undefined) {
            this.showBillDetail = params.showBillDetail;
        }
        if (params.historyBillGroups !== undefined) {
            this.historyBillGroups = params.historyBillGroups;
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
        this.__showInputBar.purgeDependencyOnElmtId(rmElmtId);
        this.__inputText.purgeDependencyOnElmtId(rmElmtId);
        this.__isRecording.purgeDependencyOnElmtId(rmElmtId);
        this.__isProcessing.purgeDependencyOnElmtId(rmElmtId);
        this.__recordingDuration.purgeDependencyOnElmtId(rmElmtId);
        this.__recordingTimer.purgeDependencyOnElmtId(rmElmtId);
        this.__isLongPressing.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedBill.purgeDependencyOnElmtId(rmElmtId);
        this.__showBillDetail.purgeDependencyOnElmtId(rmElmtId);
        this.__historyBillGroups.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__bills.aboutToBeDeleted();
        this.__todayBills.aboutToBeDeleted();
        this.__todayIncome.aboutToBeDeleted();
        this.__todayExpense.aboutToBeDeleted();
        this.__monthExpense.aboutToBeDeleted();
        this.__monthIncome.aboutToBeDeleted();
        this.__monthBalance.aboutToBeDeleted();
        this.__showInputBar.aboutToBeDeleted();
        this.__inputText.aboutToBeDeleted();
        this.__isRecording.aboutToBeDeleted();
        this.__isProcessing.aboutToBeDeleted();
        this.__recordingDuration.aboutToBeDeleted();
        this.__recordingTimer.aboutToBeDeleted();
        this.__isLongPressing.aboutToBeDeleted();
        this.__selectedBill.aboutToBeDeleted();
        this.__showBillDetail.aboutToBeDeleted();
        this.__historyBillGroups.aboutToBeDeleted();
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
    // 输入栏相关状态
    private __showInputBar: ObservedPropertySimplePU<boolean>;
    get showInputBar() {
        return this.__showInputBar.get();
    }
    set showInputBar(newValue: boolean) {
        this.__showInputBar.set(newValue);
    }
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
    private billService: BillService;
    private aiService: MimoAIService;
    private audioRecorderService: AudioRecorderService;
    private speechRecognitionService: SpeechRecognitionService;
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
            }
            catch (error) {
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
            this.showInputBar = false;
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
            this.showInputBar = false;
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.debugLine("entry/src/main/ets/pages/Accounting.ets(335:5)", "entry");
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Accounting.ets(336:7)", "entry");
            Column.width('100%');
            Column.flexGrow(1);
            Column.backgroundColor(Constants.COLOR_BACKGROUND);
        }, Column);
        // 顶部统计卡片
        this.buildSummaryCard.bind(this)();
        // 今天的账单列表
        this.buildTodayBillsList.bind(this)();
        // 历史账单列表
        this.buildHistoryBillsList.bind(this)();
        Column.pop();
        // 右下角加号按钮
        this.buildAddButton.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 输入栏遮罩层和输入栏（点击加号时显示）
            if (this.showInputBar) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 半透明遮罩层
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Accounting.ets(356:9)", "entry");
                        // 半透明遮罩层
                        Column.width('100%');
                        // 半透明遮罩层
                        Column.height('100%');
                        // 半透明遮罩层
                        Column.backgroundColor('#000000');
                        // 半透明遮罩层
                        Column.opacity(0.3);
                        // 半透明遮罩层
                        Column.onClick(() => {
                            this.onCloseInputBar();
                        });
                    }, Column);
                    // 半透明遮罩层
                    Column.pop();
                    // 输入栏
                    this.buildInputBar.bind(this)();
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
            else {
                this.ifElseBranchUpdateFunction(1, () => {
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
            Column.debugLine("entry/src/main/ets/pages/Accounting.ets(383:5)", "entry");
            Column.width('100%');
            Column.padding(20);
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Column.borderRadius(12);
            Column.margin({ top: 16, left: 16, right: 16, bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 12月支出标题
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(385:7)", "entry");
            // 12月支出标题
            Row.width('100%');
            // 12月支出标题
            Row.margin({ bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('12月支出');
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(386:9)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/Accounting.ets(391:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('👁');
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(393:9)", "entry");
            Text.fontSize(20);
        }, Text);
        Text.pop();
        // 12月支出标题
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 支出金额
            Text.create(`¥${this.monthExpense.toFixed(2)}`);
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(400:7)", "entry");
            // 支出金额
            Text.fontSize(32);
            // 支出金额
            Text.fontWeight(FontWeight.Bold);
            // 支出金额
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            // 支出金额
            Text.margin({ bottom: 12 });
        }, Text);
        // 支出金额
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 收入和结余
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(407:7)", "entry");
            // 收入和结余
            Row.width('100%');
            // 收入和结余
            Row.margin({ bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Accounting.ets(408:9)", "entry");
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('收入');
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(409:11)", "entry");
            Text.fontSize(14);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`¥${this.monthIncome.toFixed(2)}`);
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(412:11)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(Constants.COLOR_SUCCESS);
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/Accounting.ets(420:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Accounting.ets(422:9)", "entry");
            Column.alignItems(HorizontalAlign.End);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('结余');
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(423:11)", "entry");
            Text.fontSize(14);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`¥${this.monthBalance.toFixed(2)}`);
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(426:11)", "entry");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(Constants.COLOR_PRIMARY);
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
        // 收入和结余
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 月预算进度条
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(438:7)", "entry");
            // 月预算进度条
            Row.width('100%');
            // 月预算进度条
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('月预算66%');
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(439:9)", "entry");
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/Accounting.ets(443:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('剩余 ¥407.25');
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(445:9)", "entry");
            Text.fontSize(12);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        // 月预算进度条
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 进度条（使用Row模拟）
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(453:7)", "entry");
            // 进度条（使用Row模拟）
            Row.width('100%');
            // 进度条（使用Row模拟）
            Row.height(6);
            // 进度条（使用Row模拟）
            Row.backgroundColor(Constants.COLOR_BORDER);
            // 进度条（使用Row模拟）
            Row.borderRadius(3);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(454:9)", "entry");
            Row.width('66%');
            Row.height(6);
            Row.backgroundColor(Constants.COLOR_PRIMARY);
            Row.borderRadius(3);
        }, Row);
        Row.pop();
        // 进度条（使用Row模拟）
        Row.pop();
        Column.pop();
    }
    /**
     * 构建今天的账单列表
     */
    buildTodayBillsList(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Accounting.ets(477:5)", "entry");
            Column.width('100%');
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Column.borderRadius(12);
            Column.margin({ left: 16, right: 16, bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(479:7)", "entry");
            // 标题
            Row.width('100%');
            // 标题
            Row.padding({ left: 16, right: 16, top: 12, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`今天 ${Utils.formatDate(new Date(), 'MM月DD日')} (${this.getWeekDay()})`);
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(480:9)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/Accounting.ets(485:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('>');
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(487:9)", "entry");
            Text.fontSize(16);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        // 标题
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 今日统计
            Text.create(`支出¥${this.todayExpense.toFixed(2)} | 收入¥${this.todayIncome.toFixed(2)}`);
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(495:7)", "entry");
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
                        Column.debugLine("entry/src/main/ets/pages/Accounting.ets(502:9)", "entry");
                        Column.width('100%');
                        Column.padding(20);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('今天还没有账单');
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(503:11)", "entry");
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
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Accounting.ets(510:9)", "entry");
                        Column.width('100%');
                        Column.padding({ left: 16, right: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const bill = _item;
                            this.buildBillItem.bind(this)(bill);
                        };
                        this.forEachUpdateFunction(elmtId, this.todayBills, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
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
                        Column.debugLine("entry/src/main/ets/pages/Accounting.ets(531:7)", "entry");
                        Column.width('100%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const group = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Column.create();
                                Column.debugLine("entry/src/main/ets/pages/Accounting.ets(533:11)", "entry");
                                Column.width('100%');
                                Column.backgroundColor('#FFFFFF');
                                Column.borderRadius(12);
                                Column.margin({ left: 16, right: 16, bottom: 12 });
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 日期标题
                                Row.create();
                                Row.debugLine("entry/src/main/ets/pages/Accounting.ets(535:13)", "entry");
                                // 日期标题
                                Row.width('100%');
                                // 日期标题
                                Row.padding({ left: 16, right: 16, top: 12, bottom: 8 });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(group.date);
                                Text.debugLine("entry/src/main/ets/pages/Accounting.ets(536:15)", "entry");
                                Text.fontSize(14);
                                Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                            }, Text);
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Blank.create();
                                Blank.debugLine("entry/src/main/ets/pages/Accounting.ets(540:15)", "entry");
                            }, Blank);
                            Blank.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create('>');
                                Text.debugLine("entry/src/main/ets/pages/Accounting.ets(542:15)", "entry");
                                Text.fontSize(14);
                                Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                            }, Text);
                            Text.pop();
                            // 日期标题
                            Row.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 该日期的账单
                                Column.create();
                                Column.debugLine("entry/src/main/ets/pages/Accounting.ets(550:13)", "entry");
                                // 该日期的账单
                                Column.width('100%');
                                // 该日期的账单
                                Column.padding({ left: 16, right: 16, bottom: 8 });
                            }, Column);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                ForEach.create();
                                const forEachItemGenFunction = _item => {
                                    const bill = _item;
                                    this.buildBillItem.bind(this)(bill);
                                };
                                this.forEachUpdateFunction(elmtId, group.bills, forEachItemGenFunction);
                            }, ForEach);
                            ForEach.pop();
                            // 该日期的账单
                            Column.pop();
                            Column.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.historyBillGroups, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                });
            }
            else /**
             * 构建单个账单项
             */ {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
    }
    /**
     * 构建单个账单项
     */
    buildBillItem(bill: Bill, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(573:5)", "entry");
            Row.width('100%');
            Row.padding(12);
            Row.backgroundColor(Constants.COLOR_BACKGROUND_SECONDARY);
            Row.borderRadius(8);
            Row.margin({ bottom: 8 });
            Row.onClick(() => {
                this.onBillTap(bill);
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 时间
            Text.create(Utils.formatDate(bill.date, 'HH:mm'));
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(575:7)", "entry");
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
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(581:7)", "entry");
            // 分类图标和名称
            Row.layoutWeight(1);
            // 分类图标和名称
            Row.margin({ left: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getCategoryIcon(bill.category));
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(582:9)", "entry");
            Text.fontSize(20);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.getCategoryName(bill.category));
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(584:9)", "entry");
            Text.fontSize(16);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        // 分类图标和名称
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 金额
            Text.create(bill.getDisplayAmount());
            Text.debugLine("entry/src/main/ets/pages/Accounting.ets(593:7)", "entry");
            // 金额
            Text.fontSize(16);
            // 金额
            Text.fontWeight(FontWeight.Medium);
            // 金额
            Text.fontColor(bill.isIncome() ? Constants.COLOR_SUCCESS : Constants.COLOR_DANGER);
        }, Text);
        // 金额
        Text.pop();
        Row.pop();
    }
    /**
     * 构建加号按钮
     */
    buildAddButton(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('+');
            Button.debugLine("entry/src/main/ets/pages/Accounting.ets(615:5)", "entry");
            Button.type(ButtonType.Circle);
            Button.width(56);
            Button.height(56);
            Button.fontSize(32);
            Button.fontColor(Constants.COLOR_TEXT_ON_PRIMARY);
            Button.backgroundColor(this.isRecording ? Constants.COLOR_DANGER : Constants.COLOR_PRIMARY);
            Button.position({ x: '100%', y: '100%' });
            Button.translate({ x: -72, y: -72 });
            Button.zIndex(20);
            Button.onClick(() => {
                if (this.isRecording) {
                    // 如果正在录音，点击停止录音
                    this.stopRecording();
                }
                else if (!this.isLongPressing) {
                    // 如果不是长按，展开输入栏
                    this.onAddButtonClick();
                }
                // 重置长按状态
                this.isLongPressing = false;
            });
            Button.onTouch((event) => {
                // 使用事件对象的type属性，不导入类型
                if (event.type === 0 && !this.isRecording) { // 0 表示 Down
                    // 开始长按计时
                    const timerId = setTimeout(() => {
                        this.isLongPressing = true;
                        this.onAddButtonLongPress();
                    }, 500);
                    this.longPressTimer = timerId as number;
                }
                else if (event.type === 1 || event.type === 3) { // 1 表示 Up, 3 表示 Cancel
                    // 取消长按计时
                    if (this.longPressTimer) {
                        clearTimeout(this.longPressTimer);
                        this.longPressTimer = 0;
                    }
                    this.isLongPressing = false;
                }
            });
        }, Button);
        Button.pop();
    }
    /**
     * 构建输入栏
     */
    buildInputBar(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Accounting.ets(661:5)", "entry");
            Column.width('100%');
            Column.padding({ left: 16, right: 16, top: 16, bottom: 16 });
            Column.backgroundColor(Constants.COLOR_BACKGROUND_SECONDARY);
            Column.borderRadius({ topLeft: 16, topRight: 16 });
            Column.alignItems(HorizontalAlign.Start);
            Column.position({ x: 0, y: '100%' });
            Column.translate({ y: this.isRecording ? -180 : -120 });
            Column.zIndex(100);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 录音状态显示
            if (this.isRecording) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/Accounting.ets(664:9)", "entry");
                        Row.width('100%');
                        Row.padding(12);
                        Row.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
                        Row.borderRadius(8);
                        Row.margin({ bottom: 8 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 录音动画指示器
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Accounting.ets(666:11)", "entry");
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
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(667:13)", "entry");
                        Text.fontSize(20);
                        Text.fontColor(Constants.COLOR_DANGER);
                    }, Text);
                    Text.pop();
                    // 录音动画指示器
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 录音时长
                        Text.create(`录音中 ${this.formatDuration(this.recordingDuration)}`);
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(681:11)", "entry");
                        // 录音时长
                        Text.fontSize(14);
                        // 录音时长
                        Text.fontColor(Constants.COLOR_DANGER);
                        // 录音时长
                        Text.margin({ left: 8 });
                    }, Text);
                    // 录音时长
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/pages/Accounting.ets(686:11)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 停止录音按钮
                        Button.createWithLabel('停止');
                        Button.debugLine("entry/src/main/ets/pages/Accounting.ets(689:11)", "entry");
                        // 停止录音按钮
                        Button.type(ButtonType.Normal);
                        // 停止录音按钮
                        Button.fontSize(14);
                        // 停止录音按钮
                        Button.backgroundColor(Constants.COLOR_DANGER);
                        // 停止录音按钮
                        Button.fontColor('#FFFFFF');
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
            Row.debugLine("entry/src/main/ets/pages/Accounting.ets(706:7)", "entry");
            Row.width('100%');
            Row.padding(12);
            Row.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Row.borderRadius(8);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 输入框
            TextInput.create({
                placeholder: this.isRecording ? '正在录音...' : '输入账单描述，如：午餐15元',
                text: this.inputText
            });
            TextInput.debugLine("entry/src/main/ets/pages/Accounting.ets(708:9)", "entry");
            // 输入框
            TextInput.layoutWeight(1);
            // 输入框
            TextInput.fontSize(16);
            // 输入框
            TextInput.enabled(!this.isRecording);
            // 输入框
            TextInput.onChange((value: string) => {
                this.inputText = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 发送按钮
            Button.createWithLabel('发送');
            Button.debugLine("entry/src/main/ets/pages/Accounting.ets(720:9)", "entry");
            // 发送按钮
            Button.type(ButtonType.Normal);
            // 发送按钮
            Button.fontSize(14);
            // 发送按钮
            Button.backgroundColor(Constants.COLOR_PRIMARY);
            // 发送按钮
            Button.fontColor(Constants.COLOR_TEXT_ON_PRIMARY);
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 关闭按钮
            Button.createWithLabel('×');
            Button.debugLine("entry/src/main/ets/pages/Accounting.ets(732:9)", "entry");
            // 关闭按钮
            Button.type(ButtonType.Normal);
            // 关闭按钮
            Button.fontSize(20);
            // 关闭按钮
            Button.backgroundColor(Constants.COLOR_BORDER);
            // 关闭按钮
            Button.fontColor(Constants.COLOR_TEXT_PRIMARY);
            // 关闭按钮
            Button.width(32);
            // 关闭按钮
            Button.height(32);
            // 关闭按钮
            Button.margin({ left: 8 });
            // 关闭按钮
            Button.onClick(() => {
                this.onCloseInputBar();
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
                        Column.debugLine("entry/src/main/ets/pages/Accounting.ets(765:7)", "entry");
                        Column.width('90%');
                        Column.padding(20);
                        Column.backgroundColor(Constants.COLOR_BACKGROUND);
                        Column.borderRadius(16);
                        Column.position({ x: '5%', y: '20%' });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 详情内容
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Accounting.ets(767:9)", "entry");
                        // 详情内容
                        Column.width('100%');
                        // 详情内容
                        Column.padding(20);
                        // 详情内容
                        Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
                        // 详情内容
                        Column.borderRadius(12);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('账单详情');
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(768:11)", "entry");
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Bold);
                        Text.margin({ bottom: 20 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/Accounting.ets(773:11)", "entry");
                        Row.width('100%');
                        Row.margin({ bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('金额：');
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(774:13)", "entry");
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.selectedBill.getDisplayAmount());
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(775:13)", "entry");
                        Text.fontSize(20);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(this.selectedBill.isIncome() ? Constants.COLOR_SUCCESS : Constants.COLOR_DANGER);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/pages/Accounting.ets(785:11)", "entry");
                        Row.width('100%');
                        Row.margin({ bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('分类：');
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(786:13)", "entry");
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.getCategoryName(this.selectedBill.category));
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(787:13)", "entry");
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.selectedBill.description) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.debugLine("entry/src/main/ets/pages/Accounting.ets(793:13)", "entry");
                                    Row.width('100%');
                                    Row.margin({ bottom: 12 });
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('描述：');
                                    Text.debugLine("entry/src/main/ets/pages/Accounting.ets(794:15)", "entry");
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.selectedBill.description);
                                    Text.debugLine("entry/src/main/ets/pages/Accounting.ets(795:15)", "entry");
                                }, Text);
                                Text.pop();
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
                        Row.debugLine("entry/src/main/ets/pages/Accounting.ets(801:11)", "entry");
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('时间：');
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(802:13)", "entry");
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(Utils.formatDate(this.selectedBill.date, Constants.DATETIME_FORMAT));
                        Text.debugLine("entry/src/main/ets/pages/Accounting.ets(803:13)", "entry");
                    }, Text);
                    Text.pop();
                    Row.pop();
                    // 详情内容
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 关闭按钮
                        Button.createWithLabel('关闭');
                        Button.debugLine("entry/src/main/ets/pages/Accounting.ets(813:9)", "entry");
                        // 关闭按钮
                        Button.type(ButtonType.Normal);
                        // 关闭按钮
                        Button.width('100%');
                        // 关闭按钮
                        Button.margin({ top: 12 });
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
             * 获取分类图标
             */ {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
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
    rerender() {
        this.updateDirtyElements();
    }
}
