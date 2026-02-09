# Cookie

## setCookie  

**<code>setCookie(name: string, value: string, options?: CookieOptions): string</code>**  

Add browser cookie.

### Parameters  
- **`name`** <code>string</code> required  
- **`value`** <code>string</code> required  
- **`options`** <code><a href="#cookieoptions">CookieOptions</a></code> optional

### Returns  

<code>string</code>

## getCookie  

**<code>getCookie(name: string): string</code>**  

Retrieve browser cookie.

### Parameters  
- **`name`** <code>string</code> required

### Returns  

<code>string</code>

## Types

### CookieOptions  

**Type:** <code>object</code>

#### Properties  
- **`expires`** <code>number</code> optional  
Expiration in days.  
- **`maxAge`** <code>number</code> optional  
Expiration in seconds.  
- **`domain`** <code>string</code> optional  
- **`path`** <code>string</code> optional  
Default: `'/'`  
- **`secure`** <code>boolean</code> optional  
Default: `true`  
- **`httpOnly`** <code>boolean</code> optional  
Default: `false`  
- **`sameSite`** <code>&#39;Strict&#39; | &#39;Lax&#39; | &#39;None&#39;</code> optional