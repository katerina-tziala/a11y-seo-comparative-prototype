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
    :class="`button--${variant}`"
    ><slot
  /></a>
  <button
    v-else
    :type="type"
    class="button"
    :class="`button--${variant}`"
  >
    <slot />
  </button>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.button {
  @apply inline-flex
    min-h-13
    cursor-pointer
    items-center
    justify-center
    gap-2.5
    rounded-sm
    border
    border-deep
    bg-deep
    px-5.5
    py-3
    leading-none
    font-bold
    text-white
    no-underline
    transition
    duration-200;
}

.button:hover {
  @apply -translate-y-0.5
    bg-deep-hover;
}

.button:focus-visible {
  @apply outline-2
    outline-offset-4
    outline-brand;
}

.button--secondary {
  @apply border-brand
    bg-transparent
    text-deep;
}

.button--secondary:hover {
  @apply border-brand
    bg-brand
    text-white;
}

.button--secondary:focus-visible {
  @apply outline-brand;
}

.button--light {
  @apply border-white
    bg-white
    text-deep;
}

.button--light:hover {
  @apply bg-mint-light;
}

.button--light:focus-visible {
  @apply outline-mint;
}

.button--icon {
  @apply size-11
    min-h-11
    border-transparent
    bg-transparent
    p-2
    text-2xl
    text-ink;
}

.button--icon:hover {
  @apply translate-y-0
    bg-mint-light;
}
</style>
