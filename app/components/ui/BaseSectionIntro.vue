<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'split' | 'vertical' }>(), {
  variant: 'split',
})
</script>

<template>
  <div class="section-intro">
    <BaseEyebrow><slot name="eyebrow" /></BaseEyebrow>
    <div
      class="intro-grid"
      :class="`intro-grid-${variant}`"
    >
      <slot name="heading" />
      <p class="section-lede"><slot /></p>
    </div>
  </div>
</template>

<style scoped>
@reference "@styles/main.css";

.intro-grid {
  @apply grid
    grid-cols-1
    items-start
    gap-6
    text-left
    md:grid-cols-[1.2fr_.8fr]
    md:gap-14;
}

.intro-grid-vertical {
  @apply gap-4
    md:grid-cols-1
    md:gap-4;
}

.intro-grid :slotted(.section-title) {
  @apply m-0
    font-heading
    text-[clamp(2.15rem,4vw,3.4rem)]
    leading-[1.12]
    tracking-[-.035em]
    [font-weight:inherit]
    [color:var(--section-intro-heading-color,var(--color-ink))];
}

.section-lede {
  @apply mb-0
    pt-0
    text-lg
    [color:var(--section-intro-lede-color,var(--color-ink-soft))]
    md:pt-2.5;
}

.intro-grid-vertical .section-lede {
  @apply md:pt-0;
}
</style>
