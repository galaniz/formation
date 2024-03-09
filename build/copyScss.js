/**
 * Buid - Copy Scss
 */

/* Imports */

import { cp, readdir } from 'node:fs/promises'
import { extname } from 'node:path'

/**
 * Function - recurse src for scss files and copy to lib
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

      await cp(fullPath, fullPath.replace('src', 'lib'), { recursive: true })
    }
  } catch (error) {
    console.error('[FRM] Error copying scss files ', error)
  }
}

init()
