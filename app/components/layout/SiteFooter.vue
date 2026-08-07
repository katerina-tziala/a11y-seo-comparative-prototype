<script setup lang="ts">
import { primaryNavigationLinks } from '../../data/navigation'
</script>

<template>
  <footer class="site-footer">
    <BaseSectionContainer>
      <div class="footer-grid">
        <div>
          <a
            class="brand brand--light"
            href="#top"
            ><span class="brand-mark">L</span><span>LucidReach <b>Digital</b></span></a
          >
          <p>Clearer websites. Wider reach.</p>
        </div>
        <div>
          <p class="footer-label">Explore</p>
          <a
            v-for="link in primaryNavigationLinks"
            :key="link.href"
            :href="link.href"
            >{{ link.label }}</a
          >
        </div>
        <div>
          <p class="footer-label">Start a conversation</p>
          <a href="#audit">Request an Audit</a>
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
  @apply bg-[#0b2d2a]
    pt-18
    pb-6
    text-white;
}

.site-footer p,
.site-footer a {
  @apply text-[#bcd0cb];
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
  @apply text-white!;
}

.brand--light b {
  @apply text-mint;
}

.brand-mark {
  @apply grid
    size-9
    place-items-center
    rounded-[50%_50%_50%_14%]
    font-extrabold
    transition-colors
    duration-200;
}

.brand--light .brand-mark {
  @apply bg-mint
    text-deep;
}

.brand--light:hover .brand-mark {
  @apply bg-white;
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
    text-[#8fabaa]
    sm:flex-row
    sm:justify-between;
}
</style>
