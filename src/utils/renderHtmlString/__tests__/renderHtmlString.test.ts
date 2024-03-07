/**
 * Utils - Render Html String Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { renderHtmlString } from '../renderHtmlString'

/* Tests */

describe('renderHtmlString()', () => {
  it('should return empty string if functions is null', () => {
    // @ts-expect-error
    const result = renderHtmlString(null)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })
})
