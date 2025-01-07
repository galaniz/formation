/**
 * Utils - Cascade Test
 */

/* Imports */

import { it, expect, describe, beforeEach, vi } from 'vitest'
import { cascade } from '../cascade.js'

/**
 * Millisecond timestamps
 *
 * @type {Array<number[]>}
 */
let testMs: [
  [number, number],
  [number, number],
  [number, number]
] = [
  [0, 0],
  [0, 0],
  [0, 0]
]

/**
 * First increment/delay method
 *
 * @return {void}
 */
const testActionOne = (): void => {
  testMs[0][0] = performance.now()
}

/**
 * Second increment/delay method
 *
 * @return {void}
 */
const testActionTwo = (): void => {
  const now = performance.now()

  testMs[0][1] = now
  testMs[1][0] = now
}

/**
 * Third increment/delay method
 *
 * @return {void}
 */
const testActionThree = (): void => {
  const now = performance.now()

  testMs[1][1] = now
  testMs[2][0] = now
}

/**
 * Fourth increment/delay method
 *
 * @return {void}
 */
const testActionFour = (): void => {
  const now = performance.now()

  testMs[2][1] = now
}

/**
 * Round difference between two numbers
 *
 * @param {number} first
 * @param {number} second
 * @param {number} nth
 * @return {number}
 */
const testRoundDiff = (first: number, second: number, nth = 10): number => {
  return Math.round((second - first) / nth) * nth
}

/**
 * Round within range of target (hack to be forgiving if within range)
 *
 * @param {number} num
 * @param {number} target
 * @param {number} [buffer]
 * @return {number}
 */
const testRoundRange = (num: number, target: number, buffer = 100): number => {
  if (num >= target - buffer && num <= target + buffer) {
    return target
  }

  return num
}

/**
 * Check increment matches difference between ms values
 *
 * @param {number} [target=10]
 * @return {boolean}
 */
const testHasIncrement = (target = 10): boolean => {
  /* Convert ms to increments */

  const increments: number[] = testMs.map((m) => {
    const [first, second] = m

    const increment = testRoundDiff(first, second, target)

    return increment
  })

  /* Check if all increments equal nth */

  const uniqueIncrements = new Set(increments)

  if (uniqueIncrements.size === 1 && uniqueIncrements.has(target)) {
    return true
  }

  /* Check difference between increments to compare with nth */

  const innerIncrements: number[] = []

  increments.sort((a, b) => {
    innerIncrements.push(testRoundRange(Math.abs(a - b), target))

    return 0
  })

  const uniqueInnerIncrements = new Set(innerIncrements)

  return uniqueInnerIncrements.size === 1 && uniqueInnerIncrements.has(target)
}

/**
 * Get initial delay
 *
 * @param {number} initMs
 * @param {number} target
 * @return {number}
 */
const testDelay = (initMs: number, target: number): number => {
  return testRoundRange(testRoundDiff(initMs, testMs[0][0], target), target)
}

/* Tests */

describe('cascade()', () => {
  beforeEach(() => {
    testMs = [
      [0, 0],
      [0, 0],
      [0, 0]
    ]
  })

  it(
    'should only run actions in events that are objects',
    async () => await new Promise(resolve => {
      const testOne = vi.fn()
      const testTwo = vi.fn()

      cascade([
        {
          action: testOne
        },
        // @ts-expect-error - test invalid action
        testTwo,
        {
          action (): void {
            expect(testOne).toHaveBeenCalledTimes(1)
            expect(testTwo).not.toHaveBeenCalled()
            resolve('')
          }
        }
      ])
    })
  )

  it(
    'should skip event where action is not a function',
    async () => await new Promise(resolve => {
      let oneMs = 0
      let twoMs = 0

      cascade([
        {
          action (): void {
            oneMs = performance.now()
          },
          delay: 10
        },
        {
          // @ts-expect-error - test invalid action
          action: false,
          delay: 100
        },
        {
          action (): void {
            twoMs = performance.now()
          },
          delay: 20
        },
        {
          action (): void {
            const result = testRoundDiff(oneMs, twoMs)
            const expectedResult = 20

            expect(result).toBe(expectedResult)
            resolve('')
          }
        }
      ])
    })
  )

  it(
    'should run actions 10ms apart',
    async () => await new Promise(resolve => {
      const increment = 10

      cascade([
        {
          action: testActionOne,
          increment
        },
        {
          action: testActionTwo
        },
        {
          action: testActionThree
        },
        {
          action: testActionFour
        },
        {
          action (): void {
            const result = testHasIncrement(increment)
            const expectedResult = true

            expect(result).toBe(expectedResult)
            resolve('')
          }
        }
      ])
    })
  )

  it(
    'should run actions 10ms apart starting with 20ms delay',
    async () => await new Promise(resolve => {
      const initMs = performance.now()
      const increment = 10
      const delay = 10

      cascade([
        {
          action: testActionOne,
          delay,
          increment
        },
        {
          action: testActionTwo
        },
        {
          action: testActionThree
        },
        {
          action: testActionFour
        },
        {
          action (): void {
            const result = testHasIncrement(increment)
            const expectedResult = true

            const resultDelay = testDelay(initMs, delay + increment)
            const expectedResultDelay = delay + increment

            expect(result).toBe(expectedResult)
            expect(resultDelay).toBe(expectedResultDelay)
            resolve('')
          }
        }
      ])
    })
  )

  it(
    'should run actions with 20ms, 40ms, 60ms and 80ms delays',
    async () => await new Promise(resolve => {
      const initMs = performance.now()
      const increment = 20

      cascade([
        {
          action: testActionOne,
          delay: increment
        },
        {
          action: testActionTwo,
          delay: 40
        },
        {
          action: testActionThree,
          delay: 60
        },
        {
          action: testActionFour,
          delay: 80
        },
        {
          action (): void  {
            const result = testHasIncrement(increment)
            const expectedResult = true

            const resultDelay = testDelay(initMs, increment)
            const expectedResultDelay = increment

            expect(result).toBe(expectedResult)
            expect(resultDelay).toBe(expectedResultDelay)
            resolve('')
          }
        }
      ])
    })
  )

  it(
    'should run action callback before next action',
    async () => await new Promise(resolve => {
      const testDone = vi.fn((callback: Function): void => {
        callback()
      })

      cascade([
        {
          action (): void {}
        },
        {
          action (_index, _repeatIndex, doRecurse): void {
            testDone(() => {
              doRecurse()
            })
          }
        },
        {
          action (): void {
            expect(testDone).toHaveBeenCalledTimes(1)
            resolve('')
          }
        }
      ])
    })
  )

  it(
    'should run actions twice',
    async () => await new Promise(resolve => {
      const testOne = vi.fn()
      const testTwo = vi.fn()
      const repeat = 1

      cascade([
        {
          action: testOne
        },
        {
          action: testTwo
        },
        {
          action (_i, j): void {
            if (j === repeat) {
              expect(testOne).toHaveBeenCalledTimes(repeat + 1)
              expect(testTwo).toHaveBeenCalledTimes(repeat + 1)
              resolve('')
            }
          }
        }
      ], repeat)
    })
  )
})
