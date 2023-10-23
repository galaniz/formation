/**
 * Utils - Assets Loaded Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { assetLoaded, assetsLoaded } from '../assetsLoaded'

/* Tests */

describe('assetLoaded()', () => {
  it('should throw an error if asset is null', async () => {
    const asset = null

    return await expect(assetLoaded(asset)).rejects.toThrowError()
  })
})

describe('assetsLoaded()', () => {
  it(
    'callback result should be false with error message if assets array empty',
    async () => await new Promise( // Done deprecation workaround...
      resolve => {
        const assets = []

        assetsLoaded(assets, (result, error) => {
          expect(result).toBe(false)
          expect(error).toBeTypeOf('string')
          resolve('')
        })
      }
    )
  )

  it(
    'callback result should be false with error object if assets contains null elements',
    async () => await new Promise( // Done deprecation workaround...
      resolve => {
        const assets = [null, null, null]

        assetsLoaded(assets, (result, error) => {
          expect(result).toBe(false)
          expect(error).toBeInstanceOf(Error)
          resolve('')
        })
      }
    )
  )
})
