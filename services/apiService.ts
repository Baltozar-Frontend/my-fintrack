// Этот файл помогает Фронтенду общаться с Бэкендом (папкой api)

export const apiService = {
  // Функция для получения всех расходов
  async getTransactions() {
    const response = await fetch('/api/transactions');
    return await response.json();
  },

  // Функция для добавления нового расхода
  async addTransaction(data: any) {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  },

  // Функция для удаления
  async deleteTransaction(id: string) {
    await fetch(`/api/transactions?id=${id}`, {
      method: 'DELETE',
    });
  }
};