<script setup lang="ts">
defineProps<{ accentColor?: string }>()
</script>

<template>
  <svg
    viewBox="0 0 48 48"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    stroke-width="3"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect
      x="4"
      y="4"
      width="15"
      height="15"
      rx="3"
      :fill="accentColor || 'currentColor'"
      :stroke="accentColor || 'currentColor'"
    />
    <rect
      x="29"
      y="4"
      width="15"
      height="15"
      rx="3"
    />
    <rect
      x="16.5"
      y="32"
      width="15"
      height="14"
      rx="3"
    />
    <path d="M11.5 19v6h25v-6M24 25v7" />
  </svg>
</template>
