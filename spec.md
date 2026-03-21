# HDA-DCFM Decision Intelligence — elidi

## Current State
- MyDecisionTwinPage.tsx: public landing page with hero, 3-step guide, 4 feature cards, CTA
- UserDashboardPage.tsx: 5-tab dashboard (My Mind Twin, Twin Builder, My Versions, Simulation Lab, Growth Path)
- Assessment inside dashboard: shows dimension name but no scale legend and no dimension description
- Admin button: already gated by `isAdmin` check — only admins see it
- Post-login flow: MyDecisionTwin landing shows one 'Go to Dashboard' button if authenticated

## Requested Changes (Diff)

### Add
- Scale legend (1 = Strongly Disagree → 7 = Strongly Agree) above each assessment question set
- Dimension description/context paragraph before questions for each of the 6 dimensions
- FAQ/info section on MyDecisionTwinPage covering: training frequency, whether questions are same or varied, what happens to data
- Expanded tab descriptions on MyDecisionTwinPage (one card per tab with what it is, what you do, what you get)
- Multiple 'Go to Dashboard' CTA buttons placed throughout MyDecisionTwinPage for authenticated users

### Modify
- MyDecisionTwinPage: richer, more educational post-login guidance; clearer tab-by-tab breakdown
- Assessment step in dashboard: add scale legend row + dimension description before questions

### Remove
- Nothing removed

## Implementation Plan
1. Add `DIMENSION_DESCRIPTIONS` map to scoring.ts (one paragraph per dimension explaining what it measures)
2. In UserDashboardPage assessment section: render dimension description and scale legend (Strongly Disagree 1 ... 7 Strongly Agree) above the question list
3. Expand MyDecisionTwinPage: detailed tab cards (5 tabs with icon, name, what you do, what you get), FAQ accordion (training frequency, question variety, data privacy), multiple 'Go to Dashboard' CTAs at hero, after features, at bottom
