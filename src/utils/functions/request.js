/**
 * Utils - request
 */

/**
 * Function - handle ajax requests with fetch method
 *
 * @param {object} args {
 *  @prop {string} method
 *  @prop {string} url
 *  @prop {object} headers
 *  @prop {string} body
 * }
 * @return {Promise}
 */

const request = (args) => {
  const {
    method = 'GET',
    url = '',
    headers,
    body
  } = args

  /* Fetch options */

  const reqArgs = {
    method
  }

  if (headers) {
    reqArgs.headers = headers
  }

  if (body) {
    reqArgs.body = body
  }

  /* Make request */

  return new Promise((resolve, reject) => {
    fetch(url, reqArgs)
      .then(res => {
        if (res.status >= 200 && res.status < 300) {
          try {
            resolve(res.text())
          } catch (err) {
            reject(err.message)
          }
        } else {
          reject(res)
        }
      })
      .catch((err) => {
        reject(err.message)
      })
  })
}

/* Exports */

export { request }
