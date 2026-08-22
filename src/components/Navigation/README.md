# Navigation  

Handles responsive navigation with modal support.

## Constructor  

**<code>new Navigation(): Navigation</code>**  

Create new instance.

## Properties

### slots  

Group of slot elements identified by `data-nav-slot` | `data-nav-slot="{name}"`, keyed by name.  

**Type:** <code>Map&lt;string, HTMLElement&gt;</code>

### items  

Item elements identified by `data-nav-item` | `data-nav-item="{slot name}"`.  

**Type:** <code>HTMLElement[]</code>

### modal  

Modal element identified by `data-nav-modal`.  

**Type:** <code>HTMLElement | null</code>

### modalSlots  

Group of slot elements in modal identified by `data-nav-modal-slot` | `data-nav-modal-slot="{name}"`, keyed by name.  

**Type:** <code>Map&lt;string, HTMLElement&gt;</code>

### opens  

Button element identified by `data-nav-open` that opens modal.  

**Type:** <code>HTMLButtonElement | null</code>

### closes  

Element(s) identified by `data-nav-close` that close modal.  

**Type:** <code>HTMLElement[]</code>

### delay  

Optional milliseconds to delay show attribute, set by `delay="{number}"`.  

**Type:** <code>number</code>

### breakpoints  

Optional breakpoint(s) to prompt "overflowing" state, set by `breakpoints="{number},{number}"`,
keyed by slot name.  

**Type:** <code>Map&lt;string, number&gt;</code>

### init  

Initialize state.  

**Type:** <code>boolean</code>

### open  

Open state.  

**Type:** <code>boolean</code>

### overflow  

Overflow state.  

**Type:** <code>boolean</code>

## Methods

### connectedCallback  

**<code>connectedCallback(): </code>**  

Init after added to DOM.

### disconnectedCallback  

**<code>disconnectedCallback(): </code>**  

Clean up after removed from DOM.