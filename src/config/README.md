# Config

## config  

Attribute and feature support.  

**Type:** <code><a href="#config">Config</a></code>

## configFlexGap  

**<code>configFlexGap(): void</code>**  

Browser flexbox gap support.

### Returns  

<code>void</code>

## configDefaultFontSize  

**<code>configDefaultFontSize(): void</code>**  

Browser font size in pixels.

### Returns  

<code>void</code>

## setConfig  

**<code>setConfig(): void</code>**  

Check attribute/feature support.

### Returns  

<code>void</code>

## Types

### ConfigLabels  

**Type:** <code>object</code>

#### Properties  
- **`hours`** <code>string</code> optional  
Default: `hours`  
- **`hour`** <code>string</code> optional  
Default: `hour`  
- **`minutes`** <code>string</code> optional  
Default: `minutes`  
- **`minute`** <code>string</code> optional  
Default: `minute`  
- **`seconds`** <code>string</code> optional  
Default: `seconds`  
- **`second`** <code>string</code> optional  
Default: `second`  
- **`play`** <code>string</code> optional  
Default: `Play`  
- **`pause`** <code>string</code> optional  
Default: `Pause`

### Config  

**Type:** <code>object</code>

#### Properties  
- **`inert`** <code>boolean</code> required  
- **`reduceMotion`** <code>boolean</code> required  
- **`wellFormed`** <code>boolean</code> required  
- **`flexGap`** <code>boolean</code> required  
- **`defaultFontSize`** <code>number</code> required  
- **`fontSizeMultiplier`** <code>number</code> required  
- **`resizeDelay`** <code>number</code> required  
- **`scrollDelay`** <code>number</code> required  
- **`labels`** <code><a href="#configlabels">ConfigLabels</a></code> required