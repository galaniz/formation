# Collapsible  

Handles expansion and collapse of element.

## Constructor  

**<code>new Collapsible(): Collapsible</code>**  

Create new instance.

## Properties

### panel  

Element identified by `data-collapsible-panel` that expands and collapses.  

**Type:** <code>HTMLElement | null</code>

### toggle  

Button element identified by `data-collapsible-toggle`, initiates open and close.  

**Type:** <code>HTMLButtonElement | null</code>

### expanded  

Open state, optionally set on init by `expanded="true"`.  

**Type:** <code>boolean</code>

### hoverable  

Optionally respond to hover events, set by the `hoverable` attribute.  

**Type:** <code>boolean</code>

### accordion  

Optional accordion group action name, set by `accordion="{name}"`.  

**Type:** <code>string</code>

### action  

Optional custom action name, set by `action="{name}"`.  

**Type:** <code>string</code>

### duration  

Optional transition duration on open or close, set by `duration="{number}"`.  

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