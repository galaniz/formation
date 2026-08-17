# Masonry  

Handles arranging items into masonry layout.

## Constructor  

**<code>new Masonry(): Masonry</code>**  

Create new instance.

## Properties

### items  

Elements to arrange.  

**Type:** <code>HTMLElement[]</code>

### breakpoints  

Number of columns and margins by breakpoint.  

**Type:** <code>Set&lt;Record&lt;string, number&gt;&gt;</code>

### loads  

Element that requests more items when scrolled into view.  

**Type:** <code>HTMLElement | null</code>

### loadsOffset  

Pixels beyond the viewport to request more items.  

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

**<code>appendItems(newItems: HTMLElement[]): boolean</code>**  

Add new items to layout and reset.

#### Parameters  
- **`newItems`** <code>HTMLElement[]</code> required

#### Returns  

<code>boolean</code>

### endItems  

**<code>endItems(): boolean</code>**  

Stop requesting more items.

#### Returns  

<code>boolean</code>