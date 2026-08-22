# Overflow  

Handles state and direction of overflow.

## Constructor  

**<code>new Overflow(): Overflow</code>**  

Create new instance.

## Properties

### track  

Scrollable element identified by `data-overflow-track`.  

**Type:** <code>HTMLElement | null</code>

### direction  

Optional scroll direction, set by `direction="{OverflowDirection}"`.  

**Type:** <code><a href="#overflowdirection">OverflowDirection</a></code>

### overflow  

Overflow state.  

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

## Types

### OverflowDirection  

**Type:** <code>&#39;horizontal&#39; | &#39;vertical&#39;</code>