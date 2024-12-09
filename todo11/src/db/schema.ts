//import { int, sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
//import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  completed: integer('completed', { mode: 'boolean' }).default(false),
});

export type Todo = typeof todos.$inferSelect; // select type
export type NewTodo = typeof todos.$inferInsert; // insert type


