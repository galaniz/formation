/**
 * Tests - Test Setup
 */

/* Imports */

import { PropertySymbol } from 'happy-dom'

/* Global methods */

// @ts-expect-error
const browserWindow = global.document[PropertySymbol.ownerWindow]

global.document = browserWindow.document
global.setTimeout = browserWindow.setTimeout
global.clearTimeout = browserWindow.clearTimeout
global.setInterval = browserWindow.setInterval
global.clearInterval = browserWindow.clearInterval
global.requestAnimationFrame = browserWindow.requestAnimationFrame
global.cancelAnimationFrame = browserWindow.cancelAnimationFrame
global.queueMicrotask = browserWindow.queueMicrotask
