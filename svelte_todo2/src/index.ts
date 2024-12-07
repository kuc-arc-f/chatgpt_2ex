
import express from 'express';
const app = express();
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { eq, like } from 'drizzle-orm';
import { sql } from "drizzle-orm";
import { todos } from './db/schema';
//const db = drizzle(process.env.DB_FILE_NAME!);
const drizzleDb = drizzle(process.env.DB_FILE_NAME!);
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
// TODO 取得 (全件、または検索条件付き)
app.get("/api/todos", async (req, res) => {
  const { search } = req.query;
  let query = drizzleDb.select().from(todos);

  if (search) {
    query = query.where((row) =>
      row.title.like(`%${search}%`).or(row.content.like(`%${search}%`))
    );
  }

  const result = await query.all();
  console.log(result);
  res.json(result);
});

// TODO 追加
app.post("/api/todos", async (req, res) => {
  //console.log(req.body);
const {
  title,
  content,
  public: isPublic,
  food_orange,
  food_apple,
  food_banana,
  pub_date,
  qty1,
  qty2,
  qty3,
} = req.body;

//return res.status(500).json({ data: req.body });
/*
*/  
const target = {
  title,
  content,
  public: isPublic,
  food_orange,
  food_apple,
  food_banana,
  pub_date: pub_date || null,
  qty1,
  qty2,
  qty3,
};
console.log(target);
//return res.status(500).json({ data: req.body });
  const body = req.body;
  const pub_dateValue = "";
  if(pub_date) {pub_dateValue = pub_date};

  //pub_date: pub_date || null,
  const result = await drizzleDb.insert(todos).values({
    title,
    content,
    public: isPublic,
    food_orange,
    food_apple,
    food_banana,
    pub_date: pub_dateValue,
    qty1,
    qty2,
    qty3,
  });

  res.status(201).json({ id: result.lastInsertRowId });
});

// TODO 編集
app.put("/api/todos/:id", async (req, res) => {
  try{  
    const { id } = req.params;
    const {
      title,
      content,
      public: isPublic,
      food_orange,
      food_apple,
      food_banana,
      pub_date,
      qty1,
      qty2,
      qty3,
    } = req.body;
  
    await drizzleDb
      .update(todos)
      .set({
        title,
        content,
        public: isPublic,
        food_orange,
        food_apple,
        food_banana,
        pub_date: pub_date || null,
        qty1,
        qty2,
        qty3,
      })
      .where(eq(todos.id, parseInt(id)));
      //.where((row) => row.id.eq(id));
  
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// TODO 削除
app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  //await drizzleDb.delete(todos).where((row) => row.id.eq(id));
  const result = await drizzleDb
  .delete(todos)
  .where(eq(todos.id, parseInt(req.params.id)));

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
