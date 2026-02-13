# Form  

Handles form validation and retrieval of values.

## Constructor  

**<code>new Form(): Form</code>**  

Create new instance.

## Properties

### form  

Form element.  

**Type:** <code>HTMLFormElement | null</code>

### groups  

Data (values, inputs, type) by input name.  

**Type:** <code><a href="#formgroups">FormGroups</a></code>

### errorOn  

Display errors on submit, change or both.  

**Type:** <code><a href="#formerroron">FormErrorOn</a></code>

### submitted  

Track submit state.  

**Type:** <code>boolean</code>

### init  

Initialize success.  

**Type:** <code>boolean</code>

### usedTemplates  

Template types in use.  

**Type:** <code>Set&lt;<a href="#formtemplatekeys">FormTemplateKeys</a>&gt;</code>

### templates  

Error, loader and success fragments.  

**Type:** <code><a href="#formtemplates">FormTemplates</a></code>

### clones  

Clones of templates.  

**Type:** <code><a href="#formclones">FormClones</a></code>

## Methods

### connectedCallback  

**<code>connectedCallback(): </code>**  

Init after added to DOM.

### disconnectedCallback  

**<code>disconnectedCallback(): </code>**  

Clean up after removed from DOM.

### submit  

**<code>submit(e: SubmitEvent): Promise&lt;void&gt; | void</code>**  

Submit handler on form element.

#### Parameters  
- **`e`** <code>SubmitEvent</code> required

#### Returns  

<code>Promise&lt;void&gt; | void</code>

### getClone  

**<code>getClone(type: FormTemplateKeys, appendTo?: HTMLElement | null): HTMLElement | null</code>**  

Clone, return and optionally append template element.

#### Parameters  
- **`type`** <code><a href="#formtemplatekeys">FormTemplateKeys</a></code> required  
- **`appendTo`** <code>HTMLElement | null</code> optional

#### Returns  

<code>HTMLElement | null</code>

### validate  

**<code>validate(quiet?: boolean): boolean</code>**  

Validate form.

#### Parameters  
- **`quiet`** <code>boolean</code> optional  
Display errors.  
Default: `false`

#### Returns  

<code>boolean</code>

### getValues  

**<code>getValues(): FormValues</code>**  

Retrieve form values.

#### Returns  

<code><a href="#formvalues">FormValues</a></code>

### clear  

**<code>clear(): void</code>**  

Clear form values, error messages and summary.

#### Returns  

<code>void</code>

## Types

### FormInput  

**Type:** <code>HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement</code>

### FormPrimitive  

**Type:** <code>string | number | boolean | File</code>

### FormGroup  

**Type:** <code>object</code>

#### Properties  
- **`field`** <code>HTMLElement</code> required  
- **`inputs`** <code><a href="#forminput">FormInput</a>[]</code> required  
- **`label`** <code>HTMLElement</code> required  
- **`labelType`** <code>string</code> required  
- **`required`** <code>boolean</code> required  
- **`type`** <code>string[]</code> required  
- **`values`** <code><a href="#formprimitive">FormPrimitive</a>[]</code> required  
- **`valid`** <code>boolean</code> required  
- **`emptyMessage`** <code>string</code> required  
- **`invalidMessage`** <code>string</code> required  
- **`id`** <code>string</code> required

### FormGroups  

**Type:** <code>Map&lt;string, <a href="#formgroup">FormGroup</a>&gt;</code>

### FormErrorOn  

**Type:** <code>&#39;change&#39; | &#39;submit&#39; | &#39;both&#39;</code>

### FormTemplateKeys  

**Type:** <code>&#39;errorSummary&#39; | &#39;errorInline&#39; | &#39;error&#39; | &#39;success&#39; | &#39;loader&#39;</code>

### FormTemplates  

**Type:** <code>Map&lt;<a href="#formtemplatekeys">FormTemplateKeys</a>, HTMLElement&gt;</code>

### FormCloneKeys  

**Type:** <code>&#39;errorSummary&#39; | &#39;errorList&#39; | &#39;errorInline&#39; | &#39;error&#39; | &#39;success&#39; | &#39;loader&#39;</code>

### FormClones  

**Type:** <code>Map&lt;<a href="#formclonekeys">FormCloneKeys</a>, HTMLElement&gt;</code>

### FormValue  

**Type:** <code>object</code>  

**Augments:** <code><a href="/src/global/README.md#generic">Generic</a></code>

#### Properties  
- **`value`** <code><a href="#formprimitive">FormPrimitive</a> | <a href="#formprimitive">FormPrimitive</a>[]</code> required  
- **`type`** <code>string | string[]</code> required  
- **`label`** <code>string</code> optional  
- **`legend`** <code>string</code> optional

### FormValues  

**Type:** <code>Object&lt;string, <a href="#formvalue">FormValue</a>&gt;</code>