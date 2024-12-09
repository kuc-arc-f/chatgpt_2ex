<script lang="ts">
  import { z } from 'zod';
  import { isDialogOpen, editingTodo } from './stores';
  import { todoSchema, type Todo } from './types';
  import { api } from './api';
  
  export let onSave: () => void, mode = "";
console.log("#TodoDialog");
console.log(editingTodo);
console.log("mode=", mode);
  let errors: { [key: string]: string } = {};
  let todo: Todo = editingTodo ? $editingTodo : {
    title: '',
    content: '',
    public: false,
    food_orange: false,
    food_apple: false,
    food_banana: false,
    pub_date: new Date().toISOString().split('T')[0],
    qty1: '',
    qty2: '',
    qty3: ''
  };

  const handleSubmit = async () => {
    try {
      const validatedData = todoSchema.parse(todo);
      if (mode !== "create") {
        await api.updateTodo($editingTodo.id, validatedData);
      } else {
        await api.createTodo(validatedData);
      }
      
      onSave();
      isDialogOpen.set(false);
      errors = {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});
      }
    }
  };
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
  <div class="bg-white p-6 rounded-lg w-full max-w-2xl">
    <h2 class="text-2xl mb-4">{mode !== "create" ? 'TODOを編集' : 'TODOを追加'}</h2>
    
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <div>
        <label class="block mb-1">タイトル *</label>
        <input
          type="text"
          bind:value={todo.title}
          class="w-full border rounded p-2 {errors.title ? 'border-red-500' : ''}"
        />
        {#if errors.title}
          <p class="text-red-500 text-sm mt-1">{errors.title}</p>
        {/if}
      </div>

      <div>
        <label class="block mb-1">内容 *</label>
        <input
          type="text"
          bind:value={todo.content}
          class="w-full border rounded p-2 {errors.content ? 'border-red-500' : ''}"
        />
        {#if errors.content}
          <p class="text-red-500 text-sm mt-1">{errors.content}</p>
        {/if}
      </div>

      <div>
        <label class="block mb-1">公開設定</label>
        <div class="space-x-4">
          <label>
            <input type="radio" bind:group={todo.public} value={true} /> 公開
          </label>
          <label>
            <input type="radio" bind:group={todo.public} value={false} /> 非公開
          </label>
        </div>
      </div>

      <div>
        <label class="block mb-1">食べ物</label>
        <div class="space-x-4">
          <label>
            <input type="checkbox" bind:checked={todo.food_orange} /> オレンジ
          </label>
          <label>
            <input type="checkbox" bind:checked={todo.food_apple} /> りんご
          </label>
          <label>
            <input type="checkbox" bind:checked={todo.food_banana} /> バナナ
          </label>
        </div>
      </div>

      <div>
        <label class="block mb-1">公開日</label>
        <input
          type="date"
          bind:value={todo.pub_date}
          class="border rounded p-2"
        />
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block mb-1">数量1</label>
          <input
            type="text"
            bind:value={todo.qty1}
            class="w-full border rounded p-2"
          />
        </div>
        <div>
          <label class="block mb-1">数量2</label>
          <input
            type="text"
            bind:value={todo.qty2}
            class="w-full border rounded p-2"
          />
        </div>
        <div>
          <label class="block mb-1">数量3</label>
          <input
            type="text"
            bind:value={todo.qty3}
            class="w-full border rounded p-2"
          />
        </div>
      </div>

      <div class="flex justify-end space-x-4">
        <button
          type="button"
          on:click={() => isDialogOpen.set(false)}
          class="px-4 py-2 border rounded"
        >
          キャンセル
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          保存
        </button>
      </div>
    </form>
  </div>
</div>