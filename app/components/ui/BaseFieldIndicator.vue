<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'required' | 'optional' }>(), {
  variant: 'required',
})
</script>

<template>
  <span :class="`field-${variant}`"><slot /></span>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.field-required,
.field-optional {
  @apply text-muted
    font-normal
    pl-0.5;
}
</style>
