<template>
  <div>
    <ul class="mt-4">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @edit="openEditDialog"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TodoItem from './TodoItem.vue';
import { useTodoStore } from './stores/todo';
import type { Todo } from '@/types';

const props = defineProps<{
  todos: Todo[];
}>();

const emit = defineEmits(['edit']);

const todoStore = useTodoStore();

const openEditDialog = (todo: Todo) => {
  emit('edit', todo);
};
</script>