# Visible  

Handles link state based on item visibility.

## Constructor  

**<code>new Visible(): Visible</code>**  

Create new instance.

## Properties

### items  

Group of link elements identified by `data-visible-link`, with corresponding items, state and offsets, keyed by item id.  

**Type:** <code>Map&lt;string, <a href="#visibleitem">VisibleItem</a>&gt;</code>

### end  

Optional element identified by `end="{id}"` marks the end of the last item.  

**Type:** <code>HTMLElement | null</code>

### offset  

Optional top offset (eg. scroll margin), set by `offset="{number}"`.  

**Type:** <code>number</code>

### init  

Initialize success.  

**Type:** <code>boolean</code>

## Methods

### connectedCallback  

**<code>connectedCallback(): </code>**  

Init after added to DOM.

### disconnectedCallback  

**<code>disconnectedCallback(): </code>**  

Clean up after removed from DOM.

## Types

### VisibleItem  

**Type:** <code>object</code>

#### Properties  
- **`link`** <code>HTMLAnchorElement</code> required  
- **`item`** <code>HTMLElement</code> required  
- **`next`** <code>HTMLElement | null</code> required  
- **`top`** <code>number</code> required  
- **`bottom`** <code>number</code> required  
- **`visible`** <code>boolean</code> required