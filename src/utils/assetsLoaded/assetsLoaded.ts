/**
 * Utils - Assets Loaded
 */

/**
 * Function - check if single asset is loaded
 *
 * @param {HTMLImageElement|HTMLVideoElement|HTMLIFrameElement} asset
 * @return {Promise}
 */

type Asset = HTMLImageElement | HTMLVideoElement | HTMLIFrameElement

const assetLoaded = async (asset: Asset): Promise<Asset> => {
  return await new Promise((resolve, reject) => {
    let proxy = asset

    const isVideo = proxy instanceof HTMLVideoElement

    if (isVideo) {
      proxy = document.createElement('video')
      proxy.src = asset.src
    }

    const result = (): void => {
      resolve(asset)
    }

    const error = (message: string | Event): void => {
      reject(message)
    }

    if (proxy === null) {
      error('Asset is null')
    }

    proxy.onerror = error

    if (isVideo) {
      proxy.oncanplay = () => {
        result()
      }
    } else {
      proxy.onload = result
    }

    if (proxy instanceof HTMLImageElement) {
      if (proxy.complete) {
        result()
      }
    }
  })
}

/**
 * Function - check if multiple assets are loaded
 *
 * @param {(HTMLImageElement|HTMLVideoElement|HTMLIFrameElement)[]} assets=[]
 * @param {function} [done=() => {}] - callback when finished on error or success
 * @return {void}
 */

type Done = (result: Asset[] | boolean, error?: string | Event) => void

const assetsLoaded = (assets: Asset[] = [], done: Done = () => {}): void => {
  if (assets.length === 0) {
    done(false)
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
