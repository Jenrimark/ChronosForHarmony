if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface YearView_Params {
    currentYear?: number;
    selectedDate?: Date;
    onMonthSelect?: (year: number, month: number) => void;
    today?: Date;
    monthNames?: string[];
    weekDays?: string[];
}
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
/**
 * 迷你月份数据
 */
class MiniMonthData {
    year: number = 0;
    month: number = 0; // 0-11
    days: MiniDayData[] = [];
}
/**
 * 迷你日期数据
 */
class MiniDayData {
    day: number = 0;
    isCurrentMonth: boolean = true;
    isToday: boolean = false;
    isWeekend: boolean = false;
}
export class YearView extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentYear = new SynchedPropertySimpleOneWayPU(params.currentYear, this, "currentYear");
        this.__selectedDate = new SynchedPropertyObjectTwoWayPU(params.selectedDate, this, "selectedDate");
        this.onMonthSelect = () => { };
        this.today = new Date();
        this.monthNames = ['一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'];
        this.weekDays = ['日', '一', '二', '三', '四', '五', '六'];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: YearView_Params) {
        if (params.currentYear === undefined) {
            this.__currentYear.set(new Date().getFullYear());
        }
        if (params.onMonthSelect !== undefined) {
            this.onMonthSelect = params.onMonthSelect;
        }
        if (params.today !== undefined) {
            this.today = params.today;
        }
        if (params.monthNames !== undefined) {
            this.monthNames = params.monthNames;
        }
        if (params.weekDays !== undefined) {
            this.weekDays = params.weekDays;
        }
    }
    updateStateVars(params: YearView_Params) {
        this.__currentYear.reset(params.currentYear);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentYear.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedDate.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentYear.aboutToBeDeleted();
        this.__selectedDate.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentYear: SynchedPropertySimpleOneWayPU<number>;
    get currentYear() {
        return this.__currentYear.get();
    }
    set currentYear(newValue: number) {
        this.__currentYear.set(newValue);
    }
    private __selectedDate: SynchedPropertySimpleOneWayPU<Date>;
    get selectedDate() {
        return this.__selectedDate.get();
    }
    set selectedDate(newValue: Date) {
        this.__selectedDate.set(newValue);
    }
    private onMonthSelect: (year: number, month: number) => void;
    private today: Date;
    private monthNames: string[];
    private weekDays: string[];
    /**
     * 生成12个月的数据
     */
    getMonthsData(): MiniMonthData[] {
        const months: MiniMonthData[] = [];
        for (let m = 0; m < 12; m++) {
            const monthData = new MiniMonthData();
            monthData.year = this.currentYear;
            monthData.month = m;
            monthData.days = this.generateMonthDays(this.currentYear, m);
            months.push(monthData);
        }
        return months;
    }
    /**
     * 生成单月的日期数据
     */
    generateMonthDays(year: number, month: number): MiniDayData[] {
        const days: MiniDayData[] = [];
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const firstDayWeek = firstDay.getDay();
        // 上月填充
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = firstDayWeek - 1; i >= 0; i--) {
            const dayData = new MiniDayData();
            dayData.day = prevMonthLastDay - i;
            dayData.isCurrentMonth = false;
            dayData.isToday = false;
            dayData.isWeekend = false;
            days.push(dayData);
        }
        // 当月日期
        const daysInMonth = lastDay.getDate();
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const dayData = new MiniDayData();
            dayData.day = d;
            dayData.isCurrentMonth = true;
            dayData.isToday = this.isSameDay(date, this.today);
            dayData.isWeekend = date.getDay() === 0 || date.getDay() === 6;
            days.push(dayData);
        }
        // 下月填充（补齐到42天或35天）
        const totalDays = days.length <= 35 ? 35 : 42;
        const remaining = totalDays - days.length;
        for (let i = 1; i <= remaining; i++) {
            const dayData = new MiniDayData();
            dayData.day = i;
            dayData.isCurrentMonth = false;
            dayData.isToday = false;
            dayData.isWeekend = false;
            days.push(dayData);
        }
        return days;
    }
    /**
     * 判断是否同一天
     */
    isSameDay(date1: Date, date2: Date): boolean {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    }
    /**
     * 判断是否当前月
     */
    isCurrentMonth(month: number): boolean {
        return this.currentYear === this.today.getFullYear() && month === this.today.getMonth();
    }
    /**
     * 判断是否选中月
     */
    isSelectedMonth(month: number): boolean {
        return this.currentYear === this.selectedDate.getFullYear() && month === this.selectedDate.getMonth();
    }
    /**
     * 构建迷你月历
     */
    buildMiniMonth(monthData: MiniMonthData, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/calendar/YearView.ets(127:5)", "entry");
            Column.width('100%');
            Column.padding(4);
            Column.backgroundColor(this.isSelectedMonth(monthData.month) ? '#FFF8F5' : Constants.COLOR_CARD_BACKGROUND);
            Column.borderRadius(6);
            Column.border({
                width: this.isCurrentMonth(monthData.month) ? 1 : 0,
                color: Constants.COLOR_PRIMARY
            });
            Column.onClick(() => {
                this.onMonthSelect(monthData.year, monthData.month);
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 月份标题
            Text.create(this.monthNames[monthData.month]);
            Text.debugLine("entry/src/main/ets/components/calendar/YearView.ets(129:7)", "entry");
            // 月份标题
            Text.fontSize(11);
            // 月份标题
            Text.fontWeight(this.isCurrentMonth(monthData.month) ? FontWeight.Bold : FontWeight.Normal);
            // 月份标题
            Text.fontColor(this.isCurrentMonth(monthData.month) ? Constants.COLOR_PRIMARY : Constants.COLOR_TEXT_PRIMARY);
            // 月份标题
            Text.margin({ bottom: 2 });
        }, Text);
        // 月份标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 星期标题
            Row.create();
            Row.debugLine("entry/src/main/ets/components/calendar/YearView.ets(136:7)", "entry");
            // 星期标题
            Row.width('100%');
            // 星期标题
            Row.margin({ bottom: 1 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const day = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(day);
                    Text.debugLine("entry/src/main/ets/components/calendar/YearView.ets(138:11)", "entry");
                    Text.fontSize(7);
                    Text.fontColor(index === 0 || index === 6 ? Constants.COLOR_DANGER : Constants.COLOR_TEXT_TERTIARY);
                    Text.width('14.28%');
                    Text.textAlign(TextAlign.Center);
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, this.weekDays, forEachItemGenFunction, undefined, true, false);
        }, ForEach);
        ForEach.pop();
        // 星期标题
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 日期网格
            Grid.create();
            Grid.debugLine("entry/src/main/ets/components/calendar/YearView.ets(149:7)", "entry");
            // 日期网格
            Grid.columnsTemplate('1fr 1fr 1fr 1fr 1fr 1fr 1fr');
            // 日期网格
            Grid.rowsTemplate(monthData.days.length <= 35 ? '1fr 1fr 1fr 1fr 1fr' : '1fr 1fr 1fr 1fr 1fr 1fr');
            // 日期网格
            Grid.width('100%');
            // 日期网格
            Grid.height(monthData.days.length <= 35 ? 45 : 54);
        }, Grid);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const day = _item;
                {
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        GridItem.create(() => { }, false);
                        GridItem.debugLine("entry/src/main/ets/components/calendar/YearView.ets(151:11)", "entry");
                    };
                    const observedDeepRender = () => {
                        this.observeComponentCreation2(itemCreation2, GridItem);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(`${day.day}`);
                            Text.debugLine("entry/src/main/ets/components/calendar/YearView.ets(152:13)", "entry");
                            Text.fontSize(7);
                            Text.fontColor(this.getMiniDayColor(day));
                            Text.fontWeight(day.isToday ? FontWeight.Bold : FontWeight.Normal);
                            Text.width('100%');
                            Text.height('100%');
                            Text.textAlign(TextAlign.Center);
                            Text.backgroundColor(day.isToday ? Constants.COLOR_PRIMARY_LIGHT : Color.Transparent);
                            Text.borderRadius(2);
                        }, Text);
                        Text.pop();
                        GridItem.pop();
                    };
                    observedDeepRender();
                }
            };
            this.forEachUpdateFunction(elmtId, monthData.days, forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        // 日期网格
        Grid.pop();
        Column.pop();
    }
    /**
     * 获取迷你日期颜色
     */
    getMiniDayColor(day: MiniDayData): string {
        if (!day.isCurrentMonth) {
            return Constants.COLOR_TEXT_TERTIARY;
        }
        if (day.isToday) {
            return Constants.COLOR_PRIMARY;
        }
        if (day.isWeekend) {
            return Constants.COLOR_DANGER;
        }
        return Constants.COLOR_TEXT_PRIMARY;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.debugLine("entry/src/main/ets/components/calendar/YearView.ets(199:5)", "entry");
            Scroll.width('100%');
            Scroll.height('100%');
            Scroll.scrollBar(BarState.Off);
            Scroll.edgeEffect(EdgeEffect.Spring);
            Scroll.backgroundColor(Constants.COLOR_BACKGROUND);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/calendar/YearView.ets(200:7)", "entry");
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 年份标题
            Row.create();
            Row.debugLine("entry/src/main/ets/components/calendar/YearView.ets(202:9)", "entry");
            // 年份标题
            Row.width('100%');
            // 年份标题
            Row.justifyContent(FlexAlign.Center);
            // 年份标题
            Row.padding({ top: 8, bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.currentYear}年`);
            Text.debugLine("entry/src/main/ets/components/calendar/YearView.ets(203:11)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Constants.COLOR_TEXT_PRIMARY);
        }, Text);
        Text.pop();
        // 年份标题
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 12个月网格 (3x4) - 使用 Flex 布局替代 Grid 以支持滚动
            Flex.create({ wrap: FlexWrap.Wrap, justifyContent: FlexAlign.SpaceBetween });
            Flex.debugLine("entry/src/main/ets/components/calendar/YearView.ets(213:9)", "entry");
            // 12个月网格 (3x4) - 使用 Flex 布局替代 Grid 以支持滚动
            Flex.width('100%');
            // 12个月网格 (3x4) - 使用 Flex 布局替代 Grid 以支持滚动
            Flex.padding({ left: 8, right: 8, bottom: 80 });
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const monthData = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.debugLine("entry/src/main/ets/components/calendar/YearView.ets(215:13)", "entry");
                    Column.width('32%');
                    Column.margin({ bottom: 6 });
                }, Column);
                this.buildMiniMonth.bind(this)(monthData);
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.getMonthsData(), forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        // 12个月网格 (3x4) - 使用 Flex 布局替代 Grid 以支持滚动
        Flex.pop();
        Column.pop();
        Scroll.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
