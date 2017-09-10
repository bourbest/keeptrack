import i18n from 'i18next'
import XHR from 'i18next-xhr-backend'

let instance = null
export default function create (currentLanguage) {
  if (instance == null) {
    instance = i18n
    let lngDetector = {
      type: 'languageDetector',
      init: function (services, detectorOptions, i18nextOptions) { /* use services and options */ },
      detect: function () { return currentLanguage },
      cacheUserLanguage: function (lng) {
        currentLanguage = lng
      }
    }
    i18n
      .use(XHR)
      .use(lngDetector)
      // .use(Cache)
      .init({
        fallbackLng: 'fr',

        // have a common namespace used around the full app
        ns: ['languages'],
        defaultNS: 'languages',

        debug: false,
        // cache: {
        //   enabled: true
        // },
        backend: {
          // path where resources get loaded from
          loadPath: '/public/locales/languages_{{lng}}.json'
        },
        interpolation: {
          escapeValue: false, // not needed for react!!
          formatSeparator: ',',
          format: function (value, format, lng) {
            if (format === 'uppercase') return value.toUpperCase()
            return value
          }
        }
      })
    window.i18n = instance
  }
  return instance
}
