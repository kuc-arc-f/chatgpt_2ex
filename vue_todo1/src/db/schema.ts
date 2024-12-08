//import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { int, sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  completed: integer("completed").notNull().default(0), // 0: 未完了, 1: 完了
});
// 


