<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  title: string
  text: string
  items: string[]
}>()
</script>

<template>
  <BaseCard class="service-card">
    <div class="card-top">
      <h4 class="card-title">{{ title }}</h4>
      <span class="icon-box">
        <component :is="icon" />
      </span>
    </div>
    <p>{{ text }}</p>
    <div class="feature-list">
      <div
        v-for="item in items"
        :key="item"
        class="feature-item"
      >
        {{ item }}
      </div>
    </div>
  </BaseCard>
</template>

<style scoped>
@reference "../../../assets/css/main.css";

.service-card {
  @apply relative
    overflow-hidden
    p-8;
}

.card-top {
  @apply mb-8
    flex
    min-h-[3.4rem]
    items-center
    pr-20;
}

.card-top .card-title {
  @apply m-0
    font-heading
    leading-[1.12]
    tracking-[-.035em]
    [font-weight:inherit]
    text-left
    text-[1.4rem]
    text-brand;
}

.icon-box {
  @apply absolute
    top-8
    right-6
    isolate
    grid
    size-[3.4rem]
    place-items-center
    text-[2.6rem]
    text-cream;
}

.icon-box::before {
  @apply absolute
    [inset:-4.3rem_-4.3rem_auto_auto]
    -z-1
    size-36
    rounded-full
    bg-brand/90
    content-[''];
}

.icon-box :deep(svg) {
  @apply drop-shadow-sm;
}

.service-card .feature-list {
  @apply mt-6
    list-none
    border-t
    border-line
    pt-6;
}

.service-card .feature-item {
  @apply mt-2
    text-[.92rem]
    text-ink-soft;
}

.service-card .feature-item::before {
  @apply mr-2.5
    text-brand
    content-['✓'];
}
</style>
