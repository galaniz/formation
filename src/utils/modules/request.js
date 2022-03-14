/**
 * Utility modules: handle ajax requests
 *
 * @param args [object] {
 *  @prop method [string]
 *  @prop url [string]
 *  @prop headers [object]
 *  @prop body [string] url encoded or [form data]
 * }
 *
 * @return [promise] with response/error passed to it
 */

/* Module */

const request = (args) => {
  return new Promise((resolve, reject) => {
    const xhr = new window.XMLHttpRequest()

    xhr.open(args.method || 'GET', args.url)

    if (args.headers) {
      Object.keys(args.headers).forEach(key => {
        xhr.setRequestHeader(key, args.headers[key])
      })
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(xhr.responseText)
        } catch (e) {
          reject(new Error('Oops something went wrong.'))
        }
      } else {
        reject(xhr)
      }
    }

    xhr.onerror = () => reject(xhr)

    xhr.send(args.body || null)
  })
}

/* Exports */

export { request }
