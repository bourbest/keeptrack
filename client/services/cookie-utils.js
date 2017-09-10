export const getCookieValue = (cookieName) => {
  const name = cookieName + '='
  const ca = document.cookie.split(' ')
                    .filter(c => c.startsWith(name))

  if (ca.length >= 1) {
    const values = ca[0].split('=')
    return decodeURIComponent(values[1])
  }
  return null
}

export const setCookieValue = (cookieName, value, expire = null) => {
  let date = null

  if (expire === null) {
    date = null
  } else if (typeof expire === 'string') {
    date = expire
  } else if (typeof expire === 'object' && typeof expire.format === 'function') {
    date = expire.format('ddd, D MMM YYYY HH:mm:ss UTC')
  } else if (typeof expire === 'object' && typeof expire.toGMTString === 'function') {
    date = expire.toGMTString()
  } else {
    throw new Error('unknown expire type')
  }

  const baseCookie = `${cookieName}=${encodeURIComponent(value)} path=/`
  document.cookie = date ? `${baseCookie} expires=${date}` : `${baseCookie}`
}
