# Objects

## Collapsible

### `class Collapsible`

Collapse height of specified element by trigger elements. For nested and accordian functionality to work need to pass `array` of collapsible instances in `args`.

_Parameters:_

* `args`  
_Type:_ `object`  
_Default:_ `{}`  
_Parameters:_

| Name | Type | Default | Description
|--|--|--|--|
| `container` | `HTMLElement` | `null` |
| `collapsible` | `HTMLElement` | `null` | Required.
| `trigger` | `HTMLElement` | `null` | Required.
| `nestedInstances` | `array` | `[]` |
| `accordianInstances` | `array` | `[]` |
| `transitionDuration` | `int` | `300` |
| `resize` | `boolean` | `true` | Reset height on resize.

## Form

### `focusRing(className, selector)`

Add custom class to focusable elements on keyboard focus.

_Parameters:_

* `className`  
_Type:_ `string`  
_Required:_ true

* `selector`  
_Type:_ `string`  
_Default:_ `'a, button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'`  
_Required:_ true 

### `class FloatLabel`

Float labels above input when input focused/contains value.

_Parameters:_

* `args`  
_Type:_ `object`  
_Default:_ `{}`  
_Parameters:_

| Name | Type | Default | Description
|--|--|--|--|
| `input` | `HTMLElement` | `null` | Required.
| `label` | `HTMLElement` | `null` | Required.

### `class Form`

Validate and get values from form inputs.

_Parameters:_

* `args`  
_Type:_ `object`  
_Default:_ `{}`  
_Parameters:_

| Name | Type | Default | Description
|--|--|--|--|
| `inputs` | `HTMLCollection` | `null` | Required.
| `fieldClass` | `string` | `''` | Required.
| `groupClass` | `string` | `''` |
| `labelClass` | `string` | `''` |
| `submitted` | `boolean` | `false` | If true, form submitted.
| `errorShake` | `boolean` | `false` | If true, shake input on error.
| `errorClass` | `string` | `''` |
| `errorShakeClass` | `string` | `'a-shake'` |

_Methods:_

#### `validate()`  

_Return:_ `boolean`

#### `getFormValues(urlEncoded, filter)`

_Parameters:_

* `urlEncoded`  
_Type:_ `boolean`  
_Default:_ `false`

* `filter`  
_Type:_ `boolean|function`  
_Default:_ `false`  
_Example:_

```js
let filter = (args, inputs) => {
  inputs.forEach((input) => {
  if(input.hasAttribute('data-something'))
    args['something'] = true;
  });

  return args;
};
```

_Return:_ `object`

#### `clear(exclude)`  

Clear value of input.

_Parameters:_

* `exclude`  
List of input names to exclude from being cleared.  
_Type:_ `array`  
_Default:_ `[]`

### `class SendForm`

Handle validating and sending forms.

_Parameters:_

* `args`  
_Type:_ `object`  
_Default:_ `{}`  
_Parameters:_

| Name | Type | Default | Description
|--|--|--|--|
| `id` | `string` | `''` | Required.
| `form` | `HTMLElement` | `null` | Required. [`class Form`]()
| `groupClass` | `string` | `''` | Required. [`class Form`]()
| `fieldClass` | `string` | `''` | Required. [`class Form`]()
| `labelClass` | `string` | `''` | Required. [`class Form`]()
| `errorClass` | `string` | `''` | [`class Form`]()
| `submit` | `HTMLElement` | `null` | Required.
| `inputs` | `HTMLCollection` | `null` | Required. Inputs to get data from.
| `filterInputs` | `boolean/function` | `false` | If function, used  as [`filter`]()
| `data` | `object` | `{}` | Key : value pairs passed into body of request.
| `loader` | `HTMLElement` | `null` | Required.
| `shake` | `boolean` | `false` | [`class Form`]()
| `siteKey` | `string` | `''` | Required. Google reCAPTCHA site key.
| `url` | `string` | `''` | Required. Url to make request.
| `success` | `function` | `() => {}` | Callback when sucessfully submitted.
| `error` | `function` | `() => {}` | Callback when error submitting form.
| `result` | `object` | <pre lang="js">{<br>container: null,<br>textContainer: null,<br>text: {<br>&nbsp;&nbsp;error: 'Oops! Looks like something went wrong. Please try again later.',<br>&nbsp;&nbsp;success: 'Successfully submitted!'<br>&nbsp;}<br>}</pre> |

_Methods:_

#### [`clear(exclude)`]()
Clear inputs and hide loader and result.

## Load

### `class LoadMore`

Request and output more content.

_Parameters:_

* `args`  
_Type:_ `object`  
_Default:_ `{}`  
_Parameters:_

| Name | Type | Default | Description
|--|--|--|--|
| `url` | `string` | `''` | Required. Url to make request.
| `button` | `HTMLElement` | `null` | Required.
| `buttonContainer` | `HTMLElement` | `null` |
| `loader` | `HTMLElement` | `null` | Required.
| `type` | `string` | `''` | Required.
| `offset` | `int` | `0` | Required.
| `ajaxPpp` | `int` | `0` | How many posts/items to load. Uses offset if 0.
| `total` | `int` | `0` | Required. Total number of posts/items.
| `data` | `object` | `{}` | Key : value pairs passed into body of request.
| `filters` | `array` of `objects` | `[]` | <pre lang="js">{<br>&nbsp;item: HTMLElement,<br>&nbsp;type: 'select', 'radio' or 'checkbox'<br>}</pre>
| `filtersLoader` | `HTMLElement` | `null` |
| `insertInto` | `HTMLElement` | `null` | Required.
| `insertLocation` | `string` | `'beforeend'` |
| `onInsert` | `function` | `() => {}` |
| `afterInsert` | `function` | `() => {}` |
| `decrement` | `boolean` | `false` | If true, decrease offset instead of increase.
| `noResults` | `object` | <pre lang="js">{<br>&nbsp;containers: [],<br>&nbsp;buttons: []<br>}</pre> |

## Modal

### `class Modal`

Open/close modals.

_Parameters:_

* `args`  
_Type:_ `object`  
_Default:_ `{}`  
_Parameters:_

| Name | Type | Default | Description
|--|--|--|--|
| `modal` | `HTMLElement` | `null` | Required.
| `trigger` | `HTMLElement` | `null` | Required.
| `window` | `HTMLElement` | `null` | Required.
| `overlay` | `HTMLElement` | `null` | Required.
| `close` | `HTMLElement` | `null` | Required.
| `scaleTransition` | `boolean` | `false` | If true, scale trigger to and from size of modal on open/close.
| `scaleTransitionDelay` | `int` | `300` |
| `startOpen` | `boolean` | `false` |
| `onClose` | `function` | `() => {}` |

## Slider

### `class BaseSlider`

Base slider (to create fade/carousel sliders).

_Parameters:_

* `args`  
_Type:_ `object`  
_Default:_ `{}`  
_Parameters:_

| Name | Type | Default | Description
|--|--|--|--|
| `slider` | `HTMLElement` | `null` | Required.
| `items` | `HTMLCollection` | `null` | Required.
| `loop` | `boolean` | `false` |
| `autoplay` | `boolean` | `false` |
| `autoplaySpeed` | `int` | `8000` | In milliseconds.
| `prev` | `HTMLElement` | `null` |
| `next` | `HTMLElement` | `null` |
| `nav` | `HTMLElement` | `null` |
| `navItemClass` | `string` | `''` |
| `currentIndex` | `int` | `0` |

_Methods:_

#### `goTo(index)`

Go to slide.

_Parameters:_

* `index`  
_Type:_ `int`  
_Required:_ true

### `class FadeSlider`

Slider that fades in and out. Extends [`class BaseSlider`]()

* `args`  
_Type:_ `object`  
_Default:_ `{}`  
_Parameters:_

| Name | Type | Default | Description
|--|--|--|--|
| `transitionDuration` | `int` | `500` |
| `overlayItems` | `boolean` | `false` | Overlay items on top of each other.
| `showLast` | `boolean` | `false` | Fade without flash of background.

### `class Slider`

Carousel slider. Extends [`class BaseSlider`]()

* `args`  
_Type:_ `object`  
_Default:_ `{}`  
_Parameters:_

| Name | Type | Default | Description
|--|--|--|--|
| `easing` | `string` | `'ease'` |
| `duration` | `int` | `500` |
| `padding` | `object` | `{}` | Expects breakpoint `int` : padding `int`
| `center` | `boolean` | `false` |
| `linkClick` | `function` | `() => {}` |
| `endMove` | `function` | `() => {}` |
| `onResize` | `function` | `() => {}` |
