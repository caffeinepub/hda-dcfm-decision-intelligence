# elidi — Investor Showcase: 500 Profiles & Full Polish

## Current State
- InvestorShowcasePage.tsx has ~35 DEMO_PROFILES with basic variation
- NovaMind Corp sections (15–22) exist but lack extreme/alarming case highlights
- No red-flag profiles, crisis emotional catches, or extreme bad-decision showcases
- Page works but lacks visual "wow" polish — no special highlight boxes, no extreme case callouts
- Sections 1–33 exist across 5790 lines

## Requested Changes (Diff)

### Add
- Expand DEMO_PROFILES from 35 to 500 entries with maximum variation:
  - All 7 archetypes represented proportionally
  - 40+ countries
  - All input type combinations (text, audio, video, text+audio, text+video, audio+video, all three)
  - Full spread of DFL: Low / Medium / High / Critical
  - Include 50+ "red flag" profiles: extreme EM (6.8–9.0), near-zero IAI (<2.0), near-zero RRM (<1.5), extreme SIS (8+), near-zero EDI (<1.5)
  - Include 30+ "crisis" profiles: people in emotional breakdown patterns (EM=9, IAI=1, RRM=1)
  - Include 20+ "extreme overconfidence" profiles: PM=9+, EM=1, but EDI=2 (paralysis despite confidence)
  - Include 15+ "alarming corporate" profiles with roles like CFO, CEO, Board Member with critically low IAI
  - Each profile must have a `role` field (CEO, Engineer, Teacher, CFO, Entrepreneur, Doctor, etc.)
  - Each profile must have an `alertLevel` field: 'none' | 'caution' | 'alert' | 'critical'
  - Each profile must have a `redFlag` field: string | null (e.g. "Emotional override detected", "Decision paralysis risk", "Groupthink vulnerability critical")
  - Each profile must have a `scenario` field: a real-life decision they faced
  - Each profile must have a `outcome` field: 'Positive' | 'Neutral' | 'Negative' | 'Crisis'
- Add a "Red Flag Alert Board" section: a visually alarming section showing the top 15 most critical profiles with red/amber styling, pulsing borders, crisis-level annotations
- Add "Extreme Case Highlight Boxes": scattered throughout the page, pull-quote styled boxes with a red or amber glow, showing the most shocking response patterns (e.g. "A CFO scoring IAI=1.2 approved a $40M acquisition in under 3 minutes — DCFM flagged this as Emotional Override Pattern")
- Enhance NovaMind sections with:
  - 5 specific extreme employee case studies (with names, roles, DCFM scores, red flags, and what happened)
  - A "Crisis Events Detected" sub-section showing 3 team near-misses caught by elidi
  - A "Before vs After elidi" comparison for 3 employees who improved dramatically
- Add a new "Cognitive Risk Intelligence" section showing a risk matrix (PM vs EM scatter with danger zones highlighted in red)
- Add "Population Bell Curves" section showing distribution of each dimension across all 500 profiles with extreme outliers highlighted
- Add animated counter badges at the top showing: 500 Profiles, 47 Countries, 6 Dimensions, 15 Red Flags Caught

### Modify
- Update all statistics (section 01) to reflect 500 profiles
- Update scatter plot (section 07) to use the full 500 profile dataset
- Update all aggregated stats throughout the page to use 500 profiles
- Existing NovaMind sections: add extreme case highlight boxes inline
- Section 12 (A-Z scenarios): enrich with outcome labels and color-coded severity

### Remove
- Nothing removed

## Implementation Plan
1. Generate 500 DEMO_PROFILES entries in the InvestorShowcasePage.tsx with all new fields (name, country, role, archetype, dfl, pm, em, rrm, iai, sis, edi, inputTypes, alertLevel, redFlag, scenario, outcome)
2. Create a Red Flag Alert Board section (new Section 34) with pulsing red card components
3. Create Extreme Case Highlight Box component used inline throughout the page
4. Update NovaMind sections with 5 deep case studies and crisis events sub-section
5. Add Population Bell Curves section (new Section 35) using recharts BarChart
6. Add Cognitive Risk Intelligence matrix (new Section 36) as a custom SVG scatter plot with danger zone shading
7. Update all aggregate stats/counts throughout the page
8. Ensure all sections have polished gold/green/red visual design consistent with the platform theme
