import { motion } from "motion/react";
import { Footer } from "../components/Footer";

const DIMENSIONS = [
  {
    abbr: "PM",
    name: "Process Management",
    color: "#C8A24A",
    desc: "Structured, systematic approaches to decision-making workflows that ensure consistency and rigor across high-stakes choices.",
  },
  {
    abbr: "EM",
    name: "Emotional Management",
    color: "#7B9FC7",
    desc: "Regulation of emotional states to enable clear judgment and leverage self-awareness as a strategic decision asset.",
  },
  {
    abbr: "RRM",
    name: "Risk & Reward Management",
    color: "#82B89A",
    desc: "Calibrated assessment of uncertainty versus opportunity, with sophisticated scenario-planning and tolerance thresholds.",
  },
  {
    abbr: "IAI",
    name: "Information & Analytical Intelligence",
    color: "#C4A882",
    desc: "Data gathering, synthesis, and analytical reasoning that reduces cognitive bias and elevates decision quality.",
  },
  {
    abbr: "SIS",
    name: "Social & Interpersonal Skills",
    color: "#A688C4",
    desc: "Leveraging relationships, stakeholder dynamics, and collaborative intelligence to reach better collective decisions.",
  },
  {
    abbr: "EDI",
    name: "Executive Decision Intelligence",
    color: "#E08A7A",
    desc: "Strategic thinking, high-stakes decision execution, and full accountability for outcomes at the highest levels.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Take the Assessment",
    desc: "Complete 36 scientifically-designed questions across 6 decision dimensions. Takes 10–15 minutes.",
  },
  {
    num: "02",
    title: "Get Your Score",
    desc: "Receive your personalized scores for each dimension and your overall Decision Force Level.",
  },
  {
    num: "03",
    title: "Unlock Your Report",
    desc: "Access your archetype profile, strengths analysis, and tailored development recommendations.",
  },
];

const SAMPLE_SCORES = [
  { dimension: "PM", score: 5.8 },
  { dimension: "EM", score: 4.9 },
  { dimension: "RRM", score: 5.2 },
  { dimension: "IAI", score: 6.1 },
  { dimension: "SIS", score: 4.4 },
  { dimension: "EDI", score: 5.6 },
];

function StaticRadarChart() {
  const cx = 160;
  const cy = 160;
  const r = 120;
  const levels = [1, 2, 3, 4, 5, 6, 7];
  const n = SAMPLE_SCORES.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const polygonPoints = (radius: number) =>
    Array.from({ length: n }, (_, i) => {
      const a = angle(i);
      const x = cx + radius * Math.cos(a);
      const y = cy + radius * Math.sin(a);
      return `${x},${y}`;
    }).join(" ");

  const dataPoints = SAMPLE_SCORES.map((s, i) => {
    const a = angle(i);
    const normalized = (s.score / 7) * r;
    return {
      x: cx + normalized * Math.cos(a),
      y: cy + normalized * Math.sin(a),
    };
  });

  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg
      width="320"
      height="320"
      viewBox="0 0 320 320"
      className="w-full max-w-xs mx-auto"
      aria-hidden="true"
    >
      {levels.map((l) => (
        <polygon
          key={l}
          points={polygonPoints((l / 7) * r)}
          fill="none"
          stroke="#C8A24A"
          strokeOpacity={l === 7 ? 0.4 : 0.15}
          strokeWidth={l === 7 ? 1.5 : 1}
        />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const a = angle(i);
        return (
          <line
            key={a}
            x1={cx}
            y1={cy}
            x2={cx + r * Math.cos(a)}
            y2={cy + r * Math.sin(a)}
            stroke="#C8A24A"
            strokeOpacity={0.2}
            strokeWidth={1}
          />
        );
      })}
      <polygon
        points={dataPolygon}
        fill="#C8A24A"
        fillOpacity={0.2}
        stroke="#C8A24A"
        strokeWidth={2}
      />
      {dataPoints.map((p) => (
        <circle key={p.x} cx={p.x} cy={p.y} r={4} fill="#C8A24A" />
      ))}
      {SAMPLE_SCORES.map((s, i) => {
        const a = angle(i);
        const labelR = r + 22;
        const x = cx + labelR * Math.cos(a);
        const y = cy + labelR * Math.sin(a);
        return (
          <text
            key={s.dimension}
            x={x}
            y={y + 4}
            textAnchor="middle"
            fill="#C8A24A"
            fontSize="11"
            fontWeight="600"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            {s.dimension}
          </text>
        );
      })}
    </svg>
  );
}

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #081C2F 0%, #0B2A45 60%, #0D3358 100%)",
        }}
      >
        {/* Hexagon accents */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg
            className="absolute top-[-40px] right-[-60px] opacity-20"
            width="400"
            height="400"
            viewBox="0 0 400 400"
            aria-hidden="true"
          >
            <polygon
              points="200,10 380,110 380,290 200,390 20,290 20,110"
              fill="none"
              stroke="#C8A24A"
              strokeWidth="1.5"
            />
            <polygon
              points="200,50 340,130 340,270 200,350 60,270 60,130"
              fill="none"
              stroke="#C8A24A"
              strokeWidth="1"
            />
          </svg>
          <svg
            className="absolute bottom-[-60px] left-[-40px] opacity-10"
            width="300"
            height="300"
            viewBox="0 0 300 300"
            aria-hidden="true"
          >
            <polygon
              points="150,5 290,80 290,220 150,295 10,220 10,80"
              fill="#C8A24A"
              stroke="#C8A24A"
              strokeWidth="1"
            />
          </svg>
          <svg
            className="absolute top-1/2 left-1/4 opacity-10"
            width="80"
            height="80"
            viewBox="0 0 80 80"
            aria-hidden="true"
          >
            <polygon points="40,2 75,21 75,59 40,78 5,59 5,21" fill="#C8A24A" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6"
                style={{
                  backgroundColor: "rgba(200,162,74,0.15)",
                  color: "#C8A24A",
                  border: "1px solid rgba(200,162,74,0.3)",
                }}
              >
                <span>◆</span> Decision Intelligence Assessment
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                Discover Your <br />
                Decision Intelligence
                <br />
                <span style={{ color: "#C8A24A" }}>HDA-DCFM</span>
              </h1>
              <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-lg">
                A scientifically-structured 36-question assessment measuring
                your decision-making across 6 critical dimensions. Get your
                archetype, force level, and a personalized growth roadmap.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate("assessment")}
                  className="px-8 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 active:scale-95 shadow-gold"
                  style={{ backgroundColor: "#C8A24A", color: "#081C2F" }}
                  data-ocid="hero.primary_button"
                >
                  Get Your Personalized Report
                </button>
                <button
                  type="button"
                  className="px-8 py-4 rounded-xl font-semibold text-base text-white/80 border border-white/20 hover:border-white/40 hover:text-white transition-all"
                  onClick={() => onNavigate("learnmore")}
                  data-ocid="hero.secondary_button"
                >
                  Learn More
                </button>
              </div>
              <div className="mt-10 flex gap-8">
                {[
                  ["36", "Questions"],
                  ["6", "Dimensions"],
                  ["10", "Archetypes"],
                ].map(([num, lbl]) => (
                  <div key={lbl}>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: "#C8A24A" }}
                    >
                      {num}
                    </div>
                    <div className="text-xs text-white/50 mt-0.5">{lbl}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: illustration */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <svg
                width="480"
                height="400"
                viewBox="0 0 480 400"
                className="w-full max-w-md"
                aria-hidden="true"
              >
                <rect
                  x="60"
                  y="40"
                  width="340"
                  height="240"
                  rx="16"
                  fill="#0D3358"
                  stroke="rgba(200,162,74,0.3)"
                  strokeWidth="1.5"
                />
                <rect
                  x="60"
                  y="40"
                  width="340"
                  height="40"
                  rx="16"
                  fill="rgba(200,162,74,0.12)"
                />
                <rect
                  x="60"
                  y="64"
                  width="340"
                  height="16"
                  fill="rgba(200,162,74,0.12)"
                />
                <circle cx="85" cy="62" r="5" fill="#E08A7A" opacity="0.8" />
                <circle cx="103" cy="62" r="5" fill="#C8A24A" opacity="0.8" />
                <circle cx="121" cy="62" r="5" fill="#82B89A" opacity="0.8" />
                <text
                  x="155"
                  y="66"
                  fill="white"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="Plus Jakarta Sans"
                >
                  Decision Intelligence Dashboard
                </text>
                <g transform="translate(130,160)">
                  {[1, 2, 3].map((l) => (
                    <polygon
                      key={l}
                      points={`0,${-l * 28} ${l * 24.2},${-l * 14} ${l * 24.2},${l * 14} 0,${l * 28} ${-l * 24.2},${l * 14} ${-l * 24.2},${-l * 14}`}
                      fill="none"
                      stroke="#C8A24A"
                      strokeOpacity={0.2}
                      strokeWidth={1}
                    />
                  ))}
                  <polygon
                    points="0,-62 40,-18 30,40 -22,50 -50,5 -25,-55"
                    fill="#C8A24A"
                    fillOpacity={0.25}
                    stroke="#C8A24A"
                    strokeWidth={2}
                  />
                  {[
                    [-0, -62],
                    [40, -18],
                    [30, 40],
                    [-22, 50],
                    [-50, 5],
                    [-25, -55],
                  ].map(([px, py]) => (
                    <circle
                      key={String(px) + String(py)}
                      cx={px}
                      cy={py}
                      r={3}
                      fill="#C8A24A"
                    />
                  ))}
                </g>
                {["PM", "EM", "RRM", "IAI", "SIS", "EDI"].map((d, i) => (
                  <g key={d}>
                    <text
                      x="290"
                      y={110 + i * 22}
                      fill="#B9C3CF"
                      fontSize="9"
                      fontFamily="Plus Jakarta Sans"
                    >
                      {d}
                    </text>
                    <rect
                      x="315"
                      y={100 + i * 22}
                      width={50}
                      height="8"
                      rx="4"
                      fill="rgba(200,162,74,0.1)"
                    />
                    <rect
                      x="315"
                      y={100 + i * 22}
                      width={[38, 32, 40, 44, 28, 41][i]}
                      height="8"
                      rx="4"
                      fill="#C8A24A"
                      opacity="0.7"
                    />
                  </g>
                ))}
                <circle
                  cx="240"
                  cy="330"
                  r="24"
                  fill="rgba(200,162,74,0.15)"
                  stroke="#C8A24A"
                  strokeWidth="1.5"
                />
                <circle
                  cx="240"
                  cy="322"
                  r="10"
                  fill="rgba(200,162,74,0.3)"
                  stroke="#C8A24A"
                  strokeWidth="1.5"
                />
                <polygon
                  points="420,70 440,82 440,106 420,118 400,106 400,82"
                  fill="none"
                  stroke="#C8A24A"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
                <polygon
                  points="40,200 55,209 55,227 40,236 25,227 25,209"
                  fill="#C8A24A"
                  opacity="0.25"
                />
                <polygon
                  points="430,250 445,259 445,277 430,286 415,277 415,259"
                  fill="#C8A24A"
                  opacity="0.2"
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: "#081C2F" }}
            >
              How It Works
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Three simple steps to unlock your full decision intelligence
              profile.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-gray-100 shadow-card hover:shadow-md transition-shadow"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-6"
                  style={{ backgroundColor: "#081C2F", color: "#C8A24A" }}
                >
                  {step.num}
                </div>
                <h3
                  className="font-bold text-lg mb-3"
                  style={{ color: "#081C2F" }}
                >
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 Dimensions */}
      <section className="py-24" style={{ backgroundColor: "#F3F6F9" }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: "#081C2F" }}
            >
              The 6 Dimensions of Decision Intelligence
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Each dimension measures a distinct and critical component of
              decision-making excellence, validated across leadership contexts.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DIMENSIONS.map((dim, i) => (
              <motion.div
                key={dim.abbr}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white rounded-2xl p-7 shadow-card border border-gray-100 hover:border-gold/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="inline-flex items-center justify-center w-11 h-11 rounded-xl text-sm font-bold"
                    style={{
                      backgroundColor: `${dim.color}20`,
                      color: dim.color,
                    }}
                  >
                    {dim.abbr}
                  </span>
                  <h3
                    className="font-bold text-base"
                    style={{ color: "#081C2F" }}
                  >
                    {dim.name}
                  </h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {dim.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Radar Chart Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: "#081C2F" }}
            >
              Decision Intelligence Radar Chart
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Visualize your decision profile across all six dimensions in a
              single, powerful snapshot.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center"
            >
              <div
                className="rounded-2xl p-8"
                style={{
                  background:
                    "linear-gradient(135deg, #081C2F 0%, #0B2A45 100%)",
                }}
              >
                <StaticRadarChart />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-6"
                style={{
                  backgroundColor: "rgba(200,162,74,0.1)",
                  color: "#C8A24A",
                  border: "1px solid rgba(200,162,74,0.3)",
                }}
              >
                Sample Profile: The Analytical Navigator
              </div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: "#081C2F" }}
              >
                Detailed Analysis &amp; Recommendations
              </h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Your results include a comprehensive breakdown of each
                dimension, your decision archetype, force level classification,
                and a personalized development roadmap.
              </p>
              <ul className="space-y-3">
                {[
                  "Dimension-by-dimension score interpretation",
                  "Archetype name and profile description",
                  "Top 2 strength areas highlighted",
                  "Bottom 2 growth areas identified",
                  "3–5 personalized coaching recommendations",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-gray-600"
                  >
                    <span className="mt-0.5" style={{ color: "#C8A24A" }}>
                      ◆
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => onNavigate("assessment")}
                className="mt-8 px-8 py-4 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "#C8A24A", color: "#081C2F" }}
                data-ocid="preview.primary_button"
              >
                Start Your Assessment
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Mind Behind elidi */}
      <section
        className="py-20 px-4"
        style={{
          background:
            "linear-gradient(135deg, #061218 0%, #081C2F 60%, #0a2010 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div
              className="w-16 h-0.5 mx-auto mb-8"
              style={{ backgroundColor: "#C8A24A" }}
            />
            <p
              className="text-xs tracking-[0.35em] uppercase mb-6"
              style={{ color: "#C8A24A" }}
            >
              The Mind Behind elidi
            </p>
          </div>

          {/* Two-column: photo left, text right */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-14">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-shrink-0 flex justify-center"
            >
              <div
                className="rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  border: "2px solid rgba(200,162,74,0.35)",
                }}
              >
                <img
                  src="/assets/uploads/05-2-1.jpg"
                  alt="Sathish Sampath"
                  className="rounded-2xl object-cover"
                  style={{
                    width: "200px",
                    height: "260px",
                    objectPosition: "50% 10%",
                  }}
                />
              </div>
            </motion.div>

            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-1 min-w-0"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                Sathish Sampath, <span style={{ color: "#C8A24A" }}>FRSPH</span>
              </h2>
              <p
                className="text-sm tracking-widest uppercase mb-6"
                style={{ color: "#C8A24A99" }}
              >
                Human Decision Architect&nbsp;&nbsp;·&nbsp;&nbsp;Mind Hack
                Specialist&nbsp;&nbsp;·&nbsp;&nbsp;CEO, MESMA
              </p>
              <p className="text-base md:text-lg text-white/75 leading-relaxed mb-10">
                A Licensed Psychologist (Hypnotherapist) and Behavioural
                Psychology Researcher, internationally acclaimed Keynote
                Speaker, and Award-Winning Author — Sathish has spent decades
                decoding the invisible forces that shape human decisions. He
                extensively works in Understanding Decision Science for Business
                across Sales, Marketing, Branding, and GTM Strategies, and in
                personal transformation through building inner strength for
                outer shine. Prior to elidi, Sathish has been part of
                groundbreaking research initiatives —{" "}
                <strong>Project MESMA</strong> (world&apos;s first Neurovisceral
                Model based Human Emotional Companion),{" "}
                <strong>NeuroStill</strong>,{" "}
                <strong>Cognitive Terraforming</strong>, and{" "}
                <strong>Project Future Human</strong> — research-based projects
                with IP tagged to MESMA.{" "}
                <span className="text-white font-medium">
                  elidi is his brainchild
                </span>
                : the world&apos;s first HDA-DCFM-based decision intelligence
                framework, engineered to transform how you think, choose, and
                lead.
              </p>
              <div
                className="w-16 h-0.5"
                style={{ backgroundColor: "#C8A24A33" }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
