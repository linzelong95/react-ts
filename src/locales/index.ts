import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import moment from 'moment'
import en from './en'
import zh from './zh-cn'
import 'moment/locale/zh-cn'

i18next
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
    lng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

i18next.on('languageChanged', function (lng) {
  moment.locale(lng.toLowerCase())
})

export default i18next
