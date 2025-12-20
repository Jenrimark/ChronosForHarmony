import { BillType, BillCategory } from '../model/Bill';

/**
 * 账单识别结果接口
 */
export interface BillRecognitionResult {
  type: BillType;
  category: BillCategory;
}

/**
 * AI识别请求接口
 */
export interface BillRecognitionRequest {
  type: string;
  category: string;
  amount: number;
  description: string;
}

/**
 * 账单信息提取结果接口
 */
export interface BillExtractResult {
  amount?: number;
  description?: string;
}

/**
 * AI提取请求接口
 */
export interface BillExtractRequest {
  amount: number;
  description: string;
}

/**
 * 账单统计信息接口
 */
export interface BillStatistics {
  totalIncome: number;
  totalExpense: number;
  netIncome: number;
  incomeCount: number;
  expenseCount: number;
}

/**
 * 分类选项接口
 */
export interface CategoryOption {
  cat: BillCategory;
  name: string;
}
