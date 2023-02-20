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
  innerFocusableItems,
  getOuterFocusableItems
} from './functions/toggle-focusability'

/* Get values from DOM */

import { closest } from './functions/closest'
import { getKey } from './functions/get-key'
import { getDefaultFontSize } from './functions/get-default-font-size'
import { setElements } from './functions/set-elements'

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
  setElements,
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
  innerFocusableItems,
  getOuterFocusableItems,
  setCookie,
  getCookie,
  getDuration
}
