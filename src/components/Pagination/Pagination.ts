// @ts-nocheck

/**
 * Objects - Load More
 *
 * @param {object} args
 * @param {HTMLElement} args.next
 * @param {HTMLElement} args.nextContainer - no pagination
 * @param {HTMLElement} args.prev - pagination
 * @param {HTMLElement} args.current - pagination
 * @param {HTMLElement} args.tot - pagination
 * @param {HTMLElement[]} args.filters
 * @param {HTMLElement} args.filtersForm
 * @param {HTMLElement} args.loader
 * @param {HTMLElement} args.error
 * @param {string} args.url
 * @param {string} args.encode
 * @param {object} args.data
 * @param {number} args.ppp - per page
 * @param {number} args.page - pagination
 * @param {number} args.total - pagination total pages else total number of items
 * @param {HTMLElement} args.insertInto
 * @param {string} args.insertLocation
 * @param {boolean/function} args.replaceInsert
 * @param {boolean/function} args.afterInsert
 * @param {function} args.filterPushUrlParams
 * @param {function} args.filterPostData
 * @param {object} args.noResults
 * @param {HTMLElement[]} args.noResults.containers
 * @param {HTMLElement[]} args.noResults.buttons
 */

/* Imports */

import {
  request,
  setLoaders,
  focusSelector
} from '../../utils/utils'

/* Class */

class LoadMore {
  /**
   * Constructor
   */

  constructor (args) {
    /**
     * Public variables
     */

    const {
      next = null,
      nextContainer = null,
      prev = null,
      current = null,
      tot = null,
      filters = [],
      filtersForm = null,
      loader = null,
      noResults = {
        containers: [],
        buttons: []
      },
      error = null,
      url = '',
      encode = 'url',
      data = {},
      ppp = 0,
      page = 1,
      total = 0,
      insertInto = null,
      insertLocation = 'beforeend',
      replaceInsert = false,
      afterInsert = false,
      filterPushUrlParams = () => {},
      filterControlUrls = () => {},
      filterPostData = () => this._data
    } = args

    this.next = next
    this.nextContainer = nextContainer
    this.prev = prev
    this.current = current
    this.tot = tot
    this.filters = filters
    this.filtersForm = filtersForm
    this.loader = loader
    this.noResults = noResults
    this.error = error
    this.url = url
    this.encode = encode
    this.data = data
    this.ppp = ppp
    this.page = page
    this.total = total
    this.insertInto = insertInto
    this.insertLocation = insertLocation
    this.replaceInsert = replaceInsert
    this.afterInsert = afterInsert
    this.filterPushUrlParams = filterPushUrlParams
    this.filterControlUrls = filterControlUrls
    this.filterPostData = filterPostData

    /**
     * Internal variables
     */

    /* For pushState */

    this._urlSupported = true
    this._url = ''

    /* If prev and pagination */

    this._pagination = false

    /* Store initial count */

    this._initCount = 0

    /* Buttons for setLoaders */

    this._controls = []

    /**
     * Initialize
     */

    const init = this._initialize()

    if (!init) {
      return false
    }
  }

  /**
   * Initialize
   */

  _initialize () {
    /* Check that required variables not null */

    if (!this.next || !this.url || !this.ppp || !this.total || !this.insertInto) {
      return false
    }

    /* Check if URL constructor supported */

    if (typeof window.URL !== 'function' || typeof URL.createObjectURL !== 'function' || typeof URL.revokeObjectURL !== 'function') {
      this._urlSupported = false
    }

    if (this._urlSupported) {
      this._url = new URL(window.location)
    }

    /* Check for pagination */

    if (this.prev && this.current) {
      this._pagination = true
      this.prev.setAttribute('data-pag-prev', '')
      this.next.setAttribute('data-pag-next', '')
    }

    /* For hiding when nothing more to load */

    if (!this.nextContainer && !this._pagination) {
      this.nextContainer = this.next
    }

    if (!this._pagination) {
      /* Set buttons for setLoaders */

      this._controls.push(this.next)

      if (this.prev) {
        this._controls.push(this.prev)
      }
    }

    /* setLoaders expects array */

    this.loader = this.loader ? [this.loader] : []

    /* Data */

    this._initCount = this.insertInto.children.length

    this._data = {
      ppp: this.ppp,
      total: this.total,
      count: this._initCount,
      filters: {}
    }

    if (this._pagination) {
      this._data.page = this.page
      this._data.count = this._getCount()
    } else {
      this._data.offset = this._initCount
    }

    /* Append public data */

    Object.keys(this.data || {}).forEach((d) => {
      this._data[d] = this.data[d]
    })

    /* Add event listeners */

    this.next.addEventListener('click', this._load.bind(this))

    if (this.prev) {
      this.prev.addEventListener('click', this._load.bind(this))
    }

    if (this._pagination) {
      window.onpopstate = this._popState.bind(this)
    }

    /* Set filters */

    if (this.filters.length && this.filtersForm) {
      this.filtersForm.addEventListener('submit', (e) => {
        e.preventDefault()

        this._load('reset')
      })

      this.filters.forEach(f => {
        const args = {
          currentTarget: f
        }

        f.addEventListener('change', this._filter.bind(this))

        /* Init (if selected add to data filter attribute) */

        this._filter(args, 'init')
      })

      /* Disable if no items to start */

      if (!this._initCount) {
        this._disableFilters(true)
      }
    }

    /* Back to all results */

    if (this.noResults.buttons) {
      this.noResults.buttons.forEach(b => {
        b.addEventListener('click', () => {
          this._data.filters = {}

          /* Clear filters */

          if (this.filters.length && this.filtersForm) {
            this.filters.forEach(f => {
              this._setFilter(f, 'null')
            })
          }

          this._load('reset-no-res')
        })
      })
    }

    /* Push for initial state */

    this._pushState('init', this.insertInto.innerHTML)

    /* Set controls for initial state */

    this._setControls()

    return true
  }

  /**
   * Getters
   */

  /* Get input type */

  _getType (input) {
    let type = ''
    const loadMoreType = input.getAttribute('data-load-more-type')

    if (!loadMoreType) {
      type = input.tagName.toLowerCase()

      if (type === 'input') {
        type = input.type
      }

      input.setAttribute('data-load-more-type', type)
    } else {
      type = loadMoreType
    }

    return type
  }

  /* Get item count */

  _getCount () {
    let c = this.insertInto.children.length

    /* For page beyond first add previous page item counts */

    if (this._pagination) {
      if (this._data.page > 1) {
        c += this.ppp * (this._data.page - 1)
      }
    }

    return c
  }

  /**
   * Setters
   */

  /* Set filter input */

  _setFilter (f, compareValue = undefined, state = 'default') { // If compareValue undefined than clear input
    let id = f.id
    const value = f.value
    const operator = f.getAttribute('data-operator')
    const type = this._getType(f)

    if (type === 'radio') {
      id = f.name
    }

    if (state === 'init') {
      compareValue = 'null'

      switch (type) {
        case 'checkbox':
          if (f.checked) {
            compareValue = value
          }

          break
        case 'radio': {
          const r = Array.from(f.form.querySelectorAll(`[name="${id}"]`))

          r.forEach(rr => {
            if (rr.checked) {
              compareValue = rr.value
            }
          })

          break
        }
        default:
          if (value) {
            compareValue = value
          }
      }
    }

    const equalToCompareVal = value === compareValue

    if (equalToCompareVal) {
      /* Selected */

      this._data.filters[id] = {
        value,
        operator
      }
    }

    switch (type) {
      case 'checkbox':
      case 'radio':
        f.checked = equalToCompareVal

        break
      case 'select': {
        const opts = Array.from(f.options)

        opts.forEach(o => {
          o.selected = o.value === compareValue
        })

        break
      }
      default:
        f.value = equalToCompareVal ? value : ''
    }
  }

  /* Set display/disable of prev/next */

  _setControls () {
    const isFirstPage = this._data.page === 1

    if (this._data.count >= this._data.total) {
      if (this.nextContainer) {
        this.nextContainer.style.display = 'none'
      }

      if (this._pagination) {
        this.next.disabled = true
        this.next.setAttribute('aria-disabled', true)
        this.next.removeAttribute('href')
      }
    } else {
      if (this.nextContainer) {
        this.nextContainer.style.display = 'block'
      }

      if (this._pagination) {
        this.next.disabled = false
        this.next.setAttribute('aria-disabled', false)
      }
    }

    if (this._pagination) {
      this.prev.disabled = isFirstPage // Account for one page
      this.prev.setAttribute('aria-disabled', isFirstPage)

      if (isFirstPage) {
        this.prev.removeAttribute('href')
      }
    }

    /* No items disable both */

    if (!this._data.count && this._pagination) {
      this.next.disabled = true
      this.prev.disabled = true

      this.next.setAttribute('aria-disabled', true)
      this.prev.setAttribute('aria-disabled', true)

      this.next.removeAttribute('href')
      this.prev.removeAttribute('href')
    }
  }

  _setControlUrls (urlParams) {
    if (!this._pagination) {
      return
    }

    const controlUrls = this.filterControlUrls({
      urlParams,
      total: this.total
    })

    if (controlUrls.prev && this.prev.getAttribute('aria-disabled') !== 'true') {
      this.prev.setAttribute('href', controlUrls.prev)
    }

    if (controlUrls.next && this.next.getAttribute('aria-disabled') !== 'true') {
      this.next.setAttribute('href', controlUrls.next)
    }
  }

  /* Add output to insertInto element */

  _setOutput (output = '', done = () => {}) {
    if (this.replaceInsert) {
      this.replaceInsert(
        output,
        this.insertInto,
        () => {
          done()
        }
      )
    } else {
      let lastChildIndex = 0

      if (this._pagination) {
        this.insertInto.innerHTML = ''
      } else {
        if (this.afterInsert) {
          lastChildIndex = this.insertInto.children.length - 1
        }
      }

      this.insertInto.insertAdjacentHTML(this.insertLocation, output)

      done()

      setTimeout(() => {
        if (this.afterInsert) {
          let insertedItems = []

          insertedItems = Array.from(this.insertInto.children)

          if (!this._pagination) {
            insertedItems = insertedItems.filter((item, index) => {
              return index > lastChildIndex
            })
          }

          this.afterInsert(insertedItems)
        }
      }, 0)
    }
  }

  /* Set pagination numbers */

  _setPagNum (total) {
    if (this.current) {
      this.current.textContent = total ? this._data.page : 0
    }

    if (this.tot) {
      this.tot.textContent = Math.ceil(total / this.ppp)
    }
  }

  /**
   * No results
   */

  /* When filters change reset offset/page and count */

  _reset () {
    this._data.count = 0

    if (this._pagination) {
      this._data.page = 1
    } else {
      this._data.offset = 0
    }
  }

  /* Disable/enable filters */

  _disableFilters (show = true) {
    if (this.filters.length && this.filtersForm) {
      this.filters.forEach(f => {
        f.disabled = !!show
        f.setAttribute('aria-disabled', show ? 'true' : 'false')
      })
    }
  }

  /* When no results */

  _noResults (show = true) {
    this._disableFilters(show)

    if (show) {
      this.insertInto.innerHTML = ''
    }

    /* Show nothing found message */

    if (this.noResults.containers.length) {
      this.noResults.containers.forEach(c => {
        c.style.display = show ? 'block' : 'none'
      })
    }
  }

  _error (show = true) {
    this._disableFilters(show)

    if (this.error) {
      this.error.style.display = show ? 'block' : 'none'
    }
  }

  /**
   * Push to browser history if pagination
   */

  /* Add url and data to browser history */

  _pushState (state, output) {
    if (!this._pagination) {
      return
    }

    let url = ''
    const data = {
      data: this._data,
      state,
      html: output ? this.insertInto.innerHTML : ''
    }

    if (this._urlSupported && this._url) {
      const params = this.filterPushUrlParams(state, this._data)

      this._setControlUrls(params)

      Object.keys(params || {}).forEach((u) => {
        const v = params[u]

        if (v === 'load_more_delete_param') {
          this._url.searchParams.delete(u)
        } else {
          this._url.searchParams.set(u, v)
        }
      })

      url = this._url
    }

    if (url) {
      window.history.pushState(data, '', url)
    } else {
      window.history.pushState(data, '')
    }
  }

  /**
   * Update state after response
   */

  /* After response set vars/items */

  _afterResponse (args = {}) {
    const a = Object.assign({
      reset: false,
      total: 0,
      state: 'default',
      output: ''
    }, args)

    this._data.count = this._getCount()

    /* Get new total */

    if (a.reset) {
      this._data.total = a.total
    }

    this._setControls()
    this._setPagNum(a.total)

    setLoaders(this.loader, this._controls, false)

    /* History entry */

    this._pushState(a.state, a.output)
  }

  /**
   * Event handlers
   */

  _filter (e, state = 'default') {
    const f = e.currentTarget
    const compareValue = f.value

    this._setFilter(f, compareValue, state)
  }

  _popState (e) {
    if (!this._pagination) {
      return
    }

    if (e.state) {
      this._data = Object.assign(this._data, e.state.data)

      /* Output */

      this._history = e.state.html
      this._load('history')

      if (this.filters.length && this.filtersForm) {
        this.filters.forEach(f => {
          let id = f.id
          const type = this._getType(f)

          if (type === 'radio') {
            id = f.name
          }

          let compareValue = 'null'

          if (Object.getOwnPropertyDescriptor(this._data.filters, id)) {
            compareValue = this._data.filters[id].value
          }

          this._setFilter(f, compareValue)
        })
      }
    }
  }

  _load (e) {
    /* If pagination */

    let nextPag = false

    if (e !== undefined && !(typeof e === 'string' || e instanceof String)) {
      e.preventDefault()

      nextPag = e.currentTarget.hasAttribute('data-pag-next')
    }

    /* Set states */

    let state = 'default'
    let reset = false

    if (typeof e === 'string' || e instanceof String) {
      state = e
    }

    if (e === 'reset' || e === 'reset-no-res') {
      reset = true
    }

    /* Reset */

    if (reset) {
      this._reset()
    }

    this._noResults(false)
    this._error(false)

    setLoaders(this.loader, this._controls, true)

    if (this.loader.length) {
      this.loader[0].focus()
    }

    if (e === 'history') {
      this.insertInto.innerHTML = ''

      if (this._history) {
        this._setOutput(this._history)
      } else {
        this._noResults()
      }

      this._setControls()
      setLoaders(this.loader, this._controls, false)
    } else {
      /* Update page fetching */

      if (this._pagination) {
        if (nextPag) {
          this._data.page += 1
        } else {
          this._data.page -= 1

          if (this._data.page < 1) {
            this._data.page = 1
          }
        }
      }

      /* Request args */

      const args = {
        method: 'POST',
        url: this.url,
        encode: this.encode
      }

      args.body = this.filterPostData(this._data)

      /* Make request */

      setTimeout(() => {
        /* Fetch more items */

        request(args)
          .then(response => {
            if (!response) {
              if (reset) {
                this._noResults()
              }

              this._afterResponse({
                reset,
                total: 0,
                state
              })

              return
            }

            const result = JSON.parse(response)
            const rowCount = result.row_count
            const output = result.output
            const total = parseInt(result.total)

            if (reset) {
              this.insertInto.innerHTML = ''
            }

            if (rowCount > 0 && output !== '') {
              if (!this._pagination) {
                this._data.offset += this.ppp
              }

              this._setOutput(output, () => {
                const firstFocusable = this.insertInto.querySelector(focusSelector)

                if (firstFocusable) {
                  firstFocusable.focus()
                }

                setTimeout(() => {
                  this._afterResponse({
                    reset,
                    total,
                    state,
                    output
                  })
                }, 0)
              })
            } else {
              if (reset) {
                this._noResults()
              }

              this._afterResponse({
                reset,
                total,
                state
              })
            }
          })
          .catch(() => {
            this._data.total = 0
            this._data.count = 0
            this._data.page = 1

            this._setControls()
            this._setPagNum(0)

            this._error(true)

            setLoaders(this.loader, this._controls, false)
          })
      }, 0)
    }
  }
}

/* Exports */

export { LoadMore }
