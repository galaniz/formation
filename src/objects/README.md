# Objects

## Collapsible

### `class Collapsible`

Collapse height of specified element by trigger elements.

_Parameters:_

* `args`  
_Type:_ `object`  
_Default:_ `{}`  
_Parameters:_

| Name | Type | Default | Description
|--|--|--|--|
| `collapsible` | `HTMLElement` | `null` | Required.
| `trigger` | `HTMLElement` | `null` | Required.

## Form

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

#### `getFormValues( urlEncoded, filter )`

_Parameters:_

* `urlEncoded`  
_Type:_ `boolean`  
_Default:_ `false`

* `filter`  
_Type:_ `boolean|function`  
_Default:_ `false`

```js
let filter = ( args, inputs ) => {
  inputs.forEach( ( input ) => {
    if( input.hasAttribute( 'data-something' ) )
      args['something'] = true;
  } );

  return args;
};
```

_Return:_ `object`

#### `clear( exclude )`  

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
| `data` | `object` | `{}` | Key => value pairs passed into body of request.
| `loader` | `HTMLElement` | `null` | Required.
| `shake` | `boolean` | `false` | [`class Form`]()
| `siteKey` | `string` | `''` | Required. Google reCAPTCHA site key.
| `url` | `string` | `''` | Required. Url to make request.
| `success` | `function` | `() => {}` | Callback when sucessfully submitted.
| `error` | `function` | `() => {}` | Callback when error submitting form.
| `result` | `object` | <code>{<br>container: null,<br>textContainer: null,<br>text: {<br>&nbsp;&nbsp;error: 'Oops! Looks like something went wrong. Please try again later.',<br>&nbsp;&nbsp;success: 'Successfully submitted!'<br>&nbsp;}<br>}</code> |

_Methods:_

#### [`clear( exclude )`]()
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
| `data` | `object` | `{}` | Key => value pairs passed into body of request.
| `filters` | `array` of `objects` | `[]` | {<br>&nbsp;item: HTMLElement,<br>&nbsp;type: 'select', 'radio' or 'checkbox'<br>}
| `filtersLoader` | `HTMLElement` | `null` |
| `insertInto` | `HTMLElement` | `null` | Required.
| `insertLocation` | `string` | `'beforeend'` |
| `onInsert` | `function` | `() => {}` |
| `afterInsert` | `function` | `() => {}` |
| `decrement` | `boolean` | `false` | If true, decrease offset instead of increase.
| `noResults` | `object` | <code>{<br>&nbsp;containers: [],<br>&nbsp;buttons: []<br>}</code> |

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

### `class FadeSlider`

### `class Slider`
