# Landscape, Tablet, and TV View Implementation Plan

## Purpose

Make Genius Time Master behave like a landscape-first game across Android phones, tablets, browser previews, and TV-sized screens. The layout should use the complete available viewport, preserve the two-player side-by-side PvP experience, keep controls reachable, and scale without stretching or creating clipped content.

This document is the implementation proposal only. No source files or APK should be changed until this plan is approved.

## Current project assessment

The project already has useful foundations:

- The Android activity requests landscape orientation.
- The Android manifest enables `resizeableActivity` and handles orientation/screen-size changes.
- The WebView uses a viewport-enabled configuration.
- PvP already has a horizontal 50/50 player split and responsive CSS overrides.
- CSS already uses `clamp()`, `dvh`, safe-area insets, and short-screen media queries.

The main risks are:

1. Older responsive rules still contain portrait/stacked PvP behavior before the later horizontal overrides, making the cascade difficult to reason about.
2. The current layout relies heavily on viewport width and height independently; unusual tablet and TV aspect ratios can leave too little vertical room for clocks, controls, and prompts.
3. Android WebView viewport behavior can differ from a browser preview, especially with `setUseWideViewPort`, system bars, display cutouts, and TV overscan.
4. The app needs a single runtime layout state so JavaScript can respond consistently to resize, orientation, split-screen, and TV-style dimensions.

## Recommended layout strategy

Use a landscape-first responsive shell with three layers:

```text
device viewport
└── safe-area shell
    ├── game stage: full available width/height
    ├── player zones: 50% + 50% in PvP
    └── shared HUD: centered, bounded, and never covering controls
```

### Layout rules

- Keep PvP side-by-side whenever the game is in landscape mode.
- Keep PvP side-by-side in portrait browser previews only as a fallback preview; the Android app should request landscape.
- Give each player zone `min-width: 0` so text and controls cannot force the split wider than the screen.
- Size the clock from the smaller available dimension: `min(available-width, available-height)`.
- Reserve explicit space for the header, clock, digital time, adjustment controls, and submit action.
- Put the shared round prompt in a centered overlay layer with a maximum width and safe-area-aware bottom offset.
- Use `100dvh` first, with `100svh`/`100vh` fallbacks for older WebViews.
- Prevent document scrolling while in PvP; restore normal scrolling when returning to the menu or single-player modes.
- Do not use fixed pixel sizes for primary gameplay elements.

## Proposed implementation phases

### Phase 1 — Establish a viewport contract

Update `index.html` and the root CSS shell:

- Expand the viewport meta tag with `viewport-fit=cover`.
- Add root variables for viewport width, height, safe-area padding, and layout density.
- Add a single `.game-viewport` or equivalent shell class for full-screen gameplay.
- Define a predictable box-sizing and overflow contract for `html`, `body`, and the active game shell.
- Add a TV-friendly minimum readable scale without forcing the entire page to zoom.

Target behavior:

- No horizontal page overflow.
- No vertical page scroll during PvP.
- The game stage always occupies the current WebView viewport.

### Phase 2 — Consolidate PvP responsive CSS

Refactor the existing PvP rules in `style.css` so there is one authoritative section:

- Remove or neutralize obsolete stacked-player rules that conflict with the horizontal override.
- Replace duplicated `@media (max-height: 560px)` and portrait rules with named layout tiers.
- Define tiers by available height and aspect ratio rather than device names:
  - `compact-landscape`: short phone or small tablet landscape.
  - `standard-landscape`: normal tablet and desktop landscape.
  - `wide-landscape`: TV or ultrawide display.
- Use CSS custom properties such as `--pvp-clock-size`, `--pvp-zone-gap`, `--pvp-control-height`, and `--pvp-hud-bottom`.
- Make the clock size use the smaller of the zone width and the stage height after reserved UI space.
- Add `min-width: 0`, `min-height: 0`, and `overflow: hidden` at the correct flex boundaries.
- Keep the center divider and shared HUD in a separate overlay layer so they do not affect player-zone sizing.

### Phase 3 — Add runtime viewport state

Add a small `ViewportManager` in `app.js`:

- Read `window.innerWidth`, `window.innerHeight`, `visualViewport`, `devicePixelRatio`, and `matchMedia('(orientation: landscape)')`.
- Set data attributes such as:
  - `data-orientation="landscape"`
  - `data-layout="compact|standard|wide"`
  - `data-display="touch|tv-like"`
- Recalculate on `resize`, `orientationchange`, and `visualViewport.resize`.
- Use `requestAnimationFrame` throttling so tablet rotation does not cause repeated layout work.
- Reset scroll position when entering PvP and restore the previous single-player scroll behavior when leaving.
- Re-run clock sizing after the layout state changes.

The manager should only classify the viewport and update CSS variables. Visual layout should remain primarily CSS-driven.

### Phase 4 — Improve Android WebView behavior

Update `MainActivity.java` and, if needed, `AndroidManifest.xml`:

- Keep the activity landscape-locked for the official game build.
- Preserve `configChanges` for orientation and screen-size changes.
- Confirm the WebView has JavaScript, DOM storage, and wide viewport support enabled.
- Review `setLoadWithOverviewMode(true)` because it may cause unwanted initial scaling on some tablets and TVs.
- Prefer a viewport-controlled page scale over an automatic overview scale if testing shows the WebView shrinking the game.
- Keep immersive mode, but reapply it after focus and configuration changes.
- Add TV-safe focus behavior if Android TV support is intended.
- Leave the activity resizeable for external display and multi-window compatibility, but verify the game still uses the resized viewport.

### Phase 5 — Tablet and TV usability polish

Add device-appropriate interaction improvements:

- Increase touch targets to at least 44–48 CSS pixels in compact layouts.
- Use larger targets and stronger focus rings for TV/D-pad navigation.
- Add visible focus styling for buttons, answer choices, and adjustment controls.
- Keep labels readable at a distance; avoid relying only on color.
- Add a small “Landscape mode recommended” message only for browser portrait previews, not inside the Android APK that already requests landscape.
- Avoid placing important controls near display cutouts or TV overscan edges.
- Keep the PvP round prompt centered and ensure it does not cover either submit button.
- Maintain reduced-motion behavior for devices where animation is disabled.

### Phase 6 — Device validation and release build

Test the web app before rebuilding the APK. Use the following viewport matrix:

| Profile | Viewport | Expected layout |
|---|---:|---|
| Small phone landscape | 800×360 | Two narrow player zones, compact clocks and controls |
| Large phone landscape | 1280×720 | Two balanced player zones, readable controls |
| Tablet landscape | 1280×800 | Full side-by-side PvP, no clipping or scrolling |
| Tablet landscape | 1920×1200 | Larger clocks with bounded HUD |
| HD TV | 1920×1080 | Large readable UI, no overscan-critical content |
| 4K TV | 3840×2160 | Bounded maximum content width, no excessive stretching |
| Browser portrait fallback | 800×1280 | Clear fallback behavior and no broken overflow |

For each profile verify:

- The game stage starts at the top-left of the viewport.
- PvP players remain aligned side-by-side in landscape.
- Both clocks remain circular and fully visible.
- Adjustment controls and submit buttons remain inside their player zone.
- The shared HUD does not cover gameplay controls.
- There is no horizontal overflow and no unintended page scroll.
- Text does not overlap, clip, or become too small.
- Returning to the menu works without a stuck fixed body or scroll offset.
- Browser console has no runtime errors.

Only after this checklist passes should the official release APK be generated.

## Suggested file changes

| File | Planned change |
|---|---|
| `index.html` | Strengthen viewport metadata and add optional display/layout hooks |
| `style.css` | Consolidate PvP rules, add layout tiers, safe-area handling, TV focus styles, and viewport variables |
| `app.js` | Add `ViewportManager`, resize handling, scroll locking, and layout data attributes |
| `MainActivity.java` | Review WebView scaling and immersive-mode behavior for tablets/TVs |
| `AndroidManifest.xml` | Preserve landscape and resize behavior; adjust only if device testing requires it |
| `scripts/build-release-apk.ps1` | Keep unchanged unless versioning or release metadata needs updating |
| `LANDSCAPE_TABLET_TV_IMPLEMENTATION.md` | This implementation specification and acceptance checklist |

## Recommended order of execution

1. Implement the viewport contract and root overflow rules.
2. Consolidate the PvP CSS into one authoritative responsive section.
3. Add and test `ViewportManager` in the browser.
4. Validate tablet, short-landscape, TV, and portrait fallback sizes.
5. Review Android WebView scaling and immersive behavior.
6. Run syntax, browser, asset-sync, and APK-signature checks.
7. Generate the official APK only after all checks pass.

## Definition of done

The work is complete when:

- Android launches in landscape.
- PvP remains horizontal with two aligned player zones.
- Single-player screens also fit landscape tablet and TV viewports.
- Layout responds correctly to resize and orientation changes.
- No gameplay screen has unintended horizontal overflow or scrolling.
- Touch and TV-style focus targets are usable.
- The official APK contains the final synchronized web assets.
- The release APK is signature-verified after the final build.
