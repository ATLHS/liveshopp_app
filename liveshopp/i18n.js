import { initReactI18next } from 'react-i18next';

import i18next from 'i18next';

import RNLanguageDetector from '@os-team/i18next-react-native-language-detector';

i18next
  .use(RNLanguageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en'],
    resources: {
      fr: {
        translation: require('./assets/locales/fr/translation.json'),
      },
      en: {
        translation: require('./assets/locales/en/translation.json'),
      },
    },
  });

export default i18next;
