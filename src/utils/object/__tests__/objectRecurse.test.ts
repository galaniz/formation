/**
 * Utils - Object Recurse Test
 */

/* Imports */

import { it, expect, describe, vi } from 'vitest'
import { recurseObject } from '../objectRecurse.js'

/* Tests */

describe('recurseObject()', () => {
  it('should return undefined if value is null', () => {
    const result = recurseObject(null, () => true)
    const expectedResult = undefined

    expect(result).toBe(expectedResult)
  })

  it('should return undefined if condition is null', () => {
    // @ts-expect-error
    const result = recurseObject({ key: 'value' }, null)
    const expectedResult = undefined

    expect(result).toBe(expectedResult)
  })

  it('should recurse through multi-level object until third key', () => {
    const result: string[] = []
    const expectedResult = [
      'keyOne',
      'keyTwo',
      'nestedKeyOne',
      'nestedKeyTwo',
      'nestedKeyThree',
      '0',
      '1',
      '2',
      'keyThree'
    ]

    recurseObject(
      {
        keyOne: 'value',
        keyTwo: {
          nestedKeyOne: 28,
          nestedKeyTwo: false,
          nestedKeyThree: [1, 2, 3]
        },
        keyThree: 'stop',
        keyFour: true,
        keyFive: 24
      },
      (key, value) => {
        result.push(key.toString())

        if (value === 'stop') {
          return false
        }

        return true
      }
    )

    expect(result).toEqual(expectedResult)
  })

  it('should recurse through array until second item', () => {
    const result: string[] = []
    const expectedResult = ['0', '1']

    recurseObject(
      [
        'itemOne',
        'itemTwo',
        'itemThree',
        'itemFour',
        'itemFive'
      ],
      (key) => {
        result.push(key.toString())

        if (key === '1') {
          return false
        }

        return true
      }
    )

    expect(result).toEqual(expectedResult)
  })

  it('should run callback through every multi-level object item', () => {
    const testCallback = vi.fn()

    recurseObject(
      {
        keyOne: 'value',
        keyTwo: {
          nestedKeyOne: 28,
          nestedKeyTwo: false,
          nestedKeyThree: [1, 2, 3]
        },
        keyThree: 'stop',
        keyFour: true,
        keyFive: 24
      },
      () => true,
      testCallback
    )

    expect(testCallback).toHaveBeenCalledTimes(11)
  })
})
