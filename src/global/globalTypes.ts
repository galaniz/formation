/**
 * Global - Types
 */

/**
 * @typedef {Object.<string, *>} Generic
 */
export interface Generic {
  [key: string]: unknown
}

/**
 * @typedef {Object.<string, function>} GenericFunctions
 */
export interface GenericFunctions {
  [key: string]: Function
}

/**
 * @typedef {Object.<string, string>} GenericStrings
 */
export interface GenericStrings {
  [key: string]: string
}

/**
 * @typedef {Object.<string, number>} GenericNumbers
 */
export interface GenericNumbers {
  [key: string]: number
}

/**
 * Equality check with conditional types
 *
 * Source: https://stackoverflow.com/a/52473108/2887218
 */
type IfEquals<X, Y, A=X, B=never> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? A : B

/**
 * Filter out readonly properties
 *
 * Source: https://stackoverflow.com/a/52473108/2887218
 */
export type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>
}[keyof T]
