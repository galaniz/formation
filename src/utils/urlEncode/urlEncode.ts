/**
 * Utils - Url Encode
 */

/* Imports */

import { isObject } from '../isObject/isObject'
import { getObjectKeys } from '../getObjectKeys/getObjectKeys'
import { config } from '../../config/config'

/**
 * Function - recursively convert object key value pairs into url encoded string
 *
 * @param {object} value - Only parameter that needs to be passed
 * @param {string} [_key] - Store key to reflect nested properties
 * @param {string[]} [_list] - Store key value pairs for iteration
 * @return {string}
 */
const urlEncode = <T>(value: T, _key?: string, _list: string[] = []): string => {
  if (isObject(value)) {
    getObjectKeys(value).forEach((k) => {
      const v = value[k]

      urlEncode(v, _key !== undefined ? `${_key.toString()}[${k.toString()}]` : k.toString(), _list)
    })
  } else {
    let str = String(value)

    if (config.wellFormed) {
      /* @ts-expect-error */
      str = str.toWellFormed()
    }

    const kv = _key !== undefined ? `${_key}=${encodeURIComponent(str)}` : ''

    if (kv !== '') {
      _list.push(kv)
    }
  }

  return _list.join('&')
}

/* Exports */

export { urlEncode }
