# Slider

## SliderGroup  

Handles scroll based slider with multiple items in panels.

### Constructor  

**<code>new SliderGroup(): SliderGroup</code>**  

Create new instance.

### Properties

#### track  

Scrollable container element.  

**Type:** <code>HTMLElement | null</code>

#### items  

Elements within panels.  

**Type:** <code>HTMLElement[]</code>

#### prev  

Previous navigation button element.  

**Type:** <code>HTMLButtonElement | null</code>

#### next  

Next navigation button element.  

**Type:** <code>HTMLButtonElement | null</code>

#### duration  

Transition duration on scroll (tab or button click).  

**Type:** <code>number</code>

#### breakpoints  

Number of visible items and panels by breakpoint.  

**Type:** <code>Set&lt;Record&lt;string, number&gt;&gt;</code>

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

## Slider  

Handles scroll based slider with single item panels.

### Constructor  

**<code>new Slider(): Slider</code>**  

Create new instance.

### Properties

#### track  

Scrollable container element.  

**Type:** <code>HTMLElement | null</code>

#### prev  

Previous navigation button element.  

**Type:** <code>HTMLButtonElement | null</code>

#### next  

Next navigation button element.  

**Type:** <code>HTMLButtonElement | null</code>

#### duration  

Transition duration on scroll (tab or button click).  

**Type:** <code>number</code>

#### loop  

Repeat panels to the left and right.  

**Type:** <code>boolean</code>

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

## sliderScrollTo  

**<code>sliderScrollTo(to: number, source: string, animRef: SliderAnimRef, track: HTMLElement | null, duration: number): void</code>**  

Move track immediately or smoothly.

### Parameters  
- **`to`** <code>number</code> required  
- **`source`** <code>string</code> required  
- **`animRef`** <code><a href="#slideranimref">SliderAnimRef</a></code> required  
- **`track`** <code>HTMLElement | null</code> required  
- **`duration`** <code>number</code> required

### Returns  

<code>void</code>

## Types

### SliderAnimRef  

**Type:** <code>object</code>

#### Properties  
- **`id`** <code>number</code> required