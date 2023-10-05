/**
 * Utils - Cookies
 */

/**
 * Function - set browser cookie
 *
 * @param {string} name
 * @param {string} value
 * @param {number} expirationDays
 * @return {void}
 */

const setCookie = (name: string, value: string, expirationDays: number): void => {
  if (!name || !value) {
    return
  }

  let expires = ''

  if (expirationDays > 0) {
    const d = new Date()

    d.setTime(d.getTime() + expirationDays * 24 * 60 * 60 * 1000)

    expires = `expires=${d.toUTCString()};`
  }

  document.cookie = `${name}=${value};${expires}path=/`
}

/**
 * Function - get browser cookie
 *
 * @param {string} name
 * @return {string}
 */

const getCookie = (name: string): string => {
  if (!name) {
    return ''
  }

  const cookies = document.cookie.split(';')

  for (let i = 0; i < cookies.length; i += 1) {
    const cookie = cookies[i]
    const c = cookie.split('=')

    if (c[0].trim() === name) {
      return c[1]
    }
  }

  return ''
}

/* Exports */

export { setCookie, getCookie }
