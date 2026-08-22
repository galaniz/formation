# Modal  

Handles display of modal.

## Constructor  

**<code>new Modal(): Modal</code>**  

Create new instance.

## Properties

### opens  

Button element(s) identified by ids in `opens="{id},{id}"` that open modal.  

**Type:** <code>HTMLButtonElement[]</code>

### closes  

Element(s) identified by `data-modal-close` that close modal.  

**Type:** <code>HTMLElement[]</code>

### init  

Initialize success.  

**Type:** <code>boolean</code>

### open  

Open state.  

**Type:** <code>boolean</code>

## Methods

### connectedCallback  

**<code>connectedCallback(): </code>**  

Init after added to DOM.

### disconnectedCallback  

**<code>disconnectedCallback(): </code>**  

Clean up after removed from DOM.