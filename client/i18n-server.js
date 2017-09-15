import i18n from 'i18next'
import Backend from 'i18next-sync-fs-backend'

// import Cache from 'i18next-localstorage-cache';
export default function create () {
  i18n.use(Backend)
  // .use(Cache)
  .init({
    fallbackLng: 'fr',
    lngs: ['fr', 'en'],
    // have a common namespace used around the full app
    ns: ['languages'],
    defaultNS: 'languages',

    debug: false,

    // cache: {
    //   enabled: true
    // },
    backend: {
      // path where resources get loaded from
      loadPath: 'locales/languages_{{lng}}.json'
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

  let i18nEn = i18n
  let i18nFr = i18nEn.cloneInstance()
  i18nEn.loadNamespaces(['languages'], function () {
  })
  i18nFr.loadNamespaces(['languages'], function () {
  })

  i18nFr.changeLanguage('fr')
  i18nEn.changeLanguage('en')
  let i18nMap = { 'fr': i18nFr, 'en': i18nEn }

  return i18nMap
}

