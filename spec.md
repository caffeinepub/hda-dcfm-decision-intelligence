# elidi — Amazing Visualization Enhancement

## Current State
- Landing page has a hero section with a static SVG radar chart preview and hexagon accents
- Investor Showcase (InvestorShowcasePage.tsx) has 22 sections with charts via Recharts (bar, scatter, pie, line, radar), an animated SVG brain in section 19, and a comprehensive org/team demo
- No animated brain or neural visualization exists on the landing page

## Requested Changes (Diff)

### Add
1. **Landing Page — Animated Neural Brain Section**: A new full-width section between the Radar Chart Preview and the Bio section. Features a large, animated SVG brain with pulsing neural pathways, synapse dots that fire in sequence, and 6 glowing dimension labels (PM, EM, RRM, IAI, SIS, EDI) connected to brain regions. Dark background with forest green/gold palette.

2. **Landing Page — DCFM Field Visualization**: A dynamic, animated "cognitive field" visualization in the hero — floating particles connected by lines (like a force-directed graph) that represent decision signals converging, rendered in canvas or SVG with requestAnimationFrame.

3. **Landing Page — Live Stats Ticker**: A row of animated counters showing platform stats (35+ Profiles Analyzed, 6 Dimensions, 10 Archetypes, 98% Accuracy) that count up when they scroll into view.

4. **Investor Showcase — Neural Activation Map (new section 23)**: Interactive SVG brain where hovering over each lobe highlights which DCFM dimension it maps to with animated pulse rings. Shows current activation levels from the demo cohort average.

5. **Investor Showcase — Decision Timeline River (new section 24)**: A flowing "river" visualization where each profile's decision journey is a colored stream, showing how decisions evolved over time. Uses animated SVG paths.

6. **Investor Showcase — Cognitive Fingerprint Gallery (new section 25)**: A grid of 12 mini radar charts (unique fingerprints) showing diverse profile snapshots — each animated with a draw-in effect. Demonstrates the uniqueness of each Mind Twin.

7. **Investor Showcase — 3D-style Dimension Force Field (new section 26)**: An animated hexagonal network visualization showing how the 6 dimensions interact with each other — edges thickness represents correlation strength, nodes pulse based on cohort average scores.

8. **Investor Showcase — Real-time Decision Confidence Meter (new section 27)**: An animated arc/gauge showing the cohort's average Decision Force Level, with dynamic needle, color zones (red/amber/green), and a real-time fluctuation animation.

### Modify
- Hero section right column: Replace static SVG dashboard mockup with the animated DCFM particle field (canvas-based)
- Section 19 animated brain in Investor Showcase: Enhance with clickable lobes that show dimension details

### Remove
- Nothing removed

## Implementation Plan
1. Add `AnimatedBrainSection` component to LandingPage — large SVG with CSS/JS animations, 6 dimension connection points, pulsing synapses
2. Add `DCFMParticleField` canvas component for hero right column animation 
3. Add animated stats counters row to landing page
4. Add 5 new sections (23–27) to InvestorShowcasePage
5. All animations must use `motion/react` (already installed) or pure CSS/SVG animations — NO new animation libraries
6. Keep forest green (#1B4332 / #2D6A4F) and gold (#C8A24A) color palette throughout
