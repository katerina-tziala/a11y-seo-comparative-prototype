<script setup lang="ts">
const baseURL = useRuntimeConfig().app.baseURL

const features = [
  {
    number: '01',
    title: 'Clear content structure',
    description:
      'Logical headings and well-organised sections help visitors find what matters and follow the page.',
  },
  {
    number: '02',
    title: 'Descriptive content and labels',
    description:
      'Meaningful links, labels and alternative text make purpose and context easier to understand.',
  },
  {
    number: '03',
    title: 'Machine-readable foundations',
    description:
      'Semantic markup exposes content, relationships and page structure to browsers, assistive technologies and search systems.',
  },
]
</script>

<template>
  <BaseSection class="a11y-seo-section">
    <BaseSectionContainer class="split-grid">
      <div class="relationship-art">
        <img
          :src="`${baseURL}images/connected-foundations.svg`"
          width="640"
          height="609"
        />
      </div>
      <div>
        <BaseSectionIntro
          class="a11y-intro"
          variant="vertical"
          ><template #eyebrow>CONNECTED FOUNDATIONS</template
          ><template #heading><h2 class="section-title">Accessibility and SEO work from many of the same foundations</h2></template>Clear structure, descriptive content and reliable markup make a website easier for people
          to navigate and easier for search systems to interpret.</BaseSectionIntro
        >
        <div class="feature-list">
          <div
            v-for="feature in features"
            :key="feature.number"
          >
            <span class="pt-0.5">{{ feature.number }}</span>
            <p>
              <strong>{{ feature.title }}</strong
              >{{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </BaseSectionContainer>
  </BaseSection>
</template>

<style scoped>
@reference "@styles/main.css";

.a11y-seo-section {
  @apply bg-deep
    text-white;
}

.a11y-seo-section p {
  @apply text-approach-copy;
}

.split-grid {
  @apply grid
    grid-cols-1
    items-center
    gap-12
    md:grid-cols-[.8fr_1.2fr];
}

.a11y-intro {
  @apply [--section-intro-eyebrow-color:var(--color-mint)]
    [--section-intro-heading-color:var(--color-white)]
    [--section-intro-lede-color:var(--color-cream)];
}

.relationship-art {
  @apply p-6
    max-md:flex
    max-md:w-full
    max-md:justify-center;
}

.relationship-art img {
  @apply max-md:mx-auto
    max-md:block
    max-md:w-full
    max-md:max-w-md;
}

.feature-list {
  @apply mt-8;
}

.feature-list > div {
  @apply grid
    grid-cols-[2.5rem_1fr]
    gap-4
    border-t
    border-white/15
    py-4;
}

.feature-list > div:first-child {
  @apply border-t-0;
}

.feature-list span {
  @apply text-[.8rem]
    text-mint;
}

.feature-list p,
.feature-list strong {
  @apply m-0
    block;
}

.feature-list strong {
  @apply mb-[.2rem]
    text-white;
}
</style>
