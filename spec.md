# elidi HDA-DCFM Decision Intelligence

## Current State
- UserDashboardPage.tsx handles all 6 tabs: My Mind Twin, Twin Builder, My Versions, Simulation Lab, Growth Path, My Day Journal
- Assessment submit works but does NOT auto-create a named TwinVersion — that's why 'My Versions' shows nothing after taking assessment
- Twin Builder has sliders but lacks onboarding context explaining why the page exists
- Simulation Lab has no explanation of purpose before the scenario input
- Growth Path has Decision Log at the bottom — feels misplaced and only supports text input
- Daily Journal has no explanation of why it exists or what to do first
- Pages are functional but lack contextual onboarding, visual polish, and bells & whistles

## Requested Changes (Diff)

### Add
- After assessment submit, auto-create a TwinVersion named 'Assessment v[N] — [date]' (e.g. 'Assessment v1 — Mar 30') by calling saveTwinVersion with the computed scores. Show it immediately in My Versions
- Option to let user name the twin before or after submitting (show a name input field on the last step of assessment, pre-filled with auto-name)
- Each tab: add a collapsible or inline hero/explainer section at the top (gold-themed banner) explaining: what the page is, why it exists, what to do first
- Twin Builder explainer: 'This is where you craft alternative versions of yourself. Adjust the 6 cognitive dimensions to explore who you could become or simulate a different mindset. Save each version to compare and simulate.'
- Simulation Lab explainer: 'Put your twin versions to the test. Describe a real decision scenario, select one or more saved versions, and see how each version of you would approach and decide.'
- Daily Journal explainer: 'Your daily experiences shape your decision patterns. Use this space to record your day — how you felt, what happened, decisions you made. Over time, this trains your Mind Twin to reflect the real you.'
- Growth Path explainer: 'Track how you grow over time. Compare two twin versions to see your cognitive shift. Set targets and get personalised coaching tips for each dimension.'
- Decision Log: move it out of Growth Path into its own dedicated 7th tab called 'Decision Log' with text/audio/video input support (using MultimodalInputWidget or simple mode picker)
- All pages: more visual polish — gradient cards, animated progress indicators, icons, section dividers, richer empty states
- Assessment: after final submit, show a celebration/result summary screen with radar chart and archetype before collapsing

### Modify
- handleAsmSubmit: after saving assessment, call saveTwinVersion with the assessment scores and auto-name to create a version entry
- TABS array: add 7th tab 'Decision Log' with icon
- Growth Path tab: remove the decision log form from bottom
- Decision log tab: full multimodal input for logging decisions (scenario, outcome, type/audio/video)
- All tab headers: add explainer banners
- Assessment last step: add a 'Name this assessment' text input (pre-filled with auto-name)

### Remove
- Decision log form from Growth Path tab (moved to its own tab)

## Implementation Plan
1. Add twinNameInput state for naming the assessment twin on step 6
2. In handleAsmSubmit: after saveAssessment succeeds, call actor.saveTwinVersion with scores and the chosen name
3. Add post-assessment result summary card (radar + archetype + success message)
4. Add 7th tab 'Decision Log' with its own multimodal input UI
5. Add collapsible explainer banners to each tab (Twin Builder, Simulation Lab, Growth Path, Daily Journal, Decision Log)
6. Remove decision log form from Growth Path, only keep the delta comparison there
7. Visual polish: gradient backgrounds on cards, animated bars, richer empty states, section labels
