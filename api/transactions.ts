import { sql } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
    const { method } = req;

    try {
        // Логика GET - загружаем данные из базы
        if (method === 'GET') {
            const { rows } = await sql`SELECT * FROM transactions ORDER BY date DESC`;
            return res.status(200).json(rows);
        }

        // Логика POST - сохраняем данные
        if (method === 'POST') {
            const { id, amount, category, description, date, type } = req.body;
            
            // Сначала проверим/создадим таблицу один раз внутри POST
            await sql`CREATE TABLE IF NOT EXISTS transactions (
                id TEXT PRIMARY KEY, amount FLOAT, category TEXT, description TEXT, date TEXT, type TEXT
            );`;

            await sql`INSERT INTO transactions (id, amount, category, description, date, type)
                      VALUES (${id}, ${amount}, ${category}, ${description}, ${date}, ${type})
                      ON CONFLICT (id) DO NOTHING;`;
            
            return res.status(201).json({ message: 'Success' });
        }

        // Логика DELETE
        if (method === 'DELETE') {
            const { id } = req.query;
            await sql`DELETE FROM transactions WHERE id = ${id}`;
            return res.status(200).json({ message: 'Deleted' });
        }

        return res.status(405).end();
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
