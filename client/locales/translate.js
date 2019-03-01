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

export const translate = (key, locale) => {
  return i18next.t(key, {lng: locale})
}

export const translateError = (error, locale) => {
  let errMsg = ''
  if (isObject(error)) {
    const params = {lng: locale, ...error.params}
    if (params.otherFieldLabel) {
      params.otherFieldLabel = i18next.t(params.otherFieldLabel, params)
    }
    errMsg = i18next.t(error.error, params)
  } else {
    errMsg = error.indexOf(' ') >= 0 ? error : i18next.t(error, {lng: locale})
  }
  return errMsg
}
