
import React, { useState } from 'react';
import { Transaction } from '../types';
import { getFinancialAdvice } from '../services/geminiService';

interface Props {
  transactions: Transaction[];
}

const FinancialSummary: React.FC<Props> = ({ transactions }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const stats = transactions.reduce((acc, curr) => {
    if (curr.type === 'income') acc.income += curr.amount;
    else acc.expense += curr.amount;
    return acc;
  }, { income: 0, expense: 0 });

  const balance = stats.income - stats.expense;

  const handleGetAdvice = async () => {
    if (transactions.length === 0) return;
    setLoading(true);
    const result = await getFinancialAdvice(transactions);
    setAdvice(result || "Ошибка при получении совета.");
    setLoading(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(val);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 rounded-full ${balance >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Чистый баланс</p>
        <h2 className={`text-4xl font-black ${balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-1">Доходы</p>
          <p className="text-xl font-bold text-slate-800">{formatCurrency(stats.income)}</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest mb-1">Расходы</p>
          <p className="text-xl font-bold text-slate-800">{formatCurrency(stats.expense)}</p>
        </div>
      </div>

      <div className="bg-indigo-600 p-6 rounded-3xl shadow-xl shadow-indigo-100 text-white relative group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <h3 className="font-bold text-lg">AI Инсайты</h3>
          </div>
          
          {advice ? (
            <div className="text-sm leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md mb-4 whitespace-pre-wrap italic">
                {advice}
              </div>
              <button 
                onClick={() => setAdvice(null)}
                className="text-xs font-bold text-indigo-200 hover:text-white transition-colors"
              >
                Очистить и закрыть
              </button>
            </div>
          ) : (
            <div>
              <p className="text-indigo-100 text-sm mb-4">
                Позвольте искусственному интеллекту проанализировать ваши финансы.
              </p>
              <button
                onClick={handleGetAdvice}
                disabled={loading || transactions.length === 0}
                className="w-full bg-white text-indigo-600 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Думаю...
                  </span>
                ) : 'Проанализировать'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;
