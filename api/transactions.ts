
import { sql } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
  // 1. Создаем таблицу, если её нет (упрощенный сетап)
  await sql`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      amount FLOAT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      type TEXT NOT NULL
    );
  `;

  const { method } = req;

  try {
    if (method === 'GET') {
      const { rows } = await sql`SELECT * FROM transactions ORDER BY date DESC`;
      return res.status(200).json(rows);
    }

    if (method === 'POST') {
      const { id, amount, category, description, date, type } = req.body;
      await sql`
        INSERT INTO transactions (id, amount, category, description, date, type)
        VALUES (${id}, ${amount}, ${category}, ${description}, ${date}, ${type})
      `;
      return res.status(201).json({ message: 'Saved' });
    }

    if (method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM transactions WHERE id = ${id}`;
      return res.status(200).json({ message: 'Deleted' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}