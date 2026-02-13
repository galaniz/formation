// @ts-check

/**
 * Scripts - Spec
 */

/* Imports */

import { readFile, writeFile, glob } from 'node:fs/promises'
import { dirname } from 'node:path'
import * as sass from 'sass'

/* Recurse src json files to generate spec test files and clear coverage */

const globalStyles = sass.compile('frm/global/global.scss', {
  style: 'compressed'
})

/** @type {Record<string, string>} */
const templates = {}

for await (const entry of glob('frm/**/*Templates.js')) {
  const template = await import(`../${entry}`)

  templates[dirname(entry).replace('frm/', '')] = template.default
}

/** @type {Record<string, string>} */
const scripts = {}

for await (const entry of glob('frm/**/*Scripts.js')) {
  const script = await import(`../${entry}`)

  scripts[dirname(entry).replace('frm/', '')] = script.default
}

for await (const entry of glob('src/**/*.json')) {
  const json = await readFile(entry, {
    encoding: 'utf8'
  })

  const path = entry
    .replace('src/', '')
    .replace('__tests__/', '')
    .replace('.json', '')

  const pathArr = path.split('/')
  const name = pathArr.pop()
  const newPath = pathArr.join('/')
  const parent = pathArr.pop()

  const componentStyles = sass.compile(`frm/${newPath}/${parent}.scss`, {
    style: 'compressed'
  })

  const data = JSON.parse(json)
  let sectionClasses = 'py-32'
  let output = ''

  if (parent !== 'Slider') {
    sectionClasses += ' container'
  }

  for (const instanceName of data) {
    const instance = await import(`../frm/${newPath}/${instanceName}.js`)

    output += /* html */`<section class="${sectionClasses}">${instance.default}</section>`
  }

  await writeFile(
    `spec/${newPath}/__tests__/${name}.html`,
    /* html */`
    <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${name?.replace(/([A-Z])/g, ' $1').trim()} Test</title>
        <style>
          ${globalStyles.css || ''}
          ${componentStyles.css || ''}
        </style>
      </head>
      <body class="flex col">
        <main>${output}</main>
        ${templates[newPath] || ''}
        ${scripts[newPath] || ''}
        <script type="module" src="/spec/${newPath}/${name}Register.js"></script>
      </body>
    </html>
    `
  )
}
