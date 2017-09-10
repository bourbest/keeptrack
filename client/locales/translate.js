import i18next from 'i18next'
import {isObject} from 'lodash'

// instance is this pointer of React Controler that should have a props.locale
export const createTranslate = (defaultPrefix, instance) => {
  return (messageKey, _prefix, _params = {}) => {
    const params = isObject(_prefix) ? _prefix : _params
    const prefix = isObject(_prefix) ? null : _prefix
    let key = messageKey

    params.lng = instance.props.locale
    if (prefix) {
      key = prefix + '.' + key
    } else if (defaultPrefix) {
      key = defaultPrefix + '.' + key
    }
    return i18next.t(key, params)
  }
}

export const translateError = (error, locale) => {
  let errMsg = ''
  if (isObject(error)) {
    const params = {lng: locale, ...error.params}
    errMsg = i18next.t(error.error, params)
  } else {
    errMsg = error.indexOf(' ') >= 0 ? error : i18next.t(error, {lng: locale})
  }
  return errMsg
}
