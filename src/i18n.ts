import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from './locales/es.json';

// Spanish-only for v1. The t() wrapper stays so we can re-introduce
// additional languages later without refactoring components.
i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
    },
    lng: 'es',
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
