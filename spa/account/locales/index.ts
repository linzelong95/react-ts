import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { locale } from 'moment'
import en from './en'
import zh from './zh-cn'

i18next
  .use(LanguageDetector) // 嗅探当前浏览器语言
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: en,
      },
      'zh-CN': {
        translation: zh,
      },
    },
    lng: navigator.language,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

i18next.on('languageChanged', function (lng) {
  locale(lng.toLowerCase())
})

export default i18next
