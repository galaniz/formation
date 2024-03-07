/**
 * Utils - Actions Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import {
  actions,
  addAction,
  removeAction,
  doActions
} from '../actions'

/**
 * Test action name
 *
 * @type {string}
 */

const testName: string = 'testName'

/**
 * Function - test action
 *
 * @param {object} args
 * @param {function} args.prop
 * @return {void}
 */

const testAction = (args: { prop: Function }): void => {
  const { prop } = args
  prop(true)
}

/* Tests */

describe('addAction()', () => {
  it('should return true if name is a string and action is a function', () => {
    const result = addAction(testName, testAction)
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

  it('should return false if action null', () => {
    const name = 'name'
    const action = null
    // @ts-expect-error
    const result = addAction(name, action)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('actions object should equal testActions object', () => {
    const testActions: { [key: string]: Function[] } = {
      [testName]: [testAction]
    }

    expect(actions).toEqual(testActions)
  })
})

describe('doActions()', () => {
  it(
    'testAction should be called if name exists',
    async () => await new Promise(resolve => {
      doActions(testName, {
        prop: (result: boolean) => { // Prop callback to check action called
          expect(result).toBe(true)
          resolve('')
        }
      })
    })
  )

  it(
    'testAction should not be called if name does not exist',
    async () => await new Promise(resolve => {
      const name = 'notName'
      const result = 'not'
      const action = (arg: Function): void => {
        arg(result)
      }

      addAction(name, action)

      doActions(name, (res: string) => {
        expect(res).toBe(result)
        resolve('')
      })

      removeAction(name, action)
    })
  )
})

describe('removeAction()', () => {
  it('should return false if name is null', () => {
    const name = null
    const action = (): void => {}
    // @ts-expect-error
    const result = removeAction(name, action)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if action null', () => {
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
    const result = removeAction(testName, testAction)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('testName array should be empty', () => {
    const result = actions[testName]
    const expectedResult = 0

    expect(result).toHaveLength(expectedResult)
  })
})
