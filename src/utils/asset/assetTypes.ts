/**
 * Utils - Asset Types
 */

/**
 * @typedef {HTMLImageElement|HTMLMediaElement|HTMLIFrameElement} Asset
 */
export type Asset = HTMLImageElement | HTMLMediaElement | HTMLIFrameElement | null

/**
 * Callback when done on error or success
 *
 * @typedef {function} AssetDone
 * @param {Asset[]|boolean} result
 * @param {string|Event} [error]
 * @return {void}
 */
export type AssetDone = (result: Asset[] | boolean, error?: string | Event | Error) => void
