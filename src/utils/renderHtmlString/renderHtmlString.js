/**
 * Utils - Render Html String
 */

/* Imports */

import { isObject } from '../isObject/isObject'

/**
 * Recursively output html string from array or object of data
 *
 * @param {object} functions
 * @param {object|object[]} items
 * @return {string}
 */

const renderHtmlString = (
  functions = {},
  items,
  _output = { html: '' },
  _parents = []
) => {
  if (Array.isArray(items)) {
    items.forEach((item) => {
      renderHtmlString(functions, item, _output, _parents)
    })
  }

  if (isObject(items)) {
    const { renderType, content } = items

    const renderFunction = functions[renderType]

    if (typeof renderFunction === 'function') {
      const args = { ...items }

      let children = []

      if (Array.isArray(content)) {
        children = [...content]

        args.content = undefined
      }

      const renderArgs = {
        args,
        children,
        parents: _parents
      }

      let renderObj = {
        start: '',
        end: ''
      }

      const renderOutput = renderFunction(renderArgs)

      if (typeof renderOutput === 'string') {
        renderObj.start = renderOutput
      } else {
        renderObj = renderOutput
      }

      const start = renderObj.start
      const end = renderObj.end

      _output.html += start

      if (Array.isArray(children) && children.length !== 0) {
        _parents.unshift({ args })

        renderHtmlString(functions, children, _output, _parents)
      }

      _output.html += end
    }
  }

  return _output.html
}

/* Exports */

export { renderHtmlString }
