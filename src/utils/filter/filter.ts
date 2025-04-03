/**
 * Utils - Filter
 */

/* Imports */

import type { GenericFunction } from '../../global/globalTypes.js'
import { isSet, isSetStrict } from '../set/set.js'
import { isStringStrict } from '../string/string.js'
import { isFunction } from '../function/function.js'

/**
 * Filter callbacks by name
 *
 * @type {Map<string, Set<GenericFunction>>}
 */
const filters: Map<string, Set<GenericFunction>> = new Map()

/**
 * Add filter to filters map
 *
 * @param {string} name
 * @param {GenericFunction} filter
 * @return {boolean}
 */
const addFilter = (name: string, filter: GenericFunction): boolean => {
  if (!isStringStrict(name) || !isFunction(filter)) {
    return false
  }

  if (!isSet(filters.get(name))) {
    filters.set(name, new Set())
  }

  filters.get(name)?.add(filter)

  return true
}

/**
 * Remove filter from filters map
 *
 * @param {string} name
 * @param {GenericFunction} filter
 * @return {boolean}
 */
const removeFilter = (name: string, filter: GenericFunction): boolean => {
  if (!isStringStrict(name) || !isFunction(filter)) {
    return false
  }

  const filterSet = filters.get(name)

  if (!isSet(filterSet)) {
    return false
  }

  return filterSet.delete(filter)
}

/**
 * Update value from callback return values
 *
 * @param {string} name
 * @param {*} value
 * @param {*} [args]
 * @return {*}
 */
const applyFilters = <T>(name: string, value: T, args?: unknown): T => {
  const filterSet = filters.get(name)

  if (!isSetStrict(filterSet)) {
    return value
  }

  for (const callback of filterSet.values()) {
    value = callback(value, args) as T
  }

  return value
}

/* Exports */

export {
  filters,
  addFilter,
  removeFilter,
  applyFilters
}
