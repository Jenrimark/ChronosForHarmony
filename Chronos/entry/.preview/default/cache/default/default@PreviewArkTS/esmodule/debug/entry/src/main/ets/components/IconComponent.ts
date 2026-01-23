if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CategoryIcon_Params {
    iconType?: IconType;
    containerSize?: number;
    innerIconSize?: number;
    bgColor?: string | Resource;
    innerIconColor?: string | Resource;
}
interface IconButton_Params {
    iconType?: IconType;
    iconSize?: number;
    iconColor?: string | Resource;
    bgColor?: string | Resource;
    btnPadding?: number;
    btnBorderRadius?: number;
    btnAccessibilityText?: string;
    onBtnClick?: () => void;
}
interface IconComponent_Params {
    iconType?: IconType;
    iconSize?: number;
    iconColor?: string | Resource;
    effectStrategy?: SymbolEffectStrategy;
}
import { Constants } from "@normalized:N&&&entry/src/main/ets/common/Constants&";
/**
 * 图标类型枚举
 */
export enum IconType {
    // 导航图标
    CALENDAR = "calendar",
    TASK = "task",
    BILL = "bill",
    STATISTICS = "statistics",
    SETTINGS = "settings",
    // 操作图标
    ADD = "add",
    DELETE = "delete",
    EDIT = "edit",
    COMPLETE = "complete",
    CLOSE = "close",
    BACK = "back",
    FORWARD = "forward",
    // 状态图标
    SUCCESS = "success",
    WARNING = "warning",
    ERROR = "error",
    INFO = "info",
    // 功能图标
    SEARCH = "search",
    FILTER = "filter",
    SORT = "sort",
    REFRESH = "refresh",
    LOCK = "lock",
    UNLOCK = "unlock",
    // 分类图标
    FOOD = "food",
    TRANSPORT = "transport",
    SHOPPING = "shopping",
    ENTERTAINMENT = "entertainment",
    MEDICAL = "medical",
    EDUCATION = "education",
    HOUSING = "housing",
    UTILITIES = "utilities",
    SALARY = "salary",
    BONUS = "bonus",
    INVESTMENT = "investment",
    GIFT = "gift",
    // 其他
    MORE = "more",
    VOICE = "voice",
    AI = "ai",
    CHART = "chart",
    CHAT = "chat",
    LEAF = "leaf",
    STAR = "star"
}
export class IconComponent extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__iconType = new SynchedPropertySimpleOneWayPU(params.iconType, this, "iconType");
        this.__iconSize = new SynchedPropertySimpleOneWayPU(params.iconSize, this, "iconSize");
        this.__iconColor = new SynchedPropertyObjectOneWayPU(params.iconColor, this, "iconColor");
        this.__effectStrategy = new SynchedPropertySimpleOneWayPU(params.effectStrategy, this, "effectStrategy");
        this.setInitiallyProvidedValue(params);
        this.declareWatch("effectStrategy", this.onEffectChange);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: IconComponent_Params) {
        if (params.iconSize === undefined) {
            this.__iconSize.set(24);
        }
        if (params.iconColor === undefined) {
            this.__iconColor.set(Constants.COLOR_TEXT_PRIMARY);
        }
    }
    updateStateVars(params: IconComponent_Params) {
        this.__iconType.reset(params.iconType);
        this.__iconSize.reset(params.iconSize);
        this.__iconColor.reset(params.iconColor);
        this.__effectStrategy.reset(params.effectStrategy);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__iconType.purgeDependencyOnElmtId(rmElmtId);
        this.__iconSize.purgeDependencyOnElmtId(rmElmtId);
        this.__iconColor.purgeDependencyOnElmtId(rmElmtId);
        this.__effectStrategy.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__iconType.aboutToBeDeleted();
        this.__iconSize.aboutToBeDeleted();
        this.__iconColor.aboutToBeDeleted();
        this.__effectStrategy.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __iconType: SynchedPropertySimpleOneWayPU<IconType>;
    get iconType() {
        return this.__iconType.get();
    }
    set iconType(newValue: IconType) {
        this.__iconType.set(newValue);
    }
    private __iconSize: SynchedPropertySimpleOneWayPU<number>;
    get iconSize() {
        return this.__iconSize.get();
    }
    set iconSize(newValue: number) {
        this.__iconSize.set(newValue);
    }
    private __iconColor: SynchedPropertySimpleOneWayPU<string | Resource>;
    get iconColor() {
        return this.__iconColor.get();
    }
    set iconColor(newValue: string | Resource) {
        this.__iconColor.set(newValue);
    }
    private __effectStrategy?: SynchedPropertySimpleOneWayPU<SymbolEffectStrategy>;
    get effectStrategy() {
        return this.__effectStrategy.get();
    }
    set effectStrategy(newValue: SymbolEffectStrategy) {
        this.__effectStrategy.set(newValue);
    }
    /**
     * 获取系统图标资源
     */
    private getSymbolResource(): Resource {
        const iconMap: Record<string, Resource> = {
            // 导航图标
            [IconType.CALENDAR]: { "id": 125832312, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.TASK]: { "id": 125831133, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.BILL]: { "id": 125832318, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.STATISTICS]: { "id": 125831673, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.SETTINGS]: { "id": 125831673, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            // 操作图标
            [IconType.ADD]: { "id": 125831482, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.DELETE]: { "id": 125831542, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.EDIT]: { "id": 125831673, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.COMPLETE]: { "id": 125831490, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.CLOSE]: { "id": 125831487, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.BACK]: { "id": 125832663, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.FORWARD]: { "id": 125832664, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            // 状态图标
            [IconType.SUCCESS]: { "id": 125831492, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.WARNING]: { "id": 125832652, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.ERROR]: { "id": 125831488, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.INFO]: { "id": 125832646, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            // 功能图标
            [IconType.SEARCH]: { "id": 125831500, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.FILTER]: { "id": 125831673, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.SORT]: { "id": 125831673, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.REFRESH]: { "id": 125831551, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.LOCK]: { "id": 125832252, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.UNLOCK]: { "id": 125832249, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            // 分类图标
            [IconType.FOOD]: { "id": 125832401, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.TRANSPORT]: { "id": 125832229, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.SHOPPING]: { "id": 125832323, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.ENTERTAINMENT]: { "id": 125832458, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.MEDICAL]: { "id": 125832292, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.EDUCATION]: { "id": 125831935, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.HOUSING]: { "id": 125831533, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.UTILITIES]: { "id": 125832415, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.SALARY]: { "id": 125831673, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.BONUS]: { "id": 125832351, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.INVESTMENT]: { "id": 125831673, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.GIFT]: { "id": 125832352, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            // 其他
            [IconType.MORE]: { "id": 125833751, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.VOICE]: { "id": 125831758, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.AI]: { "id": 125831520, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.CHART]: { "id": 125831673, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.CHAT]: { "id": 125831766, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.LEAF]: { "id": 125832627, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" },
            [IconType.STAR]: { "id": 125831520, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" }
        };
        return iconMap[this.iconType] || { "id": 125832644, "type": 40000, params: [], "bundleName": "com.jenrimark.chronos", "moduleName": "entry" };
    }
    /**
     * 监听效果变化
     */
    onEffectChange() {
        // 效果变化时的处理
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create(this.getSymbolResource());
            SymbolGlyph.debugLine("entry/src/main/ets/components/IconComponent.ets(142:5)", "entry");
            SymbolGlyph.fontSize(this.iconSize);
            SymbolGlyph.fontColor([this.iconColor]);
            SymbolGlyph.symbolEffect(this.effectStrategy);
        }, SymbolGlyph);
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export class IconButton extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__iconType = new SynchedPropertySimpleOneWayPU(params.iconType, this, "iconType");
        this.__iconSize = new SynchedPropertySimpleOneWayPU(params.iconSize, this, "iconSize");
        this.__iconColor = new SynchedPropertyObjectOneWayPU(params.iconColor, this, "iconColor");
        this.__bgColor = new SynchedPropertyObjectOneWayPU(params.bgColor, this, "bgColor");
        this.__btnPadding = new SynchedPropertySimpleOneWayPU(params.btnPadding, this, "btnPadding");
        this.__btnBorderRadius = new SynchedPropertySimpleOneWayPU(params.btnBorderRadius, this, "btnBorderRadius");
        this.__btnAccessibilityText = new SynchedPropertySimpleOneWayPU(params.btnAccessibilityText, this, "btnAccessibilityText");
        this.__onBtnClick = new SynchedPropertyObjectOneWayPU(params.onBtnClick, this, "onBtnClick");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: IconButton_Params) {
        if (params.iconSize === undefined) {
            this.__iconSize.set(24);
        }
        if (params.iconColor === undefined) {
            this.__iconColor.set(Constants.COLOR_TEXT_PRIMARY);
        }
        if (params.bgColor === undefined) {
            this.__bgColor.set('transparent');
        }
        if (params.btnPadding === undefined) {
            this.__btnPadding.set(8);
        }
        if (params.btnBorderRadius === undefined) {
            this.__btnBorderRadius.set(Constants.BORDER_RADIUS_SM);
        }
        if (params.btnAccessibilityText === undefined) {
            this.__btnAccessibilityText.set('');
        }
    }
    updateStateVars(params: IconButton_Params) {
        this.__iconType.reset(params.iconType);
        this.__iconSize.reset(params.iconSize);
        this.__iconColor.reset(params.iconColor);
        this.__bgColor.reset(params.bgColor);
        this.__btnPadding.reset(params.btnPadding);
        this.__btnBorderRadius.reset(params.btnBorderRadius);
        this.__btnAccessibilityText.reset(params.btnAccessibilityText);
        this.__onBtnClick.reset(params.onBtnClick);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__iconType.purgeDependencyOnElmtId(rmElmtId);
        this.__iconSize.purgeDependencyOnElmtId(rmElmtId);
        this.__iconColor.purgeDependencyOnElmtId(rmElmtId);
        this.__bgColor.purgeDependencyOnElmtId(rmElmtId);
        this.__btnPadding.purgeDependencyOnElmtId(rmElmtId);
        this.__btnBorderRadius.purgeDependencyOnElmtId(rmElmtId);
        this.__btnAccessibilityText.purgeDependencyOnElmtId(rmElmtId);
        this.__onBtnClick.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__iconType.aboutToBeDeleted();
        this.__iconSize.aboutToBeDeleted();
        this.__iconColor.aboutToBeDeleted();
        this.__bgColor.aboutToBeDeleted();
        this.__btnPadding.aboutToBeDeleted();
        this.__btnBorderRadius.aboutToBeDeleted();
        this.__btnAccessibilityText.aboutToBeDeleted();
        this.__onBtnClick.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __iconType: SynchedPropertySimpleOneWayPU<IconType>;
    get iconType() {
        return this.__iconType.get();
    }
    set iconType(newValue: IconType) {
        this.__iconType.set(newValue);
    }
    private __iconSize: SynchedPropertySimpleOneWayPU<number>;
    get iconSize() {
        return this.__iconSize.get();
    }
    set iconSize(newValue: number) {
        this.__iconSize.set(newValue);
    }
    private __iconColor: SynchedPropertySimpleOneWayPU<string | Resource>;
    get iconColor() {
        return this.__iconColor.get();
    }
    set iconColor(newValue: string | Resource) {
        this.__iconColor.set(newValue);
    }
    private __bgColor: SynchedPropertySimpleOneWayPU<string | Resource>;
    get bgColor() {
        return this.__bgColor.get();
    }
    set bgColor(newValue: string | Resource) {
        this.__bgColor.set(newValue);
    }
    private __btnPadding: SynchedPropertySimpleOneWayPU<number>;
    get btnPadding() {
        return this.__btnPadding.get();
    }
    set btnPadding(newValue: number) {
        this.__btnPadding.set(newValue);
    }
    private __btnBorderRadius: SynchedPropertySimpleOneWayPU<number>;
    get btnBorderRadius() {
        return this.__btnBorderRadius.get();
    }
    set btnBorderRadius(newValue: number) {
        this.__btnBorderRadius.set(newValue);
    }
    private __btnAccessibilityText: SynchedPropertySimpleOneWayPU<string>;
    get btnAccessibilityText() {
        return this.__btnAccessibilityText.get();
    }
    set btnAccessibilityText(newValue: string) {
        this.__btnAccessibilityText.set(newValue);
    }
    private __onBtnClick?: SynchedPropertySimpleOneWayPU<() => void>;
    get onBtnClick() {
        return this.__onBtnClick.get();
    }
    set onBtnClick(newValue: () => void) {
        this.__onBtnClick.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/IconComponent.ets(164:5)", "entry");
            Column.width(this.iconSize + this.btnPadding * 2);
            Column.height(this.iconSize + this.btnPadding * 2);
            Column.padding(this.btnPadding);
            Column.backgroundColor(ObservedObject.GetRawObject(this.bgColor));
            Column.borderRadius(this.btnBorderRadius);
            Column.justifyContent(FlexAlign.Center);
            Column.hoverEffect(HoverEffect.Scale);
            Column.accessibilityText(this.btnAccessibilityText);
            Column.onClick(() => {
                if (this.onBtnClick) {
                    this.onBtnClick();
                }
            });
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new IconComponent(this, {
                        iconType: this.iconType,
                        iconSize: this.iconSize,
                        iconColor: this.iconColor
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/IconComponent.ets", line: 165, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            iconType: this.iconType,
                            iconSize: this.iconSize,
                            iconColor: this.iconColor
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        iconType: this.iconType,
                        iconSize: this.iconSize,
                        iconColor: this.iconColor
                    });
                }
            }, { name: "IconComponent" });
        }
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export class CategoryIcon extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__iconType = new SynchedPropertySimpleOneWayPU(params.iconType, this, "iconType");
        this.__containerSize = new SynchedPropertySimpleOneWayPU(params.containerSize, this, "containerSize");
        this.__innerIconSize = new SynchedPropertySimpleOneWayPU(params.innerIconSize, this, "innerIconSize");
        this.__bgColor = new SynchedPropertyObjectOneWayPU(params.bgColor, this, "bgColor");
        this.__innerIconColor = new SynchedPropertyObjectOneWayPU(params.innerIconColor, this, "innerIconColor");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CategoryIcon_Params) {
        if (params.containerSize === undefined) {
            this.__containerSize.set(36);
        }
        if (params.innerIconSize === undefined) {
            this.__innerIconSize.set(20);
        }
        if (params.bgColor === undefined) {
            this.__bgColor.set(Constants.COLOR_PRIMARY_LIGHT);
        }
        if (params.innerIconColor === undefined) {
            this.__innerIconColor.set(Constants.COLOR_PRIMARY);
        }
    }
    updateStateVars(params: CategoryIcon_Params) {
        this.__iconType.reset(params.iconType);
        this.__containerSize.reset(params.containerSize);
        this.__innerIconSize.reset(params.innerIconSize);
        this.__bgColor.reset(params.bgColor);
        this.__innerIconColor.reset(params.innerIconColor);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__iconType.purgeDependencyOnElmtId(rmElmtId);
        this.__containerSize.purgeDependencyOnElmtId(rmElmtId);
        this.__innerIconSize.purgeDependencyOnElmtId(rmElmtId);
        this.__bgColor.purgeDependencyOnElmtId(rmElmtId);
        this.__innerIconColor.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__iconType.aboutToBeDeleted();
        this.__containerSize.aboutToBeDeleted();
        this.__innerIconSize.aboutToBeDeleted();
        this.__bgColor.aboutToBeDeleted();
        this.__innerIconColor.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __iconType: SynchedPropertySimpleOneWayPU<IconType>;
    get iconType() {
        return this.__iconType.get();
    }
    set iconType(newValue: IconType) {
        this.__iconType.set(newValue);
    }
    private __containerSize: SynchedPropertySimpleOneWayPU<number>;
    get containerSize() {
        return this.__containerSize.get();
    }
    set containerSize(newValue: number) {
        this.__containerSize.set(newValue);
    }
    private __innerIconSize: SynchedPropertySimpleOneWayPU<number>;
    get innerIconSize() {
        return this.__innerIconSize.get();
    }
    set innerIconSize(newValue: number) {
        this.__innerIconSize.set(newValue);
    }
    private __bgColor: SynchedPropertySimpleOneWayPU<string | Resource>;
    get bgColor() {
        return this.__bgColor.get();
    }
    set bgColor(newValue: string | Resource) {
        this.__bgColor.set(newValue);
    }
    private __innerIconColor: SynchedPropertySimpleOneWayPU<string | Resource>;
    get innerIconColor() {
        return this.__innerIconColor.get();
    }
    set innerIconColor(newValue: string | Resource) {
        this.__innerIconColor.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/IconComponent.ets(199:5)", "entry");
            Column.width(this.containerSize);
            Column.height(this.containerSize);
            Column.backgroundColor(ObservedObject.GetRawObject(this.bgColor));
            Column.borderRadius(this.containerSize / 2);
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new IconComponent(this, {
                        iconType: this.iconType,
                        iconSize: this.innerIconSize,
                        iconColor: this.innerIconColor
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/components/IconComponent.ets", line: 200, col: 7 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            iconType: this.iconType,
                            iconSize: this.innerIconSize,
                            iconColor: this.innerIconColor
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        iconType: this.iconType,
                        iconSize: this.innerIconSize,
                        iconColor: this.innerIconColor
                    });
                }
            }, { name: "IconComponent" });
        }
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
