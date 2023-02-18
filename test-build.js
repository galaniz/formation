#!/usr/bin/env node

/**
 * Esbuild config
 */

/* Imports */

const esbuild = require('esbuild')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const postcssPresetEnv = require('postcss-preset-env')
const { sassPlugin } = require('esbuild-sass-plugin')

/* Build */

const entryPoints = {}
const namespace = 'frm'

entryPoints[`js/${namespace}`] = './test/assets/src/index.js'
entryPoints[`css/${namespace}`] = './test/assets/src/index.scss'

esbuild.build({
  entryPoints,
  outdir: './test/assets/public',
  minify: true,
  bundle: true,
  sourcemap: false,
  target: 'es6',
  plugins: [sassPlugin({
    async transform (source) {
      const { css } = await postcss(
        [
          autoprefixer,
          postcssPresetEnv({
            stage: 4
          })
        ]
      ).process(
        source,
        {
          from: `css/${namespace}.css`
        }
      )

      return css
    }
  })]
})
