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

    if (type === 'IMG') {
      proxy = new window.Image()
    }

    if (type === 'IFRAME') {
      proxy = new window.Iframe()
    }

    if (type === 'VIDEO') {
      proxy = new window.Video()
    }

    proxy.src = asset.src

    const res = () => {
      resolve(asset)
    }

    const err = (message) => {
      reject(message)
    }

    if (proxy.complete) {
      res()
    }

    proxy.onload = res
    proxy.onerror = err
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
