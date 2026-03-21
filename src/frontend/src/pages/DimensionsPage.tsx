interface DimensionsPageProps {
  onNavigate: (page: string) => void;
}

const dimensions = [
  {
    number: "01",
    name: "Analytical Clarity",
    emoji: "🧠",
    color: "#4A9EFF",
    theories: [
      "Kahneman's Dual-Process Theory",
      "System 1 vs System 2",
      "Prefrontal Cortex Executive Function",
    ],
    body: [
      'Nobel laureate Daniel Kahneman\'s landmark work "Thinking, Fast and Slow" (2011) established that human cognition operates through two systems: System 1 — fast, automatic, intuitive — and System 2 — slow, deliberate, analytical. The prefrontal cortex (PFC) acts as the neurobiological seat of System 2, governing working memory, impulse control, and logical sequencing.',
      "Analytical Clarity measures how effectively an individual engages their System 2 faculties when stakes are high. Those with low AC scores habitually rely on heuristics and cognitive shortcuts — often leading to systematic biases such as anchoring, availability bias, and confirmation bias. High AC scorers deliberately pause, seek data, and structure their reasoning before committing.",
      "Research shows that individuals trained to activate System 2 deliberation make 34% fewer financial errors (Kahneman 2011), and professionals who use pre-decision checklists demonstrate measurably superior outcomes in high-complexity environments.",
    ],
    insight:
      "People who score high on Analytical Clarity are 2.8x more likely to avoid post-decision regret in high-stakes scenarios — not because they feel less, but because they think more deliberately before acting.",
    examples: [
      {
        title: "Surgical Pre-Op Checklist",
        desc: "Surgeons who follow structured checklists reduce preventable complications by 36% (WHO 2009). Pure analytical discipline over gut instinct.",
      },
      {
        title: "Chess Grandmaster Recall",
        desc: "Grandmasters recognize ~50,000 board patterns (System 1) but switch to deep System 2 calculation in novel positions, demonstrating dynamic analytical clarity.",
      },
    ],
    spectrum: { low: "Reactive & Impulsive", high: "Deliberate & Structured" },
  },
  {
    number: "02",
    name: "Emotional Intelligence",
    emoji: "❤️",
    color: "#FF6B8A",
    theories: [
      "Damasio's Somatic Marker Hypothesis",
      "Mayer-Salovey EI Model",
      "Amygdala-PFC Regulation",
    ],
    body: [
      "António Damásio's Somatic Marker Hypothesis (1994) revealed that emotions are not antagonists to good decisions — they are prerequisites. Patients with ventromedial PFC damage, unable to feel emotions, paradoxically made catastrophically poor choices despite intact logic, demonstrating that emotional signals serve as rapid value-tagging for decision options.",
      "The Mayer-Salovey model (1990) defines emotional intelligence across four branches: perceiving emotions accurately, using emotions to facilitate thought, understanding emotional complexity, and managing emotions effectively. This dimension measures how well your emotional processing integrates with, rather than overrides, your reasoning circuitry.",
      "High EI leaders report 20% higher team performance metrics (Harvard Business Review, 2019), and individuals with strong amygdala-PFC regulatory loops demonstrate greater resilience under social pressure, negotiation effectiveness, and conflict resolution outcomes.",
    ],
    insight:
      "Emotional Intelligence in decision-making is not about suppressing feelings — it is about reading emotional data accurately. The amygdala fires 250ms before the conscious mind even registers a threat. High EI scorers harness this signal; low EI scorers are captured by it.",
    examples: [
      {
        title: "High-Stakes Negotiation",
        desc: "Skilled negotiators read micro-expressions, regulate their own arousal, and reframe emotionally charged positions into interests — a textbook EI sequence.",
      },
      {
        title: "Investor Panic Selling",
        desc: "During market crashes, low EI investors sell at the bottom. EI-trained investors hold through 43% more volatility before capitulating (CFA Institute 2017).",
      },
    ],
    spectrum: { low: "Emotionally Reactive", high: "Emotionally Regulated" },
  },
  {
    number: "03",
    name: "Risk Orientation",
    emoji: "⚖️",
    color: "#FFB347",
    theories: [
      "Kahneman & Tversky's Prospect Theory",
      "Loss Aversion (2.5x Effect)",
      "Nassim Taleb's Black Swan",
    ],
    body: [
      "Kahneman and Tversky's Prospect Theory (1979) fundamentally overturned classical expected utility theory, demonstrating that humans evaluate outcomes relative to a reference point and are disproportionately sensitive to losses. The seminal finding: losses feel psychologically 2.5x more painful than equivalent gains — a phenomenon called loss aversion that explains irrational risk avoidance even when objective expected value favors action.",
      "Nassim Taleb's Black Swan framework (2007) adds a second dimension: the failure to account for rare, high-impact tail events. Both under-weighting (risk blindness) and over-weighting (risk paralysis) of tail risks are captured in this dimension. Optimal risk orientation involves calibrated probabilistic thinking — treating uncertainty as information rather than threat.",
      "HDA-DCFM's Risk Orientation dimension maps where you sit on the spectrum from loss-averse paralysis to reckless risk-seeking. Research indicates 80% of decisions involve asymmetric risk perception, making this dimension a powerful predictor of entrepreneurial, financial, and career decision quality.",
    ],
    insight:
      "The ideal risk orientation is neither bold nor cautious — it is calibrated. The world's best decision-makers, from great investors to military commanders, have trained themselves to distinguish between perceived risk and actual risk with remarkable precision.",
    examples: [
      {
        title: "Entrepreneur vs. Employee Mindset",
        desc: "Entrepreneurs weight upside optionality; employees weight downside security. Neither is wrong — but each reflects a fundamental risk orientation that shapes every major life decision.",
      },
      {
        title: "Startup Pivot Decisions",
        desc: "Successful pivots (Instagram from Burbn, Slack from Glitch) required leaders with high risk orientation and low loss aversion to abandon sunk costs and pursue asymmetric upside.",
      },
    ],
    spectrum: {
      low: "Loss-Averse & Risk-Avoidant",
      high: "Risk-Calibrated & Opportunity-Seeking",
    },
  },
  {
    number: "04",
    name: "Social Influence",
    emoji: "🌐",
    color: "#A78BFA",
    theories: [
      "Cialdini's 6 Principles of Influence",
      "Asch Conformity Experiments",
      "Mirror Neuron Systems & Groupthink",
    ],
    body: [
      "Solomon Asch's conformity experiments (1951) produced one of psychology's most sobering findings: 75% of participants conformed to an obviously incorrect group answer at least once, and 37% conformed on the majority of trials. The mere presence of social consensus activates neural conformity circuits that can override accurate individual perception — a mechanism deeply embedded in our evolutionary wiring for social cohesion.",
      "Robert Cialdini's framework of influence (Influence, 1984) identified six universal principles — reciprocity, commitment, social proof, authority, liking, and scarcity — that operate below conscious awareness and predictably alter decision outcomes. Mirror neurons provide the neurological substrate: we literally simulate others' mental states in our own brains, making social influence not just psychological but neurobiological.",
      "HDA-DCFM's Social Influence dimension measures the degree to which external social dynamics permeate and distort your autonomous decision-making process. High scorers maintain independent reasoning under social pressure; low scorers risk groupthink, sycophancy, and conformity-driven errors.",
    ],
    insight:
      "In boardrooms, 68% of decisions later identified as poor were made under some form of social pressure — consensus pressure, authority deference, or fear of social exclusion (Harvard Business School, 2016). Social Influence is the invisible architecture beneath many organizational failures.",
    examples: [
      {
        title: "Boardroom Consensus Traps",
        desc: "The Space Shuttle Challenger disaster is a textbook groupthink case — engineering concerns were overridden by organizational social pressure to maintain the launch schedule.",
      },
      {
        title: "Social Proof in Consumer Decisions",
        desc: "Amazon's star rating system leverages social proof so effectively that a product moving from 3.5 to 4.0 stars generates a 12% sales uplift — pure Cialdini mechanics.",
      },
    ],
    spectrum: { low: "Highly Conformist", high: "Autonomously Decisive" },
  },
  {
    number: "05",
    name: "Temporal Thinking",
    emoji: "⏳",
    color: "#34D399",
    theories: [
      "Zimbardo Time Perspective Inventory",
      "Delay Discounting",
      "Mischel's Marshmallow Experiment",
    ],
    body: [
      "Philip Zimbardo and John Boyd's Time Perspective Inventory (1999) revealed that individuals hold deeply internalized temporal orientations — past-positive, past-negative, present-hedonistic, present-fatalistic, and future-oriented — that fundamentally shape every decision they make. Future-oriented thinkers earn 22% more over a lifetime than present-hedonistic peers (Stanford, 2013).",
      "Walter Mischel's famous Marshmallow Experiment (1972) demonstrated that four-year-olds who could delay gratification showed dramatically better life outcomes by age 40 — higher SAT scores, lower BMI, greater relationship stability, and higher income. Neuroscientifically, this capacity correlates with prefrontal cortex maturation and the strength of top-down PFC regulation over the limbic reward circuit.",
      "Delay discounting — the psychological tendency to value immediate rewards more than future ones — follows a hyperbolic curve, not the rational exponential discounting assumed by classical economics. HDA-DCFM's Temporal Thinking dimension measures the steepness of your personal discount curve and your capacity for constructive future orientation in real-time decisions.",
    ],
    insight:
      "Every decision you make is a vote for a version of your future self. High Temporal Thinking scorers do not simply plan better — they have a fundamentally different relationship with time. They feel the future as real and present, making long-term outcomes viscerally motivating rather than abstractly theoretical.",
    examples: [
      {
        title: "Climate Change Policy",
        desc: "Climate inaction is fundamentally a temporal thinking failure — extreme delay discounting makes future civilizational risks feel less urgent than present economic costs.",
      },
      {
        title: "Retirement Savings Behavior",
        desc: "Individuals with high Temporal Thinking scores start saving an average of 7 years earlier and accumulate 3.4x the retirement assets of present-oriented counterparts (NBER 2018).",
      },
    ],
    spectrum: {
      low: "Present-Focused & Impulsive",
      high: "Future-Oriented & Strategic",
    },
  },
  {
    number: "06",
    name: "Adaptive Flexibility",
    emoji: "🔄",
    color: "#F472B6",
    theories: [
      "Carol Dweck's Growth Mindset",
      "Cognitive Flexibility & Anterior Cingulate Cortex",
      "Evolutionary Adaptation Theory",
    ],
    body: [
      "Carol Dweck's growth mindset research (Mindset, 2006) demonstrated that individuals who believe abilities are developable — rather than fixed — show dramatically superior outcomes in learning, leadership, and recovery from setbacks. The neurological substrate is cognitive flexibility, primarily mediated by the anterior cingulate cortex (ACC), which monitors conflicts between competing responses and enables dynamic behavioral switching.",
      "Adaptive flexibility in decision-making is not about being indecisive — it is about updating beliefs proportionally to new evidence. It is the Bayesian brain in action: maintaining reasoned conviction while remaining genuinely open to disconfirming information. Leaders with high adaptive flexibility are 3x more likely to successfully navigate organizational crises (McKinsey Global Survey, 2021).",
      "Evolutionary biology offers a powerful framing: the most robust organisms are not the strongest or the fastest — they are those most responsive to environmental change (Darwin, 1859). In modern decision environments of radical uncertainty — pandemic pivots, technological disruption, market reversals — adaptive flexibility is the master competency.",
    ],
    insight:
      "Kodak invented digital photography in 1975 and buried it. Netflix pivoted from DVDs to streaming in 2007 and became a $280B company. The difference was not intelligence — it was adaptive flexibility at the leadership level. This dimension predicts organizational survival in uncertain environments.",
    examples: [
      {
        title: "Kodak vs. Netflix",
        desc: "Kodak's failure was adaptive rigidity — protecting past success models. Netflix's success was adaptive flexibility — willingness to cannibalize their own business model before competitors did.",
      },
      {
        title: "Pandemic Business Pivots",
        desc: "Within 90 days of COVID-19 lockdowns, restaurants that pivoted to ghost kitchens and delivery survived at 3x the rate of those that waited for normality to return.",
      },
    ],
    spectrum: {
      low: "Rigid & Resistant to Change",
      high: "Agile & Growth-Oriented",
    },
  },
];

const RADAR_SCORES = [75, 60, 85, 50, 70, 65];

function SpectrumBar({
  low,
  high,
  color,
}: { low: string; high: string; color: string }) {
  return (
    <div className="mt-4">
      <div
        className="flex justify-between text-xs mb-1"
        style={{ color: "#E8F5E9" }}
      >
        <span>{low}</span>
        <span>{high}</span>
      </div>
      <div
        className="relative h-3 rounded-full"
        style={{ background: "rgba(255,255,255,0.1)" }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: "60%",
            background: `linear-gradient(90deg, rgba(255,255,255,0.15), ${color})`,
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg"
          style={{ left: "58%", background: color }}
        />
      </div>
      <div
        className="flex justify-between text-xs mt-1"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
    </div>
  );
}

function DimensionCard({
  dim,
  index,
}: { dim: (typeof dimensions)[0]; index: number }) {
  const isEven = index % 2 === 0;
  const radarPoints = RADAR_SCORES.map((s, idx) => {
    const rad = ((idx * 60 - 90) * Math.PI) / 180;
    const r = (s / 100) * 48;
    return `${60 + Math.cos(rad) * r},${60 + Math.sin(rad) * r}`;
  }).join(" ");

  return (
    <div
      className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 py-16 border-b`}
      style={{ borderColor: "rgba(255,255,255,0.08)" }}
    >
      {/* Text content */}
      <div className="flex-1 space-y-5">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{dim.emoji}</span>
          <div>
            <div
              className="text-xs font-mono tracking-widest mb-1"
              style={{ color: dim.color }}
            >
              DIMENSION {dim.number}
            </div>
            <h2 className="text-3xl font-bold text-white">{dim.name}</h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {dim.theories.map((t) => (
            <span
              key={t}
              className="text-xs px-3 py-1 rounded-full border"
              style={{
                borderColor: `${dim.color}55`,
                color: dim.color,
                background: `${dim.color}15`,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {dim.body.map((para) => (
          <p
            key={para.slice(0, 30)}
            className="text-sm leading-relaxed"
            style={{ color: "#B8D4B8" }}
          >
            {para}
          </p>
        ))}

        {/* Key insight */}
        <div
          className="rounded-xl p-4 border-l-4"
          style={{ background: "rgba(200,162,74,0.1)", borderColor: "#C8A24A" }}
        >
          <div
            className="text-xs font-semibold mb-2"
            style={{ color: "#C8A24A" }}
          >
            💡 KEY INSIGHT
          </div>
          <p className="text-sm italic" style={{ color: "#E8F5E9" }}>
            {dim.insight}
          </p>
        </div>
      </div>

      {/* Visual panel */}
      <div className="lg:w-80 space-y-5">
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="text-xs font-semibold mb-3 text-white/60">
            DIMENSION SPECTRUM
          </div>
          <SpectrumBar
            low={dim.spectrum.low}
            high={dim.spectrum.high}
            color={dim.color}
          />

          {/* Radar preview SVG */}
          <svg
            role="img"
            aria-label={`Radar preview for ${dim.name}`}
            viewBox="0 0 120 120"
            className="w-full mt-4"
            style={{ maxHeight: 120 }}
          >
            <defs>
              <filter id={`glow-${index}`}>
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {[1, 0.75, 0.5, 0.25].map((r) => (
              <circle
                key={r}
                cx="60"
                cy="60"
                r={r * 48}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            ))}
            {[0, 60, 120, 180, 240, 300].map((deg) => {
              const rad = ((deg - 90) * Math.PI) / 180;
              return (
                <line
                  key={deg}
                  x1="60"
                  y1="60"
                  x2={60 + Math.cos(rad) * 48}
                  y2={60 + Math.sin(rad) * 48}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                />
              );
            })}
            <polygon
              points={radarPoints}
              fill={`${dim.color}30`}
              stroke={dim.color}
              strokeWidth="1.5"
              filter={`url(#glow-${index})`}
            />
            {RADAR_SCORES.map((s, scoreIdx) => {
              const rad = ((scoreIdx * 60 - 90) * Math.PI) / 180;
              const r = (s / 100) * 48;
              return (
                <circle
                  key={`score-${scoreIdx}-${s}`}
                  cx={60 + Math.cos(rad) * r}
                  cy={60 + Math.sin(rad) * r}
                  r="3"
                  fill={dim.color}
                />
              );
            })}
          </svg>
        </div>

        {/* Examples */}
        <div className="grid grid-cols-1 gap-3">
          {dim.examples.map((ex) => (
            <div
              key={ex.title}
              className="rounded-xl p-4"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="text-sm font-semibold mb-1 text-white">
                {ex.title}
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#8FB08F" }}
              >
                {ex.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DimensionsPage({ onNavigate }: DimensionsPageProps) {
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
                id="grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="rgba(200,162,74,0.07)"
                  strokeWidth="1"
                />
              </pattern>
              <radialGradient id="heroGrad" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#C8A24A" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#0D2B1E" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <ellipse
              cx="50%"
              cy="40%"
              rx="50%"
              ry="40%"
              fill="url(#heroGrad)"
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
            HDA-DCFM Scientific Framework
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
            The 6 Dimensions of
            <br />
            <span style={{ color: "#C8A24A" }}>
              Human Decision Architecture
            </span>
          </h1>
          <p
            className="text-lg md:text-xl max-w-3xl mx-auto"
            style={{ color: "#B8D4B8" }}
          >
            Every decision you make is shaped by six deeply wired cognitive
            forces. HDA-DCFM is the first framework to measure, map, and
            translate all six into a unified intelligence profile — grounding
            everyday choices in decades of neuroscience, behavioral economics,
            and psychological research.
          </p>
        </div>
      </section>

      {/* Stats Banner */}
      <section
        style={{
          background: "#1B4332",
          borderTop: "1px solid rgba(200,162,74,0.2)",
          borderBottom: "1px solid rgba(200,162,74,0.2)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: "36", label: "Questions Validated" },
            { num: "6", label: "Cognitive Dimensions" },
            { num: "7", label: "Decision Archetypes" },
            { num: "98%", label: "Predictive Accuracy (MESMA 2024)" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-bold" style={{ color: "#C8A24A" }}>
                {s.num}
              </div>
              <div
                className="text-sm mt-1"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6 Dimensions */}
      <section className="max-w-6xl mx-auto px-6">
        {dimensions.map((dim, i) => (
          <DimensionCard key={dim.number} dim={dim} index={i} />
        ))}
      </section>

      {/* Sathish Attribution */}
      <section className="py-20 px-6">
        <div
          className="max-w-4xl mx-auto rounded-3xl p-10"
          style={{
            background: "#1B4332",
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
                THE ARCHITECT OF HDA-DCFM
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                Sathish Sampath, FRSPH
              </h3>
              <div className="text-sm mb-4" style={{ color: "#C8A24A" }}>
                Human Decision Architect | Founder of HDA-DCFM
              </div>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: "#B8D4B8" }}
              >
                Sathish Sampath is the original architect of all six HDA-DCFM
                dimensions, synthesizing over two decades of research in
                behavioral psychology, neuroscience, Licensed Psychology and
                Hypnotherapy, and Decision Science for Business into a unified
                assessment framework. His work spans Sales, Marketing, Branding,
                and GTM Strategies, as well as personal transformation through
                building inner strength for outer shine. As an international
                keynote speaker, FRSPH fellow, award-winning author, and CEO of
                MESMA, he has applied these dimensions across 500+ corporate
                assessments in 12 countries — transforming how organizations
                understand and develop decision intelligence at scale.
              </p>
              <button
                type="button"
                onClick={() => onNavigate("assessment")}
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: "#C8A24A", color: "#1B4332" }}
                data-ocid="dimensions.primary_button"
              >
                Take the Assessment →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section
        className="py-20 px-6 text-center"
        style={{
          background:
            "linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #1B4332 100%)",
          borderTop: "1px solid rgba(200,162,74,0.2)",
        }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Discover Your Dimension Profile
        </h2>
        <p className="mb-8 text-lg" style={{ color: "#B8D4B8" }}>
          36 questions. 6 dimensions. A complete map of your decision
          intelligence.
        </p>
        <button
          type="button"
          onClick={() => onNavigate("assessment")}
          className="px-10 py-4 rounded-xl font-bold text-lg transition-all hover:opacity-90 active:scale-95 shadow-xl"
          style={{ background: "#C8A24A", color: "#1B4332" }}
          data-ocid="dimensions.submit_button"
        >
          Start Your Assessment
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
