/**
 * Utils - Url Encode
 */

/**
 * Function - recursively convert object key value pairs into url encoded string
 *
 * @param {object} o - only parameter that needs to be pased
 * @param {string} _key - store key to reflect nested properties
 * @param {array} _list - store key value pairs for iteration
 * @return {string}
 */

const urlEncode = (o, _key, _list = []) => {
  if (typeof (o) === 'object') {
    Object.keys(o || {}).forEach((idx) => {
      urlEncode(o[idx], _key ? _key + '[' + idx + ']' : idx, _list)
    })
  } else {
    _list.push(_key + '=' + encodeURIComponent(o))
  }

  return _list.join('&')
}

/* Exports */

export { urlEncode }
