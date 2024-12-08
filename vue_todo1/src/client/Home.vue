<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">TODO App</h1>
    <SearchBar @search="searchTodos" />
    <button
      class="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      @click="openDialog('add')"
    >
      Add TODO
    </button>
    <TodoList
      :todos="todos"
      @edit="openDialog('edit', $event)"
      @delete="deleteTodo"
    />
    <TodoDialog
      v-if="showDialog"
      :mode="dialogMode"
      :currentTodo="currentTodo"
      @close="closeDialog"
      @save="saveTodo"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import TodoList from "./Home/TodoList.vue";
import TodoDialog from "./Home/TodoDialog.vue";
import SearchBar from "./Home/SearchBar.vue";
import axios from "axios";

export default {
  components: { TodoList, TodoDialog, SearchBar },
  setup() {
    const todos = ref([]);
    const showDialog = ref(false);
    const dialogMode = ref("add");
    const currentTodo = ref(null);

    const fetchTodos = async () => {
      const response = await axios.get("/api/todos");
      console.log(response.data);
      todos.value = response.data;
    };

    const searchTodos = async (query) => {
      const response = await axios.get(`/api/todos?search=${query}`);
      todos.value = response.data;
    };

    const openDialog = (mode, todo = null) => {
      dialogMode.value = mode;
      currentTodo.value = todo;
      showDialog.value = true;
    };

    const closeDialog = () => {
      showDialog.value = false;
      currentTodo.value = null;
    };

    const saveTodo = async (todo) => {
      if (dialogMode.value === "add") {
        await axios.post("/api/todos", todo);
      } else {
        await axios.put(`/api/todos/${todo.id}`, todo);
      }
      fetchTodos();
      closeDialog();
    };

    const deleteTodo = async (id) => {
      try{  
        console.log("deleteTodo=", id);
        await axios.delete(`/api/todos/${id}`);
        fetchTodos();
      } catch (error) {
        console.error('Failed to fetch todos:', error);
      }
    };

    fetchTodos();

    return {
      todos,
      showDialog,
      dialogMode,
      currentTodo,
      openDialog,
      closeDialog,
      saveTodo,
      searchTodos,
      deleteTodo,
    };
  },
};
</script>
