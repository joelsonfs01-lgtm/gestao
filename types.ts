
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export type CompanyType = 'SPA' | 'FISIOTERAPIA';
export type ProfessionalType = 'Erika' | 'Edilene';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: TransactionType;
  companyId: CompanyType;
  professional?: ProfessionalType;
}

export interface CashFlowSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

// FIX: Add AIInsightResponse interface to be used by Gemini service and AIInsights component.
export interface AIInsightResponse {
  summary: string;
  suggestions: string[];
  warnings: string[];
}
