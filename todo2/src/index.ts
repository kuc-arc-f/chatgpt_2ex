import fs from 'node:fs/promises'
import express from "express";
import { z } from 'zod';
import { eq, like } from 'drizzle-orm';
import { sql } from "drizzle-orm";
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


// TODO 作成
app.post('/api/todos', async (req, res) => {
  const data = req.body;
  try {
    console.log(data);
    await drizzleDb.insert(todos).values(data).run();
    res.status(201).json({ message: 'TODO created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create TODO', details: err });
  }
});

// TODO 一覧取得
app.get('/api/todos', async (req, res) => {
  try {
console.log("GET /api/todos");
    const items = await drizzleDb.select().from(todos).all();
    console.log(items);
    res.status(200).json(items);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch TODOs', details: err });
  }
});

// TODO 検索
app.get('/api/todos/search', async (req, res) => {
  const { title } = req.query;
  try {
    const todos = await drizzleDb
      .select()
      .from(todos)
      .where(sql`title LIKE '%' || ${title} || '%'`)
      .all();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search TODOs', details: err });
  }
});

// TODO 更新
app.put('/api/todos/:id', async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  console.log(data);
  try {
    await drizzleDb.update(todos).set(data).where(sql`id = ${id}`).run();
    res.status(200).json({ message: 'TODO updated successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to update TODO', details: err });
  }
});

// TODO 削除
app.delete('/api/todos/:id', async (req, res) => {
  const id = req.params.id;
  try {
    //await drizzleDb.delete().from(todos).where(sql`id = ${id}`).run();
    const result = await drizzleDb.delete(todos).where(eq(todos.id, Number(id)));
    res.status(200).json({ message: 'TODO deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to delete TODO', details: err });
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
  