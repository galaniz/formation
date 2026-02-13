# Visible  

Handles link state based on item visibility.

## Constructor  

**<code>new Visible(): Visible</code>**  

Create new instance.

## Properties

### items  

Links, corresponding items, state and offsets.  

**Type:** <code>Map&lt;string, <a href="#visibleitem">VisibleItem</a>&gt;</code>

### offset  

Top offset (eg. scroll margin).  

**Type:** <code>number</code>

### end  

ID of end element.  

**Type:** <code>string</code>

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