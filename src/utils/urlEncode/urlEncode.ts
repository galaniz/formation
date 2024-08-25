/**
 * Utils - Url Encode
 */

/* Imports */

import { isObject } from '../isObject/isObject'
import { getObjectKeys } from '../getObjectKeys/getObjectKeys'
import { isArray } from '../isArray/isArray'
import { config } from '../../config/config'

/**
 * Recursively convert object key value pairs into url encoded string
 *
 * @param {object} value
 * @return {string}
 */
const urlEncode = <T>(
  value: T,
  _key?: string, // Store key to reflect nested properties
  _data: string[] = [] // Store key value pairs for iteration
): string => {
  if (isObject(value)) {
    const isArr = isArray(value)

    if (isArr && _key === undefined) {
      _key = ''
    }

    getObjectKeys(value).forEach((k) => {
      const v = value[k]

      urlEncode(v, _key !== undefined ? `${_key.toString()}[${k.toString()}]` : k.toString(), _data)
    })
  } else {
    let str = String(value)

    if (config.wellFormed) {
      str = str.toWellFormed()
    }

    const kv = _key !== undefined ? `${_key}=${encodeURIComponent(str)}` : ''

    if (kv !== '') {
      _data.push(kv)
    }
  }

  return _data.join('&')
}

/* Exports */

export { urlEncode }
