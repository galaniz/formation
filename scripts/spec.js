// @ts-check

/**
 * Scripts - Spec
 */

/* Imports */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { extname, resolve } from 'node:path'
import * as sass from 'sass'

/**
 * Recurse src json files to generate spec test files
 *
 * @return {Promise<void>}
 */
const init = async () => {
  try {
    const files = await readdir('src', { withFileTypes: true, recursive: true })
    const globalStyles = sass.compile('frm/global/global.scss', {
      style: 'compressed'
    })

    for (const file of files) {
      if (file.isDirectory()) {
        continue
      }

      const { name, path } = file
      const ext = extname(name)

      if (ext === '.DS_Store') {
        continue
      }

      const isJson = ext === '.json'

      if (!isJson) {
        continue
      }

      const json = await readFile(resolve(path, name), { encoding: 'utf8' })
      const data = JSON.parse(json)
      const componentDir = path.replace(/src\/|__tests__/g, '')
      const componentName = componentDir.split('/').pop()
      const componentStyles = sass.compile(`frm/${componentDir}/${componentName}.scss`, {
        style: 'compressed'
      })

      let output = ''

      for (const instanceName of data) {
        const instance = await import(`../frm/${componentDir}/${instanceName}.js`)

        output += /* html */`<div class="py-32">${instance}</div>`
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
  } catch (error) {
    console.error('[FRM] Error creating spec files ', error)
  }
}

init()
