# Filters

## filters  

Filter callbacks by name.  

**Type:** <code>Map&lt;string, Set&lt;<a href="/src/global/README.md#genericfunction">GenericFunction</a>&gt;&gt;</code>

## addFilter  

**<code>addFilter(name: string, filter: GenericFunction): boolean</code>**  

Add filter to filters map.

### Parameters  
- **`name`** <code>string</code> required  
- **`filter`** <code><a href="/src/global/README.md#genericfunction">GenericFunction</a></code> required

### Returns  

<code>boolean</code>

## removeFilter  

**<code>removeFilter(name: string, filter: GenericFunction): boolean</code>**  

Remove filter from filters map.

### Parameters  
- **`name`** <code>string</code> required  
- **`filter`** <code><a href="/src/global/README.md#genericfunction">GenericFunction</a></code> required

### Returns  

<code>boolean</code>

## applyFilters  

**<code>applyFilters(name: string, value: &ast;, args?: &ast;): &ast;</code>**  

Update value from callback return values.

### Parameters  
- **`name`** <code>string</code> required  
- **`value`** <code>&ast;</code> required  
- **`args`** <code>&ast;</code> optional

### Returns  

<code>&ast;</code>