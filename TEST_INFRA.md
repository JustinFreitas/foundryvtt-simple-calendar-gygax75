# Test Infrastructure Report: simple-calendar V14 E2E Testing

## Overview
This document outlines the end-to-end (E2E) testing infrastructure implemented to verify the compatibility of the Simple Calendar codebase with the Foundry V14 ApplicationV2 ecosystem.

## Target APIs
- `MainApp`: Extends V14 `ApplicationV2` (asserted via `DEFAULT_OPTIONS` and modern actions).
- `ConfigurationApp`: Extends V14 `ApplicationV2` (asserted via `DEFAULT_OPTIONS` and modern actions).
- `NoteSheet`: Extends V14 `JournalEntrySheet` / `DocumentSheetV2` (asserted via prototype checks).
- `DialogV2`: Compliant V14 constructor-based dialog mock with layout-specific classes (`["ose", "dialog"]`) and custom starting window size (`position: { width: 400, height: "auto" }`).

## Test Command
To run all tests including the new E2E tests:
```bash
npm run test
```

To run only the newly added E2E tests:
```bash
npx jest "src/classes/**/*.e2e.test.ts"
```

## Mock Extensions (`__mocks__/application-v2.ts`)
We extended `__mocks__/application-v2.ts` to include:
- `DocumentSheetV2`: Extends `ApplicationV2` with `isEditable` and `submit` properties.
- `JournalEntrySheet`: Extends `DocumentSheetV2` mixed with `HandlebarsApplicationMixin`.
- `DialogV2`: A modern class constructor that records constructor parameters (via `DialogV2.constructorSpy`), contains static methods (`confirm`, `wait`), and supports rendering via a Promise.
