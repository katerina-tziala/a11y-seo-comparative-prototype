<script setup lang="ts">
import AccessibleWebDesignIcon from '../../icons/services/AccessibleWebDesignIcon.vue'
import ContentConversionIcon from '../../icons/services/ContentConversionIcon.vue'
import TechnicalSeoIcon from '../../icons/services/TechnicalSeoIcon.vue'
import ServiceCard from './ServiceCard.vue'

const services = [
  {
    icon: AccessibleWebDesignIcon,
    title: 'Accessible Web Design',
    href: '#approach',
    text: 'Create clear, flexible experiences shaped around how real people navigate, read and take action.',
    items: [
      'Interface and journey reviews',
      'Flexible, responsive design systems',
      'Content-first prototyping',
    ],
  },
  {
    icon: TechnicalSeoIcon,
    title: 'Technical SEO',
    href: '#packages',
    text: 'Build a dependable technical foundation that helps search engines discover and interpret your content.',
    items: ['Technical health checks', 'On-page structure reviews', 'Performance priorities'],
  },
  {
    icon: ContentConversionIcon,
    title: 'Content & Conversion Optimization',
    href: '#benefits',
    text: 'Turn complex messages into useful content and confident next steps for the people you want to reach.',
    items: ['Content hierarchy', 'Calls-to-action', 'Conversion journey reviews'],
  },
]
</script>

<template>
  <BaseSection class="services-section">
    <BaseSectionContainer>
      <BaseSectionIntro class="section-heading">
        <template #eyebrow>One connected approach</template>
        <template #heading><h2 class="section-title">Services that strengthen the whole experience</h2></template>
        Design, accessibility, content and technical SEO work best when they work together. We help
        you identify friction, set priorities and build a focused path forward.
      </BaseSectionIntro>
      <div class="card-grid">
        <ServiceCard
          v-for="service in services"
          :key="service.title"
          v-bind="service"
        />
      </div>
    </BaseSectionContainer>
  </BaseSection>
</template>

<style scoped>
@reference "../../../assets/css/main.css";

.services-section {
  @apply bg-services-bg;
}

.section-heading {
  @apply mb-12;
}

.card-grid {
  @apply grid
    grid-cols-1
    gap-6
    md:grid-cols-3;
}
</style>
