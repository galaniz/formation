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

#### `disableButtonLoader( button, loader, className, add, disable )`

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

* `className`  
_Type:_ `string`  
_Default:_ `''`   
_Required:_ true

* `add`   
If true, [`addClass`](#) otherwise [`removeClass`](#)    
_Type:_ `boolean`  
_Default:_ `true`

* `disable`  
Disabled attribute value.    
_Type:_ `boolean`  
_Default:_ `false`
