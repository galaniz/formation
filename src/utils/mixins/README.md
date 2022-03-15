# Mixins

#### `@mixin breakpoint-min($min)`

Min width media query.

_Parameters:_

* `$min`  
_Type:_ `string|number`  
_Required:_ true   
_Note:_ Must exist in [`$g-breakpoints`]()

#### `@mixin breakpoint-max($max)`

Max width media query.

_Parameters:_

* `$max`  
_Type:_ `string|number`  
_Required:_ true   
_Note:_ Must exist in [`$g-breakpoints`]()

#### `@mixin breakpoint-min-max($min, $max)`

Min width/max width media query.

_Parameters:_

* `$min`  
_Type:_ `string|number`  
_Required:_ true  
_Note:_ Must exist in [`$g-breakpoints`]()

* `$max`  
_Type:_ `string|number`  
_Required:_ true  
_Note:_ Must exist in [`$g-breakpoints`]()

#### `@mixin font-rem($size)`

Font size in px to rem units.

_Parameters:_

* `$size`  
_Type:_ `number`px  
_Required:_ true  

#### `@mixin linear-gradient($direction, $image, $colorStops...)`

Output gradient.

_Parameters:_

* `$direction`  
Possible [values](https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient#Values)

* `$image`  
If true, background-image instead of background.  
_Type:_ `boolean`  
_Default:_ `false`

* `$colorStops`   
_Type:_ `list`  

#### `@mixin page-loader-fallback($selectors)`

Output fallback for page loader.

_Parameters:_

* `$image`  
_Type:_ `string`  
_Default:_ `'#js-page-loader, #js-page-transition'`  
_Required:_ true
