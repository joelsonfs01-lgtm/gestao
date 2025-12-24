
import React from 'react';
import { Trash2, TrendingUp, Zap, Activity, Users, CreditCard, HelpCircle } from 'lucide-react';
import { Transaction, TransactionType } from '../types';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Vendas': return <TrendingUp className="text-emerald-500" />;
    case 'Serviços': return <Zap className="text-amber-500" />;
    case 'Atendimento Fisioterapia': return <Activity className="text-teal-500" />;
    case 'Pessoal': return <Users className="text-blue-500" />;
    case 'Marketing': return <CreditCard className="text-indigo-500" />;
    default: return <HelpCircle className="text-slate-500" />;
  }
};

const TransactionList: React.FC<{ transactions: Transaction[], onDelete: (id: string) => void }> = ({ transactions, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <tbody className="divide-y">
          {transactions.map(t => (
            <tr key={t.id} className="group hover:bg-slate-50">
              <td className="py-4 flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">{getCategoryIcon(t.category)}</div>
                <span className="font-semibold text-sm">{t.description}</span>
              </td>
              <td className="py-4 text-xs text-slate-500">{t.category}</td>
              <td className={`py-4 text-right font-bold ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-rose-600'}`}>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
              </td>
              <td className="py-4 text-right">
                <button onClick={() => onDelete(t.id)} className="text-slate-300 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
