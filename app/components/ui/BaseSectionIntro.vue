<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'split' | 'vertical' }>(), {
  variant: 'split',
})
</script>

<template>
  <div class="section-intro">
    <p class="eyebrow"><slot name="eyebrow" /></p>
    <div
      class="intro-grid"
      :class="`intro-grid--${variant}`"
    >
      <h2><slot name="heading" /></h2>
      <p class="section-lede"><slot /></p>
    </div>
  </div>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.eyebrow {
  @apply [color:var(--section-intro-eyebrow-color,var(--color-green))]
    uppercase;
}

.intro-grid {
  @apply grid
    grid-cols-1
    items-start
    gap-6
    text-left
    md:grid-cols-[1.2fr_.8fr]
    md:gap-12;
}

.intro-grid--vertical {
  @apply gap-4
    md:grid-cols-1
    md:gap-4;
}

.intro-grid h2 {
  @apply mb-0
    [color:var(--section-intro-heading-color,var(--color-ink))];
}

.section-lede {
  @apply mb-0
    pt-0
    text-lg
    [color:var(--section-intro-lede-color,var(--color-ink-soft))]
    md:pt-2.5;
}

.intro-grid--vertical .section-lede {
  @apply md:pt-0;
}
</style>
