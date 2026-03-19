import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { DynamicRadarChart } from "../components/DynamicRadarChart";
import { Footer } from "../components/Footer";
import type { Dimension } from "../scoring";
import {
  DIMENSIONS,
  DIMENSION_LABELS,
  DIMENSION_SHORT,
  getDimensionInterpretation,
  getOverallAverage,
  getRecommendations,
} from "../scoring";

interface StoredResults {
  responses: number[];
  scores: Record<Dimension, number>;
  archetype: string;
  forceLevel: string;
}

interface ReportPageProps {
  onNavigate: (page: string) => void;
}

// ─── Brain Activity helpers ───────────────────────────────────────────────────
function toBrainPct(score: number): number {
  // score is 1-7 → map to 0-100%
  return Math.round(((score - 1) / 6) * 100);
}

function brainStatus(pct: number): { label: string; color: string } {
  if (pct > 65) return { label: "Active", color: "#00C896" };
  if (pct >= 40) return { label: "Moderate", color: "#F0C030" };
  return { label: "Latent", color: "#9B59B6" };
}

const BRAIN_REGIONS = [
  {
    id: "pfc",
    name: "Prefrontal Cortex",
    subtitle: "Executive Control & Planning",
    color: "#00C896",
    glow: "rgba(0,200,150,0.4)",
    getDimPct: (s: Record<Dimension, number>) => toBrainPct((s.pm + s.edi) / 2),
    descHigh:
      "Your executive planning circuits are highly engaged — you set clear goals, sequence decisions logically, and maintain structured control under complexity.",
    descMid:
      "Moderate executive engagement. You manage structure reasonably well, but there is capacity to sharpen decision planning and forward-thinking processes.",
    descLow:
      "Executive control pathways are less active. Investing in structured planning and goal-setting processes could significantly elevate decision quality.",
  },
  {
    id: "limbic",
    name: "Limbic System",
    subtitle: "Emotion & Motivation",
    color: "#F0C030",
    glow: "rgba(240,192,48,0.4)",
    getDimPct: (s: Record<Dimension, number>) => toBrainPct(s.em),
    descHigh:
      "Your emotional regulation system is well-calibrated. You leverage emotional intelligence as data, staying composed under pressure and motivated through uncertainty.",
    descMid:
      "Moderate emotional engagement. You generally manage your feelings, though high-stakes situations may benefit from stronger emotional grounding techniques.",
    descLow:
      "The limbic system shows lower activation for decision contexts. Developing emotional awareness could prevent reactive choices and strengthen motivation alignment.",
  },
  {
    id: "parietal",
    name: "Parietal / Analytical Cortex",
    subtitle: "Data Processing & Logic",
    color: "#4A90E2",
    glow: "rgba(74,144,226,0.4)",
    getDimPct: (s: Record<Dimension, number>) => toBrainPct(s.iai),
    descHigh:
      "Your analytical processing centres are firing strongly — you synthesise complex information, detect patterns, and draw evidence-based conclusions with confidence.",
    descMid:
      "Analytical pathways are moderately active. You can work with data but may sometimes rely on intuition in areas where deeper analytical scrutiny would sharpen outcomes.",
    descLow:
      "Analytical cortex engagement is lower. Building habits around data gathering, structured reasoning, and evidence evaluation could powerfully improve decision accuracy.",
  },
  {
    id: "social",
    name: "Social Brain / Right Hemisphere",
    subtitle: "Creativity & Interpersonal Intelligence",
    color: "#9B59B6",
    glow: "rgba(155,89,182,0.4)",
    getDimPct: (s: Record<Dimension, number>) =>
      toBrainPct((s.sis + s.rrm) / 2),
    descHigh:
      "Your social and creative circuits are highly active — you read people well, build trust rapidly, and bring innovative thinking to complex interpersonal decisions.",
    descMid:
      "Moderate social brain engagement. You navigate social dynamics adequately and show creative thinking, with room to deepen interpersonal empathy and lateral ideation.",
    descLow:
      "Social and creative pathways are less engaged. Expanding your interpersonal awareness and creative problem-solving approaches could open new decision pathways.",
  },
];

// ─── Archetype Map ────────────────────────────────────────────────────────────
const ARCHETYPES_MAP = [
  {
    id: "strategist",
    label: "The Strategist",
    x: 0.15,
    y: 0.18,
    desc: "Analytical + Structured",
  },
  {
    id: "visionary",
    label: "The Visionary",
    x: 0.82,
    y: 0.15,
    desc: "Intuitive + Structured",
  },
  {
    id: "analyst",
    label: "The Analyst",
    x: 0.18,
    y: 0.45,
    desc: "Analytical + Balanced",
  },
  {
    id: "executor",
    label: "The Executor",
    x: 0.22,
    y: 0.75,
    desc: "Analytical + Fluid",
  },
  {
    id: "empath",
    label: "The Empath",
    x: 0.78,
    y: 0.78,
    desc: "Intuitive + Fluid",
  },
  {
    id: "diplomat",
    label: "The Diplomat",
    x: 0.8,
    y: 0.42,
    desc: "Intuitive + Balanced",
  },
  {
    id: "maverick",
    label: "The Maverick",
    x: 0.92,
    y: 0.88,
    desc: "Intuitive + Very Fluid",
  },
];

function getArchetypeRole(
  id: string,
  scores: Record<Dimension, number>,
): "aspire" | "caution" | "neutral" {
  const { pm, em, iai, sis, edi, rrm } = scores;
  if (id === "strategist") return pm > 4.5 && iai > 4.5 ? "aspire" : "neutral";
  if (id === "visionary") return edi > 4.5 && sis > 4.5 ? "aspire" : "neutral";
  if (id === "analyst") return iai > 4.5 ? "aspire" : "neutral";
  if (id === "executor") return "neutral";
  if (id === "empath") return em < 3 ? "caution" : "aspire";
  if (id === "diplomat") return sis > 4.5 ? "aspire" : "neutral";
  if (id === "maverick") {
    const structure = (pm + edi) / 2;
    return structure < 3 ? "caution" : "neutral";
  }
  if (rrm) return "neutral"; // silence unused warning
  return "neutral";
}

// ─── Anomaly detection ────────────────────────────────────────────────────────
interface Anomaly {
  title: string;
  severity: "Low" | "Medium" | "High";
  description: string;
  icon: string;
}

function detectAnomalies(
  responses: number[],
  scores: Record<Dimension, number>,
): Anomaly[] {
  const anomalies: Anomaly[] = [];
  const n = responses.length;

  // 1. Extreme response bias
  const extremeCount = responses.filter((r) => r === 1 || r === 7).length;
  if (extremeCount / n > 0.4) {
    anomalies.push({
      title: "Extreme Response Bias",
      severity: "Medium",
      icon: "⚡",
      description: `${extremeCount} of ${n} responses (${Math.round((extremeCount / n) * 100)}%) were at the extreme ends (1 or 7). This may indicate strong convictions or social desirability bias. Your scores may reflect your ideals as much as your actual behaviour.`,
    });
  }

  // 2. Central tendency bias
  const centralCount = responses.filter(
    (r) => r === 3 || r === 4 || r === 5,
  ).length;
  if (centralCount / n > 0.7) {
    anomalies.push({
      title: "Central Tendency Bias",
      severity: "Low",
      icon: "〰️",
      description: `${centralCount} of ${n} responses (${Math.round((centralCount / n) * 100)}%) fell in the middle range (3–5). This suggests possible avoidance of commitment or uncertainty about self-perception. Consider revisiting dimensions where you feel less certain.`,
    });
  }

  // 3. Dimensional inconsistency (std dev per dimension)
  const dimKeys: Dimension[] = ["pm", "em", "rrm", "iai", "sis", "edi"];
  const dimQuestions: Record<Dimension, number[]> = {
    pm: responses.slice(0, 6),
    em: responses.slice(6, 12),
    rrm: responses.slice(12, 18),
    iai: responses.slice(18, 24),
    sis: responses.slice(24, 30),
    edi: responses.slice(30, 36),
  };
  for (const dim of dimKeys) {
    const qs = dimQuestions[dim];
    const mean = qs.reduce((a, b) => a + b, 0) / qs.length;
    const variance = qs.reduce((a, b) => a + (b - mean) ** 2, 0) / qs.length;
    const stdDev = Math.sqrt(variance);
    if (stdDev > 1.8) {
      anomalies.push({
        title: `Dimensional Inconsistency — ${DIMENSION_LABELS[dim]}`,
        severity: "High",
        icon: "🔀",
        description: `High variability detected in your ${DIMENSION_LABELS[dim]} responses (std dev: ${stdDev.toFixed(2)}). This indicates internal conflict or context-dependent behaviour in this area — your approach may shift significantly depending on the situation or role.`,
      });
    }
  }

  // 4. Dimension score paradoxes
  if (scores.edi > 5 && scores.em < 3) {
    anomalies.push({
      title: "Executive Drive vs. Emotional Regulation Paradox",
      severity: "High",
      icon: "⚖️",
      description:
        "High executive drive (EDI) paired with low emotional regulation (EM) creates a significant risk profile. Strong decisiveness without emotional grounding can lead to reactive, impulsive, or high-stakes errors under pressure.",
    });
  }
  if (scores.iai > 5 && scores.pm < 3) {
    anomalies.push({
      title: "Analytical Ability vs. Process Structure Paradox",
      severity: "Medium",
      icon: "🔬",
      description:
        "Strong analytical intelligence (IAI) without structured process management (PM) means insights may not consistently translate into action. Analytical capacity is underutilised without a reliable framework to channel it.",
    });
  }

  // 5. Acquiescence bias
  const agreeCount = responses.filter((r) => r >= 5).length;
  if (agreeCount / n > 0.6) {
    anomalies.push({
      title: "Acquiescence Bias",
      severity: "Low",
      icon: "👍",
      description: `${agreeCount} of ${n} responses (${Math.round((agreeCount / n) * 100)}%) were in the agreement range (5–7). A positive response tendency may inflate scores across all dimensions. Results should be interpreted with this inclination in mind.`,
    });
  }

  return anomalies;
}

// ─── Print styles injected into the page ─────────────────────────────────────
const PRINT_STYLES = `
@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  html, body {
    background: #1B4332 !important;
    color: #E8F5E9 !important;
  }
  .min-h-screen, .bg-white {
    background: #1B4332 !important;
  }
  /* All generic containers get forest green */
  div, section, article, aside, main, header, footer {
    background-color: transparent !important;
  }
  /* Cards with dark navy backgrounds → medium forest green */
  [data-print-card] {
    background: #2D6A4F !important;
    border-color: rgba(255,255,255,0.2) !important;
  }
  /* Response Pattern Analysis light section */
  [data-print-light] {
    background: #2D6A4F !important;
    border-color: rgba(255,255,255,0.2) !important;
  }
  /* Text overrides */
  p, span, li, td, th, label {
    color: #E8F5E9 !important;
  }
  h1, h2, h3, h4, h5, h6 {
    color: #FFFFFF !important;
  }
  .text-gray-600, .text-gray-500, .text-gray-400 {
    color: rgba(232,245,233,0.75) !important;
  }
  /* Keep gold accent */
  [data-print-gold] {
    color: #C8A24A !important;
  }
  /* Progress bar tracks */
  [data-print-track] {
    background: rgba(255,255,255,0.15) !important;
  }
  /* Anomaly cards */
  [data-print-anomaly] {
    background: rgba(255,255,255,0.06) !important;
    border-color: rgba(255,255,255,0.15) !important;
  }
  /* Borders */
  .border-t, .border {
    border-color: rgba(255,255,255,0.15) !important;
  }
  /* SVG archetype map – darken the SVG background rect */
  .archetype-bg-rect {
    fill: #1B4332 !important;
  }
  /* Print header visibility */
  .print\:block { display: block !important; }
  .hidden.print\:block { display: block !important; }
}
`;

// ─── Component ────────────────────────────────────────────────────────────────
export function ReportPage({ onNavigate }: ReportPageProps) {
  const [results, setResults] = useState<StoredResults | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("hda_results");
    if (stored) setResults(JSON.parse(stored));
  }, []);

  if (!results) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F3F6F9" }}
      >
        <div className="text-center p-8">
          <p className="text-gray-500 mb-4" data-ocid="report.empty_state">
            No assessment results found.
          </p>
          <button
            type="button"
            onClick={() => onNavigate("assessment")}
            className="px-6 py-3 rounded-xl font-bold text-sm"
            style={{ backgroundColor: "#C8A24A", color: "#081C2F" }}
            data-ocid="report.primary_button"
          >
            Take the Assessment
          </button>
        </div>
      </div>
    );
  }

  const { responses, scores, archetype, forceLevel } = results;
  const avg = getOverallAverage(scores);
  const recommendations = getRecommendations(scores);
  const printDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const anomalies = detectAnomalies(responses, scores);

  // Compute user position on archetype map
  const rawX = (scores.edi + scores.sis - scores.iai - scores.em) / 2;
  const rawY = (scores.pm + scores.edi - scores.rrm) / 3;
  const userX = Math.max(0.05, Math.min(0.95, (rawX + 3) / 6));
  const userY = Math.max(0.05, Math.min(0.95, 1 - (rawY + 3) / 6));

  // Nearest archetype
  const nearest = ARCHETYPES_MAP.reduce((best, a) => {
    const d = Math.hypot(a.x - userX, a.y - userY);
    const bd = Math.hypot(best.x - userX, best.y - userY);
    return d < bd ? a : best;
  });

  return (
    <div
      className="min-h-screen print-full-width"
      style={{ backgroundColor: "#0E2117" }}
    >
      {/* Injected print styles */}
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: print styles only */}
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />

      {/* Print header */}
      <div className="hidden print:block p-8 border-b" data-print-card>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-white">
              HDA-DCFM Decision Intelligence Report
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "rgba(232,245,233,0.7)" }}
            >
              Generated: {printDate}
            </p>
          </div>
          <div className="text-right">
            <p
              className="font-bold"
              style={{ color: "#C8A24A" }}
              data-print-gold
            >
              {archetype}
            </p>
            <p className="text-sm" style={{ color: "rgba(232,245,233,0.7)" }}>
              {forceLevel}
            </p>
          </div>
        </div>
      </div>

      {/* Screen header */}
      <div
        style={{
          background: "linear-gradient(135deg, #081C2F 0%, #0B2A45 100%)",
        }}
        className="py-12 no-print"
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate("results")}
              className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
              data-ocid="report.link"
            >
              ← Back to Results
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: "#C8A24A", color: "#081C2F" }}
              data-ocid="report.primary_button"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M4 2h8v3H4V2zm-2 4h12a1 1 0 011 1v4a1 1 0 01-1 1H3a1 1 0 01-1-1V7a1 1 0 011-1zm2 6v3h8v-3H4z" />
              </svg>
              Print Report
            </button>
          </div>
          <div className="mt-6 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Decision Intelligence Report
            </h1>
            <p className="text-white/60">
              Full breakdown across all 6 dimensions
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl p-8 mb-10"
          style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}
          data-ocid="report.card"
          data-print-card
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">
                Decision Archetype
              </p>
              <p
                className="text-xl font-bold"
                style={{ color: "#C8A24A" }}
                data-print-gold
              >
                {archetype}
              </p>
            </div>
            <div>
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">
                Force Level
              </p>
              <p className="text-xl font-bold text-white">{forceLevel}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">
                elidi Score
              </p>
              <p
                className="text-xl font-bold"
                style={{ color: "#C8A24A" }}
                data-print-gold
              >
                {avg.toFixed(2)} / 7.00
              </p>
            </div>
          </div>
        </motion.div>

        {/* Radar chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl p-6"
            style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}
            data-print-card
          >
            <h2 className="text-white font-bold mb-4 text-center">
              Radar Profile
            </h2>
            <DynamicRadarChart scores={scores} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-3"
          >
            {DIMENSIONS.map((dim, i) => (
              <div
                key={dim}
                className="flex items-center gap-3"
                data-ocid={`report.item.${i + 1}`}
              >
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded w-12 text-center"
                  style={{
                    backgroundColor: "rgba(200,162,74,0.15)",
                    color: "#C8A24A",
                  }}
                >
                  {DIMENSION_SHORT[dim]}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-600">
                      {DIMENSION_LABELS[dim]}
                    </span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: "#C8A24A" }}
                    >
                      {scores[dim].toFixed(2)}
                    </span>
                  </div>
                  <div
                    className="w-full h-2 rounded-full"
                    style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    data-print-track
                  >
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(scores[dim] / 7) * 100}%`,
                        backgroundColor: "#C8A24A",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dimension deep-dives */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "#E8F5E9" }}>
            Dimension Analysis
          </h2>
          <div className="space-y-4">
            {DIMENSIONS.map((dim, i) => {
              const score = scores[dim];
              const tier = score >= 5 ? "high" : score >= 3 ? "mid" : "low";
              const tierColor =
                tier === "high"
                  ? "#2E7D52"
                  : tier === "mid"
                    ? "#B8820A"
                    : "#B84A38";
              const tierBg =
                tier === "high"
                  ? "rgba(130,184,154,0.08)"
                  : tier === "mid"
                    ? "rgba(200,162,74,0.08)"
                    : "rgba(224,138,122,0.08)";
              const tierBorder =
                tier === "high"
                  ? "rgba(130,184,154,0.3)"
                  : tier === "mid"
                    ? "rgba(200,162,74,0.3)"
                    : "rgba(224,138,122,0.3)";
              return (
                <motion.div
                  key={dim}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                  className="rounded-2xl p-6 border"
                  style={{ backgroundColor: tierBg, borderColor: tierBorder }}
                  data-ocid="report.panel"
                  data-print-card
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="text-sm font-bold px-3 py-1 rounded-lg"
                        style={{
                          backgroundColor: `${tierColor}20`,
                          color: tierColor,
                        }}
                      >
                        {DIMENSION_SHORT[dim]}
                      </span>
                      <h3
                        className="font-bold text-base"
                        style={{ color: "#E8F5E9" }}
                      >
                        {DIMENSION_LABELS[dim]}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span
                        className="text-2xl font-bold"
                        style={{ color: tierColor }}
                      >
                        {score.toFixed(2)}
                      </span>
                      <span className="text-xs text-white/40"> / 7</span>
                    </div>
                  </div>
                  <div
                    className="w-full h-2 rounded-full mb-4"
                    style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                    data-print-track
                  >
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${(score / 7) * 100}%`,
                        backgroundColor: tierColor,
                      }}
                    />
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {getDimensionInterpretation(dim, score)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Neural Activity Profile ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl p-8 mb-10 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #122B1E 0%, #1B4332 100%)",
            border: "1px solid rgba(74,144,226,0.2)",
          }}
          data-ocid="report.panel"
          data-print-card
        >
          <div className="flex items-center gap-3 mb-8">
            <span style={{ fontSize: "1.5rem" }}>🧠</span>
            <div>
              <h2 className="text-xl font-bold text-white">
                Neural Activity Profile
              </h2>
              <p className="text-xs text-white/40 mt-0.5 uppercase tracking-widest">
                Brain Region Activation · Based on your decision profile
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Brain image */}
            <div className="relative">
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  boxShadow:
                    "0 0 40px rgba(74,144,226,0.25), 0 0 80px rgba(0,200,150,0.1)",
                }}
              >
                <img
                  src="/assets/generated/brain-infographic.dim_800x600.png"
                  alt="Neural Activity Map"
                  className="w-full object-cover"
                  style={{ maxHeight: 280 }}
                />
              </div>
              <div
                className="absolute bottom-3 left-3 right-3 rounded-lg px-3 py-2"
                style={{ backgroundColor: "rgba(6,15,26,0.85)" }}
              >
                <p className="text-xs text-white/50 font-mono uppercase tracking-widest">
                  Neural Activation Map · HDA-DCFM Framework
                </p>
              </div>
            </div>

            {/* Region bars */}
            <div className="space-y-5">
              {BRAIN_REGIONS.map((region) => {
                const pct = region.getDimPct(scores);
                const status = brainStatus(pct);
                const desc =
                  pct > 65
                    ? region.descHigh
                    : pct >= 40
                      ? region.descMid
                      : region.descLow;
                return (
                  <div key={region.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <span
                          className="text-sm font-semibold text-white"
                          style={{ letterSpacing: "0.01em" }}
                        >
                          {region.name}
                        </span>
                        <span
                          className="ml-2 text-xs"
                          style={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          {region.subtitle}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${status.color}22`,
                            color: status.color,
                            border: `1px solid ${status.color}55`,
                          }}
                        >
                          {status.label}
                        </span>
                        <span
                          className="font-mono font-bold text-lg"
                          style={{
                            color: region.color,
                            minWidth: 48,
                            textAlign: "right",
                          }}
                        >
                          {pct}%
                        </span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div
                      className="w-full h-2.5 rounded-full mb-2"
                      style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
                      data-print-track
                    >
                      <div
                        className="h-2.5 rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${region.color}99, ${region.color})`,
                          boxShadow: `0 0 8px ${region.glow}`,
                        }}
                      />
                    </div>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      {desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ── Decision Archetype Landscape ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="rounded-2xl p-8 mb-10"
          style={{
            background: "linear-gradient(135deg, #122B1E 0%, #1B4332 100%)",
            border: "1px solid rgba(200,162,74,0.15)",
          }}
          data-ocid="report.panel"
          data-print-card
        >
          <div className="flex items-center gap-3 mb-6">
            <span style={{ fontSize: "1.5rem" }}>🧭</span>
            <div>
              <h2 className="text-xl font-bold text-white">
                Decision Archetype Landscape
              </h2>
              <p className="text-xs text-white/40 mt-0.5 uppercase tracking-widest">
                Your position &amp; archetypal aspirations
              </p>
            </div>
          </div>

          {/* Landscape explanation */}
          <div
            className="mb-6 rounded-xl px-5 py-4"
            style={{
              backgroundColor: "rgba(200,162,74,0.06)",
              border: "1px solid rgba(200,162,74,0.12)",
            }}
          >
            <p className="text-sm text-white/80 leading-relaxed">
              The{" "}
              <strong style={{ color: "#C8A24A" }}>
                Decision Archetype Landscape
              </strong>{" "}
              maps 7 distinct decision personalities across two axes:{" "}
              <em>Analytical ↔ Intuitive</em> (thinking style) and{" "}
              <em>Structured ↔ Fluid</em> (execution style). Your unique
              position on this plot is calculated from your 6-dimension profile.
              This is one of the most powerful tools in elidi — it reveals not
              just who you are, but the archetypes you can{" "}
              <span style={{ color: "#2E7D52" }}>aspire toward</span> and those
              that may present{" "}
              <span style={{ color: "#B84A38" }}>blind spots</span> to watch.
            </p>
          </div>

          <div className="overflow-x-auto">
            <svg
              viewBox="0 0 600 460"
              width="100%"
              style={{ maxWidth: 600 }}
              role="img"
              aria-labelledby="archetype-map-title"
            >
              <title id="archetype-map-title">
                Decision Archetype Landscape Map
              </title>
              {/* Background */}
              <rect
                width="600"
                height="460"
                fill="#0E2117"
                rx="12"
                className="archetype-bg-rect"
              />

              {/* Quadrant grid */}
              <line
                x1="300"
                y1="20"
                x2="300"
                y2="440"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
              <line
                x1="20"
                y1="230"
                x2="580"
                y2="230"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />

              {/* Axis labels */}
              <text
                x="30"
                y="228"
                fill="rgba(255,255,255,0.35)"
                fontSize="11"
                fontFamily="monospace"
              >
                ← Analytical
              </text>
              <text
                x="440"
                y="228"
                fill="rgba(255,255,255,0.35)"
                fontSize="11"
                fontFamily="monospace"
              >
                Intuitive →
              </text>
              <text
                x="295"
                y="18"
                fill="rgba(255,255,255,0.35)"
                fontSize="11"
                fontFamily="monospace"
                textAnchor="middle"
              >
                ▲ Structured
              </text>
              <text
                x="295"
                y="454"
                fill="rgba(255,255,255,0.35)"
                fontSize="11"
                fontFamily="monospace"
                textAnchor="middle"
              >
                ▼ Fluid
              </text>

              {/* Quadrant labels */}
              <text
                x="50"
                y="55"
                fill="rgba(74,144,226,0.3)"
                fontSize="10"
                fontFamily="monospace"
              >
                ANALYTICAL + STRUCTURED
              </text>
              <text
                x="360"
                y="55"
                fill="rgba(155,89,182,0.3)"
                fontSize="10"
                fontFamily="monospace"
              >
                INTUITIVE + STRUCTURED
              </text>
              <text
                x="50"
                y="420"
                fill="rgba(74,144,226,0.2)"
                fontSize="10"
                fontFamily="monospace"
              >
                ANALYTICAL + FLUID
              </text>
              <text
                x="380"
                y="420"
                fill="rgba(240,192,48,0.2)"
                fontSize="10"
                fontFamily="monospace"
              >
                INTUITIVE + FLUID
              </text>

              {/* Archetype nodes */}
              {ARCHETYPES_MAP.map((a) => {
                const cx = 20 + a.x * 560;
                const cy = 20 + a.y * 420;
                const role = getArchetypeRole(a.id, scores);
                const fill =
                  role === "aspire"
                    ? "#2E7D52"
                    : role === "caution"
                      ? "#B84A38"
                      : "#4A6A8A";
                const stroke =
                  role === "aspire"
                    ? "rgba(46,125,82,0.5)"
                    : role === "caution"
                      ? "rgba(184,74,56,0.5)"
                      : "rgba(74,106,138,0.4)";
                const isNearest = a.id === nearest.id;
                return (
                  <g key={a.id}>
                    {isNearest && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="22"
                        fill="none"
                        stroke={fill}
                        strokeWidth="1"
                        strokeDasharray="4 3"
                        opacity="0.6"
                      />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="14"
                      fill={fill}
                      stroke={stroke}
                      strokeWidth="2"
                    />
                    <text
                      x={cx}
                      y={cy + 4}
                      textAnchor="middle"
                      fill="white"
                      fontSize="7"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {a.label.replace("The ", "").toUpperCase()}
                    </text>
                    <text
                      x={cx}
                      y={cy + 28}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.5)"
                      fontSize="8"
                      fontFamily="sans-serif"
                    >
                      {a.desc}
                    </text>
                  </g>
                );
              })}

              {/* User dot */}
              <circle
                cx={20 + userX * 560}
                cy={20 + userY * 420}
                r="18"
                fill="rgba(240,192,48,0.15)"
                stroke="#F0C030"
                strokeWidth="2"
              />
              <circle
                cx={20 + userX * 560}
                cy={20 + userY * 420}
                r="7"
                fill="#F0C030"
              />
              <text
                x={20 + userX * 560}
                y={20 + userY * 420 - 22}
                textAnchor="middle"
                fill="#F0C030"
                fontSize="11"
                fontWeight="bold"
                fontFamily="monospace"
              >
                YOU
              </text>
            </svg>
          </div>

          {/* Legend */}
          <div
            className="flex flex-wrap gap-4 mt-4 pt-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "#2E7D52" }}
              />
              <span className="text-xs text-white/60">Aspire toward</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "#B84A38" }}
              />
              <span className="text-xs text-white/60">
                Approach with awareness
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "#4A6A8A" }}
              />
              <span className="text-xs text-white/60">Neutral territory</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#F0C030" }}
              />
              <span className="text-xs" style={{ color: "#F0C030" }}>
                You
              </span>
            </div>
          </div>

          <p
            className="mt-4 text-sm rounded-xl px-4 py-3"
            style={{
              backgroundColor: "rgba(240,192,48,0.08)",
              color: "rgba(240,192,48,0.85)",
              border: "1px solid rgba(240,192,48,0.2)",
            }}
          >
            <strong>Nearest archetype:</strong> {nearest.label} — {nearest.desc}
            . Your decision profile places you closest to this style. Use this
            as a reference point, not a ceiling.
          </p>

          {/* Meet the Archetypes */}
          <div
            className="mt-8 pt-6"
            style={{ borderTop: "1px solid rgba(200,162,74,0.15)" }}
          >
            <h3 className="text-lg font-bold mb-1" style={{ color: "#C8A24A" }}>
              Meet the Archetypes
            </h3>
            <p className="text-xs text-white/50 mb-5 uppercase tracking-widest">
              Seven decision personalities — understand each to navigate yours
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: "strategist",
                  label: "The Strategist",
                  axes: "Analytical + Structured",
                  desc: "A precision thinker who plans meticulously and executes with logic. Excellent at managing complexity through systems and process.",
                },
                {
                  id: "visionary",
                  label: "The Visionary",
                  axes: "Intuitive + Structured",
                  desc: "Combines big-picture creative thinking with disciplined execution. Inspires teams and drives transformation with clarity.",
                },
                {
                  id: "analyst",
                  label: "The Analyst",
                  axes: "Analytical + Balanced",
                  desc: "Evidence-driven decision maker who weighs data carefully before acting. Reliable, accurate, and highly credible under scrutiny.",
                },
                {
                  id: "executor",
                  label: "The Executor",
                  axes: "Analytical + Fluid",
                  desc: "Quick, pragmatic, and action-oriented. Translates plans into results rapidly, especially in fast-changing environments.",
                },
                {
                  id: "empath",
                  label: "The Empath",
                  axes: "Intuitive + Fluid",
                  desc: "Emotionally intelligent and people-centred. Excels at building trust, navigating relationships, and leading with heart.",
                },
                {
                  id: "diplomat",
                  label: "The Diplomat",
                  axes: "Intuitive + Balanced",
                  desc: "Bridges ideas and people. Naturally finds common ground, communicates persuasively, and creates alignment across groups.",
                },
                {
                  id: "maverick",
                  label: "The Maverick",
                  axes: "Intuitive + Very Fluid",
                  desc: "Bold, unconventional, and risk-tolerant. Thrives in ambiguity and drives breakthroughs — but needs awareness to avoid impulsiveness.",
                },
              ].map((a) => {
                const role = getArchetypeRole(a.id, scores);
                const dotColor =
                  role === "aspire"
                    ? "#2E7D52"
                    : role === "caution"
                      ? "#B84A38"
                      : "#4A6A8A";
                return (
                  <div
                    key={a.id}
                    className="flex items-start gap-3 rounded-xl p-4"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span
                      className="flex-shrink-0 w-3 h-3 rounded-full mt-1"
                      style={{ backgroundColor: dotColor }}
                    />
                    <div>
                      <p className="text-sm font-bold text-white">{a.label}</p>
                      <p
                        className="text-xs mb-1"
                        style={{ color: "#C8A24A99" }}
                      >
                        {a.axes}
                      </p>
                      <p className="text-xs text-white/55 leading-relaxed">
                        {a.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-2xl p-8 mb-10"
          style={{ background: "linear-gradient(135deg, #1B4332, #2D6A4F)" }}
          data-ocid="report.panel"
          data-print-card
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span style={{ color: "#C8A24A" }}>◆</span>
            Personalized Recommendations
          </h2>
          <ol className="space-y-4">
            {recommendations.map((rec, i) => (
              <li
                key={rec.slice(0, 20)}
                className="flex gap-4"
                data-ocid={`report.item.${i + 7}`}
              >
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: "rgba(200,162,74,0.2)",
                    color: "#C8A24A",
                  }}
                >
                  {i + 1}
                </span>
                <p className="text-white/80 text-sm leading-relaxed pt-0.5">
                  {rec}
                </p>
              </li>
            ))}
          </ol>
        </motion.div>

        {/* ── Response Pattern Analysis (Anomalies) ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="rounded-2xl p-8 mb-10"
          style={{
            backgroundColor: "#122B1E",
            border: "1px solid rgba(200,162,74,0.2)",
          }}
          data-ocid="report.panel"
          data-print-light
        >
          <div className="flex items-center gap-3 mb-6">
            <span style={{ fontSize: "1.5rem" }}>🔍</span>
            <div>
              <h2 className="text-xl font-bold" style={{ color: "#E8F5E9" }}>
                Response Pattern Analysis
              </h2>
              <p className="text-xs text-white/40 mt-0.5 uppercase tracking-widest">
                Anomaly &amp; Aberration Report
              </p>
            </div>
          </div>

          {anomalies.length === 0 ? (
            <div
              className="rounded-xl px-5 py-4 flex items-center gap-3"
              style={{
                backgroundColor: "rgba(46,125,82,0.08)",
                border: "1px solid rgba(46,125,82,0.25)",
              }}
              data-ocid="report.success_state"
              data-print-anomaly
            >
              <span style={{ fontSize: "1.25rem" }}>✅</span>
              <div>
                <p
                  className="font-semibold text-sm"
                  style={{ color: "#2E7D52" }}
                >
                  No significant anomalies detected
                </p>
                <p className="text-xs text-white/50 mt-0.5">
                  Your response pattern appears consistent across all 36 items.
                  The distribution of answers shows no significant bias or
                  internal contradictions — this strengthens the reliability of
                  your elidi Score.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {anomalies.map((anomaly, i) => {
                  const sevColor =
                    anomaly.severity === "High"
                      ? {
                          bg: "rgba(184,74,56,0.07)",
                          border: "rgba(184,74,56,0.25)",
                          badge: "#B84A38",
                          badgeBg: "rgba(184,74,56,0.1)",
                        }
                      : anomaly.severity === "Medium"
                        ? {
                            bg: "rgba(240,192,48,0.07)",
                            border: "rgba(240,192,48,0.25)",
                            badge: "#B8820A",
                            badgeBg: "rgba(240,192,48,0.1)",
                          }
                        : {
                            bg: "rgba(0,0,0,0.03)",
                            border: "rgba(0,0,0,0.1)",
                            badge: "#6B7280",
                            badgeBg: "rgba(0,0,0,0.05)",
                          };
                  return (
                    <div
                      key={anomaly.title}
                      className="rounded-xl px-5 py-4"
                      style={{
                        backgroundColor: sevColor.bg,
                        border: `1px solid ${sevColor.border}`,
                      }}
                      data-ocid={`report.item.${i + 13}`}
                      data-print-anomaly
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: "1.1rem" }}>
                            {anomaly.icon}
                          </span>
                          <p
                            className="font-semibold text-sm"
                            style={{ color: "#E8F5E9" }}
                          >
                            {anomaly.title}
                          </p>
                        </div>
                        <span
                          className="flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: sevColor.badgeBg,
                            color: sevColor.badge,
                            border: `1px solid ${sevColor.border}`,
                          }}
                        >
                          {anomaly.severity}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed">
                        {anomaly.description}
                      </p>
                    </div>
                  );
                })}
              </div>
              <p
                className="mt-5 text-xs rounded-xl px-4 py-3"
                style={{
                  backgroundColor: "rgba(74,144,226,0.06)",
                  color: "rgba(74,144,226,0.9)",
                  border: "1px solid rgba(74,144,226,0.2)",
                }}
              >
                <strong>Note:</strong> These patterns do not invalidate your
                results, but provide important context for interpretation. Use
                them to inform a more nuanced reading of your elidi Score.
              </p>
            </>
          )}
        </motion.div>

        {/* About the Creator - visible on screen and in print */}
        <div
          className="mt-10 rounded-2xl p-8 print:rounded-none print:border print:border-gray-300"
          style={{
            background:
              "linear-gradient(135deg, #0E2117 0%, #1B4332 60%, #2D6A4F 100%)",
          }}
          data-ocid="report.panel"
          data-print-card
        >
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-8 h-0.5 flex-shrink-0"
              style={{ backgroundColor: "#C8A24A" }}
            />
            <p
              className="text-xs tracking-[0.3em] uppercase"
              style={{ color: "#C8A24A" }}
            >
              About the Creator
            </p>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">
            Sathish Sampath, <span style={{ color: "#C8A24A" }}>FRSPH</span>
          </h3>
          <p
            className="text-xs tracking-widest uppercase mb-4"
            style={{ color: "#C8A24A99" }}
          >
            Human Decision Architect&nbsp;·&nbsp;Mind Hack
            Specialist&nbsp;·&nbsp;CEO, MESMA
          </p>
          <p className="text-sm text-white/70 leading-relaxed mb-4">
            Behavioural Psychology Researcher &amp;
            Hypnotherapist&nbsp;&nbsp;|&nbsp;&nbsp; International Keynote
            Speaker&nbsp;&nbsp;|&nbsp;&nbsp;Award-Winning Author
          </p>
          <p
            className="text-sm italic text-white/60 border-l-2 pl-4"
            style={{ borderColor: "#C8A24A55" }}
          >
            "elidi is built on the HDA-DCFM framework — a breakthrough in
            decision intelligence, engineered to reveal the architecture of your
            mind and unlock your highest potential."
          </p>
        </div>

        {/* Footer row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10 no-print">
          <p className="text-xs text-white/40">
            HDA-DCFM Decision Intelligence Framework · {printDate}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onNavigate("results")}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm border-2 transition-all"
              style={{ borderColor: "#C8A24A", color: "#C8A24A" }}
              data-ocid="report.secondary_button"
            >
              Back to Results
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: "#C8A24A", color: "#081C2F" }}
              data-ocid="report.primary_button"
            >
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
