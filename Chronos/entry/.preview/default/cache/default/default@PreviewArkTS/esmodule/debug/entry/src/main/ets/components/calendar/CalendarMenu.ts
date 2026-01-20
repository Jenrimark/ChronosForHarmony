if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SearchEventSheet_Params {
    isShow?: boolean;
    keyword?: string;
    searchResults?: SearchResultItem[];
    onSearch?: (keyword: string) => Promise<SearchResultItem[]>;
    onSelectEvent?: (eventId: number) => void;
}
interface JumpToDateSheet_Params {
    isShow?: boolean;
    targetDate?: Date;
    onConfirm?: (date: Date) => void;
    selectedYear?: number;
    selectedMonth?: number;
    selectedDay?: number;
}
interface CalendarMenu_Params {
    isShow?: boolean;
    onCreateEvent?: () => void;
    onJumpToDate?: () => void;
    onSearch?: () => void;
    onSettings?: () => void;
    onHelp?: () => void;
}
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
export class CalendarMenu extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__isShow = new SynchedPropertySimpleTwoWayPU(params.isShow, this, "isShow");
        this.onCreateEvent = () => { };
        this.onJumpToDate = () => { };
        this.onSearch = () => { };
        this.onSettings = () => { };
        this.onHelp = () => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CalendarMenu_Params) {
        if (params.onCreateEvent !== undefined) {
            this.onCreateEvent = params.onCreateEvent;
        }
        if (params.onJumpToDate !== undefined) {
            this.onJumpToDate = params.onJumpToDate;
        }
        if (params.onSearch !== undefined) {
            this.onSearch = params.onSearch;
        }
        if (params.onSettings !== undefined) {
            this.onSettings = params.onSettings;
        }
        if (params.onHelp !== undefined) {
            this.onHelp = params.onHelp;
        }
    }
    updateStateVars(params: CalendarMenu_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isShow.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isShow.aboutToBeDeleted();
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
    private onCreateEvent: () => void;
    private onJumpToDate: () => void;
    private onSearch: () => void;
    private onSettings: () => void;
    private onHelp: () => void;
    /**
     * 构建菜单项
     */
    buildMenuItem(icon: string, label: string, onClick: () => void, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(20:5)", "entry");
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 14, bottom: 14 });
            Row.onClick(() => {
                onClick();
                this.isShow = false;
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(icon);
            Text.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(21:7)", "entry");
            Text.fontSize(18);
            Text.width(30);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(25:7)", "entry");
            Text.fontSize(15);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        Row.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(39:5)", "entry");
            Column.width(200);
            Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Column.borderRadius(12);
            Column.shadow({
                radius: 16,
                color: 'rgba(0,0,0,0.1)',
                offsetX: 0,
                offsetY: 4
            });
        }, Column);
        this.buildMenuItem.bind(this)('➕', '新建日程', this.onCreateEvent);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(42:7)", "entry");
            Divider.color(Constants.COLOR_DIVIDER);
            Divider.margin({ left: 46 });
        }, Divider);
        this.buildMenuItem.bind(this)('📅', '跳转到指定日期', this.onJumpToDate);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(48:7)", "entry");
            Divider.color(Constants.COLOR_DIVIDER);
            Divider.margin({ left: 46 });
        }, Divider);
        this.buildMenuItem.bind(this)('🔍', '搜索日程', this.onSearch);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(54:7)", "entry");
            Divider.color(Constants.COLOR_DIVIDER);
            Divider.margin({ left: 46 });
        }, Divider);
        this.buildMenuItem.bind(this)('⚙️', '设置', this.onSettings);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(60:7)", "entry");
            Divider.color(Constants.COLOR_DIVIDER);
            Divider.margin({ left: 46 });
        }, Divider);
        this.buildMenuItem.bind(this)('❓', '帮助与反馈', this.onHelp);
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export class JumpToDateSheet extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__isShow = new SynchedPropertySimpleTwoWayPU(params.isShow, this, "isShow");
        this.__targetDate = new SynchedPropertyObjectTwoWayPU(params.targetDate, this, "targetDate");
        this.onConfirm = () => { };
        this.__selectedYear = new ObservedPropertySimplePU(new Date().getFullYear(), this, "selectedYear");
        this.__selectedMonth = new ObservedPropertySimplePU(new Date().getMonth(), this, "selectedMonth");
        this.__selectedDay = new ObservedPropertySimplePU(new Date().getDate(), this, "selectedDay");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: JumpToDateSheet_Params) {
        if (params.onConfirm !== undefined) {
            this.onConfirm = params.onConfirm;
        }
        if (params.selectedYear !== undefined) {
            this.selectedYear = params.selectedYear;
        }
        if (params.selectedMonth !== undefined) {
            this.selectedMonth = params.selectedMonth;
        }
        if (params.selectedDay !== undefined) {
            this.selectedDay = params.selectedDay;
        }
    }
    updateStateVars(params: JumpToDateSheet_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isShow.purgeDependencyOnElmtId(rmElmtId);
        this.__targetDate.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedYear.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedMonth.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedDay.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isShow.aboutToBeDeleted();
        this.__targetDate.aboutToBeDeleted();
        this.__selectedYear.aboutToBeDeleted();
        this.__selectedMonth.aboutToBeDeleted();
        this.__selectedDay.aboutToBeDeleted();
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
    private __targetDate: SynchedPropertySimpleOneWayPU<Date>;
    get targetDate() {
        return this.__targetDate.get();
    }
    set targetDate(newValue: Date) {
        this.__targetDate.set(newValue);
    }
    private onConfirm: (date: Date) => void;
    private __selectedYear: ObservedPropertySimplePU<number>;
    get selectedYear() {
        return this.__selectedYear.get();
    }
    set selectedYear(newValue: number) {
        this.__selectedYear.set(newValue);
    }
    private __selectedMonth: ObservedPropertySimplePU<number>;
    get selectedMonth() {
        return this.__selectedMonth.get();
    }
    set selectedMonth(newValue: number) {
        this.__selectedMonth.set(newValue);
    }
    private __selectedDay: ObservedPropertySimplePU<number>;
    get selectedDay() {
        return this.__selectedDay.get();
    }
    set selectedDay(newValue: number) {
        this.__selectedDay.set(newValue);
    }
    aboutToAppear() {
        this.selectedYear = this.targetDate.getFullYear();
        this.selectedMonth = this.targetDate.getMonth();
        this.selectedDay = this.targetDate.getDate();
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
     * 获取日期列表
     */
    getDays(): number[] {
        const days: number[] = [];
        const daysInMonth = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
        for (let d = 1; d <= daysInMonth; d++) {
            days.push(d);
        }
        return days;
    }
    /**
     * 确认选择
     */
    confirm(): void {
        const date = new Date(this.selectedYear, this.selectedMonth, this.selectedDay);
        this.onConfirm(date);
        this.isShow = false;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(142:5)", "entry");
            Column.width('100%');
            Column.backgroundColor(Constants.COLOR_BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 头部
            Row.create();
            Row.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(144:7)", "entry");
            // 头部
            Row.width('100%');
            // 头部
            Row.padding({ left: 8, right: 8, top: 12, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('取消');
            Button.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(145:9)", "entry");
            Button.type(ButtonType.Normal);
            Button.backgroundColor(Color.Transparent);
            Button.fontColor(Constants.COLOR_TEXT_SECONDARY);
            Button.onClick(() => {
                this.isShow = false;
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(153:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('跳转到日期');
            Text.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(155:9)", "entry");
            Text.fontSize(17);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(160:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('确定');
            Button.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(162:9)", "entry");
            Button.type(ButtonType.Normal);
            Button.backgroundColor(Color.Transparent);
            Button.fontColor(Constants.COLOR_PRIMARY);
            Button.onClick(() => {
                this.confirm();
            });
        }, Button);
        Button.pop();
        // 头部
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 日期选择器
            Row.create();
            Row.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(174:7)", "entry");
            // 日期选择器
            Row.width('100%');
            // 日期选择器
            Row.height(200);
            // 日期选择器
            Row.padding({ left: 16, right: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 年
            TextPicker.create({ range: this.getYears().map(y => `${y}年`), selected: this.selectedYear - (new Date().getFullYear() - 50) });
            TextPicker.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(176:9)", "entry");
            // 年
            TextPicker.layoutWeight(1);
            // 年
            TextPicker.onChange((value: string | string[], index: number | number[]) => {
                if (typeof index === 'number') {
                    this.selectedYear = new Date().getFullYear() - 50 + index;
                }
            });
        }, TextPicker);
        // 年
        TextPicker.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 月
            TextPicker.create({ range: this.getMonths().map(m => `${m + 1}月`), selected: this.selectedMonth });
            TextPicker.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(185:9)", "entry");
            // 月
            TextPicker.layoutWeight(1);
            // 月
            TextPicker.onChange((value: string | string[], index: number | number[]) => {
                if (typeof index === 'number') {
                    this.selectedMonth = index;
                }
            });
        }, TextPicker);
        // 月
        TextPicker.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 日
            TextPicker.create({ range: this.getDays().map(d => `${d}日`), selected: this.selectedDay - 1 });
            TextPicker.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(194:9)", "entry");
            // 日
            TextPicker.layoutWeight(1);
            // 日
            TextPicker.onChange((value: string | string[], index: number | number[]) => {
                if (typeof index === 'number') {
                    this.selectedDay = index + 1;
                }
            });
        }, TextPicker);
        // 日
        TextPicker.pop();
        // 日期选择器
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 快捷按钮
            Row.create();
            Row.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(207:7)", "entry");
            // 快捷按钮
            Row.width('100%');
            // 快捷按钮
            Row.justifyContent(FlexAlign.Center);
            // 快捷按钮
            Row.padding({ top: 16, bottom: 32 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('今天');
            Button.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(208:9)", "entry");
            Button.type(ButtonType.Normal);
            Button.backgroundColor(Constants.COLOR_PRIMARY_LIGHT);
            Button.fontColor(Constants.COLOR_PRIMARY);
            Button.onClick(() => {
                const today = new Date();
                this.selectedYear = today.getFullYear();
                this.selectedMonth = today.getMonth();
                this.selectedDay = today.getDate();
            });
        }, Button);
        Button.pop();
        // 快捷按钮
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export class SearchEventSheet extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__isShow = new SynchedPropertySimpleTwoWayPU(params.isShow, this, "isShow");
        this.__keyword = new ObservedPropertySimplePU('', this, "keyword");
        this.__searchResults = new ObservedPropertyObjectPU([], this, "searchResults");
        this.onSearch = async () => [];
        this.onSelectEvent = () => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SearchEventSheet_Params) {
        if (params.keyword !== undefined) {
            this.keyword = params.keyword;
        }
        if (params.searchResults !== undefined) {
            this.searchResults = params.searchResults;
        }
        if (params.onSearch !== undefined) {
            this.onSearch = params.onSearch;
        }
        if (params.onSelectEvent !== undefined) {
            this.onSelectEvent = params.onSelectEvent;
        }
    }
    updateStateVars(params: SearchEventSheet_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isShow.purgeDependencyOnElmtId(rmElmtId);
        this.__keyword.purgeDependencyOnElmtId(rmElmtId);
        this.__searchResults.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isShow.aboutToBeDeleted();
        this.__keyword.aboutToBeDeleted();
        this.__searchResults.aboutToBeDeleted();
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
    private __keyword: ObservedPropertySimplePU<string>;
    get keyword() {
        return this.__keyword.get();
    }
    set keyword(newValue: string) {
        this.__keyword.set(newValue);
    }
    private __searchResults: ObservedPropertyObjectPU<SearchResultItem[]>;
    get searchResults() {
        return this.__searchResults.get();
    }
    set searchResults(newValue: SearchResultItem[]) {
        this.__searchResults.set(newValue);
    }
    private onSearch: (keyword: string) => Promise<SearchResultItem[]>;
    private onSelectEvent: (eventId: number) => void;
    /**
     * 执行搜索
     */
    async doSearch(): Promise<void> {
        if (this.keyword.trim().length === 0) {
            this.searchResults = [];
            return;
        }
        this.searchResults = await this.onSearch(this.keyword);
    }
    /**
     * 格式化日期
     */
    formatDate(date: Date): string {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}月${day}日`;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(260:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(Constants.COLOR_BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索框
            Row.create();
            Row.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(262:7)", "entry");
            // 搜索框
            Row.width('100%');
            // 搜索框
            Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
            // 搜索框
            Row.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            // 搜索框
            Row.borderRadius(8);
            // 搜索框
            Row.margin({ left: 16, right: 16, top: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('🔍');
            Text.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(263:9)", "entry");
            Text.fontSize(18);
            Text.margin({ right: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '搜索日程标题或地点', text: this.keyword });
            TextInput.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(267:9)", "entry");
            TextInput.layoutWeight(1);
            TextInput.backgroundColor(Color.Transparent);
            TextInput.onChange((value: string) => {
                this.keyword = value;
                this.doSearch();
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.keyword.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('✕');
                        Text.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(276:11)", "entry");
                        Text.fontSize(16);
                        Text.fontColor(Constants.COLOR_TEXT_TERTIARY);
                        Text.onClick(() => {
                            this.keyword = '';
                            this.searchResults = [];
                        });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 搜索框
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 搜索结果
            if (this.searchResults.length === 0 && this.keyword.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(293:9)", "entry");
                        Column.width('100%');
                        Column.height(200);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('😔');
                        Text.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(294:11)", "entry");
                        Text.fontSize(40);
                        Text.opacity(0.3);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('没有找到相关日程');
                        Text.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(297:11)", "entry");
                        Text.fontSize(14);
                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Text.margin({ top: 12 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create();
                        List.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(306:9)", "entry");
                        List.width('100%');
                        List.layoutWeight(1);
                        List.divider({
                            strokeWidth: 1,
                            color: Constants.COLOR_DIVIDER,
                            startMargin: 16,
                            endMargin: 16
                        });
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
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
                                    ListItem.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(308:13)", "entry");
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create();
                                        Row.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(309:15)", "entry");
                                        Row.width('100%');
                                        Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
                                        Row.onClick(() => {
                                            this.onSelectEvent(item.id);
                                            this.isShow = false;
                                        });
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create();
                                        Column.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(310:17)", "entry");
                                        Column.alignItems(HorizontalAlign.Start);
                                        Column.layoutWeight(1);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.title);
                                        Text.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(311:19)", "entry");
                                        Text.fontSize(15);
                                        Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(this.formatDate(item.date));
                                        Text.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(315:19)", "entry");
                                        Text.fontSize(12);
                                        Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
                                        Text.margin({ top: 4 });
                                    }, Text);
                                    Text.pop();
                                    Column.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create('›');
                                        Text.debugLine("entry/src/main/ets/components/calendar/CalendarMenu.ets(323:17)", "entry");
                                        Text.fontSize(18);
                                        Text.fontColor(Constants.COLOR_TEXT_TERTIARY);
                                    }, Text);
                                    Text.pop();
                                    Row.pop();
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.searchResults, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
/**
 * 搜索结果项
 */
export class SearchResultItem {
    id: number = 0;
    title: string = '';
    date: Date = new Date();
}
