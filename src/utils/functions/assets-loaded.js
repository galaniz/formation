/**
 * Utils - assets loaded
 */

/**
 * Function - check if single asset is loaded
 *
 * @param {HTMLElement} asset
 * @return {Promise}
 */

const assetLoaded = (asset) => {
  const type = asset.tagName

  return new Promise((resolve, reject) => {
    let proxy = null

    if (type === 'IMG' || type === 'IFRAME') {
      proxy = asset
    }

    if (type === 'VIDEO') {
      proxy = document.createElement('video')
      proxy.src = asset.src
    }

    const res = () => {
      resolve(asset)
    }

    const err = (message) => {
      reject(message)
    }

    if (!proxy) {
      err()
    }

    proxy.onerror = err

    if (type === 'VIDEO') {
      proxy.oncanplay = () => {
        res()
      }
    } else {
      proxy.onload = res
    }

    if (proxy.complete) {
      res()
    }
  })
}

/**
 * Function - check if multiple assets are loaded
 *
 * @param {array<HTMLElement>} assets
 * @param {function} done - callback when finished on error or success
 * @return {void}
 */

const assetsLoaded = (assets = [], done = () => {}) => {
  if (assets.length === 0) {
    done(false)
    return
  }

  Promise.all(assets.map(assetLoaded))
    .then(data => {
      done(data)
    })
    .catch(err => {
      done(false, err)
    })
}

/* Exports */

export { assetLoaded, assetsLoaded }
