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
