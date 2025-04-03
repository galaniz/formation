/**
 * Utils - Render Types
 */

/* Imports */

import type { Generic, GenericStrings, WritableKeys } from '../../global/globalTypes.js'

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
 * @typedef {object} RenderElementArgs
 * @prop {string} tag
 * @prop {GenericStrings} [attrs]
 * @prop {HTMLElement} [props]
 */
export interface RenderElementArgs {
  tag: string
  attrs?: GenericStrings
  props?: WritableHTMLElement
}

/**
 * @typedef {object} RenderItems
 * @extends {Generic}
 * @prop {string} renderType
 * @prop {string|RenderItems[]} [content]
 */
export interface RenderItems extends Generic {
  renderType: string
  content?: string | RenderItems[]
}

/**
 * @typedef {object} RenderParents
 * @prop {RenderItems} args
 */
export interface RenderParents {
  args: RenderItems
}

/**
 * @typedef {object} RenderFunctionArgs
 * @prop {RenderItems} args
 * @prop {RenderItems[]} children
 * @prop {RenderParents[]} parents
 */
export interface RenderFunctionArgs<T = any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  args: 0 extends (1 & T) ? RenderItems : T extends object ? T & RenderItems : object
  children: RenderItems[]
  parents: RenderParents[]
}

/**
 * @typedef {function} RenderStringFunction
 * @param {RenderFunctionArgs} args
 * @return {string|string[]}
 */
export type RenderStringFunction<T = any> = (args: RenderFunctionArgs<T>) => string | string[] // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * @typedef {Object<string, RenderStringFunction>} RenderStringFunctions
 */
export type RenderStringFunctions<T = any> = Record<string, RenderStringFunction<T>> // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * @typedef {function} RenderFunction
 * @param {RenderFunctionArgs} args
 * @return {RenderElementArgs}
 */
export type RenderFunction<T = any> = (args: RenderFunctionArgs<T>) => RenderElementArgs // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * @typedef {Object<string, RenderFunction>} RenderFunctions
 */
export type RenderFunctions<T = any> = Record<string, RenderFunction<T>> // eslint-disable-line @typescript-eslint/no-explicit-any
