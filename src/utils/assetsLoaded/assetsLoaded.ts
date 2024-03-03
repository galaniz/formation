/**
 * Utils - Assets Loaded
 */

/* Imports */

import { isHTMLElement } from '../isHTMLElement/isHTMLElement'
import { isArray } from '../isArray/isArray'

/**
 * @typedef {HTMLImageElement|HTMLMediaElement|HTMLIFrameElement} Asset
 */

type Asset = HTMLImageElement | HTMLMediaElement | HTMLIFrameElement | null

/**
 * Function - check if single asset is loaded
 *
 * @param {Asset} asset
 * @return {Promise<Asset>}
 */

const assetLoaded = async (asset: Asset): Promise<Asset> => {
  return await new Promise((resolve, reject) => {
    const result = (): void => {
      resolve(asset)
    }

    const error = (err: string | Event | Error): void => {
      reject(err)
    }

    if (!isHTMLElement(asset)) {
      error(new Error('Asset is not an HTML element'))
      return
    }

    const isVideo = asset instanceof HTMLVideoElement
    const isAudio = asset instanceof HTMLAudioElement

    asset.onerror = error

    if (isVideo || isAudio) {
      asset.oncanplay = result
    } else {
      asset.onload = result
    }

    if (asset instanceof HTMLImageElement && asset.complete) {
      result()
    }
  })
}

/**
 * Function - callback when done on error or success
 *
 * @function done
 * @param {Asset[]|boolean} result
 * @param {string|Event} [error]
 * @return {void}
 */

type Done = (result: Asset[] | boolean, error?: string | Event | Error) => void

/**
 * Function - check if multiple assets are loaded
 *
 * @param {Asset[]} assets
 * @param {function} [done=() => {}]
 * @return {void}
 */

const assetsLoaded = (assets: Asset[], done: Done = () => {}): void => {
  if (!isArray(assets)) {
    done(false, 'Assets not a filled array')
    return
  }

  Promise.all(assets.map(assetLoaded))
    .then(data => {
      done(data)
    })
    .catch(error => {
      done(false, error)
    })
}

/* Exports */

export { assetLoaded, assetsLoaded }
