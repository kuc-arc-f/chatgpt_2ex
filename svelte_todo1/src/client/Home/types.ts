import { z } from 'zod';

export const todoSchema = z.object({
  title: z.string().min(1, { message: "タイトルは必須です" }),
  content: z.string().min(1, { message: "内容は必須です" }),
  public: z.boolean(),
  food_orange: z.boolean(),
  food_apple: z.boolean(),
  food_banana: z.boolean(),
  pub_date: z.string(),
  qty1: z.string(),
  qty2: z.string(),
  qty3: z.string()
});

export type Todo = z.infer<typeof todoSchema>;
