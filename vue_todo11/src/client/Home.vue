<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">TODO App</h1>

    <SearchBar />

    <button
      @click="openAddDialog"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Add TODO
    </button>

    <TodoList :todos="filteredTodos" @edit="openEditDialog" />

    <TodoForm :is-open="isAddDialogOpen" @close="closeAddDialog" />
    <TodoForm :is-open="isEditDialogOpen" :todo="selectedTodo" @close="closeEditDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import TodoList from './Home/TodoList.vue';
import TodoForm from './Home/TodoForm.vue';
import SearchBar from './Home/SearchBar.vue';
import { useTodoStore } from './Home/stores/todo';
import type { Todo } from './Home/types';

const isAddDialogOpen = ref(false);
const isEditDialogOpen = ref(false);
const selectedTodo = ref<Todo | null>(null);

const todoStore = useTodoStore();

onMounted(() => {
  todoStore.fetchTodos();
});

const openAddDialog = () => {
  selectedTodo.value = null;
  isAddDialogOpen.value = true;
};

const closeAddDialog = () => {
  isAddDialogOpen.value = false;
};

const openEditDialog = (todo: Todo) => {
  selectedTodo.value = todo;
  isEditDialogOpen.value = true;
};

const closeEditDialog = () => {
  isEditDialogOpen.value = false;
};

const filteredTodos = computed(() => todoStore.filteredTodos);
//const filteredTodos = [];
</script>