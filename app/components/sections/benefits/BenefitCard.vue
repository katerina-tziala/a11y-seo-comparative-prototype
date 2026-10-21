<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  title: string
  description: string
}>()
</script>

<template>
  <BaseCard
    variant="brand"
    class="benefit"
  >
    <h3 class="benefit-icon"><component :is="icon" /></h3>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </BaseCard>
</template>

<style scoped>
@reference "@styles/main.css";

.benefit {
  @apply relative
    grid
    aspect-square
    min-h-0
    w-full
    max-w-[17rem]
    place-content-center
    gap-3
    self-start
    justify-self-center
    bg-[linear-gradient(to_top_right,var(--color-deep)_0%,color-mix(in_srgb,var(--color-deep)_50%,var(--color-brand))_42%,var(--color-brand)_65%,color-mix(in_srgb,var(--color-brand)_95%,var(--color-mint))_84%,color-mix(in_srgb,var(--color-brand)_90%,var(--color-mint))_100%)]
    p-8
    text-center
    shadow-sm;
}

.benefit > .benefit-icon {
  @apply absolute
    bottom-0
    m-0
    mx-auto
    grid
    size-16
    place-items-center
    rounded-full
    border
    border-cream
    [font-family:inherit]
    [font-weight:inherit]
    [line-height:inherit]
    [letter-spacing:inherit]
    text-[2rem]
    text-cream;
}

.benefit h3:not(.benefit-icon) {
  @apply m-auto
    max-w-[80%]
    text-[1.4rem]
    text-white;
}

.benefit p {
  @apply text-sand;
}
</style>
