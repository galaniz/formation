/**
 * Utils - File Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { isFile, isBlob } from '../file.js'

/* Test isFile */

describe('isFile()', () => {
  it('should return false if value is an object', () => {
    const value = { prop: 'value' }
    const result = isFile(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an array', () => {
    const value = [0]
    const result = isFile(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is null', () => {
    const value = null
    const result = isFile(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is undefined', () => {
    const value = undefined
    const result = isFile(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is a blob', () => {
    const value = new Blob(['<html></html>'], {
      type: 'text/html'
    })

    const result = isFile(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return true if value is a file', () => {
    const value = new File(['test'], 'test.txt', {
      type: 'text/plain'
    })

    const result = isFile(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })
})

/* Test isBlob */

describe('isBlob()', () => {
  it('should return false if value is an object', () => {
    const value = { prop: 'value' }
    const result = isBlob(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an array', () => {
    const value = [0]
    const result = isBlob(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is null', () => {
    const value = null
    const result = isBlob(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is undefined', () => {
    const value = undefined
    const result = isBlob(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return true if value is a blob', () => {
    const value = new Blob(['<html></html>'], {
      type: 'text/html'
    })

    const result = isBlob(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return true if value is a file', () => {
    const value = new File(['test'], 'test.txt', {
      type: 'text/plain'
    })

    const result = isBlob(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })
})
