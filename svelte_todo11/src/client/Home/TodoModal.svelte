<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { todoSchema, type Todo } from './types';
  import { formatZodError } from './utils';
  import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api';

  export let isOpen: boolean;
  export let todo: Todo = { title: '', description: '' };

  const dispatch = createEventDispatcher();
  let errors: string | null = null;

  const closeModal = () => {
    isOpen = false;
    errors = null;
  };

  const handleSubmit = async () => {
console.log("#handleSubmit");
    const result = todoSchema.safeParse(todo);
    if (!result.success) {
      errors = formatZodError(result.error);
      return;
    }
    if(!todo.id){
      console.log(todo);
      const newTodo = await createTodo(todo);
      //console.log(newTodo);
    }else{
      const updatedTodo = await updateTodo(todo);
    }
    location.reload();
    //dispatch('save', result.data);
    closeModal();
  };
</script>

{#if isOpen}
  <div class="fixed inset-0 z-10 overflow-y-auto">
    <div
      class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75" />
      </div>

      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
      >​</span
      >

      <div
        class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <form on:submit|preventDefault={handleSubmit}>
          <div class="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  class="text-lg font-medium leading-6 text-gray-900"
                  id="modal-title"
                >
                  {todo.id ? 'TODO の編集' : 'TODO の追加'}
                </h3>
                {#if errors}
                  <div class="mt-2 text-red-500">
                    {errors}
                  </div>
                {/if}
                <div class="mt-2">
                  <label
                    for="title"
                    class="block text-sm font-medium text-gray-700"
                    >タイトル</label
                  >
                  <input
                    type="text"
                    id="title"
                    class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    bind:value={todo.title}
                  />
                </div>
                <div class="mt-2">
                  <label
                    for="description"
                    class="block text-sm font-medium text-gray-700"
                    >説明 (任意)</label
                  >
                  <textarea
                    id="description"
                    class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    bind:value={todo.description}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            class="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse"
          >
            <button
              type="submit"
              class="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >保存</button
            >
            <button
              type="button"
              class="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              on:click={closeModal}
              >キャンセル</button
            >
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
