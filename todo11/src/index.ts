import fs from 'node:fs/promises'
import express from "express";
import { z } from 'zod';
import { eq, like } from 'drizzle-orm';
//import { todos } from './db/schema';
import { todos, NewTodo, Todo } from './db/schema';

import { drizzle } from 'drizzle-orm/libsql';
const db = drizzle(process.env.DB_FILE_NAME!);

import { renderToString } from 'react-dom/server';
import cookieParser from "cookie-parser";
import session from "express-session";

import Top from './pages/App';
import About from './pages/about';
//
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
console.log("env= ", process.env.NODE_ENV);
//
// TODO 一覧取得
app.get('/api/todos', async (req: Request, res: Response) => {
  try {
    const allTodos: Todo[] = await db.select().from(todos);
    res.json(allTodos);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// TODO 検索
app.get('/api/todos/search', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).send('Query parameter "q" is required.');
    }
    const foundTodos: Todo[] = await db
      .select()
      .from(todos)
      .where(like(todos.title, `%${query}%`));
console.log(foundTodos);
    res.json(foundTodos);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// TODO 追加
app.post('/api/todos', async (req: Request, res: Response) => {
  try {
    const newTodo: NewTodo = req.body;
    const insertedTodo = await db.insert(todos).values(newTodo).returning();
    res.json(insertedTodo[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// TODO 更新
app.put('/api/todos/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updatedTodo: NewTodo = req.body;
    const result = await db
      .update(todos)
      .set(updatedTodo)
      .where(eq(todos.id, id))
      .returning();
    if (result.length === 0) {
      return res.status(404).send('Todo not found');
    }
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// TODO 削除
app.delete('/api/todos/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const result = await db.delete(todos).where(eq(todos.id, id)).returning();
    if (result.length === 0) {
      return res.status(404).send('Todo not found');
    }
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
const errorObj = {ret: "NG", messase: "Error"};

//SPA
app.get("/*", (req, res) => {
  res.send(renderToString(Top()));
});
//start
const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
  