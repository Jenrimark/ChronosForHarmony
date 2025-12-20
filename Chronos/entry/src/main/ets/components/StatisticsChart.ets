import { Constants } from '../common/Constants';
import { Task } from '../model/Task';

/**
 * 统计图表组件
 */
@Component
export struct StatisticsChart {
  @Prop tasks: Task[] = [];
  @Prop chartType: 'status' | 'priority' | 'daily' = 'status';

  /**
   * 获取状态统计
   */
  getStatusStats(): Map<string, number> {
    const stats = new Map<string, number>();
    this.tasks.forEach(task => {
      const count = stats.get(task.status) || 0;
      stats.set(task.status, count + 1);
    });
    return stats;
  }

  /**
   * 获取优先级统计
   */
  getPriorityStats(): Map<number, number> {
    const stats = new Map<number, number>();
    this.tasks.forEach(task => {
      const count = stats.get(task.priority) || 0;
      stats.set(task.priority, count + 1);
    });
    return stats;
  }

  /**
   * 获取每日任务统计（最近7天）
   */
  getDailyStats(): Map<string, number> {
    const stats = new Map<string, number>();
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = this.tasks.filter(task => {
        if (!task.dueDate) return false;
        return task.dueDate.toISOString().split('T')[0] === dateStr;
      }).length;
      stats.set(dateStr, count);
    }
    return stats;
  }

  build() {
    Column() {
      if (this.chartType === 'status') {
        this.buildStatusChart(this.getStatusStats(), this.tasks.length);
      } else if (this.chartType === 'priority') {
        this.buildPriorityChart(this.getPriorityStats(), this.tasks.length);
      } else {
        this.buildDailyChart(this.getDailyStats());
      }
    }
    .width('100%')
    .padding(16)
  }

  /**
   * 构建状态统计图表
   */
  @Builder
  buildStatusChart(stats: Map<string, number>, total: number) {
    Column() {
      ForEach(Array.from(stats.entries()), (item: [string, number]) => {
        Column() {
          Row() {
            Text(this.getStatusLabel(item[0]))
              .fontSize(14)
              .fontColor(Constants.COLOR_TEXT_PRIMARY)

            Blank()

            Text(`${item[1]} (${this.calculatePercentage(item[1], total)}%)`)
              .fontSize(14)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
          }
          .width('100%')
          .margin({ bottom: 8 })

          // 进度条
          Row() {
            Row()
              .width(`${this.calculatePercentage(item[1], total)}%`)
              .height(8)
              .backgroundColor(this.getStatusColor(item[0]))
              .borderRadius(4)
          }
          .width('100%')
          .height(8)
          .backgroundColor('#E5E5EA')
          .borderRadius(4)
        }
        .width('100%')
        .margin({ bottom: 16 })
      })
    }
  }

  /**
   * 构建优先级统计图表
   */
  @Builder
  buildPriorityChart(stats: Map<number, number>, total: number) {
    Column() {
      ForEach(Array.from(stats.entries()), (item: [number, number]) => {
        Column() {
          Row() {
            Text(this.getPriorityLabel(item[0]))
              .fontSize(14)
              .fontColor(Constants.COLOR_TEXT_PRIMARY)

            Blank()

            Text(`${item[1]} (${this.calculatePercentage(item[1], total)}%)`)
              .fontSize(14)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
          }
          .width('100%')
          .margin({ bottom: 8 })

          // 进度条
          Row() {
            Row()
              .width(`${this.calculatePercentage(item[1], total)}%`)
              .height(8)
              .backgroundColor(this.getPriorityColor(item[0]))
              .borderRadius(4)
          }
          .width('100%')
          .height(8)
          .backgroundColor('#E5E5EA')
          .borderRadius(4)
        }
        .width('100%')
        .margin({ bottom: 16 })
      })
    }
  }

  /**
   * 构建每日统计图表
   */
  @Builder
  buildDailyChart(stats: Map<string, number>) {
    Column() {
      Row() {
        ForEach(Array.from(stats.entries()), (item: [string, number]) => {
          Column() {
            Text(item[1].toString())
              .fontSize(12)
              .fontColor(Constants.COLOR_TEXT_PRIMARY)
              .margin({ bottom: 4 })

            Row()
              .width(30)
              .height(`${this.calculateHeight(item[1], stats)}%`)
              .backgroundColor(Constants.COLOR_PRIMARY)
              .borderRadius(4)

            Text(this.getDayName(item[0]))
              .fontSize(12)
              .fontColor(Constants.COLOR_TEXT_SECONDARY)
              .margin({ top: 4 })
          }
          .layoutWeight(1)
          .height(120)
          .justifyContent(FlexAlign.SpaceBetween)
          .alignItems(HorizontalAlign.Center)
        })
      }
      .width('100%')
      .height(120)
    }
  }

  /**
   * 获取状态标签
   */
  getStatusLabel(status: string): string {
    switch (status) {
      case Constants.TASK_STATUS_PENDING:
        return '待办';
      case Constants.TASK_STATUS_IN_PROGRESS:
        return '进行中';
      case Constants.TASK_STATUS_COMPLETED:
        return '已完成';
      case Constants.TASK_STATUS_CANCELLED:
        return '已取消';
      default:
        return status;
    }
  }

  /**
   * 获取优先级标签
   */
  getPriorityLabel(priority: number): string {
    switch (priority) {
      case 1:
        return '低';
      case 2:
        return '中';
      case 3:
        return '高';
      case 4:
        return '紧急';
      default:
        return '未知';
    }
  }

  /**
   * 计算百分比
   */
  calculatePercentage(count: number, total: number): string {
    return total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
  }

  /**
   * 计算高度百分比
   */
  calculateHeight(count: number, stats: Map<string, number>): number {
    const values = Array.from(stats.values());
    const maxCount = Math.max(...values, 1);
    return maxCount > 0 ? (count / maxCount) * 100 : 0;
  }

  /**
   * 获取星期名称
   */
  getDayName(dateStr: string): string {
    const dateObj = new Date(dateStr);
    const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
    return dayNames[dateObj.getDay()];
  }

  /**
   * 获取状态颜色
   */
  getStatusColor(status: string): string {
    switch (status) {
      case Constants.TASK_STATUS_PENDING:
        return Constants.COLOR_TEXT_SECONDARY;
      case Constants.TASK_STATUS_IN_PROGRESS:
        return Constants.COLOR_PRIMARY;
      case Constants.TASK_STATUS_COMPLETED:
        return Constants.COLOR_SUCCESS;
      case Constants.TASK_STATUS_CANCELLED:
        return Constants.COLOR_DANGER;
      default:
        return Constants.COLOR_TEXT_SECONDARY;
    }
  }

  /**
   * 获取优先级颜色
   */
  getPriorityColor(priority: number): string {
    switch (priority) {
      case 1:
        return '#8E8E93';
      case 2:
        return '#007AFF';
      case 3:
        return '#FF9500';
      case 4:
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  }
}
