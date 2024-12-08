<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
    <div class="bg-white p-6 rounded w-96">
      <h2 class="text-xl font-bold mb-4">
        {{ mode === "add" ? "Add TODO" : "Edit TODO" }}
      </h2>
      <form @submit.prevent="validateAndSave">
        <div class="mb-4">
          <label class="block font-bold mb-1">Title</label>
          <input
            v-model="form.title"
            class="border rounded px-4 py-2 w-full"
            type="text"
          />
          <p v-if="errors.title" class="text-red-500 text-sm">
            {{ errors.title }}
          </p>
        </div>
        <div class="mb-4">
          <label class="block font-bold mb-1">Description</label>
          <textarea
            v-model="form.description"
            class="border rounded px-4 py-2 w-full"
          ></textarea>
        </div>
        <div class="flex justify-end">
          <button
            type="button"
            class="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { z } from "zod";

export default {
  props: {
    mode: String,
    currentTodo: Object,
  },
  emits: ["close", "save"],
  data() {
    return {
      form: {
        title: this.currentTodo?.title || "",
        description: this.currentTodo?.description || "",
      },
      errors: {},
    };
  },
  methods: {
    validateAndSave() {
      const schema = z.object({
        title: z.string().nonempty("Title is required."),
      });

      const result = schema.safeParse(this.form);

      if (!result.success) {
        this.errors = result.error.flatten().fieldErrors;
      } else {
        this.errors = {};
        this.$emit("save", this.form);
      }
    },
  },
};
</script>
