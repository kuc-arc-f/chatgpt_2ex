import fs from 'node:fs/promises'
import express from "express";
import { z } from 'zod';
import { eq, like } from 'drizzle-orm';
import { todos } from './db/schema';

import { drizzle } from 'drizzle-orm/libsql';
const drizzleDb = drizzle(process.env.DB_FILE_NAME!);

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

const TodoSchema = z.object({
  content: z.string().min(1, { message: "Todo content cannot be empty" }),
});

// すべてのTODOを取得
app.get("/api/todos", async (req, res) => {
  try {
    const results = await drizzleDb.select().from(todos);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TODOを検索
app.get("/api/todos/search", async (req, res) => {
  const { query } = req.query;
  try {
    const results = await drizzleDb
      .select()
      .from(todos)
      .where(todos.title.like(`%${query}%`));
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TODOを追加
app.post("/api/todos", async (req, res) => {
  const { title, description } = req.body;
  try {
    const result = await drizzleDb.insert(todos).values({ title, description });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TODOを更新
app.put("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  try {
    const result = await drizzleDb
      .update(todos)
      .set({ title, description, completed })
      .where(eq(todos.id, Number(id)));
    res.json(result);
    //.where(todos.id.eq(Number(id)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TODOを削除
app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    //const result = await drizzleDb.delete(todos).where(todos.id.eq(Number(id)));
    const result = await drizzleDb.delete(todos).where(eq(todos.id, Number(id)));
    //.where(eq(todos.id, Number(id)))
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});
const errorObj = {ret: "NG", messase: "Error"};

app.get("/*", (req, res) => {
  res.send(renderToString(Top()));
});
//start
const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
  