import {
  map,
  isArray,
  isFunction,
  isObject,
  camelCase,
  transform,
  lowerFirst,
  upperFirst
} from 'lodash'

import moment from 'moment'

function normalizeObjKeys (pValue, customTransformFn = undefined) {
  if (isArray(pValue)) {
    return map(pValue, (obj) => normalizeObjKeys(obj))
  } else if (isObject(pValue) && !moment.isMoment(pValue)) {
    return transform(pValue, (result, value, pKey) => {
      let key = pKey
      if (!isFunction(customTransformFn) || !customTransformFn(result, value, key)) {
        const normalizedValue = normalizeObjKeys(value, customTransformFn)
        if (key.indexOf('_') >= 0) {
          key = camelCase(key)
        }
        result[lowerFirst(key)] = normalizedValue
      }
      return result
    })
  }
  return pValue
}

function denormalizeObjKeys (pValue, customTransformFn = undefined) {
  if (isArray(pValue)) {
    return map(pValue, (obj) => denormalizeObjKeys(obj, customTransformFn))
  } else if (isObject(pValue) && !isArray(pValue) && !moment.isMoment(pValue)) {
    return transform(pValue, (result, value, key) => {
      if (!isFunction(customTransformFn) || !customTransformFn(result, value, key)) {
        const denormalizedValue = denormalizeObjKeys(value, customTransformFn)
        result[upperFirst(key)] = denormalizedValue
      }
      return result
    })
  }
  return pValue
}

export function normalize (json, customTransformFn = undefined) {
  if (isArray(json)) {
    return map(json, obj => normalizeObjKeys(obj, customTransformFn))
  }
  return normalizeObjKeys(json, customTransformFn)
}

export function denormalize (json, customTransformFn = undefined) {
  if (isArray(json)) {
    return map(json, obj => denormalizeObjKeys(obj, customTransformFn))
  }
  return denormalizeObjKeys(json, customTransformFn)
}
