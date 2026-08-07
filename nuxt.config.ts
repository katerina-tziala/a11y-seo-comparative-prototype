import tailwindcss from '@tailwindcss/vite'

const repositoryName = 'a11y-seo-comparative-prototype'
const baseURL = process.env.NUXT_APP_BASE_URL || '/'

export default defineNuxtConfig({
  compatibilityDate: '2026-08-04',
  devtools: { enabled: false },
  modules: ['@nuxt/eslint'],
  components: [{ path: '~/components', pathPrefix: false }],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    baseURL,
    head: {
      link: [{ rel: 'icon', type: 'image/svg+xml', href: `${baseURL}images/favicon.svg` }],
    },
  },
  nitro: {
    preset: process.env.NITRO_PRESET || undefined,
    prerender: { routes: ['/'] },
  },
  runtimeConfig: {
    public: { repositoryName },
  },
  typescript: { typeCheck: true },
})
