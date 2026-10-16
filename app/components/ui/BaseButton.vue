<script setup lang="ts">
withDefaults(
  defineProps<{
    href?: string
    type?: 'button' | 'submit'
    variant?: 'primary' | 'secondary' | 'light' | 'icon'
  }>(),
  {
    href: undefined,
    type: 'button',
    variant: 'primary',
  },
)
</script>

<template>
  <a
    v-if="href"
    :href="href"
    class="button"
    :class="`button-${variant}`"
    ><slot
  /></a>
  <button
    v-else
    :type="type"
    class="button"
    :class="`button-${variant}`"
  >
    <slot />
  </button>
</template>
