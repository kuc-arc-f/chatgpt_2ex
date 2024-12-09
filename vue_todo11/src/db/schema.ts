//import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  completed: integer('completed').default(0), // 0: false, 1: true
  createdAt: text('createdAt').default('CURRENT_TIMESTAMP'),
});



