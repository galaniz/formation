/**
 * Utils - Assets Loaded
 * 
 * @module assetsLoaded
 */

/* Imports */

import { isHTMLElement } from '../isHTMLElement/isHTMLElement'
import { isArray } from '../isArray/isArray'

/**
 * @typedef {HTMLImageElement|HTMLVideoElement|HTMLAudioElement|HTMLIFrameElement} Asset
 */

type Asset = HTMLImageElement | HTMLVideoElement | HTMLAudioElement | HTMLIFrameElement

/**
 * Function - check if single asset is loaded
 *
 * @param {Asset} asset
 * @return {Promise<Asset>}
 */

const assetLoaded = async (asset: Asset): Promise<Asset> => {
  return await new Promise((resolve, reject) => {
    let proxy = asset

    const result = (): void => {
      resolve(asset)
    }

    const error = (message: string | Event): void => {
      reject(message)
    }

    if (!isHTMLElement(proxy)) {
      error('Asset is not an HTML element')
    }

    proxy.onerror = error

    const isVideo = proxy instanceof HTMLVideoElement
    const isAudio = proxy instanceof HTMLAudioElement

    if (isVideo || isAudio) {
      proxy = document.createElement(isVideo ? 'video' : 'audio')
      proxy.src = asset.src
      proxy.oncanplay = result
    } else {
      proxy.onload = result
    }

    if (proxy instanceof HTMLImageElement && proxy.complete) {
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

type Done = (result: Asset[] | boolean, error?: string | Event) => void

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
