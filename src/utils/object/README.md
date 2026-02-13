# Object

## recurseObject  

**<code>recurseObject(value: object, condition: ObjectRecurseCondition, callback?: ObjectRecurseCallback): void</code>**  

Recurse through object if condition met otherwise run callback.

### Parameters  
- **`value`** <code>object</code> required  
- **`condition`** <code>ObjectRecurseCondition</code> required  
- **`callback`** <code>ObjectRecurseCallback</code> optional

### Returns  

<code>void</code>

## getObjectKeys  

**<code>getObjectKeys(obj: object): string[]</code>**  

Object keys cast as keyof object (workaround for index signature).

### Parameters  
- **`obj`** <code>object</code> required

### Returns  

<code>string[]</code>

## isObject  

**<code>isObject(value: &ast;): boolean</code>**  

Check if value is an object.

### Parameters  
- **`value`** <code>&ast;</code> required

### Returns  

<code>boolean</code>

## isObjectStrict  

**<code>isObjectStrict(value: &ast;): boolean</code>**  

Check if value is an object and not an array or HTML element.

### Parameters  
- **`value`** <code>&ast;</code> required

### Returns  

<code>boolean</code>