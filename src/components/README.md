# Components

## Nav

### `class Nav`

Handles opening and closing navigation and when overflowing.

_Parameters:_

* `args`  
_Type:_ `object`  
_Default:_ `{}`  
_Parameters:_

| Name | Type | Default | Description
|--|--|--|--|
| `nav` | `HTMLElement` | `null` | Required.
| `list` | `HTMLElement` | `null` | Required.
| `overflow` | `HTMLElement` | `null` | Required.
| `overflowList` | `HTMLElement` | `null` | Required.
| `items` | `HTMLCollection` | `null` | Required.
| `itemSelector` | `string` | `''` | Required.
| `links` | `HTMLCollection` | `null` | Required.
| `button` | `HTMLElement` | `null` | Required.
| `overlay` | `HTMLElement` | `null` |
| `transition` | `HTMLElement` | `null` |
| `onSet` | `function` | `() => {}` |
| `onReset` | `function` | `() => {}` |
| `afterReset` | `function` | `() => {}` |
| `onResize` | `function` | `() => {}` |
| `onToggle` | `function` | `() => {}` |
| `endToggle` | `function` | `() => {}` |
| `done` | `function` | `() => {}` |
| `delay` | `object` | <pre lang="js">{<br>&nbsp;open: 200,<br>&nbsp;close: 200<br>}</pre> |
| `isOverflowing` | `boolean` | `false` |

## Skip Link

### `skipLink( link )`

Add/remove `--show` class from link on focus/blur.

_Parameters:_

* `link`  
_Type:_ `HTMLElement`  
_Required:_ true 
