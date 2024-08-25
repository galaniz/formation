/**
 * Utils - Render Html String
 */

/* Imports */

import type {
  RenderHtmlElementArgs,
  RenderHtmlItems,
  RenderHtmlParents,
  RenderHtmlFunctions,
  RenderHtmlStringFunctions
} from './renderHtmlTypes'
import { isObjectStrict } from '../isObject/isObject'
import { isArray, isArrayStrict } from '../isArray/isArray'
import { isFunction } from '../isFunction/isFunction'
import { isString } from '../isString/isString'
import { getObjectKeys } from '../getObjectKeys/getObjectKeys'

/**
 * Output single html element with specified attributes and properties
 *
 * @param {import('./renderHtmlTypes').RenderHtmlElementArgs} args
 * @return {HTMLElement|null}
 */
const renderHtmlElement = (args: RenderHtmlElementArgs): HTMLElement | null => {
  if (!isObjectStrict(args)) {
    return null
  }

  const {
    tag,
    attrs,
    props
  } = args

  const el = document.createElement(tag)

  if (isObjectStrict(props)) {
    getObjectKeys(props).forEach((prop) => {
      // @ts-expect-error
      el[prop] = props[prop]
    })
  }

  if (isObjectStrict(attrs)) {
    Object.keys(attrs).forEach((attr) => {
      const value = attrs[attr]

      if (!isString(value)) {
        return
      }

      el.setAttribute(attr, value)
    })
  }

  return el
}

/**
 * Recursively output html element(s) from array or object of data
 *
 * @param {import('./renderHtmlTypes').RenderHtmlFunctions} functions
 * @param {
 * import('./renderHtmlTypes').RenderHtmlItems|
 * import('./renderHtmlTypes').RenderHtmlItems[]
 * } items
 * @return {HTMLElement|null}
 */
const renderHtml = (
  functions: RenderHtmlFunctions,
  items: RenderHtmlItems | RenderHtmlItems[],
  _output: HTMLElement | null = null,
  _parents: RenderHtmlParents[] = []
): HTMLElement | null => {
  /* Functions object required */

  if (!isObjectStrict(functions)) {
    return null
  }

  /* Type */

  const isArr = isArray(items)
  const isObj = isObjectStrict(items)

  /* Recurse array items */

  if (isArr) {
    items.forEach((item) => {
      renderHtml(functions, item, _output, _parents)
    })
  }

  /* Recurse object items */

  if (isObj) {
    const { renderType, content } = items

    const renderFunction = functions[renderType]

    if (!isFunction(renderFunction)) {
      return _output
    }

    const args = { ...items }

    let children: string | RenderHtmlItems[] = []

    if (isArray(content)) {
      children = [...content]

      args.content = undefined
    }

    const output = renderHtmlElement(
      renderFunction({
        args,
        children,
        parents: _parents
      })
    )

    if (output === null) {
      return _output
    }

    if (_output === null) {
      _output = output
    } else {
      _output.appendChild(output)
    }

    if (isArrayStrict(children)) {
      _parents.unshift({ args })

      renderHtml(functions, children, output, _parents)
    }
  }

  /* Output */

  return _output
}

/**
 * Recursively output html string from array or object of data
 *
 * @param {import('./renderHtmlTypes').RenderHtmlStringFunctions} functions
 * @param {
 * import('./renderHtmlTypes').RenderHtmlItems|
 * import('./renderHtmlTypes').RenderHtmlItems[]
 * } items
 * @return {string}
 */
const renderHtmlString = (
  functions: RenderHtmlStringFunctions,
  items: RenderHtmlItems | RenderHtmlItems[],
  _output = { html: '' },
  _parents: RenderHtmlParents[] = []
): string => {
  /* Functions object required */

  if (!isObjectStrict(functions)) {
    return _output.html
  }

  /* Type */

  const isArr = isArray(items)
  const isObj = isObjectStrict(items)

  /* Recurse array items */

  if (isArr) {
    items.forEach((item) => {
      renderHtmlString(functions, item, _output, _parents)
    })
  }

  /* Recurse object items */

  if (isObj) {
    const { renderType, content } = items

    const renderFunction = functions[renderType]

    if (!isFunction(renderFunction)) {
      return _output.html
    }

    const args = { ...items }

    let children: string | RenderHtmlItems[] = []

    if (isArray(content)) {
      children = [...content]

      args.content = undefined
    }

    let renderObj = {
      start: '',
      end: ''
    }

    const renderOutput = renderFunction({
      args,
      children,
      parents: _parents
    })

    if (isString(renderOutput)) {
      renderObj.start = renderOutput
    }

    if (isObjectStrict(renderOutput)) {
      renderObj = renderOutput
    }

    const start = renderObj.start
    const end = renderObj.end

    _output.html += start

    if (isArrayStrict(children)) {
      _parents.unshift({ args })

      renderHtmlString(functions, children, _output, _parents)
    }

    _output.html += end
  }

  /* Output */

  return _output.html
}

/* Exports */

export {
  renderHtml,
  renderHtmlElement,
  renderHtmlString
}
