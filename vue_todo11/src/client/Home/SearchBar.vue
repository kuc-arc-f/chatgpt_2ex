<template>
  <div class="mb-4">
    <input
      type="text"
      v-model="query"
      placeholder="Search TODOs"
      class="w-full px-3 py-2 border rounded"
      @input="searchTodos"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
//import { useTodoStore } from '@/stores/todo';
import { useTodoStore } from './stores/todo';

const query = ref('');
const todoStore = useTodoStore();

const searchTodos = () => {
  todoStore.searchTodos(query.value);
};
</script>