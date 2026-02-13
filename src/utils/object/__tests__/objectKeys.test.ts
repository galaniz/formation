/**
 * Utils - Object Keys Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { getObjectKeys } from '../objectKeys.js'

/* Tests */

describe('getObjectKeys()', () => {
  it('should throw type error if null', () => {
    expect(() => getObjectKeys(null)).toThrowError()
  })

  it('should throw type error if undefined', () => {
    expect(() => getObjectKeys(undefined)).toThrowError()
  })

  it('should return array of property names if object', () => {
    const result = getObjectKeys({ one: 'one', two: 'two', three: 'three' })

    expect(result).toEqual(['one', 'two', 'three'])
  })
})
