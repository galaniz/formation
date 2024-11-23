/**
 * Utils - Asset
 */

/* Imports */

import type { Asset, AssetDone } from './assetTypes.js'
import { isHtmlElement } from '../html/html.js'
import { isArrayStrict } from '../array/array.js'

/**
 * Check if single asset is loaded
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

    if (!isHtmlElement(asset)) {
      error(new Error('Asset is not an HTML element'))
      return
    }

    if (asset instanceof HTMLImageElement && asset.complete) {
      result()
    }

    const isVideo = asset instanceof HTMLVideoElement
    const isAudio = asset instanceof HTMLAudioElement

    asset.onerror = error

    if (isVideo || isAudio) {
      asset.oncanplay = result
    } else {
      asset.onload = result
    }
  })
}

/**
 * Check if multiple assets are loaded
 *
 * @param {Asset[]} assets
 * @param {AssetDone} [done]
 * @return {void}
 */
const assetsLoaded = (assets: Asset[], done: AssetDone = () => {}): void => {
  if (!isArrayStrict(assets)) {
    done(false, 'Assets empty')
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

export {
  assetLoaded,
  assetsLoaded
}
