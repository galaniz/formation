# Modules

Utility functions.

#### `addClass( item, classes )`

Add class(es) to element.

_Parameters:_

* `item`  
_Type:_ `HTMLElement`  
_Required:_ true

* `classes`  
List separated by space  
_Type:_ `string`  
_Required:_ true

#### `hasClass( item, classes, all )`

Check if element contains class(es).

_Parameters:_

* `item`  
_Type:_ `HTMLElement`  
_Required:_ true

* `classes`  
List separated by space.   
_Type:_ `string`  
_Required:_ true

* `all`  
Check if contains all classes.   
_Type:_ `boolean`  
_Default:_ false

#### `removeClass( item, classes )`

Remove class(es) from element.

_Parameters:_

* `item`  
_Type:_ `HTMLElement`  
_Required:_ true

* `classes`  
List separated by space  
_Type:_ `string`  
_Required:_ true

#### `closest( item, className, max = 10 )`

Traverse up DOM until find element with class.

_Parameters:_

* `item`  
_Type:_ `HTMLElement`  
_Required:_ true

* `className`   
_Type:_ `string`  
_Required:_ true

_Return:_ `HTMLElement/boolean`

* `max`  
Maximum number of levels to go up DOM.   
_Type:_ `int`  
_Default:_ 10

_Return:_ `HTMLElement`

#### `prefix( type, item, val )`

Prefix transition or transform props on element.

_Parameters:_

* `type`  
Possible values: `'transition'` `'transform'` `'transformOrigin'`  
_Type:_ `string`  
_Required:_ true

* `item`  
_Type:_ `HTMLElement`  
_Required:_ true

* `val`   
_Type:_ `string`  
_Required:_ true

#### `show( item, show )`

Show/hide html element.

_Parameters:_

* `item`  
_Type:_ `HTMLElement`  
_Required:_ true

* `show`   
_Type:_ `boolean`  
_Default:_ `true`

#### `disableButtonLoader( button, loader, hide, disable )`

Disable button/show loader.

_Parameters:_

* `button`  
_Type:_ `HTMLElement`  
_Default:_ `null`   
_Required:_ true

* `loader`  
_Type:_ `HTMLElement`  
_Default:_ `null`   
_Required:_ true

* `hide`   
Adds or removes `[data-hide]` attribute from loader.  
_Type:_ `boolean`  
_Default:_ `true`

* `disable`  
Disable or enable button.  
_Type:_ `boolean`  
_Default:_ `false`

#### `objectFit( images, type )`

Object fit fallback for cover/contain.

_Parameters:_

* `images`  
_Type:_ `array` of `HTMLElement`   
_Required:_ true

* `type`   
Possible values: `'cover'` `'contain'`  
_Type:_ `string`  
_Default:_ `'cover'`

#### `imagesLoaded( images, done )`

Check if images are loaded.

_Parameters:_

* `images`  
_Type:_ `array` of `HTMLElement`   
_Required:_ true

* `done`   
_Type:_ `function`  
_Default:_ `'() => {}'`

#### `getScrollY()`

Get scroll y position in cross browser way.

_Return:_ `int`

#### `generateId()`

Generate unique string of numbers.

_Return:_ `string`

#### `mergeObjects( x, y )`

Merge objects one nested level deep.

_Parameters:_

* `x`  
_Type:_ `object`  
_Required:_ true

* `y`   
Overwrite x values.  
_Type:_ `object`  
_Required:_ true

_Return:_ `object` x

#### `recurseObject( obj, callback, condition )`

Loop through object recursively.

_Parameters:_

* `obj`  
_Type:_ `object`  
_Required:_ true

* `callback`   
If function, pass current property and value.  
_Type:_ `boolean|function`  

* `condition`   
Returns boolean.  
_Type:_ `function`  
_Default:_ `() => true`  

#### `setElements( meta, e, done )`

Fetch and set elements by selector.

_Parameters:_

* `meta`  
_Type:_ `array` of `objects`  
_Required:_ true  
_Example:_

```js
let meta = [
  {
  prop: 'link',
  selector: '.o-link',
  all: true, // querySelectorAll instead of querySelector
  array: true
  }
];
```

* `e`   
Prop and element is set here from meta.  
_Type:_ `object`  
_Required:_ true

* `done`  
Callback when done recursing through meta and setting e object.  
_Type:_ `function`  
_Default:_ `() => {}`  

#### `cascade( events, repeat )`

Call functions sequentially and with delay.

_Parameters:_

* `events`  
_Type:_ `array` of `objects`  
_Required:_ true  

* `repeat`  
_Type:_ `int`  
_Default:_ `0`  

_Example:_

```js
cascade( [
  {
  action: ( i, done ) => {
    doThis();

    let target = 10;

    cascade( [
    {
      action: ( j ) => {
      doThisOtherThing();

      if( j === target - 1 )
        done(); // optional
      },
      delay: 100,
      increment: 50
    }
    ], target );
  },
  delay: 300
  }
] );
```

#### `publish( name, args )`

Publish event by running callback stored in subscriptions by `name`. Import from pub-sub.js

_Parameters:_

* `name`  
_Type:_ `string`  
_Required:_ true  

* `args`  
Passed to callback stored in subscriptions.  
_Type:_ `array`  
_Default:_ `[]`

#### `subscribe( name, callback )`

Subscribe to event by storing `name` : `callback`. Import from pub-sub.js

_Parameters:_

* `name`  
_Type:_ `string`  
_Required:_ true  

* `callback`
Passed to callback in subscriptions.  
_Type:_ `function`  
_Default:_ `() => {}`

_Return:_ `object` with `remove` method

#### `urlEncode = ( o, _key, _list )`

Recursively convert object key value pairs into url encoded string.

_Parameters:_

* `o`  
_Type:_ `object`  
_Required:_ true  

* `_key` (for iteration)  
_Type:_ `string`

* `_list` (for iteration)  
_Type:_ `array`  
_Default:_ `[]`   

_Return:_ `string`

#### `request( args )`

Handle ajax requests.

_Parameters:_

* `args`  
_Type:_ `object`  
_Required:_ true  

```js
{
  method: 'POST', // or 'GET'
  url: 'http://someapi.com',
  headers: {
  'Content-type': 'application/json'
  },
  body: JSON.stringify( { // string or formData
  id: 928349,
  data: {
    x: 98984,
    y: 36748
  }
  } )
}
```
_Return:_ `promise` with response/error passed to it.
