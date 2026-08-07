<script setup lang="ts">
import ModularFoundationIcon from '../../icons/business-value/ModularFoundationIcon.vue'
import PolishedBrandIcon from '../../icons/business-value/PolishedBrandIcon.vue'
import PrioritisedChecklistIcon from '../../icons/business-value/PrioritisedChecklistIcon.vue'
import WiderAudienceIcon from '../../icons/business-value/WiderAudienceIcon.vue'
import BenefitCard from './BenefitCard.vue'

const benefits = [
  {
    icon: WiderAudienceIcon,
    title: 'Reach more of your audience',
    description:
      'Reduce avoidable barriers and make it easier for more people to engage with your content.',
  },
  {
    icon: PolishedBrandIcon,
    iconAccent: undefined,
    title: 'Build confidence in your brand',
    description:
      'Consistent, thoughtful experiences build trust by showing visitors that every detail matters.',
  },
  {
    icon: ModularFoundationIcon,
    title: 'Make future work easier',
    description:
      'Make future content, optimisation and design decisions from a clearer starting point.',
  },
  {
    icon: PrioritisedChecklistIcon,
    title: 'Focus effort where it counts',
    description: 'Turn a long list of possible improvements into a practical, prioritised roadmap.',
  },
]
</script>

<template>
  <div class="section section--cream">
    <BaseSectionContainer>
      <BaseSectionIntro class="section-heading">
        <template #eyebrow>The business value</template>
        <template #heading>Good experiences create room to grow</template>
        The right improvements support your visitors, your team and the long-term health of your
        digital presence.
      </BaseSectionIntro>
      <div class="benefits-grid">
        <BenefitCard
          v-for="benefit in benefits"
          :key="benefit.title"
          v-bind="benefit"
        />
      </div>
    </BaseSectionContainer>
  </div>
</template>

<style scoped>
@reference "../../../assets/css/main.css";

.section--cream {
  @apply bg-cream;
}

.section-heading {
  @apply mb-12;
}

.benefits-grid {
  @apply grid
    grid-cols-1
    justify-center
    gap-6
    sm:grid-cols-[repeat(2,17rem)]
    sm:gap-3
    sm:gap-x-[clamp(.5rem,calc(9.66vw-3.12rem),4rem)]
    md:gap-y-6
    lg:grid-cols-4
    lg:gap-x-6;
}
</style>
