import type { Todo } from './types';

//const API_BASE_URL = 'http://localhost:3000/api/todos';
const API_BASE_URL = '/api/todos';

export const fetchTodos = async (query: string = ''): Promise<Todo[]> => {
  const response = await fetch(`${API_BASE_URL}?q=${query}`);
  if (!response.ok) {
    throw new Error('TODO の取得に失敗しました');
  }
  return await response.json();
};

export const createTodo = async (todo: Todo): Promise<Todo> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });
  if (!response.ok) {
    throw new Error('TODO の追加に失敗しました');
  }
  return await response.json();
};

export const updateTodo = async (todo: Todo): Promise<Todo> => {
  const response = await fetch(`${API_BASE_URL}/${todo.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });
  if (!response.ok) {
    throw new Error('TODO の更新に失敗しました');
  }
  return await response.json();
};

export const deleteTodo = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('TODO の削除に失敗しました');
  }
};