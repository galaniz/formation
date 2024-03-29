# Changelog

All notable changes to this project will be documented in this file.

## [2.0.1] - 2021-05-16

### Added
- CircleCI and Release It package to automate releases.
- Rule to remove select caret.
- Rule for flex shrink.
- Publish tab state change in `usingMouse` module.
- Include data attributes in `objectFit` module.

### Changed
- Run `_filter` function in `LoadMore` class on init for already selected inputs.
- Check for required elements in conditional instead of loop in `SendForm` class.

### Removed
- Nested instances parameter in `Collapsible` class.

### Fixed
- Default error/success messages undefined in `SendForm` class.
- `Collapsible` behaving accordian style when not specified.

## [2.1.6] - 2021-05-24

### Added
- Browser history functionality to `LoadMore`.

### Changed
- Clean up setting of filters and generally break up functions into smaller ones in `LoadMore`.

### Removed
- `recurseObject` import in `SendForm`.
- unused `decrement` option in `LoadMore` (wait for pagination support).

## [2.1.7] - 2021-06-29

### Added
- Event source in data attribute for `Collapsible`.

### Removed
- Unnecessary variables and function calls in `Nav`.

### Changed
- Use `math.div` instead of / for division in `calc-rem` and `strip-unit`.
- Replace `disableButtonLoader` with simpler `setLoaders`.
- Update `SendForm` with `setLoaders`.
- Rework `LoadMore` to include prev/next pagination, save to browser history and break up into more functions.

### Fixed
- Disabled inputs incorrect state reset in `toggleFocusability`.

## [2.1.8] - 2021-06-29

### Added
- Scrollable table styles.

### Fixed
- Collapsible styles add visiblity property so not focusable unless open.

## [2.1.9] - 2021-07-15

### Added
- Param for delay on `page-loader-fallback` mixin.
- Auto scroll behaviour for `LoadMore`.
- Optional `onValidate` arg for `Form`.
- Form instance method for `SendForm`.

### Changed
- Simplify `strip-unit` function.

### Removed
- Position styles from nav overflow

## [2.1.10] - 2021-09-28

### Added
- `Lazy` class to lazy load assets (images, videos and iframes).
- `Remove` class to remove dom element based on cookie, condition and click trigger.

### Changed
- Folder structure (folder/index pattern).
- `imagesLoaded` to `assetLoaded` and `assetsLoaded` to include videos and iframes.
- `objectFit` ignore `Lazy` class attributes.

## [2.1.11] - 2021-10-25

### Changed
- Update to use `@use`/`@forward` instead of `@import`.

## [3.0.0] - 2022-03-14

### Changed
- Update all JS files to use JavaScript Standard Style.
- Update all SCSS files to use Stylelint Standard SCSS.
- Update comment style to include params in functions and classes.

### Removed
- SCSS calcEm function.

## [3.0.1] - 2022-04-19

### Changed
- Some placeholder names.
- Comment out console messages.
- `setElements` module to include context in subsequent levels.
- `LoadMore` support and allow filtering for link pagination vs buttons.

### Fixed
- Grayscale mixin.

## [3.0.2] - 2022-05-02

### Changed
- Visually hidden utility class.
- `Tabs` class include panel focus and initial selected based on hash.

## [3.0.3] - 2022-06-02

### Added
- `focusSelector` to `toggleFocusability` module.

### Changed
- All classes to destructure `args` instead of `mergeObjects` module.
- Simplify `toggleFocusability` module.
- `Slider` use `Tabs` base for better a11y.
- Rework `Tabs` to be more flexible.

### Removed
- `Fade` class and styles.
- `Carousel` class.
- Duplicate utility classes file.

## [3.0.4] - 2022-07-01

### Fixed
- `Slider` focus issues with infinite loop.

### Changed
- `LoadMore` filters get results on submit instead of on change.

### Removed
- `OverflowIndicator` unused arg.

## [3.0.5] - 2022-07-07

### Fixed
- `Slider` smooth scroll issue with tab buttons.

## [4.0.0] - 2022-10-08

### Added
- More folders to divide styles - a11y, backgrounds, borders, effects, text

### Changed
- Update most if not all class names to be more descriptive as well as inclusion of CSS variables
- Config includes more variables and flexibility
- Layouts more robust
- Comment block formatting
- `Nav` attributes

### Fixed
- `Send` result text prop issue

### Removed
- All recaptcha references

## [4.0.1] - 2022-10-14

### Added
- Border radius breakpoints

### Fixed
- `l-min-height-100-vh` wrong property
- `l-bottom-0` wrong property

### Removed
- With padding from container breakpoint and root variables

### Changed
- `Form` and `Send` class better a11y and flexibility

## [4.0.2] - 2022-10-20

### Added
- `Conditional` class to show/enable inputs

### Removed
- Outdated rules for IE in input resets

### Changed
- `Form` and `Send` class better a11y and flexibility
- Simplify and improve `Modal`

## [4.0.3] - 2022-10-25

### Added
- `Slider` reduce motion option and prev next button functionality

### Changed
- Loader, modal and collapsible configurable transitions
- `Nav` simplify method to check overflow and reduce layout shifting
- `Form` clear method to clear error messages and use native reset for form in `Send`

## [4.0.4] - 2022-10-28

### Added
- `getKey` utility method for key codes
- `Nav` add filter focusable items param

### Changed
- Update key codes with `getKey`

## [4.0.5] - 2022-10-29

### Added
- `stopScroll` module for `Nav` and `Modal`
- Styles for `stopScroll` and overscroll none

### Fixed
- Search input appearance
- `Form` error summary link ids

## [4.0.6] - 2022-10-31

### Changed
- Update error summary alert in `Form` to be less noisy
- Reset result message and submitted state after submission in `Form`
- Selector and duration option in `Slider`

## [4.0.7] - 2022-11-01

### Added
- `getDefaultFontSize` module

### Fixed
- `Nav` modal separate close button
- `Slider` height in px as rem producing unexpected results

## [4.0.8] - 2022-11-01

### Changed
- `Nav` and `Modal` remove focusability from items on close

## [4.0.9] - 2022-11-02

### Changed
- `toggleFocusability` conditional for focus off
- `Nav` and `Modal` focusability fixes

## [4.0.10] - 2022-11-02

### Changed
- Focusability fixes for `toggleFocusability`, `Nav` and `Modal`

## [4.0.11] - 2022-11-08

### Changed
- Attributes instead of style property for `Nav` buttons
- appendChild instead of append for `getDefaultFontSize` module

## [4.0.12] - 2022-11-08

### Fixed
- Focusable items in overflow false for `Nav`

## [4.0.13] - 2022-11-11

### Added
- Focusable methods in `Modal`
- Variable widths option in `Slider` to determine new index on scroll

## [4.0.14] - 2022-11-12

### Changed
- Pass data to `onError` callback for `Send`
- Use another then block instead of try catch block in `Send`

## [4.0.15] - 2022-11-13

### Changed
- Improve how aria-hidden set and removed in `toggleFocusability`

## [4.0.16] - 2022-12-08

### Changed
- Update way aria-invalid set in `Form`
- Add isolation class

## [4.0.17] - 2022-01-27

### Fixed
- Margin and transition classes unexpected output

### Changed
- `toggleFocusability` simplify inner array and update `Modal` and `Nav` accordingly
- Table styles more accessible
- Wild class selector for container, aspect ratio and gap margin classes

### Added
- `Audio` player class
- `getKey` more key codes
- `Send` json response option

## [4.1.0] - 2023-02-19

### Fixed
- `Audio` pause on close

### Added
- `object-to-form-data` and `get-duration` utility functions
- `LoadMore` and `Send` url and json encoded options
- Start new documentation files

### Removed
- Readme files (newer docs to come)
- Object fallback, gradient, add/has/remove classes, show, generate ids get scroll y files

### Changed
- `Table` current and target width css variables
- Replace all for in loops with forEach loops using object keys
- `request` Fetch instead of XMLHttpRequest and add more options like encoding
- Comments more detailed/more JSDoc like throughout except for files in objects folder
- Moved utility modules files to utility functions folder
- Esbuild instead of webpack for test build

## [4.1.1] - 2023-03-21

### Fixed
- `Modal` focusableItems

### Changed
- General function comment updates
- `pageTransition` delay
- `Audio` passive listener for touchStart

### Removed
- Page loader fallback styles

## [4.1.2] - 2023-05-23

### Fixed
- `Form` error summary focus when elements changed or removed
- `assetLoaded` iframe and video elements and callbacks

### Added 
- `Video` class to pause/play video
- `getOuterElements` utility
- `settings` and `setSettings` for feature check

### Changed
- `toggleFocusability` fetch elements moment of interaction
- `Nav`, `Modal` and `Audio` to new `toggleFocusability`

### Removed
- 900px breakpoint from `$breakpoints` map
- window focus in `usingMouse`
