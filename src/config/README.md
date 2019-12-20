# Configuration

#### `$g-colors`  
_Type:_ `map`  
_Default:_

```scss
$g-colors: (
  primary: (
    base: #1DE9B6,
    light: #A7FFEB,
    dark: #00BFA5
  ),
  foreground: (
    base: #1E1E1E,
    light: #444444,
    dark: #000000
  ),
  background: (
    base: #F8F8F8,
    light: #FFFFFF,
    dark: #EEEEEE
  )
);
```

#### `$g-fonts`

_Type:_ `map`  
_Default:_

```scss
$g-fonts: (
	primary: (   
		Helvetica,
		Arial,
		sans-serif
	),
	weight: (
		normal: 400
	)
);
```

#### `$g-breakpoints`

_Type:_ `map`  
_Default:_

```scss
$g-breakpoints: (
  0: 0px,
  500: 500px,
  600: 600px,
  700: 700px,
  800: 800px,
  900: 900px,
  1000: 1000px
);
```

#### `$g-containers`

_Type:_ `map`  
_Default:_

```scss
$g-containers: (
  def: 1200px,
  sm: 800px,
  lg: 1800px
);
```
#### `$g-containerPadding`

_Type:_ `number`  
_Default:_ `25px`

#### `$g-grid`

_Type:_ `map`  
_Default:_

```scss
$g-grid: (
  25: (   
    600: 50%,
    900: 25%
  ),
  33: (
    600: 50%,
    900: 33.33333%
  ),
  50: (
    600: 50%
  ),
  66: (
    600: 50%,
    900: 66.66667%
  ),
  75: (
    600: 50%,
    900: 75%
  )
);
```

#### `$g-props`

_Type:_ `map`  
_Default:_ See utility [props](/src/utils/atomic/_props.scss)

#### `$g-context`

_Type:_ `number`  
_Default:_ `16px`

#### `$g-aspectRatioPadding`

_Type:_ `map`  
_Default:_ `()`

#### `$g-transitions`

_Type:_ `map`  
_Default:_

```scss
$g-transitions: (
  def: (
    duration: 300ms,
    timingFunction: 'ease-in-out',
    timingFunctionCubic: 'cubic-bezier( .07, .50, .12, 1 )'
  ),
  fade: (
    durations: (
      def: '800ms, 500ms',
      s: '1200ms, 800ms'
    ),
    y: (
      def: 5%,
      sm: 25%,
      md: 50%,
      lg: 100%
    ),
    x: (
      def: 5%,
      sm: 25%,
      md: 50%,
      lg: 100%
    )
  ),
  scale: (
    durations: (
      def: '800ms, 500ms',
      s: '2200ms, 600ms'
    ),
    in: (
      def: 1.10,
      hover: 1.06,
      sm: 1.05,
      md: 1.20,
      lg: 1.55
    ),
    out: (
      def: 1.10,
      hover: 1,
      sm: 1.04,
      md: 1.20
    )
  )
);
```

#### `$g-zIndex`

_Type:_ `map`  
_Default:_

```scss
$g-zIndex: (
  skipLink: 100,
  transition: 100,
  modal: 90,
  nav: 85,
  loader: (
    def: 80,
    page: 110
  )
);
```

#### `$g-nav`

_Type:_ `map`  
_Default:_

```scss
$g-nav: (
	icon: (
		width: 35px,
		lineWidth: 2px,
		margin: 8px
	)
);
```

#### `$g-loader-selector`

_Type:_ `string`  
_Default:_ `'.o-loader'`
