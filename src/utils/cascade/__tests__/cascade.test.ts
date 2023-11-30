/**
 * Utils - Cascade Test
 */

/* Imports */

import { it, expect, describe, beforeEach, vi } from 'vitest'
import { cascade } from '../cascade'

/**
 * Millisecond timestamps
 *
 * @type {Array<number[]>}
 */

let ms: number[][] = [
  [0, 0],
  [0, 0],
  [0, 0]
]

/**
 * Function - first increment/delay method
 *
 * @return {void}
 */

const actionOne = (): void => {
  ms[0][0] = Date.now()
}

/**
 * Function - second increment/delay method
 *
 * @return {void}
 */

const actionTwo = (): void => {
  const now = Date.now()

  ms[0][1] = now
  ms[1][0] = now
}

/**
 * Function - third increment/delay method
 *
 * @return {void}
 */

const actionThree = (): void => {
  const now = Date.now()

  ms[1][1] = now
  ms[2][0] = now
}

/**
 * Function - fourth increment/delay method
 *
 * @return {void}
 */

const actionFour = (): void => {
  const now = Date.now()

  ms[2][1] = now
}

/**
 * Check functions have been called
 *
 * @type {Object}
 * @prop {function} repeatOne
 * @prop {function} repeatTwo
 * @prop {function} done
 */

const spy: any = { /* any - spyOn type error otherwise */
  repeatOne () {},
  repeatTwo () {},
  done (callback: Function) {
    callback()
  }
}

/**
 * Function - round difference between two numbers
 *
 * @param {number} first
 * @param {number} second
 * @param {number} nth
 * @return {number}
 */

const roundDiff = (first: number, second: number, nth: number): number => {
  return Math.round((second - first) / nth) * nth
}

/**
 * Function - get increment from difference between ms values
 *
 * @param {number} [nth=10]
 * @return {boolean}
 */

const getIncrement = (nth: number = 10): boolean => {
  const rounded: number[] = ms.map((m) => {
    const [first, second] = m

    return roundDiff(first, second, nth)
  })

  let increments: number[] = []

  rounded.sort((a, b) => {
    increments.push(Math.abs(a - b))

    return 0
  })

  increments = increments.filter((d) => d !== nth)

  return increments.length === 0
}

/* Tests */

describe('cascade()', () => {
  beforeEach(() => {
    ms = [
      [0, 0],
      [0, 0],
      [0, 0]
    ]
  })

  it(
    'should run actions 10ms apart',
    async () => await new Promise(resolve => {
      const increment = 5

      cascade([
        {
          action: actionOne,
          increment,
          delay: 1 // BUG
        },
        {
          action: actionTwo
        },
        {
          action: actionThree
        },
        {
          action: actionFour
        },
        {
          action () {
            const result = getIncrement(increment)

            expect(result).toBe(true)
            resolve('')
          }
        }
      ])
    })
  )

  it(
    'should run actions 10ms apart starting with 20ms delay',
    async () => await new Promise(resolve => {
      const initMs = Date.now()
      const increment = 5
      const delay = 10

      cascade([
        {
          action: actionOne,
          delay,
          increment
        },
        {
          action: actionTwo
        },
        {
          action: actionThree
        },
        {
          action: actionFour
        },
        {
          action () {
            const resultIncrement = getIncrement(increment)
            const resultDelay = roundDiff(initMs, ms[0][0], increment)

            expect(resultIncrement).toBe(true)
            expect(resultDelay).toBe(delay)
            resolve('')
          }
        }
      ])
    })
  )

  it(
    'should run actions with 15ms, 30ms, 45ms and 60ms delays',
    async () => await new Promise(resolve => {
      const initMs = Date.now()
      const increment = 5

      cascade([
        {
          action: actionOne,
          delay: increment
        },
        {
          action: actionTwo,
          delay: 10
        },
        {
          action: actionThree,
          delay: 15
        },
        {
          action: actionFour,
          delay: 20
        },
        {
          action () {
            const resultIncrement = getIncrement(increment)
            const resultDelay = roundDiff(initMs, ms[0][0], increment)

            expect(resultIncrement).toBe(true)
            expect(resultDelay).toBe(increment)
            resolve('')
          }
        }
      ])
    })
  )

  it(
    'should run action callback before next action',
    async () => await new Promise(resolve => {
      const doneSpy = vi.spyOn(spy, 'done')

      cascade([
        {
          action () {}
        },
        {
          action (_i, _j, recur) {
            spy.done(() => {
              recur()
            })
          }
        },
        {
          action () {
            expect(doneSpy).toBeCalled()
          }
        },
        {
          action () {
            resolve('')
          }
        }
      ])
    })
  )

  it(
    'should run actions twice',
    async () => await new Promise(resolve => {
      const oneSpy = vi.spyOn(spy, 'repeatOne')
      const twoSpy = vi.spyOn(spy, 'repeatTwo')
      const repeat = 1

      cascade([
        {
          action: spy.repeatOne
        },
        {
          action: spy.repeatTwo
        },
        {
          action (_i, j) {
            if (j === repeat) {
              expect(oneSpy).toBeCalledTimes(repeat + 1)
              expect(twoSpy).toBeCalledTimes(repeat + 1)
              resolve('')
            }
          }
        }
      ], repeat)
    })
  )
})
