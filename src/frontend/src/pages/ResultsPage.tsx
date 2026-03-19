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
} from "../scoring";

interface StoredResults {
  responses: number[];
  scores: Record<Dimension, number>;
  archetype: string;
  forceLevel: string;
  responseTimes?: number[];
}

interface ResultsPageProps {
  onNavigate: (page: string) => void;
}

function ForceLevelBadge({ level }: { level: string }) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    "Elite Decision Force": { bg: "#C8A24A", text: "#081C2F" },
    "High Decision Force": { bg: "#4A90C8", text: "white" },
    "Developing Decision Force": { bg: "#82B89A", text: "#081C2F" },
    "Emerging Decision Force": { bg: "#B8A24A", text: "#081C2F" },
    "Foundation Decision Force": { bg: "#9CA3AF", text: "white" },
  };
  const colors = colorMap[level] || { bg: "#9CA3AF", text: "white" };
  return (
    <span
      className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {level}
    </span>
  );
}

export function ResultsPage({ onNavigate }: ResultsPageProps) {
  const [results, setResults] = useState<StoredResults | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("hda_results");
    if (stored) {
      setResults(JSON.parse(stored));
    }
  }, []);

  if (!results) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F3F6F9" }}
      >
        <div className="text-center p-8">
          <p className="text-gray-500 mb-4" data-ocid="results.empty_state">
            No assessment results found.
          </p>
          <button
            type="button"
            onClick={() => onNavigate("assessment")}
            className="px-6 py-3 rounded-xl font-bold text-sm"
            style={{ backgroundColor: "#C8A24A", color: "#081C2F" }}
            data-ocid="results.primary_button"
          >
            Take the Assessment
          </button>
        </div>
      </div>
    );
  }

  const { scores, archetype, forceLevel } = results;
  const avg = getOverallAverage(scores);
  const sorted = [...DIMENSIONS].sort((a, b) => scores[b] - scores[a]);
  const topTwo = sorted.slice(0, 2);
  const bottomTwo = sorted.slice(-2).reverse();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #081C2F 0%, #0B2A45 100%)",
        }}
        className="py-16"
      >
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{
                backgroundColor: "rgba(200,162,74,0.15)",
                color: "#C8A24A",
                border: "1px solid rgba(200,162,74,0.3)",
              }}
            >
              Your Results Are Ready
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Your Decision Intelligence Profile
            </h1>
            <p className="text-white/60 max-w-lg mx-auto">
              Based on your 36-question assessment across all 6 decision
              dimensions.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Badges row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-widest">
              Your Archetype
            </p>
            <span
              className="inline-flex items-center px-6 py-2 rounded-full text-base font-bold"
              style={{
                background: "linear-gradient(135deg, #081C2F, #0B2A45)",
                color: "#C8A24A",
                border: "1px solid rgba(200,162,74,0.4)",
              }}
              data-ocid="results.card"
            >
              ◆ {archetype}
            </span>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-widest">
              Force Level
            </p>
            <ForceLevelBadge level={forceLevel} />
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-widest">
              elidi Score
            </p>
            <span
              className="inline-flex items-center px-6 py-2 rounded-full text-base font-bold"
              style={{
                backgroundColor: "rgba(200,162,74,0.1)",
                color: "#C8A24A",
                border: "1px solid rgba(200,162,74,0.3)",
              }}
            >
              {avg.toFixed(2)} / 7.00
            </span>
          </div>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Radar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl p-8"
            style={{
              background: "linear-gradient(135deg, #081C2F 0%, #0B2A45 100%)",
            }}
            data-ocid="results.chart_point"
          >
            <h2 className="text-white font-bold mb-6 text-center">
              Radar Profile
            </h2>
            <DynamicRadarChart scores={scores} />
          </motion.div>

          {/* Dimension scores */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            {DIMENSIONS.map((dim, i) => (
              <div
                key={dim}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-card"
                data-ocid={`results.item.${i + 1}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: "rgba(200,162,74,0.15)",
                        color: "#C8A24A",
                      }}
                    >
                      {DIMENSION_SHORT[dim]}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "#0F1F2E" }}
                    >
                      {DIMENSION_LABELS[dim]}
                    </span>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{ color: "#C8A24A" }}
                  >
                    {scores[dim].toFixed(2)}
                  </span>
                </div>
                <div
                  className="w-full h-2 rounded-full"
                  style={{ backgroundColor: "#F3F6F9" }}
                >
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${(scores[dim] / 7) * 100}%`,
                      backgroundColor: "#C8A24A",
                    }}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Strengths & Growth */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-2xl p-6 border"
            style={{
              backgroundColor: "rgba(130,184,154,0.08)",
              borderColor: "rgba(130,184,154,0.3)",
            }}
            data-ocid="results.panel"
          >
            <h3
              className="font-bold mb-4 flex items-center gap-2"
              style={{ color: "#2E7D52" }}
            >
              <span>✦</span> Strength Areas
            </h3>
            {topTwo.map((dim) => (
              <div key={dim} className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: "rgba(130,184,154,0.2)",
                      color: "#2E7D52",
                    }}
                  >
                    {DIMENSION_SHORT[dim]}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {DIMENSION_LABELS[dim]}
                  </span>
                  <span
                    className="ml-auto text-sm font-bold"
                    style={{ color: "#2E7D52" }}
                  >
                    {scores[dim].toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {getDimensionInterpretation(dim, scores[dim])}
                </p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="rounded-2xl p-6 border"
            style={{
              backgroundColor: "rgba(224,138,122,0.08)",
              borderColor: "rgba(224,138,122,0.3)",
            }}
            data-ocid="results.panel"
          >
            <h3
              className="font-bold mb-4 flex items-center gap-2"
              style={{ color: "#B84A38" }}
            >
              <span>◈</span> Growth Areas
            </h3>
            {bottomTwo.map((dim) => (
              <div key={dim} className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: "rgba(224,138,122,0.2)",
                      color: "#B84A38",
                    }}
                  >
                    {DIMENSION_SHORT[dim]}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {DIMENSION_LABELS[dim]}
                  </span>
                  <span
                    className="ml-auto text-sm font-bold"
                    style={{ color: "#B84A38" }}
                  >
                    {scores[dim].toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {getDimensionInterpretation(dim, scores[dim])}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            type="button"
            onClick={() => onNavigate("report")}
            className="px-8 py-4 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#C8A24A", color: "#081C2F" }}
            data-ocid="results.primary_button"
          >
            View Full Report →
          </button>
          <button
            type="button"
            onClick={() => onNavigate("assessment")}
            className="px-8 py-4 rounded-xl font-semibold text-sm border-2 transition-all"
            style={{ borderColor: "#081C2F", color: "#081C2F" }}
            data-ocid="results.secondary_button"
          >
            Retake Assessment
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
