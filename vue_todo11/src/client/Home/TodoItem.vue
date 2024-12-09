<template>
  <li class="flex items-center justify-between p-4 border-b">
    <div class="flex items-center">
      <input
        type="checkbox"
        :checked="todo.completed === 1"
        @change="toggleComplete"
        class="mr-2"
      />
      <span :class="{ 'line-through': todo.completed === 1 }">{{ todo.title }}</span>
    </div>
    <div>
      <button
        @click="editTodo"
        class="px-3 py-1 text-blue-500 hover:text-blue-700"
      >
        Edit
      </button>
      <button
        @click="deleteTodo"
        class="px-3 py-1 text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </div>
  </li>
</template>

<script setup lang="ts">
import { useTodoStore } from './stores/todo';
import type { Todo } from './types';

const props = defineProps<{
  todo: Todo;
}>();

const emit = defineEmits(['edit']);

const todoStore = useTodoStore();

const toggleComplete = async () => {
  await todoStore.updateTodo(props.todo.id, { completed: props.todo.completed ? 0 : 1 });
};

const editTodo = () => {
  emit('edit', props.todo);
};

const deleteTodo = async () => {
  if (confirm('Are you sure you want to delete this TODO?')) {
    await todoStore.deleteTodo(props.todo.id);
  }
};
</script>