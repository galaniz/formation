/**
 * Utils
 */

/* Alter DOM */

import { prefix } from './functions/prefix'
import { setLoaders } from './functions/set-loaders'
import { stopScroll } from './functions/stop-scroll'
import { usingMouse } from './functions/using-mouse'
import {
  toggleFocusability,
  focusSelector,
  isItemFocusable,
  getInnerFocusableItems,
  getOuterFocusableItems
} from './functions/toggle-focusability'

/* Get values from DOM */

import { closest } from './functions/closest'
import { getKey } from './functions/get-key'
import { getDefaultFontSize } from './functions/get-default-font-size'
import { getOuterElements } from './functions/get-outer-elements'
import { setElements } from './functions/set-elements'
import { setSettings } from './functions/set-settings'

/* Check DOM */

import { assetLoaded, assetsLoaded } from './functions/assets-loaded'

/* Object helpers */

import { mergeObjects } from './functions/merge-objects'
import { recurseObject } from './functions/recurse-object'

/* Ajax requests */

import { urlEncode } from './functions/url-encode'
import { objectToFormData } from './functions/object-to-form-data'
import { request } from './functions/request'

/* Misc */

import { cascade } from './functions/cascade'
import { publish, subscribe } from './functions/pub-sub'
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
  publish,
  subscribe,
  stopScroll,
  usingMouse,
  toggleFocusability,
  focusSelector,
  isItemFocusable,
  getInnerFocusableItems,
  getOuterFocusableItems,
  setCookie,
  getCookie,
  getDuration
}
