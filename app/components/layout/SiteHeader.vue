<script setup lang="ts">
import MenuIcon from '../icons/MenuIcon.vue'
import { primaryNavigationLinks } from '../../data/navigation'
</script>

<template>
  <header class="site-header">
    <BaseSectionContainer class="header-inner">
      <a
        class="brand"
        href="#top"
      >
        <span class="brand-mark">L</span>
        <span>LucidReach <b>Digital</b></span>
      </a>
      <BaseToggleMenu>
        <template #trigger="{ toggle }">
          <BaseButton
            class="menu-toggle"
            type="button"
            variant="icon"
            @click="toggle"
          >
            <span class="sr-only">Toggle navigation</span>
            <MenuIcon />
          </BaseButton>
        </template>
        <template #default="{ open, close }">
          <nav
            id="site-nav"
            class="nav"
            :class="{ 'nav--open': open }"
          >
            <a
              v-for="link in primaryNavigationLinks"
              :key="link.href"
              :href="link.href"
              @click="close()"
              >{{ link.label }}</a
            >
            <BaseButton
              href="#audit"
              @click="close()"
              >Request an Audit</BaseButton
            >
          </nav>
        </template>
      </BaseToggleMenu>
    </BaseSectionContainer>
  </header>
</template>

<style scoped>
@reference "../../assets/css/main.css";

.site-header {
  @apply sticky
    top-0
    z-10
    border-b
    border-ink/10
    bg-cream/95
    backdrop-blur-xl;
}

.header-inner {
  @apply flex
    min-h-[82px]
    items-center
    justify-between;
}

.brand {
  @apply inline-flex
    items-center
    gap-2.5
    font-heading
    font-bold
    no-underline
    focus-visible:rounded-sm
    focus-visible:outline-2
    focus-visible:outline-offset-4
    focus-visible:outline-brand;
}

.brand b {
  @apply text-brand;
}

.brand-mark {
  @apply grid
    size-9
    place-items-center
    rounded-[50%_50%_50%_14%]
    bg-deep
    font-extrabold
    text-mint
    transition-colors
    duration-200;
}

.brand:hover .brand-mark {
  @apply bg-deep-hover;
}

.nav {
  @apply absolute
    top-[82px]
    right-5
    left-5
    hidden
    gap-3
    rounded-md
    border
    border-line
    bg-white
    p-6
    shadow-soft
    lg:static
    lg:flex
    lg:items-center
    lg:gap-7
    lg:border-0
    lg:bg-transparent
    lg:p-0
    lg:shadow-none;
}

.nav > a:not(.button) {
  @apply rounded-sm
    bg-cream
    px-4
    py-3
    text-sm
    font-semibold
    no-underline
    transition-colors
    duration-200
    hover:bg-mint-light
    hover:text-brand
    focus-visible:bg-mint-light
    focus-visible:text-brand
    focus-visible:outline-2
    focus-visible:outline-offset-0
    focus-visible:outline-brand
    lg:bg-transparent
    lg:px-0
    lg:py-0
    lg:hover:bg-transparent
    lg:hover:underline
    lg:hover:underline-offset-4
    lg:focus-visible:bg-transparent
    lg:focus-visible:underline
    lg:focus-visible:underline-offset-4
    lg:focus-visible:outline-offset-4;
}

.menu-toggle {
  @apply lg:hidden;
}

.nav--open {
  @apply flex
    flex-col
    items-stretch
    lg:flex-row
    lg:items-center;
}
</style>
