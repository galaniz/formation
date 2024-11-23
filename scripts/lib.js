// @ts-check

/**
 * Scripts - Lib
 */

/* Imports */

import { cp, readdir } from 'node:fs/promises'
import { extname } from 'node:path'

/**
 * Recurse src for scss files and copy to lib
 *
 * @return {Promise<void>}
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
      const isScss = ext === '.scss'

      if (!isScss) {
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
