<script setup lang="ts">
const steps = [
  {
    number: '01',
    title: 'Discover',
    description: 'We learn about your website, audience and the outcomes that matter to your team.',
  },
  {
    number: '02',
    title: 'Evaluate',
    description:
      'We review the experience across design, content, accessibility and technical SEO.',
  },
  {
    number: '03',
    title: 'Prioritise',
    description: 'We turn findings into a clear plan organised by value, effort and dependencies.',
  },
  {
    number: '04',
    title: 'Improve',
    description: 'We help you make considered changes and build momentum for what comes next.',
  },
]
</script>

<template>
  <div class="section section--sand">
    <BaseSectionContainer>
      <BaseSectionIntro
        class="process-intro"
        variant="vertical"
      >
        <template #eyebrow>How we work</template>
        <template #heading>A straightforward path from insight to action</template>
        Collaborative, focused and shaped around the reality of your team.
      </BaseSectionIntro>
      <div class="process-grid">
        <div
          v-for="step in steps"
          :key="step.number"
          class="process-step"
        >
          <span>{{ step.number }}</span>
          <p class="font-semibold tracking-wide">{{ step.title }}</p>
          <p>{{ step.description }}</p>
        </div>
      </div>
    </BaseSectionContainer>
  </div>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.section--sand {
  @apply bg-sand;
}

.process-intro {
  @apply mx-auto
    mb-12
    max-w-[720px]
    text-center;
}

.process-intro :deep(.intro-grid) {
  @apply text-center;
}

.process-grid {
  @apply grid
    grid-cols-1
    gap-12
    sm:grid-cols-2
    md:grid-cols-4
    md:gap-0;
}

.process-step {
  @apply relative
    grid
    grid-cols-[3rem_1fr]
    gap-x-4
    px-0
    text-left
    sm:block
    sm:px-6
    sm:text-center;
}

.process-step:not(:last-child)::after {
  @apply absolute
    top-14
    left-6
    h-[calc(100%-1rem)]
    border-l
    border-dashed
    border-[#95aaa4]
    sm:hidden
    md:top-6
    md:left-[calc(50%+2rem)]
    md:block
    md:h-0
    md:w-[calc(100%-4rem)]
    md:border-t
    md:border-l-0;
  @apply content-[''];
}

.process-step > span {
  @apply z-1
    row-span-2
    mb-0
    grid
    size-12
    place-items-center
    rounded-full
    bg-deep
    text-[.8rem]
    font-bold
    text-mint
    shadow-sm
    sm:mx-auto
    sm:mb-4;
}
</style>
