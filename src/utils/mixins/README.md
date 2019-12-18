# Mixins

#### `@mixin breakpointMin( $min )`

Min width media query.

_Parameters:_

* `$min`  
_Type:_ `string|number`  
_Required:_ true   
_Note:_ Must exist in [`$g-breakpoints`]()

#### `@mixin breakpointMax( $max )`

Max width media query.

_Parameters:_

* `$max`  
_Type:_ `string|number`  
_Required:_ true   
_Note:_ Must exist in [`$g-breakpoints`]()

#### `@mixin breakpointMinMax( $min, $max )`

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

#### `@mixin fontRem( $size, $important: false )`

Font size in px to rem units.

_Parameters:_

* `$size`  
_Type:_ `number`px  
_Required:_ true  

* `$important`  
Add !important to property.
_Type:_ `boolean`  

#### `@mixin linearGradient( $direction, $image, $colorStops... )`

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

#### `@mixin pageLoaderFallback( $selectors )`

Output fallback for page loader.

_Parameters:_

* `$image`  
_Type:_ `string`  
_Default:_ `'#js-page-loader, #js-page-transition'`  
_Required:_ true
