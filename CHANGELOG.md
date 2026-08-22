# Changelog

All notable changes to this project will be documented in this file.

## [0.0.1] - 2026-02-13

- Initial release.

## [0.0.2] - 2026-04-26

### Changed

- Update loader z-index to CSS variable.
- `Media` replace touch and mouse with pointer event listeners.

### Fixed

- `Media` duration text, load and mute on progress interaction.
- `getDuration` returning empty string for 0 seconds when words true. 
- z-index utility class name.

## [0.0.3] - 2026-05-02

### Added

- `Media` reload option in load method for new URLs.
- oklch option for colors type in config and root variables.

### Fixed

- `Media` space key causing scroll.

## [0.0.4] - 2026-08-22

### Added

- `Masonry` load more items on scroll with `data-masonry-loads`, `loads-offset` and `masonry:load` event.
- `Masonry` `endItems` method and `masonry:set` event.
- `Slider` and `SliderGroup` `slider:scrolled` event.

### Changed

- `Masonry` requires `data-masonry-list` around items, `margins` attribute renamed `gaps`, item IDs no longer required.
- `Masonry` `appendItems` accepts a document fragment or HTML string.
- `Visible` `end` property is the element instead of its ID.
- `Tabs` requires an equal number of tabs and panels to initialize.
- `sliderScrollTo` accepts a single arguments object.
- `$columns-type` overridable with `!default`.

### Fixed

- `Visible` item losing current state at the boundary it shares with the next item.
- `Pagination` document fragments not appended to navigation and entry slots.
- `Pagination` and `Media` loader displaying after the response or media event.
- `PaginationFilter` only applying the last changed group.
- `Slider` and `SliderGroup` re-initializing when moved in the DOM.
- `sliderScrollTo` resting short of the target before scroll snap restored.
- Column breakpoint utility class names.
