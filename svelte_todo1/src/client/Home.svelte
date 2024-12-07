<script>
  import { onMount } from "svelte";
  import { z } from "zod";
  import { writable } from "svelte/store";

  // データ管理
  let todos = writable([]);
  let title = "";
  let description = "";
  let search = "";
  let dialogOpen = false;
  let dialogCreateOpen = false;
  let editTodo = null;

  // バリデーション用スキーマ
  const todoSchema = z.object({
    title: z.string().nonempty("Title is required"),
  });

  // エラー管理
  let errors = {};

  // API の操作
  async function fetchTodos() {
    const res = await fetch(`/todos?search=${search}`);
    todos.set(await res.json());
  }

  async function createTodo() {
    const validation = todoSchema.safeParse({ title });
    if (!validation.success) {
      errors = validation.error.flatten().fieldErrors;
      return;
    }

    const res = await fetch("/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    if (res.ok) {
      await fetchTodos();
      resetForm();
      dialogCreateOpen = false;
    }
  }

  async function updateTodo() {
    const validation = todoSchema.safeParse({ title: editTodo.title });
    if (!validation.success) {
      errors = validation.error.flatten().fieldErrors;
      return;
    }

    const res = await fetch(`/todos/${editTodo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editTodo),
    });
    if (res.ok) {
      await fetchTodos();
      dialogOpen = false;
      editTodo = null;
    }
  }

  async function deleteTodo(id) {
    if (confirm("Are you sure you want to delete this TODO?")) {
      await fetch(`/todos/${id}`, { method: "DELETE" });
      await fetchTodos();
    }
  }

  function resetForm() {
    title = "";
    description = "";
    errors = {};
  }

  onMount(fetchTodos);
</script>

<main class="p-4 max-w-4xl mx-auto">
  <h1 class="text-2xl font-bold mb-4">TODO App</h1>

  <!-- 検索 -->
  <input
    type="text"
    placeholder="Search TODOs..."
    bind:value={search}
    on:input={fetchTodos}
    class="mb-4 p-2 border border-gray-300 rounded w-full"
  />
  <button
  on:click={() => {
    dialogCreateOpen = true;
  }}
  class="text-blue-500"
  >
  [ New Item ]
   </button>
  {#if dialogCreateOpen}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-4 rounded shadow-lg max-w-md w-full">
        <h2 class="text-xl font-bold mb-4">Add TODO</h2>
        <form on:submit|preventDefault={createTodo} class="mb-6">
          <div class="mb-2">
            <label class="block font-medium">Title</label>
            <input
              type="text"
              bind:value={title}
              class="p-2 border border-gray-300 rounded w-full"
            />
            {#if errors.title}
              <p class="text-red-500 text-sm">{errors.title}</p>
            {/if}
          </div>
          <div class="mb-2">
            <label class="block font-medium">Description</label>
            <textarea
              bind:value={description}
              class="p-2 border border-gray-300 rounded w-full"
            ></textarea>
          </div>
          <button
          on:click={() => {
            dialogCreateOpen = false;
            editTodo = null;
          }}
          class="text-gray-500 mx-2"
        >
          Cancel
        </button>
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add TODO
          </button>
        </form>
      </div>
    </div>
  {/if}

  <!-- TODO フォーム -->

  <!-- TODO リスト -->
  <ul>
    {#each $todos as todo}
      <li class="border-b py-2 flex justify-between items-center">
        <div>
          <h3 class="font-bold">{todo.title}</h3>
          <p class="text-sm">{todo.description}</p>
        </div>
        <div class="space-x-2">
          <button
            on:click={() => {
              editTodo = { ...todo };
              dialogOpen = true;
            }}
            class="text-blue-500"
          >
            Edit
          </button>
          <button on:click={() => deleteTodo(todo.id)} class="text-red-500">
            Delete
          </button>
        </div>
      </li>
    {/each}
  </ul>

  <!-- ダイアログ -->
  dialogOpen:  {dialogOpen}
  {#if dialogOpen}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-4 rounded shadow-lg max-w-md w-full">
        <h2 class="text-xl font-bold mb-4">Edit TODO</h2>
        <div class="mb-2">
          <label class="block font-medium">Title</label>
          <input
            type="text"
            bind:value={editTodo.title}
            class="p-2 border border-gray-300 rounded w-full"
          />
          {#if errors.title}
            <p class="text-red-500 text-sm">{errors.title}</p>
          {/if}
        </div>
        <div class="mb-2">
          <label class="block font-medium">Description</label>
          <textarea
            bind:value={editTodo.description}
            class="p-2 border border-gray-300 rounded w-full"
          ></textarea>
        </div>
        <div class="flex justify-end space-x-2">
          <button
            on:click={() => {
              dialogOpen = false;
              editTodo = null;
            }}
            class="text-gray-500"
          >
            Cancel
          </button>
          <button
            on:click={updateTodo}
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  {/if}
</main>
  