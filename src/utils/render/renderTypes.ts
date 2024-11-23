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
 * @typedef RenderItems
 * @type {Generic}
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
  args: RenderItems & Generic
}

/**
 * @typedef {object} RenderFunctionArgs
 * @prop {RenderItems} args
 * @prop {RenderItems[]} children
 * @prop {RenderParents[]} parents
 */
export interface RenderFunctionArgs<T = any> {
  args: 0 extends (1 & T) ? RenderItems : T extends object ? T & RenderItems : {}
  children: RenderItems[]
  parents: RenderParents[]
}

/**
 * @typedef {object} RenderStringReturn
 * @prop {string} start
 * @prop {string} end
 */
export interface RenderStringReturn {
  start: string
  end: string
}

/**
 * @typedef {function} RenderStringFunction
 * @param {RenderFunctionArgs} obj
 * @return {string|RenderStringReturn}
 */
export type RenderStringFunction<T = any> = (obj: RenderFunctionArgs<T>) => string | RenderStringReturn

/**
 * @typedef {Object<string, RenderStringFunction>} RenderStringFunctions
 */
export type RenderStringFunctions<T = any> = Record<string, RenderStringFunction<T>>

/**
 * @typedef {function} RenderFunction
 * @param {RenderFunctionArgs} obj
 * @return {RenderElementArgs}
 */
export type RenderFunction<T = any> = (obj: RenderFunctionArgs<T>) => RenderElementArgs

/**
 * @typedef {Object<string, RenderFunction>} RenderFunctions
 */
export type RenderFunctions<T = any> = Record<string, RenderFunction<T>>
