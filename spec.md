# HDA-DCFM Decision Intelligence

## Current State
UserDashboardPage.tsx has a PMT assessment with a submit handler that silently swallows errors (`catch (_) {}`), making the submit button appear to do nothing if an error occurs. The Twin Builder tab also shows a DCFM Decision Force value calculated from default slider values (all 5.0) even before any assessment is taken, which confuses users.

## Requested Changes (Diff)

### Add
- Toast/error notification when submit fails
- A check for proper authentication before submit
- Success feedback after assessment submission

### Modify
- `handleAsmSubmit`: Replace silent catch with visible error feedback; explicitly construct DimensionScores object to ensure proper Candid encoding; add console.error for debugging
- Twin Builder tab: Hide the DCFM Decision Force preview panel when no assessment has been taken (`!latestScores`), showing a prompt to take assessment first instead

### Remove
- Silent error swallowing in handleAsmSubmit

## Implementation Plan
1. In `handleAsmSubmit`, replace `catch (_) {}` with a catch that shows a visible error (alert or toast). Also explicitly construct the scores object as `{ pm: scores.pm, em: scores.em, rrm: scores.rrm, iai: scores.iai, sis: scores.sis, edi: scores.edi }` to ensure clean Candid encoding with no extra fields.
2. Add success feedback after submit (e.g. brief toast or visual indicator).
3. In Twin Builder tab, wrap the Simulation Preview GreenCard in a condition: only show it if `latestScores` exists; otherwise show a simple prompt card saying to take an assessment first.
