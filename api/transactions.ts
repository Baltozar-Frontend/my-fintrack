import { sql } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const { rows } = await sql`SELECT * FROM transactions ORDER BY date DESC`;
      return res.status(200).json(rows);
    }
    if (req.method === 'POST') {
      const { id, amount, category, description, date, type } = req.body;
      await sql`INSERT INTO transactions (id, amount, category, description, date, type) VALUES (${id}, ${amount}, ${category}, ${description}, ${date}, ${type})`;
      return res.status(201).json({ success: true });
    }
    return res.status(405).end();
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
