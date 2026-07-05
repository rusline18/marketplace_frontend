// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Used for server-side (SSR) requests, where "localhost" would resolve to the
    // frontend container itself rather than the host machine running the backend.
    apiBaseInternal: process.env.NUXT_API_BASE_INTERNAL || 'http://host.docker.internal:8092',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8092',
    },
  },

  modules: [
    '@nuxt/a11y',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@nuxt/image'
  ]
})