
import express from 'express';
const app = express();
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { eq, like } from 'drizzle-orm';
import { sql } from "drizzle-orm";
import { todos } from './db/schema';
const db = drizzle(process.env.DB_FILE_NAME!);
//
import { htmlSend } from './lib/RenderUtil'
import App from './pages/App.svelte';
//
import commonRouter from './routes/commonRouter';
//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
console.log("env=", process.env.NODE_ENV)
console.log("DB_FILE_NAME=", process.env.DB_FILE_NAME);
//
app.use('/api/common', commonRouter);
// app.use('/api/todos', todoRoutes);
const errorObj = {ret: "NG", messase: "Error"};
// API

// TODO の追加
app.post('/api/todos', async (req, res) => {
  try {
console.log(req.body);
    const { title, description } = req.body;
    const newTodo = await db.insert(todos).values({ title, description }).returning();
    res.status(201).json(newTodo[0]);
  } catch (error) {
    res.status(500).json({ message: 'TODO の追加に失敗しました', error });
  }
});

// TODO の取得 (検索機能付き)
app.get('/api/todos', async (req, res) => {
  try {
    const { q } = req.query;
    let query = db.select().from(todos);

    if (q) {
      query = query.where(like(todos.title, `%${q}%`));
    }

    const allTodos = await query;
    res.json(allTodos);
  } catch (error) {
    res.status(500).json({ message: 'TODO の取得に失敗しました', error });
  }
});
// TODO の更新
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const updatedTodo = await db.update(todos)
      .set({ title, description, completed })
      .where(eq(todos.id, Number(id)))
      .returning();

    if (updatedTodo.length === 0) {
      return res.status(404).json({ message: 'TODO が見つかりません' });
    }

    res.json(updatedTodo[0]);
  } catch (error) {
    res.status(500).json({ message: 'TODO の更新に失敗しました', error });
  }
});

// TODO の削除
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await db.delete(todos).where(eq(todos.id, Number(id))).returning();

    if (deletedTodo.length === 0) {
      return res.status(404).json({ message: 'TODO が見つかりません' });
    }

    res.json({ message: 'TODO を削除しました' });
  } catch (error) {
    res.status(500).json({ message: 'TODO の削除に失敗しました', error });
  }
});
//SPA
app.get('/*', async (req: any, res: any) => {
  try {
    const rendered = await App.render();
    res.send(htmlSend(rendered.html));
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

//start
const PORT = 3000;
app.listen({ port: PORT }, () => {
  console.log(`Server ready at http://localhost:${PORT}`);
});
console.log('start');
