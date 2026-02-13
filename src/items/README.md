# Items

## focusSelector  

Selector string to get focusable items.  

**Type:** <code>string</code>

## getOuterItems  

**<code>getOuterItems(item: HTMLElement, type?: ItemsOuterType, filter?: ItemsOuterFilter): Element[]</code>**  

Recursively get elements outside of specified element.

### Parameters  
- **`item`** <code>HTMLElement</code> required  
- **`type`** <code><a href="#itemsoutertype">ItemsOuterType</a></code> optional  
- **`filter`** <code><a href="#itemsouterfilter">ItemsOuterFilter</a></code> optional

### Returns  

<code>Element[]</code>

## toggleFocusability  

**<code>toggleFocusability(on: boolean, items: Element[]): boolean | undefined</code>**  

Manage focusability of specified elements.

### Parameters  
- **`on`** <code>boolean</code> required  
- **`items`** <code>Element[]</code> required

### Returns  

<code>boolean | undefined</code>

## isItemFocusable  

**<code>isItemFocusable(item: Element): boolean</code>**  

Check if element is focusable.

### Parameters  
- **`item`** <code>Element</code> required

### Returns  

<code>boolean</code>

## getInnerFocusableItems  

**<code>getInnerFocusableItems(item: Element): Element[]</code>**  

All focusable elements inside item.

### Parameters  
- **`item`** <code>Element</code> required

### Returns  

<code>Element[]</code>

## getOuterFocusableItems  

**<code>getOuterFocusableItems(item: Element | null): Element[]</code>**  

All focusable elements outside item.

### Parameters  
- **`item`** <code>Element | null</code> required

### Returns  

<code>Element[]</code>

## getItem  

**<code>getItem(item: string | string[], context?: Document | Element): Item</code>**  

Map selector to DOM element(s).

### Parameters  
- **`item`** <code>string | string[]</code> required  
- **`context`** <code>Document | Element</code> optional  
Default: `document`

### Returns  

<code><a href="#item">Item</a></code>

## getItems  

**<code>getItems(items: ItemsStr | ItemsStr[] | string[], context?: Document | Element): Items</code>**  

Map selectors to DOM elements recursively.

### Parameters  
- **`items`** <code><a href="#itemsstr">ItemsStr</a> | <a href="#itemsstr">ItemsStr</a>[] | string[]</code> required  
- **`context`** <code>Document | Element</code> optional  
Default: `document`

### Returns  

<code><a href="#items">Items</a></code>

## getTemplateItem  

**<code>getTemplateItem(id: string): HTMLElement | null | undefined</code>**  

First element from content template.

### Parameters  
- **`id`** <code>string</code> required

### Returns  

<code>HTMLElement | null | undefined</code>

## cloneItem  

**<code>cloneItem(item: HTMLElement | null | undefined): HTMLElement | null | undefined</code>**  

Clone element and check type.

### Parameters  
- **`item`** <code>HTMLElement | null | undefined</code> required

### Returns  

<code>HTMLElement | null | undefined</code>

## Types

### ItemsOuterType  

**Type:** <code>&#39;all&#39; | &#39;prev&#39; | &#39;next&#39;</code>

### ItemsOuterFilterReturn  

**Type:** <code>object</code>

#### Properties  
- **`store`** <code>Element[]</code> required  
- **`stop`** <code>boolean</code> required

### ItemsOuterFilter  

**Type:** <code>function</code>

#### Parameters  
- **`store`** <code>Element[]</code> required

#### Returns  

<code><a href="#itemsouterfilterreturn">ItemsOuterFilterReturn</a></code>

### Item  

**Type:** <code>Element | null | Element[]</code>

### ItemsStr  

**Type:** <code>Object&lt;string, string&gt;</code>

### ItemsRes  

**Type:** <code>Object&lt;(string|number|symbol), (ItemElem|<a href="#itemsres">ItemsRes</a>)&gt;</code>

### Items  

**Type:** <code><a href="#itemsres">ItemsRes</a> | <a href="#itemsres">ItemsRes</a>[]</code>