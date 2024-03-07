/**
 * Utils - Assets Loaded Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { getQueriesForElement, fireEvent } from '@testing-library/dom'
import { assetLoaded, assetsLoaded } from '../assetsLoaded'

/**
 * @typedef {HTMLImageElement|HTMLMediaElement|HTMLIFrameElement} Asset
 */

type Asset = HTMLImageElement | HTMLMediaElement | HTMLIFrameElement | null

/**
 * @typedef {object} LoadTypes
 * @prop {string} img
 * @prop {string} video
 * @prop {string} audio
 * @prop {string} iframe
 * @prop {string} error
 */

interface LoadTypes {
  img: string
  video: string
  audio: string
  iframe: string
  error: string
}

/**
 * Function - output assets
 *
 * @return {HTMLDivElement}
 */

const htmlAssets = (): HTMLDivElement => {
  const container = document.createElement('div')

  container.innerHTML = `
    <img src="../../../frm/img/test.webp" alt="" data-testid="img">
    <video data-testid="video">
      <source src="../../../frm/video/test.mp4" type="video/mp4">
    </video>
    <audio data-testid="audio">
      <source src="../../../frm/audio/test.mp3" type="audio/mpeg">
    </audio>
    <iframe
      title="Wikipedia page for Avocados"
      src="https://en.wikipedia.org/wiki/Avocado"
      data-testid="iframe"
    ></iframe>
  `

  return container
}

/**
 * Function - get asset(s)
 *
 * @param {string[]} [types=[]]
 * @return {Asset[]}
 */

const getAssets = (types: string[] = []): Asset[] => {
  const html = htmlAssets()
  const { getByTestId } = getQueriesForElement(html)

  return types.map((type) => {
    return getByTestId(type) as Asset
  })
}

/**
 * Function - load asset(s)
 *
 * @param {Asset[]} [items=[]]
 * @param {string[]} [types=[]]
 * @return {number}
 */

const loadAssets = (items: Asset[] = [], types: string[] = []): number => {
  const loadTypes: LoadTypes = {
    img: 'load',
    video: 'canplay',
    audio: 'canplay',
    iframe: 'load',
    error: 'error'
  }

  return window.setTimeout(() => {
    items.forEach((item, i) => {
      const type = types[i] as keyof LoadTypes

      fireEvent(item as Element, new Event(loadTypes[type]))
    })
  }, 10)
}

/* Tests */

describe('assetLoaded()', () => {
  it('should throw an error if asset is null', async () => {
    const asset = null

    return await expect(assetLoaded(asset)).rejects.toThrowError()
  })

  it(
    'should resolve to asset if asset is image',
    async () => {
      const types = ['img']
      const assets = getAssets(types)
      const [asset] = assets
      const timeoutId = loadAssets(assets, types)
      const result = await assetLoaded(asset)

      expect(result).toBe(asset)
      expect(asset).toBeInstanceOf(HTMLImageElement)
      clearTimeout(timeoutId)
    }
  )

  it(
    'should resolve to asset if asset is video',
    async () => {
      const types = ['video']
      const assets = getAssets(types)
      const [asset] = assets
      const timeoutId = loadAssets(assets, types)
      const result = await assetLoaded(asset)

      expect(result).toBe(asset)
      expect(asset).toBeInstanceOf(HTMLVideoElement)
      clearTimeout(timeoutId)
    }
  )

  it(
    'should resolve to asset if asset is audio',
    async () => {
      const types = ['audio']
      const assets = getAssets(types)
      const [asset] = assets
      const timeoutId = loadAssets(assets, types)
      const result = await assetLoaded(asset)

      expect(result).toBe(asset)
      expect(asset).toBeInstanceOf(HTMLAudioElement)
      clearTimeout(timeoutId)
    }
  )

  it(
    'should resolve to asset if asset is iframe',
    async () => {
      const types = ['iframe']
      const assets = getAssets(types)
      const [asset] = assets
      const timeoutId = loadAssets(assets, types)
      const result = await assetLoaded(asset)

      expect(result).toBe(asset)
      expect(asset).toBeInstanceOf(HTMLIFrameElement)
      clearTimeout(timeoutId)
    }
  )
})

describe('assetsLoaded()', () => {
  it(
    'should pass false with error message to callback if assets array empty',
    async () => await new Promise(resolve => {
      assetsLoaded([], (result, error) => {
        expect(result).toBe(false)
        expect(error).toBeTypeOf('string')
        resolve('')
      })
    })
  )

  it(
    'should pass false with error object to callback if assets contains null elements',
    async () => await new Promise(resolve => {
      const assets = [null, null, null]

      assetsLoaded(assets, (result, error) => {
        expect(result).toBe(false)
        expect(error).toBeInstanceOf(Error)
        resolve('')
      })
    })
  )

  it(
    'should pass false with error object to callback if media element fires error event',
    async () => await new Promise(resolve => {
      const types = ['img', 'video', 'audio', 'iframe']
      const assets = getAssets(types)
      const timeoutId = loadAssets(assets, ['img', 'error', 'audio', 'iframe'])

      assetsLoaded(assets, (result, error) => {
        expect(result).toBe(false)
        expect(error).toBeInstanceOf(Event)
        clearTimeout(timeoutId)
        resolve('')
      })
    })
  )

  it(
    'should pass assets to callback if assets contains media elements',
    async () => await new Promise(resolve => {
      const types = ['img', 'video', 'audio', 'iframe']
      const assets = getAssets(types)
      const timeoutId = loadAssets(assets, types)

      assetsLoaded(assets, (result) => {
        expect(result).toEqual(assets)
        clearTimeout(timeoutId)
        resolve('')
      })
    })
  )
})
