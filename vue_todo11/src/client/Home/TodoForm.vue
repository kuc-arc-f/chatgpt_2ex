<template>
  <dialog :open="isOpen" class="p-4 rounded shadow-lg w-96">
    <h2 class="text-xl font-bold mb-4">{{ isEditing ? 'Edit TODO' : 'Add TODO' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="title" class="block mb-2">Title</label>
        <input
          type="text"
          id="title"
          v-model="formData.title"
          class="w-full px-3 py-2 border rounded"
          :class="{ 'border-red-500': errors.title }"
        />
        <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
      </div>
      <div class="mb-4">
        <label for="description" class="block mb-2">Description</label>
        <textarea
          id="description"
          v-model="formData.description"
          class="w-full px-3 py-2 border rounded"
        ></textarea>
      </div>
      <div class="flex justify-end">
        <button
          type="button"
          class="px-4 py-2 mr-2 bg-gray-300 rounded hover:bg-gray-400"
          @click="close"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {{ isEditing ? 'Save' : 'Add' }}
        </button>
      </div>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { z } from 'zod';
import { useTodoStore } from './stores/todo';
import { useValidation } from './useValidation';
import type { Todo } from './types';

const props = defineProps<{
  isOpen: boolean;
  todo?: Todo;
}>();

const emit = defineEmits(['close']);

const isEditing = ref(false);
const formData = reactive<Partial<Todo>>({
  title: '',
  description: '',
});

const todoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

const { errors, validate } = useValidation(todoSchema);

const todoStore = useTodoStore();

watch(
  () => props.todo,
  (newTodo) => {
    if (newTodo) {
      isEditing.value = true;
      formData.title = newTodo.title;
      formData.description = newTodo.description;
    } else {
      isEditing.value = false;
      formData.title = '';
      formData.description = '';
    }
  }
);

onMounted(() => {
  if (props.todo) {
    isEditing.value = true;
    formData.title = props.todo.title;
    formData.description = props.todo.description;
  }
});

const handleSubmit = async () => {
  const isValid = validate(formData);
  if (!isValid) return;

  try {
    if (isEditing.value && props.todo) {
      await todoStore.updateTodo(props.todo.id, formData);
    } else {
      await todoStore.addTodo(formData);
    }
    close();
  } catch (error) {
    console.error(error);
  }
};

const close = () => {
  errors.title = '';
  emit('close');
};
</script>