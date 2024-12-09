import axios from 'axios';
import type { Todo } from '@/types';

//const API_BASE_URL = 'http://localhost:3000/api'; // バックエンドのURL
const API_BASE_URL = '/api'; // バックエンドのURL

export const api = {
  async getTodos(query?: string): Promise<Todo[]> {
    const url = query ? `${API_BASE_URL}/todos?q=${query}` : `${API_BASE_URL}/todos`;
    const response = await axios.get<Todo[]>(url);
    return response.data;
  },
  async addTodo(todo: Partial<Todo>): Promise<Todo> {
    const response = await axios.post<Todo>(`${API_BASE_URL}/todos`, todo);
    return response.data;
  },
  async getTodo(id: number): Promise<Todo> {
    const response = await axios.get<Todo>(`${API_BASE_URL}/todos/${id}`);
    return response.data;
  },
  async updateTodo(id: number, todo: Partial<Todo>): Promise<Todo> {
    const response = await axios.put<Todo>(`${API_BASE_URL}/todos/${id}`, todo);
    return response.data;
  },
  async deleteTodo(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/todos/${id}`);
  },
};
