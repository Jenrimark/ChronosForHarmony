import { StatisticsChart } from '../components/StatisticsChart';
import { TaskService } from '../service/TaskService';
import { Task } from '../model/Task';
import { Constants } from '../common/Constants';
import { Utils } from '../common/Utils';

/**
 * 统计页面
 */
@Component
export struct Statistics {
  @State tasks: Task[] = [];
  @State chartType: 'status' | 'priority' | 'daily' = 'status';
  @State todayTasks: Task[] = [];
  @State weekTasks: Task[] = [];
  @State monthTasks: Task[] = [];

  private taskService: TaskService = TaskService.getInstance();

  aboutToAppear() {
    this.loadStatistics();
  }

  /**
   * 加载统计数据
   */
  async loadStatistics(): Promise<void> {
    this.tasks = await this.taskService.getAllTasks();
    this.todayTasks = await this.taskService.getTodayTasks();
    this.weekTasks = await this.taskService.getWeekTasks();
    this.monthTasks = await this.taskService.getMonthTasks();
  }

  /**
   * 获取完成率
   */
  getCompletionRate(tasks: Task[]): number {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === Constants.TASK_STATUS_COMPLETED).length;
    return (completed / tasks.length) * 100;
  }

  build() {
    Scroll() {
      Column() {
        // 概览卡片
        Column() {
          Row() {
            this.buildStatCard('全部任务', this.tasks.length.toString(), Constants.COLOR_PRIMARY)
            this.buildStatCard('今日任务', this.todayTasks.length.toString(), Constants.COLOR_WARNING)
          }
          .width('100%')
          .justifyContent(FlexAlign.SpaceAround)
          .margin({ bottom: 12 })

          Row() {
            this.buildStatCard('本周任务', this.weekTasks.length.toString(), Constants.COLOR_SUCCESS)
            this.buildStatCard('本月任务', this.monthTasks.length.toString(), Constants.COLOR_DANGER)
          }
          .width('100%')
          .justifyContent(FlexAlign.SpaceAround)
        }
        .width('100%')
        .padding(16)
        .backgroundColor('#FFFFFF')
        .borderRadius(12)
        .margin({ top: 16, left: 16, right: 16 })

        // 完成率卡片
        Column() {
          Text('完成率')
            .fontSize(16)
            .fontWeight(FontWeight.Bold)
            .fontColor(Constants.COLOR_TEXT_PRIMARY)
            .margin({ bottom: 16 })

          Row() {
            Column() {
              Text('今日')
                .fontSize(14)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
              Text(`${this.getCompletionRate(this.todayTasks).toFixed(1)}%`)
                .fontSize(24)
                .fontWeight(FontWeight.Bold)
                .fontColor(Constants.COLOR_PRIMARY)
                .margin({ top: 4 })
            }
            .layoutWeight(1)

            Column() {
              Text('本周')
                .fontSize(14)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
              Text(`${this.getCompletionRate(this.weekTasks).toFixed(1)}%`)
                .fontSize(24)
                .fontWeight(FontWeight.Bold)
                .fontColor(Constants.COLOR_PRIMARY)
                .margin({ top: 4 })
            }
            .layoutWeight(1)

            Column() {
              Text('本月')
                .fontSize(14)
                .fontColor(Constants.COLOR_TEXT_SECONDARY)
              Text(`${this.getCompletionRate(this.monthTasks).toFixed(1)}%`)
                .fontSize(24)
                .fontWeight(FontWeight.Bold)
                .fontColor(Constants.COLOR_PRIMARY)
                .margin({ top: 4 })
            }
            .layoutWeight(1)
          }
          .width('100%')
        }
        .width('100%')
        .padding(16)
        .backgroundColor('#FFFFFF')
        .borderRadius(12)
        .margin({ top: 16, left: 16, right: 16 })

        // 图表类型选择
        Row() {
          this.buildChartTypeButton('status', '状态统计')
          this.buildChartTypeButton('priority', '优先级统计')
          this.buildChartTypeButton('daily', '每日统计')
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 16 })
        .justifyContent(FlexAlign.SpaceAround)

        // 统计图表
        Column() {
          StatisticsChart({
            tasks: this.tasks,
            chartType: this.chartType
          })
        }
        .width('100%')
        .padding(16)
        .backgroundColor('#FFFFFF')
        .borderRadius(12)
        .margin({ top: 16, left: 16, right: 16, bottom: 16 })
      }
    }
    .width('100%')
    .flexGrow(1)
    .backgroundColor(Constants.COLOR_BACKGROUND)
  }

  @Builder
  buildStatCard(title: string, value: string, color: string) {
    Column() {
      Text(title)
        .fontSize(14)
        .fontColor(Constants.COLOR_TEXT_SECONDARY)
      Text(value)
        .fontSize(32)
        .fontWeight(FontWeight.Bold)
        .fontColor(color)
        .margin({ top: 8 })
    }
    .width('45%')
    .padding(16)
    .backgroundColor(Constants.COLOR_BACKGROUND)
    .borderRadius(8)
  }

  @Builder
  buildChartTypeButton(type: 'status' | 'priority' | 'daily', label: string) {
    Button(label)
      .type(ButtonType.Normal)
      .fontSize(14)
      .fontColor(
        this.chartType === type
          ? '#FFFFFF'
          : Constants.COLOR_TEXT_PRIMARY
      )
      .backgroundColor(
        this.chartType === type
          ? Constants.COLOR_PRIMARY
          : '#FFFFFF'
      )
      .borderRadius(16)
      .padding({ left: 16, right: 16, top: 6, bottom: 6 })
      .onClick(() => {
        this.chartType = type;
      })
  }
}

