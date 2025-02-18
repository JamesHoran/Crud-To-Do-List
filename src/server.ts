import express, { Express, Request, Response } from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

interface DbKeys {
  host: string,
  user: string,
  password: string,
  database: string,
  port: number,
}

const dbKeys = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
};

app.use(cors());
app.use(express.json());

const db = mysql.createPool(dbKeys);

interface Task extends RowDataPacket {
  id: number;
  name: string;
}

async function getTasks(): Promise<Task[]> {
  const [rows] = await db.execute('SELECT * FROM myTable') as [Task[], any];
  return rows;
}

async function addTask(value: string): Promise<ResultSetHeader> {
  const [result] = await db.execute('INSERT INTO myTable (name) VALUES (?)', [value]) as [ResultSetHeader, any];
  return result;
}

async function deleteTask(id: number): Promise<ResultSetHeader> {
  const [result] = await db.execute('DELETE FROM myTable WHERE id = ?', [id]) as [ResultSetHeader, any];
  return result;
}

async function editTask(id: number, newName: string): Promise<ResultSetHeader> {
  const [result] = await db.execute('UPDATE myTable SET name = ? WHERE id = ?', [newName, id]) as [ResultSetHeader, any];
  return result;
}

app.get('/api/getTasks', async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await getTasks();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error"});
  }
});

app.post('/api/postTask', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: "Name is required" });
    }

    const [result] = await db.execute<ResultSetHeader>(
      'INSERT INTO myTable (name) VALUES (?)',
      [name]
    );

    res.json({ message: 'Task added successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete('/api/deleteTask/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID' });
    }
    const result = await deleteTask(id);
    res.json({ message: 'Task deleted successfully', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.patch('/api/editTask', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, name } = req.body;
    if (!id || !name) {
      res.status(400).json({ error: 'ID and name are required' });
    }
    const result = await editTask(id, name);
    res.json({ message: 'Task edited successfully', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log('Server started successfully');
});
