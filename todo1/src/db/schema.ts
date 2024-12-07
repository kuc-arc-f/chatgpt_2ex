import { int, sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  completed: integer("completed").notNull().default(0), // 0: false, 1: true
});

/*
{
  id: integer("id").primaryKey().autoIncrement(),
  title: text("title").notNull(),
  description: text("description"),
  completed: integer("completed").notNull().default(0), // 0: false, 1: true
}
*/

