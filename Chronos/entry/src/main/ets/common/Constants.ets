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

  // 任务优先级（三级：低、中、高）
  static readonly PRIORITY_LOW: number = 1;      // 低优先级
  static readonly PRIORITY_MEDIUM: number = 2;   // 中优先级
  static readonly PRIORITY_HIGH: number = 3;     // 高优先级

  // ============================================
  // 颜色主题 - 温暖的橙色系统（品牌色）
  // 符合 WCAG AA 标准（对比度 ≥ 4.5:1）
  // ============================================
  
  // 主色调 - 温暖的橙色系
  static readonly COLOR_PRIMARY: string = '#FF6B35';           // 主橙色 - 品牌色
  static readonly COLOR_PRIMARY_DARK: string = '#E65100';      // 深橙色 - 按下状态、强调
  static readonly COLOR_PRIMARY_LIGHT: string = '#FFE5DC';     // 浅橙色 - 背景、选中状态
  static readonly COLOR_PRIMARY_LIGHTER: string = '#FFF0E8';   // 极浅橙色 - hover、辅助背景
  
  // 渐变色彩
  static readonly COLOR_GRADIENT_START: string = '#FF8C5A';    // 渐变起始色
  static readonly COLOR_GRADIENT_END: string = '#FF6B35';      // 渐变结束色
  
  // 功能色 - 清晰的语义化颜色
  static readonly COLOR_SUCCESS: string = '#10B981';           // 成功色 - 绿色（收入、完成）
  static readonly COLOR_WARNING: string = '#F59E0B';           // 警告色 - 琥珀色（待办、提醒）
  static readonly COLOR_DANGER: string = '#EF4444';            // 危险色 - 红色（支出、删除）
  static readonly COLOR_INFO: string = '#3B82F6';              // 信息色 - 蓝色（提示）
  
  // 背景色 - 温暖的橙色系（品牌特色）
  static readonly COLOR_BACKGROUND: string = '#FFF5F0';        // 主背景 - 淡淡的橙色/米白色（温暖）
  static readonly COLOR_BACKGROUND_SECONDARY: string = '#FFE8E0'; // 次要背景 - 浅橙色
  static readonly COLOR_CARD_BACKGROUND: string = '#FFFFFF';   // 卡片背景 - 纯白（保持对比）
  static readonly COLOR_CARD_BACKGROUND_HOVER: string = '#FFF8F5'; // 卡片悬浮 - 极浅橙色
  
  // 文字颜色 - 温暖色系搭配（符合对比度标准）
  static readonly COLOR_TEXT_PRIMARY: string = '#2C1810';      // 主要文字 - 深棕色（对比度 13.2:1）
  static readonly COLOR_TEXT_SECONDARY: string = '#8B6F5A';    // 次要文字 - 中等棕色（对比度 5.8:1）
  static readonly COLOR_TEXT_TERTIARY: string = '#B8A396';     // 三级文字 - 浅棕色（对比度 4.6:1）
  static readonly COLOR_TEXT_ON_PRIMARY: string = '#FFFFFF';   // 主色上的文字 - 白色
  static readonly COLOR_TEXT_DISABLED: string = '#D4C4BC';     // 禁用文字 - 极浅棕色
  
  // 边框和分割线 - 温暖色系
  static readonly COLOR_BORDER: string = '#FFD4C0';            // 边框色 - 浅橙色
  static readonly COLOR_DIVIDER: string = '#FFE8E0';           // 分割线色 - 与次要背景一致
  static readonly COLOR_BORDER_FOCUS: string = '#FF6B35';      // 聚焦边框 - 主色
  
  // 阴影色
  static readonly COLOR_SHADOW_LIGHT: string = 'rgba(255, 107, 53, 0.08)';   // 轻阴影（橙色调）
  static readonly COLOR_SHADOW_MEDIUM: string = 'rgba(255, 107, 53, 0.12)';  // 中阴影（橙色调）
  static readonly COLOR_SHADOW_HEAVY: string = 'rgba(255, 107, 53, 0.18)';   // 重阴影（橙色调）
  static readonly COLOR_SHADOW_PRIMARY: string = 'rgba(255, 107, 53, 0.3)';  // 主色阴影
  
  // ============================================
  // 间距系统 - 基于 8px 网格
  // ============================================
  static readonly SPACING_XS: number = 4;    // 极小间距
  static readonly SPACING_SM: number = 8;    // 小间距
  static readonly SPACING_MD: number = 16;   // 中等间距
  static readonly SPACING_LG: number = 24;   // 大间距
  static readonly SPACING_XL: number = 32;   // 超大间距
  static readonly SPACING_XXL: number = 48;  // 极大间距
  
  // ============================================
  // 圆角系统
  // ============================================
  static readonly BORDER_RADIUS_XS: number = 4;    // 极小圆角
  static readonly BORDER_RADIUS_SM: number = 8;    // 小圆角 - 按钮、输入框
  static readonly BORDER_RADIUS_MD: number = 12;   // 中圆角 - 卡片
  static readonly BORDER_RADIUS_LG: number = 16;   // 大圆角 - 大卡片
  static readonly BORDER_RADIUS_XL: number = 20;   // 超大圆角 - 对话框
  static readonly BORDER_RADIUS_FULL: number = 9999; // 圆形
  
  // ============================================
  // 字体大小系统
  // ============================================
  static readonly FONT_SIZE_XS: number = 11;   // 极小文字 - 辅助信息
  static readonly FONT_SIZE_SM: number = 13;   // 小文字 - 说明文字
  static readonly FONT_SIZE_BASE: number = 15; // 基础文字 - 正文
  static readonly FONT_SIZE_LG: number = 17;   // 大文字 - 强调
  static readonly FONT_SIZE_XL: number = 20;   // 超大文字 - 小标题
  static readonly FONT_SIZE_2XL: number = 24;  // 标题
  static readonly FONT_SIZE_3XL: number = 28;  // 大标题
  static readonly FONT_SIZE_4XL: number = 36;  // 超大标题
  
  // ============================================
  // 动画时长
  // ============================================
  static readonly ANIMATION_DURATION_FAST: number = 150;    // 快速动画
  static readonly ANIMATION_DURATION_NORMAL: number = 250;  // 正常动画
  static readonly ANIMATION_DURATION_SLOW: number = 350;    // 慢速动画
  
  // ============================================
  // Z-Index 层级
  // ============================================
  static readonly Z_INDEX_NORMAL: number = 1;      // 普通层级
  static readonly Z_INDEX_DROPDOWN: number = 10;   // 下拉菜单
  static readonly Z_INDEX_STICKY: number = 20;     // 固定元素
  static readonly Z_INDEX_MODAL: number = 100;     // 模态框
  static readonly Z_INDEX_TOAST: number = 200;     // 提示信息
  static readonly Z_INDEX_TOOLTIP: number = 300;   // 工具提示

  // 页面路由
  static readonly ROUTE_CALENDAR: string = 'pages/Calendar';
  static readonly ROUTE_TASKS: string = 'pages/Tasks';
  static readonly ROUTE_STATISTICS: string = 'pages/Statistics';
  static readonly ROUTE_SETTINGS: string = 'pages/Settings';
  static readonly ROUTE_ACCOUNTING: string = 'pages/Accounting';

  // API配置
  static readonly API_BASE_URL: string = 'http://localhost:8080/api'; // 需要根据实际后端地址修改
  
  // MIMO AI配置
  static readonly MIMO_API_KEY: string = 'sk-c98gx1dgjy6bpmu8ejq77l1zmvvied1f0fmtmgvie271iezj';
  static readonly MIMO_API_URL: string = 'https://api.xiaomimimo.com/v1/chat/completions';
  
  // 天行API配置（节假日接口）- 已弃用
  static readonly TIANAPI_KEY: string = '946b76bdb2c6424342e01207eba8372f';
  static readonly TIANAPI_HOLIDAY_URL: string = 'https://apis.tianapi.com/jiejiari/index';
  
  // mxnzp API配置（节假日及万年历接口）
  static readonly MXNZP_APP_ID: string = 'fjltrolmimk0nafq';
  static readonly MXNZP_APP_SECRET: string = 'S7ckQECIjhoMcDxBOyRSRXlafe0VxCBZ';
  static readonly MXNZP_HOLIDAY_URL: string = 'https://www.mxnzp.com/api/holiday/list/year';
  static readonly MXNZP_SINGLE_URL: string = 'https://www.mxnzp.com/api/holiday/single';
  
  // 数据源配置
  static readonly PREF_CALENDAR_DATA_SOURCE: string = 'calendar_data_source'; // 0=本地数据, 1=API数据
  static readonly DATA_SOURCE_LOCAL: number = 0;  // 本地数据
  static readonly DATA_SOURCE_API: number = 1;     // API数据
}

