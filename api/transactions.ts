import { sql } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
  const { method } = req;
  try {
    // Выполняем ОДИН четкий запрос на создание таблицы без лишних пробелов
    await sql`CREATE TABLE IF NOT EXISTS transactions (id TEXT PRIMARY KEY, amount FLOAT, category TEXT, description TEXT, date TEXT, type TEXT);`;

    if (method === 'GET') {
      const { rows } = await sql`SELECT * FROM transactions ORDER BY date DESC`;
      return res.status(200).json(rows);
    }

    if (method === 'POST') {
      const { id, amount, category, description, date, type } = req.body;
      // Вставляем данные. Используем упрощенный синтаксис для надежности
      await sql`INSERT INTO transactions (id, amount, category, description, date, type) VALUES (${id}, ${amount}, ${category}, ${description}, ${date}, ${type}) ON CONFLICT (id) DO UPDATE SET amount = EXCLUDED.amount;`;
      return res.status(201).json({ message: 'Saved' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Full Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
