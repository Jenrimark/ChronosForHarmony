if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface DateCell_Params {
    day?: CalendarDayData;
    onSelect?: (day: CalendarDayData) => void;
    solarTermsList?: string[];
}
import type { MxnzpHolidayData, Holiday } from '../../model/Holiday';
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
/**
 * 日历日期项数据
 */
export class CalendarDayData {
    date: Date = new Date();
    isCurrentMonth: boolean = true;
    isToday: boolean = false;
    isSelected: boolean = false;
    taskCount: number = 0;
    eventCount: number = 0;
    holiday: Holiday | null = null;
    calendarInfo: MxnzpHolidayData | null = null;
}
export class DateCell extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__day = new SynchedPropertyObjectOneWayPU(params.day, this, "day");
        this.onSelect = () => { };
        this.solarTermsList = [
            '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
            '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
            '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
            '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'
        ];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: DateCell_Params) {
        if (params.day === undefined) {
            this.__day.set(new CalendarDayData());
        }
        if (params.onSelect !== undefined) {
            this.onSelect = params.onSelect;
        }
        if (params.solarTermsList !== undefined) {
            this.solarTermsList = params.solarTermsList;
        }
    }
    updateStateVars(params: DateCell_Params) {
        this.__day.reset(params.day);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__day.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__day.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __day: SynchedPropertySimpleOneWayPU<CalendarDayData>;
    get day() {
        return this.__day.get();
    }
    set day(newValue: CalendarDayData) {
        this.__day.set(newValue);
    }
    private onSelect: (day: CalendarDayData) => void;
    /**
     * 24节气列表
     */
    private readonly solarTermsList: string[];
    /**
     * 判断是否是真正的24节气
     */
    isRealSolarTerm(solarTerms: string): boolean {
        if (!solarTerms || solarTerms === '无') {
            return false;
        }
        if (solarTerms.includes('后') || solarTerms.includes('前')) {
            return false;
        }
        return this.solarTermsList.includes(solarTerms);
    }
    /**
     * 获取显示文本
     * 优先级：节日 > 节气 > 农历
     */
    getDisplayText(): string {
        if (!this.day.calendarInfo) {
            return '';
        }
        // 1. 节假日显示节日名称
        if (this.day.holiday && this.day.holiday.dayType === 2 && this.day.calendarInfo.typeDes) {
            const festivalName = this.day.calendarInfo.typeDes;
            if (festivalName !== '工作日' && festivalName !== '休息日') {
                return festivalName;
            }
        }
        // 2. 24节气
        if (this.isRealSolarTerm(this.day.calendarInfo.solarTerms)) {
            return this.day.calendarInfo.solarTerms;
        }
        // 3. 农历日期
        return this.day.calendarInfo.lunarCalendar || '';
    }
    /**
     * 获取副标题文字颜色
     */
    getSubTextColor(): string {
        if (!this.day.isCurrentMonth) {
            return Constants.COLOR_TEXT_TERTIARY;
        }
        // 节假日红色
        if (this.day.holiday && this.day.holiday.dayType === 2) {
            return Constants.COLOR_DANGER;
        }
        // 节气绿色
        if (this.day.calendarInfo && this.isRealSolarTerm(this.day.calendarInfo.solarTerms)) {
            return Constants.COLOR_SUCCESS;
        }
        return Constants.COLOR_TEXT_TERTIARY;
    }
    /**
     * 获取日期数字颜色
     */
    getDateTextColor(): string {
        if (!this.day.isCurrentMonth) {
            return Constants.COLOR_TEXT_TERTIARY;
        }
        if (this.day.isSelected) {
            return '#FFFFFF'; // 选中时白色字体
        }
        if (this.day.isToday) {
            return Constants.COLOR_PRIMARY;
        }
        // 周末红色
        const weekDay = this.day.date.getDay();
        if (weekDay === 0 || weekDay === 6) {
            return Constants.COLOR_DANGER;
        }
        if (this.day.holiday && this.day.holiday.dayType === 2) {
            return Constants.COLOR_DANGER;
        }
        return Constants.COLOR_TEXT_PRIMARY;
    }
    /**
     * 获取背景色
     */
    getBackgroundColor(): ResourceColor {
        if (this.day.isSelected) {
            return Constants.COLOR_PRIMARY; // 选中时使用主橙色
        }
        if (this.day.isToday) {
            return '#FFF0E8';
        }
        return Color.Transparent;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/calendar/DateCell.ets(132:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.backgroundColor(this.getBackgroundColor());
            Column.borderRadius(8);
            Column.onClick(() => {
                this.onSelect(ObservedObject.GetRawObject(this.day));
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 日期数字
            Text.create(`${this.day.date.getDate()}`);
            Text.debugLine("entry/src/main/ets/components/calendar/DateCell.ets(134:7)", "entry");
            // 日期数字
            Text.fontSize(16);
            // 日期数字
            Text.fontWeight(this.day.isToday || this.day.isSelected ? FontWeight.Bold : FontWeight.Normal);
            // 日期数字
            Text.fontColor(this.getDateTextColor());
            // 日期数字
            Text.margin({ bottom: 2 });
        }, Text);
        // 日期数字
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 农历/节气/节日
            if (this.day.isCurrentMonth && this.day.calendarInfo) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.getDisplayText());
                        Text.debugLine("entry/src/main/ets/components/calendar/DateCell.ets(142:9)", "entry");
                        Text.fontSize(9);
                        Text.fontColor(this.getSubTextColor());
                        Text.maxLines(1);
                        Text.textOverflow({ overflow: TextOverflow.Clip });
                    }, Text);
                    Text.pop();
                });
            }
            // 事件/任务指示器
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 事件/任务指示器
            Row.create();
            Row.debugLine("entry/src/main/ets/components/calendar/DateCell.ets(150:7)", "entry");
            // 事件/任务指示器
            Row.justifyContent(FlexAlign.Center);
            // 事件/任务指示器
            Row.height(10);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 日程事件指示器
            if (this.day.eventCount > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('●');
                        Text.debugLine("entry/src/main/ets/components/calendar/DateCell.ets(153:11)", "entry");
                        Text.fontSize(6);
                        Text.fontColor('#FF6B35');
                    }, Text);
                    Text.pop();
                });
            }
            // 任务指示器
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 任务指示器
            if (this.day.taskCount > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('●');
                        Text.debugLine("entry/src/main/ets/components/calendar/DateCell.ets(159:11)", "entry");
                        Text.fontSize(6);
                        Text.fontColor(Constants.COLOR_PRIMARY);
                        Text.margin({ left: this.day.eventCount > 0 ? 2 : 0 });
                    }, Text);
                    Text.pop();
                });
            }
            // 节假日标记
            // dayType: 0=工作日, 1=休息日, 2=节假日
            // 只有休息日和节假日才显示标记
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 节假日标记
            // dayType: 0=工作日, 1=休息日, 2=节假日
            // 只有休息日和节假日才显示标记
            if (this.day.holiday && (this.day.holiday.dayType === 1 || this.day.holiday.dayType === 2)) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('休');
                        Text.debugLine("entry/src/main/ets/components/calendar/DateCell.ets(168:11)", "entry");
                        Text.fontSize(8);
                        Text.fontColor(Constants.COLOR_DANGER);
                        Text.margin({ left: (this.day.taskCount > 0 || this.day.eventCount > 0) ? 2 : 0 });
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
        // 事件/任务指示器
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
