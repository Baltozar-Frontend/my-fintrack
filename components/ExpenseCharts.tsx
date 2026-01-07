
import React, { useState, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar
} from 'recharts';
import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

type PeriodType = 'дни' | 'недели' | 'месяцы';

const FinancialCharts: React.FC<Props> = ({ transactions }) => {
  const [period, setPeriod] = useState<PeriodType>('дни');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(val);
  };

  // Категории для круговой диаграммы (только расходы)
  const categoryData = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((acc: any[], curr) => {
        const existing = acc.find(item => item.name === curr.category);
        if (existing) {
          existing.value += curr.amount;
        } else {
          acc.push({ name: curr.category, value: curr.amount });
        }
        return acc;
      }, []);
  }, [transactions]);

  // Группировка данных для столбчатой диаграммы по периодам
  const periodicData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const dataMap: Record<string, number> = {};

    expenses.forEach(t => {
      const date = new Date(t.date);
      let key = '';

      if (period === 'дни') {
        key = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
      } else if (period === 'недели') {
        // Простой расчет номера недели в году
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        key = `Неделя ${weekNum}`;
      } else if (period === 'месяцы') {
        key = date.toLocaleDateString('ru-RU', { month: 'long' });
      }

      dataMap[key] = (dataMap[key] || 0) + t.amount;
    });

    return Object.entries(dataMap).map(([label, value]) => ({ label, value }));
  }, [transactions, period]);

  // Динамика баланса (Area Chart)
  const trendData = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .reduce((acc: any[], curr) => {
        const existing = acc.find(item => item.date === curr.date);
        const val = curr.type === 'income' ? curr.amount : -curr.amount;
        if (existing) {
          existing.balance += val;
        } else {
          const lastBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
          acc.push({ date: curr.date, balance: lastBalance + val });
        }
        return acc;
      }, []);
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-slate-300 gap-4 bg-white rounded-3xl border border-dashed border-slate-200">
        <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <p className="font-medium">Добавьте операции для анализа</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Сравнение по периодам */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <span className="w-2 h-6 bg-emerald-500 rounded-full" />
            Расходы по периодам
          </h3>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['дни', 'недели', 'месяцы'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all capitalize ${period === p ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={periodicData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }} 
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                formatter={(val: number) => [formatCurrency(val), 'Расход']}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2">
          <span className="w-2 h-6 bg-indigo-500 rounded-full" />
          Динамика баланса
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }} 
                minTickGap={30}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip 
                formatter={(val: number) => [formatCurrency(val), 'Баланс']}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-800 mb-6">Расходы по категориям</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: number) => [formatCurrency(val), 'Сумма']}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <h3 className="text-lg font-black text-slate-800 mb-6">Топ категорий</h3>
          <div className="space-y-4">
            {categoryData.sort((a, b) => b.value - a.value).slice(0, 5).map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-sm font-bold text-slate-600">{entry.name}</span>
                </div>
                <span className="text-sm font-black text-slate-800">{formatCurrency(entry.value)}</span>
              </div>
            ))}
            {categoryData.length === 0 && <p className="text-slate-400 text-center py-10 italic">Нет расходов</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialCharts;
