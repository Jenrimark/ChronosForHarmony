import { Task } from '../model/Task';
import { Utils } from '../common/Utils';
import { Constants } from '../common/Constants';

/**
 * 任务项组件
 * 使用回调函数处理用户交互，替代 @Link 状态传递
 */
@Component
export struct TaskItem {
  @Prop task: Task = new Task();
  
  // 回调函数 - 替代 @Link 状态变量
  onComplete: (task: Task) => void = () => {};
  onDelete: (task: Task) => void = () => {};
  onTap: (task: Task) => void = () => {};

  build() {
    Row() {
      // 完成状态圆圈按钮
      if (this.task.status === Constants.TASK_STATUS_COMPLETED) {
        // 已完成：实心圆圈带对勾
        Column() {
          Text('✓')
            .fontSize(14)
            .fontColor('#FFFFFF')
            .fontWeight(FontWeight.Bold)
        }
        .width(26)
        .height(26)
        .borderRadius(13)
        .backgroundColor(Constants.COLOR_SUCCESS)
        .justifyContent(FlexAlign.Center)
        .onClick(() => {
          this.onComplete(this.task);
        })
      } else {
        // 未完成：空心圆圈，带主题色边框
        Column()
          .width(26)
          .height(26)
          .borderRadius(13)
          .border({ width: 2, color: Constants.COLOR_PRIMARY_LIGHT })
          .backgroundColor('transparent')
          .onClick(() => {
            this.onComplete(this.task);
          })
      }

      // 任务信息区域
      Column() {
        Text(this.task.title)
          .fontSize(16)
          .fontColor(
            this.task.status === Constants.TASK_STATUS_COMPLETED
              ? Constants.COLOR_TEXT_TERTIARY
              : Constants.COLOR_TEXT_PRIMARY
          )
          .fontWeight(
            this.task.status === Constants.TASK_STATUS_COMPLETED
              ? FontWeight.Normal
              : FontWeight.Medium
          )
          .decoration(
            this.task.status === Constants.TASK_STATUS_COMPLETED
              ? { type: TextDecorationType.LineThrough, color: Constants.COLOR_TEXT_TERTIARY }
              : { type: TextDecorationType.None }
          )
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })

        if (this.task.description) {
          Text(this.task.description)
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .maxLines(2)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
            .margin({ top: 6 })
        }

        // 任务元信息
        Row() {
          // 优先级标签
          Text(Utils.getPriorityText(this.task.priority))
            .fontSize(11)
            .fontWeight(FontWeight.Medium)
            .fontColor('#FFFFFF')
            .backgroundColor(Utils.getPriorityColor(this.task.priority))
            .padding({ left: 8, right: 8, top: 3, bottom: 3 })
            .borderRadius(10)

          // 截止日期
          if (this.task.dueDate) {
            Row() {
              Text('📅')
                .fontSize(12)
              Text(Utils.formatDate(this.task.dueDate, 'MM-DD'))
                .fontSize(12)
                .fontWeight(FontWeight.Medium)
                .fontColor(
                  this.task.isOverdue()
                    ? Constants.COLOR_DANGER
                    : (this.task.isDueToday() ? Constants.COLOR_WARNING : Constants.COLOR_TEXT_SECONDARY)
                )
                .margin({ left: 4 })
            }
            .margin({ left: 10 })
          }

          Blank()

          // 状态标签
          Text(Utils.getStatusText(this.task.status))
            .fontSize(11)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .backgroundColor(Constants.COLOR_BACKGROUND)
            .padding({ left: 8, right: 8, top: 3, bottom: 3 })
            .borderRadius(10)
        }
        .width('100%')
        .margin({ top: 10 })
      }
      .layoutWeight(1)
      .alignItems(HorizontalAlign.Start)
      .margin({ left: 14 })
      .onClick(() => {
        this.onTap(this.task);
      })

      // 删除按钮
      Column() {
        Text('×')
          .fontSize(18)
          .fontColor(Constants.COLOR_TEXT_SECONDARY)
      }
      .width(32)
      .height(32)
      .borderRadius(16)
      .backgroundColor(Constants.COLOR_BACKGROUND)
      .justifyContent(FlexAlign.Center)
      .onClick(() => {
        this.onDelete(this.task);
      })
    }
    .width('100%')
    .padding({ top: 16, bottom: 16, left: 16, right: 14 })
    .backgroundColor(
      this.task.status === Constants.TASK_STATUS_COMPLETED
        ? Constants.COLOR_BACKGROUND
        : Constants.COLOR_CARD_BACKGROUND
    )
    .borderRadius(14)
    .margin({ bottom: 10 })
    .shadow(this.task.status === Constants.TASK_STATUS_COMPLETED ? {
      radius: 0,
      color: 'transparent',
      offsetX: 0,
      offsetY: 0
    } : {
      radius: 8,
      color: 'rgba(0, 0, 0, 0.04)',
      offsetX: 0,
      offsetY: 2
    })
    .opacity(
      this.task.status === Constants.TASK_STATUS_COMPLETED
        ? 0.75
        : 1.0
    )
  }
}
