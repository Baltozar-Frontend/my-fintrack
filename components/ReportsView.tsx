
import React from 'react';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
}

const ReportsView: React.FC<Props> = ({ transactions }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(val);
  };

  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const totalExpense = expenseTransactions.reduce((acc, t) => acc + t.amount, 0);

  const categoryStats = expenseTransactions.reduce((acc: any, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = { amount: 0, count: 0 };
    }
    acc[curr.category].amount += curr.amount;
    acc[curr.category].count += 1;
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryStats)
    .sort(([, a]: any, [, b]: any) => b.amount - a.amount);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-indigo-500 rounded-full" />
          Структура расходов
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="py-4 px-2 text-xs font-black text-slate-400 uppercase tracking-widest">Категория</th>
                <th className="py-4 px-2 text-xs font-black text-slate-400 uppercase tracking-widest">Сумма</th>
                <th className="py-4 px-2 text-xs font-black text-slate-400 uppercase tracking-widest">Доля</th>
                <th className="py-4 px-2 text-xs font-black text-slate-400 uppercase tracking-widest">Операций</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedCategories.length > 0 ? sortedCategories.map(([name, data]: [string, any]) => {
                const percentage = totalExpense > 0 ? ((data.amount / totalExpense) * 100).toFixed(1) : '0';
                return (
                  <tr key={name} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                          {name[0]}
                        </div>
                        <span className="font-bold text-slate-700">{name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 font-black text-slate-900">{formatCurrency(data.amount)}</td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden min-w-[60px]">
                          <div 
                            className="h-full bg-indigo-500 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-500">{percentage}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-sm text-slate-400 font-medium">{data.count} шт.</td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-slate-400 italic">Данные отсутствуют</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100">
          <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-1">Самый прибыльный источник</p>
          <p className="text-xl font-black text-emerald-900">
            {transactions.filter(t => t.type === 'income').sort((a,b) => b.amount - a.amount)[0]?.category || '—'}
          </p>
        </div>
        <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100">
          <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest mb-1">Главная статья трат</p>
          <p className="text-xl font-black text-rose-900">
            {sortedCategories[0]?.[0] || '—'}
          </p>
        </div>
        <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100">
          <p className="text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-1">Средний чек расхода</p>
          <p className="text-xl font-black text-indigo-900">
            {totalExpense > 0 ? formatCurrency(totalExpense / expenseTransactions.length) : '0 ₽'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
