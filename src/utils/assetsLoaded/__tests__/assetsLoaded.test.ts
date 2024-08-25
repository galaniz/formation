/**
 * Utils - Assets Loaded Test
 */

/* Imports */

import type { Asset } from '../assetsLoadedTypes'
import { it, expect, describe } from 'vitest'
import { getQueriesForElement, fireEvent } from '@testing-library/dom'
import { assetLoaded, assetsLoaded } from '../assetsLoaded'

/**
 * @typedef {object} TestLoadTypes
 * @prop {string} img
 * @prop {string} video
 * @prop {string} audio
 * @prop {string} iframe
 * @prop {string} error
 */
interface TestLoadTypes {
  img: string
  video: string
  audio: string
  iframe: string
  error: string
}

/**
 * Test image element
 */
class TestHTMLImageElement extends HTMLImageElement {
  complete = true
  constructor () { super() } // eslint-disable-line
}

/**
 * Output assets
 *
 * @return {HTMLDivElement}
 */
const testGetHtmlAssets = (): HTMLDivElement => {
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
 * Get asset(s)
 *
 * @param {string[]} [types=[]]
 * @return {import('../assetsLoadedTypes').Asset[]}
 */
const testGetAssets = (types: string[] = []): Asset[] => {
  const html = testGetHtmlAssets()
  const { getByTestId } = getQueriesForElement(html)

  return types.map((type) => {
    return getByTestId(type) as Asset
  })
}

/**
 * Load asset(s)
 *
 * @param {import('../assetsLoadedTypes').Asset[]} [items=[]]
 * @param {string[]} [types=[]]
 * @return {number}
 */
const testLoadAssets = (items: Asset[] = [], types: string[] = []): number => {
  const TestLoadTypes: TestLoadTypes = {
    img: 'load',
    video: 'canplay',
    audio: 'canplay',
    iframe: 'load',
    error: 'error'
  }

  return window.setTimeout(() => {
    items.forEach((item, i) => {
      const type = types[i] as keyof TestLoadTypes

      fireEvent(item as Element, new Event(TestLoadTypes[type]))
    })
  }, 10)
}

/* Test assetLoaded */

describe('assetLoaded()', () => {
  it('should throw an error if asset is null', async () => {
    const asset = null

    return await expect(assetLoaded(asset)).rejects.toThrowError()
  })

  it(
    'should resolve to asset if asset is image',
    async () => {
      const types = ['img']
      const assets = testGetAssets(types)
      const [asset] = assets
      const timeoutId = testLoadAssets(assets, types)
      const result = await assetLoaded(asset)

      expect(result).toBe(asset)
      expect(asset).toBeInstanceOf(HTMLImageElement)
      clearTimeout(timeoutId)
    }
  )

  it(
    'should resolve to complete image',
    async () => {
      const image = new TestHTMLImageElement()

      image.complete = true

      const result = await assetLoaded(image)

      expect(result).toBe(image)
    }
  )

  it(
    'should resolve to asset if asset is video',
    async () => {
      const types = ['video']
      const assets = testGetAssets(types)
      const [asset] = assets
      const timeoutId = testLoadAssets(assets, types)
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
      const assets = testGetAssets(types)
      const [asset] = assets
      const timeoutId = testLoadAssets(assets, types)
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
      const assets = testGetAssets(types)
      const [asset] = assets
      const timeoutId = testLoadAssets(assets, types)
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
      const types = ['img', 'video', 'audio', 'iframe']
      const assets = testGetAssets(types)
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
      const types = ['img', 'video', 'audio', 'iframe']
      const assets = testGetAssets(types)
      const timeoutId = testLoadAssets(assets, types)

      assetsLoaded(assets, (result) => {
        expect(result).toEqual(assets)
        clearTimeout(timeoutId)
        resolve('')
      })
    })
  )
})
