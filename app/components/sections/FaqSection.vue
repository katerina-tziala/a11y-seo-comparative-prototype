<script setup lang="ts">
const faqs = [
  {
    title: 'What does a website audit cover?',
    content:
      'The audit reviews usability, content structure, accessibility considerations and technical SEO foundations. The exact scope is agreed before work begins.',
  },
  {
    title: 'Do you guarantee search rankings or compliance?',
    content:
      'No. We provide evidence-informed recommendations, but do not promise particular rankings, legal compliance or business outcomes.',
  },
  {
    title: 'Can you work with our existing website?',
    content:
      'Yes. Recommendations can be shaped around your current platform, design system, content and internal capacity.',
  },
  {
    title: 'What happens after the audit?',
    content:
      'You receive prioritised findings and suggested next steps. Further design or implementation support can then be scoped separately.',
  },
]
</script>

<template>
  <div class="section">
    <BaseSectionContainer class="faq-layout"
      ><div>
        <BaseSectionIntro variant="vertical">
          <template #eyebrow>Frequently asked questions</template>
          <template #heading>Useful answers before we begin</template>
          Still have a question? Include it in your audit request and we’ll use it to shape the
          conversation.
        </BaseSectionIntro>
        <div class="button-row">
          <BaseButton
            href="#audit"
            variant="primary"
            >Request an Audit</BaseButton
          >
        </div>
      </div>
      <BaseAccordion :items="faqs" />
    </BaseSectionContainer>
  </div>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.faq-layout {
  @apply grid
    grid-cols-1
    gap-12
    md:grid-cols-[.75fr_1.25fr];
}

.button-row {
  @apply mt-8;
}
</style>
