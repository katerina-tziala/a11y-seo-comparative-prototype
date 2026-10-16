<script setup lang="ts">
import { primaryNavigationLinks } from '../../data/navigation'
</script>

<template>
  <footer class="site-footer">
    <BaseSectionContainer>
      <div class="footer-grid">
        <div class="footer-column--brand">
          <a
            class="brand brand--light"
            href="#top"
          >
            <LogoIcon class="footer-logo" aria-hidden="true" />
            <span>LucidReach <span class="brand-accent">Digital</span></span>
          </a>
          <p>Clearer websites. Wider reach.</p>
        </div>
        <div class="footer-column--contact">
          <p class="footer-label">Contact</p>
          <a href="#audit">Request an Audit</a>
        </div>
        <div class="footer-column--explore">
          <p class="footer-label">Explore</p>
          <a
            v-for="link in primaryNavigationLinks"
            :key="link.href"
            :href="link.href"
            >{{ link.label }}</a
          >
        </div>
      </div>
      <div class="footer-bottom">
        <span>© {{ new Date().getFullYear() }} LucidReach Digital</span
        ><span>Fictional company created for academic research.</span>
      </div>
    </BaseSectionContainer>
  </footer>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.site-footer {
  @apply bg-footer-bg
    pt-18
    pb-6
    text-white;
}

.site-footer p,
.site-footer a {
  @apply text-footer-copy;
}

.site-footer a {
  @apply transition-colors
    duration-200
    focus-visible:rounded-sm
    focus-visible:outline-2
    focus-visible:outline-offset-4
    focus-visible:outline-mint;
}

.footer-grid a:not(.brand) {
  @apply no-underline
    decoration-mint
    underline-offset-4
    hover:text-white
    hover:underline
    focus-visible:text-white
    focus-visible:underline;
}

.brand {
  @apply inline-flex
    items-center
    gap-2.5
    font-heading
    font-bold
    no-underline;
}

.brand--light {
  @apply text-mint!;
  --brand-mark-bg: var(--color-mint);
  --brand-mark-l: var(--color-deep);
  --brand-mark-r: var(--color-deep);
}

.footer-logo {
  @apply size-9 shrink-0;
}

.brand--light .brand-accent {
  @apply text-white;
}

.brand--light:hover {
  @apply text-white!;
  --brand-mark-bg: var(--color-white);
}

.footer-grid {
  @apply grid
    grid-cols-1
    gap-6
    sm:grid-cols-[2fr_1fr_1.4fr]
    sm:gap-12;
}

.footer-grid > div {
  @apply flex
    flex-col
    items-start
    gap-2;
}

.footer-column--brand {
  order: 1;
}

.footer-column--explore {
  order: 2;
}

.footer-column--contact {
  order: 3;
}

.footer-grid p {
  @apply m-0;
}

.footer-label {
  @apply font-bold
    text-white!;
}

.footer-bottom {
  @apply mt-12
    flex
    flex-col
    items-start
    gap-3
    border-t
    border-white/10
    pt-6
    text-[.8rem]
    text-footer-muted
    sm:flex-row
    sm:justify-between;
}
</style>
