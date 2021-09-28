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
- Use `math.div` instead of / for division in `calcRem` and `stripUnit`.
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
- Param for delay on `pageLoaderFallback` mixin.
- Auto scroll behaviour for `LoadMore`.
- Optional `onValidate` arg for `Form`.
- Form instance method for `SendForm`.

### Changed
- Simplify `stripUnit` function.

### Removed
- Position styles from nav overflow

## [2.2.0] - 2021-09-28

### Added
- `Lazy` class to lazy load assets (images, videos and iframes).
- `Remove` class to remove dom element based on cookie, condition and click trigger.

### Changed
- Folder structure (folder/index pattern).
- `imagesLoaded` to `assetLoaded` and `assetsLoaded` to include videos and iframes.
- `objectFit` ignore `Lazy` class attributes.
