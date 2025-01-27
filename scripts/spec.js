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

  const fileName = basename(entry)
  const parentPath = entry.replace(`/__tests__/${fileName}`, '')
  const componentDir = parentPath.replace('src/', '')
  const componentName = componentDir.split('/').pop()
  const componentStyles = sass.compile(`frm/${componentDir}/${componentName}.scss`, {
    style: 'compressed'
  })

  const data = JSON.parse(json)
  let output = ''

  for (const instanceName of data) {
    const instance = await import(`../frm/${componentDir}/${instanceName}.js`)

    output += /* html */`<div class="py-32">${instance.default}</div>`
  }

  await writeFile(
    `spec/${componentDir}/__tests__/${componentName}.html`,
    /* html */`
    <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${componentName?.replace(/([A-Z])/g, ' $1').trim()} Test</title>
        <style>
          ${globalStyles.css != null ? globalStyles.css : ''}
          ${componentStyles.css != null ? componentStyles.css : ''}
        </style>
      </head>
      <body>
        ${output}
      </body>
      <script type="module" src="/spec/${componentDir}/${componentName}Register.js"></script>
    </html>
    `
  )
}
