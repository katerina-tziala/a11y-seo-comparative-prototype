<script setup lang="ts">
import MenuIcon from '../icons/MenuIcon.vue'
import { primaryNavigationLinks } from '../../data/navigation'

const baseURL = useRuntimeConfig().app.baseURL
const showMenuToggle = ref(false)
let mobileMediaQuery: MediaQueryList | undefined

function updateMenuToggleVisibility() {
  showMenuToggle.value = mobileMediaQuery?.matches ?? false
}

onMounted(() => {
  mobileMediaQuery = window.matchMedia('(width < 73.75rem)')
  updateMenuToggleVisibility()
  mobileMediaQuery.addEventListener('change', updateMenuToggleVisibility)
})

onBeforeUnmount(() => {
  mobileMediaQuery?.removeEventListener('change', updateMenuToggleVisibility)
})
</script>

<template>
  <header class="site-header">
    <BaseSectionContainer class="header-inner">
      <a
        class="brand"
        href="#top"
      >
        <img
          :src="`${baseURL}images/logo.svg`"
          width="207"
          height="36"
        />
      </a>
      <BaseToggleMenu>
        <template #trigger="{ toggle }">
          <BaseButton
            v-if="showMenuToggle"
            class="menu-toggle"
            type="button"
            variant="icon"
            @click="toggle"
          >
            <MenuIcon />
          </BaseButton>
        </template>
        <template #default="{ open, close }">
          <nav
            id="site-nav"
            class="nav"
            :class="{ 'nav-open': open }"
          >
            <a
              v-for="link in primaryNavigationLinks"
              :key="link.href"
              :href="link.href"
              @click="close()"
              >{{ link.label }}</a
            >
            <BaseButton
              href="#request-audit"
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
    rounded-xs
    no-underline
    focus-visible:outline-2
    focus-visible:outline-offset-4
    focus-visible:outline-brand;
}

.brand img {
  @apply h-9
    w-auto;
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
  @apply rounded-xs
    bg-cream
    px-4
    py-3
    text-base
    font-semibold
    underline
    decoration-transparent
    underline-offset-4
    hover:bg-mint-light
    hover:[color:var(--lr-color-logo-bg)]
    focus-visible:outline-2
    focus-visible:outline-offset-0
    focus-visible:outline-brand
    lg:bg-transparent
    lg:px-0
    lg:py-0
    lg:hover:bg-transparent
    lg:hover:decoration-brand
    lg:focus-visible:outline-offset-4;
}

.menu-toggle {
  @apply lg:hidden;
}

.nav-open {
  @apply flex
    flex-col
    items-stretch
    lg:flex-row
    lg:items-center;
}
</style>
