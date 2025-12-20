import { Task } from '../model/Task';
import { Utils } from '../common/Utils';
import { Constants } from '../common/Constants';

/**
 * 任务项组件
 */
@Component
export struct TaskItem {
  @Prop task: Task = new Task();
  @Link onTapAction: number;
  @Link onCompleteAction: number;
  @Link onDeleteAction: number;
  
  @State actionId: number = 0;

  aboutToAppear() {
    this.actionId = this.task.id;
  }

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
        .width(24)
        .height(24)
        .borderRadius(12)
        .backgroundColor(Constants.COLOR_SUCCESS)
        .justifyContent(FlexAlign.Center)
        .onClick(() => {
          this.onCompleteAction = this.task.id;
        })
      } else {
        // 未完成：空心圆圈
        Text('')
          .width(24)
          .height(24)
          .borderRadius(12)
          .border({ width: 2, color: Constants.COLOR_TEXT_SECONDARY })
          .onClick(() => {
            this.onCompleteAction = this.task.id;
          })
      }

      // 任务信息
      Column() {
        Text(this.task.title)
          .fontSize(16)
          .fontColor(
            this.task.status === Constants.TASK_STATUS_COMPLETED
              ? Constants.COLOR_TEXT_SECONDARY
              : Constants.COLOR_TEXT_PRIMARY
          )
          .fontWeight(
            this.task.status === Constants.TASK_STATUS_COMPLETED
              ? FontWeight.Normal
              : FontWeight.Medium
          )
          .decoration(
            this.task.status === Constants.TASK_STATUS_COMPLETED
              ? { type: TextDecorationType.LineThrough }
              : { type: TextDecorationType.None }
          )
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })

        if (this.task.description) {
          Text(this.task.description)
            .fontSize(14)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
            .maxLines(2)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
            .margin({ top: 4 })
        }

        // 任务元信息
        Row() {
          // 优先级标签
          Text(Utils.getPriorityText(this.task.priority))
            .fontSize(12)
            .fontColor('#FFFFFF')
            .backgroundColor(Utils.getPriorityColor(this.task.priority))
            .padding({ left: 6, right: 6, top: 2, bottom: 2 })
            .borderRadius(4)

          // 截止日期
          if (this.task.dueDate) {
            Text(Utils.formatDate(this.task.dueDate, 'MM-DD'))
              .fontSize(12)
              .fontColor(
                this.task.isOverdue()
                  ? Constants.COLOR_DANGER
                  : (this.task.isDueToday() ? Constants.COLOR_WARNING : Constants.COLOR_TEXT_SECONDARY)
              )
              .margin({ left: 8 })
          }

          Blank()

          // 状态标签
          Text(Utils.getStatusText(this.task.status))
            .fontSize(12)
            .fontColor(Constants.COLOR_TEXT_SECONDARY)
        }
        .width('100%')
        .margin({ top: 8 })
      }
      .layoutWeight(1)
      .alignItems(HorizontalAlign.Start)
      .margin({ left: 12 })

      // 删除按钮
      Text('×')
        .width(24)
        .height(24)
        .fontSize(20)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
        .textAlign(TextAlign.Center)
        .onClick(() => {
          this.onDeleteAction = this.task.id;
        })
    }
    .width('100%')
    .padding(16)
    .backgroundColor(
      this.task.status === Constants.TASK_STATUS_COMPLETED
        ? Constants.COLOR_BACKGROUND_SECONDARY
        : Constants.COLOR_CARD_BACKGROUND
    )
    .borderRadius(8)
    .margin({ bottom: 8 })
    .opacity(
      this.task.status === Constants.TASK_STATUS_COMPLETED
        ? 0.7
        : 1.0
    )
    .onClick(() => {
      this.onTapAction = this.task.id;
    })
  }
}
