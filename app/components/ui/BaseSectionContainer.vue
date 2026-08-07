<script setup lang="ts">
withDefaults(defineProps<{ as?: string }>(), { as: 'div' })
</script>

<template>
  <component
    :is="as"
    class="section-container"
  >
    <slot />
  </component>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.section-container {
  @apply mx-auto
    w-[calc(100%-3rem)]
    max-w-content
    sm:w-[calc(100%-4rem)];
}
</style>
