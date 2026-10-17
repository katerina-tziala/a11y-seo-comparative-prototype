<template>
  <div class="section"><slot /></div>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.section {
  @apply py-16
    sm:py-20
    md:py-28;
}
</style>
