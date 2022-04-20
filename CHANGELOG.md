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
