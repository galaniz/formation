# Functions

#### `@function calcRem( $px )`

Convert px to rem value.

_Parameters:_

* `$px`  
_Type:_ `number`px  
_Required:_ true  

_Returns:_ `number`rem

#### `@function calcEm( $px )`

Convert px to em value.

_Parameters:_

* `$px`  
_Type:_ `number`px  
_Required:_ true  

_Returns:_ `number`em

#### `@function capitalize( $str )`

Capitalize string.

_Parameters:_

* `$str`  
_Type:_ `string`  
_Required:_ true  

_Returns:_ `string`

#### `@function mapDeepGet( $map, $keys... )`

Get nested map.

_Parameters:_

* `$map`  
_Type:_ `map`  
_Required:_ true  

* `$keys`  
_Type:_ `list`  
_Required:_ true  

_Returns:_ `map`

#### `@function mapRecursiveMerge( $parentMap, $childMap )`

Recursively set nested map.

_Parameters:_

* `$parentMap`  
_Type:_ `map`  
_Required:_ true  

* `$childMap`  
_Type:_ `map`  
_Required:_ true  

_Returns:_ `map`
