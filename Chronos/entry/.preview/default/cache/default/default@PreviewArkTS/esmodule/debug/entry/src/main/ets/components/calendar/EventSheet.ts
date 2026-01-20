if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface EventSheet_Params {
    isShow?: boolean;
    editEvent?: CalendarEvent | null;
    selectedDate?: Date;
    onSave?: (event: CalendarEvent) => void;
    onDelete?: (event: CalendarEvent) => void;
    title?: string;
    location?: string;
    isAllDay?: boolean;
    startTime?: Date;
    endTime?: Date;
    reminderType?: ReminderType;
    repeatRule?: RepeatRule;
    isImportant?: boolean;
    smartInput?: string;
    showReminderPicker?: boolean;
    showRepeatPicker?: boolean;
    showTimePicker?: boolean;
    isEditingStart?: boolean;
    smartParser?: SmartParser;
    isEditMode?: boolean;
}
import { CalendarEvent, ReminderType, RepeatRule, getReminderTypeText, getRepeatRuleText } from "@normalized:N&&&entry/src/main/ets/model/CalendarEvent&";
import { SmartParser } from "@normalized:N&&&entry/src/main/ets/utils/SmartParser&";
import type { ParseResult } from "@normalized:N&&&entry/src/main/ets/utils/SmartParser&";
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
/**
 * DatePicker 返回值接口
 */
interface DatePickerValue {
    year: number;
    month: number;
    day: number;
    hour?: number;
    minute?: number;
}
/**
 * TimePicker 返回值接口
 */
interface TimePickerResult {
    hour: number;
    minute: number;
}
export class EventSheet extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__isShow = new SynchedPropertySimpleTwoWayPU(params.isShow, this, "isShow");
        this.__editEvent = new SynchedPropertyObjectOneWayPU(params.editEvent, this, "editEvent");
        this.__selectedDate = new SynchedPropertyObjectTwoWayPU(params.selectedDate, this, "selectedDate");
        this.onSave = () => { };
        this.onDelete = () => { };
        this.__title = new ObservedPropertySimplePU('', this, "title");
        this.__location = new ObservedPropertySimplePU('', this, "location");
        this.__isAllDay = new ObservedPropertySimplePU(false, this, "isAllDay");
        this.__startTime = new ObservedPropertyObjectPU(new Date(), this, "startTime");
        this.__endTime = new ObservedPropertyObjectPU(new Date(), this, "endTime");
        this.__reminderType = new ObservedPropertySimplePU(ReminderType.TEN_MIN, this, "reminderType");
        this.__repeatRule = new ObservedPropertySimplePU(RepeatRule.NONE, this, "repeatRule");
        this.__isImportant = new ObservedPropertySimplePU(false, this, "isImportant");
        this.__smartInput = new ObservedPropertySimplePU('', this, "smartInput");
        this.__showReminderPicker = new ObservedPropertySimplePU(false, this, "showReminderPicker");
        this.__showRepeatPicker = new ObservedPropertySimplePU(false, this, "showRepeatPicker");
        this.__showTimePicker = new ObservedPropertySimplePU(false, this, "showTimePicker");
        this.__isEditingStart = new ObservedPropertySimplePU(true, this, "isEditingStart");
        this.smartParser = SmartParser.getInstance();
        this.isEditMode = false;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: EventSheet_Params) {
        if (params.editEvent === undefined) {
            this.__editEvent.set(null);
        }
        if (params.onSave !== undefined) {
            this.onSave = params.onSave;
        }
        if (params.onDelete !== undefined) {
            this.onDelete = params.onDelete;
        }
        if (params.title !== undefined) {
            this.title = params.title;
        }
        if (params.location !== undefined) {
            this.location = params.location;
        }
        if (params.isAllDay !== undefined) {
            this.isAllDay = params.isAllDay;
        }
        if (params.startTime !== undefined) {
            this.startTime = params.startTime;
        }
        if (params.endTime !== undefined) {
            this.endTime = params.endTime;
        }
        if (params.reminderType !== undefined) {
            this.reminderType = params.reminderType;
        }
        if (params.repeatRule !== undefined) {
            this.repeatRule = params.repeatRule;
        }
        if (params.isImportant !== undefined) {
            this.isImportant = params.isImportant;
        }
        if (params.smartInput !== undefined) {
            this.smartInput = params.smartInput;
        }
        if (params.showReminderPicker !== undefined) {
            this.showReminderPicker = params.showReminderPicker;
        }
        if (params.showRepeatPicker !== undefined) {
            this.showRepeatPicker = params.showRepeatPicker;
        }
        if (params.showTimePicker !== undefined) {
            this.showTimePicker = params.showTimePicker;
        }
        if (params.isEditingStart !== undefined) {
            this.isEditingStart = params.isEditingStart;
        }
        if (params.smartParser !== undefined) {
            this.smartParser = params.smartParser;
        }
        if (params.isEditMode !== undefined) {
            this.isEditMode = params.isEditMode;
        }
    }
    updateStateVars(params: EventSheet_Params) {
        this.__editEvent.reset(params.editEvent);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isShow.purgeDependencyOnElmtId(rmElmtId);
        this.__editEvent.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedDate.purgeDependencyOnElmtId(rmElmtId);
        this.__title.purgeDependencyOnElmtId(rmElmtId);
        this.__location.purgeDependencyOnElmtId(rmElmtId);
        this.__isAllDay.purgeDependencyOnElmtId(rmElmtId);
        this.__startTime.purgeDependencyOnElmtId(rmElmtId);
        this.__endTime.purgeDependencyOnElmtId(rmElmtId);
        this.__reminderType.purgeDependencyOnElmtId(rmElmtId);
        this.__repeatRule.purgeDependencyOnElmtId(rmElmtId);
        this.__isImportant.purgeDependencyOnElmtId(rmElmtId);
        this.__smartInput.purgeDependencyOnElmtId(rmElmtId);
        this.__showReminderPicker.purgeDependencyOnElmtId(rmElmtId);
        this.__showRepeatPicker.purgeDependencyOnElmtId(rmElmtId);
        this.__showTimePicker.purgeDependencyOnElmtId(rmElmtId);
        this.__isEditingStart.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isShow.aboutToBeDeleted();
        this.__editEvent.aboutToBeDeleted();
        this.__selectedDate.aboutToBeDeleted();
        this.__title.aboutToBeDeleted();
        this.__location.aboutToBeDeleted();
        this.__isAllDay.aboutToBeDeleted();
        this.__startTime.aboutToBeDeleted();
        this.__endTime.aboutToBeDeleted();
        this.__reminderType.aboutToBeDeleted();
        this.__repeatRule.aboutToBeDeleted();
        this.__isImportant.aboutToBeDeleted();
        this.__smartInput.aboutToBeDeleted();
        this.__showReminderPicker.aboutToBeDeleted();
        this.__showRepeatPicker.aboutToBeDeleted();
        this.__showTimePicker.aboutToBeDeleted();
        this.__isEditingStart.aboutToBeDeleted();
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
    private __editEvent: SynchedPropertySimpleOneWayPU<CalendarEvent | null>;
    get editEvent() {
        return this.__editEvent.get();
    }
    set editEvent(newValue: CalendarEvent | null) {
        this.__editEvent.set(newValue);
    }
    private __selectedDate: SynchedPropertySimpleOneWayPU<Date>;
    get selectedDate() {
        return this.__selectedDate.get();
    }
    set selectedDate(newValue: Date) {
        this.__selectedDate.set(newValue);
    }
    private onSave: (event: CalendarEvent) => void;
    private onDelete: (event: CalendarEvent) => void;
    private __title: ObservedPropertySimplePU<string>;
    get title() {
        return this.__title.get();
    }
    set title(newValue: string) {
        this.__title.set(newValue);
    }
    private __location: ObservedPropertySimplePU<string>;
    get location() {
        return this.__location.get();
    }
    set location(newValue: string) {
        this.__location.set(newValue);
    }
    private __isAllDay: ObservedPropertySimplePU<boolean>;
    get isAllDay() {
        return this.__isAllDay.get();
    }
    set isAllDay(newValue: boolean) {
        this.__isAllDay.set(newValue);
    }
    private __startTime: ObservedPropertyObjectPU<Date>;
    get startTime() {
        return this.__startTime.get();
    }
    set startTime(newValue: Date) {
        this.__startTime.set(newValue);
    }
    private __endTime: ObservedPropertyObjectPU<Date>;
    get endTime() {
        return this.__endTime.get();
    }
    set endTime(newValue: Date) {
        this.__endTime.set(newValue);
    }
    private __reminderType: ObservedPropertySimplePU<ReminderType>;
    get reminderType() {
        return this.__reminderType.get();
    }
    set reminderType(newValue: ReminderType) {
        this.__reminderType.set(newValue);
    }
    private __repeatRule: ObservedPropertySimplePU<RepeatRule>;
    get repeatRule() {
        return this.__repeatRule.get();
    }
    set repeatRule(newValue: RepeatRule) {
        this.__repeatRule.set(newValue);
    }
    private __isImportant: ObservedPropertySimplePU<boolean>;
    get isImportant() {
        return this.__isImportant.get();
    }
    set isImportant(newValue: boolean) {
        this.__isImportant.set(newValue);
    }
    private __smartInput: ObservedPropertySimplePU<string>;
    get smartInput() {
        return this.__smartInput.get();
    }
    set smartInput(newValue: string) {
        this.__smartInput.set(newValue);
    }
    private __showReminderPicker: ObservedPropertySimplePU<boolean>;
    get showReminderPicker() {
        return this.__showReminderPicker.get();
    }
    set showReminderPicker(newValue: boolean) {
        this.__showReminderPicker.set(newValue);
    }
    private __showRepeatPicker: ObservedPropertySimplePU<boolean>;
    get showRepeatPicker() {
        return this.__showRepeatPicker.get();
    }
    set showRepeatPicker(newValue: boolean) {
        this.__showRepeatPicker.set(newValue);
    }
    private __showTimePicker: ObservedPropertySimplePU<boolean>;
    get showTimePicker() {
        return this.__showTimePicker.get();
    }
    set showTimePicker(newValue: boolean) {
        this.__showTimePicker.set(newValue);
    }
    private __isEditingStart: ObservedPropertySimplePU<boolean>;
    get isEditingStart() {
        return this.__isEditingStart.get();
    }
    set isEditingStart(newValue: boolean) {
        this.__isEditingStart.set(newValue);
    }
    private smartParser: SmartParser;
    private isEditMode: boolean;
    aboutToAppear() {
        this.isEditMode = this.editEvent !== null;
        if (this.isEditMode && this.editEvent) {
            this.loadEventData(this.editEvent);
        }
        else {
            this.initNewEvent();
        }
    }
    /**
     * 加载编辑事件数据
     */
    loadEventData(event: CalendarEvent): void {
        this.title = event.title;
        this.location = event.location;
        this.isAllDay = event.isAllDay;
        this.startTime = new Date(event.startTime);
        this.endTime = new Date(event.endTime);
        this.reminderType = event.reminder;
        this.repeatRule = event.repeatRule;
        this.isImportant = event.priority;
    }
    /**
     * 初始化新事件
     */
    initNewEvent(): void {
        const now = new Date();
        // 使用选中日期
        this.startTime = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate(), now.getHours() + 1, 0, 0);
        this.endTime = new Date(this.startTime);
        this.endTime.setHours(this.startTime.getHours() + 1);
    }
    /**
     * 智能解析输入
     */
    onSmartInputChange(value: string): void {
        this.smartInput = value;
        if (value.length > 0) {
            const result = this.smartParser.parse(value);
            this.applyParseResult(result);
        }
    }
    /**
     * 应用解析结果
     */
    applyParseResult(result: ParseResult): void {
        if (result.title.length > 0) {
            this.title = result.title;
        }
        if (result.hasDate && result.date) {
            this.startTime = new Date(result.date.getFullYear(), result.date.getMonth(), result.date.getDate(), this.startTime.getHours(), this.startTime.getMinutes());
            this.endTime = new Date(this.startTime);
            this.endTime.setHours(this.startTime.getHours() + 1);
        }
        if (result.hasTime && result.time) {
            this.startTime.setHours(result.time.getHours());
            this.startTime.setMinutes(result.time.getMinutes());
            this.endTime = new Date(this.startTime);
            this.endTime.setHours(this.startTime.getHours() + 1);
        }
        if (result.location.length > 0) {
            this.location = result.location;
        }
        this.isAllDay = result.isAllDay;
    }
    /**
     * 格式化日期显示
     */
    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}年${month}月${day}日`;
    }
    /**
     * 格式化时间显示
     */
    formatTime(date: Date): string {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const h = hours < 10 ? `0${hours}` : `${hours}`;
        const m = minutes < 10 ? `0${minutes}` : `${minutes}`;
        return `${h}:${m}`;
    }
    /**
     * 验证表单
     */
    validateForm(): boolean {
        if (this.title.trim().length === 0) {
            return false;
        }
        return true;
    }
    /**
     * 保存事件
     */
    saveEvent(): void {
        if (!this.validateForm()) {
            return;
        }
        const event = this.isEditMode && this.editEvent ? this.editEvent : new CalendarEvent();
        event.title = this.title.trim();
        event.location = this.location.trim();
        event.isAllDay = this.isAllDay;
        event.startTime = new Date(this.startTime);
        event.endTime = new Date(this.endTime);
        event.reminder = this.reminderType;
        event.repeatRule = this.repeatRule;
        event.priority = this.isImportant;
        this.onSave(event);
        this.isShow = false;
    }
    /**
     * 删除事件
     */
    deleteEvent(): void {
        if (this.editEvent) {
            this.onDelete(this.editEvent);
            this.isShow = false;
        }
    }
    /**
     * 构建输入行
     */
    buildInputRow(icon: string, placeholder: string, value: string, onChange: (val: string) => void, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(201:5)", "entry");
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
            Row.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Row.borderRadius(8);
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(icon);
            Text.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(202:7)", "entry");
            Text.fontSize(18);
            Text.width(30);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: placeholder, text: value });
            TextInput.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(206:7)", "entry");
            TextInput.layoutWeight(1);
            TextInput.backgroundColor(Color.Transparent);
            TextInput.onChange(onChange);
        }, TextInput);
        Row.pop();
    }
    /**
     * 构建开关行
     */
    buildToggleRow(icon: string, label: string, isOn: boolean, onToggle: (val: boolean) => void, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(223:5)", "entry");
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
            Row.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Row.borderRadius(8);
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(icon);
            Text.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(224:7)", "entry");
            Text.fontSize(18);
            Text.width(30);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(228:7)", "entry");
            Text.fontSize(15);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: isOn });
            Toggle.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(233:7)", "entry");
            Toggle.onChange(onToggle);
        }, Toggle);
        Toggle.pop();
        Row.pop();
    }
    /**
     * 构建选择行
     */
    buildSelectRow(icon: string, label: string, value: string, onClick: () => void, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(248:5)", "entry");
            Row.width('100%');
            Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
            Row.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
            Row.borderRadius(8);
            Row.margin({ bottom: 8 });
            Row.onClick(onClick);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(icon);
            Text.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(249:7)", "entry");
            Text.fontSize(18);
            Text.width(30);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(253:7)", "entry");
            Text.fontSize(15);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(value);
            Text.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(258:7)", "entry");
            Text.fontSize(14);
            Text.fontColor(Constants.COLOR_TEXT_SECONDARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('›');
            Text.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(262:7)", "entry");
            Text.fontSize(18);
            Text.fontColor(Constants.COLOR_TEXT_TERTIARY);
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        Row.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(276:5)", "entry");
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(277:7)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(Constants.COLOR_BACKGROUND);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 头部
            Row.create();
            Row.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(279:9)", "entry");
            // 头部
            Row.width('100%');
            // 头部
            Row.padding({ left: 8, right: 8, top: 12, bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('取消');
            Button.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(280:11)", "entry");
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
            Blank.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(288:11)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.isEditMode ? '编辑日程' : '新建日程');
            Text.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(290:11)", "entry");
            Text.fontSize(17);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(295:11)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('保存');
            Button.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(297:11)", "entry");
            Button.type(ButtonType.Normal);
            Button.backgroundColor(Color.Transparent);
            Button.fontColor(this.validateForm() ? Constants.COLOR_PRIMARY : Constants.COLOR_TEXT_TERTIARY);
            Button.onClick(() => {
                this.saveEvent();
            });
        }, Button);
        Button.pop();
        // 头部
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(308:9)", "entry");
            Scroll.layoutWeight(1);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(309:11)", "entry");
            Column.width('100%');
            Column.padding({ left: 16, right: 16, bottom: 32 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 智能输入
            Row.create();
            Row.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(311:13)", "entry");
            // 智能输入
            Row.width('100%');
            // 智能输入
            Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
            // 智能输入
            Row.backgroundColor('#FFF8F5');
            // 智能输入
            Row.borderRadius(8);
            // 智能输入
            Row.margin({ bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('✨');
            Text.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(312:15)", "entry");
            Text.fontSize(18);
            Text.width(30);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '一句话智能创建日程（如：明天下午3点开会）', text: this.smartInput });
            TextInput.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(316:15)", "entry");
            TextInput.layoutWeight(1);
            TextInput.backgroundColor(Color.Transparent);
            TextInput.onChange((value: string) => {
                this.onSmartInputChange(value);
            });
        }, TextInput);
        // 智能输入
        Row.pop();
        // 标题
        this.buildInputRow.bind(this)('📝', '日程标题', this.title, (val: string) => {
            this.title = val;
        });
        // 地点
        this.buildInputRow.bind(this)('📍', '添加地点', this.location, (val: string) => {
            this.location = val;
        });
        // 全天开关
        this.buildToggleRow.bind(this)('🌅', '全天', this.isAllDay, (val: boolean) => {
            this.isAllDay = val;
        });
        // 开始时间
        this.buildSelectRow.bind(this)('🕐', '开始', this.isAllDay ? this.formatDate(ObservedObject.GetRawObject(this.startTime)) : `${this.formatDate(ObservedObject.GetRawObject(this.startTime))} ${this.formatTime(ObservedObject.GetRawObject(this.startTime))}`, () => {
            this.isEditingStart = true;
            this.showTimePicker = true;
        });
        // 结束时间
        this.buildSelectRow.bind(this)('🕑', '结束', this.isAllDay ? this.formatDate(ObservedObject.GetRawObject(this.endTime)) : `${this.formatDate(ObservedObject.GetRawObject(this.endTime))} ${this.formatTime(ObservedObject.GetRawObject(this.endTime))}`, () => {
            this.isEditingStart = false;
            this.showTimePicker = true;
        });
        // 提醒
        this.buildSelectRow.bind(this)('🔔', '提醒', getReminderTypeText(this.reminderType), () => {
            this.showReminderPicker = true;
        });
        // 重复
        this.buildSelectRow.bind(this)('🔄', '重复', getRepeatRuleText(this.repeatRule), () => {
            this.showRepeatPicker = true;
        });
        // 重要标记
        this.buildToggleRow.bind(this)('⭐', '重要', this.isImportant, (val: boolean) => {
            this.isImportant = val;
        });
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 删除按钮（编辑模式）
            if (this.isEditMode) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('删除日程');
                        Button.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(377:15)", "entry");
                        Button.type(ButtonType.Normal);
                        Button.width('100%');
                        Button.height(44);
                        Button.backgroundColor('#FFF0F0');
                        Button.fontColor(Constants.COLOR_DANGER);
                        Button.margin({ top: 24 });
                        Button.onClick(() => {
                            this.deleteEvent();
                        });
                    }, Button);
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 提醒选择器
            if (this.showReminderPicker) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(401:9)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('rgba(0,0,0,0.5)');
                        Column.onClick(() => {
                            this.showReminderPicker = false;
                        });
                    }, Column);
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(409:9)", "entry");
                        Column.width('100%');
                        Column.height(400);
                        Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
                        Column.borderRadius({ topLeft: 20, topRight: 20 });
                        Column.position({ x: 0, y: '100%' });
                        Column.translate({ y: -400 });
                        Column.zIndex(1000);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(410:11)", "entry");
                        Row.width('100%');
                        Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(411:13)", "entry");
                        Button.type(ButtonType.Normal);
                        Button.backgroundColor(Color.Transparent);
                        Button.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Button.onClick(() => {
                            this.showReminderPicker = false;
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(419:13)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('选择提醒');
                        Text.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(421:13)", "entry");
                        Text.fontSize(17);
                        Text.fontWeight(FontWeight.Medium);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(425:13)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('确定');
                        Button.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(427:13)", "entry");
                        Button.type(ButtonType.Normal);
                        Button.backgroundColor(Color.Transparent);
                        Button.fontColor(Constants.COLOR_PRIMARY);
                        Button.onClick(() => {
                            this.showReminderPicker = false;
                        });
                    }, Button);
                    Button.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create();
                        List.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(438:11)", "entry");
                        List.width('100%');
                        List.layoutWeight(1);
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const type = _item;
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
                                    ListItem.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(448:15)", "entry");
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create();
                                        Row.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(449:17)", "entry");
                                        Row.width('100%');
                                        Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
                                        Row.onClick(() => {
                                            this.reminderType = type;
                                            this.showReminderPicker = false;
                                        });
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(getReminderTypeText(type));
                                        Text.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(450:19)", "entry");
                                        Text.fontSize(15);
                                        Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Blank.create();
                                        Blank.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(454:19)", "entry");
                                    }, Blank);
                                    Blank.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        if (this.reminderType === type) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create('✓');
                                                    Text.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(457:21)", "entry");
                                                    Text.fontSize(18);
                                                    Text.fontColor(Constants.COLOR_PRIMARY);
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
                                    Row.pop();
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, [
                            ReminderType.NONE,
                            ReminderType.AT_TIME,
                            ReminderType.FIVE_MIN,
                            ReminderType.TEN_MIN,
                            ReminderType.THIRTY_MIN,
                            ReminderType.ONE_HOUR,
                            ReminderType.ONE_DAY
                        ], forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                    Column.pop();
                });
            }
            // 重复选择器
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 重复选择器
            if (this.showRepeatPicker) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(485:9)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('rgba(0,0,0,0.5)');
                        Column.onClick(() => {
                            this.showRepeatPicker = false;
                        });
                    }, Column);
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(493:9)", "entry");
                        Column.width('100%');
                        Column.height(300);
                        Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
                        Column.borderRadius({ topLeft: 20, topRight: 20 });
                        Column.position({ x: 0, y: '100%' });
                        Column.translate({ y: -300 });
                        Column.zIndex(1000);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(494:11)", "entry");
                        Row.width('100%');
                        Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(495:13)", "entry");
                        Button.type(ButtonType.Normal);
                        Button.backgroundColor(Color.Transparent);
                        Button.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Button.onClick(() => {
                            this.showRepeatPicker = false;
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(503:13)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('选择重复');
                        Text.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(505:13)", "entry");
                        Text.fontSize(17);
                        Text.fontWeight(FontWeight.Medium);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(509:13)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('确定');
                        Button.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(511:13)", "entry");
                        Button.type(ButtonType.Normal);
                        Button.backgroundColor(Color.Transparent);
                        Button.fontColor(Constants.COLOR_PRIMARY);
                        Button.onClick(() => {
                            this.showRepeatPicker = false;
                        });
                    }, Button);
                    Button.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create();
                        List.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(522:11)", "entry");
                        List.width('100%');
                        List.layoutWeight(1);
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const rule = _item;
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
                                    ListItem.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(530:15)", "entry");
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create();
                                        Row.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(531:17)", "entry");
                                        Row.width('100%');
                                        Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
                                        Row.onClick(() => {
                                            this.repeatRule = rule;
                                            this.showRepeatPicker = false;
                                        });
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(getRepeatRuleText(rule));
                                        Text.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(532:19)", "entry");
                                        Text.fontSize(15);
                                        Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Blank.create();
                                        Blank.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(536:19)", "entry");
                                    }, Blank);
                                    Blank.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        if (this.repeatRule === rule) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create('✓');
                                                    Text.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(539:21)", "entry");
                                                    Text.fontSize(18);
                                                    Text.fontColor(Constants.COLOR_PRIMARY);
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
                                    Row.pop();
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, [
                            RepeatRule.NONE,
                            RepeatRule.DAILY,
                            RepeatRule.WEEKLY,
                            RepeatRule.MONTHLY,
                            RepeatRule.YEARLY
                        ], forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    List.pop();
                    Column.pop();
                });
            }
            // 时间选择器
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 时间选择器
            if (this.showTimePicker) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(567:9)", "entry");
                        Column.width('100%');
                        Column.height('100%');
                        Column.backgroundColor('rgba(0,0,0,0.5)');
                        Column.onClick(() => {
                            this.showTimePicker = false;
                        });
                    }, Column);
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(575:9)", "entry");
                        Column.width('100%');
                        Column.height(this.isAllDay ? 400 : 500);
                        Column.backgroundColor(Constants.COLOR_CARD_BACKGROUND);
                        Column.borderRadius({ topLeft: 20, topRight: 20 });
                        Column.position({ x: 0, y: '100%' });
                        Column.translate({ y: this.isAllDay ? -400 : -500 });
                        Column.zIndex(1000);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(576:11)", "entry");
                        Row.width('100%');
                        Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(577:13)", "entry");
                        Button.type(ButtonType.Normal);
                        Button.backgroundColor(Color.Transparent);
                        Button.fontColor(Constants.COLOR_TEXT_SECONDARY);
                        Button.onClick(() => {
                            this.showTimePicker = false;
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(585:13)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.isAllDay ? '选择日期' : '选择日期时间');
                        Text.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(587:13)", "entry");
                        Text.fontSize(17);
                        Text.fontWeight(FontWeight.Medium);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                        Blank.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(591:13)", "entry");
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('确定');
                        Button.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(593:13)", "entry");
                        Button.type(ButtonType.Normal);
                        Button.backgroundColor(Color.Transparent);
                        Button.fontColor(Constants.COLOR_PRIMARY);
                        Button.onClick(() => {
                            this.showTimePicker = false;
                        });
                    }, Button);
                    Button.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.isAllDay) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    DatePicker.create({
                                        start: new Date('1970-1-1'),
                                        selected: this.isEditingStart ? this.startTime : this.endTime
                                    });
                                    DatePicker.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(605:13)", "entry");
                                    DatePicker.onChange((value: DatePickerValue) => {
                                        const year = value.year;
                                        const month = value.month - 1;
                                        const day = value.day;
                                        const selectedDate = new Date(year, month, day);
                                        if (this.isEditingStart) {
                                            this.startTime = selectedDate;
                                            this.endTime = new Date(selectedDate);
                                        }
                                        else {
                                            this.endTime = selectedDate;
                                        }
                                    });
                                }, DatePicker);
                                DatePicker.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 非全天模式，需要同时选择日期和时间
                                    Row.create();
                                    Row.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(623:13)", "entry");
                                    // 非全天模式，需要同时选择日期和时间
                                    Row.width('100%');
                                    // 非全天模式，需要同时选择日期和时间
                                    Row.height('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 日期选择器
                                    DatePicker.create({
                                        start: new Date('1970-1-1'),
                                        selected: this.isEditingStart ? this.startTime : this.endTime
                                    });
                                    DatePicker.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(625:15)", "entry");
                                    // 日期选择器
                                    DatePicker.onChange((value: DatePickerValue) => {
                                        const year = value.year;
                                        const month = value.month - 1;
                                        const day = value.day;
                                        const currentTime = this.isEditingStart ? this.startTime : this.endTime;
                                        const hour = currentTime.getHours();
                                        const minute = currentTime.getMinutes();
                                        const selectedDateTime = new Date(year, month, day, hour, minute);
                                        if (this.isEditingStart) {
                                            this.startTime = selectedDateTime;
                                            if (this.endTime <= this.startTime) {
                                                this.endTime = new Date(this.startTime);
                                                this.endTime.setHours(this.startTime.getHours() + 1);
                                            }
                                        }
                                        else {
                                            this.endTime = selectedDateTime;
                                            if (this.endTime <= this.startTime) {
                                                this.endTime = new Date(this.startTime);
                                                this.endTime.setHours(this.startTime.getHours() + 1);
                                            }
                                        }
                                    });
                                    // 日期选择器
                                    DatePicker.layoutWeight(1);
                                }, DatePicker);
                                // 日期选择器
                                DatePicker.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 时间选择器
                                    TimePicker.create({
                                        selected: this.isEditingStart ? this.startTime : this.endTime
                                    });
                                    TimePicker.debugLine("entry/src/main/ets/components/calendar/EventSheet.ets(654:15)", "entry");
                                    // 时间选择器
                                    TimePicker.onChange((value: TimePickerResult) => {
                                        const currentDate = this.isEditingStart ? this.startTime : this.endTime;
                                        const year = currentDate.getFullYear();
                                        const month = currentDate.getMonth();
                                        const day = currentDate.getDate();
                                        const selectedDateTime = new Date(year, month, day, value.hour, value.minute);
                                        if (this.isEditingStart) {
                                            this.startTime = selectedDateTime;
                                            if (this.endTime <= this.startTime) {
                                                this.endTime = new Date(this.startTime);
                                                this.endTime.setHours(this.startTime.getHours() + 1);
                                            }
                                        }
                                        else {
                                            this.endTime = selectedDateTime;
                                            if (this.endTime <= this.startTime) {
                                                this.endTime = new Date(this.startTime);
                                                this.endTime.setHours(this.startTime.getHours() + 1);
                                            }
                                        }
                                    });
                                    // 时间选择器
                                    TimePicker.layoutWeight(1);
                                }, TimePicker);
                                // 时间选择器
                                TimePicker.pop();
                                // 非全天模式，需要同时选择日期和时间
                                Row.pop();
                            });
                        }
                    }, If);
                    If.pop();
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
    rerender() {
        this.updateDirtyElements();
    }
}
