<template>
  <div>
    <ul class="divide-y divide-gray-200">
      <li
        v-for="todo in todos"
        :key="todo.id"
        class="flex justify-between items-center py-2"
      >
        <div>
          <p class="font-bold">{{ todo.title }}</p>
          <p class="text-gray-500">{{ todo.description }}</p>
        </div>
        <div>
          <button
            class="text-blue-500 mr-2"
            @click="$emit('edit', todo)"
          >
            Edit
          </button>
          <button
            class="text-red-500"
            @click="$emit('delete', todo.id)"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    todos: Array,
  },
};
</script>
