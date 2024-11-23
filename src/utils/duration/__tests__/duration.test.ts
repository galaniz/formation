/**
 * Utils - Duration Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { getDuration } from '../duration.js'

/* Tests */

describe('getDuration()', () => {
  it('should return 0:00 if no args', () => {
    const result = getDuration()
    const expectedResult = '0:00'

    expect(result).toBe(expectedResult)
  })

  it('should return 0:04 if 4 seconds', () => {
    const result = getDuration(4)
    const expectedResult = '0:04'

    expect(result).toBe(expectedResult)
  })

  it('should return 01:01:01 if 3661 seconds', () => {
    const result = getDuration(3661)
    const expectedResult = '01:01:01'

    expect(result).toBe(expectedResult)
  })

  it('should return 12:59:59 if 46799 seconds', () => {
    const result = getDuration(46799)
    const expectedResult = '12:59:59'

    expect(result).toBe(expectedResult)
  })

  it('should return 1 hour 1 minute 1 second if 3661 seconds and words true', () => {
    const result = getDuration(3661, true)
    const expectedResult = '1 hour 1 minute 1 second'

    expect(result).toBe(expectedResult)
  })

  it('should return 12 hours 59 minutes 59 seconds if 46799 seconds and words true', () => {
    const result = getDuration(46799, true)
    const expectedResult = '12 hours 59 minutes 59 seconds'

    expect(result).toBe(expectedResult)
  })

  it('should return 1 hour if 3600 seconds and words true', () => {
    const result = getDuration(3600, true)
    const expectedResult = '1 hour'

    expect(result).toBe(expectedResult)
  })

  it('should return 1 hour 10 minutes if 4200 seconds and words true', () => {
    const result = getDuration(4200, true)
    const expectedResult = '1 hour 10 minutes'

    expect(result).toBe(expectedResult)
  })

  it('should return 4 seconds if 4 seconds and words true', () => {
    const result = getDuration(4, true)
    const expectedResult = '4 seconds'

    expect(result).toBe(expectedResult)
  })
})
