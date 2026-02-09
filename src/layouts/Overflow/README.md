# Overflow  

Handles state and direction of overflow.

## Constructor  

**<code>new Overflow(): Overflow</code>**  

Create new instance.

## Properties

### track  

Scrollable element.  

**Type:** <code>HTMLElement | null</code>

### direction  

Scroll direction.  

**Type:** <code>&#39;vertical&#39; | &#39;horizontal&#39;</code>

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