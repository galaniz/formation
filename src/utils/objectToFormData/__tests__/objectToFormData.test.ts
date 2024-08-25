/**
 * Utils - Object To Form Data Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { objectToFormData } from '../objectToFormData'

/* Tests */

describe('objectToFormData()', () => {
  it('should return emtpy form data object if value is undefined', () => {
    const result = objectToFormData(undefined)
    const expectedResult = new FormData()

    expect(result).toEqual(expectedResult)
  })

  it('should return matching form data object', () => {
    const result = objectToFormData({
      keyOne: 'value',
      keyTwo: false,
      keyThree: 9893
    })

    const expectedResult = new FormData()

    expectedResult.append('keyOne', 'value')
    expectedResult.append('keyTwo', 'false')
    expectedResult.append('keyThree', '9893')

    expect(result).toEqual(expectedResult)
  })

  it(
    'should return matching data form data object containing blob',
    async () => {
      const blob = new Blob([JSON.stringify({ key: 999 })], {
        type: 'application/json'
      })

      const result = objectToFormData({
        key: blob
      })

      const expectedResult = new FormData()
      expectedResult.append('key', blob)

      const resBlob = result.get('key') as Blob
      const resBlobText = await resBlob.text()
      const expectBlob = expectedResult.get('key') as Blob
      const expectBlobText = await expectBlob.text()

      expect(resBlobText).toEqual(expectBlobText)
    }
  )

  it('should return matching multi-level form data object containing file', () => {
    const dateTime = new Date().getTime()
    const file = new File(['foo'], 'foo.txt', {
      type: 'text/plain',
      lastModified: dateTime
    })

    const result = objectToFormData({
      keyOne: 'value',
      keyTwo: {
        nestedKeyOne: 'one',
        nestedKeyTwo: 'two',
        nestedKeyThree: 'three'
      },
      keyThree: 9999,
      keyFour: [
        {
          nestedKeyFour: 'four',
          nestedKeyFive: file,
          nestedKeySix: 'six'
        },
        {
          nestedKeySeven: 'seven',
          nestedKeyEight: 'eight',
          nestedKeyNine: 'nine'
        }
      ],
      keyFive: [1, 2, 3]
    })

    const expectedResult = new FormData()

    expectedResult.append('keyOne', 'value')
    expectedResult.append('keyTwo[nestedKeyOne]', 'one')
    expectedResult.append('keyTwo[nestedKeyTwo]', 'two')
    expectedResult.append('keyTwo[nestedKeyThree]', 'three')
    expectedResult.append('keyThree', '9999')
    expectedResult.append('keyFour[0][nestedKeyFour]', 'four')
    expectedResult.append('keyFour[0][nestedKeyFive]', file)
    expectedResult.append('keyFour[0][nestedKeySix]', 'six')
    expectedResult.append('keyFour[1][nestedKeySeven]', 'seven')
    expectedResult.append('keyFour[1][nestedKeyEight]', 'eight')
    expectedResult.append('keyFour[1][nestedKeyNine]', 'nine')
    expectedResult.append('keyFive[0]', '1')
    expectedResult.append('keyFive[1]', '2')
    expectedResult.append('keyFive[2]', '3')

    expect(result).toEqual(expectedResult)
  })

  it('should return matching multi-level form data object with stringified objects', () => {
    const valueTwo = {
      nestedKeyOne: 'one',
      nestedKeyTwo: 'two',
      nestedKeyThree: 'three'
    }

    const valueFour = [
      {
        nestedKeyFour: 'four',
        nestedKeyFive: 'five',
        nestedKeySix: 'six'
      },
      {
        nestedKeySeven: 'seven',
        nestedKeyEight: 'eight',
        nestedKeyNine: 'nine'
      }
    ]

    const valueFive = [1, 2, 3]

    const result = objectToFormData({
      keyOne: 'value',
      keyTwo: valueTwo,
      keyThree: 9999,
      keyFour: valueFour,
      keyFive: valueFive
    }, true)

    const expectedResult = new FormData()

    expectedResult.append('keyOne', 'value')
    expectedResult.append('keyTwo', JSON.stringify(valueTwo))
    expectedResult.append('keyThree', '9999')
    expectedResult.append('keyFour', JSON.stringify(valueFour))
    expectedResult.append('keyFive', JSON.stringify(valueFive))

    expect(result).toEqual(expectedResult)
  })
})
