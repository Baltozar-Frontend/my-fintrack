
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string;
  type: TransactionType;
}

export type Category = 
  | 'Зарплата'
  | 'Инвестиции'
  | 'Еда' 
  | 'Транспорт' 
  | 'Развлечения' 
  | 'Здоровье' 
  | 'Счета' 
  | 'Покупки' 
  | 'Прочее';

export interface UserProfile {
  name: string;
  bio: string;
}
