
module.exports = [
  {
    text: 'assetLoaded(asset)',
    description: 'Check if single asset is loaded.',
    parameters: {
      required: [
        {
          text: 'asset {HTMLElement}'
        }
      ]
    },
    returns: {
      text: 'Promise'
    }
  },
  {
    text: 'assetsLoaded(assets, done)',
    description: 'Check if multiple assets are loaded.',
    parameters: {
      required: [
        {
          text: 'assets {array<HTMLElement>}',
          description: 'Default is `[]`'
        }
      ],
      optional: [
        {
          text: 'done {function}',
          description: 'Default is `() => {}`'
        }
      ]
    }
  },
  {
    text: 'cascade(events, repeat)',
    description: 'Sequentially and recursively call and delay functions.',
    parameters: {
      required: [
        {
          text: 'events {array<object>}'
        }
      ],
      optional: [
        {
          text: 'repeat {number}',
          description: 'Default is `1`'
        }
      ]
    },
    example: `
      import { cascade } from '@alanizcreative/formation/src/utils'

      cascade([
        {
          action: (i, done) => {
            doThis()
      
            let target = 10
      
            cascade([
              {
                action: (j) => {
                  doThisOtherThing()
      
                  if(j === target - 1) {
                    done() // Optional
                  }
                },
                delay: 100,
                increment: 50
              }
            ], target)
          },
          delay: 300
        }
      ])
    `
  },
  {
    text: 'closest(item, classes, max)',
    description: 'Traverse up DOM until find element with class.',
    parameters: {
      required: [
        {
          text: 'item {HTMLElement}'
        },
        {
          text: 'classes {string}'
        }
      ],
      optional: [
        {
          text: 'max {number}',
          description: 'Default is `10`'
        }
      ]
    },
    returns: {
      text: 'HTMLElement'
    }
  },
  {
    text: 'setCookie(name, value, expirationDays)',
    description: 'Set browser cookie.',
    parameters: {
      required: [
        {
          text: 'name {string}'
        },
        {
          text: 'value {string}'
        }
      ],
      optional: [
        {
          text: 'expirationDays {number}'
        }
      ]
    }
  },
  {
    text: 'getCookie(name)',
    description: 'Get browser cookie.',
    parameters: {
      required: [
        {
          text: 'name {string}'
        }
      ]
    },
    returns: {
      text: 'string'
    }
  },
  {
    text: 'getDefaultFontSize()',
    description: 'Get browser font size in pixels.',
    returns: {
      text: 'number'
    }
  },
  {
    text: 'getKey(event)',
    description: 'Normalize event key as uppercase code.',
    parameters: {
      required: [
        {
          text: 'event {object}'
        }
      ]
    },
    returns: {
      text: 'string'
    }
  },
  {
    text: 'mergeObjects(x, y)',
    description: 'Merge two objects up to one nested level deep.',
    parameters: {
      required: [
        {
          text: 'x {object}'
        }
      ],
      optional: [
        {
          text: 'y {object}'
        }
      ]
    },
    returns: {
      text: 'x {object}'
    }
  },
  {
    text: 'prefix(type, item, value)',
    description: 'Prefix transition or transform props on element.',
    parameters: {
      required: [
        {
          text: 'type {string}',
          description: 'Accepted values: transition, transform, transformOrigin, transitionDelay'
        },
        {
          text: 'item {HTMLElement}'
        },
        {
          text: 'value {string}'
        }
      ]
    }
  },
  {
    text: 'publish(name, args)',
    description: '',
    parameters: {
      required: [
        {
          text: 'name {string}'
        }
      ],
      optional: [
        {
          text: 'args {array}',
          description: 'Default is `[]`. Passed into callback functions.'
        }
      ]
    }
  },
  {
    text: 'subscribe(name, callback)',
    description: '',
    parameters: {
      required: [
        {
          text: 'name {string}'
        }
      ],
      optional: [
        {
          text: 'callback {function}',
          description: 'Default is `() => {}`'
        }
      ]
    },
    returns: {
      text: 'object'
    }
  },
  {
    text: 'recurseObject(obj, callback, condition)',
    description: 'Recurse through object if condition met otherwise run callback.',
    parameters: {
      required: [
        {
          text: 'obj {object}'
        }
      ],
      optional: [
        {
          text: 'callback {function|boolean}',
          description: 'Default is `false`'
        },
        {
          text: 'condition {function}',
          description: 'Default is `() => {}` that returns true'
        }
      ]
    }
  },
  {
    text: 'request(args)',
    description: 'Handle ajax requests with fetch method.',
    parameters: {
      optional: [
        {
          text: 'args {object}'
        }
      ]
    },
    returns: {
      text: 'Promise'
    }
  },
  {
    text: '',
    description: '',
    parameters: {
      required: [
        {
          text: ''
        }
      ],
      optional: [
        {
          text: ''
        }
      ]
    },
    returns: {
      text: ''
    }
  }
]
