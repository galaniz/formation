# Tabs  

Handles display of tabs and corresponding panels.

## Constructor  

**<code>new Tabs(): Tabs</code>**  

Create new instance.

## Properties

### tabs  

Tab elements.  

**Type:** <code>HTMLElement[]</code>

### panels  

Panel elements.  

**Type:** <code>HTMLElement[]</code>

### delay  

Delay before displaying panel.  

**Type:** <code>number</code>

### direction  

Layout for keyboard navigation.  

**Type:** <code><a href="#tabsdirection">TabsDirection</a></code>

### init  

Initialize success.  

**Type:** <code>boolean</code>

### currentIndex  

Current tab index.  

**Type:** <code>number</code>

## Methods

### connectedCallback  

**<code>connectedCallback(): </code>**  

Init after added to DOM.

### disconnectedCallback  

**<code>disconnectedCallback(): </code>**  

Clean up after removed from DOM.

### activate  

**<code>activate(args: TabsActivateArgs): boolean</code>**  

Hide and show panels and tabs.

#### Parameters  
- **`args`** <code><a href="#tabsactivateargs">TabsActivateArgs</a></code> required

#### Returns  

<code>boolean</code>

## Types

### TabsDirection  

**Type:** <code>&#39;horizontal&#39; | &#39;vertical&#39;</code>

### TabsActivateArgs  

**Type:** <code>object</code>

#### Properties  
- **`current`** <code>number</code> required  
- **`raw`** <code>number</code> optional  
- **`source`** <code>string</code> optional  
Default: `''`