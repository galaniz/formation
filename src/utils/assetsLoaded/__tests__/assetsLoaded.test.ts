/**
 * Utils - Assets Loaded Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { getQueriesForElement, fireEvent } from '@testing-library/dom'
import { assetLoaded, assetsLoaded } from '../assetsLoaded'

/* Html */

const testHtml = () => {
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

/* Tests */

describe('assetLoaded()', () => {
  it('should throw an error if asset is null', () => {
    const asset = null

    return expect(assetLoaded(asset)).rejects.toThrowError()
  })

  it(
    'should resolve to asset if asset is image',
    async () => new Promise(async done => {
      const html = testHtml()
      const { getByTestId } = getQueriesForElement(html)

      const asset = <HTMLImageElement>getByTestId('img')

      let timeoutId = setTimeout(() => {
        fireEvent(asset, new Event('load'))
      }, 100)

      try {
        const result = await assetLoaded(asset)
        expect(result).toBe(asset)
        clearTimeout(timeoutId)
        done('')
      } catch (error) {
        expect(error).toBeTypeOf('string')
        clearTimeout(timeoutId)
        done('')
      }
    })
  )

  /*it(
    'should resolve to asset if asset is video',
    async () => new Promise (done => async () => {
      const html = testHtml()
      const asset: HTMLVideoElement | null = <HTMLVideoElement>getByTestId(html, 'video')

      console.log('ASSET', asset)

      return await assetLoaded(asset)
        .then((result) => {
          console.log('RES', result)
          expect(result).toBe(asset)
          done('')
        })
        .catch((error) => {
          console.log('ERR', error)
          expect(error).toBeTypeOf('string')
          done('')
        })
    })
  )*/

  /*it(
    'should resolve to asset if asset is image',
    async () => await new Promise(done => {
      (async () => {
        const html = testHtml()
        const asset: HTMLImageElement | null = <HTMLImageElement>getByTestId(html, 'img')

        assetLoaded(asset)
          .then((result) => {
            console.log('RES', result)
            expect(result).toEqual(asset)
            done('')
          })
          .catch((error) => {
            console.log('ERR', error)
            expect(error).toBeTypeOf('string')
            done('')
          })
      })()
    })
  )*/

  /*it('should resolve if asset is video', async () => {
    const html = testHtml()
    const asset: HTMLVideoElement | null = queryByTestId(html, 'video')

    return await expect(assetLoaded(asset)).resolves.toEqual(asset)
  })

  it('should resolve if asset is audio', async () => {
    const html = testHtml()
    const asset: HTMLAudioElement | null = queryByTestId(html, 'audio')

    return await expect(assetLoaded(asset)).resolves.toEqual(asset)
  })

  it('should resolve if asset is iframe', async () => {
    const html = testHtml()
    const asset: HTMLIFrameElement | null = queryByTestId(html, 'iframe')

    return await expect(assetLoaded(asset)).resolves.toEqual(asset)
  })*/
})

describe('assetsLoaded()', () => {
  it(
    'should pass false with error message to callback if assets array empty',
    () => new Promise(done => {
      const assets = []

      assetsLoaded(assets, (result, error) => {
        expect(result).toBe(false)
        expect(error).toBeTypeOf('string')
        done('')
      })
    })
  )

  it(
    'should pass false with error object to callback if assets contains null elements',
    () => new Promise(done => {
      const assets = [null, null, null]

      assetsLoaded(assets, (result, error) => {
        expect(result).toBe(false)
        expect(error).toBeInstanceOf(Error)
        done('')
      })
    })
  )

  it(
    'should pass assets to callback if assets contains media elements',
    () => new Promise(done => {
      const html = testHtml()
      const { getByTestId } = getQueriesForElement(html)

      const assets = [
        <HTMLImageElement>getByTestId('img')
      ]

      let timeoutId = setTimeout(() => {
        fireEvent(assets[0], new Event('load'))
      }, 100)

      assetsLoaded(assets, (result, error) => {
        if (result === false && error !== undefined) {
          clearTimeout(timeoutId)
          done(error)
          return
        }

        expect(result).toEqual(assets)
        clearTimeout(timeoutId)
        done('')
      })
    })
  )
})
