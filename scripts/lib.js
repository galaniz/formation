// @ts-check

/**
 * Scripts - Lib
 */

/* Imports */

import { cp, glob } from 'node:fs/promises'

/* Recurse src for scss files and copy to lib */

for await (const entry of glob('src/**/*.scss')) {
  await cp(entry, entry.replace('src', 'lib'), {
    recursive: true
  })
}
