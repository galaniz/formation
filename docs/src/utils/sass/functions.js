
module.exports = [
  {
    text: 'calc-rem($px)',
    description: 'Convert number from px to rem.',
    parameters: {
      required: [
        {
          text: '$px {number}'
        }
      ]
    },
    returns: {
      text: 'number'
    }
  },
  {
    text: 'capitalize($str)',
    description: 'Convert string to capital case.',
    parameters: {
      required: [
        {
          text: '$str {string}'
        }
      ]
    },
    returns: {
      text: 'string'
    }
  },
  {
    text: 'get-color($color)',
    description: 'Hex color from name in `$colors-flat` map.',
    parameters: {
      optional: [
        {
          text: '$color {string}',
          description: 'Default is `background-light`'
        }
      ]
    },
    returns: {
      text: 'string'
    }
  },
  {
    text: 'map-recursive-merge($original, $overrides)',
    description: 'Recursively merge two maps.',
    parameters: {
      required: [
        {
          text: '$original {map}'
        },
        {
          text: '$overrides {map}'
        }
      ]
    },
    returns: {
      text: 'map'
    }
  },
  {
    text: 'strip-unit($number)',
    description: 'Remove unit from number.',
    parameters: {
      required: [
        {
          text: '$number {number}'
        }
      ]
    },
    returns: {
      text: 'number'
    }
  }
]
