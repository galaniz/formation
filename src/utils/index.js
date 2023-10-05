/**
 * Utils
 */

/* Alter DOM */

import { prefix } from './functions/prefix'
import { setLoaders } from './functions/set-loaders'
import { stopScroll } from './functions/stop-scroll'
import {
  toggleFocusability,
  focusSelector,
  isItemFocusable,
  getInnerFocusableItems,
  getOuterFocusableItems
} from './functions/toggle-focusability'

/* Get values from DOM */

export { closest } from './functions/closest'
export { getKey } from './functions/get-key'
export { getDefaultFontSize } from './functions/get-default-font-size'
export { getOuterElements } from './functions/get-outer-elements'
export { setElements } from './functions/set-elements'
export { setSettings } from './functions/set-settings'
export { setItems } from './setItems/setItems'

/* Check DOM */

export { assetLoaded, assetsLoaded } from './functions/assets-loaded'

/* Object helpers */

export { isObject } from './isObject/isObject'
export { mergeObjects } from './functions/merge-objects'
export { recurseObject } from './functions/recurse-object'
export { renderHtmlString } from './renderHtmlString/renderHtmlString'

/* Ajax requests */

export { urlEncode } from './functions/url-encode'
export { objectToFormData } from './functions/object-to-form-data'
export { request } from './functions/request'

/* Misc */

import { cascade } from './functions/cascade'
import { addAction, doActions } from './actions/actions'
import { setCookie, getCookie } from './functions/cookie'
import { getDuration } from './functions/get-duration'

/* Exports */

export {
  setLoaders,
  prefix,
  closest,
  getKey,
  getDefaultFontSize,
  getOuterElements,
  setElements,
  setSettings,
  assetLoaded,
  assetsLoaded,
  mergeObjects,
  recurseObject,
  urlEncode,
  objectToFormData,
  request,
  cascade,
  addAction,
  doActions,
  stopScroll,
  toggleFocusability,
  focusSelector,
  isItemFocusable,
  getInnerFocusableItems,
  getOuterFocusableItems,
  setCookie,
  getCookie,
  getDuration
}
