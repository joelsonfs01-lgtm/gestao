
import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Building2, User, AlertCircle } from 'lucide-react';
import { TransactionType, ProfessionalType } from '../types';

interface Props {
  onAdd: (transaction: {
    description: string;
    amount: number;
    category: string;
    date: string;
    type: TransactionType;
    professional?: ProfessionalType;
  }) => void;
  onClose: () => void;
  companyName: string;
}

const TransactionForm: React.FC<Props> = ({ onAdd, onClose, companyName }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<TransactionType>(TransactionType.INCOME);
  const [professional, setProfessional] = useState<ProfessionalType | ''>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    if (companyName === 'SPA' && !professional) {
      setError('Escolha um profissional para o SPA.');
      return;
    }
    onAdd({
      description,
      amount: parseFloat(amount),
      category,
      date,
      type,
      ...(companyName === 'SPA' ? { professional: professional as ProfessionalType } : {})
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Nova Transação</h2>
        <button onClick={onClose} className="p-1"><X /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex p-1 bg-slate-100 rounded-xl gap-1">
          <button type="button" onClick={() => setType(TransactionType.INCOME)} className={`flex-1 py-2 rounded-lg text-sm font-bold ${type === TransactionType.INCOME ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>Receita</button>
          <button type="button" onClick={() => setType(TransactionType.EXPENSE)} className={`flex-1 py-2 rounded-lg text-sm font-bold ${type === TransactionType.EXPENSE ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}>Despesa</button>
        </div>

        {companyName === 'SPA' && (
          <div className="flex gap-2">
            {['Erika', 'Edilene'].map(p => (
              <button key={p} type="button" onClick={() => setProfessional(p as ProfessionalType)} className={`flex-1 py-2 rounded-lg text-sm font-bold border-2 ${professional === p ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 text-slate-400'}`}>{p}</button>
            ))}
          </div>
        )}

        <input type="text" placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
        <div className="flex gap-4">
          <input type="number" placeholder="Valor" value={amount} onChange={e => setAmount(e.target.value)} className="flex-1 p-2.5 bg-slate-50 border rounded-xl" />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="flex-1 p-2.5 bg-slate-50 border rounded-xl" />
        </div>

        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl">
          <option value="">Categoria</option>
          <option value="Vendas">Vendas</option>
          <option value="Serviços">Serviços</option>
          <option value="Atendimento Fisioterapia">Atendimento Fisioterapia</option>
          <option value="Marketing">Marketing</option>
          <option value="Pessoal">Pessoal</option>
          <option value="Outros">Outros</option>
        </select>

        <button type="submit" className={`w-full py-3 rounded-xl text-white font-bold ${type === TransactionType.INCOME ? 'bg-emerald-600' : 'bg-rose-600'}`}>Salvar</button>
      </form>
    </div>
  );
};

export default TransactionForm;
