import { writable } from 'svelte/store';

export const isDialogOpen = writable(false);
export const editingTodo = writable<Todo | null>(null);
export const searchQuery = writable('');