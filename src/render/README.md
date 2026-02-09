# Render

## renderElement  

**<code>renderElement(args: RenderElementArgs): HTMLElement | null</code>**  

Output single HTML element with specified attributes and properties.

### Parameters  
- **`args`** <code><a href="#renderelementargs">RenderElementArgs</a></code> required

### Returns  

<code>HTMLElement | null</code>

## render  

**<code>render(functions: RenderFunctions, items: RenderItems | RenderItems[]): HTMLElement | null</code>**  

Recursively output HTML element(s) from array or object of data.

### Parameters  
- **`functions`** <code><a href="#renderfunctions">RenderFunctions</a></code> required  
- **`items`** <code><a href="#renderitems">RenderItems</a> | <a href="#renderitems">RenderItems</a>[]</code> required

### Returns  

<code>HTMLElement | null</code>

## renderString  

**<code>renderString(functions: RenderStringFunctions, items: RenderItems | RenderItems[]): string</code>**  

Recursively output html string from array or object of data.

### Parameters  
- **`functions`** <code><a href="#renderstringfunctions">RenderStringFunctions</a></code> required  
- **`items`** <code><a href="#renderitems">RenderItems</a> | <a href="#renderitems">RenderItems</a>[]</code> required

### Returns  

<code>string</code>

## Types

### RenderElementArgs  

**Type:** <code>object</code>

#### Properties  
- **`tag`** <code>string</code> required  
- **`attrs`** <code><a href="/src/global/README.md#genericstrings">GenericStrings</a></code> optional  
- **`props`** <code>HTMLElement</code> optional

### RenderItems  

**Type:** <code>object</code>  

**Augments:** <code><a href="/src/global/README.md#generic">Generic</a></code>

#### Properties  
- **`renderType`** <code>string</code> required  
- **`content`** <code>string | <a href="#renderitems">RenderItems</a>[]</code> optional

### RenderParents  

**Type:** <code>object</code>

#### Properties  
- **`args`** <code><a href="#renderitems">RenderItems</a></code> required

### RenderFunctionArgs  

**Type:** <code>object</code>

#### Properties  
- **`args`** <code><a href="#renderitems">RenderItems</a></code> required  
- **`children`** <code><a href="#renderitems">RenderItems</a>[]</code> required  
- **`parents`** <code><a href="#renderparents">RenderParents</a>[]</code> required

### RenderFunction  

**Type:** <code>function</code>

#### Parameters  
- **`args`** <code><a href="#renderfunctionargs">RenderFunctionArgs</a></code> required

#### Returns  

<code><a href="#renderelementargs">RenderElementArgs</a></code>

### RenderFunctions  

**Type:** <code>Object&lt;string, <a href="#renderfunction">RenderFunction</a>&gt;</code>

### RenderStringFunction  

**Type:** <code>function</code>

#### Parameters  
- **`args`** <code><a href="#renderfunctionargs">RenderFunctionArgs</a></code> required

#### Returns  

<code>string | string[]</code>

### RenderStringFunctions  

**Type:** <code>Object&lt;string, <a href="#renderstringfunction">RenderStringFunction</a>&gt;</code>