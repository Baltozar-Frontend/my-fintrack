
import { sql } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS user_profile (
      key TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      bio TEXT
    );
  `;

  const { method } = req;

  try {
    if (method === 'GET') {
      const { rows } = await sql`SELECT name, bio FROM user_profile WHERE key = 'main'`;
      if (rows.length === 0) return res.status(200).json({ name: 'Гость', bio: '' });
      return res.status(200).json(rows[0]);
    }

    if (method === 'PUT') {
      const { name, bio } = req.body;
      await sql`
        INSERT INTO user_profile (key, name, bio)
        VALUES ('main', ${name}, ${bio})
        ON CONFLICT (key) DO UPDATE SET name = ${name}, bio = ${bio}
      `;
      return res.status(200).json({ message: 'Updated' });
    }

    res.status(405).end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
