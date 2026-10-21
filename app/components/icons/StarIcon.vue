<script setup lang="ts">
withDefaults(defineProps<{ filled?: boolean }>(), { filled: true })
</script>

<template>
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    :fill="filled ? 'currentColor' : 'none'"
    stroke="currentColor"
    :stroke-width="filled ? 1.5 : 2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path
      d="m12 3 2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 17.2l-5.56 2.92 1.06-6.2L3 9.53l6.22-.9L12 3Z"
    />
  </svg>
</template>
