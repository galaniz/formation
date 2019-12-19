# Animate

## Visible

### `class Visible`

Monitor when item is visible in viewport with options to parallax item or make it sticky.

_Parameters:_

* `args`  
_Type:_ `object`  
_Default:_ `{}`  
_Parameters:_

| Name | Type | Default | Description
|--|--|--|--|
| `item` | `HTMLElement` | `null` | Required.
| `visibleItem` | `HTMLElement` | `null` |
| `visibleTop` | `boolean` | `false` |
| `visibleOffset` | `int` | `0` |
| `classes` | `array` | `['--vis']` | Classes to add to item when visible.
| `delay` | `int` | `0` | Delay setting classes/parallax if specified.
| `wait` | `string` | `''` | Name of event to subscribe to before initializing scroll handler.
| `sticky` | `boolean` | `false` |
| `stickyOffset` | `int` | `0` |
| `stickyDelay` | `int` | `0` | Milliseconds to delay removing `'--sticky'` class.
| `allowUnset` | `boolean` | `false` |
| `visAll` | `boolean` | `false` | If true, add `'--vis-all'` to classes when visible.
| `onVisible` | `function` | `() => {}` |
| `endVisible` | `function` | `() => {}` |
| `onInit` | `function` | `() => {}` |
| `parallax` | `object` | <pre lang="js">{<br>&nbsp;rate: 0.2,<br>&nbsp;x: 0,<br>&nbsp;y: 0,<br>&nbsp;z: 0<br>}</pre> |
| `breakpoints` | `object` | <pre lang="js">{<br>&nbsp;min: 0,<br>&nbsp;max: 99999<br>}</pre> |

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>`parallax`</td>
      <td>`object`</td>
      <td>
      ```js
      {
        rate: 0.2,
        x: 0,
        y: 0,
        z: 0
      }
      ```
      </td>
      <td></td>
    </tr>
  </tbody>
</table>

## Transition

### `transition( links, transitionElement, delay )`

Complete page transition on link click by adding class `--show` to transitionElement.

_Parameters:_

* `links`  
_Type:_ `array` of `HTMLElement`  
_Required:_ true

* `transitionElement`  
_Type:_ `HTMLElement`  
_Required:_ true

* `delay`  
_Type:_ `int`  
_Default:_ `800`

### `setTransitionRun( run )`

Set run variable of module. If false, page transition won't run.

_Parameters:_

* `run`  
_Type:_ `boolean`  
_Required:_ true
