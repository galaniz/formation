# Media  

Handles loading and playing media.

## Constructor  

**<code>new Media(): Media</code>**  

Create new instance.

## Properties

### media  

Media element.  

**Type:** <code>HTMLMediaElement | null</code>

### progress  

Progress bar element.  

**Type:** <code>HTMLElement | null</code>

### time  

Time element.  

**Type:** <code>HTMLElement | null</code>

### controls  

Play/pause button elements.  

**Type:** <code>HTMLButtonElement[]</code>

### url  

URL of current file.  

**Type:** <code>string</code>

### playing  

Play state.  

**Type:** <code>boolean</code>

### dragging  

Progress drag state.  

**Type:** <code>boolean</code>

### loaded  

Asset loaded state.  

**Type:** <code>boolean</code>

### active  

Active state.  

**Type:** <code>boolean</code>

### init  

Initialize success.  

**Type:** <code>boolean</code>

### global  

Player is global.  

**Type:** <code>boolean</code>

### templates  

Loader and error fragments.  

**Type:** <code><a href="#mediatemplates">MediaTemplates</a></code>

### clones  

Clones of templates.  

**Type:** <code><a href="#mediatemplates">MediaTemplates</a></code>

## Methods

### connectedCallback  

**<code>connectedCallback(): </code>**  

Init after added to DOM.

### disconnectedCallback  

**<code>disconnectedCallback(): </code>**  

Clean up after removed from DOM.

### load  

**<code>load(): void</code>**  

Load media asset, clear loader and error.

#### Returns  

<code>void</code>

### toggle  

**<code>toggle(play?: boolean): Promise&lt;void&gt;</code>**  

Play and pause media element.

#### Parameters  
- **`play`** <code>boolean</code> optional  
Default: `true`

#### Returns  

<code>Promise&lt;void&gt;</code>

## Types

### MediaTemplateKeys  

**Type:** <code>&#39;loader&#39; | &#39;error&#39;</code>

### MediaTemplates  

**Type:** <code>Map&lt;<a href="#mediatemplatekeys">MediaTemplateKeys</a>, HTMLElement&gt;</code>