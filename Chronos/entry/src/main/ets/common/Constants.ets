/**
 * 应用常量定义
 */
export class Constants {
  // 应用信息
  static readonly APP_NAME: string = '辰序';
  static readonly APP_VERSION: string = '1.0.0';

  // 数据库配置
  static readonly DATABASE_NAME: string = 'chronos.db';
  static readonly DATABASE_VERSION: number = 1;

  // 日期时间格式
  static readonly DATE_FORMAT: string = 'YYYY-MM-DD';
  static readonly TIME_FORMAT: string = 'HH:mm';
  static readonly DATETIME_FORMAT: string = 'YYYY-MM-DD HH:mm';

  // 任务状态
  static readonly TASK_STATUS_PENDING: string = 'pending';
  static readonly TASK_STATUS_IN_PROGRESS: string = 'in_progress';
  static readonly TASK_STATUS_COMPLETED: string = 'completed';
  static readonly TASK_STATUS_CANCELLED: string = 'cancelled';

  // 任务优先级
  static readonly PRIORITY_LOW: number = 1;
  static readonly PRIORITY_MEDIUM: number = 2;
  static readonly PRIORITY_HIGH: number = 3;
  static readonly PRIORITY_URGENT: number = 4;

  // 颜色主题 - 橙色系列（与图标颜色保持一致）
  // 主色调
  static readonly COLOR_PRIMARY: string = '#FF6B35';           // 主橙色（与图标背景色一致）
  static readonly COLOR_PRIMARY_DARK: string = '#E55A2B';      // 深橙色（按钮按下、强调）
  static readonly COLOR_PRIMARY_LIGHT: string = '#FF8C5A';     // 浅橙色（高亮、选中状态）
  static readonly COLOR_PRIMARY_LIGHTER: string = '#FFAD7F';   // 更浅橙色（hover、次要元素）
  
  // 渐变色彩
  static readonly COLOR_GRADIENT_START: string = '#FF8C5A';    // 渐变起始色（较亮）
  static readonly COLOR_GRADIENT_END: string = '#FF6B35';      // 渐变结束色（主色）
  
  // 功能色（保持橙色系的协调性）
  static readonly COLOR_SUCCESS: string = '#FFA726';           // 成功色（偏黄的橙色，温暖感）
  static readonly COLOR_WARNING: string = '#FF8F00';           // 警告色（深橙色）
  static readonly COLOR_DANGER: string = '#E65100';            // 危险色（深红橙色）
  static readonly COLOR_INFO: string = '#FFB74D';              // 信息色（浅橙色）
  
  // 背景色
  static readonly COLOR_BACKGROUND: string = '#FFF5F0';        // 主背景（非常浅的橙色/米白色）
  static readonly COLOR_BACKGROUND_SECONDARY: string = '#FFE8E0'; // 次要背景（浅橙色）
  static readonly COLOR_CARD_BACKGROUND: string = '#FFFFFF';   // 卡片背景（白色）
  static readonly COLOR_CARD_BACKGROUND_HOVER: string = '#FFF8F5'; // 卡片悬浮背景（极浅橙色）
  
  // 文字颜色
  static readonly COLOR_TEXT_PRIMARY: string = '#2C1810';      // 主要文字（深棕色，与橙色搭配）
  static readonly COLOR_TEXT_SECONDARY: string = '#8B6F5A';    // 次要文字（中等棕色）
  static readonly COLOR_TEXT_TERTIARY: string = '#B8A396';     // 三级文字（浅棕色）
  static readonly COLOR_TEXT_ON_PRIMARY: string = '#FFFFFF';   // 主色上的文字（白色）
  
  // 边框和分割线
  static readonly COLOR_BORDER: string = '#FFD4C0';            // 边框色（浅橙色）
  static readonly COLOR_DIVIDER: string = '#FFE8E0';           // 分割线色（与次要背景一致）

  // 页面路由
  static readonly ROUTE_CALENDAR: string = 'pages/Calendar';
  static readonly ROUTE_TASKS: string = 'pages/Tasks';
  static readonly ROUTE_STATISTICS: string = 'pages/Statistics';
  static readonly ROUTE_SETTINGS: string = 'pages/Settings';
  static readonly ROUTE_ACCOUNTING: string = 'pages/Accounting';

  // API配置
  static readonly API_BASE_URL: string = 'http://localhost:8080/api'; // 需要根据实际后端地址修改
  
  // MIMO AI配置
  static readonly MIMO_API_KEY: string = ''; // 请设置你的MIMO API Key
  static readonly MIMO_API_URL: string = 'https://api.xiaomimimo.com/v1/chat/completions';
}

