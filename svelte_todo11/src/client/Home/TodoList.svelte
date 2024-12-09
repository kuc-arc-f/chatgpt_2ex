<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api';
  import type { Todo } from './types';
  import TodoModal from './TodoModal.svelte';
  import SearchBar from './SearchBar.svelte';

  let todos: Todo[] = [];
  let loading = true;
  let error: string | null = null;
  let showModal = false;
  let selectedTodo: Todo | null = null;

  const dispatch = createEventDispatcher();

  const loadTodos = async (query: string = '') => {
    loading = true;
    error = null;
    try {
      todos = await fetchTodos(query);
    } catch (err) {
      if (err instanceof Error) {
        error = err.message;
      }
    } finally {
      loading = false;
    }
  };

  const handleAdd = () => {
    selectedTodo = { title: '', description: '' };
    showModal = true;
  };

  const handleEdit = (todo: Todo) => {
    selectedTodo = { ...todo };
    showModal = true;
  };

  const handleDelete = async (id: number) => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }
    try {
      await deleteTodo(id);
      todos = todos.filter((todo) => todo.id !== id);
    } catch (err) {
      if (err instanceof Error) {
        error = err.message;
      }
    }
  };

  const handleModalSave = async (todo: Todo) => {
    try {
console.log(todo);
      if (todo.id) {
        const updatedTodo = await updateTodo(todo);
        todos = todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t));
      } else {
        const newTodo = await createTodo(todo);
        todos = [...todos, newTodo];
      }
    } catch (err) {
      if (err instanceof Error) {
        error = err.message;
      }
    }
  };

  const handleSearch = (event: CustomEvent<string>) => {
    loadTodos(event.detail);
  };

  loadTodos();
</script>

<SearchBar on:search={handleSearch} />

<button
  class="px-4 py-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-600"
  on:click={handleAdd}
>
  TODO を追加
</button>

{#if loading}
  <p>読み込み中...</p>
{:else if error}
  <p class="text-red-500">{error}</p>
{:else if todos.length === 0}
  <p>TODO がありません</p>
{:else}
  <ul class="space-y-2">
    {#each todos as todo (todo.id)}
      <li class="p-4 border border-gray-200 rounded-md">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold">{todo.title}</h3>
            {#if todo.description}
              <p class="text-gray-600">{todo.description}</p>
            {/if}
          </div>
          <div>
            <button
              class="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
              on:click={() => handleEdit(todo)}
            >
              編集
            </button>
            <button
              class="px-3 py-1 ml-2 text-white bg-red-500 rounded hover:bg-red-600"
              on:click={() => handleDelete(todo.id)}
            >
              削除
            </button>
          </div>
        </div>
      </li>
    {/each}
  </ul>
{/if}

<TodoModal
  isOpen={showModal}
  todo={selectedTodo}
  on:save={handleModalSave}
  on:close={() => (showModal = false)}
/>