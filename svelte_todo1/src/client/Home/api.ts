//const API_BASE = 'http://localhost:3000/api';
const API_BASE = '/api';

export const api = {
  async getAllTodos(search?: string) {
    const queryParams = search ? `?search=${encodeURIComponent(search)}` : '';
    const response = await fetch(`${API_BASE}/todos${queryParams}`);
    return response.json();
  },

  async createTodo(todo: Todo) {
    const response = await fetch(`${API_BASE}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo)
    });
    return response.json();
  },

  async updateTodo(id: number, todo: Todo) {
    const response = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo)
    });
    return response.json();
  },

  async deleteTodo(id: number) {
    const response = await fetch(`${API_BASE}/todos/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};
