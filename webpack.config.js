/**
 * Webpack config
 */

/* Imports */

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

/* Namespace */

const n = 'test'

/* Output path */

const outputPath = path.resolve(__dirname, 'test', 'assets', 'public')

/* Asset paths */

const assetsPath = path.resolve(__dirname, 'test', 'assets', 'src')

/* Resolve to root */

const resolve = {
  extensions: [
    '.sass',
    '.scss',
    '.css',
    '.js',
    '.json',
    '.jsx'
  ]
}

/* Rules */

const rules = [
  {
    test: /\.(css|sass|scss)$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader
      },
      {
        loader: 'css-loader',
        options: {
          url: false,
          importLoaders: 1
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: {
              'postcss-preset-env': {
                browsers: [
                  'last 3 versions',
                  'edge >= 16'
                ],
                stage: 4
              },
              cssnano: {},
              'postcss-combine-duplicated-selectors': {}
            }
          }
        }
      },
      {
        loader: 'sass-loader',
        options: {
          implementation: require('sass'),
          sassOptions: {
            includePaths: [
              assetsPath
            ]
          }
        }
      }
    ]
  }
]

const rulesCompat = [
  {
    test: /\.js$/,
    loader: 'babel-loader',
    options: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: { chrome: '60', edge: '16' }
          }
        ]
      ]
    }
  },
  {
    test: /\.(css|sass|scss)$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader
      },
      {
        loader: 'css-loader',
        options: {
          url: false,
          importLoaders: 1
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: {
              'postcss-preset-env': {
                browsers: [
                  'last 3 versions',
                  'edge >= 16'
                ],
                stage: 4
              },
              cssnano: {},
              'postcss-combine-duplicated-selectors': {}
            }
          }
        }
      },
      {
        loader: 'sass-loader',
        options: {
          implementation: require('sass'),
          sassOptions: {
            includePaths: [
              assetsPath
            ]
          }
        }
      }
    ]
  }
]

/* Output environment */

const outputCompatEnv = {
  arrowFunction: false,
  bigIntLiteral: false,
  const: false,
  destructuring: false,
  dynamicImport: false,
  forOf: false,
  module: false
}

/* Entries */

let entries = []

entries.push({
  name: n,
  paths: [
    './test/assets/src/index.scss',
    './test/assets/src/index-compat.js'
  ]
})

entries.push({
  name: n,
  paths: [
    './test/assets/src/index.js'
  ]
})

entries = entries.map(e => {
  const obj = {}

  obj[e.name] = e.paths

  return obj
})

/* Exports */

module.exports = [
  {
    mode: 'production',
    entry: entries[0],
    output: {
      path: outputPath,
      publicPath: '/',
      filename: 'js/[name]-compat.js',
      environment: outputCompatEnv,
      chunkFormat: 'array-push'
    },
    module: {
      rules: rulesCompat
    },
    resolve,
    target: ['web', 'es5'],
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].css'
      })
    ]
  },
  {
    mode: 'production',
    entry: entries[1],
    output: {
      path: outputPath,
      publicPath: '/',
      filename: 'js/[name].js',
      chunkFormat: 'array-push'
    },
    module: {
      rules
    },
    resolve
  }
]
