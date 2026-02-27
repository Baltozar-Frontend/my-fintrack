if (method === 'POST') {
      const { id, amount, category, description, date, type } = req.body;
      
      // Выполняем создание таблицы отдельным запросом
      await sql`CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        amount FLOAT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        type TEXT NOT NULL
      );`;

      // Теперь вставляем данные (убери лишние пробелы в VALUES)
      await sql`INSERT INTO transactions (id, amount, category, description, date, type) 
                VALUES (${id}, ${amount}, ${category}, ${description}, ${date}, ${type})`;
      
      return res.status(201).json({ message: 'Saved' });
    }
