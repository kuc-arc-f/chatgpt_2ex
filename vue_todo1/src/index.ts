
import express from 'express';
import { renderToString } from 'vue/server-renderer'
import { createSSRApp } from 'vue'
const app = express();
import 'dotenv/config'
import { eq, like } from 'drizzle-orm';
import { todos } from './db/schema'; 
import { drizzle } from 'drizzle-orm/libsql';
const drizzleDb = drizzle(process.env.DB_FILE_NAME!);


//
import App from './pages/App.vue'
//
import commonRouter from './routes/commonRouter';
//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
console.log("env=", process.env.NODE_ENV)
//console.log("EXTERNAL_API_URL=", process.env.EXTERNAL_API_URL)
//
const errorObj = {ret: "NG", messase: "Error"};
// route
app.use('/api/common', commonRouter);
//app.use("/api/todos", todoRoutes);


// TODO: 一覧取得 (検索対応)
app.get("/api/todos", async (req, res) => {
  const searchQuery = req.query.search as string | undefined;
  try {
    /*
    const results = await drizzleDb.select(todos).where(
      searchQuery
        ? `title LIKE '%${searchQuery}%' OR description LIKE '%${searchQuery}%'`
        : undefined
    );
    */
    let query = drizzleDb.select().from(todos);
    const allTodos = await query.all();

    //res.json(results);
    res.json(allTodos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos." });
  }
});

// TODO: 追加
app.post("/api/todos", async (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required." });
  }
  try {
    const newTodo = await drizzleDb.insert(todos).values({ title, description });
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed to add todo." });
  }
});

// TODO: 編集
app.put("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  try {
    await drizzleDb
      .update(todos)
      .set({ title, description, completed })
      .where(`id = ${id}`);
    res.json({ message: "Todo updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to update todo." });
  }
});

// TODO: 削除
app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    console.log("id=", id);
    //await drizzleDb.delete(todos).where(`id = ${id}`);
    await drizzleDb
    .delete(todos)
    .where(eq(todos.id, parseInt(id)))
    .run();
    res.json({ message: "Todo deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo." });
  }
});

//SPA
app.get('/*', async (req: any, res: any) => {
  const app = createSSRApp(App)
  const html = await renderToString(app, {})
  try { res.send(html); } catch (error) { res.sendStatus(500); }
});


//start
const PORT = 3000;
app.listen({ port: PORT }, () => {
  console.log(`Server ready at http://localhost:${PORT}`);
});
console.log('start');
