/**
 * Utils - Resize Types
 */

/**
 * @typedef {number[]} ResizeActionArgs - Old and new viewport widths.
 */
export type ResizeActionArgs = [number, number]

/**
 * @typedef {function} ResizeAction
 * @param {ResizeActionArgs} args
 * @return {void}
 */
export type ResizeAction = (args: ResizeActionArgs) => void
