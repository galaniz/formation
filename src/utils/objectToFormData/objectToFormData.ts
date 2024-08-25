/**
 * Utils - Object To Form Data
 */

/* Imports */

import { isObjectStrict } from '../isObject/isObject'
import { isStringStrict } from '../isString/isString'
import { getObjectKeys } from '../getObjectKeys/getObjectKeys'
import { isFile, isBlob } from '../isFile/isFile'
import { isArray } from '../isArray/isArray'

/**
 * Recursively convert object key value pairs into form data
 *
 * @param {object} value
 * @param {boolean} objToStr
 * @return {FormData}
 */
const objectToFormData = <T>(
  value: T,
  objToStr: boolean = false,
  _key?: string, // Store key to reflect nested properties
  _data: FormData = new FormData()
): FormData => {
  const isKeySet = isStringStrict(_key)

  if (isObjectStrict(value) || isArray(value)) {
    getObjectKeys(value).forEach((k) => {
      const v = value[k]
      const isObj = isObjectStrict(v) || isArray(v)

      objectToFormData(
        objToStr && isObj ? JSON.stringify(v) : v,
        objToStr,
        isKeySet ? `${_key.toString()}[${k.toString()}]` : k.toString(),
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
