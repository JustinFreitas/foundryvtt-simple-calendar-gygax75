# Test Case Checklist & Status

This document contains a checklist of all 49 E2E test cases across the 4 tiers, verifying their implementation and their behavior on the legacy codebase (which is expected to fail on V14 specific properties).

## Tier 1: Feature Coverage (20 tests)

### Calendar Configurations (configuration-app.e2e.test.ts)
- [ ] **F1-T1-1**: ConfigurationApp correctly initializes with standard settings (checks `DEFAULT_OPTIONS`).
- [ ] **F1-T1-2**: Configuring custom leap year rules updates calendar properties dynamically.
- [ ] **F1-T1-3**: Custom moon configurations (phases, cycle length) correctly map to calendar data.
- [ ] **F1-T1-4**: Redefining months/weekdays list adapts the calendar's structural data.
- [ ] **F1-T1-5**: Setting season colors/icons is preserved in calendar configuration data.

### Notes (note-sheet.e2e.test.ts)
- [ ] **F2-T1-1**: Create a note stub on a selected date and verify it is registered in note manager.
- [ ] **F2-T1-2**: Open NoteSheet and verify standard form fields (title, content, categories) are accessible.
- [ ] **F2-T1-3**: Custom note categories map colors and text styling to note data.
- [ ] **F2-T1-4**: Verify GM-only note visibility restricts access for non-GM users.
- [ ] **F2-T1-5**: Creating a recurring note generates correct recurrence stubs.

### General Layout Options (main-app.e2e.test.ts)
- [ ] **F3-T1-1**: MainApp renders using default layout configurations (checks `DEFAULT_OPTIONS`).
- [ ] **F3-T1-2**: Toggling clock visibility updates UI configuration.
- [ ] **F3-T1-3**: Setting game world time integration (none, mixed, full) behaves according to specs.
- [ ] **F3-T1-4**: Configuring custom date/time formats updates formatted output string representation.
- [ ] **F3-T1-5**: Setting classic/dark/parchment UI themes updates theme configuration.

### Date Selectors (date-selector.e2e.test.ts)
- [ ] **F4-T1-1**: Initialize DateSelector with a specific starting date.
- [ ] **F4-T1-2**: Selecting a new date in DateSelector triggers callbacks with expected arguments.
- [ ] **F4-T1-3**: Show time controls inside DateSelector and check selected time value.
- [ ] **F4-T1-4**: Select range of dates using multi-select configuration.
- [ ] **F4-T1-5**: Verify DateSelector functions correctly when rendered as dialog or inline.

---

## Tier 2: Boundary & Corner Cases (20 tests)

### Calendar Configurations (configuration-app.e2e.test.ts)
- [ ] **F1-T2-1**: ConfigurationApp handles empty months list or zero-day month configurations gracefully.
- [ ] **F1-T2-2**: Leap year rules configuration handles edge rules (e.g., custom rule with mod 0 or negative values) cleanly.
- [ ] **F1-T2-3**: Setting moon cycle length to 0 or negative defaults or falls back without infinite loops.
- [ ] **F1-T2-4**: Month/weekday names exceeding 100 characters are handled or truncated.
- [ ] **F1-T2-5**: Configuring overlapping season ranges resolves boundaries without errors.

### Notes (note-sheet.e2e.test.ts)
- [ ] **F2-T2-1**: Attempting to create a note on a non-existent day (e.g., 31st of February) is rejected or resolved.
- [ ] **F2-T2-2**: Note sheet accepts extremely long content and HTML injection safely.
- [ ] **F2-T2-3**: Setting a repeating note interval to 0 or negative is rejected or defaulted.
- [ ] **F2-T2-4**: Note referencing a deleted category resolves to default category gracefully.
- [ ] **F2-T2-5**: Requesting NoteSheet for a deleted JournalEntry does not crash.

### General Layout Options (main-app.e2e.test.ts)
- [ ] **F3-T2-1**: Malformed date/time format string defaults to ISO or standard format.
- [ ] **F3-T2-2**: Setting clock update frequency to 0 or negative defaults to standard (e.g., 1 second).
- [ ] **F3-T2-3**: Handling MainApp layout rendering with zero dimensions doesn't throw.
- [ ] **F3-T2-4**: Incrementing world time by huge delta values checks integer/time bounds.
- [ ] **F3-T2-5**: Rapid clock pause/resume state changes does not trigger race conditions.

### Date Selectors (date-selector.e2e.test.ts)
- [ ] **F4-T2-1**: Inputting non-numeric/empty values into DateSelector inputs defaults gracefully.
- [ ] **F4-T2-2**: In range selectors, choosing end date prior to start date is automatically corrected or validation error is shown.
- [ ] **F4-T2-3**: DateSelector handles BCE/negative years.
- [ ] **F4-T2-4**: DateSelector correctly navigates Feb 29 in leap years and adjusts when year is changed to non-leap year.
- [ ] **F4-T2-5**: Rapidly updating selector values handles asynchronous render queue without conflicts.

---

## Tier 3: Cross-Feature Combinations (Pairwise) (4 tests)

- [ ] **X-3-1** (configuration-app.e2e.test.ts): Calendar Configurations + Date Selectors (Changing months/weekdays in config updates selectors' active ranges and names).
- [ ] **X-3-2** (configuration-app.e2e.test.ts): Calendar Configurations + Notes (Adjusting leap year rule / year zero dynamically shifts repeating note dates).
- [ ] **X-3-3** (note-sheet.e2e.test.ts): Notes + Date Selectors (NoteSheet uses DateSelector to bind or update its target date, validating cross-module integration).
- [ ] **X-3-4** (date-selector.e2e.test.ts): General Layout + Date Selectors (Layout theme/formatting modifications apply formatting directly to DateSelector values).

---

## Tier 4: Real-World Application Scenarios (5 tests)

- [ ] **App-4-1** (main-app.e2e.test.ts): Custom fantasy calendar setup: GM configures 30-day month, creates repeating GM-only notes on every 5th day, fast-forwards game world time via MainApp, causing correct note triggers.
- [ ] **App-4-2** (main-app.e2e.test.ts): Player flow: Player opens MainApp, uses DateSelector to find a past date, creates personal note, edits note via NoteSheet while GM simultaneously updates calendar configuration.
- [ ] **App-4-3** (configuration-app.e2e.test.ts): Category/styling update: GM edits note category colors in ConfigurationApp, verifies that NoteSheet and MainApp reflect updated CSS styling and permissions.
- [ ] **App-4-4** (configuration-app.e2e.test.ts): Predefined calendar swap: System switches from Gregorian to Dark Sun predefined calendar system, verifying that dates, notes, and active selectors migrate.
- [ ] **App-4-5** (main-app.e2e.test.ts): DialogV2 sizing and timing: GM opens DialogV2 configuration with explicit sizes and OSE styles, updates clock pause integration, and checks that MainApp clock ticks in sync with game world time.
