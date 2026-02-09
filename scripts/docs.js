/**
 * Scripts - Docs
 */

/* Imports */

import { renderMarkdownDocs } from '@alanizcreative/formation-docs/docs.js'

/* Create README */

await renderMarkdownDocs({
  include: 'src/**/*.ts',
  exclude: [
    'src/**/*.test.ts',
    'src/**/*.spec.ts'
  ],
  docsExclude: 'src/**/!(*global)Types.ts',
  docsTypes: 'src/**/*Types.ts',
  index: `
  /**
   * @file
   * title: Formation
   * Reusable TS web components and utilities, and SCSS generated utility classes.
   *
   * @example
   * title: Installation
   * shell: npm install -D @alanizcreative/formation
   *
   * @index
   */
  `
})
