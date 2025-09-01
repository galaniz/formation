/**
 * Utils - URL
 */

/* Imports */

import { isObject } from '../object/object.js'
import { isArray } from '../array/array.js'
import { config } from '../../config/config.js'

/**
 * Recursively convert object key value pairs into url encoded string.
 *
 * @param {object} value
 * @return {string}
 */
const urlEncode = (
  value: object,
  _key?: string, // Store key to reflect nested properties
  _data: string[] = [] // Store key value pairs for iteration
): string => {
  if (isObject(value)) {
    const isArr = isArray(value)

    if (isArr && _key == null) {
      _key = ''
    }

    Object.keys(value).forEach(k => {
      urlEncode((value as Record<string, unknown>)[k] as object, _key != null ? `${_key}[${k}]` : k, _data)
    })
  } else {
    let str = String(value)

    if (config.wellFormed) {
      // @ts-expect-error - to well formed 2024 lib
      str = str.toWellFormed() as string // eslint-disable-line @typescript-eslint/no-unsafe-call
    }

    const kv = _key != null ? `${_key}=${encodeURIComponent(str)}` : ''

    if (kv !== '') {
      _data.push(kv)
    }
  }

  return _data.join('&')
}

/* Exports */

export { urlEncode }
