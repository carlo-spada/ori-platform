import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

// Only use browser-specific plugins when running in the browser
const isBrowser = typeof window !== 'undefined'

if (isBrowser) {
  i18n.use(Backend).use(LanguageDetector)
}

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: 'en', // Set default language for SSR
  debug: process.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false, // React already protects from XSS
  },
  backend: isBrowser
    ? {
        loadPath: '/locales/{{lng}}/translation.json',
      }
    : undefined,
  // Provide empty resources for SSR to prevent hanging
  resources: !isBrowser
    ? {
        en: {
          translation: {},
        },
      }
    : undefined,
})

export default i18n
