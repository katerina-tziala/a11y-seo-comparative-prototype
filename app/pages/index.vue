<script setup lang="ts">
const title = 'Accessible, Search-Ready Websites | LucidReach Digital'
const description =
  'LucidReach Digital combines accessible web design, technical SEO and content optimisation to create clearer, more usable and more discoverable websites.'
const canonicalUrl = 'https://katerina-tziala.github.io/a11y-seo-comparative-prototype/'

useSeoMeta({
  title,
  description,
  robots: 'noindex, follow',
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogUrl: canonicalUrl,
  ogSiteName: 'LucidReach Digital',
  twitterCard: 'summary',
  twitterTitle: title,
  twitterDescription: description,
  themeColor: '#123d39',
})

useHead({
  htmlAttrs: { lang: 'en' },
  link: [{ rel: 'canonical', href: canonicalUrl }],
})
</script>

<template>
  <div id="top">
    <SiteHeader />
    <div>
      <HeroSection />
      <ServicesSection id="services" />
      <A11ySeoSection id="approach" />
      <BenefitsSection id="benefits" />
      <ProcessSection id="process" />
      <FaqSection id="faq" />
      <AuditFormSection id="audit" />
    </div>
    <SiteFooter />
  </div>
</template>
