/**
 * Utils - Url Test
 */

/* Imports */

import { it, expect, describe, afterEach } from 'vitest'
import { urlEncode } from '../url.js'
import { config } from '../../../config/config.js'

/* Tests */

describe('urlEncode()', () => {
  afterEach(() => {
    config.wellFormed = false
  })

  it('should return empty string if value is empty string', () => {
    const value = ''
    // @ts-expect-error - test invaid value
    const result = urlEncode(value)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if value is number', () => {
    const value = 9384932
    // @ts-expect-error - test invaid value
    const result = urlEncode(value)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if value is boolean', () => {
    const value = false
    // @ts-expect-error - test invaid value
    const result = urlEncode(value)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if value is null', () => {
    const value = null
    // @ts-expect-error - test invaid value
    const result = urlEncode(value)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if value is undefined', () => {
    const value = undefined
    // @ts-expect-error - test invaid value
    const result = urlEncode(value)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if value is an empty object', () => {
    const value = {}
    const result = urlEncode(value)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if value is an empty array', () => {
    const value: unknown[] = []
    const result = urlEncode(value)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return well formed string when value contains malformed characters', () => {
    config.wellFormed = true

    const value = {
      key1: 'ab\uD800'
    }

    const result = urlEncode(value)
    const expectedResult = 'key1=ab%EF%BF%BD'

    expect(result).toBe(expectedResult)
  })

  it('should return url encoded string of nested key value pairs', () => {
    const value = {
      key1: 'quis',
      key2: false,
      key3: 787,
      key4: {
        nestedKey1: 'nullum',
        nestedKey2: 983,
        nestedKey3: [
          'dolor',
          true,
          223
        ]
      },
      key5: [
        'lorem',
        'sed',
        'ipsum'
      ]
    }

    const result = urlEncode(value)
    const expectedResult = 'key1=quis&key2=false&key3=787&key4[nestedKey1]=nullum&key4[nestedKey2]=983&key4[nestedKey3][0]=dolor&key4[nestedKey3][1]=true&key4[nestedKey3][2]=223&key5[0]=lorem&key5[1]=sed&key5[2]=ipsum'

    expect(result).toBe(expectedResult)
  })

  it('should return url encoded string of array values', () => {
    const value = [
      'viverra',
      'vulputate',
      'volutpat',
      {
        key1: 'facilisis',
        key2: 972,
        key3: null
      },
      false,
      true,
      898,
      345
    ]

    const result = urlEncode(value)
    const expectedResult = '[0]=viverra&[1]=vulputate&[2]=volutpat&[3][key1]=facilisis&[3][key2]=972&[3][key3]=null&[4]=false&[5]=true&[6]=898&[7]=345'

    expect(result).toBe(expectedResult)
  })
})
