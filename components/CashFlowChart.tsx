
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction, TransactionType } from '../types';

interface Props {
  transactions: Transaction[];
}

const CashFlowChart: React.FC<Props> = ({ transactions }) => {
  const chartData = useMemo(() => {
    const groupedData: Record<string, { income: number; expense: number; date: string }> = {};

    // Sort by date first
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sorted.forEach((t) => {
      const date = t.date;
      if (!groupedData[date]) {
        groupedData[date] = { income: 0, expense: 0, date };
      }
      if (t.type === TransactionType.INCOME) {
        groupedData[date].income += t.amount;
      } else {
        groupedData[date].expense += t.amount;
      }
    });

    return Object.values(groupedData).slice(-30); // Last 30 unique dates
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        Dados insuficientes para gerar o gráfico.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="date" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#94a3b8' }}
          tickFormatter={(str) => {
            const date = new Date(str);
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
          }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#94a3b8' }}
          tickFormatter={(value) => `R$ ${value}`}
        />
        <Tooltip 
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          labelFormatter={(label) => new Date(label).toLocaleDateString('pt-BR', { dateStyle: 'long' })}
        />
        <Area 
          type="monotone" 
          dataKey="income" 
          stroke="#10b981" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorIncome)" 
          name="Receita"
        />
        <Area 
          type="monotone" 
          dataKey="expense" 
          stroke="#f43f5e" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorExpense)" 
          name="Despesa"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CashFlowChart;
