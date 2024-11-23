/**
 * Utils - Action Test
 */

/* Imports */

import { it, expect, describe, beforeEach, vi } from 'vitest'
import {
  actions,
  addAction,
  removeAction,
  doActions
} from '../action.js'

/**
 * First test action name
 *
 * @type {string}
 */
const testNameOne: string = 'testName'

/**
 * Second test action name
 *
 * @type {string}
 */
const testNameTwo: string = 'testNameTwo'

/* Test actions */

describe('actions', () => {
  it('should be map containing three empty sets', () => {
    const resize = actions.get('resize')
    const escape = actions.get('escape')
    const scroll = actions.get('scroll')

    const expectResize = new Set()
    const expectEscape = new Set()
    const expectScroll = new Set()

    expect(resize).toEqual(expectResize)
    expect(escape).toEqual(expectEscape)
    expect(scroll).toEqual(expectScroll)
  })
})

/* Test addAction */

describe('addAction()', () => {
  beforeEach(() => {
    actions.get(testNameOne)?.clear()
  })

  it('should return true if name is a string and action is a function', () => {
    const result = addAction(testNameOne, () => {})
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return false if name is null', () => {
    const name = null
    const action = (): void => {}
    // @ts-expect-error
    const result = addAction(name, action)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if action is null', () => {
    const name = 'name'
    const action = null
    // @ts-expect-error
    const result = addAction(name, action)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })
})

/* Test doActions */

describe('doActions()', () => {
  beforeEach(() => {
    actions.get(testNameOne)?.clear()
    actions.delete(testNameTwo)
  })

  it('test action should be called and return true', () => {
    const testAction = vi.fn((arg: boolean): boolean => {
      return arg
    })

    addAction(testNameOne, testAction)
    doActions(testNameOne, true)

    expect(testAction).toHaveBeenCalledTimes(1)
    expect(testAction).toHaveReturnedWith(true)
  })

  it('test action one should be called and test action two should not run', () => {
    const testActionOne = vi.fn()
    const testActionTwo = vi.fn()

    addAction(testNameOne, testActionOne)
    addAction(testNameTwo, testActionTwo)
    doActions(testNameTwo)
    removeAction(testNameTwo, testActionTwo)

    expect(testActionTwo).toHaveBeenCalledTimes(1)
    expect(testActionOne).not.toHaveBeenCalled()
  })

  it('test action should not be called if run test name two', () => {
    const testAction = vi.fn()
    const name = 'testNameTwo'
    const exists = actions.has(name)
    const expectExists = false

    addAction(testNameOne, testAction)
    doActions(testNameTwo)

    expect(exists).toBe(expectExists)
    expect(testAction).not.toHaveBeenCalled()
  })
})

/* Test removeAction */

describe('removeAction()', () => {
  beforeEach(() => {
    actions.get(testNameOne)?.clear()
  })

  it('should return false if name is null', () => {
    const name = null
    const action = (): void => {}
    // @ts-expect-error
    const result = removeAction(name, action)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if action is null', () => {
    const name = 'name'
    const action = null
    // @ts-expect-error
    const result = removeAction(name, action)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if action does not exist', () => {
    const name = 'name'
    const action = (): boolean => false
    const result = removeAction(name, action)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return true if name and action exists', () => {
    const testAction = vi.fn()

    addAction(testNameOne, testAction)

    const result = removeAction(testNameOne, testAction)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })
})
