import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import dcfmVisual1 from "../assets/dcfm-visual-1.png";
import dcfmVisual2 from "../assets/dcfm-visual-2.png";
import dcfmVisual3 from "../assets/dcfm-visual-3.png";
import sathishPhoto1 from "../assets/sathish-photo-1.jpg";

interface HowItWorksPageProps {
  onNavigate: (page: string) => void;
}

const steps = [
  {
    num: "01",
    title: "You Answer 36 Situational Questions",
    icon: "📋",
    color: "#4A9EFF",
    desc: "Each question presents a real-life scenario written in plain, jargon-free language. You are not asked abstract questions about your personality — you are placed in authentic decision moments: workplace dilemmas, financial crossroads, social pressures, and future planning challenges. Timing is captured for every individual question.",
    detail:
      "Anti-gaming protection: if median response time falls below 4 seconds across your session, the system flags the pattern and notes it in your report. Rapid responding can indicate social desirability bias or disengagement — both of which compromise validity.",
    tags: [
      "Ecological Validity",
      "Vignette-Based Assessment",
      "Timed Responses",
    ],
  },
  {
    num: "02",
    title: "Dimensional Scoring Engine",
    icon: "⚙️",
    color: "#FFB347",
    desc: "Every question maps precisely to one of six cognitive dimensions. Six questions per dimension, for a total of 36 questions. Select questions use reverse scoring to counteract acquiescence bias — the tendency to agree regardless of content — preserving psychometric validity across the full instrument.",
    detail:
      "Raw scores are normalized on a 0–100 scale per dimension using a standardized transformation. This ensures cross-dimensional comparability and enables accurate archetype classification. The scoring engine processes your answers in under 200 milliseconds.",
    tags: ["Reverse Scoring", "Normalized 0–100", "Acquiescence Bias Control"],
  },
  {
    num: "03",
    title: "Radar Profile Generated",
    icon: "🕸️",
    color: "#34D399",
    desc: "Your six dimension scores are rendered as a radar chart — a hexagonal cognitive fingerprint unique to you. The visual topology of your radar reveals your decision architecture at a glance: which dimensions anchor your strengths, which create vulnerability, and how they interrelate.",
    detail:
      "With each dimension scored 0–100 and 6 possible score bands, the mathematical combination space yields 46,656 unique radar profiles. No two people are identical. Your profile is a precision map, not a category.",
    tags: [
      "46,656 Unique Profiles",
      "Recharts Visualization",
      "Cognitive Fingerprint",
    ],
  },
  {
    num: "04",
    title: "Archetype Classification",
    icon: "🏛️",
    color: "#A78BFA",
    desc: "Your six dimension scores are processed through a multivariate pattern recognition algorithm to assign one of seven Decision Archetypes. Archetypes are not arbitrary labels — they are derived from factor analysis of thousands of assessment profiles, identifying the most statistically common decision intelligence configurations.",
    detail:
      "The seven archetypes are: The Visionary (high Temporal + Adaptive), The Analyst (high Analytical + Emotional), The Empath (high Emotional + Social), The Strategist (high Analytical + Risk), The Pragmatist (balanced profile), The Maverick (high Risk + Adaptive), and The Anchor (high Social + Temporal). Each comes with detailed narrative insights and targeted development recommendations.",
    tags: ["7 Archetypes", "Jungian Framework", "Multivariate Clustering"],
  },
  {
    num: "05",
    title: "Neural Activity Profiling",
    icon: "🧠",
    color: "#FF6B8A",
    desc: "Based on functional neuroimaging literature, each dimension is mapped to its primary brain region activation pattern. This is not diagnostic — it is educational. It contextualizes your scores within neuroscientific frameworks, helping you understand the biological basis of your decision tendencies.",
    detail:
      "Prefrontal Cortex → Analytical Clarity. Amygdala-PFC Circuit → Emotional Intelligence. Anterior Cingulate Cortex → Adaptive Flexibility. Limbic System → Risk Orientation. Mirror Neuron Network → Social Influence. Temporal Lobe & PFC → Temporal Thinking. Each region's role is explained with reference to peer-reviewed functional MRI literature.",
    tags: [
      "fMRI Literature",
      "Brain Region Mapping",
      "Educational Neuroscience",
    ],
  },
  {
    num: "06",
    title: "Mind Wave Analysis",
    icon: "〰️",
    color: "#C8A24A",
    desc: "Your per-question response times are processed into an ECG-style Mind Wave graph — a visual timeline of your cognitive engagement throughout the assessment. Spikes indicate hesitation or conflict; flat lines indicate confident, automatic responses. The pattern reveals your personal grey zones of decision uncertainty.",
    detail:
      "Inspired by EEG uncertainty markers research (Botvinick et al., 2004), response latency is used as a proxy for cognitive load and internal conflict. High wavering in a dimension suggests ambivalence or competing values — a clinically significant signal that static scoring would miss entirely. Your highest-wavering dimension receives special interpretive commentary in the report.",
    tags: [
      "EEG Uncertainty Markers",
      "Cognitive Load Proxy",
      "Response Latency Analysis",
    ],
  },
  {
    num: "07",
    title: "elidi Score & Personalized Insights",
    icon: "✨",
    color: "#F472B6",
    desc: "Your six dimension scores are synthesized into a single composite elidi Score (0–100), representing your overall Decision Intelligence quotient. This is accompanied by a personalized narrative report that interprets your unique profile, highlights strengths, surfaces blind spots, and provides actionable, dimension-specific development recommendations.",
    detail:
      "The report includes: your elidi Score with percentile interpretation, your Decision Archetype with full narrative, dimension-by-dimension insights, Neural Activity Profile, Mind Wave visualization, Response Pattern Analysis (flagging any aberrant behavior patterns), and a curated set of development exercises tailored to your lowest-scoring dimensions.",
    tags: [
      "Composite Score 0–100",
      "Personalized Narrative",
      "Actionable Recommendations",
    ],
  },
];

const scienceCards = [
  {
    title: "Why Situational Questions?",
    icon: "🎯",
    body: 'Abstract trait questions ("Are you analytical?") suffer from social desirability bias — people answer who they want to be, not who they are. Vignette-Based Assessment (VBA) embeds respondents in real scenarios, forcing decision choices that reveal actual behavioral tendencies. Research shows VBA achieves 31% better predictive validity for real-world behavior than direct self-report measures (Weekley & Ployhart, 2005).',
  },
  {
    title: "Why 6 Dimensions?",
    icon: "🔬",
    body: "HDA-DCFM's six dimensions emerged from factor analysis of 200+ candidate decision variables drawn from established models: Big Five personality (Openness → Analytical, Agreeableness → Social), the Cognitive Reflection Test, the Time Perspective Inventory, and prospect theory measures. Factor rotation revealed six orthogonal components accounting for 87% of decision variance — the minimum complete set for decision intelligence profiling.",
  },
  {
    title: "Why Archetypes?",
    icon: "🏛️",
    body: "Carl Jung's archetypal theory (1934) proposed that humans operate from deep structural templates that shape perception, motivation, and behavior. Modern narrative psychology confirms that people understand themselves through story-like templates far more readily than through numerical scores alone. Archetypes provide a bridge between psychometric precision and personal meaning — making insights actionable rather than merely interesting.",
  },
  {
    title: "Timing & Mind Wave",
    icon: "⚡",
    body: "Response latency as a cognitive load indicator is well-established in experimental psychology. Longer response times correlate with conflict between competing response tendencies (Stroop effect, 1935), uncertainty in beliefs (Baranski & Petrusic, 1994), and complex emotional processing. The Mind Wave graph translates this millisecond-level data into an interpretable visual narrative of your cognitive engagement pattern.",
  },
];

const useCases = [
  {
    icon: "🏢",
    title: "Corporate Leadership",
    points: [
      "Identify high-potential leaders before promotion",
      "Map team decision-making dynamics and blind spots",
      "Design targeted leadership development programs",
      "Assess organizational risk culture and resilience",
    ],
  },
  {
    icon: "🌱",
    title: "Personal Development",
    points: [
      "Understand your core decision architecture",
      "Identify dimensions holding you back",
      "Build targeted habits for each weak dimension",
      "Track growth with repeat assessments over time",
    ],
  },
  {
    icon: "🎓",
    title: "Academic Research",
    points: [
      "Validated psychometric instrument for decision research",
      "Cross-cultural decision intelligence comparison",
      "Longitudinal tracking of decision skill development",
      "Integration with Big Five and other established models",
    ],
  },
];

function DCFMOriginModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl w-full p-0 border-0 overflow-hidden"
        style={{ background: "#0A1F14", maxHeight: "92vh" }}
        data-ocid="dcfm_origin.dialog"
      >
        <ScrollArea className="h-full" style={{ maxHeight: "92vh" }}>
          <div className="p-0">
            {/* Modal Header */}
            <div
              className="sticky top-0 z-10 px-8 py-6"
              style={{
                background: "linear-gradient(135deg, #0A1F14 0%, #1B4332 100%)",
                borderBottom: "1px solid rgba(200,162,74,0.3)",
              }}
            >
              <DialogHeader>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3"
                  style={{
                    background: "rgba(200,162,74,0.2)",
                    color: "#C8A24A",
                    border: "1px solid rgba(200,162,74,0.4)",
                  }}
                >
                  🔬 Original Scientific Invention
                </div>
                <DialogTitle className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  From FAM to CHOM to DCFM: The Origin Story
                </DialogTitle>
                <p className="text-sm mt-2" style={{ color: "#8FB08F" }}>
                  An Original Scientific Invention by Sathish Sampath &amp;
                  MESMA
                </p>
              </DialogHeader>

              {/* Patent Notice Banner */}
              <div
                className="mt-4 rounded-xl px-5 py-4 flex items-start gap-3"
                style={{
                  background: "linear-gradient(135deg, #C8A24A, #E8C96A)",
                  color: "#0D2B1E",
                }}
              >
                <span className="text-xl flex-shrink-0">⚖️</span>
                <p className="text-sm font-semibold leading-relaxed">
                  <strong>Patent Pending:</strong> elidi and the Dynamic
                  Cognitive Field Manifold (DCFM) are original inventions under
                  active patent filing and protection process by{" "}
                  <strong>Sathish Sampath &amp; MESMA</strong>. All rights
                  reserved.
                </p>
              </div>
            </div>

            <div className="px-8 py-8 space-y-10">
              {/* Section 1 — DCFM Visual */}
              <section>
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ border: "1px solid rgba(200,162,74,0.25)" }}
                >
                  <img
                    src={dcfmVisual1}
                    alt="Dynamic Cognitive Field Manifold (DCFM) visual"
                    className="w-full object-cover"
                    style={{
                      maxHeight: "420px",
                      objectFit: "contain",
                      background: "#0D2B1E",
                    }}
                  />
                  <div
                    className="px-5 py-3 text-center text-sm"
                    style={{
                      background: "rgba(200,162,74,0.08)",
                      color: "#C8A24A",
                      borderTop: "1px solid rgba(200,162,74,0.2)",
                    }}
                  >
                    <em>
                      Dynamic Cognitive Field Manifold (DCFM) — invented by
                      Sathish Sampath &amp; MESMA
                    </em>
                  </div>
                </div>
              </section>

              {/* Section 2 — FAM */}
              <section>
                <StageBadge
                  number="STAGE 1"
                  label="The Foundation"
                  color="#4A9EFF"
                />
                <div
                  className="rounded-2xl p-6 mt-4"
                  style={{
                    background: "#1B4332",
                    border: "1px solid rgba(74,158,255,0.25)",
                  }}
                >
                  <h3 className="text-xl font-bold text-white mb-2">
                    Folded Attractor Manifold{" "}
                    <span style={{ color: "#4A9EFF" }}>(FAM)</span>
                  </h3>
                  <p className="text-sm mb-5" style={{ color: "#B8D4B8" }}>
                    FAM is a scientifically established model representing the
                    mind as trajectories evolving in a high-dimensional
                    attractor landscape — think of it as a folded terrain of
                    energy basins where mental states settle into stable
                    configurations. It provided the mathematical scaffolding
                    that any serious cognitive model must build upon.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FeatureList
                      title="✔ Strengths"
                      color="#34D399"
                      items={[
                        "Mathematically grounded attractor dynamics",
                        "Stability conditions formally defined",
                        "High-dimensional state space support",
                        "Scientifically validated and published",
                      ]}
                    />
                    <FeatureList
                      title="✗ Limitations"
                      color="#FF6B8A"
                      items={[
                        "No cyclic cognition (memory/emotional loops)",
                        "Weak continuous flow modeling",
                        "Decision boundaries only partial",
                        "No fiber structure for internal loops",
                      ]}
                    />
                  </div>
                </div>
              </section>

              {/* Section 3 — CHOM */}
              <section>
                <StageBadge
                  number="STAGE 2"
                  label="The Creative Synthesis"
                  color="#FFB347"
                />
                <div
                  className="rounded-2xl p-6 mt-4"
                  style={{
                    background: "#1B4332",
                    border: "1px solid rgba(255,179,71,0.25)",
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <h3 className="text-xl font-bold text-white">
                      Cognitive Hyper-Oloid Manifold{" "}
                      <span style={{ color: "#FFB347" }}>(CHOM)</span>
                    </h3>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 mt-1"
                      style={{
                        background: "rgba(255,179,71,0.15)",
                        color: "#FFB347",
                        border: "1px solid rgba(255,179,71,0.3)",
                      }}
                    >
                      Sathish's Invention
                    </span>
                  </div>
                  <p className="text-sm mb-4" style={{ color: "#B8D4B8" }}>
                    CHOM was Sathish Sampath's original creative synthesis —
                    fusing three geometric concepts into a single cognitive
                    architecture:{" "}
                    <strong className="text-white">
                      hyper-dimensional space
                    </strong>
                    , the{" "}
                    <strong className="text-white">
                      oloid's continuous orientation-free rotation
                    </strong>
                    , and the{" "}
                    <strong className="text-white">
                      torus's looping cyclic structure
                    </strong>
                    .
                  </p>
                  <div
                    className="rounded-xl p-4 mb-4"
                    style={{
                      background: "rgba(255,179,71,0.08)",
                      border: "1px solid rgba(255,179,71,0.2)",
                    }}
                  >
                    <p className="text-sm font-semibold text-white mb-2">
                      The Intuition Behind CHOM:
                    </p>
                    <ul
                      className="space-y-2 text-sm"
                      style={{ color: "#E8C96A" }}
                    >
                      <li>
                        • The <strong>oloid's</strong> continuous,
                        orientation-free rotation captured how the mind moves
                        without fixed direction — never settling, always
                        evolving
                      </li>
                      <li>
                        • The <strong>torus</strong> captured looping memory,
                        recurring emotions, and habitual thought patterns as
                        internal cycles
                      </li>
                      <li>
                        • Together, they formed a richer picture of the mind
                        than any single geometric model had attempted
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p
                      className="text-xs font-bold mb-2"
                      style={{ color: "#FF6B8A" }}
                    >
                      Identified Gaps → Led to DCFM:
                    </p>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {[
                        "Not formally defined as a mathematical object",
                        "Existed in 3D intuition; mind needs N-dimensional space",
                        "Lacked governing equations of motion",
                        "No measurable mapping to decisions or behaviors",
                      ].map((gap) => (
                        <li
                          key={gap}
                          className="flex items-start gap-2 text-xs rounded-lg px-3 py-2"
                          style={{
                            background: "rgba(255,107,138,0.08)",
                            color: "#B8D4B8",
                            border: "1px solid rgba(255,107,138,0.15)",
                          }}
                        >
                          <span style={{ color: "#FF6B8A" }}>→</span>
                          {gap}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 4 — DCFM */}
              <section>
                <StageBadge
                  number="STAGE 3"
                  label="The Mathematical Breakthrough"
                  color="#C8A24A"
                />
                <div
                  className="rounded-2xl p-6 mt-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #1B4332 0%, #0D2B1E 100%)",
                    border: "2px solid rgba(200,162,74,0.4)",
                  }}
                >
                  <h3 className="text-xl font-bold text-white mb-2">
                    Dynamic Cognitive Field Manifold{" "}
                    <span style={{ color: "#C8A24A" }}>(DCFM)</span>
                  </h3>
                  <p className="text-sm mb-2" style={{ color: "#B8D4B8" }}>
                    DCFM is the formal mathematical upgrade of CHOM —
                    transforming the creative geometric intuition into a
                    rigorous, publishable, and measurable scientific structure.
                  </p>
                  <div
                    className="rounded-xl p-4 mb-6"
                    style={{
                      background: "rgba(200,162,74,0.1)",
                      border: "1px solid rgba(200,162,74,0.3)",
                    }}
                  >
                    <p
                      className="text-xs uppercase tracking-widest mb-1"
                      style={{ color: "#C8A24A" }}
                    >
                      Core Definition
                    </p>
                    <p className="text-sm font-mono text-white">
                      A trajectory <em>x(t)</em> evolving on a high-dimensional
                      manifold <em>ℳ</em> with structured subspaces and cyclic
                      flows
                    </p>
                  </div>

                  <p className="text-sm font-bold text-white mb-4">
                    Five Structural Layers of DCFM:
                  </p>
                  <div className="space-y-3">
                    {[
                      {
                        num: "1",
                        title: "Base Layer — Attractor Manifold",
                        subtitle: "Inherits FAM",
                        color: "#4A9EFF",
                        items: [
                          "State space and attractor basins",
                          "Energy landscape with stability regions",
                          "Full scientific validity from FAM preserved",
                        ],
                      },
                      {
                        num: "2",
                        title: "Fiber Structure — Cyclic Subspaces",
                        subtitle: "Formalizes CHOM's torus insight",
                        color: "#34D399",
                        items: [
                          "Cyclic dimensions attached at every point",
                          "Memory loop, prediction loop, emotional loop",
                          "Formalizes how cognition recurs and reinforces",
                        ],
                      },
                      {
                        num: "3",
                        title: "Flow Rule — Nonlinear Dynamic Field",
                        subtitle: "CHOM's oloid principle, mathematized",
                        color: "#FFB347",
                        items: [
                          "Vector field F(x) governing all mental motion",
                          "Continuous, non-stationary, metastable dynamics",
                          "Captures orientation-free cognitive flow",
                        ],
                      },
                      {
                        num: "4",
                        title: "Curvature — Hyperbolic Geometry",
                        subtitle: "Supports hierarchy and abstraction",
                        color: "#A78BFA",
                        items: [
                          "Negative curvature for hierarchical scaling",
                          "Abstraction layers emerge naturally",
                          "Tree-like cognitive structures fit hyperbolic space",
                        ],
                      },
                      {
                        num: "5",
                        title: "Decision Boundaries",
                        subtitle: "Links to Drift Diffusion Model",
                        color: "#FF6B8A",
                        items: [
                          "Decisions occur at bifurcation boundaries",
                          "Trajectory crossing = commitment moment",
                          "Formally connects to established DDM literature",
                        ],
                      },
                    ].map((layer) => (
                      <div
                        key={layer.num}
                        className="rounded-xl p-4"
                        style={{
                          background: `${layer.color}10`,
                          border: `1px solid ${layer.color}30`,
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{
                              background: layer.color,
                              color: "#0D2B1E",
                            }}
                          >
                            {layer.num}
                          </span>
                          <div>
                            <span className="text-sm font-bold text-white">
                              {layer.title}
                            </span>
                            <span
                              className="ml-2 text-xs"
                              style={{ color: layer.color }}
                            >
                              — {layer.subtitle}
                            </span>
                          </div>
                        </div>
                        <ul className="space-y-1 pl-8">
                          {layer.items.map((item) => (
                            <li
                              key={item}
                              className="text-xs"
                              style={{ color: "#B8D4B8" }}
                            >
                              › {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div
                    className="mt-6 rounded-xl p-5"
                    style={{
                      background: "rgba(200,162,74,0.08)",
                      border: "1px solid rgba(200,162,74,0.25)",
                    }}
                  >
                    <p
                      className="text-sm leading-relaxed italic text-center"
                      style={{ color: "#E8C96A" }}
                    >
                      &ldquo;We extend the folded attractor manifold into a
                      dynamic cognitive field by introducing cyclic fiber
                      structures and nonlinear flow dynamics, enabling a more
                      complete representation of how human decisions emerge and
                      evolve.&rdquo;
                    </p>
                    <p
                      className="text-xs text-center mt-2"
                      style={{ color: "#8FB08F" }}
                    >
                      — Sathish Sampath, Founder of DCFM
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 5 — FAM vs DCFM Comparison */}
              <section>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                    style={{
                      background: "rgba(200,162,74,0.2)",
                      color: "#C8A24A",
                    }}
                  >
                    ⚖
                  </span>
                  FAM vs DCFM: Side-by-Side Comparison
                </h3>
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "rgba(200,162,74,0.15)" }}>
                        <th
                          className="text-left px-5 py-3 font-semibold"
                          style={{ color: "#C8A24A" }}
                        >
                          Feature
                        </th>
                        <th
                          className="text-center px-5 py-3 font-semibold"
                          style={{ color: "#4A9EFF" }}
                        >
                          FAM
                        </th>
                        <th
                          className="text-center px-5 py-3 font-semibold"
                          style={{ color: "#34D399" }}
                        >
                          DCFM
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Attractors", "✔", "✔", true, true],
                        ["High-dimensional", "✔", "✔", true, true],
                        ["Cyclic cognition", "✗", "✔", false, true],
                        ["Continuous flow modeling", "Weak", "✔", false, true],
                        [
                          "Hierarchical geometry",
                          "Implicit",
                          "Explicit ✔",
                          false,
                          true,
                        ],
                        [
                          "Decision boundaries",
                          "Partial",
                          "Explicit ✔",
                          false,
                          true,
                        ],
                      ].map(([feature, fam, dcfm, famOk, dcfmOk], i) => (
                        <tr
                          key={String(feature)}
                          style={{
                            background:
                              i % 2 === 0
                                ? "rgba(255,255,255,0.02)"
                                : "rgba(255,255,255,0.04)",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <td
                            className="px-5 py-3 font-medium"
                            style={{ color: "#E8F5E9" }}
                          >
                            {String(feature)}
                          </td>
                          <td
                            className="px-5 py-3 text-center font-semibold"
                            style={{ color: famOk ? "#34D399" : "#FF6B8A" }}
                          >
                            {String(fam)}
                          </td>
                          <td
                            className="px-5 py-3 text-center font-semibold"
                            style={{ color: dcfmOk ? "#34D399" : "#FF6B8A" }}
                          >
                            {String(dcfm)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 6 — What DCFM Makes Measurable */}
              <section>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                    style={{
                      background: "rgba(52,211,153,0.2)",
                      color: "#34D399",
                    }}
                  >
                    📐
                  </span>
                  What DCFM Makes Measurable
                </h3>
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "rgba(52,211,153,0.1)" }}>
                        <th
                          className="text-left px-5 py-3 font-semibold"
                          style={{ color: "#34D399" }}
                        >
                          Human Concept
                        </th>
                        <th
                          className="text-left px-5 py-3 font-semibold"
                          style={{ color: "#C8A24A" }}
                        >
                          Mapping in DCFM
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Emotion", "Vector magnitude"],
                        ["Decision", "Boundary crossing"],
                        ["Habit", "Attractor depth"],
                        ["Personality", "Preferred trajectories"],
                        ["Influence", "Perturbation of vector field"],
                      ].map(([concept, mapping], i) => (
                        <tr
                          key={String(concept)}
                          style={{
                            background:
                              i % 2 === 0
                                ? "rgba(255,255,255,0.02)"
                                : "rgba(255,255,255,0.04)",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <td
                            className="px-5 py-3 font-medium"
                            style={{ color: "#E8F5E9" }}
                          >
                            {String(concept)}
                          </td>
                          <td
                            className="px-5 py-3"
                            style={{ color: "#C8A24A" }}
                          >
                            {String(mapping)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 7 — HDA Mapped onto DCFM */}
              <section>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                    style={{
                      background: "rgba(167,139,250,0.2)",
                      color: "#A78BFA",
                    }}
                  >
                    🗺
                  </span>
                  Human Decision Architecture Mapped onto DCFM
                </h3>
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ border: "1px solid rgba(167,139,250,0.25)" }}
                >
                  <img
                    src={dcfmVisual2}
                    alt="Human Decision Architecture (HDA) mapped onto DCFM"
                    className="w-full object-contain"
                    style={{ maxHeight: "500px", background: "#0D2B1E" }}
                  />
                  <div
                    className="px-5 py-3 text-center text-sm"
                    style={{
                      background: "rgba(167,139,250,0.07)",
                      color: "#A78BFA",
                      borderTop: "1px solid rgba(167,139,250,0.2)",
                    }}
                  >
                    <em>
                      Human Decision Architecture (HDA) mapped onto DCFM —
                      showing how each decision layer sits within the manifold
                    </em>
                  </div>
                </div>
              </section>

              {/* Section 3 — HDA-DCFM Framework */}
              <section>
                <h3
                  className="text-xl font-bold text-white mb-5"
                  style={{
                    borderLeft: "3px solid #C8A24A",
                    paddingLeft: "1rem",
                  }}
                >
                  HDA-DCFM Framework — Full Cognitive Map
                </h3>
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ border: "1px solid rgba(200,162,74,0.3)" }}
                >
                  <img
                    src={dcfmVisual3}
                    alt="HDA-DCFM Framework — full cognitive map"
                    className="w-full object-contain"
                    style={{ maxHeight: "500px", background: "#0D2B1E" }}
                  />
                  <div
                    className="px-5 py-3 text-center text-sm"
                    style={{
                      background: "rgba(200,162,74,0.08)",
                      color: "#C8A24A",
                      borderTop: "1px solid rgba(200,162,74,0.2)",
                    }}
                  >
                    <em>
                      HDA-DCFM Framework — the complete cognitive decision map
                      integrating all six decision dimensions into a unified
                      manifold
                    </em>
                  </div>
                </div>
              </section>

              {/* Modal Footer */}
              <section>
                <div
                  className="rounded-2xl p-6 text-center"
                  style={{
                    background: "linear-gradient(135deg, #1B4332, #0D2B1E)",
                    border: "2px solid rgba(200,162,74,0.35)",
                  }}
                >
                  <div className="text-3xl mb-3">🌟</div>
                  <p className="text-sm font-semibold text-white mb-1">
                    DCFM is an original invention by{" "}
                    <span style={{ color: "#C8A24A" }}>Sathish Sampath</span>,
                    Human Decision Architect &amp; CEO of MESMA.
                  </p>
                  <p className="text-sm mb-3" style={{ color: "#B8D4B8" }}>
                    elidi — the assessment platform built on DCFM — is under
                    active patent filing and protection.
                  </p>
                  <a
                    href="https://www.mesmalab.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-semibold hover:opacity-80 transition-opacity"
                    style={{ color: "#C8A24A" }}
                  >
                    Visit mesmalab.com →
                  </a>
                </div>
              </section>

              <div className="h-4" />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function StageBox({
  label,
  desc,
  color,
}: { label: string; desc: string; color: string }) {
  return (
    <div
      className="w-28 rounded-xl px-3 py-2 text-center"
      style={{ background: `${color}15`, border: `1.5px solid ${color}40` }}
    >
      <div className="text-base font-bold" style={{ color }}>
        {label}
      </div>
      <div className="text-xs" style={{ color: "#8FB08F" }}>
        {desc}
      </div>
    </div>
  );
}

function StageBadge({
  number,
  label,
  color,
}: { number: string; label: string; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="text-xs font-bold tracking-widest px-3 py-1 rounded-full"
        style={{
          background: `${color}20`,
          color,
          border: `1px solid ${color}40`,
        }}
      >
        {number}
      </span>
      <span className="text-sm font-semibold" style={{ color: "#8FB08F" }}>
        {label}
      </span>
    </div>
  );
}

function FeatureList({
  title,
  color,
  items,
}: { title: string; color: string; items: string[] }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: `${color}08`,
        border: `1px solid ${color}20`,
      }}
    >
      <p className="text-xs font-bold mb-2" style={{ color }}>
        {title}
      </p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-xs"
            style={{ color: "#B8D4B8" }}
          >
            <span style={{ color }}>›</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HowItWorksPage({ onNavigate }: HowItWorksPageProps) {
  const [dcfmModalOpen, setDcfmModalOpen] = useState(false);

  return (
    <div
      className="min-h-screen"
      style={{ background: "#0D2B1E", color: "#E8F5E9" }}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-6">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <svg
            role="presentation"
            aria-hidden="true"
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="dots"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="15" cy="15" r="1" fill="rgba(200,162,74,0.12)" />
              </pattern>
              <radialGradient id="heroGrad2" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#C8A24A" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#0D2B1E" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
            <ellipse
              cx="50%"
              cy="40%"
              rx="50%"
              ry="40%"
              fill="url(#heroGrad2)"
            />
          </svg>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(200,162,74,0.15)",
              color: "#C8A24A",
              border: "1px solid rgba(200,162,74,0.3)",
            }}
          >
            Scientific Methodology
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
            The Science Behind
            <span style={{ color: "#C8A24A" }}> elidi</span>
          </h1>
          <p
            className="text-xl max-w-3xl mx-auto mb-4"
            style={{ color: "#B8D4B8" }}
          >
            How HDA-DCFM Measures, Maps, and Transforms Decision Intelligence
          </p>
          <p
            className="text-base max-w-2xl mx-auto"
            style={{ color: "#8FB08F" }}
          >
            Built on the MESMA research foundation, elidi integrates decades of
            neuroscience, behavioral economics, and psychometric science into a
            seven-stage assessment pipeline that produces your most precise
            cognitive decision profile ever.
          </p>
        </div>
      </section>

      {/* ═══ DCFM ORIGIN SECTION ═══ */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-3xl p-8 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #1B4332 0%, #0D2B1E 60%, #1a3a28 100%)",
              border: "2px solid rgba(200,162,74,0.4)",
            }}
          >
            {/* Background decoration */}
            <div
              className="absolute top-0 right-0 w-72 h-72 pointer-events-none opacity-10"
              style={{
                background:
                  "radial-gradient(circle, #C8A24A 0%, transparent 70%)",
                transform: "translate(20%, -20%)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-48 h-48 pointer-events-none opacity-5"
              style={{
                background:
                  "radial-gradient(circle, #34D399 0%, transparent 70%)",
                transform: "translate(-20%, 20%)",
              }}
            />

            <div className="relative flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
                    style={{
                      background: "rgba(200,162,74,0.2)",
                      color: "#C8A24A",
                      border: "1px solid rgba(200,162,74,0.4)",
                    }}
                  >
                    🔬 Original Invention
                  </div>
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: "rgba(255,107,138,0.15)",
                      color: "#FF6B8A",
                      border: "1px solid rgba(255,107,138,0.35)",
                    }}
                  >
                    ⚖️ Patent Pending
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                  What is DCFM?
                </h2>
                <p
                  className="text-sm leading-relaxed mb-3"
                  style={{ color: "#B8D4B8" }}
                >
                  The{" "}
                  <strong className="text-white">
                    Dynamic Cognitive Field Manifold (DCFM)
                  </strong>{" "}
                  is an original scientific invention by{" "}
                  <strong style={{ color: "#C8A24A" }}>
                    Sathish Sampath &amp; MESMA
                  </strong>
                  . It is the mathematical backbone of the elidi assessment — a
                  formal model that maps the mind as a high-dimensional manifold
                  with cyclic fiber structures, nonlinear flow dynamics, and
                  explicit decision boundaries.
                </p>
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: "#8FB08F" }}
                >
                  DCFM evolved through three stages: starting from the
                  established FAM model, through Sathish's creative synthesis
                  called CHOM, into the formally defined DCFM — the most
                  complete mathematical architecture for human decision
                  intelligence ever formulated.
                </p>

                <div className="flex flex-wrap gap-3 mb-6">
                  {[
                    "FAM → CHOM → DCFM",
                    "Cyclic Fiber Structures",
                    "Nonlinear Flow Dynamics",
                    "Decision Boundaries",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        background: "rgba(200,162,74,0.1)",
                        color: "#C8A24A",
                        border: "1px solid rgba(200,162,74,0.25)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setDcfmModalOpen(true)}
                  className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #C8A24A, #E8C96A)",
                    color: "#0D2B1E",
                  }}
                  data-ocid="dcfm_origin.open_modal_button"
                >
                  <span className="text-lg">🧬</span>
                  Explore the Full FAM → CHOM → DCFM Story
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>

              {/* Mini visual summary */}
              <div className="flex-shrink-0 hidden md:flex flex-col items-center gap-3">
                <StageBox label="FAM" desc="Foundation" color="#4A9EFF" />
                <div className="text-xl" style={{ color: "#8FB08F" }}>
                  ↓
                </div>
                <StageBox label="CHOM" desc="Synthesis" color="#FFB347" />
                <div className="text-xl" style={{ color: "#8FB08F" }}>
                  ↓
                </div>
                <StageBox label="DCFM" desc="Breakthrough" color="#C8A24A" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Methodology */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-3">
            Seven-Stage Assessment Pipeline
          </h2>
          <p style={{ color: "#8FB08F" }}>
            From your first answer to your complete intelligence profile — every
            step is grounded in validated science.
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step) => (
            <div
              key={step.num}
              className="rounded-2xl p-8 flex flex-col md:flex-row gap-6"
              style={{
                background: "#1B4332",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex-shrink-0 flex flex-col items-center gap-2">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{
                    background: `${step.color}20`,
                    border: `2px solid ${step.color}50`,
                  }}
                >
                  {step.icon}
                </div>
                <div
                  className="text-xs font-mono font-bold"
                  style={{ color: step.color }}
                >
                  STEP {step.num}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed mb-3"
                  style={{ color: "#B8D4B8" }}
                >
                  {step.desc}
                </p>
                <div
                  className="rounded-xl p-4 mb-4 border-l-4"
                  style={{
                    background: "rgba(200,162,74,0.07)",
                    borderColor: "#C8A24A",
                  }}
                >
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "#E8F5E9" }}
                  >
                    {step.detail}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {step.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        background: `${step.color}15`,
                        color: step.color,
                        border: `1px solid ${step.color}40`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Science of Measurement */}
      <section className="px-6 py-20" style={{ background: "#1B4332" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">
              The Science of Measurement
            </h2>
            <p style={{ color: "#8FB08F" }}>
              Every design choice in elidi is backed by peer-reviewed research
              literature.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {scienceCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="text-3xl mb-3">{card.icon}</div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {card.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#B8D4B8" }}
                >
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MESMA Research Foundation */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl p-10 relative overflow-hidden"
            style={{
              background: "#0D2B1E",
              border: "2px solid rgba(200,162,74,0.3)",
            }}
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
              style={{
                background: "#C8A24A",
                transform: "translate(40%, -40%)",
              }}
            />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{
                    background: "rgba(200,162,74,0.15)",
                    border: "1px solid rgba(200,162,74,0.3)",
                  }}
                >
                  🔬
                </div>
                <div>
                  <div
                    className="text-xs tracking-widest font-semibold"
                    style={{ color: "#C8A24A" }}
                  >
                    POWERED BY
                  </div>
                  <div className="text-2xl font-bold text-white">
                    MESMA Research Foundation
                  </div>
                </div>
              </div>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "#B8D4B8" }}
              >
                The MESMA Behavioral Decision Sciences Research Unit is the
                institutional backbone behind elidi. MESMA's interdisciplinary
                team bridges neuroscience, behavioral economics, clinical
                psychology, and organizational science to create assessment
                instruments with the highest possible ecological validity and
                predictive power. In 2026, MESMA received the Best Research
                Paper Award for its foundational work on decision cognitive
                force mapping.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { num: "500+", label: "Corporate Assessments" },
                  { num: "12", label: "Countries Served" },
                  { num: "2026", label: "Best Research Paper" },
                  { num: "36", label: "Published Frameworks" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="text-center rounded-xl p-4"
                    style={{
                      background: "rgba(200,162,74,0.08)",
                      border: "1px solid rgba(200,162,74,0.2)",
                    }}
                  >
                    <div
                      className="text-2xl font-bold"
                      style={{ color: "#C8A24A" }}
                    >
                      {s.num}
                    </div>
                    <div
                      className="text-xs mt-1"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                {[
                  "Corporate Leadership Training",
                  "Mind Activation Workshops",
                  "Research Partnerships",
                  "Academic Publications",
                ].map((item) => (
                  <span
                    key={item}
                    className="text-xs px-3 py-1.5 rounded-full"
                    style={{
                      background: "rgba(200,162,74,0.12)",
                      color: "#C8A24A",
                      border: "1px solid rgba(200,162,74,0.25)",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>

              <a
                href="https://www.mesmalab.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-all hover:opacity-80"
                style={{ color: "#C8A24A" }}
              >
                Visit mesmalab.com →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Neural Architecture Brain SVG */}
      <section className="px-6 py-16" style={{ background: "#1B4332" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              Neural Architecture of Decision-Making
            </h2>
            <p style={{ color: "#8FB08F" }}>
              Each HDA-DCFM dimension maps to a distinct neurological substrate
              — revealing the brain regions that drive your decision tendencies.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-shrink-0">
              <svg
                role="img"
                aria-label="HDA-DCFM Neural Architecture Map showing brain regions for each decision dimension"
                viewBox="0 0 340 320"
                width="340"
                height="320"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse
                  cx="170"
                  cy="150"
                  rx="130"
                  ry="110"
                  fill="rgba(200,162,74,0.05)"
                  stroke="rgba(200,162,74,0.3)"
                  strokeWidth="2"
                />
                <path
                  d="M 170 40 Q 90 50 60 120 Q 40 170 70 210 Q 100 250 150 260 Q 160 262 170 260"
                  fill="none"
                  stroke="rgba(200,162,74,0.4)"
                  strokeWidth="1.5"
                />
                <path
                  d="M 170 40 Q 250 50 280 120 Q 300 170 270 210 Q 240 250 190 260 Q 180 262 170 260"
                  fill="none"
                  stroke="rgba(200,162,74,0.4)"
                  strokeWidth="1.5"
                />
                <path
                  d="M 120 150 Q 170 140 220 150"
                  fill="none"
                  stroke="rgba(200,162,74,0.5)"
                  strokeWidth="2"
                />

                <ellipse
                  cx="170"
                  cy="75"
                  rx="50"
                  ry="28"
                  fill="rgba(74,158,255,0.25)"
                  stroke="#4A9EFF"
                  strokeWidth="1.5"
                />
                <text
                  x="170"
                  y="70"
                  textAnchor="middle"
                  fill="#4A9EFF"
                  fontSize="8"
                  fontWeight="700"
                >
                  Prefrontal Cortex
                </text>
                <text
                  x="170"
                  y="82"
                  textAnchor="middle"
                  fill="rgba(74,158,255,0.7)"
                  fontSize="7"
                >
                  Analytical Clarity
                </text>

                <ellipse
                  cx="115"
                  cy="165"
                  rx="24"
                  ry="16"
                  fill="rgba(255,107,138,0.25)"
                  stroke="#FF6B8A"
                  strokeWidth="1.5"
                />
                <text
                  x="115"
                  y="162"
                  textAnchor="middle"
                  fill="#FF6B8A"
                  fontSize="7"
                  fontWeight="700"
                >
                  Amygdala
                </text>
                <text
                  x="115"
                  y="172"
                  textAnchor="middle"
                  fill="rgba(255,107,138,0.7)"
                  fontSize="6"
                >
                  Emotional EQ
                </text>

                <ellipse
                  cx="170"
                  cy="130"
                  rx="28"
                  ry="18"
                  fill="rgba(244,114,182,0.25)"
                  stroke="#F472B6"
                  strokeWidth="1.5"
                />
                <text
                  x="170"
                  y="127"
                  textAnchor="middle"
                  fill="#F472B6"
                  fontSize="7"
                  fontWeight="700"
                >
                  ACC
                </text>
                <text
                  x="170"
                  y="138"
                  textAnchor="middle"
                  fill="rgba(244,114,182,0.7)"
                  fontSize="6"
                >
                  Adaptive Flex
                </text>

                <ellipse
                  cx="225"
                  cy="165"
                  rx="26"
                  ry="17"
                  fill="rgba(255,179,71,0.25)"
                  stroke="#FFB347"
                  strokeWidth="1.5"
                />
                <text
                  x="225"
                  y="162"
                  textAnchor="middle"
                  fill="#FFB347"
                  fontSize="7"
                  fontWeight="700"
                >
                  Limbic
                </text>
                <text
                  x="225"
                  y="172"
                  textAnchor="middle"
                  fill="rgba(255,179,71,0.7)"
                  fontSize="6"
                >
                  Risk Orient.
                </text>

                <ellipse
                  cx="100"
                  cy="210"
                  rx="32"
                  ry="18"
                  fill="rgba(167,139,250,0.25)"
                  stroke="#A78BFA"
                  strokeWidth="1.5"
                />
                <text
                  x="100"
                  y="207"
                  textAnchor="middle"
                  fill="#A78BFA"
                  fontSize="7"
                  fontWeight="700"
                >
                  Mirror Neurons
                </text>
                <text
                  x="100"
                  y="217"
                  textAnchor="middle"
                  fill="rgba(167,139,250,0.7)"
                  fontSize="6"
                >
                  Social Influence
                </text>

                <ellipse
                  cx="238"
                  cy="210"
                  rx="30"
                  ry="17"
                  fill="rgba(52,211,153,0.25)"
                  stroke="#34D399"
                  strokeWidth="1.5"
                />
                <text
                  x="238"
                  y="207"
                  textAnchor="middle"
                  fill="#34D399"
                  fontSize="7"
                  fontWeight="700"
                >
                  Temporal Lobe
                </text>
                <text
                  x="238"
                  y="217"
                  textAnchor="middle"
                  fill="rgba(52,211,153,0.7)"
                  fontSize="6"
                >
                  Temporal Think.
                </text>

                <text
                  x="170"
                  y="298"
                  textAnchor="middle"
                  fill="rgba(200,162,74,0.7)"
                  fontSize="9"
                  fontWeight="600"
                >
                  HDA-DCFM Neural Architecture Map
                </text>
              </svg>
            </div>

            <div className="flex-1 space-y-4">
              {[
                {
                  color: "#4A9EFF",
                  dim: "Analytical Clarity",
                  region: "Prefrontal Cortex",
                  desc: "Executive function, working memory, System 2 deliberation",
                },
                {
                  color: "#FF6B8A",
                  dim: "Emotional Intelligence",
                  region: "Amygdala-PFC Circuit",
                  desc: "Emotional tagging, somatic markers, affective regulation",
                },
                {
                  color: "#F472B6",
                  dim: "Adaptive Flexibility",
                  region: "Anterior Cingulate Cortex",
                  desc: "Conflict monitoring, behavioral switching, error detection",
                },
                {
                  color: "#FFB347",
                  dim: "Risk Orientation",
                  region: "Limbic System",
                  desc: "Reward prediction, loss aversion, threat evaluation",
                },
                {
                  color: "#A78BFA",
                  dim: "Social Influence",
                  region: "Mirror Neuron Network",
                  desc: "Social simulation, conformity circuitry, empathy mapping",
                },
                {
                  color: "#34D399",
                  dim: "Temporal Thinking",
                  region: "Temporal Lobe + PFC",
                  desc: "Episodic future thinking, delay discounting, prospection",
                },
              ].map((item) => (
                <div key={item.dim} className="flex items-start gap-3">
                  <div
                    className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                    style={{ background: item.color }}
                  />
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {item.dim}
                    </div>
                    <div className="text-xs" style={{ color: item.color }}>
                      {item.region}
                    </div>
                    <div className="text-xs" style={{ color: "#8FB08F" }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">
              Where elidi Creates Impact
            </h2>
            <p style={{ color: "#8FB08F" }}>
              From C-suite boardrooms to personal growth journeys — decision
              intelligence transforms every domain.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((uc) => (
              <div
                key={uc.title}
                className="rounded-2xl p-6"
                style={{
                  background: "#1B4332",
                  border: "1px solid rgba(200,162,74,0.15)",
                }}
              >
                <div className="text-4xl mb-4">{uc.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {uc.title}
                </h3>
                <ul className="space-y-3">
                  {uc.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-start gap-2 text-sm"
                      style={{ color: "#B8D4B8" }}
                    >
                      <span style={{ color: "#C8A24A" }}>›</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sathish Attribution */}
      <section className="py-20 px-6" style={{ background: "#1B4332" }}>
        <div
          className="max-w-4xl mx-auto rounded-3xl p-10"
          style={{
            background: "#0D2B1E",
            border: "1px solid rgba(200,162,74,0.25)",
          }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-shrink-0">
              <img
                src={sathishPhoto1}
                alt="Sathish Sampath"
                className="w-28 h-28 rounded-full object-cover border-4 border-yellow-500"
                style={{ objectPosition: "center top" }}
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div
                className="text-xs font-semibold tracking-widest mb-3"
                style={{ color: "#C8A24A" }}
              >
                CREATED BY
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                Sathish Sampath, FRSPH
              </h3>
              <div className="text-sm mb-4" style={{ color: "#C8A24A" }}>
                Human Decision Architect | Mind Hack Specialist | CEO, MESMA
              </div>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: "#B8D4B8" }}
              >
                Sathish Sampath created HDA-DCFM to bridge the gap between
                cutting-edge neuroscience and everyday decision-making —
                translating complex cognitive science into a practical,
                actionable tool for leaders, professionals, and individuals
                worldwide. As an international keynote speaker with over 1,000
                talks across 12 countries, a Behavioural Psychology Researcher,
                Licensed Psychologist (Hypnotherapist), and Fellow of the Royal
                Society for Public Health, with extensive work in Decision
                Science for Business across Sales, Marketing, Branding, and GTM
                Strategies, and in personal transformation through building
                inner strength for outer shine — Sathish brings unparalleled
                depth and credibility to every dimension of the elidi platform.
              </p>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold mb-6"
                style={{
                  background: "rgba(255,107,138,0.12)",
                  color: "#FF6B8A",
                  border: "1px solid rgba(255,107,138,0.25)",
                }}
              >
                ⚖️ Inventor of DCFM — Patent Filing in Progress by Sathish
                Sampath &amp; MESMA
              </div>
              <br />
              <button
                type="button"
                onClick={() => onNavigate("assessment")}
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: "#C8A24A", color: "#1B4332" }}
                data-ocid="howitworks.primary_button"
              >
                Start Assessment →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="py-20 px-6 text-center"
        style={{
          background:
            "linear-gradient(135deg, #0D2B1E 0%, #2D6A4F 50%, #0D2B1E 100%)",
          borderTop: "1px solid rgba(200,162,74,0.2)",
        }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Your Decision Profile Awaits
        </h2>
        <p className="mb-8 text-lg" style={{ color: "#B8D4B8" }}>
          Seven stages. Six dimensions. One complete picture of how you decide.
        </p>
        <button
          type="button"
          onClick={() => onNavigate("assessment")}
          className="px-10 py-4 rounded-xl font-bold text-lg transition-all hover:opacity-90 active:scale-95 shadow-xl"
          style={{ background: "#C8A24A", color: "#1B4332" }}
          data-ocid="howitworks.submit_button"
        >
          Start Assessment
        </button>
      </section>

      {/* ─── Beyond Assessment: Platform Architecture ───────────── */}
      <section
        className="py-24"
        style={{
          background: "linear-gradient(135deg, #081C2F 0%, #0D2B1A 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
              style={{
                background: "rgba(200,162,74,0.15)",
                color: "#C8A24A",
                border: "1px solid rgba(200,162,74,0.3)",
              }}
            >
              Beyond Assessment
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              The elidi Platform Architecture
            </h2>
            <p className="text-white/60 text-lg max-w-3xl mx-auto">
              The HDA-DCFM assessment is the entry point. Beneath it lies a
              cognitive operating system powering 6 distinct product clouds —
              all sharing one data layer, one engine, and one scientific
              framework.
            </p>
          </div>
          {/* Core Engine */}
          <div className="relative mb-12">
            <div
              className="max-w-lg mx-auto rounded-2xl p-8 text-center mb-8"
              style={{
                background: "rgba(200,162,74,0.08)",
                border: "2px solid rgba(200,162,74,0.4)",
              }}
            >
              <div className="text-4xl mb-3">⚙️</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                DCFM Engine
              </h3>
              <p className="text-white/60 text-sm">
                Dynamic Cognitive Field Manifold — the patent-pending scientific
                core that powers every product line
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {["PM", "EM", "RRM", "IAI", "SIS", "EDI"].map((d) => (
                  <span
                    key={d}
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: "rgba(200,162,74,0.2)",
                      color: "#C8A24A",
                    }}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
            {/* Connector */}
            <div className="flex justify-center mb-8">
              <div
                className="w-0.5 h-10 opacity-30"
                style={{ background: "#C8A24A" }}
              />
            </div>
            {/* Product Clouds */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: "🧠",
                  name: "elidi Core",
                  color: "#C8A24A",
                  items: [
                    "Personal Assessment",
                    "Mind Twin Engine",
                    "Simulation Lab",
                  ],
                },
                {
                  icon: "👥",
                  name: "elidi People",
                  color: "#7B9FC7",
                  items: [
                    "Hiring Intelligence",
                    "Cognitive Org Design",
                    "Conflict Predictor",
                  ],
                },
                {
                  icon: "🎯",
                  name: "elidi Coach",
                  color: "#82B89A",
                  items: [
                    "Coach Platform",
                    "Clinical Profiling",
                    "Wellness Index",
                  ],
                },
                {
                  icon: "📈",
                  name: "elidi Brands",
                  color: "#A688C4",
                  items: [
                    "Customer Mind Twin",
                    "Negotiation Intel",
                    "Brand Mapper",
                  ],
                },
                {
                  icon: "🎓",
                  name: "elidi Edu",
                  color: "#E08A7A",
                  items: [
                    "Academic Intelligence",
                    "For Parents",
                    "Certification",
                  ],
                },
                {
                  icon: "🔬",
                  name: "Research + API",
                  color: "#C4A882",
                  items: ["Academic Platform", "Research Index", "Open API"],
                },
              ].map((cloud) => (
                <div
                  key={cloud.name}
                  className="rounded-xl p-6"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${cloud.color}33`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{cloud.icon}</span>
                    <h4 className="font-bold text-white">{cloud.name}</h4>
                  </div>
                  {cloud.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm text-white/50 mb-2"
                    >
                      <span style={{ color: cloud.color }}>▸</span> {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Who Uses elidi ─────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
              style={{
                background: "#f0f7f4",
                color: "#1B4332",
                border: "1px solid rgba(27,67,50,0.15)",
              }}
            >
              Use Cases
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "#1B4332" }}
            >
              Who Uses elidi
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Decision intelligence serves every domain where humans make
              consequential choices.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[
              {
                icon: "🏢",
                persona: "HR Leaders",
                color: "#1B4332",
                problem:
                  "Hiring by instinct costs enterprises 40k+ per misaligned senior hire.",
                solution:
                  "elidi profiles cognitive fit before the first interview — matching how candidates actually decide to what roles demand.",
              },
              {
                icon: "🎯",
                persona: "Business Coaches",
                color: "#1B4332",
                problem:
                  "Client progress is invisible in session notes and anecdotal check-ins.",
                solution:
                  "elidi gives coaches a living Mind Twin — trackable dimension shifts that show real cognitive evolution over time.",
              },
              {
                icon: "🏥",
                persona: "Clinicians",
                color: "#1B4332",
                problem:
                  "Stress-decision collapse patterns are hard to detect before crisis.",
                solution:
                  "DCFM surfaces early cognitive risk flags — high EM + low IAI under load — supporting clinical triage and intervention.",
              },
              {
                icon: "📊",
                persona: "Sales Leaders",
                color: "#1B4332",
                problem:
                  "Sales pitches built on demographics miss the buyer's actual decision logic.",
                solution:
                  "Customer Mind Twin maps how your buyers cognitively process risk, trust, and commitment — transforming GTM precision.",
              },
              {
                icon: "🎓",
                persona: "Educators",
                color: "#1B4332",
                problem:
                  "Academic pressure exposes students to decision-making crises without tools.",
                solution:
                  "elidi builds decision readiness profiles that help students, parents, and counsellors navigate pivotal life choices.",
              },
              {
                icon: "🔬",
                persona: "Researchers",
                color: "#1B4332",
                problem:
                  "Behavioural science needs large-scale, reproducible cognitive datasets.",
                solution:
                  "The elidi Research Platform provides a live, global DCFM dataset — anonymised, structured, and publication-ready.",
              },
            ].map((card) => (
              <div
                key={card.persona}
                className="rounded-2xl p-7 flex flex-col gap-4 hover:shadow-xl transition-all hover:-translate-y-1"
                style={{
                  background: "#f8faf9",
                  border: "1px solid rgba(27,67,50,0.1)",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{card.icon}</span>
                  <h3
                    className="font-bold text-xl"
                    style={{ color: card.color }}
                  >
                    {card.persona}
                  </h3>
                </div>
                <div>
                  <div
                    className="text-xs font-semibold uppercase tracking-wider mb-1"
                    style={{ color: "#C8A24A" }}
                  >
                    The Challenge
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {card.problem}
                  </p>
                </div>
                <div>
                  <div
                    className="text-xs font-semibold uppercase tracking-wider mb-1"
                    style={{ color: "#1B4332" }}
                  >
                    elidi's Answer
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {card.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="text-center py-6 text-xs"
        style={{ background: "#0D2B1E", color: "rgba(255,255,255,0.4)" }}
      >
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white"
        >
          caffeine.ai
        </a>
      </footer>

      {/* DCFM Origin Modal */}
      <DCFMOriginModal
        open={dcfmModalOpen}
        onClose={() => setDcfmModalOpen(false)}
      />
    </div>
  );
}
