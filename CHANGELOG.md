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
