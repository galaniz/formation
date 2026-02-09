# Asset

## assetLoaded  

**<code>assetLoaded(asset: Asset): Promise&lt;Asset&gt;</code>**  

Check if single asset is loaded.

### Parameters  
- **`asset`** <code><a href="#asset">Asset</a></code> required

### Returns  

<code>Promise&lt;<a href="#asset">Asset</a>&gt;</code>

## assetsLoaded  

**<code>assetsLoaded(assets: Asset[], done: AssetDone): void</code>**  

Check if multiple assets are loaded.

### Parameters  
- **`assets`** <code><a href="#asset">Asset</a>[]</code> required  
- **`done`** <code><a href="#assetdone">AssetDone</a></code> required

### Returns  

<code>void</code>

## Types

### Asset  

**Type:** <code>HTMLImageElement | HTMLMediaElement | HTMLIFrameElement</code>

### AssetDone  

Callback on error or success.  

**Type:** <code>function</code>

#### Parameters  
- **`result`** <code><a href="#asset">Asset</a>[] | boolean</code> required  
- **`error`** <code>Event | Error</code> optional

#### Returns  

<code>void</code>