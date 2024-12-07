
import express from 'express';
const app = express();
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { eq, like } from 'drizzle-orm';
import { sql } from "drizzle-orm";
import { todos } from './db/schema';
const db = drizzle(process.env.DB_FILE_NAME!);
//const db = drizzle(process.env.DB_FILE_NAME!);
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

const errorObj = {ret: "NG", messase: "Error"};
// API
// TODOの取得
app.get("/todos", async (req, res) => {
  const search = req.query.search || "";
  const todos = await db.all(
    sql`SELECT * FROM todos WHERE title LIKE ${`%${search}%`}`
  );
  res.json(todos);
});
// TODOの追加
app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  //sql`INSERT INTO todos (title, description) VALUES (${title}, ${description})`
  const cDate = new Date().toISOString();
  const result = await db.run(
    sql`INSERT INTO todos (title, description, created_at) 
    VALUES (${title}, ${description}, ${cDate})`
  );
  res.json({ id: result.lastID, title, description, completed: false });
});

// TODOの編集
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  console.log("id=", id)
  console.log(req.body)
  const { title, description, completed } = req.body;

  const result = await db.run(
    sql`UPDATE todos SET 
        title = ${title}, 
        description = ${description}        
        WHERE id = ${id}`
  );
//completed = ${completed} 
  if (result.changes === 0) {
    return res.status(404).json({ error: "TODO not found" });
  }

  res.json({ id, title, description, completed });
});

// TODOの削除
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;

  const result = await db.run(sql`DELETE FROM todos WHERE id = ${id}`);
  if (result.changes === 0) {
    return res.status(404).json({ error: "TODO not found" });
  }

  res.json({ success: true });
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
