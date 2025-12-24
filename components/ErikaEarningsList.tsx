import React from 'react';
import { CreditCard, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(date);
};

const ErikaEarningsList: React.FC<Props> = ({ transactions, onDelete }) => {
  // Filtramos apenas as RECEITAS vinculadas à Erika para calcular os 30%
  const erikaIncome = transactions.filter(t => 
    t.professional === 'Erika' && t.type === TransactionType.INCOME
  );

  if (erikaIncome.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="text-slate-300 w-8 h-8" />
        </div>
        <p className="text-slate-500 font-medium">Nenhum ganho registrado para Erika.</p>
        <p className="text-slate-400 text-sm">Transações de Receita no SPA marcadas com 'Erika' aparecerão aqui.</p>
      </div>
    );
  }

  const totalGanhos = erikaIncome.reduce((acc, t) => acc + (t.amount * 0.3), 0);
  const totalVolume = erikaIncome.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-md flex justify-between items-center">
        <div>
          <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-1">Total de Ganhos (30%)</p>
          <p className="text-3xl font-black">{formatCurrency(totalGanhos)}</p>
        </div>
        <div className="text-right">
          <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-1">Volume de Serviços</p>
          <p className="text-xl font-bold">{formatCurrency(totalVolume)}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="text-xs text-slate-400 uppercase tracking-wider">
            <tr className="border-b border-slate-100">
              <th className="pb-4 font-semibold">Serviço/Descrição</th>
              <th className="pb-4 font-semibold">Data</th>
              <th className="pb-4 font-semibold text-right">Valor Total</th>
              <th className="pb-4 font-semibold text-right text-indigo-600">Comissão (30%)</th>
              <th className="pb-4 font-semibold text-right print:hidden">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {erikaIncome.map((t) => (
              <tr key={t.id} className="group hover:bg-slate-50 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <p className="text-sm font-semibold text-slate-800">{t.description}</p>
                  </div>
                </td>
                <td className="py-4 text-sm text-slate-500">{formatDate(t.date)}</td>
                <td className="py-4 text-sm text-right font-medium text-slate-600">{formatCurrency(t.amount)}</td>
                <td className="py-4 text-sm text-right font-bold text-indigo-600 bg-indigo-50/30">
                  {formatCurrency(t.amount * 0.3)}
                </td>
                <td className="py-4 text-right print:hidden">
                  <button 
                    onClick={() => onDelete(t.id)}
                    className="p-2 text-slate-300 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50 opacity-0 group-hover:opacity-100 focus:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
        <p className="text-xs text-slate-500 italic">
          * Nota: O sistema lança automaticamente uma despesa chamada "Pagamento Erika" no fluxo principal correspondente a 30% de cada serviço listado acima.
        </p>
      </div>
    </div>
  );
};

export default ErikaEarningsList;