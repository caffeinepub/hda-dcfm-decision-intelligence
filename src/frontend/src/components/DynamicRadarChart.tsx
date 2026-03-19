import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { Dimension } from "../scoring";
import { DIMENSION_SHORT } from "../scoring";

interface RadarChartProps {
  scores: Record<Dimension, number>;
}

const DIMENSIONS_ORDER: Dimension[] = ["pm", "em", "rrm", "iai", "sis", "edi"];

export function DynamicRadarChart({ scores }: RadarChartProps) {
  const data = DIMENSIONS_ORDER.map((d) => ({
    dimension: DIMENSION_SHORT[d],
    score: scores[d],
    fullMark: 7,
  }));

  return (
    <ResponsiveContainer width="100%" height={340}>
      <RadarChart
        data={data}
        margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
      >
        <PolarGrid stroke="rgba(200,162,74,0.2)" />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{
            fill: "#C8A24A",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "Plus Jakarta Sans",
          }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 7]}
          tickCount={8}
          tick={{ fill: "rgba(185,195,207,0.6)", fontSize: 9 }}
          axisLine={false}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#C8A24A"
          fill="#C8A24A"
          fillOpacity={0.25}
          strokeWidth={2}
          dot={{ fill: "#C8A24A", r: 4 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0B2A45",
            border: "1px solid rgba(200,162,74,0.3)",
            borderRadius: "8px",
            color: "white",
            fontSize: "12px",
          }}
          formatter={(value: number) => [value.toFixed(2), "Score"]}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
