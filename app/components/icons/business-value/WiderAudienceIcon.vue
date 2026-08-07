<script setup lang="ts">
defineProps<{ accentColor?: string }>()
</script>

<template>
  <svg
    viewBox="0 0 48 48"
    width="1em"
    height="1em"
    fill="none"
  >
    <g transform="translate(-1.2 -1.2) scale(1.05)">
      <g
        fill="none"
        :stroke="accentColor || 'currentColor'"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle
          cx="9"
          cy="20"
          r="4"
        />
        <path d="M2 38c0-6 2.5-9 7-9 4.2 0 6.8 3.4 7.2 8.5a12 12 0 0 0-.7 2.5H2v-2Z" />
        <circle
          cx="39"
          cy="20"
          r="4"
        />
        <path d="M46 38c0-6-2.5-9-7-9-4.2 0-6.8 3.4-7.2 8.5a12 12 0 0 1 .7 2.5H46v-2Z" />
      </g>
      <g fill="currentColor">
        <circle
          cx="24"
          cy="14.5"
          r="6"
        />
        <path d="M9 42c0-11 5.3-17 15-17s15 6 15 17H9Z" />
      </g>
    </g>
  </svg>
</template>
