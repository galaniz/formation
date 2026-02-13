# Actions

## actions  

Action callbacks by name.  

**Type:** <code>Map&lt;string, Set&lt;<a href="/src/global/README.md#genericfunction">GenericFunction</a>&gt;&gt;</code>

## addAction  

**<code>addAction(name: string, action: GenericFunction): boolean</code>**  

Add function to actions map.

### Parameters  
- **`name`** <code>string</code> required  
- **`action`** <code><a href="/src/global/README.md#genericfunction">GenericFunction</a></code> required

### Returns  

<code>boolean</code>

## removeAction  

**<code>removeAction(name: string, action: GenericFunction): boolean</code>**  

Remove action from actions map.

### Parameters  
- **`name`** <code>string</code> required  
- **`action`** <code><a href="/src/global/README.md#genericfunction">GenericFunction</a></code> required

### Returns  

<code>boolean</code>

## doActions  

**<code>doActions(name: string, args?: &ast;): void</code>**  

Run callback functions from actions map.

### Parameters  
- **`name`** <code>string</code> required  
- **`args`** <code>&ast;</code> optional

### Returns  

<code>void</code>

## onScroll  

**<code>onScroll(action: GenericFunction): void</code>**  

Run actions on scroll event.

### Parameters  
- **`action`** <code><a href="/src/global/README.md#genericfunction">GenericFunction</a></code> required

### Returns  

<code>void</code>

## removeScroll  

**<code>removeScroll(action: GenericFunction): boolean</code>**  

Remove action from scroll set.

### Parameters  
- **`action`** <code><a href="/src/global/README.md#genericfunction">GenericFunction</a></code> required

### Returns  

<code>boolean</code>

## onResize  

**<code>onResize(action: ActionResize): number</code>**  

Run actions on resize event.

### Parameters  
- **`action`** <code><a href="#actionresize">ActionResize</a></code> required

### Returns  

<code>number</code>

## removeResize  

**<code>removeResize(action: ActionResize): boolean</code>**  

Remove action from resize set.

### Parameters  
- **`action`** <code><a href="#actionresize">ActionResize</a></code> required

### Returns  

<code>boolean</code>

## onEscape  

**<code>onEscape(action: GenericFunction): void</code>**  

Run actions on escape event.

### Parameters  
- **`action`** <code><a href="/src/global/README.md#genericfunction">GenericFunction</a></code> required

### Returns  

<code>void</code>

## removeEscape  

**<code>removeEscape(action: GenericFunction): boolean</code>**  

Remove action from escape set.

### Parameters  
- **`action`** <code><a href="/src/global/README.md#genericfunction">GenericFunction</a></code> required

### Returns  

<code>boolean</code>

## Types

### ActionResizeArgs  

Old and new viewport widths.  

**Type:** <code>number[]</code>

### ActionResize  

**Type:** <code>function</code>

#### Parameters  
- **`args`** <code><a href="#actionresizeargs">ActionResizeArgs</a></code> required

#### Returns  

<code>void</code>