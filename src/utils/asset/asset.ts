/**
 * Utils - Asset
 */

/* Imports */

import type { Asset, AssetDone } from './assetTypes.js'
import { isArrayStrict } from '../array/array.js'

/**
 * Check if single asset is loaded.
 *
 * @param {Asset} asset
 * @return {Promise<Asset>}
 */
const assetLoaded = async (asset: Asset): Promise<Asset> => {
  return await new Promise((resolve, reject) => {
    const isImage = asset instanceof HTMLImageElement
    const isVideo = asset instanceof HTMLVideoElement
    const isAudio = asset instanceof HTMLAudioElement
    const isIframe = asset instanceof HTMLIFrameElement

    if (!isImage && !isVideo && !isAudio && !isIframe) {
      reject(new Error('Asset is not a media element'))
      return
    }

    const load = () => {
      cleanUp()
      resolve(asset)
    }

    const error = (err: Event) => {
      cleanUp()
      reject(err) // eslint-disable-line @typescript-eslint/prefer-promise-reject-errors
    }

    const cleanUp = () => {
      if (isImage) {
        asset.removeEventListener('load', load)
      }

      if (isVideo || isAudio) {
        asset.removeEventListener('canplay', load)
      }

      asset.removeEventListener('error', error)
    }

    if (isImage || isIframe) {
      asset.addEventListener('load', load, { once: true })
    }

    if (isVideo || isAudio) {
      asset.addEventListener('canplay', load, { once: true })
    }

    asset.addEventListener('error', error, { once: true })

    if (isImage && asset.complete) {
      if (asset.naturalWidth > 0) {
        load()
      } else {
        reject(new Error('Image failed to load'))
      }
    }
  })
}

/**
 * Check if multiple assets are loaded.
 *
 * @param {Asset[]} assets
 * @param {AssetDone} done
 * @return {void}
 */
const assetsLoaded = (assets: Asset[], done: AssetDone): void => {
  if (!isArrayStrict(assets)) {
    done(false, new Error('Assets empty'))
    return
  }

  Promise.all(assets.map(assetLoaded))
    .then(data => {
      done(data)
    })
    .catch((error: unknown) => {
      done(false, error as Event | Error)
    })
}

/* Exports */

export {
  assetLoaded,
  assetsLoaded
}
