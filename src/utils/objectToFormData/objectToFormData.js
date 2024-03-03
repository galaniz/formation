/**
 * Utils - Object To Form Data
 */

/**
 * Function - recursively convert object key value pairs into form data
 *
 * @param {object} o
 * @param {FormData} formData
 * @param {string} _key - store key to reflect nested properties
 * @return {void}
 */

const objectToFormData = (o, formData, _key) => {
  if (typeof (o) === 'object') {
    Object.keys(o || {}).forEach((k) => {
      objectToFormData(o[k], formData, _key ? _key + '[' + k + ']' : k)
    })
  } else {
    formData.append(_key, o)
  }
}

/* Exports */

export { objectToFormData }
