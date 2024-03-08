/**
 * Build - Copy Scss
 */

/* Imports */

import { copyFile, readdir } from 'node:fs/promises'
import { extname } from 'node:path'

/**
 * Function - recurse src folder and copy all scss files to lib
 *
 * @return {void}
 */
const init = async () => {
  try {
    const files = await readdir('src', { withFileTypes: true, recursive: true })

    for (const file of files) {
      if (file.isDirectory()) {
        continue
      }

      const { name, path } = file

      const ext = extname(name)

      if (ext !== '.scss') {
        continue
      }

      const fullPath = `${path}/${name}`

      await copyFile(fullPath, fullPath.replace('src', 'lib'))
    }
  } catch (error) {
    console.error('[FRM] Error copying scss files ', error)
  }
}

init()
