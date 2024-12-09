/**
 * Utils - Request Test
 */

/* Imports */

import type { RequestErrorCallback, RequestSuccessCallback } from '../requestTypes.js'
import { it, expect, describe, vi, beforeAll, afterAll, beforeEach } from 'vitest'
import { mockFetch, mockFetchRequestArgs } from '../../../tests/mocks/mockFetch.js'
import { ResponseError } from '../../ResponseError/ResponseError.js'
import { request } from '../request.js'

/**
 * Fake url
 *
 * @type {string}
 */
const testUrl: string = 'https://testapi.com'

/**
 * Fake body data
 *
 * @type {Object<string, string>}
 */
const testBody: Record<string, string> = {
  keyOne: 'dataOne',
  keyTwo: 'dataTwo',
  keyThree: 'dataThree'
}

/* Tests */

describe('request()', () => {
  beforeAll(() => {
    vi.stubGlobal('fetch', mockFetch)
  })

  afterAll(() => {
    vi.unstubAllGlobals()
  })

  beforeEach(() => {
    mockFetchRequestArgs.reset()
  })

  it(
    'should pass only pass content type header',
    async () => {
      mockFetch.mockImplementationOnce(async (_url, options) => {
        return await new Promise((resolve) => {
          const { headers } = options

          let count = 0
          let value = ''

          const expectedCount = 1
          const expectedValue = 'application/json'

          headers.forEach((v) => {
            value = v
            count += 1
          })

          expect(count).toBe(expectedCount)
          expect(value).toBe(expectedValue)

          resolve({
            ok: true,
            status: 200,
            body: '',
            text: async () => {
              return await new Promise((resolve) => {
                resolve('')
              })
            },
            json: async () => {
              return await new Promise((resolve) => {
                resolve('')
              })
            }
          })
        })
      })

      await request({
        url: testUrl,
        body: testBody,
        // @ts-expect-error
        headers: false,
        onError () {},
        onSuccess () {}
      })
    }
  )

  it(
    'should pass authorization header',
    async () => {
      const authToken = 'Bearer token123'

      mockFetch.mockImplementationOnce(async (_url, options) => {
        return await new Promise((resolve) => {
          const { headers } = options

          const token = headers.get('Authorization')

          expect(token).toBe(authToken)

          resolve({
            ok: true,
            status: 200,
            body: '',
            text: async () => {
              return await new Promise((resolve) => {
                resolve('')
              })
            },
            json: async () => {
              return await new Promise((resolve) => {
                resolve('')
              })
            }
          })
        })
      })

      await request({
        url: testUrl,
        body: testBody,
        headers: {
          Authorization: authToken
        },
        onError () {},
        onSuccess () {}
      })
    }
  )

  it(
    'should do fetch if error or success callbacks not functions',
    async () => {
      const testRun = vi.fn()

      mockFetch.mockImplementationOnce(async (_url, _options) => {
        return await new Promise((resolve) => {
          testRun()
          resolve({
            ok: true,
            status: 200,
            body: '',
            text: async () => {
              return await new Promise((resolve) => {
                resolve('')
              })
            },
            json: async () => {
              return await new Promise((resolve) => {
                resolve('')
              })
            }
          })
        })
      })

      await request({
        url: testUrl,
        body: testBody,
        // @ts-expect-error
        onError: false,
        // @ts-expect-error
        onSuccess: false
      })

      expect(testRun).toHaveBeenCalledTimes(1)
    }
  )

  it(
    'should do fetch if args are null',
    async () => {
      const testRun = vi.fn()

      mockFetch.mockImplementationOnce(async (_url, _options) => {
        return await new Promise((resolve) => {
          testRun()
          resolve({
            ok: false,
            status: 400,
            body: '',
            text: async () => {
              return await new Promise((resolve) => {
                resolve('')
              })
            },
            json: async () => {
              return await new Promise((resolve) => {
                resolve('')
              })
            }
          })
        })
      })

      // @ts-expect-error
      await request(null)

      expect(testRun).toHaveBeenCalledTimes(1)
    }
  )

  it(
    'should run error callback with type error if url is empty',
    async () => {
      const testSuccess: RequestSuccessCallback = vi.fn()
      const testError: RequestErrorCallback = vi.fn()

      await request({
        url: '',
        body: {},
        onError (error) {
          testError(error)
          expect(error).toBeInstanceOf(TypeError)
        },
        onSuccess (res) {
          testSuccess(res)
        }
      })

      expect(testError).toHaveBeenCalledTimes(1)
      expect(testSuccess).not.toHaveBeenCalled()
    }
  )

  it(
    'should run error callback with type error if server error',
    async () => {
      const testSuccess: RequestSuccessCallback = vi.fn()
      const testError: RequestErrorCallback = vi.fn()

      mockFetchRequestArgs.status = 400

      await request({
        url: testUrl,
        body: testBody,
        onError (error) {
          testError(error)
          expect(error).toBeInstanceOf(ResponseError)
        },
        onSuccess (res) {
          testSuccess(res)
        }
      })

      expect(testError).toHaveBeenCalledTimes(1)
      expect(testSuccess).not.toHaveBeenCalled()
    }
  )

  it(
    'should run error callback with response error if encode json and body undefined',
    async () => {
      const testSuccess: RequestSuccessCallback = vi.fn()
      const testError: RequestErrorCallback = vi.fn()

      await request({
        url: testUrl,
        // @ts-expect-error
        body: undefined,
        onError (error) {
          testError(error)
          expect(error).toBeInstanceOf(ResponseError)
        },
        onSuccess (res) {
          testSuccess(res)
        }
      })

      expect(testError).toHaveBeenCalledTimes(1)
      expect(testSuccess).not.toHaveBeenCalled()
    }
  )

  it(
    'should run error callback with response error if encode json and body undefined',
    async () => {
      const testSuccess: RequestSuccessCallback = vi.fn()
      const testError: RequestErrorCallback = vi.fn()

      await request({
        url: testUrl,
        // @ts-expect-error
        body: undefined,
        onError (error) {
          testError(error)
          expect(error).toBeInstanceOf(ResponseError)
        },
        onSuccess (res) {
          testSuccess(res)
        }
      })

      expect(testError).toHaveBeenCalledTimes(1)
      expect(testSuccess).not.toHaveBeenCalled()
    }
  )

  it(
    'should run error callback with response error if encode form data but expect json serverside',
    async () => {
      const testSuccess: RequestSuccessCallback = vi.fn()
      const testError: RequestErrorCallback = vi.fn()

      await request({
        url: testUrl,
        encode: 'formData',
        body: testBody,
        onError (error) {
          testError(error)
          expect(error).toBeInstanceOf(ResponseError)
        },
        onSuccess (res) {
          testSuccess(res)
        }
      })

      expect(testError).toHaveBeenCalledTimes(1)
      expect(testSuccess).not.toHaveBeenCalled()
    }
  )

  it(
    'should pass form data and run success callback with json result',
    async () => {
      const reqBody = new FormData()

      reqBody.append('one', 'value')
      reqBody.append('two', new Blob(['content'], { type: 'text/plain' }))

      const data = {
        result: 1
      }

      mockFetch.mockImplementationOnce(async (_url, options) => {
        return await new Promise((resolve) => {
          const { body } = options

          expect(body).toEqual(reqBody)

          const res = JSON.stringify(data)

          resolve({
            ok: true,
            status: 200,
            body: res,
            text: async () => {
              return await new Promise((resolve) => {
                resolve(res)
              })
            },
            json: async () => {
              return await new Promise((resolve) => {
                resolve(data)
              })
            }
          })
        })
      })

      const testSuccess: RequestSuccessCallback = vi.fn()
      const testError: RequestErrorCallback = vi.fn()

      mockFetchRequestArgs.data = data
      mockFetchRequestArgs.encode = 'formData'

      await request({
        url: testUrl,
        expect: 'json',
        encode: 'formData',
        body: reqBody,
        onError (error) {
          testError(error)
        },
        onSuccess (res) {
          testSuccess(res)
          expect(res).toEqual(data)
        }
      })

      expect(testSuccess).toHaveBeenCalledTimes(1)
      expect(testError).not.toHaveBeenCalled()
    }
  )

  it(
    'should run success callback with string result if encode form data and expect text',
    async () => {
      const testSuccess: RequestSuccessCallback = vi.fn()
      const testError: RequestErrorCallback = vi.fn()

      const data = 'Success'

      mockFetchRequestArgs.data = data
      mockFetchRequestArgs.encode = 'formData'

      await request({
        url: testUrl,
        expect: 'text',
        encode: 'formData',
        body: testBody,
        onError (error) {
          testError(error)
        },
        onSuccess (res) {
          testSuccess(res)
          expect(res).toEqual(`"${data}"`)
        }
      })

      expect(testSuccess).toHaveBeenCalledTimes(1)
      expect(testError).not.toHaveBeenCalled()
    }
  )

  it(
    'should run success callback with object result if encode url and expect json',
    async () => {
      const testSuccess: RequestSuccessCallback = vi.fn()
      const testError: RequestErrorCallback = vi.fn()

      const data = {
        success: true
      }

      mockFetchRequestArgs.data = data
      mockFetchRequestArgs.encode = 'url'

      await request({
        url: testUrl,
        encode: 'url',
        body: testBody,
        onError (error) {
          testError(error)
        },
        onSuccess (res) {
          testSuccess(res)
          expect(res).toEqual(data)
        }
      })

      expect(testSuccess).toHaveBeenCalledTimes(1)
      expect(testError).not.toHaveBeenCalled()
    }
  )

  it(
    'should run success callback with object result if expect and encode json',
    async () => {
      const testSuccess: RequestSuccessCallback = vi.fn()
      const testError: RequestErrorCallback = vi.fn()

      const data = {
        success: true
      }

      mockFetchRequestArgs.data = data

      await request({
        url: testUrl,
        body: testBody,
        onError (error) {
          testError(error)
        },
        onSuccess (res) {
          testSuccess(res)
          expect(res).toEqual(data)
        }
      })

      expect(testSuccess).toHaveBeenCalledTimes(1)
      expect(testError).not.toHaveBeenCalled()
    }
  )
})
