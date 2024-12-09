<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  let query = '';

  const handleSearch = () => {
    dispatch('search', query);
  };
</script>

<div class="mb-4">
  <input
    type="text"
    class="border border-gray-300 px-4 py-2 rounded w-full"
    placeholder="TODO を検索..."
    bind:value={query}
    on:input={handleSearch}
  />
</div>