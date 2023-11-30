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

export { cascade } from './functions/cascade'
export { addAction, doActions } from './actions/actions'
export { setCookie, getCookie } from './functions/cookie'
export { getDuration } from './functions/get-duration'

/* Exports */

export {
  setLoaders,
  prefix,
  stopScroll,
  toggleFocusability,
  focusSelector,
  isItemFocusable,
  getInnerFocusableItems,
  getOuterFocusableItems
}
