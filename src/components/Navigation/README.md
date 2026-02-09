# Navigation  

Handles responsive navigation with modal support.

## Constructor  

**<code>new Navigation(): Navigation</code>**  

Create new instance.

## Properties

### slots  

Slot elements by name.  

**Type:** <code>Map&lt;string, HTMLElement&gt;</code>

### items  

Item elements.  

**Type:** <code>HTMLElement[]</code>

### modal  

Modal element.  

**Type:** <code>HTMLElement | null</code>

### modalSlots  

Slot elements in modal by name.  

**Type:** <code>Map&lt;string, HTMLElement&gt;</code>

### opens  

Button element opens modal.  

**Type:** <code>HTMLButtonElement | null</code>

### closes  

Element(s) close modal.  

**Type:** <code>HTMLElement[]</code>

### delay  

Milliseconds to delay show attribute.  

**Type:** <code>number</code>

### breakpoints  

Breakpoint(s) to prompt "overflowing" state.  

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