# cascade  

**<code>cascade(events: CascadeEvent[], repeat?: number): void</code>**  

Sequentially and recursively call and delay functions.

## Parameters  
- **`events`** <code><a href="#cascadeevent">CascadeEvent</a>[]</code> required  
- **`repeat`** <code>number</code> optional  
Default: `0`

## Returns  

<code>void</code>

## Types

### CascadeEvent  

**Type:** <code>object</code>

#### Properties  
- **`action`** <code>Action</code> required  
- **`delay`** <code>number</code> optional  
Value to delay action by in milliseconds.  
Default: `0`  
- **`increment`** <code>number</code> optional  
Value to increase delay by.  
Default: `0`