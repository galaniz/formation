/**
 * Utils - Response Error Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { ResponseError } from '../ResponseError.js'

/* Tests */

describe('ResponseError()', () => {
  it('should extend Error and add response property', () => {
    const error = new ResponseError('Response error', new Response())

    expect(error.message).toBe('Response error')
    expect(error.response).toBeInstanceOf(Response)
  })
})
