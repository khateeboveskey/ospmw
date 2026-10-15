export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  ssr: false,
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'ar', dir: 'rtl' },
      title: 'إدارة المشاريع البرمجية مع Git و GitHub',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0a4560' },
        { name: 'description', content: 'ورشة عمل: إدارة المشاريع البرمجية، Git من الصفر، و GitHub والعمل الجماعي — مبادرة أسس' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap' },
        { rel: 'preload', href: '/fonts/thmanyahserifdisplay-Bold.otf', as: 'font', type: 'font/otf', crossorigin: '' },
        { rel: 'preload', href: '/fonts/thmanyahsans-Regular.otf', as: 'font', type: 'font/otf', crossorigin: '' },
      ],
    },
  },
})
