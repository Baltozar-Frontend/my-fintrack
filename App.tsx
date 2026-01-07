
import React, { useState, useEffect, useMemo } from 'react';
import TransactionForm from './components/TransactionForm';
import FinancialSummary from './components/FinancialSummary';
import FinancialCharts from './components/ExpenseCharts';
import ReportsView from './components/ReportsView';
import { Transaction, UserProfile } from './types';

type AppView = 'dashboard' | 'reports';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fintrack_profile');
    return saved ? JSON.parse(saved) : { name: 'Гость', bio: 'Мой финансовый путь' };
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('fintrack_pro_v2_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  useEffect(() => {
    localStorage.setItem('fintrack_pro_v2_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fintrack_profile', JSON.stringify(profile));
  }, [profile]);

  const addTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions([transaction, ...transactions]);
  };

  const removeTransaction = (id: string) => {
    if (window.confirm('Удалить эту операцию?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(val);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesFilter = filter === 'all' || t.type === filter;
      const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [transactions, filter, searchQuery]);

  // Безопасное получение первой буквы для аватара, чтобы избежать ошибки при пустой строке
  const avatarLetter = (profile.name && profile.name.length > 0) 
    ? profile.name[0].toUpperCase() 
    : 'Г';

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 selection:bg-indigo-100 selection:text-indigo-700 font-['Inter']">
      {/* Navbar */}
      <nav className="bg-white/70 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 rotate-3 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">FinTrack <span className="text-indigo-600">Pro</span></h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Умное управление деньгами</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
            <button 
              onClick={() => setActiveView('dashboard')}
              className={`px-5 py-2 rounded-xl text-sm font-black transition-all ${activeView === 'dashboard' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Дашборд
            </button>
            <button 
              onClick={() => setActiveView('reports')}
              className={`px-5 py-2 rounded-xl text-sm font-black transition-all ${activeView === 'reports' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Отчеты
            </button>
          </div>

          <button 
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-3 group hover:bg-slate-50 p-2 rounded-2xl transition-all"
          >
             <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900 leading-none group-hover:text-indigo-600 transition-colors">{profile.name || 'Гость'}</p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter mt-1">Премиум</p>
             </div>
             <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 border-2 border-white shadow-md flex items-center justify-center text-white font-bold">
               {avatarLetter}
             </div>
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {activeView === 'dashboard' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-left-4 duration-500">
            {/* Left Column */}
            <div className="lg:col-span-4 space-y-8">
              <section>
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Новая операция</h2>
                <TransactionForm onAdd={addTransaction} />
              </section>
              
              <section>
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Твой статус</h2>
                <FinancialSummary transactions={transactions} />
              </section>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-8 space-y-10">
              <section>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Активность</h2>
                    <p className="text-sm text-slate-400 font-medium">Ваши потоки в реальном времени</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Поиск..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-48 shadow-sm"
                      />
                      <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </div>

                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                      {(['all', 'income', 'expense'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setFilter(type)}
                          className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all capitalize ${filter === type ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                          {type === 'all' ? 'Все' : type === 'income' ? 'Доходы' : 'Расходы'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto custom-scrollbar">
                    {filteredTransactions.length === 0 ? (
                      <div className="py-20 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>
                        </div>
                        <p className="text-slate-400 font-medium">Ничего не найдено</p>
                      </div>
                    ) : (
                      filteredTransactions.map(tx => (
                        <div key={tx.id} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group">
                          <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              {(tx.category && tx.category.length > 0) ? tx.category[0] : '•'}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors">{tx.description}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                  {tx.category}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="text-xs text-slate-400 font-bold">{tx.date}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <p className={`text-xl font-black ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                              {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                            </p>
                            <button 
                              onClick={() => removeTransaction(tx.id)}
                              className="p-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 ml-1">Аналитика</h2>
                <FinancialCharts transactions={transactions} />
              </section>
            </div>
          </div>
        ) : (
          <ReportsView transactions={transactions} />
        )}
      </main>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
            
            <button 
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            <h3 className="text-2xl font-black text-slate-900 mb-2">Личный кабинет</h3>
            <p className="text-sm text-slate-500 font-medium mb-8">Настройте свой профиль FinTrack</p>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Ваше имя</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-800"
                  placeholder="Как вас зовут?"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Статус / Био</label>
                <textarea 
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-600 resize-none"
                  placeholder="Ваша финансовая цель или девиз"
                />
              </div>
            </div>

            <button 
              onClick={() => setIsProfileModalOpen(false)}
              className="w-full mt-10 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all transform active:scale-[0.98]"
            >
              Сохранить и закрыть
            </button>
          </div>
        </div>
      )}

      <footer className="fixed bottom-0 left-0 right-0 bg-white/50 backdrop-blur-xl border-t border-slate-100 py-4 px-6 flex items-center justify-between">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">FinTrack Pro &copy; 2025</p>
        <div className="hidden sm:flex items-center gap-4">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Безопасное соединение</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
