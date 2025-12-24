
import React, { useState, useEffect, useMemo } from 'react';
import { PlusCircle, Wallet, TrendingUp, History, BarChart3, Building2, Calendar, Download, ChevronLeft, ChevronRight, Coins } from 'lucide-react';
import { Transaction, TransactionType, CashFlowSummary, CompanyType } from './types';
import SummaryCards from './components/SummaryCards';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import CashFlowChart from './components/CashFlowChart';
import ErikaEarningsList from './components/ErikaEarningsList';

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedCompany, setSelectedCompany] = useState<CompanyType>(() => {
    const saved = localStorage.getItem('selectedCompany');
    return (saved as CompanyType) || 'SPA';
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'erika'>('dashboard');

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('selectedCompany', selectedCompany);
  }, [selectedCompany]);

  const changeMonth = (increment: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setSelectedDate(newDate);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      const sameMonth = tDate.getUTCMonth() === selectedDate.getMonth();
      const sameYear = tDate.getUTCFullYear() === selectedDate.getFullYear();
      return t.companyId === selectedCompany && sameMonth && sameYear;
    });
  }, [transactions, selectedCompany, selectedDate]);

  const summary = useMemo<CashFlowSummary>(() => {
    return filteredTransactions.reduce((acc, t) => {
      if (t.type === TransactionType.INCOME) {
        acc.totalIncome += t.amount;
        acc.balance += t.amount;
      } else {
        acc.totalExpense += t.amount;
        acc.balance -= t.amount;
      }
      return acc;
    }, { totalIncome: 0, totalExpense: 0, balance: 0 });
  }, [filteredTransactions]);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id' | 'companyId'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Math.random().toString(36).substring(2, 9),
      companyId: selectedCompany
    };

    setTransactions(prev => {
      const newList = [transaction, ...prev];
      if (selectedCompany === 'SPA' && transaction.type === TransactionType.INCOME && transaction.professional === 'Erika') {
        const commissionExpense: Transaction = {
          id: Math.random().toString(36).substring(2, 10),
          date: transaction.date,
          description: "Pagamento Erika",
          amount: transaction.amount * 0.3,
          category: 'Pessoal',
          type: TransactionType.EXPENSE,
          companyId: 'SPA',
          professional: 'Erika'
        };
        return [commissionExpense, ...newList];
      }
      return newList;
    });
    setIsFormOpen(false);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Deseja realmente excluir esta transação?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0 font-sans print:bg-white">
      <header className="bg-white border-b sticky top-0 z-30 px-4 py-4 md:px-8 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Wallet className="text-white w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight whitespace-nowrap">Fluxo Pro</h1>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
              <button
                onClick={() => setSelectedCompany('SPA')}
                className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  selectedCompany === 'SPA' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                SPA
              </button>
              <button
                onClick={() => setSelectedCompany('FISIOTERAPIA')}
                className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  selectedCompany === 'FISIOTERAPIA' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                FISIOTERAPIA
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Unidade: {selectedCompany}</span>
            </div>
            <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm active:scale-95">
              <PlusCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Nova Transação</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
          <div className="flex gap-4 border-b w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
            <button onClick={() => setActiveTab('dashboard')} className={`pb-4 px-2 font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'dashboard' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>
              <BarChart3 className="w-5 h-5" /> Painel
            </button>
            <button onClick={() => setActiveTab('history')} className={`pb-4 px-2 font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'history' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>
              <History className="w-5 h-5" /> Histórico
            </button>
            {selectedCompany === 'SPA' && (
              <button onClick={() => setActiveTab('erika')} className={`pb-4 px-2 font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'erika' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}>
                <Coins className="w-5 h-5" /> Ganhos Erika
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 w-full md:w-auto justify-between">
            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"><ChevronLeft className="w-5 h-5" /></button>
            <div className="flex items-center gap-2 px-4">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span className="font-bold text-slate-700">{MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}</span>
            </div>
            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"><ChevronRight className="w-5 h-5" /></button>
          </div>

          <button onClick={() => window.print()} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-semibold"><Download className="w-4 h-4" /> Exportar PDF</button>
        </div>

        {activeTab === 'dashboard' ? (
          <div className="max-w-7xl mx-auto space-y-8">
            <SummaryCards summary={summary} />
            
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold mb-6 text-slate-800">Evolução Financeira</h3>
                <div className="h-[350px]"><CashFlowChart transactions={filteredTransactions} /></div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <TransactionList transactions={filteredTransactions} onDelete={handleDeleteTransaction} />
              </div>
            </div>
          </div>
        ) : activeTab === 'history' ? (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <TransactionList transactions={filteredTransactions} onDelete={handleDeleteTransaction} />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <ErikaEarningsList transactions={filteredTransactions} onDelete={handleDeleteTransaction} />
          </div>
        )}
      </main>

      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <TransactionForm onAdd={handleAddTransaction} onClose={() => setIsFormOpen(false)} companyName={selectedCompany} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;