# HDA-DCFM Decision Intelligence — Version 12

## Current State
- Navbar has 3 links: About (→ landing), Dimensions (→ landing, no page), How It Works (→ landing, no page)
- App.tsx handles pages: landing, learnmore, assessment, results, report
- Navbar shown only on landing and learnmore pages

## Requested Changes (Diff)

### Add
- DimensionsPage.tsx: Full scientific deep-dive into the 6 HDA-DCFM decision dimensions (Analytical Clarity, Emotional Intelligence, Risk Orientation, Social Influence, Temporal Thinking, Adaptive Flexibility). Content: neuroscience models, psychological theories (Kahneman System 1/2, Damasio Somatic Marker Hypothesis, Prospect Theory, etc.), real-world examples, research stats, modern SVG-based infographics. Sathish Sampath bio/credit featured.
- HowItWorksPage.tsx: Explains the HDA-DCFM methodology — how the assessment works, how scoring is computed, what archetypes mean, the science behind the instrument, the MESMA research foundation, practical use cases. Features step-by-step visual flow, neuroscience backing, methodology infographics, and Sathish attribution.

### Modify
- Navbar.tsx: Rename "About" → "Home"; wire Dimensions → "dimensions" page; wire How It Works → "howitworks" page
- App.tsx: Add "dimensions" and "howitworks" to Page type; render DimensionsPage and HowItWorksPage; show navbar on these pages

### Remove
- Nothing removed

## Implementation Plan
1. Update Navbar to rename About → Home, wire Dimensions and How It Works to correct pages
2. Update App.tsx to include dimensions and howitworks pages and show navbar on them
3. Build DimensionsPage with 6 dimension deep-dives, scientific theories, infographics (SVG-based), stats, examples, Sathish credit
4. Build HowItWorksPage with methodology explanation, scoring science, archetype science, MESMA foundation, step-by-step visual flow, Sathish credit
5. Validate and deploy
