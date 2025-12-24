
import React, { useState, useEffect } from 'react';
import { BrainCircuit, Loader2, Lightbulb, AlertTriangle, ChevronRight } from 'lucide-react';
import { Transaction, AIInsightResponse } from '../types';
import { getFinancialInsights } from '../services/geminiService';

interface Props {
  transactions: Transaction[];
}

const AIInsights: React.FC<Props> = ({ transactions }) => {
  const [insights, setInsights] = useState<AIInsightResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    if (transactions.length < 3) return;
    setLoading(true);
    try {
      const data = await getFinancialInsights(transactions);
      setInsights(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Optional: auto-generate once on load if enough data
    if (transactions.length >= 3 && !insights) {
      generateInsights();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl shadow-indigo-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <BrainCircuit className="w-32 h-32" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <BrainCircuit className="w-6 h-6 text-indigo-400" />
          <h3 className="text-lg font-bold">Análise Gemini AI</h3>
        </div>

        {!insights && !loading && (
          <div className="space-y-4">
            <p className="text-slate-400 text-sm">
              {transactions.length < 3 
                ? "Adicione pelo menos 3 transações para que a IA possa analisar seu fluxo de caixa."
                : "Seu assistente financeiro está pronto para analisar seus dados."}
            </p>
            {transactions.length >= 3 && (
              <button 
                onClick={generateInsights}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg active:scale-95"
              >
                Gerar Análise Estratégica
              </button>
            )}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
            <p className="text-slate-400 text-sm animate-pulse">Consultando especialistas virtuais...</p>
          </div>
        )}

        {insights && !loading && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div>
              <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-indigo-500 pl-4 italic">
                "{insights.summary}"
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" /> Sugestões
              </h4>
              <ul className="space-y-2">
                {insights.suggestions.map((item, idx) => (
                  <li key={idx} className="flex gap-2 text-sm text-slate-300">
                    <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {insights.warnings.length > 0 && (
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" /> Alertas
                </h4>
                <ul className="space-y-2">
                  {insights.warnings.map((item, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-rose-200/80">
                      <span className="shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button 
              onClick={generateInsights}
              className="w-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-2 rounded-lg transition-colors mt-4"
            >
              Atualizar Análise
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;
