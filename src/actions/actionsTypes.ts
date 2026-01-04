/**
 * Actions - Types
 */

/**
 * @typedef {number[]} ActionResizeArgs - Old and new viewport widths.
 */
export type ActionResizeArgs = [number, number]

/**
 * @typedef {function} ActionResize
 * @param {ActionResizeArgs} args
 * @return {void}
 */
export type ActionResize = (args: ActionResizeArgs) => void
