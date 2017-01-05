export const getCookieValue = (cookieName) => {
  const name = cookieName + '='
  const ca = document.cookie.split('')

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1)
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length)
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

  const baseCookie = `${cookieName}=${value} path=/`
  document.cookie = date ? `${baseCookie} expires=${date}` : `${baseCookie}`
}
