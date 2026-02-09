# Collapsible  

Handles expansion and collapse of element.

## Constructor  

**<code>new Collapsible(): Collapsible</code>**  

Create new instance.

## Properties

### panel  

Element expands and collapses.  

**Type:** <code>HTMLElement | null</code>

### toggle  

Button element initiates open and close.  

**Type:** <code>HTMLButtonElement | null</code>

### expanded  

Open state.  

**Type:** <code>boolean</code>

### hoverable  

Respond to hover events.  

**Type:** <code>boolean</code>

### accordion  

Accordion group action name.  

**Type:** <code>string</code>

### action  

Custom action name.  

**Type:** <code>string</code>

### duration  

Transition duration on open or close.  

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