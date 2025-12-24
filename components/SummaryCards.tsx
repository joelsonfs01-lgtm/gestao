
import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Banknote } from 'lucide-react';
import { CashFlowSummary } from '../types';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

interface Props {
  summary: CashFlowSummary;
}

const SummaryCards: React.FC<Props> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <Banknote className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Saldo Atual</span>
        </div>
        <div>
          <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-slate-800' : 'text-rose-600'}`}>
            {formatCurrency(summary.balance)}
          </p>
          <p className="text-sm text-slate-500 mt-1">Disponível em conta</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <ArrowUpCircle className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Receitas</span>
        </div>
        <div>
          <p className="text-2xl font-bold text-emerald-600">
            {formatCurrency(summary.totalIncome)}
          </p>
          <p className="text-sm text-slate-500 mt-1">Total acumulado</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
            <ArrowDownCircle className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Despesas</span>
        </div>
        <div>
          <p className="text-2xl font-bold text-rose-600">
            {formatCurrency(summary.totalExpense)}
          </p>
          <p className="text-sm text-slate-500 mt-1">Total gasto</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
