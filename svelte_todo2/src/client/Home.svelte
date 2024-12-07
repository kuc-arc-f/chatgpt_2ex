<script>
  import { onMount } from "svelte";
  import { z } from "zod";
  //import Modal from "svelte-modal";

  let todos = [];
  let search = "";
  let showDialog = false;
  let editMode = false;
  let currentTodo = null;

  const API_URL = "/api/todos";

  // フォーム初期状態
  let form = {
    title: "",
    content: "",
    public: "false",
    food_orange: false,
    food_apple: false,
    food_banana: false,
    pub_date: "",
    qty1: "",
    qty2: "",
    qty3: "",
  };

  // バリデーションスキーマ
  const schema = z.object({
    title: z.string().min(1, { message: "タイトルを入力してください。" }),
    content: z.string().min(1, { message: "コンテンツを入力してください。" }),
  });

  let errors = {};

  // TODOの取得
  const fetchTodos = async () => {
    const res = await fetch(`${API_URL}?search=${search}`);
    todos = await res.json();
    console.log(todos);
  };

  // TODOの追加または編集
  const saveTodo = async () => {
    try {
      schema.parse(form);
      errors = {};

      const method = editMode ? "PUT" : "POST";
      const endpoint = editMode ? `${API_URL}/${currentTodo.id}` : API_URL;
console.log("method=", method);
console.log("endpoint=", endpoint);
console.log(JSON.stringify(form));
//return;
      await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      await fetchTodos();
      resetForm();
      showDialog = false;
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors = error.flatten().fieldErrors;
      }
    }
  };

  // TODOの削除
  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    await fetchTodos();
  };

  // フォームのリセット
  const resetForm = () => {
    form = {
      title: "",
      content: "",
      public: false,
      food_orange: false,
      food_apple: false,
      food_banana: false,
      pub_date: "",
      qty1: "",
      qty2: "",
      qty3: "",
    };
    errors = {};
    editMode = false;
    currentTodo = null;
  };

  // TODOの編集モード
  const startEdit = (todo) => {
console.log("#startEdit");
console.log(todo);
    form = { ...todo };
    editMode = true;
    currentTodo = todo;
    showDialog = true;
  };

  // 初期データ取得
  onMount(fetchTodos);
</script>

<style>
  label {
    @apply block text-sm font-medium text-gray-700 mb-1;
  }

  input,
  textarea {
    @apply w-full border border-gray-300 rounded-md p-2 mb-4;
  }

  .error {
    @apply text-red-500 text-sm;
  }
</style>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">TODO 管理</h1>

  <input
    type="text"
    placeholder="検索..."
    class="border p-2 mb-4 w-full"
    bind:value={search}
    on:input={fetchTodos}
  />

  <button
    class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
    on:click={() => {
      resetForm();
      showDialog = true;
    }}
  >
    TODOを追加
  </button>

  <ul class="mt-6">
    {#each todos as todo}
      <li class="p-4 border-b mb-4">
        <h2 class="text-lg font-bold">{todo.title}</h2>
        <p>{todo.content}</p>
        <div class="mt-2 space-x-2">
          <button
            class="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
            on:click={() => startEdit(todo)}
          >
            編集
          </button>
          <button
            class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
            on:click={() => deleteTodo(todo.id)}
          >
            削除
          </button>
        </div>
      </li>
    {/each}
  </ul>

  {#if showDialog}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg w-full max-w-2xl">
        <form on:submit|preventDefault={saveTodo}>
          <div>
            <label for="title">タイトル</label>
            <input
              type="text"
              id="title"
              bind:value={form.title}
              class={errors.title ? "border-red-500" : ""}
            />
            {#if errors.title}
              <p class="error">{errors.title[0]}</p>
            {/if}
          </div>
  
          <div>
            <label for="content">コンテンツ</label>
            <textarea
              id="content"
              bind:value={form.content}
              class={errors.content ? "border-red-500" : ""}
            ></textarea>
            {#if errors.content}
              <p class="error">{errors.content[0]}</p>
            {/if}
          </div>
  
          <!-- 公開設定 -->
          <div>
            <label>公開設定</label>
            <div class="flex items-center space-x-4">
              <label><input type="radio" value={true} bind:group={form.public} 
                /> 公開</label>
              <label><input type="radio" value={false} bind:group={form.public} 
                /> 非公開</label>
            </div>
          </div>
  
          <!-- その他の入力 -->
          <!-- 好きなフルーツ -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700">
              好きなフルーツ
            </label>
            <div class="flex space-x-4">
              <label>
                <input type="checkbox" bind:checked={form.food_orange} /> オレンジ
              </label>
              <label>
                <input type="checkbox" bind:checked={form.food_apple} /> りんご
              </label>
              <label>
                <input type="checkbox" bind:checked={form.food_banana} /> バナナ
              </label>
            </div>
          </div>           
          <!-- (food_orange, food_apple, food_banana, pub_date, qty1, qty2, qty3) -->
          <!-- その他の項目 -->
          <div class="mt-4">
            <label for="pub_date" class="block text-sm font-medium text-gray-700">
              公開日
            </label>
            <input
              type="date"
              id="pub_date"
              bind:value={form.pub_date}
              class="w-full border rounded p-2 mb-2"
            />
          </div>
          <div>
            <label for="qty1" class="block text-sm font-medium text-gray-700">
              数量 1
            </label>
            <input
              type="text"
              id="qty1"
              bind:value={form.qty1}
              class="w-full border rounded p-2 mb-2"
            />
          </div>
          <div>
            <label for="qty2" class="block text-sm font-medium text-gray-700">
              数量 2
            </label>
            <input
              type="text"
              id="qty2"
              bind:value={form.qty2}
              class="w-full border rounded p-2 mb-2"
            />
          </div>
          <div>
            <label for="qty3" class="block text-sm font-medium text-gray-700">
              数量 3
            </label>
            <input
              type="text"
              id="qty3"
              bind:value={form.qty3}
              class="w-full border rounded p-2 mb-2"
            />
          </div>

          <div class="mt-4 flex justify-end space-x-4">
            <button
              type="button"
              class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              on:click={() => (showDialog = false)}
            >
              キャンセル
            </button>
            <button
              type="submit"
              class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  {/if}
</div>
