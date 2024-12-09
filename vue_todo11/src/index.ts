
import express from 'express';
import { renderToString } from 'vue/server-renderer'
import { createSSRApp } from 'vue'
const app = express();
import 'dotenv/config'
import { eq, like } from 'drizzle-orm';
import { todos } from './db/schema'; 
import { drizzle } from 'drizzle-orm/libsql';
const db = drizzle(process.env.DB_FILE_NAME!);


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

// TODO一覧取得
app.get('/api/todos', async (req, res) => {
  try {
    const query = req.query.q;
    let result;

    if (query) {
      // 検索クエリがある場合、あいまい検索を実行
      result = await db
        .select()
        .from(todos)
        .where(like(todos.title, `%${query}%`));
    } else {
      // 検索クエリがない場合、すべてのTODOを取得
      result = await db.select().from(todos).all();
    }
console.log(result);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// TODO追加
app.post('/api/todos', async (req, res) => {
  try {
    const { title, description } = req.body;
    const result = await db
      .insert(todos)
      .values({ title, description })
      .returning();
    res.status(201).json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// TODO詳細取得
app.get('/api/todos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await db.select().from(todos).where(eq(todos.id, id)).all();

    if (result.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// TODO更新
app.put('/api/todos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description, completed } = req.body;
    const result = await db
      .update(todos)
      .set({ title, description, completed: completed ? 1 : 0 })
      .where(eq(todos.id, id))
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// TODO削除
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await db.delete(todos).where(eq(todos.id, id)).returning();

    if (result.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
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
