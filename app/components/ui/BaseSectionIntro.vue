<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'split' | 'vertical'; headingTag?: 'h2' | 'p' }>(), {
  variant: 'split',
  headingTag: 'h2',
})
</script>

<template>
  <div class="section-intro">
    <p class="eyebrow"><slot name="eyebrow" /></p>
    <div
      class="intro-grid"
      :class="`intro-grid--${variant}`"
    >
      <component
        :is="headingTag"
        class="section-title"
      >
        <slot name="heading" />
      </component>
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
    md:gap-14;
}

.intro-grid--vertical {
  @apply gap-4
    md:grid-cols-1
    md:gap-4;
}

.intro-grid .section-title {
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

.intro-grid--vertical .section-lede {
  @apply md:pt-0;
}
</style>
