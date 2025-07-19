/**
 * Utils - Object To Form Data
 */

/* Imports */

import { isObjectStrict } from './object.js'
import { isStringStrict } from '../string/string.js'
import { getObjectKeys } from './objectKeys.js'
import { isFile, isBlob } from '../file/file.js'
import { isArray } from '../array/array.js'

/**
 * Recursively convert object key value pairs into form data.
 *
 * @param {object|string} value - Object stringified if toString true.
 * @param {boolean} [toString=false]
 * @return {FormData}
 */
const objectToFormData = (
  value: object | string,
  toString = false,
  _key?: string, // Store key to reflect nested properties
  _data: FormData = new FormData()
): FormData => {
  const isKeySet = isStringStrict(_key)

  if (isObjectStrict(value) || isArray(value)) {
    getObjectKeys(value).forEach(k => {
      const v = value[k]
      const isObj = isObjectStrict(v) || isArray(v)
      const _k = (k as string).toString()

      objectToFormData(
        toString && isObj ? JSON.stringify(v) : v,
        toString,
        isKeySet ? `${_key.toString()}[${_k}]` : _k,
        _data
      )
    })
  } else {
    const v = isFile(value) || isBlob(value) ? value : String(value)

    if (isKeySet) {
      _data.append(_key, v)
    }
  }

  return _data
}

/* Exports */

export { objectToFormData }
