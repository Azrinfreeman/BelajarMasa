# Tablet Mode Display Fix Implementation Plan

## Status

Implementation approved and applied to the browser source. This document records the responsive tablet display changes.

Mode-specific CSS and PvP viewport anchoring are now in place; APK generation remains deferred until the final release phase.

## Problem Summary

The landscape tablet shell now fits the basic Explore layout, but several mode-specific layouts still use the generic two-column structure and fixed-height cards. That causes different modes to compete for the same vertical space.

Observed issues:

1. Quiz mode
   - The clock card is cropped at the top/bottom while the difficulty selector extends below the visible play area.
   - The four difficulty choices are vertically expensive for a short landscape viewport.
   - The footer remains part of the visible layout and reduces usable gameplay height.

2. Practice mode
   - Practice uses the same quiz panel as Quiz mode, so it inherits the same difficulty-screen clipping.
   - Hint, adaptive feedback, answer feedback, and action buttons can make the active question screen taller than the tablet viewport.

3. Learn mode
   - The lesson panel is placed in the narrow grid column after the left controls are hidden.
   - The teaching clock is not given a deliberate companion area, leaving a large empty region beside the lesson panel.
   - The lesson card and controls can be clipped because the parent panel does not own a clearly bounded scroll region.

4. PvP mode
   - The two clocks are visually attractive but consume most of the viewport height.
   - Adjustment controls and the shared round HUD overlap or are pushed below the visible viewport.
   - The layout depends on several older PvP media-query blocks, which makes tablet behavior difficult to predict.

## Goals

- Make every mode fit a landscape tablet viewport without page-level clipping.
- Keep the game horizontally oriented on tablets and TV-like displays.
- Preserve large, touch-friendly controls.
- Give each mode its own layout contract instead of forcing every mode into Explore's layout.
- Keep the footer and decorative elements from taking space needed for active gameplay.
- Preserve the current visual theme, clock artwork, translations, and game logic.
- Keep the Android wrapper as a packaging layer; browser source remains canonical.

## Proposed Layout Architecture

Use the existing runtime attributes on `html` as the primary CSS state:

```text
html[data-orientation="landscape"]
  html[data-layout="compact" | "standard" | "wide"]
    html[data-app-mode="menu" | "explore" | "quiz" | "practice" | "learn" | "pvp"]
      app shell
        header
        mode-specific main layout
        footer
```

Add one authoritative responsive block at the end of `style.css` after the existing legacy overrides. The new block should be organized by mode and should override conflicting older rules rather than adding more scattered breakpoint patches.

## Phase 1: Shared Gameplay Viewport Contract

### 1.1 Reserve the real viewport

- Use `100dvh` with a `100vh` fallback.
- Account for `safe-area-inset-top`, `safe-area-inset-bottom`, and horizontal insets.
- Keep `body` from scrolling while an active mode is open.
- Let the active mode's internal panel own scrolling.
- Keep the menu scrollable, but keep gameplay screens bounded.

Suggested structure:

```css
html,
body {
  min-width: 0;
  min-height: 100%;
}

body {
  min-height: 100dvh;
}

body:not(.pvp-active) .app-container {
  min-height: 0;
  height: calc(100dvh - var(--safe-area-top) - var(--safe-area-bottom));
}
```

### 1.2 Use a predictable app shell

For non-menu modes, the app shell should behave like:

```text
header: auto-sized compact row
main: minmax(0, 1fr)
footer: compact or hidden during active play
```

The main area must use `min-height: 0`; otherwise flex/grid children can expand beyond the viewport even when their parent has a fixed height.

### 1.3 Footer policy

- Keep the footer on the main menu.
- Use a smaller footer in Explore if there is enough height.
- Hide the footer in Quiz, Practice, Learn, and PvP on short landscape tablets.
- Do not allow the footer to overlap buttons or quiz feedback.

## Phase 2: Quiz and Practice Layout

Quiz and Practice share a difficulty screen and a question screen, so they should share a mode layout while keeping their different gameplay logic.

### 2.1 Compact clock region

When `html[data-app-mode="quiz"]` or `html[data-app-mode="practice"]`:

- Reduce the clock card to a bounded top region.
- Replace the generic `min-height: 440px` behavior with a height derived from viewport height.
- Keep the AM/PM badge inside the clock card bounds.
- Scale the analog dial with `min()`/`clamp()` so it cannot consume the entire right panel.

Target behavior for a 1280x800 landscape tablet:

```text
header: approximately 64-76px
clock card: approximately 200-270px
quiz card: remaining height with internal scroll if necessary
```

### 2.2 Difficulty selector

The difficulty selector should be a compact, touch-friendly list:

- Keep each option at least 48px high.
- Reduce vertical padding and icon size on short viewports.
- Keep the selector inside the quiz card's scroll container.
- Do not use a fixed `min-height: 380px` inline style as the controlling height.
- Move layout sizing into CSS so breakpoints can override it.

Preferred layout:

```text
quiz panel
  heading
  difficulty options: 2-column grid on wide landscape tablets
  or compact 1-column list on narrower tablets
```

For a tablet width around 1100px or wider, a 2x2 difficulty grid will significantly reduce vertical pressure while keeping the choices easy to tap. For narrower landscape screens, retain a one-column list with reduced padding.

### 2.3 Active question screen

- Put the question header, prompt, choices, action buttons, hint, and feedback into one scrollable content area.
- Keep the primary action visible using `position: sticky` only inside the quiz panel, not against the browser viewport.
- Prevent feedback boxes from pushing the entire page downward.
- Allow the explanation chips to wrap.
- Ensure Practice's hint and adaptive feedback do not create horizontal overflow.

### 2.4 Mode-specific selector strategy

Use selectors such as:

```css
html[data-app-mode="quiz"] .right-panel,
html[data-app-mode="practice"] .right-panel {
  min-height: 0;
  overflow-y: auto;
}

html[data-app-mode="quiz"] .clock-card,
html[data-app-mode="practice"] .clock-card {
  flex: 0 0 clamp(200px, 30vh, 300px);
  min-height: 0;
}
```

The exact values should be tuned during browser validation rather than copied blindly.

## Phase 3: Learn Mode Layout

Learn mode needs a deliberate teaching layout rather than an accidental empty column.

### 3.1 Two-region learning screen

Use the right panel as a learning workspace with two regions:

```text
left: lesson instructions and controls
right: compact teaching clock
```

Recommended CSS grid behavior:

```css
html[data-app-mode="learn"] .main-content {
  grid-template-columns: minmax(300px, 420px) minmax(0, 1fr);
}

html[data-app-mode="learn"] .right-panel {
  display: grid;
  grid-template-columns: minmax(300px, 420px) minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
}

html[data-app-mode="learn"] .learn-panel {
  grid-column: 1;
  grid-row: 1;
  overflow-y: auto;
}

html[data-app-mode="learn"] .clock-card {
  grid-column: 2;
  grid-row: 1;
  min-height: 0;
}
```

If the current DOM placement makes this grid too fragile, use a small layout wrapper in `index.html` around the learning panel and clock card. This would be a structural change only; the lesson behavior and clock logic would remain unchanged.

### 3.2 Learning clock sizing

- Keep the teaching clock visible to the right of the lesson panel.
- Use a viewport-relative dial size, approximately `min(38vh, 420px)` on landscape tablets.
- Keep the lesson action button and Back/Next controls in the scrollable lesson column.
- Keep the progress bar and step count pinned near the top of the lesson column.
- Let the lesson card use the remaining height instead of forcing the entire right panel to grow.

### 3.3 Short landscape behavior

When the viewport height is short:

- Reduce the lesson card's internal padding.
- Reduce the lesson icon size.
- Keep the Back, Next, and Skip buttons at a minimum touch size.
- Allow the lesson panel to scroll independently.
- Hide non-essential decorative spacing before hiding learning content.

## Phase 4: PvP Layout

PvP should be treated as a dedicated full-screen game board, not as a normal `main-content` child.

### 4.1 Full-screen PvP shell

When `body.pvp-active` or `html[data-app-mode="pvp"]`:

- Hide the global app header and footer.
- Use the entire safe viewport for the duel board.
- Set the PvP container to `height: 100%` and `min-height: 0`.
- Prevent document-level scrolling.
- Keep the two player halves side-by-side.

```text
safe viewport
  player 1 half | center divider | player 2 half
  shared HUD anchored inside the board
```

### 4.2 Player half layout

Each player half should be a bounded grid:

```text
player header: auto
clock: minmax(0, 1fr)
digital time: auto
adjustment controls: auto
choices: auto when visible
submit button: auto
```

The player half should use `overflow-y: auto` only when the content genuinely exceeds the available height. The board itself must not expand beyond the viewport.

### 4.3 Clock scaling

The current dial is too dominant on a short tablet viewport. Use a combined width/height constraint:

```css
body.pvp-active .pvp-clock-outer .clock-outer-wrapper {
  width: min(42vw, 46vh, 440px);
  max-width: 100%;
}
```

Tune the value for the actual tablet screenshot. The target is to leave enough room for both adjustment buttons and the submit action without placing them behind the HUD.

### 4.4 Shared HUD

- Anchor the round HUD inside `.pvp-container`, not in normal document flow.
- Reserve bottom space in both player halves equal to the HUD height.
- Keep the exit button inside the HUD safe area.
- Allow the prompt to wrap to two lines.
- Use a smaller timer label on short screens.
- Ensure the HUD never covers the last row of player controls.

### 4.5 PvP controls

- Use a two-row, four-column adjustment grid where width permits.
- Keep all adjustment buttons at least 44px high.
- Reduce gaps before reducing button hit areas.
- If the multiple-choice grid is visible, let it replace or collapse the adjustment grid rather than stacking both at full size.
- Add `padding-bottom` to each player half for the HUD clearance.

### 4.6 Consolidate conflicting PvP rules

The stylesheet currently contains multiple PvP blocks at different locations. During implementation:

1. Identify the authoritative PvP block.
2. Remove or neutralize obsolete conflicting overrides.
3. Keep one compact-tablet block and one wide-display block.
4. Verify the final computed styles at 1280x800, 1100x680, and 1920x1080.

This is important because adding another override without consolidating the old rules can fix one screenshot while breaking another.

## Phase 5: Runtime State and DOM Improvements

### 5.1 Keep mode state synchronized

The current `ViewportManager` already writes `data-app-mode` to `html`. Keep that behavior and call the update after mode switches and when returning to the menu.

### 5.2 Prefer classes over inline layout styles

The quiz panel and difficulty options currently contain inline layout properties such as `min-height`, `display`, padding, and gaps. Move layout-critical values into CSS classes so responsive rules can override them consistently.

Suggested cleanup:

- `.quiz-panel` owns display, overflow, and sizing.
- `.quiz-difficulty-screen` owns selector alignment.
- `.difficulty-options` owns grid/list behavior.
- `.difficulty-btn` owns touch sizing and compact spacing.
- `.quiz-game-screen` owns scroll behavior.

Keep inline styles only for one-off visual colors if necessary.

### 5.3 Add mode-specific layout hooks if needed

If CSS-only selectors are not sufficient, add semantic classes in `switchAppMode()`:

```js
document.body.dataset.appMode = mode;
```

Use one state source consistently; do not maintain separate classes and data attributes unless both are required by existing code.

## Phase 6: Validation Matrix

Do not build an APK until all browser checks pass.

### Viewport checks

- 1280x800 landscape tablet
- 1100x680 landscape tablet
- 1024x600 compact landscape tablet
- 1920x1080 TV-like landscape
- Portrait fallback at 800x1280

### Mode checks

For each mode, verify:

- Header does not overlap active content.
- Footer does not cover controls.
- No horizontal page overflow.
- The active panel stays within the safe viewport.
- All buttons remain reachable and touch-friendly.
- Scrolling occurs inside the intended panel.
- Switching to another mode resets the layout correctly.
- Returning to the menu restores the menu scroll position and shell.

### Quiz checks

- Difficulty options all visible or reachable.
- Active question prompt, action, hint, feedback, and next button remain reachable.
- Practice hint and adaptive feedback do not push the page wider.

### Learn checks

- Lesson panel and teaching clock are both visible in landscape.
- Next, Back, Skip, and lesson action buttons are reachable.
- Long lesson text scrolls inside the lesson area.

### PvP checks

- Both player clocks are fully visible.
- Both submit buttons are reachable.
- The shared HUD does not cover controls.
- The center VS divider stays centered.
- Round and match overlays remain centered inside the safe viewport.

## Phase 7: Release Gate

Only after the browser validation matrix passes:

1. Run `node --check app.js`.
2. Confirm the web source and Android asset copy are synchronized by the release script.
3. Build the signed official APK with the next version code.
4. Verify APK v1, v2, and v3 signatures.
5. Confirm the APK contains `assets/www/index.html`, `assets/www/style.css`, `assets/www/app.js`, and `assets/www/favicon.svg`.
6. Install on the target tablet and manually repeat the four mode checks.

## Recommended Implementation Order

1. Consolidate mode state selectors and shared viewport shell.
2. Fix Quiz and Practice because they share the most visible clipping.
3. Rebuild Learn as a two-region lesson plus teaching-clock layout.
4. Consolidate and resize PvP as a dedicated full-screen board.
5. Validate every mode at tablet and TV-like dimensions.
6. Build the final APK only after all checks pass.

## Definition of Done

- Quiz and Practice screens fit without the clock or difficulty list being cropped.
- Learn mode uses the available horizontal space and shows the teaching clock beside the lesson.
- PvP controls and HUD fit inside the tablet viewport without overlap.
- No mode relies on document-level scrolling in landscape.
- Browser validation passes at all listed viewport sizes.
- APK generation happens only after these checks are complete.