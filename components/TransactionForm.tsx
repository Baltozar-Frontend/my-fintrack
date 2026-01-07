
import React, { useState } from 'react';
import { Category, Transaction, TransactionType } from '../types';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

const CATEGORIES: Record<TransactionType, Category[]> = {
  income: ['Зарплата', 'Инвестиции', 'Прочее'],
  expense: ['Еда', 'Транспорт', 'Развлечения', 'Здоровье', 'Счета', 'Покупки', 'Прочее']
};

const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd }) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Еда');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    
    onAdd({
      type,
      amount: parseFloat(amount),
      description,
      category,
      date
    });

    setAmount('');
    setDescription('');
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(CATEGORIES[newType][0]);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6 p-1 bg-slate-100 rounded-xl">
        <button
          type="button"
          onClick={() => handleTypeChange('expense')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${type === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Расход
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('income')}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Доход
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Сумма (₽)</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-lg"
            placeholder="0.00 ₽"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Описание</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="Например: Поход в магазин"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Категория</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              {CATEGORIES[type].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Дата</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>
      <button
        type="submit"
        className={`mt-6 w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform active:scale-[0.98] ${type === 'income' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-100'}`}
      >
        Сохранить запись
      </button>
    </form>
  );
};

export default TransactionForm;
