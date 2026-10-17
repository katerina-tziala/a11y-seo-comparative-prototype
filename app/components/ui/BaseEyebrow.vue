<template>
  <p class="eyebrow"><slot /></p>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.eyebrow {
  @apply mb-4
    text-[.78rem]
    font-bold
    tracking-[.14em]
    [color:var(--section-intro-eyebrow-color,var(--color-green))]
    uppercase;
}
</style>
