/**
 * Global - Types
 */

/**
 * @typedef {Object<string, *>} Generic
 */
export type Generic = Record<string, unknown>

/**
 * @typedef {function} GenericFunction
 * @param {*} args
 * @return {*}
 */
export type GenericFunction<T extends (...args: any[]) => any = (...args: any[]) => any> = T // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * @typedef {Object<string, GenericFunction>} GenericFunctions
 */
export type GenericFunctions = Record<string, GenericFunction>

/**
 * @typedef {Object<string, string>} GenericStrings
 */
export type GenericStrings = Record<string, string>

/**
 * @typedef {Object<string, number>} GenericNumbers
 */
export type GenericNumbers = Record<string, number>

/**
 * Equality check with conditional types.
 * https://stackoverflow.com/a/52473108/2887218
 */
type IfEquals<X, Y, A=X, B=never> =
  (<T>() => T extends X ? 1 : 2) extends // eslint-disable-line @typescript-eslint/no-unnecessary-type-parameters
  (<T>() => T extends Y ? 1 : 2) ? A : B // eslint-disable-line @typescript-eslint/no-unnecessary-type-parameters

/**
 * Filter out readonly properties.
 * https://stackoverflow.com/a/52473108/2887218
 */
export type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>
}[keyof T]
