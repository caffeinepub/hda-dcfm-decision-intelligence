# HDA-DCFM Decision Intelligence — My Decision Twin Multimodal Upgrade

## Current State
- PMT dashboard exists with 5 tabs: My Mind Twin, Twin Builder, My Versions, Simulation Lab, Growth Path
- Assessment uses 36 questions with 1–7 scale only
- No audio/video input capability
- No personal journaling feature
- Questions are abstract/vague HDA-DCFM scale questions
- Responses stored as `[Int]` (1-7 scale values only)
- Backend: `submitRegisteredAssessment([Int], DimensionScores, archetype, decisionForceLevel)` only
- No blob-storage, no http-outcalls

## Requested Changes (Diff)

### Add
- **Multimodal input widget** per question: user picks Scale (1–7), Text box, Audio (≤1 min), or Video (≤1 min). Video default OFF, encouraged with note about richer data.
- **New personal question bank** — 60+ personal, real-life, scenario-based questions per dimension (6 dims × 10+ questions). Randomly draw 6 per dimension each assessment. Questions are personal, skip-friendly for irrelevant contexts (e.g. business questions if user is not in business — shown with "Not applicable? Skip it" option).
- **"Tell Me About My Day" journal tab** — record audio or video up to 3 min. Each entry auto-timestamped and listed in reverse chronological feed. No naming required; auto-title from timestamp. User can rename inline. Unlimited entries per day, unlimited total.
- **AI analysis** — when text transcript is available (via browser SpeechRecognition or user typed text), call OpenAI GPT via HTTP outcalls to produce sentiment/theme tags and DCFM dimension signals. Results stored per entry and used to update twin training.
- **Blob storage** for audio/video files — frontend uploads, gets URL, stores URL in backend alongside transcript.
- Backend: `JournalEntry` type with id, userId, title, entryType, blobUrl, transcript, aiAnalysis, dimensionSignals, timestamp.
- Backend: `saveJournalEntry`, `getUserJournalEntries`, `updateJournalEntryTitle`, `deleteJournalEntry`
- Backend: `submitAssessmentWithText(responses: [Int], textResponses: [Text], dimensionScores, archetype, decisionForceLevel)` to store per-question text alongside scale
- Backend: `analyzeJournalEntry(id: Text)` using http-outcalls → OpenAI API → returns tags + dimension signals
- New 6th tab in dashboard: **My Day Journal**

### Modify
- Assessment flow in UserDashboardPage: replace simple scale-only input with `MultimodalInputWidget` per question
- Question bank replaced with new personal, scenario-based questions (still 36 active, drawn from pool of 60+)
- `submitRegisteredAssessment` extended or supplemented with `submitAssessmentWithText` to carry text responses
- Dimension analysis for registered users incorporates journal entry signals over time

### Remove
- Nothing removed — all existing features preserved

## Implementation Plan
1. Select components: blob-storage, http-outcalls, camera
2. Update backend main.mo:
   - Add JournalEntry type and state map
   - Add saveJournalEntry, getUserJournalEntries, updateJournalEntryTitle, deleteJournalEntry
   - Add submitAssessmentWithText (stores [Int] + [Text] responses)
   - Add analyzeJournalEntry using http-outcalls to OpenAI
   - Update backend.d.ts to reflect new APIs
3. Frontend:
   - Create `MultimodalInputWidget` component with 4 modes (scale/text/audio/video)
   - MediaRecorder API for audio/video capture with countdown timer
   - Web Speech API for real-time transcript during recording
   - Replace assessment questions with new personal question bank (60+ questions, 6 drawn randomly per dimension)
   - Add "Not applicable / Skip" option per question with dimension-aware skip handling
   - Add "My Day Journal" tab to UserDashboardPage
   - Journal tab: record button (audio/video), 3-min countdown, entry feed with timestamps, rename inline
   - Show AI analysis tags on journal entries (async, shown when ready)
   - Blob storage integration: upload audio/video blob → get URL → store in backend
