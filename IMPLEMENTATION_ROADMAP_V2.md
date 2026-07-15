# Genius Time Master — Next Implementation Roadmap

## 1. Current game assessment

The current game already has a strong visual identity and a useful foundation:

- Explore Mode with an interactive analog clock, draggable hands, adjustment buttons, reset, random time, and current time.
- Quiz Mode with four difficulty levels, set-the-clock questions, read-the-clock questions, score, streaks, feedback, and a summary screen.
- Same-device horizontal PvP with two players, rounds, target time, timers, scores, streaks, lockouts, replay, and winner screens.
- English and Bahasa Malaysia support.
- Dark/light theme, sound toggle, local progress, trophy case, badges, stars, and celebrations.
- Android WebView packaging with landscape orientation and responsive PvP layout.

The biggest opportunity is to make the game teach more clearly between attempts. At the moment, a child can answer questions and win points, but the game needs a stronger loop of:

```text
Learn → Practise → Receive an explanation → Master a skill → Unlock a challenge
```

The next work should improve learning value before adding many more competitive features.

## 2. Product goals

1. Help children understand why an answer is correct, not only whether it is correct.
2. Make the first five minutes understandable without adult instruction.
3. Give children a pressure-free way to practise.
4. Make progress reflect mastery and improvement, not only speed.
5. Keep PvP fun and fair for children with different skill levels.
6. Make every important interaction comfortable on Android tablets and touchscreens.
7. Preserve the existing bright, friendly, neon-clock visual style.

## 3. Priority roadmap

| Priority | Feature | Value | Effort |
|---|---|---:|---:|
| P0 | Visual explanation after an incorrect answer | Very high | Medium |
| P0 | Pointer-based touch dragging and larger touch targets | Very high | Medium |
| P0 | Complete translation and accessibility audit | High | Medium |
| P1 | Guided Learn Mode | Very high | Medium |
| P1 | Pressure-free Practice Mode | Very high | Medium |
| P1 | Skill-based question bank and mastery tracking | Very high | Large |
| P1 | More reliable tablet layout and safe-area handling | High | Medium |
| P2 | Match the Clock game mode | High | Medium |
| P2 | Daily missions and progression map | High | Medium |
| P2 | Cooperative PvP | High | Large |
| P2 | Custom clock themes and child-friendly rewards | Medium | Medium |
| P3 | Story-based time activities | High | Large |
| P3 | Parent/teacher progress view | High | Large |

## 4. Recommended first sprint

The first sprint should improve the current game without changing its core structure.

### 4.1 Add visual answer explanations

After a wrong Quiz or PvP answer, show a short explanation panel instead of only a failure message.

Example:

> The long hand points to 6, so it means 30 minutes. The short hand is between 3 and 4, so the answer is 3:30 PM.

Implementation:

- Highlight the hour hand in cyan and the minute hand in a contrasting color.
- Highlight the minute number or tick used to calculate the minutes.
- Animate the correct reference position for less than one second.
- Show one sentence of plain language.
- Add a `Try Again` or `Next Question` button.
- Keep the explanation available in both English and Bahasa Malaysia.
- Do not deduct additional points for opening an explanation.

Acceptance criteria:

- Every wrong answer gives a useful reason.
- The explanation identifies both hands.
- The child can continue without returning to the main menu.
- The explanation does not block the next question forever in PvP.

### 4.2 Add a pressure-free Practice Mode

Practice Mode should use the same clock and question systems as Quiz Mode, but remove the pressure:

- No countdown.
- Unlimited attempts.
- Optional hints.
- No negative score.
- Immediate explanation after an incorrect answer.
- A friendly progress counter such as `3 of 5 skills practised`.

This mode is especially important for younger children and players who are still learning the minute hand.

### 4.3 Improve touch interaction

Replace separate mouse and touch handling with Pointer Events:

- `pointerdown`
- `pointermove`
- `pointerup`
- `pointercancel`
- `setPointerCapture()` for the active clock hand

Also:

- Add a larger invisible touch area around each hand.
- Use `touch-action: none` only on the clock interaction area.
- Show a small glow and hand label while dragging.
- Make adjustment buttons at least 44px high where space permits.
- Keep the submit button visible and easy to reach on tablets.

## 5. Learning design features

### 5.1 Guided Learn Mode

Add a `Learn` card to the main menu with a short interactive lesson:

1. The short hand tells the hour.
2. The long hand tells the minutes.
3. Each clock number is five minutes for the minute hand.
4. The hour hand slowly moves between numbers.
5. Special phrases include o'clock, quarter past, half past, and quarter to.
6. AM and PM describe different parts of the day.

Each lesson step should include:

- One animation.
- One spoken or written explanation.
- One tiny interaction.
- A `Next` button.
- A skip option for returning players.

### 5.2 Teach phrases, not only digital numbers

Add a phrase setting to selected questions:

- `3:00` → three o'clock.
- `3:15` → quarter past three.
- `3:30` → half past three.
- `3:45` → quarter to four.
- `3:10` → ten past three.
- `3:50` → ten to four.

Unlock exact phrases only after the child is comfortable with five-minute intervals.

### 5.3 Add practical time questions

After basic clock reading is mastered, add:

- Five minutes after 2:25.
- Fifteen minutes before 6:00.
- What time will it be in 30 minutes?
- Which time comes first?
- How long until bedtime?

Use small daily-life contexts such as breakfast, school, playtime, and bedtime.

## 6. Adaptive question and mastery system

The current difficulty levels should remain, but question generation should become skill-based.

Suggested skills:

- `hour-recognition`
- `minute-hand-counting`
- `quarter-and-half`
- `five-minute-reading`
- `exact-minute-reading`
- `am-pm`
- `digital-to-analog`
- `analog-to-digital`
- `elapsed-time`
- `spoken-time-phrases`

Suggested question model:

```js
{
  id: 'read-five-past',
  skill: 'minute-phrases',
  type: 'read',
  hour: 3,
  minute: 5,
  difficulty: 3,
  target: '3:05 PM'
}
```

Store small local mastery records:

```js
{
  "five-minute-reading": {
    "attempts": 12,
    "correct": 10,
    "streak": 4,
    "lastPractised": "2026-07-12"
  }
}
```

Selection rules:

- Below 60% accuracy: give more simple examples and hints.
- 60–84% accuracy: mix familiar and new questions.
- At least 85% across 10 attempts: show mastery and unlock the next skill.
- Repeat missed concepts after a short delay instead of immediately repeating the same question.

## 7. New game modes

### 7.1 Match the Clock

Give the child an analog clock and four digital answers, or a digital time and four analog clocks. This adds recognition practice without requiring dragging.

### 7.2 Time Sorting

Show three or four times and ask the child to place them in chronological order. Start with whole hours, then five-minute intervals.

### 7.3 Time Bingo

Show a target time and let the child find the matching clock on a board. Use only skills already unlocked.

### 7.4 Daily Mission

Offer one short mission each day, for example:

- Answer five quarter-hour questions.
- Practise the minute hand three times.
- Complete one explanation without using a hint.

Keep missions local and avoid requiring accounts or internet access.

### 7.5 Cooperative PvP

Keep the current Speed Duel, but add a second mode where both players work toward a shared score.

Possible rules:

- Both clocks show related times.
- Players may use a shared hint.
- The team earns stars for accuracy and improvement.
- A wrong answer does not permanently lock out a player.
- The round ends only after both players submit.

This is better for siblings or children with different skill levels.

## 8. PvP improvements

The current horizontal PvP layout is a good foundation. Improve the play flow with:

- A clear `Ready` state for each player before the timer starts.
- A short practice round before the first timed round.
- Accuracy scoring alongside speed scoring.
- A handicap option that gives one player more time or a simpler target.
- A `No Lockout` casual setting.
- A pause/restart confirmation so accidental taps do not end a match.
- A visible round objective at the top of each panel.
- A better tie result that celebrates both players.
- A final summary showing correct answers, hints, speed, and improvement.

Avoid making the fastest player always win. For a learning game, accuracy should be worth more than a one-second advantage.

## 9. UI and visual polish

### 9.1 Make the clock easier to read

- Add an optional minute ring labelled `5, 10, 15 ... 60`.
- Make 12, 3, 6, and 9 visually stronger.
- Keep the hour hand shorter and thicker than the minute hand.
- Add a small `Hour hand` and `Minute hand` teaching legend.
- Add a toggle for a live digital display in Explore and Practice.
- Use a subtle highlight on the active hand during dragging.
- Keep color from being the only difference between hands; use length and thickness too.

### 9.2 Make actions clearer

- Use one primary action per screen.
- Keep `Check Answer` and `Next Question` in a stable location.
- Add a visible `Practice`, `Learn`, and `Challenge` label to explain the modes.
- Show progress such as `Question 3 of 10`.
- Explain the meaning of stars, streaks, and badges the first time they appear.
- Use friendly empty states in the Trophy Case.

### 9.3 Reduce visual overload

The neon glow is appealing, but young children may benefit from an optional calm setting:

- Less glow.
- No screen shake.
- Reduced confetti.
- Softer incorrect sound.
- Respect `prefers-reduced-motion`.

## 10. Accessibility and localization

- Add `role="slider"`, keyboard support, and `aria-valuenow` to clock hands.
- Support arrow keys for moving the selected hand.
- Add `aria-live="polite"` for feedback, scores, and timer state.
- Ensure focus indicators are visible on every button.
- Put every visible string, tooltip, and accessibility label in the translation dictionary.
- Add a development-only check for missing translation keys.
- Verify long Bahasa Malaysia strings do not overflow PvP headers or buttons.
- Keep sound and narration optional.

## 11. Progression and rewards

Replace the feeling of four isolated difficulty buttons with a simple journey:

1. Little Hand Hill — hours.
2. Quarter-Past Park — quarters and halves.
3. Five-Minute Forest — five-minute intervals.
4. Minute Mountain — exact minutes.
5. Time Traveller Trail — AM/PM and elapsed time.

Reward:

- Practice consistency.
- Improvement after mistakes.
- Completing explanations.
- Mastering a skill.
- Helping a teammate in Cooperative PvP.

Unlockable rewards can include clock face colors, hand styles, animal themes, robot themes, stickers, and celebration animations.

The Trophy Case count should always be calculated from the badge data rather than hard-coded.

## 12. Parent and teacher support

Add a local-only progress view behind a child-safe parent gate. Show:

- Total practice time.
- Questions attempted and accuracy.
- Accuracy per skill.
- Most common mistakes.
- Current mastery level.
- Last seven practice sessions.
- Suggested next activity.

Do not collect names, email addresses, location, or analytics by default.

## 13. Technical implementation order

### Step 1 — Stabilize current systems

Files: `app.js`, `index.html`, `style.css`

- Add runtime-safe localStorage parsing.
- Validate translation keys.
- Remove duplicate input paths gradually.
- Add smoke-test hooks or a development diagnostics panel.
- Verify Explore, Quiz, Trophy Case, PvP, theme, sound, language, and reload persistence.

### Step 2 — Extract pure clock logic

Create a `js/` folder gradually:

```text
js/
  app.js
  state/store.js
  clock/clock-model.js
  clock/clock-view.js
  clock/clock-input.js
  quiz/question-bank.js
  quiz/quiz-session.js
  learning/lessons.js
  progression/mastery.js
  ui/i18n.js
  ui/feedback.js
  modes/pvp.js
```

First extract functions that do not access the DOM:

- Normalize time after adding minutes.
- Convert time to hand angles.
- Format 12-hour and 24-hour time.
- Generate unique distractors.
- Calculate elapsed time.
- Calculate mastery.
- Select a question by skill.

### Step 3 — Add the learning loop

Implement in this order:

1. Explanation component.
2. Practice Mode.
3. Learn Mode.
4. Question bank.
5. Skill mastery.
6. Adaptive question selection.

### Step 4 — Add new replayable content

1. Match the Clock.
2. Time Sorting.
3. Daily Mission.
4. Story questions.
5. Cooperative PvP.

### Step 5 — Release quality pass

- Run JavaScript syntax checks.
- Test all modes in English and Bahasa Malaysia.
- Test light/dark theme and sound disabled.
- Test touch dragging on phones and tablets.
- Test horizontal PvP at multiple landscape sizes.
- Test Android back button, rotation, offline startup, and relaunch persistence.
- Ensure APK assets match the browser-tested source files.

## 14. Testing checklist

### Clock math

- Midnight and noon.
- `10:59 → 11:00`.
- `10:00 → 09:59`.
- Hour-hand position at `3:30` and `11:55`.
- AM/PM transitions.

### Quiz

- All four difficulty levels.
- Set-the-clock questions.
- Read-the-clock questions.
- Correct answer.
- Incorrect answer with explanation.
- Hint usage.
- Summary screen.

### PvP

- Both players ready.
- Correct answer.
- Wrong answer and lockout.
- Casual no-lockout mode.
- Timeout and tie.
- Replay.
- Match summary.
- Landscape tablets and small landscape phones.

### Device and accessibility

- Touch drag with a slow and fast finger movement.
- Keyboard hand control.
- Sound disabled.
- Reduced motion.
- English and Bahasa Malaysia.
- Offline Android startup.
- Android back button.

## 15. Definition of done for the next major update

- A first-time child can understand the basic clock through Learn Mode.
- Practice Mode allows mistakes without pressure.
- Every wrong answer explains the hour and minute hands.
- Questions are tagged to skills and progress is tracked locally.
- PvP rewards accuracy as well as speed.
- Touch interactions work reliably on tablets.
- No visible untranslated strings remain.
- No uncaught runtime errors appear during the smoke-test checklist.
- The release build is generated from the exact assets tested in the browser.
