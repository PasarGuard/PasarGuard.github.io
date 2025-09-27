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
    '@nuxt/fonts'
  ],
  
  // Enable static site generation for GitHub Pages
  nitro: {
    prerender: {
      routes: ['/sitemap.xml']
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
  
  i18n: {
    defaultLocale: 'fa' as any,
    locales: [
      {
        code: 'fa',
        name: 'Persian',
        language: 'fa-IR'
      },
      {
        code: 'en',
        name: 'English',
        language: 'en-US'
      },
      {
        code: 'ru',
        name: 'Russian',
        language: 'ru-RU'
      },
      {
        code: 'zh',
        name: 'Chinese',
        language: 'zh-CN'
      },
    ],
  },
  compatibilityDate: '2024-07-06',
});
