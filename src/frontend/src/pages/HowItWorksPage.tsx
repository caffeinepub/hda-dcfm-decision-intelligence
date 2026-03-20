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

export function HowItWorksPage({ onNavigate }: HowItWorksPageProps) {
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
                src="/assets/uploads/05-2-1.jpg"
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
                className="text-sm leading-relaxed mb-6"
                style={{ color: "#B8D4B8" }}
              >
                Sathish Sampath created HDA-DCFM to bridge the gap between
                cutting-edge neuroscience and everyday decision-making —
                translating complex cognitive science into a practical,
                actionable tool for leaders, professionals, and individuals
                worldwide. As an international keynote speaker with over 1,000
                talks across 12 countries, a behavioral psychology researcher,
                clinical hypnotherapist, and Fellow of the Royal Society for
                Public Health, Sathish brings unparalleled depth and credibility
                to every dimension of the elidi platform.
              </p>
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
    </div>
  );
}
