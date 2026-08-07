<script setup lang="ts">
const baseURL = useRuntimeConfig().app.baseURL
</script>

<template>
  <div class="hero section">
    <BaseSectionContainer class="hero-grid">
      <div class="hero-copy">
        <p class="eyebrow">Accessibility, design &amp; technical SEO</p>
        <h1>Accessible, <span class="nowrap">Search-Ready</span> Websites</h1>
        <p class="hero-lede">
          We combine inclusive design, clear content structure and technical precision to create
          websites that are easier for people to use and easier for search engines to understand.
        </p>
        <div class="button-row">
          <BaseButton href="#audit">Request an Audit</BaseButton>
          <BaseButton
            href="#services"
            variant="secondary"
          >
            Explore Our Services
          </BaseButton>
        </div>
      </div>
      <div class="hero-art">
        <img
          :src="`${baseURL}images/hero-dashboard.svg`"
          alt=""
          width="680"
          height="505"
        />
        <div class="hero-note">
          <span><SparkleIcon /></span>
          <p>
            <strong>Clearer websites. Wider reach.</strong> <br />Practical improvements for
            usability, clarity and discoverability.
          </p>
        </div>
      </div>
    </BaseSectionContainer>
  </div>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.hero {
  @apply overflow-hidden
    bg-[radial-gradient(ellipse_58%_72%_at_100%_0%,var(--color-mint-light)_0%,color-mix(in_srgb,var(--color-mint)_28%,transparent)_48%,transparent_74%),linear-gradient(to_bottom_left,color-mix(in_srgb,var(--color-mint-light)_72%,var(--color-cream))_0%,var(--color-cream)_75%)];
}

.hero-grid {
  @apply grid
    grid-cols-1
    items-center
    gap-12
    md:grid-cols-[1.07fr_.93fr];
}

.nowrap {
  @apply whitespace-nowrap;
}

.hero-lede {
  @apply max-w-[680px]
    text-lg;
}

.button-row {
  @apply mt-8
    flex
    flex-wrap
    gap-4;
}

.hero-note {
  @apply mx-auto
    mt-7
    flex
    w-full
    max-w-[680px]
    items-start;
}

.hero-note > span {
  @apply -mt-3
    grid
    size-18
    shrink-0
    place-items-center
    rounded-full
    bg-mint-light
    text-[2.4rem]
    text-ink-soft;
}

.hero-note p {
  @apply relative
    z-1
    m-0
    -ml-4
    text-[.92rem];
}

.hero-note strong {
  @apply text-[1.05rem];
}

.hero-art {
  @apply relative
    mx-auto
    w-full
    max-w-[600px]
    md:mx-0
    md:max-w-none;
}

.hero-art img {
  @apply h-auto
    w-full
    max-w-[680px]
    object-contain;
}

.hero-art::before {
  @apply absolute
    [inset:12%_0_0_12%]
    -z-1
    size-28
    rounded-full
    bg-mint
    blur-[2px]
    content-[''];
}
</style>
