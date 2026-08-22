# Masonry  

Handles arranging items into masonry layout.

## Constructor  

**<code>new Masonry(): Masonry</code>**  

Create new instance.

## Properties

### list  

Element identified by `data-masonry-list` that contains the items to arrange.  

**Type:** <code>HTMLElement | null</code>

### items  

Elements to arrange identified by `data-masonry-item`.  

**Type:** <code>HTMLElement[]</code>

### breakpoints  

Number of columns and gaps by breakpoint, set by `breakpoints="{number},{number}"`,
`columns="{number},{number}"` and `gaps="{number},{number}"`.  

**Type:** <code>Set&lt;Record&lt;string, number&gt;&gt;</code>

### loads  

Optional element identified by `data-masonry-loads` that requests more items when scrolled into view.  

**Type:** <code>HTMLElement | null</code>

### loadsOffset  

Optional pixels beyond the viewport to request more items, set by `loads-offset="{number}"`.  

**Type:** <code>number</code>

### loading  

More items requested and not yet appended.  

**Type:** <code>boolean</code>

### done  

No more items to request.  

**Type:** <code>boolean</code>

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

### appendItems  

**<code>appendItems(newItems: DocumentFragment | string): boolean</code>**  

Append new items to list and add to layout.

#### Parameters  
- **`newItems`** <code>DocumentFragment | string</code> required

#### Returns  

<code>boolean</code>

### endItems  

**<code>endItems(): boolean</code>**  

Stop requesting more items.

#### Returns  

<code>boolean</code>