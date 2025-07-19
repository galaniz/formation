/**
 * Utils - Render
 */

/* Imports */

import type {
  RenderElementArgs,
  RenderItems,
  RenderParents,
  RenderFunctions,
  RenderStringFunctions
} from './renderTypes.js'
import { isObjectStrict } from '../object/object.js'
import { isArray, isArrayStrict } from '../array/array.js'
import { isString, isStringStrict } from '../string/string.js'
import { isFunction } from '../function/function.js'
import { isHtmlElement } from '../html/html.js'
import { getObjectKeys } from '../object/objectKeys.js'

/**
 * Output single html element with specified attributes and properties.
 *
 * @param {RenderElementArgs} args
 * @return {HTMLElement|null}
 */
const renderElement = <T extends HTMLElement>(args: RenderElementArgs): T | null => { // eslint-disable-line @typescript-eslint/no-unnecessary-type-parameters
  if (!isObjectStrict(args)) {
    return null
  }

  const {
    tag,
    attrs,
    props
  } = args

  if (!isStringStrict(tag)) {
    return null
  }

  const el = document.createElement(tag)

  if (isObjectStrict(props)) {
    getObjectKeys(props).forEach(prop => {
      // @ts-expect-error - flexible property setting
      el[prop] = props[prop]
    })
  }

  if (isObjectStrict(attrs)) {
    Object.keys(attrs).forEach(attr => {
      const value = attrs[attr]

      if (!isString(value)) {
        return
      }

      el.setAttribute(attr, value)
    })
  }

  return el as T
}

/**
 * Recursively output html element(s) from array or object of data.
 *
 * @param {RenderFunctions} functions
 * @param {RenderItems|RenderItems[]} items
 * @return {HTMLElement|null}
 */
const render = <T extends HTMLElement>(
  functions: RenderFunctions,
  items: RenderItems | RenderItems[],
  _output: T | null = null,
  _parents: RenderParents[] = []
): T | null => {
  /* Functions object required */

  if (!isObjectStrict(functions)) {
    return null
  }

  /* Type */

  const isArr = isArray(items)
  const isObj = isObjectStrict(items)

  /* Recurse array items */

  if (isArr) {
    items.forEach(item => {
      render(functions, item, _output, _parents)
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

    let children: string | RenderItems[] = []

    if (isArray(content)) {
      children = [...content]

      args.content = undefined
    }

    const output = renderElement(
      renderFunction({
        args,
        children,
        parents: _parents
      })
    )

    if (!isHtmlElement(output)) {
      return _output
    }

    if (isHtmlElement(_output)) {
      _output.append(output)
    } else {
      _output = output as T
    }

    if (isArrayStrict(children)) {
      _parents.unshift({ args })

      render(functions, children, output, _parents)
    }
  }

  /* Output */

  return _output
}

/**
 * Recursively output html string from array or object of data.
 *
 * @param {RenderStringFunctions} functions
 * @param {RenderItems|RenderItems[]} items
 * @return {string}
 */
const renderString = (
  functions: RenderStringFunctions,
  items: RenderItems | RenderItems[],
  _output = { html: '' },
  _parents: RenderParents[] = []
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
    items.forEach(item => {
      renderString(functions, item, _output, _parents)
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

    let children: string | RenderItems[] = []

    if (isArray(content)) {
      children = [...content]

      args.content = undefined
    }

    let start = ''
    let end  = ''

    const renderOutput = renderFunction({
      args,
      children,
      parents: _parents
    })

    if (isString(renderOutput)) {
      start = renderOutput
    }

    if (isArrayStrict(renderOutput)) {
      const [arrStart, arrEnd] = renderOutput

      if (isStringStrict(arrStart) && isStringStrict(arrEnd)) {
        start = arrStart
        end = arrEnd
      }
    }

    _output.html += start

    if (isArrayStrict(children)) {
      _parents.unshift({ args })

      renderString(functions, children, _output, _parents)
    }

    _output.html += end
  }

  /* Output */

  return _output.html
}

/* Exports */

export {
  render,
  renderElement,
  renderString
}
