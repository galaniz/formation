/**
 * Mocks - Document
 */

/* Imports */

import { JSDOM } from 'jsdom'

/* Document object */

const dom = new JSDOM()

global.document = dom.window.document
