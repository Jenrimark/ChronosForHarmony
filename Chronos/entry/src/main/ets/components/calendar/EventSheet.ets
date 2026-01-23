import { CalendarEvent, ReminderType, RepeatRule, getReminderTypeText, getRepeatRuleText } from '../../model/CalendarEvent';
import { SmartParser, ParseResult } from '../../utils/SmartParser';
import { Constants } from '../../common/Constants';

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

/**
 * 日程创建/编辑弹窗组件
 */
@Component
export struct EventSheet {
  @Link isShow: boolean;
  @Prop editEvent: CalendarEvent | null = null;
  @Link selectedDate: Date;
  onSave: (event: CalendarEvent) => void = () => {};
  onDelete: (event: CalendarEvent) => void = () => {};

  @State title: string = '';
  @State location: string = '';
  @State isAllDay: boolean = false;
  @State startTime: Date = new Date();
  @State endTime: Date = new Date();
  @State reminderType: ReminderType = ReminderType.TEN_MIN;
  @State repeatRule: RepeatRule = RepeatRule.NONE;
  @State isImportant: boolean = false;
  @State smartInput: string = '';
  @State showReminderPicker: boolean = false;
  @State showRepeatPicker: boolean = false;
  @State showTimePicker: boolean = false;
  @State isEditingStart: boolean = true;
  @State refreshKey: number = 0; // 用于强制刷新显示

  private smartParser: SmartParser = SmartParser.getInstance();
  private isEditMode: boolean = false;

  aboutToAppear() {
    this.isEditMode = this.editEvent !== null;
    if (this.isEditMode && this.editEvent) {
      this.loadEventData(this.editEvent);
    } else {
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
    this.startTime = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      this.selectedDate.getDate(),
      now.getHours() + 1,
      0, 0
    );
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
      this.startTime = new Date(
        result.date.getFullYear(),
        result.date.getMonth(),
        result.date.getDate(),
        this.startTime.getHours(),
        this.startTime.getMinutes()
      );
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
  @Builder
  buildInputRow(icon: string, placeholder: string, value: string, onChange: (val: string) => void) {
    Row() {
      Text(icon)
        .fontSize(18)
        .width(30)
      
      TextInput({ placeholder: placeholder, text: value })
        .layoutWeight(1)
        .backgroundColor(Color.Transparent)
        .onChange(onChange)
    }
    .width('100%')
    .padding({ left: 16, right: 16, top: 12, bottom: 12 })
    .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
    .borderRadius(8)
    .margin({ bottom: 8 })
  }

  /**
   * 构建开关行
   */
  @Builder
  buildToggleRow(icon: string, label: string, isOn: boolean, onToggle: (val: boolean) => void) {
    Row() {
      Text(icon)
        .fontSize(18)
        .width(30)
      
      Text(label)
        .fontSize(15)
        .fontColor(Constants.COLOR_TEXT_PRIMARY)
        .layoutWeight(1)
      
      Toggle({ type: ToggleType.Switch, isOn: isOn })
        .onChange(onToggle)
    }
    .width('100%')
    .padding({ left: 16, right: 16, top: 12, bottom: 12 })
    .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
    .borderRadius(8)
    .margin({ bottom: 8 })
  }

  /**
   * 构建选择行
   */
  @Builder
  buildSelectRow(icon: string, label: string, value: string, onClick: () => void) {
    Row() {
      Text(icon)
        .fontSize(18)
        .width(30)
      
      Text(label)
        .fontSize(15)
        .fontColor(Constants.COLOR_TEXT_PRIMARY)
        .layoutWeight(1)
      
      Text(value)
        .fontSize(14)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
      
      Text('›')
        .fontSize(18)
        .fontColor(Constants.COLOR_TEXT_TERTIARY)
        .margin({ left: 8 })
    }
    .width('100%')
    .padding({ left: 16, right: 16, top: 12, bottom: 12 })
    .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
    .borderRadius(8)
    .margin({ bottom: 8 })
    .onClick(onClick)
  }

  build() {
    Stack() {
      Column() {
        // 头部
        Row() {
          Button('取消')
            .type(ButtonType.Normal)
            .backgroundColor(Color.Transparent)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .onClick(() => {
              this.isShow = false;
            })
          
          Blank()
          
          Text(this.isEditMode ? '编辑日程' : '新建日程')
            .fontSize(17)
            .fontWeight(FontWeight.Medium)
            .fontColor(Constants.COLOR_TEXT_PRIMARY)
          
          Blank()
          
          Button('保存')
            .type(ButtonType.Normal)
            .backgroundColor(Color.Transparent)
            .fontColor(this.validateForm() ? Constants.COLOR_PRIMARY : Constants.COLOR_TEXT_TERTIARY)
            .onClick(() => {
              this.saveEvent();
            })
        }
        .width('100%')
        .padding({ left: 8, right: 8, top: 12, bottom: 12 })

        Scroll() {
          Column() {
            // 智能输入
            Row() {
              Text('✨')
                .fontSize(18)
                .width(30)
              
              TextInput({ placeholder: '一句话智能创建日程（如：明天下午3点开会）', text: this.smartInput })
                .layoutWeight(1)
                .backgroundColor(Color.Transparent)
                .onChange((value: string) => {
                  this.onSmartInputChange(value);
                })
            }
            .width('100%')
            .padding({ left: 16, right: 16, top: 12, bottom: 12 })
            .backgroundColor('#FFF8F5')
            .borderRadius(8)
            .margin({ bottom: 16 })

            // 标题
            this.buildInputRow('📝', '日程标题', this.title, (val: string) => {
              this.title = val;
            })

            // 地点
            this.buildInputRow('📍', '添加地点', this.location, (val: string) => {
              this.location = val;
            })

            // 全天开关
            this.buildToggleRow('🌅', '全天', this.isAllDay, (val: boolean) => {
              this.isAllDay = val;
            })

            // 开始时间
            Row() {
              Text('🕐')
                .fontSize(18)
                .width(30)
              
              Text('开始')
                .fontSize(15)
                .fontColor(Constants.COLOR_TEXT_PRIMARY)
                .layoutWeight(1)
              
              Text(this.isAllDay ? this.formatDate(this.startTime) : `${this.formatDate(this.startTime)} ${this.formatTime(this.startTime)}`)
                .fontSize(14)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
                .key(`start-${this.refreshKey}`) // 添加 key 强制刷新
              
              Text('›')
                .fontSize(18)
                .fontColor(Constants.COLOR_TEXT_TERTIARY)
                .margin({ left: 8 })
            }
            .width('100%')
            .padding({ left: 16, right: 16, top: 12, bottom: 12 })
            .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
            .borderRadius(8)
            .margin({ bottom: 8 })
            .onClick(() => {
              this.isEditingStart = true;
              this.showTimePicker = true;
            })

            // 结束时间
            Row() {
              Text('🕑')
                .fontSize(18)
                .width(30)
              
              Text('结束')
                .fontSize(15)
                .fontColor(Constants.COLOR_TEXT_PRIMARY)
                .layoutWeight(1)
              
              Text(this.isAllDay ? this.formatDate(this.endTime) : `${this.formatDate(this.endTime)} ${this.formatTime(this.endTime)}`)
                .fontSize(14)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
                .key(`end-${this.refreshKey}`) // 添加 key 强制刷新
              
              Text('›')
                .fontSize(18)
                .fontColor(Constants.COLOR_TEXT_TERTIARY)
                .margin({ left: 8 })
            }
            .width('100%')
            .padding({ left: 16, right: 16, top: 12, bottom: 12 })
            .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
            .borderRadius(8)
            .margin({ bottom: 8 })
            .onClick(() => {
              this.isEditingStart = false;
              this.showTimePicker = true;
            })

            // 提醒
            Row() {
              Text('🔔')
                .fontSize(18)
                .width(30)
              
              Text('提醒')
                .fontSize(15)
                .fontColor(Constants.COLOR_TEXT_PRIMARY)
                .layoutWeight(1)
              
              Text(getReminderTypeText(this.reminderType))
                .fontSize(14)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
                .key(`reminder-${this.refreshKey}`) // 添加 key 强制刷新
              
              Text('›')
                .fontSize(18)
                .fontColor(Constants.COLOR_TEXT_TERTIARY)
                .margin({ left: 8 })
            }
            .width('100%')
            .padding({ left: 16, right: 16, top: 12, bottom: 12 })
            .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
            .borderRadius(8)
            .margin({ bottom: 8 })
            .onClick(() => {
              this.showReminderPicker = true;
            })

            // 重复
            Row() {
              Text('🔄')
                .fontSize(18)
                .width(30)
              
              Text('重复')
                .fontSize(15)
                .fontColor(Constants.COLOR_TEXT_PRIMARY)
                .layoutWeight(1)
              
              Text(getRepeatRuleText(this.repeatRule))
                .fontSize(14)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
                .key(`repeat-${this.refreshKey}`) // 添加 key 强制刷新
              
              Text('›')
                .fontSize(18)
                .fontColor(Constants.COLOR_TEXT_TERTIARY)
                .margin({ left: 8 })
            }
            .width('100%')
            .padding({ left: 16, right: 16, top: 12, bottom: 12 })
            .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
            .borderRadius(8)
            .margin({ bottom: 8 })
            .onClick(() => {
              this.showRepeatPicker = true;
            })

            // 重要标记
            this.buildToggleRow('⭐', '重要', this.isImportant, (val: boolean) => {
              this.isImportant = val;
            })

            // 删除按钮（编辑模式）
            if (this.isEditMode) {
              Button('删除日程')
                .type(ButtonType.Normal)
                .width('100%')
                .height(44)
                .backgroundColor('#FFF0F0')
                .fontColor(Constants.COLOR_DANGER)
                .margin({ top: 24 })
                .onClick(() => {
                  this.deleteEvent();
                })
            }
          }
          .width('100%')
          .padding({ left: 16, right: 16, bottom: 32 })
        }
        .layoutWeight(1)
      }
      .width('100%')
      .height('100%')
      .backgroundColor(Constants.COLOR_BACKGROUND)


      // 提醒选择器
      if (this.showReminderPicker) {
        Column()
          .width('100%')
          .height('100%')
          .backgroundColor('rgba(0,0,0,0.5)')
          .onClick(() => {
            this.showReminderPicker = false;
          })
        
        Column() {
          Row() {
            Button('取消')
              .type(ButtonType.Normal)
              .backgroundColor(Color.Transparent)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
              .onClick(() => {
                this.showReminderPicker = false;
              })
            
            Blank()
            
            Text('选择提醒')
              .fontSize(17)
              .fontWeight(FontWeight.Medium)
            
            Blank()
            
            Button('确定')
              .type(ButtonType.Normal)
              .backgroundColor(Color.Transparent)
              .fontColor(Constants.COLOR_PRIMARY)
              .onClick(() => {
                this.showReminderPicker = false;
                this.refreshKey++; // 强制刷新
              })
          }
          .width('100%')
          .padding({ left: 16, right: 16, top: 12, bottom: 12 })
          
          List() {
            ForEach([
              ReminderType.NONE,
              ReminderType.AT_TIME,
              ReminderType.FIVE_MIN,
              ReminderType.TEN_MIN,
              ReminderType.THIRTY_MIN,
              ReminderType.ONE_HOUR,
              ReminderType.ONE_DAY
            ], (type: ReminderType) => {
              ListItem() {
                Row() {
                  Text(getReminderTypeText(type))
                    .fontSize(15)
                    .fontColor(Constants.COLOR_TEXT_PRIMARY)
                  
                  Blank()
                  
                  if (this.reminderType === type) {
                    Text('✓')
                      .fontSize(18)
                      .fontColor(Constants.COLOR_PRIMARY)
                  }
                }
                .width('100%')
                .padding({ left: 16, right: 16, top: 12, bottom: 12 })
                .onClick(() => {
                  this.reminderType = type;
                  this.showReminderPicker = false;
                  this.refreshKey++; // 强制刷新
                })
              }
            })
          }
          .width('100%')
          .layoutWeight(1)
        }
        .width('100%')
        .height(400)
        .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
        .borderRadius({ topLeft: 20, topRight: 20 })
        .position({ x: 0, y: '100%' })
        .translate({ y: -400 })
        .zIndex(1000)
      }

      // 重复选择器
      if (this.showRepeatPicker) {
        Column()
          .width('100%')
          .height('100%')
          .backgroundColor('rgba(0,0,0,0.5)')
          .onClick(() => {
            this.showRepeatPicker = false;
          })
        
        Column() {
          Row() {
            Button('取消')
              .type(ButtonType.Normal)
              .backgroundColor(Color.Transparent)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
              .onClick(() => {
                this.showRepeatPicker = false;
              })
            
            Blank()
            
            Text('选择重复')
              .fontSize(17)
              .fontWeight(FontWeight.Medium)
            
            Blank()
            
            Button('确定')
              .type(ButtonType.Normal)
              .backgroundColor(Color.Transparent)
              .fontColor(Constants.COLOR_PRIMARY)
              .onClick(() => {
                this.showRepeatPicker = false;
                this.refreshKey++; // 强制刷新
              })
          }
          .width('100%')
          .padding({ left: 16, right: 16, top: 12, bottom: 12 })
          
          List() {
            ForEach([
              RepeatRule.NONE,
              RepeatRule.DAILY,
              RepeatRule.WEEKLY,
              RepeatRule.MONTHLY,
              RepeatRule.YEARLY
            ], (rule: RepeatRule) => {
              ListItem() {
                Row() {
                  Text(getRepeatRuleText(rule))
                    .fontSize(15)
                    .fontColor(Constants.COLOR_TEXT_PRIMARY)
                  
                  Blank()
                  
                  if (this.repeatRule === rule) {
                    Text('✓')
                      .fontSize(18)
                      .fontColor(Constants.COLOR_PRIMARY)
                  }
                }
                .width('100%')
                .padding({ left: 16, right: 16, top: 12, bottom: 12 })
                .onClick(() => {
                  this.repeatRule = rule;
                  this.showRepeatPicker = false;
                  this.refreshKey++; // 强制刷新
                })
              }
            })
          }
          .width('100%')
          .layoutWeight(1)
        }
        .width('100%')
        .height(300)
        .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
        .borderRadius({ topLeft: 20, topRight: 20 })
        .position({ x: 0, y: '100%' })
        .translate({ y: -300 })
        .zIndex(1000)
      }

      // 时间选择器
      if (this.showTimePicker) {
        Column()
          .width('100%')
          .height('100%')
          .backgroundColor('rgba(0,0,0,0.5)')
          .onClick(() => {
            this.showTimePicker = false;
          })
        
        Column() {
          Row() {
            Button('取消')
              .type(ButtonType.Normal)
              .backgroundColor(Color.Transparent)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
              .onClick(() => {
                this.showTimePicker = false;
              })
            
            Blank()
            
            Text(this.isAllDay ? '选择日期' : '选择日期时间')
              .fontSize(17)
              .fontWeight(FontWeight.Medium)
            
            Blank()
            
            Button('确定')
              .type(ButtonType.Normal)
              .backgroundColor(Color.Transparent)
              .fontColor(Constants.COLOR_PRIMARY)
              .onClick(() => {
                this.showTimePicker = false;
                this.refreshKey++; // 强制刷新
              })
          }
          .width('100%')
          .padding({ left: 16, right: 16, top: 12, bottom: 12 })
          
          if (this.isAllDay) {
            DatePicker({
              start: new Date('1970-1-1'),
              selected: this.isEditingStart ? this.startTime : this.endTime
            })
            .onChange((value: DatePickerValue) => {
              const year = value.year;
              const month = value.month - 1;
              const day = value.day;
              if (this.isEditingStart) {
                this.startTime = new Date(year, month, day);
                this.endTime = new Date(year, month, day);
              } else {
                this.endTime = new Date(year, month, day);
              }
            })
          } else {
            // 非全天模式，需要同时选择日期和时间
            Row() {
              // 日期选择器
              DatePicker({
                start: new Date('1970-1-1'),
                selected: this.isEditingStart ? this.startTime : this.endTime
              })
              .onChange((value: DatePickerValue) => {
                const year = value.year;
                const month = value.month - 1;
                const day = value.day;
                const currentTime = this.isEditingStart ? this.startTime : this.endTime;
                const hour = currentTime.getHours();
                const minute = currentTime.getMinutes();
                if (this.isEditingStart) {
                  this.startTime = new Date(year, month, day, hour, minute);
                  if (this.endTime <= this.startTime) {
                    const newEnd = new Date(year, month, day, hour + 1, minute);
                    this.endTime = newEnd;
                  }
                } else {
                  this.endTime = new Date(year, month, day, hour, minute);
                  if (this.endTime <= this.startTime) {
                    const newEnd = new Date(year, month, day, hour + 1, minute);
                    this.endTime = newEnd;
                  }
                }
              })
              .layoutWeight(1)
              
              // 时间选择器
              TimePicker({
                selected: this.isEditingStart ? this.startTime : this.endTime
              })
              .onChange((value: TimePickerResult) => {
                const currentDate = this.isEditingStart ? this.startTime : this.endTime;
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const day = currentDate.getDate();
                if (this.isEditingStart) {
                  this.startTime = new Date(year, month, day, value.hour, value.minute);
                  if (this.endTime <= this.startTime) {
                    const newEnd = new Date(year, month, day, value.hour + 1, value.minute);
                    this.endTime = newEnd;
                  }
                } else {
                  this.endTime = new Date(year, month, day, value.hour, value.minute);
                  if (this.endTime <= this.startTime) {
                    const newEnd = new Date(year, month, day, value.hour + 1, value.minute);
                    this.endTime = newEnd;
                  }
                }
              })
              .layoutWeight(1)
            }
            .width('100%')
            .height('100%')
          }
        }
        .width('100%')
        .height(this.isAllDay ? 400 : 500)
        .backgroundColor(Constants.COLOR_CARD_BACKGROUND)
        .borderRadius({ topLeft: 20, topRight: 20 })
        .position({ x: 0, y: '100%' })
        .translate({ y: this.isAllDay ? -400 : -500 })
        .zIndex(1000)
      }
    }
    .width('100%')
    .height('100%')
  }
}
