import { z } from 'zod';

export const todoSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, { message: 'タイトルは必須です' }),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

export type Todo = z.infer<typeof todoSchema>;
