/**
 * Utils - Filter Test
 */

/* Imports */

import { it, expect, describe, afterEach, vi } from 'vitest'
import { filters, addFilter, applyFilters, removeFilter } from '../filters.js'

/* Test filters */

describe('filters', () => {
  it('should be empty map', () => {
    const size = filters.size
    const expectedSize = 0

    expect(size).toEqual(expectedSize)
  })
})

/* Test addFilter */

describe('addFilter()', () => {
  afterEach(() => {
    filters.clear()
  })

  it('should return false if name is not a string', () => {
    // @ts-expect-error - test invalid name
    const result = addFilter(1, () => {})
    const expectedResult = false

    expect(result).toEqual(expectedResult)
  })

  it('should return false if filter is not a function', () => {
    // @ts-expect-error - test invalid filter
    const result = addFilter('test', 'not a function')
    const expectedResult = false

    expect(result).toEqual(expectedResult)
  })

  it('should add filter to filters map', () => {
    const result = addFilter('test', () => {})
    const expectedResult = true

    expect(result).toEqual(expectedResult)
  })
})

/* Test applyFilters */

describe('applyFilters()', () => {
  afterEach(() => {
    filters.clear()
  })

  it('should call filter and return true', () => {
    addFilter('test', (value: boolean): boolean => !value)

    const result = applyFilters('test', false)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should only call filter two', () => {
    const testFilterOne = vi.fn((value: boolean): boolean => !value)
    const testFilterTwo = vi.fn((value: boolean): boolean => !value)

    addFilter('testOne', testFilterOne)
    addFilter('testTwo', testFilterTwo)

    const result = applyFilters('testTwo', true)
    const expectedResult = false

    expect(testFilterTwo).toHaveBeenCalledTimes(1)
    expect(testFilterOne).not.toHaveBeenCalled()
    expect(result).toBe(expectedResult)
  })

  it('should not call filter if different filter name called', () => {
    const testFilter = vi.fn((value: string) => `${value}1`)
    const exists = filters.has('testTwo')
    const expectExists = false

    addFilter('testOne', testFilter)

    const result = applyFilters('testTwo', 'test')
    const expectedResult = 'test'

    expect(exists).toBe(expectExists)
    expect(testFilter).not.toHaveBeenCalled()
    expect(result).toBe(expectedResult)
  })

  it('should call filters and return cumulative string', () => {
    const testFilterOne = vi.fn((
      value: string,
      arg: string): string => `${value}${arg}1`
    )

    const testFilterTwo = vi.fn((
      value: string,
      arg: string): string => `${value}${arg}2`
    )

    addFilter('testOne', testFilterOne)
    addFilter('testOne', testFilterTwo)

    const result = applyFilters('testOne', 'test', 'Str')

    expect(testFilterOne).toHaveBeenCalledTimes(1)
    expect(testFilterOne).toHaveReturnedWith('testStr1')
    expect(testFilterTwo).toHaveBeenCalledTimes(1)
    expect(testFilterTwo).toHaveReturnedWith('testStr1Str2')
    expect(result).toBe('testStr1Str2')
  })
})

/* Test removeFilter */

describe('removeFilter()', () => {
  afterEach(() => {
    filters.clear()
  })

  it('should return false if name is null', () => {
    const name = null
    const filter = (): void => {}
    // @ts-expect-error - test null name
    const result = removeFilter(name, filter)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if filter is null', () => {
    const name = 'name'
    const filter = null
    // @ts-expect-error - test null filter
    const result = removeFilter(name, filter)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if filter does not exist', () => {
    const name = 'name'
    const filter = (): boolean => false
    const result = removeFilter(name, filter)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return true if name and filter exists', () => {
    const testFilter = vi.fn()

    addFilter('testOne', testFilter)

    const result = removeFilter('testOne', testFilter)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })
})
