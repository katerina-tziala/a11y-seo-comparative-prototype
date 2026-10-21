<script setup lang="ts">
const title = 'Accessible, Search-Ready Websites | LucidReach Digital'
const description =
  'LucidReach Digital combines accessible web design, technical SEO and content optimisation to create clearer, more usable and more discoverable websites.'
const config = useRuntimeConfig()
const canonicalUrl = `https://katerina-tziala.github.io${config.app.baseURL}`

useSeoMeta({
  title: '',
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogUrl: canonicalUrl,
  ogSiteName: 'LucidReach Digital',
  twitterCard: 'summary',
  twitterTitle: title,
  twitterDescription: description,
  themeColor: config.public.themeColor,
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
})
</script>

<template>
  <div id="top">
    <a
      href="#main"
      class="skip-link"
      >Skip to main content</a
    >
    <SiteHeader />
    <main
      id="main"
      tabindex="-1"
    >
      <HeroSection />
      <ServicesSection id="services" />
      <A11ySeoSection id="approach" />
      <BenefitsSection id="benefits" />
      <ProcessSection id="process" />
      <PackagesSection id="packages" />
      <FaqSection id="faq" />
      <TestimonialsSection id="testimonials" />
      <RequestAuditSection id="request-audit" />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
@reference "@styles/main.css";

#main {
  @apply scroll-mt-[var(--lr-header-height)];
}

#main:focus {
  @apply outline-none;
}

.skip-link {
  @apply sr-only
    transition-none;
}

.skip-link:focus {
  @apply not-sr-only
    fixed
    top-[var(--lr-header-height)]
    right-0
    left-0
    z-50
    rounded-none
    bg-deep
    px-6
    py-3
    font-bold
    text-white
    no-underline
    outline-2
    -outline-offset-4
    outline-mint
    outline-solid
    sm:px-[max(2rem,calc((100%-var(--lr-content-width))/2))];
}
</style>
