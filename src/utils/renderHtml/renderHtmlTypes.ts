/**
 * Utils - Render Html String Types
 */

/* Imports */

import type { Generic, GenericStrings, WritableKeys } from '../../global/globalTypes'

/**
 * HTMLElement write keys
 */
type WritableHTMLElementKeys = WritableKeys<HTMLElement>

/**
 * HTMLElement write properities
 */
type WritableHTMLElement = {
  [K in WritableHTMLElementKeys]?: string | number | boolean
}

/**
 * @typedef {object} RenderHtmlElementArgs
 * @prop {string} tag
 * @prop {import('../../global/globalTypes').GenericStrings} [attrs]
 * @prop {HTMLElement} [props]
 */
export interface RenderHtmlElementArgs {
  tag: string
  attrs?: GenericStrings
  props?: WritableHTMLElement
}

/**
 * @typedef RenderHtmlItems
 * @type {import('../../global/globalTypes').Generic}
 * @prop {string} renderType
 * @prop {string|RenderHtmlItems[]} [content]
 */
export interface RenderHtmlItems extends Generic {
  renderType: string
  content?: string | RenderHtmlItems[]
}

/**
 * @typedef {object} RenderHtmlParents
 * @prop {RenderHtmlItems} args
 */
export interface RenderHtmlParents {
  args: RenderHtmlItems & Generic
}

/**
 * @typedef {object} RenderHtmlFunctionArgs
 * @prop {RenderHtmlItems} args
 * @prop {RenderHtmlItems[]} children
 * @prop {RenderHtmlParents[]} parents
 */
export interface RenderHtmlFunctionArgs<T = any> {
  args: 0 extends (1 & T) ? RenderHtmlItems : T extends object ? T & RenderHtmlItems : {}
  children: RenderHtmlItems[]
  parents: RenderHtmlParents[]
}

/**
 * @typedef {object} RenderHtmlStringReturn
 * @prop {string} start
 * @prop {string} end
 */
export interface RenderHtmlStringReturn {
  start: string
  end: string
}

/**
 * @typedef {function} RenderHtmlStringFunction
 * @param {RenderHtmlFunctionArgs} obj
 * @return {string|RenderHtmlStringReturn}
 */
export type RenderHtmlStringFunction<T = any> = (obj: RenderHtmlFunctionArgs<T>) => string | RenderHtmlStringReturn

/**
 * @typedef {Object<string, RenderHtmlStringFunction>} RenderHtmlStringFunctions
 */
export type RenderHtmlStringFunctions<T = any> = Record<string, RenderHtmlStringFunction<T>>

/**
 * @typedef {function} RenderHtmlFunction
 * @param {RenderHtmlFunctionArgs} obj
 * @return {RenderHtmlElementArgs}
 */
export type RenderHtmlFunction<T = any> = (obj: RenderHtmlFunctionArgs<T>) => RenderHtmlElementArgs

/**
 * @typedef {Object<string, RenderHtmlFunction>} RenderHtmlFunctions
 */
export type RenderHtmlFunctions<T = any> = Record<string, RenderHtmlFunction<T>>
