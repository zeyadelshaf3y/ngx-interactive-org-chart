# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - Unreleased

### Fixed

- Double-clicking (or rapidly clicking) a collapse/expand button no longer
  triggers panzoom's double-click-to-zoom, which caused the chart to zoom in a
  step on repeated toggles. Double-click-to-zoom on the canvas is unchanged.

### Changed

- **Requires Angular 22.** Peer dependencies bumped to `@angular/core` and
  `@angular/common` `^22.0.0`.
- Replaced the deprecated `@angular/animations` DSL with Angular's native
  `animate.enter` / `animate.leave`. Consumers no longer need
  `provideAnimations()` / `BrowserAnimationsModule`, and `@angular/animations`
  is no longer a peer dependency.
- Components now use the Angular 22 defaults (`OnPush` change detection,
  standalone). The library is fully signal-based and works in zoneless apps
  (`provideZonelessChangeDetection()`).

### Removed

- `@angular/animations` peer dependency (see above).

### Tooling (no runtime impact)

- Migrated the test runner from the deprecated Karma to Vitest
  (`@angular/build:unit-test`, Node + jsdom).
- Removed the deprecated `@angular/platform-browser-dynamic` dependency.
- Migrated the package manager from npm to pnpm.
- Bumped remaining dependencies to their latest supported versions.

### Migrating from 1.4.x

No public API changes. Upgrade your app to Angular 22 and remove
`provideAnimations()` / `BrowserAnimationsModule` (and optionally the
`@angular/animations` dependency if unused elsewhere). See the library
[README](./projects/ngx-interactive-org-chart/README.md#upgrading-from-14x-to-15x).

## [1.4.x] - Angular 21

- Angular 21 support.

## [1.3.x] - Angular 20

- Mini map navigation, dark mode, and rendering performance improvements.

## [1.2.x] - Angular 20

- Drag & drop reordering and RTL support.

## [1.1.4] - Angular 19

- Stable release.
