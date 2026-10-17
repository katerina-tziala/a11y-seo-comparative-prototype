<script setup lang="ts">
import { primaryNavigationLinks } from '../../data/navigation'

const baseURL = useRuntimeConfig().app.baseURL
</script>

<template>
  <footer class="site-footer">
    <BaseSectionContainer>
      <div class="footer-grid">
        <div class="footer-column-brand">
          <a
            class="brand brand-light"
            href="#top"
          >
            <LogoIcon class="footer-logo" aria-hidden="true" />
            <span>LucidReach <span class="brand-accent">Digital</span></span>
          </a>
          <p>Clearer websites. Wider reach.</p>
        </div>
        <div class="footer-column-contact">
          <p class="footer-label">Contact</p>
          <a href="#request-audit">Request an Audit</a>
          <div class="social-links">
            <a href="https://www.example.com/lucidreach/linkedin" class="social-link"><img :src="`${baseURL}images/social/linkedin.png`" alt="" width="35" height="32"></a>
            <a href="https://www.example.com/lucidreach/instagram" class="social-link"><img :src="`${baseURL}images/social/instagram.png`" alt="" width="32" height="32"></a>
            <a href="https://www.example.com/lucidreach/youtube" class="social-link"><img :src="`${baseURL}images/social/youtube.png`" alt="" width="69" height="59" class="social-image-youtube"></a>
          </div>
        </div>
        <div class="footer-column-explore">
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
        ><span>Fictional company created for academic research. <a href="https://github.com/katerina-tziala/a11y-seo-comparative-prototype" target="_blank" rel="noopener noreferrer">Source code on GitHub</a></span>
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
  @apply rounded-xs
    transition-colors
    duration-200
    focus-visible:outline-2
    focus-visible:outline-offset-4
    focus-visible:outline-mint;
}

/* Preserve the specificity of the existing footer link rules. */
/* stylelint-disable-next-line selector-not-notation */
.footer-grid a:not(.brand):not(.social-link) {
  @apply underline
    decoration-transparent
    underline-offset-4
    hover:text-white
    hover:decoration-white;
}

.social-links {
  @apply ms-[calc((2rem*840/779-4rem)/2)]
    flex
    items-center
    gap-0;
}

.social-links .social-link {
  @apply inline-flex
    size-16
    shrink-0
    items-center
    justify-center
    rounded-[8px]
    no-underline
    transition
    duration-200
    focus-visible:-outline-offset-2
    hover:-translate-y-0.5
    hover:bg-white/10
    motion-reduce:hover:translate-y-0;
}

.social-link img {
  @apply h-8
    w-auto
    shrink-0;
}

.social-link:last-child {
  @apply ml-2;
}

.social-link .social-image-youtube {
  @apply h-[calc(2rem*1075/579)]
    w-auto
    max-w-none;
}

@media (forced-colors: active) {
  .social-links .social-link,
  .social-links .social-link:hover {
    @apply bg-footer-bg
      forced-color-adjust-none;
  }
}

.footer-bottom a {
  @apply text-inherit
    underline
    decoration-current
    decoration-1
    underline-offset-4
    hover:text-white
    hover:decoration-white;
}

.brand {
  @apply inline-flex
    items-center
    gap-2.5
    rounded-xs
    font-heading
    text-[18px]
    font-semibold
    no-underline
    tracking-wide;
}

.brand-light {
  @apply text-mint!
    [--brand-mark-bg:var(--color-mint)]
    [--brand-mark-l:var(--color-deep)]
    [--brand-mark-r:var(--color-deep)];
}

.footer-logo {
  @apply size-9
    shrink-0;
}

.brand-light .brand-accent {
  @apply text-white;
}

.brand-light > span {
  @apply underline
    decoration-transparent
    underline-offset-4
    transition-colors
    duration-200;
}

.brand-light:hover > span {
  @apply decoration-current;
}

.brand-light:hover {
  @apply text-white!
    [--brand-mark-bg:var(--color-white)];
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

.footer-column-brand {
  @apply order-1;
}

.footer-column-explore {
  @apply order-2;
}

.footer-column-contact {
  @apply order-3;
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
    text-xs
    text-footer-muted
    sm:flex-row
    sm:justify-between;
}
</style>
