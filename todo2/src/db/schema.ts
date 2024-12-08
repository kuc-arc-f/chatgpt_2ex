import { int, sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  public_type: integer('public_type', { mode: 'boolean' }).notNull().default(0),
  food_orange: integer('food_orange', { mode: 'boolean' }).notNull().default(0),
  food_apple: integer('food_apple', { mode: 'boolean' }).notNull().default(0),
  food_banana: integer('food_banana', { mode: 'boolean' }).notNull().default(0),
  pub_date: text('pub_date').notNull(),
  qty1: text("qty1"),
  qty2: text("qty2"),
  qty3: text("qty3"),
});
/*
export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  completed: integer("completed").notNull().default(0), // 0: false, 1: true
});
*/

