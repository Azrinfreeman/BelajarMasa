# UI Fit and Polish Implementation Plan

## Goal

Make Genius Time Master fit completely inside tablet and TV landscape screens while improving hierarchy, readability, and play comfort. The first priority is preventing clipped content. The second priority is a small visual revamp that makes the game feel intentional on wide screens instead of looking like a desktop page squeezed into a tablet viewport.

This document is the implementation proposal only. No source files or APK should be changed until this plan is approved.

## What the screenshots show

### Main menu

- The first row of mode cards fits, but the second row is cut off by the bottom edge.
- The hero heading and top header consume a large amount of vertical space before the cards begin.
- The menu appears to rely on a page area that is taller than the visible tablet viewport.
- The card grid does not clearly communicate whether the screen should scroll or whether all cards are expected to fit at once.

### Explore Mode

- The left adjustment panel continues below the visible screen.
- The clock area has unused space while the control panel is clipped.
- The interface presents too many adjustment rows at full size for the available tablet height.
- The top navigation takes significant vertical room even though the user is already inside a mode.

## Recommended design direction

Use a “viewport-owned game shell” rather than letting the whole page determine its own height:

```text
screen viewport
└── safe-area game shell
    ├── compact global header
    └── scrollable or split mode content
        ├── menu: compact hero + complete mode grid
        └── explore: scrollable controls + clock stage
```

The key rule is that every screen should choose one of two valid behaviors:

1. Fit all primary content inside the viewport using a compact layout tier.
2. Deliberately scroll an identified content region with visible affordance.

No important control should be clipped without a scroll container.

## Proposed implementation phases

### Phase 1 — Establish a reliable viewport and content area

Update the page shell and viewport contract:

- Extend the viewport meta tag with `viewport-fit=cover`.
- Add `html`, `body`, and app-shell rules using `100dvh`, `100svh`, and `100vh` fallbacks.
- Apply safe-area padding with `env(safe-area-inset-*)`.
- Prevent the document from scrolling unexpectedly while allowing intentional inner scrolling.
- Add a `data-layout-density` state such as `compact`, `standard`, or `wide`.
- Add `--viewport-width`, `--viewport-height`, `--safe-top`, `--safe-bottom`, and `--content-height` CSS variables.
- Use `box-sizing: border-box` at every major layout boundary.

Acceptance criteria:

- The visible game shell starts at the top of the tablet screen.
- No screen has accidental horizontal overflow.
- A clipped element is never caused by a parent with hidden overflow unless the element is decorative.

### Phase 2 — Revamp the main menu for tablet landscape

Change the main menu from a tall desktop card layout to a viewport-aware layout:

- Reduce the header height on landscape tablets.
- Make the hero title smaller with `clamp()` and reduce its top/bottom margin.
- Use a responsive mode grid:
  - wide TV: 5 cards in one row when there is enough width;
  - standard tablet: 3 cards on the first row and 2 centered cards on the second row;
  - short tablet landscape: compact 3-column cards with reduced padding;
  - narrow fallback: 2 columns with an intentional inner scroll area.
- Remove hard minimum card heights that force the second row below the viewport.
- Give mode cards a compact variant that reduces icon size, description spacing, and button height.
- Keep every card’s main action visible in compact mode.
- Add a small scroll indicator only when the mode grid genuinely exceeds the available content height.
- Keep the stats/trophy area in a compact footer strip rather than allowing it to push cards below the fold.

Suggested menu structure:

```text
header: 64–88px
hero: 72–112px
mode grid: remaining height
footer stats: 48–64px
```

### Phase 3 — Make Explore Mode use a true split layout

The Explore screenshot shows the left controls being cut off while the clock stage has unused room. Replace the current natural-flow layout with a bounded split view:

- Set the Explore content area to `display: grid` or a controlled flex row.
- Give the control panel a fixed responsive width, for example `clamp(250px, 28vw, 360px)`.
- Give the clock stage the remaining width and height.
- Make only the adjustment list scrollable; keep the mode selector and most important controls sticky.
- Use a compact adjustment row with smaller vertical padding on short screens.
- Group adjustment buttons into two categories:
  - common: `-1m`, `+1m`, `-5m`, `+5m`;
  - advanced: `-30m`, `+30m`, `-1h`, `+1h`.
- Allow the advanced group to collapse on short tablet screens.
- Keep the digital time display and AM/PM badge close to the clock.
- Scale the clock from the available stage height after header and display space are reserved.
- Add a clear “Controls” heading and an always-visible reset/current-time action.

Target Explore layout:

```text
┌ compact header ────────────────────────────────┐
│ Controls (scrollable) │ Clock stage             │
│ mode selector         │ analog clock            │
│ common adjustments    │ digital time            │
│ advanced adjustments  │ hint/instruction        │
└───────────────────────┴────────────────────────┘
```

### Phase 4 — Simplify navigation on gameplay screens

The global header is useful on the menu but consumes too much vertical space inside a mode:

- Use a compact mode bar inside Explore, Quiz, Learn, Practice, and PvP.
- Keep only the mode name, home/menu action, language, sound, and theme controls visible.
- Move less frequently used navigation into a small menu button on short screens.
- Preserve large touch targets even when the visual button becomes compact.
- Avoid showing both a full mode navigation row and a large mode header at the same time.
- Add a consistent safe-area-aware top padding so the compact bar does not touch the tablet bezel or camera area.

### Phase 5 — Improve responsive visual hierarchy

Polish the interface without changing the game’s identity:

- Use one primary accent color per mode and reserve yellow for rewards/highlights.
- Reduce excessive glow and shadow on tablet screens so cards remain readable at distance.
- Align card titles, descriptions, and buttons to consistent vertical anchors.
- Use a limited spacing scale: `4, 8, 12, 16, 24, 32px`.
- Increase contrast between card surfaces and the background.
- Make headings and action labels slightly larger in TV mode.
- Use `text-wrap: balance` where supported for hero and card headings.
- Keep descriptions to two or three lines with deliberate line-height.
- Add pressed, focus, and disabled states that are visible without relying only on color.
- Respect `prefers-reduced-motion` and reduce decorative animations on low-power devices.

### Phase 6 — Add runtime layout classification

Add a small `ViewportManager` in `app.js`:

- Read `window.innerWidth`, `window.innerHeight`, `visualViewport`, `devicePixelRatio`, and orientation.
- Recalculate on `resize`, `orientationchange`, and `visualViewport.resize`.
- Update CSS variables and data attributes only; keep layout rules in CSS.
- Classify the screen by usable dimensions, not device brand:
  - `compact`: short height or small usable width;
  - `standard`: normal tablet landscape;
  - `wide`: TV/desktop-sized display;
  - `tv-like`: large viewport with pointer or touch input not detected.
- Recalculate clock sizing after a mode change and after a viewport change.
- Reset scroll when entering a mode and restore scrolling when leaving it.

Example state attributes:

```html
<body data-orientation="landscape" data-layout="standard" data-mode="explore">
```

### Phase 7 — Android and TV/WebView polish

Review the Android wrapper after the web layout is stable:

- Keep the official Android activity landscape-locked.
- Keep `resizeableActivity` and configuration-change handling.
- Review `setUseWideViewPort(true)` and `setLoadWithOverviewMode(true)` if the tablet still scales the page unexpectedly.
- Ensure the WebView uses the page viewport rather than shrinking the document to an old desktop layout width.
- Reapply immersive mode after focus and configuration changes.
- Add stronger focus rings and keyboard/D-pad support if Android TV is an intended target.
- Avoid placing essential controls at the absolute screen edge because TVs may have overscan.

## Suggested file changes

| File | Planned work |
|---|---|
| `index.html` | Viewport metadata, menu/content wrappers, optional compact-header hooks |
| `style.css` | Viewport shell, compact menu grid, Explore split layout, inner scrolling, layout tiers, TV focus styles |
| `app.js` | ViewportManager, mode layout state, scroll reset, compact-mode behavior, optional advanced-controls collapse |
| `android-webview/app/src/main/java/com/azrin/belajarmasa/MainActivity.java` | Review WebView scale and immersive behavior |
| `android-webview/app/src/main/AndroidManifest.xml` | Preserve landscape and resize configuration; change only if device testing requires it |
| `LANDSCAPE_TABLET_TV_IMPLEMENTATION.md` | Broader landscape/tablet/TV strategy; keep as reference |
| `UI_FIT_AND_POLISH_IMPLEMENTATION.md` | This screenshot-focused UI fit and polish specification |

## Validation matrix

Before any APK build, test the browser version at these viewports:

| Profile | Size | Main menu | Explore | PvP |
|---|---:|---|---|---|
| Small landscape phone | 800×360 | Compact grid or intentional scroll | Scrollable controls | Side-by-side compact zones |
| Standard tablet | 1280×800 | All primary cards visible | Controls and clock fit | Two equal player zones |
| Large tablet | 1920×1200 | More breathing room, bounded content | Larger clock, no stretching | Side-by-side with centered HUD |
| HD TV | 1920×1080 | Readable from distance | Large controls and focus ring | No overscan-critical content |
| 4K TV | 3840×2160 | Content remains bounded | No excessive stretching | Bounded player panels |
| Browser portrait fallback | 800×1280 | Intentional scroll or fallback message | No clipped action buttons | Clear landscape recommendation |

For every view:

- Capture a screenshot after the splash screen disappears.
- Check `scrollWidth <= clientWidth` unless a deliberate inner scroller is active.
- Check every primary action’s bounding rectangle is inside the visible viewport or its intended scroll container.
- Verify that card buttons, adjustment rows, submit actions, and shared prompts are reachable.
- Confirm there are no console errors.
- Confirm returning to the menu clears fixed positioning and stale scroll offsets.

## Recommended execution order

1. Implement the viewport contract and remove accidental page overflow.
2. Revamp the menu grid and compact header.
3. Convert Explore Mode to a bounded split layout with an inner control scroller.
4. Add runtime viewport classification and resize handling.
5. Add TV/focus/accessibility polish.
6. Validate all viewport profiles in the browser.
7. Review Android WebView scale behavior.
8. Generate an APK only after the final UI checks pass.

## Definition of done

- The complete main menu is visible on a standard tablet landscape screen without clipping.
- Explore Mode keeps the clock and all essential controls usable at the same time.
- Any overflow is intentional, contained, and visibly scrollable.
- PvP stays horizontal with aligned player panels.
- The UI scales smoothly across tablet and TV-sized viewports.
- Touch targets remain comfortable and TV focus states are visible.
- No layout state leaves the document stuck at an old scroll position.
- The official APK is generated only after the browser validation matrix passes.
