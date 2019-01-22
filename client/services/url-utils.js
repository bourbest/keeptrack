export const encodeArrayForUrl = (values) => {
  const encodedValues = values.map(encodeURIComponent)
  return encodedValues.join(',')
}

export const getArrayFromUrlParam = (urlParam) => {
  const encodedValues = urlParam.split(',')
  return encodedValues.map(decodeURIComponent)
}

export const buildQueryForUrl = (filterParams) => {
  const query = []
  if (filterParams) {
    for (let fieldName in filterParams) {
      const fieldValue = filterParams[fieldName]
      if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
        const param = `${fieldName}=${encodeURIComponent(fieldValue.toString())}`
        query.push(param)
      }
    }
  }

  if (query.length) {
    const urlParams = `?${query.join('&')}`
    return urlParams
  }
  return ''
}

export const buildUrl = (basePath, filterParams) => {
  const urlParams = buildQueryForUrl(filterParams)
  return basePath + urlParams
}
