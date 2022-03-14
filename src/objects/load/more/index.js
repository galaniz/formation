/**
 * Objects load: more content
 *
 * @param args [object] {
 *  @param next [HTMLElement]
 *  @param nextContainer [HTMLElement] - no pagination
 *  @param prev [HTMLElement] - pagination
 *  @param current [HTMLElement] - pagination
 *  @param tot [HTMLElement] - pagination
 *  @param filters [array]
 *  @param filtersForm [HTMLElement]
 *  @param loaders [array]
 *  @param error [HTMLElement]
 *  @param url [string]
 *  @param data [object]
 *  @param ppp [int] - per page
 *  @param page [int] - pagination
 *  @param total [int] - pagination total pages else total number of items
 *  @param insertInto [HTMLElement]
 *  @param insertLocation [string]
 *  @param onInsert [function]
 *  @param afterInsert [function]
 *  @param filterPushUrlParams [function]
 *  @param filterPostData [function]
 *  @param noResults [object] {
 *   @param containers [array]
 *   @param buttons [array]
 *  }
 * }
 */

/* Imports */

import {
  mergeObjects,
  request,
  setLoaders,
  urlEncode,
  assetsLoaded,
  getScrollY
} from '../../../utils'

/* Class */

class More {
  /**
   * Constructor
   */

  constructor (args) {
    /**
     * Public variables
     */

    this.next = null
    this.nextContainer = null
    this.prev = null
    this.current = null
    this.tot = null

    this.filters = []
    this.filtersForm = null

    this.loaders = []

    this.noResults = {
      containers: [],
      buttons: []
    }

    this.error = null

    this.url = ''
    this.data = {}

    this.ppp = 0
    this.page = 1
    this.total = 0

    this.insertInto = null
    this.insertLocation = 'beforeend'
    this.onInsert = () => {}
    this.afterInsert = () => {}

    this.filterPushUrlParams = () => {}
    this.filterPostData = () => this._data

    /**
     * Internal variables
     */

    /* For pushState */

    this._urlSupported = true
    this._url = ''

    /* If prev and pagination */

    this._pagination = false

    /* For scrolling back to top for pagination */

    this._insertIntoY = 0

    /* Store initial count */

    this._initCount = 0

    /* Buttons for setLoaders */

    this._controls = []

    /* Merge default variables with args */

    mergeObjects(this, args)

    /**
     * Initialize
     */

    const init = this._initialize()

    if (!init) { return false }
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

      if (this.prev) { this._controls.push(this.prev) }
    }

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

    for (const d in this.data) { this._data[d] = this.data[d] }

    /* Add event listeners */

    this.next.addEventListener('click', this._load.bind(this))

    if (this.prev) { this.prev.addEventListener('click', this._load.bind(this)) }

    if (this._pagination) { window.onpopstate = this._popState.bind(this) }

    /* Set filters */

    if (this.filters.length) {
      this.filters.forEach(f => {
        const type = this._getType(f)

        if (type === 'listbox') {
          f.onChange((ff, val) => {
            this._data.filters[ff.id] = {
              value: val
            }

            this._load('reset')
          })
        } else {
          const args = { currentTarget: f }

          if (type === 'search') {
            const submitSearchSelector = f.getAttribute('data-submit-selector')

            if (submitSearchSelector) {
              const submitSearch = document.querySelector(submitSearchSelector)

              if (submitSearch) {
                submitSearch.addEventListener('click', () => {
                  this._filter(args)
                })
              }
            }

            f.addEventListener('keydown', e => {
              const key = e.key || e.keyCode || e.which || e.code

              if ([13, 'Enter'].indexOf(key) !== -1) { this._filter(args) }
            })
          } else {
            f.addEventListener('change', this._filter.bind(this))
          }

          /* Init (if selected add to data filter attribute) */

          this._filter(args, 'init')
        }
      })

      /* Disable if no items to start */

      if (!this._initCount) { this._disableFilters(true) }
    }

    /* Back to all results */

    if (this.noResults.buttons) {
      this.noResults.buttons.forEach(b => {
        b.addEventListener('click', () => {
          this._data.filters = {}

          /* Clear filters */

          if (this.filters.length) {
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

    /* Set controls for initial state + get insert y */

    window.addEventListener('load', () => {
      this._setControls()
      this._getInsertIntoY()
    })

    if (this._pagination) {
      let resizeTimer

      window.addEventListener('resize', () => {
        /* Throttles resize event */

        clearTimeout(resizeTimer)

        resizeTimer = setTimeout(() => {
          this._getInsertIntoY()
        }, 100)
      })
    }

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
      if (input.type === 'listbox') {
        type = 'listbox'
      } else {
        type = input.tagName.toLowerCase()

        if (type === 'input') { type = input.type }
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
      if (this._data.page > 1) { c += this.ppp * (this._data.page - 1) }
    }

    return c
  }

  /* Get insertInto y position */

  _getInsertIntoY () {
    this._insertIntoY = this.insertInto.getBoundingClientRect().y + getScrollY()
  }

  /**
   * Setters
   */

  /* Set filter input */

  _setFilter (f, compareValue = undefined, state = 'default') { // if compareValue undefined than clear input
    let id = f.id
    const value = f.value
    const operator = f.getAttribute('data-operator')
    const type = this._getType(f)

    if (type === 'radio') { id = f.name }

    if (state === 'init') {
      compareValue = 'null'

      switch (type) {
        case 'checkbox':
          if (f.checked) { compareValue = value }

          break
        case 'radio': {
          const r = Array.from(document.querySelectorAll(`[name="${id}"]`))

          r.forEach(rr => {
            if (rr.checked) { compareValue = rr.value }
          })

          break
        }
        default:
          if (value) { compareValue = value }
      }
    }

    const equalToCompareVal = value === compareValue

    if (equalToCompareVal) {
      /* Selected */

      this._data.filters[id] = {
        value: value,
        operator: operator
      }
    }

    if (type === 'listbox') {
      if (!equalToCompareVal) { f.clear() }
    } else {
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
  }

  /* Set display/disable of prev/next */

  _setControls () {
    if (this._data.count >= this._data.total) {
      if (this.nextContainer) { this.nextContainer.style.display = 'none' }

      if (this._pagination) {
        this.next.disabled = true
        this.prev.disabled = this._data.page === 1 // account for one page
      }
    } else {
      if (this.nextContainer) { this.nextContainer.style.display = 'block' }

      if (this._pagination) {
        this.next.disabled = false
        this.prev.disabled = this._data.page === 1 // account for one page
      }
    }

    /* No items disable both */

    if (!this._data.count && this._pagination) {
      this.next.disabled = true
      this.prev.disabled = true
    }
  }

  /* Add output to insertInto element */

  _setOutput (output = '', done = () => {}) {
    const table = this.insertInto.tagName === 'TBODY'
    const docFragment = document.createDocumentFragment()
    const div = document.createElement(table ? 'TBODY' : 'DIV')

    div.innerHTML = output

    const imgs = Array.from(div.getElementsByTagName('img'))
    const insertedItems = Array.from(div.children)

    assetsLoaded(imgs, data => {
      this.onInsert(insertedItems)

      if (table) {
        insertedItems.forEach(item => {
          this.insertInto.appendChild(item)
        })
      } else {
        insertedItems.forEach(item => {
          docFragment.appendChild(item)
        })

        if (this._pagination) { this.insertInto.innerHTML = '' }

        this.insertInto.appendChild(docFragment)
      }

      done()

      setTimeout(() => {
        this.afterInsert(insertedItems)
      }, 0)
    })
  }

  /* Set pagination numbers */

  _setPagNum (total) {
    if (this.current) { this.current.textContent = total ? this._data.page : 0 }

    if (this.tot) { this.tot.textContent = Math.ceil(total / this.ppp) }
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
    if (this.filters.length) {
      if (this.filtersForm) { this.filtersForm.setAttribute('data-disabled', show ? 'true' : 'false') }

      this.filters.forEach(f => {
        const type = this._getType(f)

        if (type === 'listbox') {
          f.disable(!!show)
        } else {
          f.disabled = !!show
          f.setAttribute('aria-disabled', show ? 'true' : 'false')
        }
      })
    }
  }

  /* When no results */

  _noResults (show = true) {
    this._disableFilters(show)

    if (show) { this.insertInto.innerHTML = '' }

    /* Show nothing found message */

    if (this.noResults.containers.length) {
      this.noResults.containers.forEach(c => {
        c.style.display = show ? 'block' : 'none'
      })
    }
  }

  _error (show = true) {
    this._disableFilters(show)

    if (this.error) { this.error.style.display = show ? 'block' : 'none' }
  }

  /**
   * Push to browser history if pagination
   */

  /* Add url and data to browser history */

  _pushState (state, output) {
    if (!this._pagination) { return }

    let url = ''
    const data = {
      data: this._data,
      state: state,
      html: output ? this.insertInto.innerHTML : ''
    }

    if (this._urlSupported && this._url) {
      const params = this.filterPushUrlParams(state, this._data)

      for (const u in params) {
        const v = params[u]

        if (v === 'load_more_delete_param') {
          this._url.searchParams.delete(u)
        } else {
          this._url.searchParams.set(u, v)
        }
      }

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

    if (a.reset) { this._data.total = a.total }

    this._setControls()
    this._setPagNum(a.total)

    setLoaders(this.loaders, this._controls, false)

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

    if (state !== 'init') { this._load('reset') }
  }

  _popState (e) {
    if (!this._pagination) { return }

    if (e.state) {
      this._data = Object.assign(this._data, e.state.data)

      /* Output */

      this._history = e.state.html
      this._load('history')

      if (this.filters.length) {
        this.filters.forEach(f => {
          let id = f.id
          const type = this._getType(f)

          if (type === 'radio') { id = f.name }

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

    if (typeof e === 'string' || e instanceof String) { state = e }

    if (e === 'reset' || e === 'reset-no-res') { reset = true }

    /* Reset */

    if (reset) { this._reset() }

    this._noResults(false)
    this._error(false)

    setLoaders(this.loaders, this._controls, true)

    if (e === 'history') {
      this.insertInto.innerHTML = ''

      if (this._history) {
        this._setOutput(this._history)
      } else {
        this._noResults()
      }

      this._setControls()
      setLoaders(this.loaders, this._controls, false)
    } else {
      /* Update page fetching */

      if (this._pagination) {
        if (nextPag) {
          this._data.page += 1
        } else {
          this._data.page -= 1

          if (this._data.page < 1) { this._data.page = 1 }
        }
      }

      /* Get data as url encoded string */

      const encodedData = urlEncode(this.filterPostData(this._data))

      console.log('DATA', this._data)

      setTimeout(() => {
        /* Fetch more items */

        request({
          method: 'POST',
          url: this.url,
          headers: { 'Content-type': 'application/x-www-form-urlencoded' },
          body: encodedData
        })
          .then(response => {
            if (!response) {
              if (reset) { this._noResults() }

              this._afterResponse({
                reset: reset,
                total: 0,
                state: state
              })

              return
            }

            const result = JSON.parse(response)
            const rowCount = result.row_count
            const output = result.output
            const total = parseInt(result.total)

            console.log('RESULT', result)

            if (reset) { this.insertInto.innerHTML = '' }

            if (rowCount > 0 && output !== '') {
              if (!this._pagination) { this._data.offset += this.ppp }

              this._setOutput(output, () => {
                if (this._pagination) {
                  document.documentElement.setAttribute('data-load-scroll', '')

                  window.scrollTo(0, this._insertIntoY)

                  setTimeout(() => {
                    document.documentElement.removeAttribute('data-load-scroll')
                  }, 0)
                }

                setTimeout(() => {
                  this._afterResponse({
                    reset: reset,
                    total: total,
                    state: state,
                    output: output
                  })
                }, 0)
              })
            } else {
              if (reset) { this._noResults() }

              this._afterResponse({
                reset: reset,
                total: total,
                state: state
              })
            }
          })
          .catch(xhr => {
            console.log('ERROR', xhr)

            this._data.total = 0
            this._data.count = 0
            this._data.page = 1

            this._setControls()
            this._setPagNum(0)

            this._error(true)

            setLoaders(this.loaders, this._controls, false)
          })
      }, 0)
    }
  }
} // End More

/* Exports */

export default More
