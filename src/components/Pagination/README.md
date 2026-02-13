# Pagination

## PaginationFilter  

Handles dynamic pagination with form filters.

### Constructor  

**<code>new PaginationFilter(): PaginationFilter</code>**  

Create new instance.

### Properties

#### form  

Form element of inputs.  

**Type:** <code>HTMLFormElement | null</code>

#### groups  

Data (values, inputs, type) by input name.  

**Type:** <code><a href="#paginationfiltergroups">PaginationFilterGroups</a></code>

#### loadOn  

Event to fire load on.  

**Type:** <code><a href="#paginationfilterloadon">PaginationFilterLoadOn</a></code>

#### subInit  

Initialize success.  

**Type:** <code>boolean</code>

### Methods

#### connectedCallback  

**<code>connectedCallback(): </code>**  

Init after added to DOM.

#### disconnectedCallback  

**<code>disconnectedCallback(): </code>**  

Clean up after removed from DOM.

## Pagination  

Handles dynamic pagination navigation and entries.

### Constructor  

**<code>new Pagination(): Pagination</code>**  

Create new instance.

### Properties

#### url  

Base URL.  

**Type:** <code>string</code>

#### page  

Current page.  

**Type:** <code>number</code>

#### slots  

Navigation and entry containers.  

**Type:** <code><a href="#paginationslots">PaginationSlots</a></code>

#### templates  

Loader and error fragments.  

**Type:** <code><a href="#paginationtemplates">PaginationTemplates</a></code>

#### clones  

Clones of templates.  

**Type:** <code><a href="#paginationtemplates">PaginationTemplates</a></code>

#### params  

Params for push state and request.  

**Type:** <code>Object&lt;string, (string|undefined)&gt;</code>

#### init  

Initialize state.  

**Type:** <code>boolean</code>

### Methods

#### connectedCallback  

**<code>connectedCallback(): </code>**  

Init after added to DOM.

#### disconnectedCallback  

**<code>disconnectedCallback(): </code>**  

Clean up after removed from DOM.

#### setState  

**<code>setState(): void</code>**  

Current URL, page and params.

##### Returns  

<code>void</code>

#### getClone  

**<code>getClone(type: PaginationTemplateKeys): HTMLElement | null</code>**  

Clone, return and append template element.

##### Parameters  
- **`type`** <code><a href="#paginationtemplatekeys">PaginationTemplateKeys</a></code> required

##### Returns  

<code>HTMLElement | null</code>

#### update  

**<code>update(result: &#39;error&#39; | &#39;success&#39;, source: PaginationSource, nav?: DocumentFragment | string, entry?: DocumentFragment | string): boolean</code>**  

Refresh navigation and entry slots with result.

##### Parameters  
- **`result`** <code>&#39;error&#39; | &#39;success&#39;</code> required  
- **`source`** <code><a href="#paginationsource">PaginationSource</a></code> required  
- **`nav`** <code>DocumentFragment | string</code> optional  
- **`entry`** <code>DocumentFragment | string</code> optional

##### Returns  

<code>boolean</code> - Slots and/or history updated.

#### request  

**<code>request(source: PaginationSource): Promise&lt;void&gt; | void</code>**  

Fetch data and update slots.

##### Parameters  
- **`source`** <code><a href="#paginationsource">PaginationSource</a></code> required

##### Returns  

<code>Promise&lt;void&gt; | void</code>

#### load  

**<code>load(source: PaginationSource): Promise&lt;void&gt;</code>**  

Initiate loader and data request.

##### Parameters  
- **`source`** <code><a href="#paginationsource">PaginationSource</a></code> required

##### Returns  

<code>Promise&lt;void&gt;</code>

## Types

### PaginationFilterInput  

**Type:** <code>HTMLInputElement | HTMLSelectElement</code>

### PaginationFilterGroup  

**Type:** <code>object</code>

#### Properties  
- **`inputs`** <code><a href="#paginationfilterinput">PaginationFilterInput</a>[]</code> required  
- **`type`** <code>string</code> required  
- **`values`** <code>string[]</code> required

### PaginationFilterGroups  

**Type:** <code>Map&lt;string, <a href="#paginationfiltergroup">PaginationFilterGroup</a>&gt;</code>

### PaginationFilterLoadOn  

**Type:** <code>&#39;change&#39; | &#39;submit&#39;</code>

### PaginationSlots  

**Type:** <code>Map&lt;(&#39;nav&#39;|&#39;entry&#39;), HTMLElement&gt;</code>

### PaginationTemplateKeys  

**Type:** <code>&#39;error&#39; | &#39;loader&#39;</code>

### PaginationTemplates  

**Type:** <code>Map&lt;<a href="#paginationtemplatekeys">PaginationTemplateKeys</a>, HTMLElement&gt;</code>

### PaginationSource  

**Type:** <code>&#39;nav&#39; | &#39;pop&#39; | &#39;form&#39;</code>