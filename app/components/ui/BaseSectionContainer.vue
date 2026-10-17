<template>
  <div class="section-container">
    <slot />
  </div>
</template>

<style scoped>
@reference "@styles/main.css";

.section-container {
  @apply mx-auto
    w-[calc(100%-3rem)]
    max-w-content
    sm:w-[calc(100%-4rem)];
}
</style>
