<template>
  <div class="mb-4">
    <input
      v-model="query"
      class="border rounded px-4 py-2 w-full"
      type="text"
      placeholder="Search TODOs"
      @input="onSearch"
    />
  </div>
</template>

<script>
export default {
  emits: ["search"],
  data() {
    return {
      query: "",
    };
  },
  methods: {
    onSearch() {
      this.$emit("search", this.query);
    },
  },
};
</script>
