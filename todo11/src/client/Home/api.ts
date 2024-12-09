import axios from 'axios';
//import { Todo } from '../types';
import { Todo } from './scheme';
//scheme

//const API_URL = 'http://localhost:3000/api/todos'; // バックエンドの URL
const API_URL = '/api/todos'; // バックエンドの URL

export const getTodos = async (): Promise<Todo[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const searchTodos = async (query: string): Promise<Todo[]> => {
  const response = await axios.get(`${API_URL}/search?q=${query}`);
  return response.data;
};

export const addTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  const response = await axios.post(API_URL, todo);
  return response.data;
};

export const updateTodo = async (todo: Todo): Promise<Todo> => {
  const response = await axios.put(`${API_URL}/${todo.id}`, todo);
  return response.data;
};

export const deleteTodo = async (id: number): Promise<Todo> => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};