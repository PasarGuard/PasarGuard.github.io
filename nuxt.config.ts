// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ['shadcn-docs-nuxt'],
  
  // Site configuration for OG Images absolute URLs
  site: {
    url: 'https://pasarguard.github.io',
  },
  
  // Add modules
  modules: [
    '@nuxt/fonts',
    '@nuxtjs/i18n'
  ],
  
  // Enable static site generation for GitHub Pages
  nitro: {
    prerender: {
      routes: ['/sitemap.xml'],
      // Ignore 404 errors for missing content during prerendering
      ignore: ['/api/_content/query/**'],
      // Continue on error to complete the build
      failOnError: false
    }
  },
  
  // Configure for GitHub Pages deployment
  experimental: {
    payloadExtraction: false
  },
  
  // Ensure proper routing for GitHub Pages
  router: {
    options: {
      hashMode: false
    }
  },
  
  // Add CSS for Persian font and RTL support
  css: [
    '~/assets/css/fonts.css',
    '~/assets/css/tailwind.css'
  ],
  
  // Configure app head
  app: {
    head: {
      htmlAttrs: {
        lang: 'fa'
      }
    }
  },
  
  // Configure i18n for multi-language support
  i18n: {
    defaultLocale: 'fa',
    locales: [
      {
        code: 'fa',
        name: 'فارسی',
        language: 'fa-IR'
      },
      {
        code: 'en', 
        name: 'English',
        language: 'en-US'
      },
      {
        code: 'ru',
        name: 'Русский', 
        language: 'ru-RU'
      }
    ],
  },
  compatibilityDate: '2024-07-06',
});
