// @ts-check

/**
 * Scripts - Spec
 */

/* Imports */

import { basename } from 'node:path'
import { readFile, writeFile, glob } from 'node:fs/promises'
import * as sass from 'sass'

/* Recurse src json files to generate spec test files and clear coverage */

const globalStyles = sass.compile('frm/global/global.scss', {
  style: 'compressed'
})

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
      <body>
        ${output}
      </body>
      <script type="module" src="/spec/${newPath}/${name}Register.js"></script>
    </html>
    `
  )
}
