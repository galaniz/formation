# Media  

Handles loading and playing media.

## Constructor  

**<code>new Media(): Media</code>**  

Create new instance.

## Properties

### media  

Media element identified by tag matching the `type="{MediaType}"` attribute.  

**Type:** <code>HTMLMediaElement | null</code>

### progress  

Optional progress bar element identified by `data-media-progress`.  

**Type:** <code>HTMLElement | null</code>

### time  

Optional time element identified by `data-media-time`.  

**Type:** <code>HTMLElement | null</code>

### duration  

Optional duration element identified by `data-media-duration`.  

**Type:** <code>HTMLElement | null</code>

### controls  

Play/pause button elements identified by `data-media-control` | `data-media-control="{MediaControl}"`.  

**Type:** <code>HTMLButtonElement[]</code>

### url  

Optional URL of current file, set by `url="{url}"`.  

**Type:** <code>string</code>

### type  

Optional type of media, set by `type="{MediaType}"`.  

**Type:** <code><a href="#mediatype">MediaType</a></code>

### playing  

Play state.  

**Type:** <code>boolean</code>

### dragging  

Progress drag state.  

**Type:** <code>boolean</code>

### loaded  

Asset loaded state.  

**Type:** <code>boolean</code>

### init  

Initialize success.  

**Type:** <code>boolean</code>

### templates  

Group of loader and error fragments from templates set by `loader="{id}"` and `error="{id}"`.  

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

### active  

**<code>active(): boolean</code>**  

Player currently active check modified via the `media:active:{id}` filter.

#### Returns  

<code>boolean</code>

### getClone  

**<code>getClone(type: MediaTemplateKeys): HTMLElement | null</code>**  

Clone, return and append template element.

#### Parameters  
- **`type`** <code><a href="#mediatemplatekeys">MediaTemplateKeys</a></code> required

#### Returns  

<code>HTMLElement | null</code>

### load  

**<code>load(reload?: boolean, progress?: boolean): void</code>**  

Load media asset, clear loader and error.

#### Parameters  
- **`reload`** <code>boolean</code> optional  
Default: `false`  
- **`progress`** <code>boolean</code> optional  
Default: `false`

#### Returns  

<code>void</code>

### toggle  

**<code>toggle(play?: boolean, reload?: boolean): Promise&lt;void&gt;</code>**  

Play and pause media element.

#### Parameters  
- **`play`** <code>boolean</code> optional  
Default: `true`  
- **`reload`** <code>boolean</code> optional  
Default: `false`

#### Returns  

<code>Promise&lt;void&gt;</code>

## Types

### MediaType  

**Type:** <code>&#39;video&#39; | &#39;audio&#39;</code>

### MediaTemplateKeys  

**Type:** <code>&#39;loader&#39; | &#39;error&#39;</code>

### MediaTemplates  

**Type:** <code>Map&lt;<a href="#mediatemplatekeys">MediaTemplateKeys</a>, HTMLElement&gt;</code>