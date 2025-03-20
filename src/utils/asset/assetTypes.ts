/**
 * Utils - Asset Types
 */

/**
 * @typedef {HTMLImageElement|HTMLMediaElement|HTMLIFrameElement} Asset
 */
export type Asset = HTMLImageElement | HTMLMediaElement | HTMLIFrameElement | null

/**
 * Callback on error or success
 *
 * @typedef {function} AssetDone
 * @param {Asset[]|boolean} result
 * @param {Event|Error} [error]
 * @return {void}
 */
export type AssetDone = (result: Asset[] | boolean, error?: Event | Error) => void
