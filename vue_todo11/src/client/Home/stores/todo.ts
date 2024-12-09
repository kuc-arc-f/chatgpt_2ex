import { defineStore } from 'pinia';
import { api } from '../api';
import type { Todo } from '../types';

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [] as Todo[],
    filteredTodos: [] as Todo[],
  }),
  actions: {
    async fetchTodos() {
      try {
        const todos = await api.getTodos();
        console.log(todos);
        this.todos = todos;
        this.filteredTodos = todos;
      } catch (error) {
        console.error(error);
      }
    },
    async addTodo(todo: Partial<Todo>) {
      try {
        const newTodo = await api.addTodo(todo);
        this.todos.push(newTodo);
        this.filteredTodos.push(newTodo);
      } catch (error) {
        console.error(error);
      }
    },
    async updateTodo(id: number, todo: Partial<Todo>) {
      try {
        const updatedTodo = await api.updateTodo(id, todo);
        const index = this.todos.findIndex((t) => t.id === id);
        if (index !== -1) {
          this.todos[index] = updatedTodo;
        }
        const filteredIndex = this.filteredTodos.findIndex((t) => t.id === id);
        if (filteredIndex !== -1) {
          this.filteredTodos[filteredIndex] = updatedTodo;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async deleteTodo(id: number) {
      try {
        await api.deleteTodo(id);
        this.todos = this.todos.filter((t) => t.id !== id);
        this.filteredTodos = this.filteredTodos.filter((t) => t.id !== id);
      } catch (error) {
        console.error(error);
      }
    },
    searchTodos(query: string) {
      if (!query) {
        this.filteredTodos = this.todos;
        return;
      }
      this.filteredTodos = this.todos.filter((todo) =>
        todo.title.toLowerCase().includes(query.toLowerCase())
      );
    },
  },
});