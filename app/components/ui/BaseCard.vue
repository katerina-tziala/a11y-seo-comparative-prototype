<script setup lang="ts">
withDefaults(
  defineProps<{
    as?: string
    variant?: 'default' | 'brand'
  }>(),
  {
    as: 'div',
    variant: 'default',
  },
)
</script>

<template>
  <component
    :is="as"
    :class="['card', `card--${variant}`]"
  >
    <slot />
  </component>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.card {
  @apply rounded-lg
    bg-surface
    shadow-sm;
}

.card--brand {
  @apply rounded-[50%_50%_50%_14%]
    bg-brand
    text-cream
    shadow-sm;
}
</style>
