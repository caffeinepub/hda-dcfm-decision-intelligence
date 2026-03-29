import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Footer } from "../components/Footer";

const DIMENSIONS = [
  {
    abbr: "PM",
    name: "Process Management",
    color: "#C8A24A",
    desc: "Structured, systematic approaches to decision-making workflows that ensure consistency and rigor across high-stakes choices.",
    brainInsight:
      "Pattern recognition activates the prefrontal cortex during structured decision flows, reinforcing systematic judgment pathways.",
  },
  {
    abbr: "EM",
    name: "Emotional Management",
    color: "#7B9FC7",
    desc: "Regulation of emotional states to enable clear judgment and leverage self-awareness as a strategic decision asset.",
    brainInsight:
      "Amygdala modulation through conscious reappraisal keeps emotional reactivity from hijacking executive function.",
  },
  {
    abbr: "RRM",
    name: "Risk & Reward Management",
    color: "#82B89A",
    desc: "Calibrated assessment of uncertainty versus opportunity, with sophisticated scenario-planning and tolerance thresholds.",
    brainInsight:
      "The anterior insula integrates somatic signals with the orbitofrontal cortex to calibrate risk-reward calculus.",
  },
  {
    abbr: "IAI",
    name: "Information & Analytical Intelligence",
    color: "#C4A882",
    desc: "Data gathering, synthesis, and analytical reasoning that reduces cognitive bias and elevates decision quality.",
    brainInsight:
      "Dorsolateral prefrontal activation drives analytical depth, suppressing confirmation bias via working-memory gating.",
  },
  {
    abbr: "SIS",
    name: "Social & Interpersonal Skills",
    color: "#A688C4",
    desc: "Leveraging relationships, stakeholder dynamics, and collaborative intelligence to reach better collective decisions.",
    brainInsight:
      "Mirror neuron networks in the inferior frontal gyrus enable real-time social signal decoding during group decisions.",
  },
  {
    abbr: "EDI",
    name: "Executive Decision Intelligence",
    color: "#E08A7A",
    desc: "Strategic thinking, high-stakes decision execution, and full accountability for outcomes at the highest levels.",
    brainInsight:
      "Superior prefrontal-thalamic circuits sustain strategic intent under high-stakes cognitive load and uncertainty.",
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

const STATS = [
  { value: 500, suffix: "+", label: "Profiles Analyzed" },
  { value: 6, suffix: "", label: "Decision Dimensions" },
  { value: 16, suffix: "", label: "Product Lines" },
  { value: 40, suffix: "+", label: "Countries" },
];

// ─── DCFM Particle Field Canvas ─────────────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

function DCFMParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ w: 480, h: 400 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const init = (w: number, h: number) => {
      sizeRef.current = { w, h };
      canvas.width = w;
      canvas.height = h;
      particlesRef.current = Array.from({ length: 60 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 2.5 + 1,
      }));
    };

    init(480, 400);

    const draw = () => {
      const { w, h } = sizeRef.current;
      ctx.clearRect(0, 0, w, h);

      const pts = particlesRef.current;
      // Update
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        // Clamp
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));
      }

      // Draw connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(200,162,74,${0.15 * (1 - dist / 80)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200,162,74,0.6)";
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        const w = Math.min(width, 480);
        const h = Math.round(w * (400 / 480));
        init(w, h);
      }
    });
    ro.observe(canvas.parentElement!);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      className="relative w-full max-w-md mx-auto"
      style={{ aspectRatio: "480/400" }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
      {/* Overlay text */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ userSelect: "none" }}
      >
        <div
          className="text-6xl font-bold tracking-wider"
          style={{
            color: "#C8A24A",
            fontFamily: "Playfair Display, serif",
            textShadow: "0 0 30px rgba(200,162,74,0.5)",
          }}
        >
          DCFM
        </div>
        <div
          className="text-xs tracking-[0.2em] uppercase mt-2 text-center px-4"
          style={{ color: "rgba(200,162,74,0.7)" }}
        >
          Dynamic Cognitive Field Manifold
        </div>
        <div
          className="mt-4 px-3 py-1 rounded-full text-xs"
          style={{
            backgroundColor: "rgba(200,162,74,0.1)",
            color: "rgba(200,162,74,0.6)",
            border: "1px solid rgba(200,162,74,0.2)",
          }}
        >
          Patent Pending · Sathish Sampath &amp; MESMA
        </div>
      </div>
    </div>
  );
}

// ─── Stats Counter ────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const current = Math.round(eased * target);
      if (current !== start) {
        setCount(current);
        start = current;
      }
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return count;
}

function StatItem({
  stat,
  active,
}: { stat: (typeof STATS)[0]; active: boolean }) {
  const count = useCountUp(stat.value, 1800, active);
  return (
    <div
      className="flex flex-col items-center text-center px-6"
      style={{
        borderBottom: "2px solid rgba(200,162,74,0.4)",
        paddingBottom: "1.5rem",
      }}
    >
      <span
        className="text-5xl font-bold"
        style={{ color: "#C8A24A", fontFamily: "Playfair Display, serif" }}
      >
        {count}
        {stat.suffix}
      </span>
      <span
        className="text-xs tracking-widest uppercase mt-2"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        {stat.label}
      </span>
    </div>
  );
}

function StatsCounterRow() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        background:
          "linear-gradient(135deg, #061218 0%, #081C2F 50%, #0a1f10 100%)",
        borderTop: "1px solid rgba(200,162,74,0.15)",
        borderBottom: "1px solid rgba(200,162,74,0.15)",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {STATS.map((s) => (
            <StatItem key={s.label} stat={s} active={active} />
          ))}
        </motion.div>
        <div className="mt-8 text-center">
          <p
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: "rgba(200,162,74,0.45)" }}
          >
            Powered by the Dynamic Cognitive Field Manifold · Patent Pending
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Brain Neural Map ─────────────────────────────────────────────────────────
const BRAIN_REGIONS = [
  {
    abbr: "PM",
    name: "Process Management",
    color: "#C8A24A",
    cx: 260,
    cy: 110,
    r: 28,
  },
  {
    abbr: "EM",
    name: "Emotional Management",
    color: "#7B9FC7",
    cx: 170,
    cy: 155,
    r: 26,
  },
  {
    abbr: "RRM",
    name: "Risk & Reward",
    color: "#82B89A",
    cx: 340,
    cy: 170,
    r: 26,
  },
  {
    abbr: "IAI",
    name: "Analytical Intel.",
    color: "#C4A882",
    cx: 210,
    cy: 235,
    r: 27,
  },
  {
    abbr: "SIS",
    name: "Social Skills",
    color: "#A688C4",
    cx: 310,
    cy: 250,
    r: 25,
  },
  {
    abbr: "EDI",
    name: "Executive Intel.",
    color: "#E08A7A",
    cx: 260,
    cy: 300,
    r: 29,
  },
];

const SYNAPSES = [
  { x1: 260, y1: 110, x2: 170, y2: 155 },
  { x1: 260, y1: 110, x2: 340, y2: 170 },
  { x1: 170, y1: 155, x2: 210, y2: 235 },
  { x1: 340, y1: 170, x2: 310, y2: 250 },
  { x1: 210, y1: 235, x2: 310, y2: 250 },
  { x1: 210, y1: 235, x2: 260, y2: 300 },
  { x1: 310, y1: 250, x2: 260, y2: 300 },
  { x1: 260, y1: 110, x2: 210, y2: 235 },
  { x1: 170, y1: 155, x2: 310, y2: 250 },
];

function BrainNeuralMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      style={{
        background: "linear-gradient(180deg, #061218 0%, #081C2F 100%)",
      }}
      className="py-24"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{
              backgroundColor: "rgba(200,162,74,0.1)",
              color: "#C8A24A",
              border: "1px solid rgba(200,162,74,0.25)",
            }}
          >
            🧠 Neuroscience Foundation
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            The Neural Architecture of Decision Intelligence
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            DCFM maps decision pathways across 6 distinct cognitive regions,
            mirroring how the brain actually processes high-stakes choices at
            the neurological level.
          </p>
        </motion.div>

        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* SVG Brain */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center"
          >
            <div className="relative">
              <svg
                width="500"
                height="380"
                viewBox="0 0 500 380"
                className="w-full max-w-lg"
                aria-hidden="true"
              >
                {/* CSS animations */}
                <defs>
                  <style>{`
                    @keyframes neural-dash {
                      0% { stroke-dashoffset: 200; }
                      100% { stroke-dashoffset: 0; }
                    }
                    @keyframes pulse-node {
                      0%, 100% { transform: scale(1); }
                      50% { transform: scale(1.15); }
                    }
                    @keyframes glow-pulse {
                      0%, 100% { opacity: 0.4; }
                      50% { opacity: 0.9; }
                    }
                    .synapse-path {
                      stroke-dasharray: 8 5;
                      stroke-dashoffset: 200;
                      animation: neural-dash 2s linear infinite;
                    }
                    .brain-node {
                      transform-box: fill-box;
                      transform-origin: center;
                    }
                    .brain-node.active {
                      animation: pulse-node 2.5s ease-in-out infinite;
                    }
                    .glow-ring {
                      animation: glow-pulse 2.5s ease-in-out infinite;
                    }
                  `}</style>
                  <radialGradient id="bg-grad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(45,106,79,0.12)" />
                    <stop offset="100%" stopColor="rgba(6,18,24,0)" />
                  </radialGradient>
                  {BRAIN_REGIONS.map((reg) => (
                    <radialGradient
                      key={`grd-${reg.abbr}`}
                      id={`grd-${reg.abbr}`}
                      cx="50%"
                      cy="50%"
                      r="50%"
                    >
                      <stop
                        offset="0%"
                        stopColor={reg.color}
                        stopOpacity="0.9"
                      />
                      <stop
                        offset="100%"
                        stopColor={reg.color}
                        stopOpacity="0.3"
                      />
                    </radialGradient>
                  ))}
                </defs>

                {/* Background glow */}
                <ellipse
                  cx="250"
                  cy="200"
                  rx="220"
                  ry="160"
                  fill="url(#bg-grad)"
                />

                {/* Brain outline - stylized side profile */}
                <path
                  d="M 100 240 C 80 200 75 160 90 130 C 105 100 130 80 160 72 C 185 65 210 70 230 65 C 255 58 280 48 310 52 C 345 57 375 78 390 108 C 408 142 408 180 400 210 C 392 238 375 260 355 272 C 335 285 310 288 285 285 C 270 283 258 278 248 280 C 238 282 228 290 215 292 C 195 296 172 290 158 278 C 140 263 118 255 100 240 Z"
                  fill="none"
                  stroke="rgba(200,162,74,0.2)"
                  strokeWidth="2"
                />
                {/* Inner brain folds */}
                <path
                  d="M 160 130 C 180 120 200 125 215 140"
                  fill="none"
                  stroke="rgba(200,162,74,0.1)"
                  strokeWidth="1.5"
                />
                <path
                  d="M 215 140 C 230 155 225 170 210 178"
                  fill="none"
                  stroke="rgba(200,162,74,0.1)"
                  strokeWidth="1.5"
                />
                <path
                  d="M 280 120 C 300 112 320 118 330 135"
                  fill="none"
                  stroke="rgba(200,162,74,0.1)"
                  strokeWidth="1.5"
                />
                <path
                  d="M 200 200 C 215 190 235 195 245 210"
                  fill="none"
                  stroke="rgba(200,162,74,0.08)"
                  strokeWidth="1.5"
                />
                <path
                  d="M 300 200 C 320 192 340 198 348 215"
                  fill="none"
                  stroke="rgba(200,162,74,0.08)"
                  strokeWidth="1.5"
                />

                {/* Synapse pathways */}
                {SYNAPSES.map((s, i) => (
                  <line
                    key={`${s.x1}-${s.y1}-${s.x2}-${s.y2}`}
                    x1={s.x1}
                    y1={s.y1}
                    x2={s.x2}
                    y2={s.y2}
                    stroke="rgba(200,162,74,0.25)"
                    strokeWidth="1"
                    className="synapse-path"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                ))}

                {/* Glow rings */}
                {BRAIN_REGIONS.map((reg) => (
                  <circle
                    key={`glow-${reg.abbr}`}
                    cx={reg.cx}
                    cy={reg.cy}
                    r={reg.r + 10}
                    fill="none"
                    stroke={reg.color}
                    strokeWidth="1"
                    className="glow-ring"
                    style={{
                      animationDelay: `${BRAIN_REGIONS.indexOf(reg) * 0.4}s`,
                    }}
                  />
                ))}

                {/* Brain region nodes */}
                {BRAIN_REGIONS.map((reg) => (
                  <g
                    key={reg.abbr}
                    className={`brain-node ${visible ? "active" : ""}`}
                    style={{
                      animationDelay: `${BRAIN_REGIONS.indexOf(reg) * 0.35}s`,
                    }}
                  >
                    <circle
                      cx={reg.cx}
                      cy={reg.cy}
                      r={reg.r}
                      fill={`url(#grd-${reg.abbr})`}
                    />
                    <circle
                      cx={reg.cx}
                      cy={reg.cy}
                      r={reg.r}
                      fill="none"
                      stroke={reg.color}
                      strokeWidth="1.5"
                    />
                    <text
                      x={reg.cx}
                      y={reg.cy + 5}
                      textAnchor="middle"
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="Plus Jakarta Sans, sans-serif"
                    >
                      {reg.abbr}
                    </text>
                  </g>
                ))}

                {/* Callout lines + labels */}
                <line
                  x1="260"
                  y1="82"
                  x2="260"
                  y2="52"
                  stroke="rgba(200,162,74,0.3)"
                  strokeWidth="1"
                />
                <text
                  x="260"
                  y="46"
                  textAnchor="middle"
                  fill="#C8A24A"
                  fontSize="9"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                >
                  Process Mgmt
                </text>

                <line
                  x1="142"
                  y1="155"
                  x2="110"
                  y2="155"
                  stroke="rgba(123,159,199,0.4)"
                  strokeWidth="1"
                />
                <text
                  x="105"
                  y="151"
                  textAnchor="end"
                  fill="#7B9FC7"
                  fontSize="9"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                >
                  Emotion
                </text>

                <line
                  x1="366"
                  y1="170"
                  x2="400"
                  y2="155"
                  stroke="rgba(130,184,154,0.4)"
                  strokeWidth="1"
                />
                <text
                  x="405"
                  y="151"
                  textAnchor="start"
                  fill="#82B89A"
                  fontSize="9"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                >
                  Risk/Reward
                </text>

                <line
                  x1="183"
                  y1="250"
                  x2="145"
                  y2="260"
                  stroke="rgba(196,168,130,0.4)"
                  strokeWidth="1"
                />
                <text
                  x="140"
                  y="256"
                  textAnchor="end"
                  fill="#C4A882"
                  fontSize="9"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                >
                  Analytics
                </text>

                <line
                  x1="335"
                  y1="260"
                  x2="375"
                  y2="268"
                  stroke="rgba(166,136,196,0.4)"
                  strokeWidth="1"
                />
                <text
                  x="380"
                  y="264"
                  textAnchor="start"
                  fill="#A688C4"
                  fontSize="9"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                >
                  Social
                </text>

                <line
                  x1="260"
                  y1="329"
                  x2="260"
                  y2="355"
                  stroke="rgba(224,138,122,0.4)"
                  strokeWidth="1"
                />
                <text
                  x="260"
                  y="365"
                  textAnchor="middle"
                  fill="#E08A7A"
                  fontSize="9"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                >
                  Executive Intel.
                </text>
              </svg>
            </div>
          </motion.div>

          {/* Dimension insight cards */}
          <div className="space-y-3">
            {DIMENSIONS.map((dim, i) => (
              <motion.div
                key={dim.abbr}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-start gap-3 rounded-xl p-4"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: `1px solid ${dim.color}25`,
                }}
              >
                <span
                  className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: `${dim.color}20`,
                    color: dim.color,
                    border: `1px solid ${dim.color}40`,
                  }}
                >
                  {dim.abbr}
                </span>
                <div>
                  <div
                    className="text-xs font-bold mb-1"
                    style={{ color: dim.color }}
                  >
                    {dim.name}
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">
                    {dim.brainInsight}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Static Radar Chart ───────────────────────────────────────────────────────
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

// ─── Landing Page ─────────────────────────────────────────────────────────────
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

            {/* Right: DCFM Particle Field */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <DCFMParticleField />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Counter Row */}
      <StatsCounterRow />

      {/* ─── DCFM Science Callout ────────────────────────────── */}
      <section
        className="py-20"
        style={{
          background:
            "linear-gradient(135deg, #061218 0%, #0a1f10 50%, #081C2F 100%)",
          borderTop: "1px solid rgba(200,162,74,0.2)",
          borderBottom: "1px solid rgba(200,162,74,0.2)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl p-10 md:p-14 text-center"
            style={{
              background: "rgba(200,162,74,0.04)",
              border: "2px solid rgba(200,162,74,0.35)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6"
              style={{
                backgroundColor: "rgba(200,162,74,0.15)",
                color: "#C8A24A",
                border: "1px solid rgba(200,162,74,0.4)",
              }}
            >
              🔬 Patent Pending · Original Invention
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              The World&apos;s First{" "}
              <span style={{ color: "#C8A24A" }}>
                Cognitive Decision Intelligence
              </span>{" "}
              Platform
            </h2>
            <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
              Built on the{" "}
              <strong style={{ color: "#C8A24A" }}>
                Dynamic Cognitive Field Manifold (DCFM)
              </strong>{" "}
              — a breakthrough model by Sathish Sampath &amp; MESMA that maps
              how the human brain actually constructs, evaluates, and executes
              decisions. This is not a personality test. This is decision
              science.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 text-left">
              {[
                {
                  icon: "🧬",
                  title: "Neuroscience-Rooted",
                  desc: "Every dimension maps to real neural pathways — prefrontal cortex, amygdala, insula, and more — for scientifically grounded results.",
                },
                {
                  icon: "📐",
                  title: "Mathematical Precision",
                  desc: "DCFM uses a manifold-based mathematical model to represent decision state-space — far beyond simple questionnaire scoring.",
                },
                {
                  icon: "🔄",
                  title: "Adaptive & Living",
                  desc: "Your Mind Twin evolves with every session, building a living cognitive map that grows more accurate over time.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl p-6"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(200,162,74,0.2)",
                  }}
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Why elidi vs Traditional Tools ──────────────────── */}
      <section
        className="py-24"
        style={{
          background: "linear-gradient(180deg, #061218 0%, #0a1a0a 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <div
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
              style={{
                background: "rgba(200,162,74,0.12)",
                color: "#C8A24A",
                border: "1px solid rgba(200,162,74,0.3)",
              }}
            >
              The elidi Difference
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Not Another Personality Test
            </h2>
            <p className="text-white/55 max-w-2xl mx-auto text-lg">
              elidi is in a completely different category from every tool that
              came before it.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Traditional tools */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl p-8"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="text-white/40 text-sm font-bold tracking-widest uppercase mb-6">
                Traditional Tools (Myers-Briggs / DISC / Big Five)
              </div>
              {[
                "Snapshot in time — static, never evolves",
                "Categories personalities, not decisions",
                "No neuroscience backing or mathematical model",
                "Cannot predict decisions under pressure",
                "Individual profiles only — no team or org intelligence",
                "Generic archetypes that don't guide real action",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 mb-4 text-white/50 text-sm"
                >
                  <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>
                  {item}
                </div>
              ))}
            </motion.div>
            {/* elidi */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl p-8"
              style={{
                background: "rgba(200,162,74,0.06)",
                border: "2px solid rgba(200,162,74,0.4)",
              }}
            >
              <div
                style={{ color: "#C8A24A" }}
                className="text-sm font-bold tracking-widest uppercase mb-6"
              >
                elidi — DCFM Decision Intelligence Platform
              </div>
              {[
                "Living Mind Twin — evolves with every training session",
                "Measures 6 decision dimensions with neuroscience precision",
                "Mathematical manifold model (DCFM) — patent pending",
                "Predicts decisions under pressure with scenario simulation",
                "Team, org, clinical, and enterprise-grade analytics",
                "Actionable cognitive coaching with personalised roadmaps",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 mb-4 text-white text-sm"
                >
                  <span
                    style={{ color: "#C8A24A" }}
                    className="mt-0.5 flex-shrink-0"
                  >
                    ✓
                  </span>
                  {item}
                </div>
              ))}
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

      {/* ─── Real-World Decision Intelligence ──────────────── */}
      <section className="py-24" style={{ background: "#F3F6F9" }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
              style={{
                background: "#e8f5ee",
                color: "#1B4332",
                border: "1px solid rgba(27,67,50,0.2)",
              }}
            >
              Real-World Impact
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "#081C2F" }}
            >
              Intelligence That Changes Everything
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              From the boardroom to the therapy room, elidi turns cognitive
              science into real-world advantage.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: "🎯",
                headline: "Hire with cognitive certainty, not gut feel",
                body: "A high-IAI, low-SIS candidate is brilliant alone but struggles in consensus-driven teams. Know this before the first interview. elidi maps cognitive fit to role requirements with scientific precision.",
                tag: "For HR & Talent Leaders",
                color: "#1B4332",
                bg: "#f0f9f4",
              },
              {
                icon: "⚡",
                headline: "Predict team conflicts before they cost you",
                body: "Three high-EM profiles under deadline pressure — DCFM knows exactly where the friction will come from and when. Reorganise the team architecture before the project starts, not after it fails.",
                tag: "For CEOs & Team Managers",
                color: "#081C2F",
                bg: "#f0f4f9",
              },
              {
                icon: "🧠",
                headline: "Train your mind like you train your body",
                body: "The Mind Twin tracks your cognitive evolution across months. See your EDI improve by 1.4 points over 90 days of focused training. Measurable, accountable, transformational.",
                tag: "For Individuals & Coaches",
                color: "#4A1B4C",
                bg: "#f5f0f9",
              },
              {
                icon: "💎",
                headline: "Map your customer's decision fingerprint",
                body: "High-RRM buyers need different messaging than high-SIS buyers. elidi gives your sales and GTM teams a cognitive map of how your best customers think — and how to speak directly to their decision architecture.",
                tag: "For Sales & Marketing",
                color: "#4A2E00",
                bg: "#fdf6e8",
              },
            ].map((card) => (
              <motion.div
                key={card.headline}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl p-8 flex flex-col gap-4"
                style={{
                  background: card.bg,
                  border: `1px solid ${card.color}18`,
                }}
              >
                <div className="text-4xl">{card.icon}</div>
                <h3
                  className="text-xl font-bold leading-snug"
                  style={{ color: card.color }}
                >
                  {card.headline}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm flex-1">
                  {card.body}
                </p>
                <div
                  className="self-start px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: `${card.color}12`, color: card.color }}
                >
                  {card.tag}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brain Neural Map */}
      <BrainNeuralMap />

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
            {/* Photos */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex-shrink-0 flex justify-center gap-4"
            >
              <div
                className="rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  border: "2px solid rgba(200,162,74,0.5)",
                }}
              >
                <img
                  src="/assets/uploads/SATHISH-SAMPATH11-2-1.jpg"
                  alt="Sathish Sampath"
                  className="rounded-2xl object-cover"
                  style={{
                    width: "180px",
                    height: "240px",
                    objectPosition: "50% 10%",
                  }}
                />
              </div>
              <div
                className="rounded-2xl overflow-hidden shadow-xl hidden sm:block"
                style={{
                  border: "1px solid rgba(200,162,74,0.25)",
                }}
              >
                <img
                  src="/assets/uploads/05-2-1.jpg"
                  alt="Sathish Sampath"
                  className="rounded-2xl object-cover"
                  style={{
                    width: "160px",
                    height: "240px",
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

      {/* ─── The elidi Platform ────────────────────────────────── */}
      <section
        className="py-24"
        style={{
          background:
            "linear-gradient(135deg, #081C2F 0%, #0D2B1A 60%, #081C2F 100%)",
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
              Platform Architecture
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              The <span style={{ color: "#C8A24A" }}>elidi</span> Platform
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              One cognitive operating system. Six product clouds. Infinite
              applications for human and organisational decision intelligence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🧠",
                name: "elidi Core",
                sub: "B2C · Personal",
                color: "#C8A24A",
                desc: "The foundation. Personal assessment, Mind Twin engine, and individual decision intelligence for anyone ready to know how they truly decide.",
                products: [
                  "HDA-DCFM Assessment",
                  "Personal Mind Twin",
                  "Decision Simulation Lab",
                ],
              },
              {
                icon: "👥",
                name: "elidi People",
                sub: "Enterprise · HR",
                color: "#7B9FC7",
                desc: "Hire by cognitive fit, not just skills. Map team decision architecture for peak performance and predict conflicts before they happen.",
                products: [
                  "Hiring Intelligence",
                  "Cognitive Org Design",
                  "Team Conflict Predictor",
                ],
              },
              {
                icon: "🎯",
                name: "elidi Coach",
                sub: "Coaching · Clinical",
                color: "#82B89A",
                desc: "Give coaches and clinicians a living cognitive map of their clients — track real evolution, not just session notes.",
                products: [
                  "Coach Intelligence Platform",
                  "Clinical Decision Profiling",
                  "Cognitive Wellness Index",
                ],
              },
              {
                icon: "📈",
                name: "elidi Brands",
                sub: "Sales · Marketing",
                color: "#A688C4",
                desc: "Understand your customer's decision fingerprint. Align your GTM strategy with how your buyers actually think and choose.",
                products: [
                  "Customer Mind Twin",
                  "Negotiation Intelligence",
                  "Brand Personality Mapper",
                ],
              },
              {
                icon: "🎓",
                name: "elidi Edu",
                sub: "Education · Families",
                color: "#E08A7A",
                desc: "Help students, parents, and educators understand decision readiness, academic resilience, and life-path intelligence.",
                products: [
                  "Academic Decision Intelligence",
                  "elidi for Parents",
                  "elidi Certification",
                ],
              },
              {
                icon: "🔬",
                name: "elidi Research + API",
                sub: "Science · Infrastructure",
                color: "#C4A882",
                desc: "The infrastructure layer. Open the DCFM engine to researchers, developers, and enterprise integrations worldwide.",
                products: [
                  "Academic Research Platform",
                  "elidi Research Index",
                  "elidi API — Embed Anywhere",
                ],
              },
            ].map((cloud) => (
              <div
                key={cloud.name}
                className="rounded-2xl p-7 flex flex-col gap-4 transition-all hover:-translate-y-1 hover:shadow-2xl"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${cloud.color}33`,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-3xl">{cloud.icon}</span>
                  <div>
                    <div className="font-bold text-white text-lg leading-tight">
                      {cloud.name}
                    </div>
                    <div
                      className="text-xs tracking-wider uppercase"
                      style={{ color: cloud.color }}
                    >
                      {cloud.sub}
                    </div>
                  </div>
                </div>
                <p className="text-white/60 text-sm leading-relaxed">
                  {cloud.desc}
                </p>
                <div
                  className="flex flex-col gap-1.5 mt-auto pt-3"
                  style={{ borderTop: `1px solid ${cloud.color}22` }}
                >
                  {cloud.products.map((p) => (
                    <div
                      key={p}
                      className="flex items-center gap-2 text-xs text-white/50"
                    >
                      <span style={{ color: cloud.color }}>▸</span> {p}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Built for Business Growth ──────────────────────────── */}
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
              Enterprise Value
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "#1B4332" }}
            >
              Built for Business Growth
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Decision intelligence is the next competitive frontier. elidi
              turns invisible cognitive patterns into measurable strategic
              advantages.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🏆",
                title: "Hiring Intelligence",
                color: "#1B4332",
                desc: "Stop hiring blind. Profile cognitive decision styles before the first interview. Match role requirements to how candidates actually think under pressure — not just their CV.",
                metric: "3.2x better role retention",
              },
              {
                icon: "⚡",
                title: "Team Conflict Prevention",
                color: "#1B4332",
                desc: "High-EM + low-SIS combinations under deadline pressure are predictable. DCFM maps exactly where your team's decision architecture will fracture before it does.",
                metric: "Predict friction 6 weeks early",
              },
              {
                icon: "🎯",
                title: "Sales & GTM Alignment",
                color: "#1B4332",
                desc: "Know your buyer's decision fingerprint before they do. Align messaging, negotiation style, and sales cadence to how your customers cognitively process and commit.",
                metric: "Higher close rates, shorter cycles",
              },
              {
                icon: "🧘",
                title: "Executive Coaching ROI",
                color: "#1B4332",
                desc: "Give coaches a living cognitive map that evolves with every session. Track real mind twin progress — not just conversation notes — with measurable dimension shifts.",
                metric: "Quantified coaching outcomes",
              },
              {
                icon: "🏥",
                title: "Clinical Decision Profiling",
                color: "#1B4332",
                desc: "High EM combined with low IAI under stress is a detectable risk pattern. elidi surfaces cognitive triage flags that support — not replace — clinical judgment.",
                metric: "Early identification of stress patterns",
              },
              {
                icon: "🌍",
                title: "Global Research Index",
                color: "#1B4332",
                desc: "Aggregate DCFM data across industries, regions, and demographics to publish the world's first Decision Intelligence Index — creating unmatched scientific credibility.",
                metric: "40+ countries contributing",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl p-7 flex flex-col gap-3 group hover:shadow-xl transition-all hover:-translate-y-1"
                style={{
                  background: "#f8faf9",
                  border: "1px solid rgba(27,67,50,0.1)",
                }}
              >
                <span className="text-4xl mb-1">{item.icon}</span>
                <h3 className="text-xl font-bold" style={{ color: item.color }}>
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">
                  {item.desc}
                </p>
                <div
                  className="mt-3 px-3 py-1.5 rounded-full text-xs font-semibold inline-block self-start"
                  style={{
                    background: "rgba(27,67,50,0.08)",
                    color: "#1B4332",
                  }}
                >
                  {item.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 16 Product Lines ────────────────────────────────────── */}
      <section className="py-24" style={{ background: "#0D2B1A" }}>
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
              Product Roadmap
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              16 Ways elidi Changes Everything
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              From hiring to healing, from coaching to research — every domain
              where decisions are made, elidi has a product built for it.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                num: "01",
                name: "elidi for Teams",
                desc: "Cognitive Org Design — map how your organisation decides",
                cloud: "People",
              },
              {
                num: "02",
                name: "Hiring Intelligence",
                desc: "Hire by decision fit, not just skills and experience",
                cloud: "People",
              },
              {
                num: "03",
                name: "Team Conflict Predictor",
                desc: "Spot cognitive clashes before they become culture crises",
                cloud: "People",
              },
              {
                num: "04",
                name: "Academic Intelligence",
                desc: "Decision readiness for students facing life's crossroads",
                cloud: "Edu",
              },
              {
                num: "05",
                name: "Coach Intelligence",
                desc: "Living cognitive maps that evolve with every client session",
                cloud: "Coach",
              },
              {
                num: "06",
                name: "elidi for Parents",
                desc: "Understand your child's decision style before they do",
                cloud: "Edu",
              },
              {
                num: "07",
                name: "Clinical Stress Profiling",
                desc: "Cognitive risk flags for high-stakes clinical environments",
                cloud: "Coach",
              },
              {
                num: "08",
                name: "Cognitive Wellness Index",
                desc: "Monthly decision health tracking for sustainable performance",
                cloud: "Coach",
              },
              {
                num: "09",
                name: "Customer Mind Twin",
                desc: "Know how your buyer thinks — build GTM that converts",
                cloud: "Brands",
              },
              {
                num: "10",
                name: "Negotiation Intelligence",
                desc: "Profile both sides of the table before the deal begins",
                cloud: "Brands",
              },
              {
                num: "11",
                name: "Brand Personality Mapper",
                desc: "Match your brand's decision identity to your audience",
                cloud: "Brands",
              },
              {
                num: "12",
                name: "Academic Research Platform",
                desc: "Publish, collaborate, and advance decision science globally",
                cloud: "Research",
              },
              {
                num: "13",
                name: "elidi Research Index",
                desc: "The world's first annual global decision intelligence report",
                cloud: "Research",
              },
              {
                num: "14",
                name: "elidi API",
                desc: "Embed DCFM intelligence into any platform, anywhere",
                cloud: "API",
              },
              {
                num: "15",
                name: "elidi Certification",
                desc: "Train and certify the next generation of decision coaches",
                cloud: "Edu",
              },
              {
                num: "16",
                name: "Mind Twin Marketplace",
                desc: "Share, explore, and simulate elite decision profiles",
                cloud: "Core",
              },
            ].map((product) => (
              <div
                key={product.num}
                className="rounded-xl p-5 transition-all hover:-translate-y-1 hover:shadow-xl group"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(200,162,74,0.15)",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className="text-3xl font-black"
                    style={{ color: "rgba(200,162,74,0.3)" }}
                  >
                    {product.num}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: "rgba(200,162,74,0.1)",
                      color: "#C8A24A",
                    }}
                  >
                    {product.cloud}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm mb-1">
                  {product.name}
                </h4>
                <p className="text-white/40 text-xs leading-relaxed">
                  {product.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
