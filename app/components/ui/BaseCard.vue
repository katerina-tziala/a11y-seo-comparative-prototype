<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'default' | 'brand'
  }>(),
  {
    variant: 'default',
  },
)
</script>

<template>
  <div
    :class="['card', `card-${variant}`]"
  >
    <slot />
  </div>
</template>

<style scoped>
@reference "@styles/main.css";

.card {
  @apply rounded-lg
    bg-surface
    shadow-sm;
}

.card-brand {
  @apply rounded-[50%_50%_50%_14%]
    bg-brand
    text-cream
    shadow-sm;
}
</style>
