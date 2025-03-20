/**
 * Utils - Asset Test
 */

/* Imports */

import type { Asset } from '../assetTypes.js'
import { it, expect, describe } from 'vitest'
import { fireEvent } from '@testing-library/dom'
import { assetLoaded, assetsLoaded } from '../asset.js'

/**
 * @typedef {object} TestItems
 * @prop {HTMLImageElement} img
 * @prop {HTMLVideoElement} video
 * @prop {HTMLAudioElement} audio
 * @prop {HTMLIFrameElement} iframe
 */
interface TestItems {
  img: HTMLImageElement
  video: HTMLVideoElement
  audio: HTMLAudioElement
  iframe: HTMLIFrameElement
}

/**
 * Asset(s)
 *
 * @return {TestItems}
 */
const testAssets = (): TestItems => {
  const img = document.createElement('img')
  const video = document.createElement('video')
  const audio = document.createElement('audio')
  const iframe = document.createElement('iframe')

  img.src = '../../../static/img/test.webp'
  video.innerHTML = '<source src="../../../static/video/test.mp4" type="video/mp4">'
  audio.innerHTML = '<source src="../../../static/audio/test.mp3" type="audio/mpeg">'
  iframe.title = 'Wikipedia page for Avocados'
  iframe.src = 'https://en.wikipedia.org/wiki/Avocado/'

  return {
    img,
    video,
    audio,
    iframe
  }
}

/**
 * Load asset(s)
 *
 * @param {Asset[]} items
 * @param {string[]} types
 * @return {number}
 */
const testLoadAssets = (
  items: Asset[],
  types: Array<'img' | 'video' | 'audio' | 'iframe' | 'error'>
): number => {
  const loadType = {
    img: 'load',
    video: 'canplay',
    audio: 'canplay',
    iframe: 'load',
    error: 'error'
  }

  return window.setTimeout(() => {
    items.forEach((item, i) => {
      const type = types[i]

      fireEvent(item as Element, new Event(loadType[type as keyof typeof loadType]))
    })
  }, 10)
}

/* Test assetLoaded */

describe('assetLoaded()', () => {
  it('should throw an error if asset is null', async () => {
    const asset = null

    await expect(async () => { await assetLoaded(asset) }).rejects.toThrowError()
  })

  it(
    'should resolve to asset if asset is image',
    async () => {
      const { img: asset } = testAssets()
      const timeoutId = testLoadAssets([asset], ['img'])
      const result = await assetLoaded(asset)

      expect(result).toBe(asset)
      expect(asset).toBeInstanceOf(HTMLImageElement)
      clearTimeout(timeoutId)
    }
  )

  it(
    'should resolve to complete image',
    async () => {
      const image = document.createElement('img')

      Object.defineProperty(image, 'complete', { // Override complete property to return true
        get: () => true
      })

      const result = await assetLoaded(image)

      expect(result).toBe(image)
    }
  )

  it(
    'should resolve to asset if asset is video',
    async () => {
      const { video: asset } = testAssets()
      const timeoutId = testLoadAssets([asset], ['video'])
      const result = await assetLoaded(asset)

      expect(result).toBe(asset)
      expect(asset).toBeInstanceOf(HTMLVideoElement)
      clearTimeout(timeoutId)
    }
  )

  it(
    'should resolve to asset if asset is audio',
    async () => {
      const { audio: asset } = testAssets()
      const timeoutId = testLoadAssets([asset], ['audio'])
      const result = await assetLoaded(asset)

      expect(result).toBe(asset)
      expect(asset).toBeInstanceOf(HTMLAudioElement)
      clearTimeout(timeoutId)
    }
  )

  it(
    'should resolve to asset if asset is iframe',
    async () => {
      const { iframe: asset } = testAssets()
      const timeoutId = testLoadAssets([asset], ['iframe'])
      const result = await assetLoaded(asset)

      expect(result).toBe(asset)
      expect(asset).toBeInstanceOf(HTMLIFrameElement)
      clearTimeout(timeoutId)
    }
  )
})

/* Test assetsLoaded */

describe('assetsLoaded()', () => {
  it(
    'should pass false with error message to callback if assets array empty',
    async () => await new Promise(resolve => {
      assetsLoaded([], (result, error) => {
        const expectedResult = false

        expect(result).toBe(expectedResult)
        expect(error).toBeInstanceOf(Error)
        resolve('')
      })
    })
  )

  it(
    'should pass false with error object to callback if assets contains null elements',
    async () => await new Promise(resolve => {
      const assets = [null, null, null]

      assetsLoaded(assets, (result, error) => {
        const expectedResult = false

        expect(result).toBe(expectedResult)
        expect(error).toBeInstanceOf(Error)
        resolve('')
      })
    })
  )

  it(
    'should pass false with error object to callback if media element fires error event',
    async () => await new Promise(resolve => {
      const { img, video, audio, iframe } = testAssets()
      const assets = [img, video, audio, iframe]
      const timeoutId = testLoadAssets(assets, ['img', 'error', 'audio', 'iframe'])

      assetsLoaded(assets, (result, error) => {
        const expectedResult = false

        expect(result).toBe(expectedResult)
        expect(error).toBeInstanceOf(Event)
        clearTimeout(timeoutId)
        resolve('')
      })
    })
  )

  it(
    'should pass assets to callback if assets contains media elements',
    async () => await new Promise(resolve => {
      const { img, video, audio, iframe } = testAssets()
      const assets = [img, video, audio, iframe]
      const timeoutId = testLoadAssets(assets, ['img', 'video', 'audio', 'iframe'])

      assetsLoaded(assets, (result) => {
        expect(result).toEqual(assets)
        clearTimeout(timeoutId)
        resolve('')
      })
    })
  )
})
