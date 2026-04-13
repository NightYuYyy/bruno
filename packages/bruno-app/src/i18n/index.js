import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEn from './translation/en.json';
import translationZhCN from './translation/zh-CN.json';

const resources = {
  'zh-CN': {
    translation: translationZhCN
  },
  'en': {
    translation: translationEn
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh-CN',
    fallbackLng: 'en',
    supportedLngs: ['zh-CN', 'en'],
    ns: 'translation',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
