import type React from "react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

interface Props {
  onNavigate: (page: string) => void;
}

const GOLD = "#C8A24A";
const DARK_GREEN = "#1B4332";
const CARD_BG = "rgba(45,106,79,0.3)";
const CARD_BORDER = "rgba(200,162,74,0.2)";
const AXIS_COLOR = "rgba(255,255,255,0.4)";

const DEMO_PROFILES = [
  {
    name: "Arjun Mehta",
    country: "India",
    archetype: "Sovereign Navigator",
    dfl: "High",
    pm: 6.8,
    em: 3.2,
    rrm: 7.0,
    iai: 6.5,
    sis: 4.1,
    edi: 7.0,
    inputTypes: ["video", "text"],
  },
  {
    name: "Priya Sharma",
    country: "India",
    archetype: "Empathic Sentinel",
    dfl: "Medium",
    pm: 4.5,
    em: 6.8,
    rrm: 3.2,
    iai: 5.5,
    sis: 7.0,
    edi: 3.8,
    inputTypes: ["audio", "text"],
  },
  {
    name: "David Chen",
    country: "Singapore",
    archetype: "Sovereign Navigator",
    dfl: "High",
    pm: 7.2,
    em: 2.8,
    rrm: 6.5,
    iai: 7.5,
    sis: 3.0,
    edi: 6.8,
    inputTypes: ["video"],
  },
  {
    name: "Sarah Mitchell",
    country: "United Kingdom",
    archetype: "Adaptive Harmonizer",
    dfl: "Medium",
    pm: 5.0,
    em: 5.5,
    rrm: 5.0,
    iai: 5.0,
    sis: 5.5,
    edi: 5.0,
    inputTypes: ["text", "audio"],
  },
  {
    name: "Mohammed Al-Rashid",
    country: "UAE",
    archetype: "Decisive Executor",
    dfl: "High",
    pm: 6.2,
    em: 4.0,
    rrm: 5.8,
    iai: 6.0,
    sis: 5.2,
    edi: 6.5,
    inputTypes: ["video", "audio"],
  },
  {
    name: "Anika Patel",
    country: "India",
    archetype: "Reactive Empath",
    dfl: "Low",
    pm: 3.5,
    em: 7.2,
    rrm: 2.8,
    iai: 4.0,
    sis: 7.5,
    edi: 2.5,
    inputTypes: ["audio", "text", "video"],
  },
  {
    name: "James Okafor",
    country: "Nigeria",
    archetype: "Decisive Executor",
    dfl: "High",
    pm: 6.5,
    em: 3.8,
    rrm: 6.0,
    iai: 5.8,
    sis: 4.5,
    edi: 7.2,
    inputTypes: ["text"],
  },
  {
    name: "Elena Kozlov",
    country: "Russia",
    archetype: "Balanced Strategist",
    dfl: "Medium",
    pm: 5.8,
    em: 4.2,
    rrm: 5.5,
    iai: 6.2,
    sis: 4.0,
    edi: 5.5,
    inputTypes: ["audio"],
  },
  {
    name: "Carlos Rivera",
    country: "Mexico",
    archetype: "Social Harmonizer",
    dfl: "Medium",
    pm: 4.8,
    em: 6.0,
    rrm: 4.5,
    iai: 5.2,
    sis: 6.5,
    edi: 4.2,
    inputTypes: ["text", "video"],
  },
  {
    name: "Yuki Tanaka",
    country: "Japan",
    archetype: "Sovereign Navigator",
    dfl: "High",
    pm: 7.0,
    em: 2.5,
    rrm: 7.2,
    iai: 7.8,
    sis: 2.8,
    edi: 6.2,
    inputTypes: ["video", "audio"],
  },
  {
    name: "Rania Hassan",
    country: "Egypt",
    archetype: "Adaptive Harmonizer",
    dfl: "Medium",
    pm: 5.2,
    em: 5.8,
    rrm: 4.8,
    iai: 5.0,
    sis: 6.2,
    edi: 4.5,
    inputTypes: ["audio"],
  },
  {
    name: "Sven Larsson",
    country: "Sweden",
    archetype: "Decisive Executor",
    dfl: "High",
    pm: 6.8,
    em: 3.0,
    rrm: 6.5,
    iai: 6.8,
    sis: 3.5,
    edi: 7.0,
    inputTypes: ["text", "video"],
  },
  {
    name: "Amara Diallo",
    country: "Senegal",
    archetype: "Reactive Empath",
    dfl: "Low",
    pm: 4.2,
    em: 6.5,
    rrm: 3.8,
    iai: 4.5,
    sis: 7.2,
    edi: 3.5,
    inputTypes: ["video"],
  },
  {
    name: "Rachel Kim",
    country: "South Korea",
    archetype: "Balanced Strategist",
    dfl: "High",
    pm: 6.0,
    em: 4.5,
    rrm: 5.8,
    iai: 6.5,
    sis: 4.8,
    edi: 6.0,
    inputTypes: ["audio", "video"],
  },
  {
    name: "Omar Farouk",
    country: "Pakistan",
    archetype: "Balanced Strategist",
    dfl: "Medium",
    pm: 5.5,
    em: 5.0,
    rrm: 5.2,
    iai: 5.5,
    sis: 5.0,
    edi: 5.8,
    inputTypes: ["text"],
  },
  {
    name: "Isabella Ferreira",
    country: "Brazil",
    archetype: "Adaptive Harmonizer",
    dfl: "Medium",
    pm: 5.8,
    em: 5.5,
    rrm: 5.0,
    iai: 6.0,
    sis: 5.8,
    edi: 5.2,
    inputTypes: ["audio", "text"],
  },
  {
    name: "Kwame Asante",
    country: "Ghana",
    archetype: "Sovereign Navigator",
    dfl: "High",
    pm: 6.5,
    em: 3.5,
    rrm: 6.2,
    iai: 6.8,
    sis: 3.8,
    edi: 6.5,
    inputTypes: ["video", "text"],
  },
  {
    name: "Nina Volkova",
    country: "Ukraine",
    archetype: "Reactive Empath",
    dfl: "Low",
    pm: 4.0,
    em: 6.8,
    rrm: 3.5,
    iai: 4.2,
    sis: 7.0,
    edi: 3.2,
    inputTypes: ["audio", "video"],
  },
  {
    name: "Lucas Muller",
    country: "Germany",
    archetype: "Sovereign Navigator",
    dfl: "High",
    pm: 7.2,
    em: 2.5,
    rrm: 7.0,
    iai: 7.5,
    sis: 2.5,
    edi: 7.2,
    inputTypes: ["text", "audio", "video"],
  },
  {
    name: "Fatima Zahra",
    country: "Morocco",
    archetype: "Social Harmonizer",
    dfl: "Medium",
    pm: 5.0,
    em: 6.0,
    rrm: 4.5,
    iai: 5.2,
    sis: 6.8,
    edi: 4.0,
    inputTypes: ["audio"],
  },
  {
    name: "Aditya Nair",
    country: "India",
    archetype: "Decisive Executor",
    dfl: "High",
    pm: 6.0,
    em: 4.8,
    rrm: 5.5,
    iai: 6.2,
    sis: 4.5,
    edi: 6.8,
    inputTypes: ["video", "text"],
  },
  {
    name: "Olga Petrov",
    country: "Poland",
    archetype: "Balanced Strategist",
    dfl: "Medium",
    pm: 5.5,
    em: 4.5,
    rrm: 5.8,
    iai: 5.5,
    sis: 4.2,
    edi: 6.0,
    inputTypes: ["text"],
  },
  {
    name: "Marcus Johnson",
    country: "United States",
    archetype: "Decisive Executor",
    dfl: "High",
    pm: 6.5,
    em: 3.8,
    rrm: 6.2,
    iai: 6.8,
    sis: 4.0,
    edi: 6.5,
    inputTypes: ["audio", "video"],
  },
  {
    name: "Divya Krishnan",
    country: "India",
    archetype: "Adaptive Harmonizer",
    dfl: "Medium",
    pm: 4.8,
    em: 5.8,
    rrm: 4.5,
    iai: 5.0,
    sis: 6.0,
    edi: 4.8,
    inputTypes: ["audio", "text", "video"],
  },
  {
    name: "Tariq Al-Mansouri",
    country: "Saudi Arabia",
    archetype: "Sovereign Navigator",
    dfl: "High",
    pm: 6.8,
    em: 3.5,
    rrm: 6.5,
    iai: 7.0,
    sis: 3.5,
    edi: 7.5,
    inputTypes: ["video"],
  },
  {
    name: "Mei Lin",
    country: "China",
    archetype: "Balanced Strategist",
    dfl: "High",
    pm: 6.2,
    em: 3.8,
    rrm: 6.0,
    iai: 6.5,
    sis: 3.8,
    edi: 6.2,
    inputTypes: ["text", "audio"],
  },
  {
    name: "Kofi Mensah",
    country: "Ghana",
    archetype: "Reactive Empath",
    dfl: "Low",
    pm: 3.8,
    em: 7.0,
    rrm: 3.2,
    iai: 4.0,
    sis: 7.5,
    edi: 3.0,
    inputTypes: ["audio"],
  },
  {
    name: "Anna Bergstrom",
    country: "Sweden",
    archetype: "Decisive Executor",
    dfl: "High",
    pm: 6.5,
    em: 4.0,
    rrm: 5.8,
    iai: 6.0,
    sis: 4.5,
    edi: 6.5,
    inputTypes: ["video", "text"],
  },
  {
    name: "Raj Patel",
    country: "India",
    archetype: "Sovereign Navigator",
    dfl: "High",
    pm: 7.5,
    em: 2.2,
    rrm: 7.5,
    iai: 8.0,
    sis: 2.0,
    edi: 7.8,
    inputTypes: ["video", "audio", "text"],
  },
  {
    name: "Sofia Esposito",
    country: "Italy",
    archetype: "Adaptive Harmonizer",
    dfl: "Medium",
    pm: 5.2,
    em: 5.8,
    rrm: 4.8,
    iai: 5.5,
    sis: 6.0,
    edi: 5.0,
    inputTypes: ["audio"],
  },
  {
    name: "Henry Osei",
    country: "Nigeria",
    archetype: "Balanced Strategist",
    dfl: "High",
    pm: 6.0,
    em: 4.2,
    rrm: 5.5,
    iai: 6.2,
    sis: 4.8,
    edi: 6.5,
    inputTypes: ["text", "video"],
  },
  {
    name: "Leila Ahmadi",
    country: "Iran",
    archetype: "Social Harmonizer",
    dfl: "Medium",
    pm: 4.5,
    em: 6.2,
    rrm: 4.0,
    iai: 4.8,
    sis: 6.8,
    edi: 4.0,
    inputTypes: ["audio", "text"],
  },
  {
    name: "Thomas Ndlovu",
    country: "Zimbabwe",
    archetype: "Balanced Strategist",
    dfl: "Medium",
    pm: 5.8,
    em: 4.5,
    rrm: 5.5,
    iai: 6.0,
    sis: 4.8,
    edi: 6.0,
    inputTypes: ["text"],
  },
  {
    name: "Priya Venkatesh",
    country: "India",
    archetype: "Decisive Executor",
    dfl: "High",
    pm: 6.5,
    em: 4.0,
    rrm: 6.0,
    iai: 6.5,
    sis: 4.2,
    edi: 6.8,
    inputTypes: ["video", "audio"],
  },
  {
    name: "Felix Wagner",
    country: "Germany",
    archetype: "Sovereign Navigator",
    dfl: "High",
    pm: 7.0,
    em: 2.8,
    rrm: 6.8,
    iai: 7.2,
    sis: 2.8,
    edi: 7.5,
    inputTypes: ["text", "audio", "video"],
  },
];

const ARCHETYPE_COLORS: Record<string, string> = {
  "Sovereign Navigator": "#C8A24A",
  "Decisive Executor": "#2D6A4F",
  "Balanced Strategist": "#4A90D9",
  "Adaptive Harmonizer": "#7B68EE",
  "Social Harmonizer": "#50C878",
  "Empathic Sentinel": "#FF8C69",
  "Reactive Empath": "#CD5C5C",
};

const SCENARIOS = [
  {
    scenario: "Expand business to SE Asia?",
    category: "Business",
    outcome: "Decided",
  },
  {
    scenario: "Handle public criticism professionally?",
    category: "Personal",
    outcome: "Decided",
  },
  {
    scenario: "Acquire competitor or build in-house?",
    category: "Business",
    outcome: "Hesitating",
  },
  {
    scenario: "Take leadership role or stay in niche?",
    category: "Career",
    outcome: "Decided",
  },
  {
    scenario: "Launch new product line this quarter?",
    category: "Business",
    outcome: "Decided",
  },
  {
    scenario: "Co-founder pivot — agree or disagree?",
    category: "Business",
    outcome: "Hesitating",
  },
  {
    scenario: "Hire fast or stay lean during growth?",
    category: "Business",
    outcome: "Decided",
  },
  {
    scenario: "Relocate family for better career?",
    category: "Personal",
    outcome: "Deferred",
  },
  {
    scenario: "Confront business partner about performance?",
    category: "Business",
    outcome: "Decided",
  },
  {
    scenario: "Invest in AI R&D or customer acquisition?",
    category: "Investment",
    outcome: "Hesitating",
  },
  {
    scenario: "Start side business while employed?",
    category: "Career",
    outcome: "Decided",
  },
  {
    scenario: "Restructure team after poor Q1?",
    category: "Business",
    outcome: "Decided",
  },
  {
    scenario: "Leave NGO for corporate sector?",
    category: "Career",
    outcome: "Deferred",
  },
  {
    scenario: "Take CEO role at 29 or gain more experience?",
    category: "Career",
    outcome: "Decided",
  },
  {
    scenario: "Open second location or double down on flagship?",
    category: "Business",
    outcome: "Hesitating",
  },
  {
    scenario: "Raise seed funding or bootstrap?",
    category: "Investment",
    outcome: "Decided",
  },
  {
    scenario: "Partner with government or stay private sector?",
    category: "Business",
    outcome: "Decided",
  },
  {
    scenario: "Rebuild career post-crisis or pivot?",
    category: "Career",
    outcome: "Decided",
  },
  {
    scenario: "Shut down a $2M product line for brand values?",
    category: "Business",
    outcome: "Hesitating",
  },
  {
    scenario: "Decline high-paying job against personal values?",
    category: "Personal",
    outcome: "Decided",
  },
  {
    scenario: "Fire high performer with toxic behavior?",
    category: "Business",
    outcome: "Decided",
  },
  {
    scenario: "Launch in EU market before product is perfect?",
    category: "Business",
    outcome: "Hesitating",
  },
  {
    scenario: "Take Series A now or wait for better valuation?",
    category: "Investment",
    outcome: "Decided",
  },
  {
    scenario: "Accept promotion requiring relocation from family?",
    category: "Career",
    outcome: "Deferred",
  },
  {
    scenario: "Diversify portfolio into tech startups?",
    category: "Investment",
    outcome: "Decided",
  },
  {
    scenario: "Enter Western markets or dominate APAC first?",
    category: "Business",
    outcome: "Decided",
  },
  {
    scenario: "Leave stable government job for entrepreneurship?",
    category: "Career",
    outcome: "Hesitating",
  },
  {
    scenario: "Fire underperforming board member?",
    category: "Business",
    outcome: "Decided",
  },
  {
    scenario: "Exit current company for AI startup?",
    category: "Career",
    outcome: "Decided",
  },
  {
    scenario: "Scale family business globally or maintain identity?",
    category: "Business",
    outcome: "Decided",
  },
  {
    scenario: "Negotiate equity or salary first?",
    category: "Career",
    outcome: "Hesitating",
  },
  {
    scenario: "Build startup at home or emigrate?",
    category: "Personal",
    outcome: "Deferred",
  },
  {
    scenario: "Prioritize impact or profitability in year 1?",
    category: "Business",
    outcome: "Decided",
  },
  {
    scenario: "Build product team in India vs US engineers?",
    category: "Business",
    outcome: "Decided",
  },
  {
    scenario: "Acquire healthtech startup for €15M?",
    category: "Investment",
    outcome: "Decided",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Business: "#2D6A4F",
  Personal: "#7B68EE",
  Career: "#4A90D9",
  Investment: GOLD,
};

const OUTCOME_COLORS: Record<string, string> = {
  Decided: "#50C878",
  Hesitating: GOLD,
  Deferred: "#4A90D9",
};

const COUNTRY_FLAGS: Record<string, string> = {
  India: "🇮🇳",
  Singapore: "🇸🇬",
  "United Kingdom": "🇬🇧",
  UAE: "🇦🇪",
  Nigeria: "🇳🇬",
  Russia: "🇷🇺",
  Mexico: "🇲🇽",
  Japan: "🇯🇵",
  Egypt: "🇪🇬",
  Sweden: "🇸🇪",
  Senegal: "🇸🇳",
  "South Korea": "🇰🇷",
  Pakistan: "🇵🇰",
  Brazil: "🇧🇷",
  Ghana: "🇬🇭",
  Ukraine: "🇺🇦",
  Germany: "🇩🇪",
  Morocco: "🇲🇦",
  Poland: "🇵🇱",
  "United States": "🇺🇸",
  "Saudi Arabia": "🇸🇦",
  China: "🇨🇳",
  Italy: "🇮🇹",
  Iran: "🇮🇷",
  Zimbabwe: "🇿🇼",
};

function avg(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function SectionCard({
  number,
  title,
  children,
}: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section
      className="rounded-2xl p-6 mb-8"
      style={{
        backgroundColor: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 16,
      }}
    >
      <h2
        className="text-xl font-bold mb-6"
        style={{ color: GOLD, letterSpacing: "0.02em" }}
      >
        {number} — {title}
      </h2>
      {children}
    </section>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm shadow-xl"
      style={{
        backgroundColor: "#0d2818",
        border: `1px solid ${GOLD}`,
        color: "white",
      }}
    >
      {label && (
        <p className="font-bold mb-1" style={{ color: GOLD }}>
          {label}
        </p>
      )}
      {payload.map((p: any, i: number) => (
        <p key={`${p.name}-${i}`} style={{ color: p.color || "white" }}>
          {p.name}:{" "}
          <strong>
            {typeof p.value === "number" ? p.value.toFixed(2) : p.value}
          </strong>
        </p>
      ))}
    </div>
  );
};

// ---- Helper components for interactive sections ----

function NeuralDecisionNetwork({
  demoProfiles,
}: { demoProfiles: typeof DEMO_PROFILES }) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const CX = 260;
  const CY = 200;
  const ORBIT_R = 130;
  const nodes = [
    { id: "PM", color: "#C8A24A", score: 5.9 },
    { id: "EM", color: "#7B9FC7", score: 4.8 },
    { id: "RRM", color: "#82B89A", score: 5.4 },
    { id: "IAI", color: "#C4A882", score: 6.1 },
    { id: "SIS", color: "#A688C4", score: 4.9 },
    { id: "EDI", color: "#E08A7A", score: 5.7 },
  ].map((n, i) => {
    const a = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    return {
      ...n,
      x: CX + ORBIT_R * Math.cos(a),
      y: CY + ORBIT_R * Math.sin(a),
    };
  });
  const edges = [
    { a: "PM", b: "EDI", w: 0.72, neg: false },
    { a: "PM", b: "IAI", w: 0.68, neg: false },
    { a: "EM", b: "SIS", w: 0.65, neg: false },
    { a: "RRM", b: "PM", w: 0.55, neg: false },
    { a: "IAI", b: "RRM", w: 0.6, neg: false },
    { a: "EDI", b: "RRM", w: 0.58, neg: false },
    { a: "EM", b: "IAI", w: 0.42, neg: true },
    { a: "SIS", b: "EDI", w: 0.38, neg: true },
    { a: "PM", b: "EM", w: 0.3, neg: false },
    { a: "IAI", b: "SIS", w: 0.28, neg: false },
    { a: "EDI", b: "EM", w: 0.25, neg: false },
  ];
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const dimDesc: Record<string, string> = {
    PM: "Process Management: Structured, systematic decision workflows.",
    EM: "Emotional Management: Regulation of emotional states for clear judgment.",
    RRM: "Risk & Reward: Calibrated uncertainty vs. opportunity assessment.",
    IAI: "Analytical Intelligence: Data synthesis reducing cognitive bias.",
    SIS: "Social Skills: Stakeholder dynamics and collaborative intelligence.",
    EDI: "Executive Intelligence: Strategic thinking and high-stakes execution.",
  };
  void demoProfiles;
  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <svg
        width="520"
        height="400"
        viewBox="0 0 520 400"
        className="flex-shrink-0 w-full max-w-lg"
        aria-hidden="true"
      >
        {Array.from({ length: 48 }, (_, k) => {
          const row = Math.floor(k / 8);
          const col = k % 8;
          const hx = col * 60 + (row % 2) * 30;
          const hy = row * 52;
          return (
            <polygon
              key={`p${hx}-${hy}`}
              points={`${hx + 15},${hy} ${hx + 30},${hy + 9} ${hx + 30},${hy + 26} ${hx + 15},${hy + 35} ${hx},${hy + 26} ${hx},${hy + 9}`}
              fill="none"
              stroke="rgba(200,162,74,0.04)"
              strokeWidth="1"
            />
          );
        })}
        {edges.map((e) => {
          const na = nodeMap[e.a];
          const nb = nodeMap[e.b];
          if (!na || !nb) return null;
          const isHighlighted =
            selectedNode && (e.a === selectedNode || e.b === selectedNode);
          const opacity = selectedNode
            ? isHighlighted
              ? 0.9
              : 0.1
            : e.neg
              ? 0.5
              : 0.4;
          return (
            <line
              key={`${e.a}-${e.b}`}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke={e.neg ? "#E08A7A" : GOLD}
              strokeWidth={e.w * 4}
              strokeOpacity={opacity}
              strokeDasharray={e.neg ? "6 4" : "none"}
            />
          );
        })}
        {nodes.map((n) => {
          const isSelected = selectedNode === n.id;
          const isConnected = selectedNode
            ? edges.some(
                (e) =>
                  (e.a === selectedNode && e.b === n.id) ||
                  (e.b === selectedNode && e.a === n.id),
              )
            : false;
          const opacity = selectedNode
            ? isSelected || isConnected
              ? 1
              : 0.4
            : 1;
          return (
            <g
              key={n.id}
              style={{ cursor: "pointer", opacity }}
              tabIndex={0}
              onClick={() =>
                setSelectedNode(selectedNode === n.id ? null : n.id)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  setSelectedNode(selectedNode === n.id ? null : n.id);
              }}
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={28 + (n.score / 7) * 8}
                fill={n.color}
                fillOpacity={0.1}
              />
              <circle
                cx={n.x}
                cy={n.y}
                r={22}
                fill={n.color}
                fillOpacity={isSelected ? 0.9 : 0.7}
                stroke={n.color}
                strokeWidth={isSelected ? 3 : 1.5}
              />
              <text
                x={n.x}
                y={n.y + 5}
                textAnchor="middle"
                fill="white"
                fontSize={10}
                fontWeight="bold"
              >
                {n.id}
              </text>
              <text
                x={n.x}
                y={n.y + 50}
                textAnchor="middle"
                fill={n.color}
                fontSize={8}
                fillOpacity={0.7}
              >
                {n.score.toFixed(1)}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex-1 space-y-3">
        {selectedNode ? (
          <div
            className="rounded-xl p-4"
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              border: `1px solid ${nodeMap[selectedNode]?.color}50`,
            }}
          >
            <div
              className="text-sm font-bold mb-2"
              style={{ color: nodeMap[selectedNode]?.color }}
            >
              {selectedNode} — Active Connections
            </div>
            <p className="text-xs text-white/60 mb-3">
              {dimDesc[selectedNode]}
            </p>
            {edges
              .filter((e) => e.a === selectedNode || e.b === selectedNode)
              .map((e) => {
                const other = e.a === selectedNode ? e.b : e.a;
                return (
                  <div
                    key={`${e.a}-${e.b}`}
                    className="flex items-center gap-2 mb-2"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: e.neg ? "#E08A7A" : GOLD }}
                    />
                    <span className="text-xs text-white/70">
                      {selectedNode} → {other}
                    </span>
                    <span
                      className="text-xs font-bold ml-auto"
                      style={{ color: e.neg ? "#E08A7A" : GOLD }}
                    >
                      {e.neg ? "−" : "+"}
                      {e.w.toFixed(2)}
                    </span>
                  </div>
                );
              })}
          </div>
        ) : (
          <p className="text-xs text-white/40 italic">
            Click any node to explore its dimensional connections
          </p>
        )}
        <div className="space-y-2 mt-4">
          <div className="text-xs font-bold text-white/70 mb-2">
            Correlation Key
          </div>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <div className="w-8 h-0.5" style={{ backgroundColor: GOLD }} />{" "}
            Positive correlation (synergistic pathway)
          </div>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <div
              className="w-8 h-0.5"
              style={{
                backgroundColor: "#E08A7A",
                borderTop: "2px dashed #E08A7A",
              }}
            />{" "}
            Negative correlation (productive tension)
          </div>
          <div className="text-xs text-white/40 mt-3 leading-relaxed">
            Line thickness = correlation strength. Node size reflects cohort
            average score. The PM–EDI axis (r=0.72) is the platform&apos;s most
            powerful synergy: structured thinkers execute decisively.
          </div>
        </div>
      </div>
    </div>
  );
}

function DecisionGauge() {
  const [needleAngle, setNeedleAngle] = useState(-90);
  useEffect(() => {
    const target = -90 + 0.72 * 180;
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / 2000, 1);
      const eased = 1 - (1 - progress) ** 3;
      setNeedleAngle(-90 + eased * (target - -90));
      if (progress < 1) requestAnimationFrame(animate);
    };
    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const W = 400;
  const CX = 200;
  const CY = 220;
  const R = 160;
  const STROKE = 28;
  const zones = [
    { start: 0, end: 0.4, color: "#CD5C5C", label: "Reactive" },
    { start: 0.4, end: 0.7, color: GOLD, label: "Developing" },
    { start: 0.7, end: 1.0, color: "#50C878", label: "Sovereign" },
  ];
  const arcPath = (startPct: number, endPct: number) => {
    const startAngle = Math.PI + startPct * Math.PI;
    const endAngle = Math.PI + endPct * Math.PI;
    const x1 = CX + R * Math.cos(startAngle);
    const y1 = CY + R * Math.sin(startAngle);
    const x2 = CX + R * Math.cos(endAngle);
    const y2 = CY + R * Math.sin(endAngle);
    return `M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`;
  };
  const needleRad = (needleAngle * Math.PI) / 180;
  const NL = 130;
  const nx = CX + NL * Math.cos(needleRad);
  const ny = CY + NL * Math.sin(needleRad);

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-center">
      <div className="flex-shrink-0">
        <svg
          width={W}
          height={260}
          viewBox={`0 0 ${W} 260`}
          className="w-full max-w-md"
          aria-hidden="true"
        >
          {zones.map((z) => (
            <path
              key={z.label}
              d={arcPath(z.start, z.end)}
              fill="none"
              stroke={z.color}
              strokeWidth={STROKE}
              strokeLinecap="round"
              opacity={0.3}
            />
          ))}
          <path
            d={arcPath(0, 0.72)}
            fill="none"
            stroke="#50C878"
            strokeWidth={STROKE - 6}
            strokeLinecap="round"
            opacity={0.8}
          />
          {zones.map((z) => {
            const midPct = (z.start + z.end) / 2;
            const a = Math.PI + midPct * Math.PI;
            const lx = CX + (R + 26) * Math.cos(a);
            const ly = CY + (R + 26) * Math.sin(a);
            return (
              <text
                key={z.label}
                x={lx}
                y={ly}
                textAnchor="middle"
                fill={z.color}
                fontSize={9}
                fontWeight="bold"
              >
                {z.label}
              </text>
            );
          })}
          {Array.from({ length: 11 }, (_, i) => {
            const pct = i / 10;
            const a = Math.PI + pct * Math.PI;
            const x1 = CX + (R - 18) * Math.cos(a);
            const y1 = CY + (R - 18) * Math.sin(a);
            const x2 = CX + (R - 8) * Math.cos(a);
            const y2 = CY + (R - 8) * Math.sin(a);
            return (
              <line
                key={pct.toFixed(1)}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth={i % 5 === 0 ? 2 : 1}
              />
            );
          })}
          <line
            x1={CX}
            y1={CY}
            x2={nx}
            y2={ny}
            stroke="white"
            strokeWidth={3}
            strokeLinecap="round"
          />
          <circle cx={CX} cy={CY} r={10} fill="white" />
          <circle cx={CX} cy={CY} r={6} fill={GOLD} />
          <text
            x={CX}
            y={CY - 30}
            textAnchor="middle"
            fill={GOLD}
            fontSize={32}
            fontWeight="bold"
          >
            7.2
          </text>
          <text
            x={CX}
            y={CY - 12}
            textAnchor="middle"
            fill="rgba(255,255,255,0.5)"
            fontSize={10}
          >
            out of 10
          </text>
          <text
            x={CX}
            y={CY + 40}
            textAnchor="middle"
            fill="rgba(255,255,255,0.4)"
            fontSize={9}
          >
            NovaMind Corp Cohort Average
          </text>
        </svg>
      </div>
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Fastest Decider",
            name: "Yuki Tanaka",
            value: "2.1s avg",
            color: "#82B89A",
            icon: "⚡",
          },
          {
            label: "Most Consistent",
            name: "Lucas Muller",
            value: "97% stable",
            color: GOLD,
            icon: "🎯",
          },
          {
            label: "Highest IAI",
            name: "David Chen",
            value: "7.5 / 7.0",
            color: "#7B9FC7",
            icon: "🧠",
          },
          {
            label: "Top EDI Score",
            name: "Arjun Mehta",
            value: "7.0 EDI",
            color: "#E08A7A",
            icon: "👑",
          },
          {
            label: "Sovereign Zone",
            name: "20 of 35",
            value: "57% cohort",
            color: "#50C878",
            icon: "🏆",
          },
          {
            label: "Avg Assessment",
            name: "5.1 sessions",
            value: "per member",
            color: "#A688C4",
            icon: "📊",
          },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-xl p-4 text-center"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              border: `1px solid ${m.color}30`,
            }}
          >
            <div className="text-2xl mb-1">{m.icon}</div>
            <div className="text-xs text-white/40 mb-1">{m.label}</div>
            <div className="font-bold text-sm" style={{ color: m.color }}>
              {m.name}
            </div>
            <div className="text-xs text-white/50 mt-0.5">{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InvestorShowcasePage({ onNavigate }: Props) {
  // Computed data
  const archetypeCounts = DEMO_PROFILES.reduce(
    (acc, p) => {
      acc[p.archetype] = (acc[p.archetype] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const archetypePieData = Object.entries(archetypeCounts).map(
    ([name, value]) => ({ name, value }),
  );

  const dflCounts = { High: 0, Medium: 0, Low: 0 };
  for (const p of DEMO_PROFILES) dflCounts[p.dfl as keyof typeof dflCounts]++;
  const dflBarData = [
    { name: "High", count: dflCounts.High, fill: GOLD },
    { name: "Medium", count: dflCounts.Medium, fill: "#4A90D9" },
    { name: "Low", count: dflCounts.Low, fill: "#CD5C5C" },
  ];

  const countryCounts = DEMO_PROFILES.reduce(
    (acc, p) => {
      acc[p.country] = (acc[p.country] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const avgDimensions = [
    { dimension: "PM", value: avg(DEMO_PROFILES.map((p) => p.pm)) },
    { dimension: "EM", value: avg(DEMO_PROFILES.map((p) => p.em)) },
    { dimension: "RRM", value: avg(DEMO_PROFILES.map((p) => p.rrm)) },
    { dimension: "IAI", value: avg(DEMO_PROFILES.map((p) => p.iai)) },
    { dimension: "SIS", value: avg(DEMO_PROFILES.map((p) => p.sis)) },
    { dimension: "EDI", value: avg(DEMO_PROFILES.map((p) => p.edi)) },
  ];

  const scatterData = DEMO_PROFILES.map((p) => ({
    x: p.em,
    y: p.edi,
    name: p.name,
    archetype: p.archetype,
    fill: ARCHETYPE_COLORS[p.archetype] || GOLD,
  }));

  const modalityData = [
    {
      name: "Text",
      count: DEMO_PROFILES.filter((p) => p.inputTypes.includes("text")).length,
      fill: "#4A90D9",
    },
    {
      name: "Audio",
      count: DEMO_PROFILES.filter((p) => p.inputTypes.includes("audio")).length,
      fill: "#7B68EE",
    },
    {
      name: "Video",
      count: DEMO_PROFILES.filter((p) => p.inputTypes.includes("video")).length,
      fill: GOLD,
    },
  ];

  const outcomePieData = [
    { name: "Decided", value: 22, fill: "#50C878" },
    { name: "Hesitating", value: 8, fill: GOLD },
    { name: "Deferred", value: 5, fill: "#4A90D9" },
  ];

  // Evolution timeline data
  const timelineData = [
    {
      session: "S1",
      sovereign_pm: 5.2,
      sovereign_edi: 5.5,
      balanced_pm: 4.8,
      balanced_edi: 4.5,
      reactive_pm: 3.5,
      reactive_edi: 2.8,
    },
    {
      session: "S2",
      sovereign_pm: 5.8,
      sovereign_edi: 6.0,
      balanced_pm: 5.1,
      balanced_edi: 5.0,
      reactive_pm: 3.8,
      reactive_edi: 3.2,
    },
    {
      session: "S3",
      sovereign_pm: 6.2,
      sovereign_edi: 6.5,
      balanced_pm: 5.5,
      balanced_edi: 5.4,
      reactive_pm: 4.1,
      reactive_edi: 3.5,
    },
    {
      session: "S4",
      sovereign_pm: 6.7,
      sovereign_edi: 6.9,
      balanced_pm: 5.8,
      balanced_edi: 5.8,
      reactive_pm: 4.4,
      reactive_edi: 3.8,
    },
    {
      session: "S5",
      sovereign_pm: 7.1,
      sovereign_edi: 7.2,
      balanced_pm: 6.1,
      balanced_edi: 6.1,
      reactive_pm: 4.7,
      reactive_edi: 4.2,
    },
  ];

  // Sample profiles for twin architecture section
  const twinSamples = DEMO_PROFILES.slice(0, 6);

  function scoreColor(val: number) {
    if (val < 3) return "#CD5C5C";
    if (val < 5) return "#C8A24A";
    if (val < 7) return "#2D9E5A";
    return GOLD;
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#0A1F14", color: "white" }}
    >
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${DARK_GREEN} 0%, #0d2b1e 100%)`,
          borderBottom: `1px solid ${CARD_BORDER}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            type="button"
            onClick={() => onNavigate("adminDashboard")}
            className="text-white/50 hover:text-white text-sm mb-4 block"
            data-ocid="showcase.link"
          >
            ← Admin
          </button>
          <div className="text-center py-6">
            <h1
              className="text-4xl md:text-5xl font-bold mb-2"
              style={{ letterSpacing: "-0.02em" }}
            >
              Decision Intelligence Platform
            </h1>
            <p className="text-2xl font-semibold mb-3" style={{ color: GOLD }}>
              A–Z Capabilities Showcase
            </p>
            <p className="text-white/50 text-sm mb-8">
              Built on HDA–DCFM · Dynamic Cognitive Field Manifold · Patent
              Pending
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "35 Profiles",
                "175+ Assessments",
                "70+ Twin Versions",
                "35 Decision Scenarios",
                "105+ Journal Entries",
              ].map((pill) => (
                <span
                  key={pill}
                  className="px-5 py-2 rounded-full font-bold text-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(200,162,74,0.2), rgba(200,162,74,0.1))",
                    border: "1px solid rgba(200,162,74,0.4)",
                    color: GOLD,
                  }}
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Section 2: Archetype Distribution */}
        <SectionCard number="02" title="Cognitive Archetype Distribution">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={archetypePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={130}
                  dataKey="value"
                  label={({ value }) => String(value)}
                  labelLine={false}
                >
                  {archetypePieData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={ARCHETYPE_COLORS[entry.name] || "#888"}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {archetypePieData.map((entry) => (
                <div
                  key={entry.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: ARCHETYPE_COLORS[entry.name] || "#888",
                      }}
                    />
                    <span className="text-white/80 text-sm">{entry.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold" style={{ color: GOLD }}>
                      {entry.value}
                    </span>
                    <span className="text-white/40 text-xs w-12 text-right">
                      {((entry.value / 35) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Section 3: Decision Force Levels */}
        <SectionCard number="03" title="Decision Force Levels Across Cohort">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={dflBarData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="name"
                tick={{ fill: AXIS_COLOR, fontSize: 13 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                radius={[8, 8, 0, 0]}
                label={{ position: "top", fill: GOLD, fontWeight: "bold" }}
              >
                {dflBarData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Section 4: Global Reach */}
        <SectionCard number="04" title="Global Reach: Countries Represented">
          <div className="flex flex-wrap gap-3">
            {Object.entries(countryCounts).map(([country, count]) => (
              <div
                key={country}
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <span className="text-xl">
                  {COUNTRY_FLAGS[country] || "🌍"}
                </span>
                <div>
                  <div className="text-white/80 text-sm font-medium">
                    {country}
                  </div>
                  <div className="text-white/40 text-xs">
                    {count} profile{count > 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-white/40 text-sm mt-4">
            {Object.keys(countryCounts).length} countries represented · Truly
            global cognitive dataset
          </p>
        </SectionCard>

        {/* Section 5: Dimension Heatmap */}
        <SectionCard number="05" title="Dimension Intelligence Heatmap">
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[600px]">
              <thead>
                <tr>
                  <th
                    className="text-left py-2 pr-4 text-white/50 font-medium sticky left-0"
                    style={{ backgroundColor: "#0d2818" }}
                  >
                    Profile
                  </th>
                  {["PM", "EM", "RRM", "IAI", "SIS", "EDI"].map((dim) => (
                    <th
                      key={dim}
                      className="py-2 px-3 text-center font-bold"
                      style={{ color: GOLD }}
                    >
                      {dim}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEMO_PROFILES.map((p) => (
                  <tr
                    key={p.name}
                    style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <td
                      className="py-1.5 pr-4 text-white/60 whitespace-nowrap sticky left-0"
                      style={{ backgroundColor: "#0d2818" }}
                    >
                      {p.name}
                    </td>
                    {(
                      [
                        ["PM", p.pm],
                        ["EM", p.em],
                        ["RRM", p.rrm],
                        ["IAI", p.iai],
                        ["SIS", p.sis],
                        ["EDI", p.edi],
                      ] as [string, number][]
                    ).map(([dim, val]) => (
                      <td
                        key={dim}
                        className="py-1.5 px-3 text-center font-bold"
                        style={{ color: scoreColor(val) }}
                      >
                        {val.toFixed(1)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 mt-4 text-xs">
            {[
              { label: "< 3.0", color: "#CD5C5C" },
              { label: "3.0 – 5.0", color: "#C8A24A" },
              { label: "5.0 – 7.0", color: "#2D9E5A" },
              { label: "> 7.0", color: GOLD },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-white/50">{item.label}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Section 6: Cohort Radar */}
        <SectionCard number="06" title="Average Dimension Scores: Cohort Radar">
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={360}>
              <RadarChart
                data={avgDimensions}
                cx="50%"
                cy="50%"
                outerRadius={130}
              >
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: GOLD, fontSize: 13, fontWeight: "bold" }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 8]}
                  tick={{ fill: AXIS_COLOR, fontSize: 10 }}
                  axisLine={false}
                />
                <Radar
                  name="Cohort Avg"
                  dataKey="value"
                  stroke={GOLD}
                  fill={GOLD}
                  fillOpacity={0.2}
                  strokeWidth={2.5}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-2">
            {avgDimensions.map((d) => (
              <div key={d.dimension} className="text-center">
                <div className="font-bold" style={{ color: GOLD }}>
                  {d.dimension}
                </div>
                <div className="text-white/70 text-sm">
                  {d.value.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Section 7: EM vs EDI Scatter */}
        <SectionCard number="07" title="EM vs EDI Cognitive Scatter">
          <p className="text-white/40 text-sm mb-4">
            Emotional Magnitude (X) vs Execution Drive Index (Y) — each point is
            a profile
          </p>
          <div className="relative">
            {/* Quadrant labels */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{ paddingLeft: 60, paddingBottom: 40 }}
            >
              <div className="w-full h-full relative">
                <span className="absolute top-2 right-2 text-xs text-white/20">
                  Calm High Executor
                </span>
                <span className="absolute top-2 left-2 text-xs text-white/20">
                  Emotionally Driven Executor
                </span>
                <span className="absolute bottom-8 right-2 text-xs text-white/20">
                  Calm Low Executor
                </span>
                <span className="absolute bottom-8 left-2 text-xs text-white/20">
                  Emotionally Reactive Low Action
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={360}>
              <ScatterChart
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="EM"
                  domain={[0, 9]}
                  label={{
                    value: "Emotional Magnitude (EM)",
                    position: "insideBottom",
                    offset: -5,
                    fill: AXIS_COLOR,
                    fontSize: 11,
                  }}
                  tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                  axisLine={false}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="EDI"
                  domain={[0, 9]}
                  label={{
                    value: "Execution Drive (EDI)",
                    angle: -90,
                    position: "insideLeft",
                    fill: AXIS_COLOR,
                    fontSize: 11,
                  }}
                  tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                  axisLine={false}
                />
                <ZAxis range={[60, 60]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3", stroke: GOLD }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div
                        className="rounded-xl px-4 py-3 text-sm"
                        style={{
                          backgroundColor: "#0d2818",
                          border: `1px solid ${GOLD}`,
                          color: "white",
                        }}
                      >
                        <p className="font-bold" style={{ color: GOLD }}>
                          {d.name}
                        </p>
                        <p className="text-white/60">{d.archetype}</p>
                        <p>
                          EM: {d.x} · EDI: {d.y}
                        </p>
                      </div>
                    );
                  }}
                />
                <Scatter
                  data={scatterData}
                  shape={(props: any) => {
                    const { cx, cy, payload } = props;
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={7}
                        fill={payload.fill}
                        opacity={0.85}
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth={1}
                      />
                    );
                  }}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            {Object.entries(ARCHETYPE_COLORS).map(([name, color]) => (
              <div key={name} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-white/50 text-xs">{name}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Section 8: Decision Outcome */}
        <SectionCard number="08" title="Decision Outcome Distribution">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={outcomePieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  dataKey="value"
                  label={({ name, value }) =>
                    `${name}: ${((value / 35) * 100).toFixed(0)}%`
                  }
                  labelLine={{ stroke: AXIS_COLOR }}
                >
                  {outcomePieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4">
              {outcomePieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-4">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: entry.fill }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-white/80 font-medium">
                        {entry.name}
                      </span>
                      <span className="font-bold" style={{ color: entry.fill }}>
                        {entry.value} ({((entry.value / 35) * 100).toFixed(0)}%)
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full"
                      style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                    >
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(entry.value / 35) * 100}%`,
                          backgroundColor: entry.fill,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Section 9: Input Modality */}
        <SectionCard number="09" title="Input Modality Analytics">
          <p className="text-white/40 text-sm mb-4">
            How profiles chose to express their cognitive responses
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={modalityData}
              layout="vertical"
              margin={{ top: 0, right: 80, left: 20, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "white", fontSize: 13, fontWeight: "600" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                radius={[0, 8, 8, 0]}
                label={{ position: "right", fill: GOLD, fontWeight: "bold" }}
              >
                {modalityData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Section 10: Twin Architecture */}
        <SectionCard number="10" title="Twin Architecture: Versions Built">
          <p className="text-white/40 text-sm mb-6">
            Each user builds multiple cognitive twin versions — Current, Future,
            Bold, Calm — enabling what-if simulation
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {twinSamples.map((profile) => {
              const versions = [
                {
                  label: "Current Me",
                  dims: [
                    profile.pm,
                    profile.em,
                    profile.rrm,
                    profile.iai,
                    profile.sis,
                    profile.edi,
                  ],
                  color: GOLD,
                },
                {
                  label: "Future Me",
                  dims: [
                    Math.min(9, profile.pm + 1.2),
                    Math.max(1, profile.em - 1.0),
                    Math.min(9, profile.rrm + 0.8),
                    Math.min(9, profile.iai + 0.9),
                    profile.sis,
                    Math.min(9, profile.edi + 1.1),
                  ],
                  color: "#50C878",
                },
              ];
              const dims = ["PM", "EM", "RRM", "IAI", "SIS", "EDI"];
              return (
                <div
                  key={profile.name}
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="font-bold text-sm mb-1">{profile.name}</div>
                  <div
                    className="text-white/40 text-xs mb-3"
                    style={{ color: ARCHETYPE_COLORS[profile.archetype] }}
                  >
                    {profile.archetype}
                  </div>
                  {dims.map((dim, di) => (
                    <div key={dim} className="mb-1.5">
                      <div className="flex justify-between text-xs text-white/30 mb-0.5">
                        <span>{dim}</span>
                        <span style={{ color: GOLD }}>
                          {versions[1].dims[di].toFixed(1)}
                        </span>
                      </div>
                      <div
                        className="relative h-1.5 rounded-full"
                        style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                      >
                        <div
                          className="absolute top-0 left-0 h-1.5 rounded-full opacity-40"
                          style={{
                            width: `${(versions[0].dims[di] / 9) * 100}%`,
                            backgroundColor: versions[0].color,
                          }}
                        />
                        <div
                          className="absolute top-0 left-0 h-1.5 rounded-full"
                          style={{
                            width: `${(versions[1].dims[di] / 9) * 100}%`,
                            backgroundColor: versions[1].color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-3 mt-2 text-xs">
                    <span className="flex items-center gap-1">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: GOLD, opacity: 0.4 }}
                      />
                      Current
                    </span>
                    <span className="flex items-center gap-1">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: "#50C878" }}
                      />
                      Future
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Section 11: Cognitive Evolution Timeline */}
        <SectionCard number="11" title="Cognitive Evolution Timeline">
          <p className="text-white/40 text-sm mb-4">
            PM & EDI progression across 5 training sessions by archetype group
          </p>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={timelineData}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="session"
                tick={{ fill: AXIS_COLOR, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[2, 8]}
                tick={{ fill: AXIS_COLOR, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="sovereign_pm"
                name="Sovereign — PM"
                stroke={GOLD}
                strokeWidth={2.5}
                dot={{ r: 4, fill: GOLD }}
              />
              <Line
                type="monotone"
                dataKey="sovereign_edi"
                name="Sovereign — EDI"
                stroke="#e6c97a"
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={{ r: 3, fill: "#e6c97a" }}
              />
              <Line
                type="monotone"
                dataKey="balanced_pm"
                name="Balanced — PM"
                stroke="#4A90D9"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#4A90D9" }}
              />
              <Line
                type="monotone"
                dataKey="balanced_edi"
                name="Balanced — EDI"
                stroke="#7ab3e8"
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={{ r: 3, fill: "#7ab3e8" }}
              />
              <Line
                type="monotone"
                dataKey="reactive_pm"
                name="Reactive — PM"
                stroke="#CD5C5C"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#CD5C5C" }}
              />
              <Line
                type="monotone"
                dataKey="reactive_edi"
                name="Reactive — EDI"
                stroke="#e08080"
                strokeWidth={2}
                strokeDasharray="5 3"
                dot={{ r: 3, fill: "#e08080" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Section 12: A-Z Decision Scenarios */}
        <SectionCard number="12" title="A–Z Decision Scenarios">
          <p className="text-white/40 text-sm mb-6">
            35 real-world scenarios tested across the cohort — spanning
            business, career, personal, and investment decisions
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {SCENARIOS.map((s) => (
              <div
                key={s.scenario}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                    style={{
                      backgroundColor: `${CATEGORY_COLORS[s.category]}25`,
                      color: CATEGORY_COLORS[s.category],
                      border: `1px solid ${CATEGORY_COLORS[s.category]}40`,
                    }}
                  >
                    {s.category}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0"
                    style={{
                      backgroundColor: `${OUTCOME_COLORS[s.outcome]}20`,
                      color: OUTCOME_COLORS[s.outcome],
                    }}
                  >
                    {s.outcome}
                  </span>
                </div>
                <p className="text-white/75 text-sm leading-snug">
                  {s.scenario}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Section 13: What Makes elidi Unique */}
        <SectionCard number="13" title="What Makes elidi Unique">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Traditional */}
            <div
              className="rounded-xl p-5"
              style={{
                backgroundColor: "rgba(205,92,92,0.08)",
                border: "1px solid rgba(205,92,92,0.2)",
              }}
            >
              <h3 className="font-bold text-white/60 text-center mb-4">
                Traditional Assessment
              </h3>
              <ul className="space-y-3">
                {[
                  "Static one-time test",
                  "Generic archetypes",
                  "No simulation capability",
                  "Text-only input",
                  "No growth tracking",
                  "Flat PDF report",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-white/50"
                  >
                    <span className="text-red-400 mt-0.5 flex-shrink-0">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Center VS */}
            <div className="flex flex-col items-center justify-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl"
                style={{
                  backgroundColor: DARK_GREEN,
                  border: `2px solid ${GOLD}`,
                  color: GOLD,
                }}
              >
                VS
              </div>
              <p
                className="text-center text-sm font-bold"
                style={{ color: GOLD }}
              >
                elidi
              </p>
              <p className="text-center text-white/30 text-xs">
                Dynamic Cognitive Field Manifold
              </p>
            </div>

            {/* elidi */}
            <div
              className="rounded-xl p-5"
              style={{
                backgroundColor: "rgba(45,106,79,0.2)",
                border: `1px solid ${CARD_BORDER}`,
              }}
            >
              <h3
                className="font-bold text-center mb-4"
                style={{ color: GOLD }}
              >
                elidi Platform
              </h3>
              <ul className="space-y-3">
                {[
                  "Living, evolving cognitive twin",
                  "DCFM-powered precision archetypes",
                  "What-if decision simulation",
                  "Audio + Video + Scale input",
                  "Growth trajectory mapped over time",
                  "3D cognitive landscape + radar",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-white/80"
                  >
                    <span className="text-green-400 mt-0.5 flex-shrink-0">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>

        {/* Section 15: NovaMind Corp — Enterprise Cognitive Intelligence */}
        <SectionCard
          number="15"
          title="NovaMind Corp — Enterprise Cognitive Intelligence"
        >
          <p className="text-white/50 text-sm mb-6">
            A flagship enterprise client demonstration: how elidi maps an entire
            150-person technology organization across decision science,
            cognitive archetypes, and team intelligence.
          </p>

          {/* Org stats banner */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {[
              {
                label: "Employees Mapped",
                value: "150",
                sub: "Full org coverage",
              },
              {
                label: "Teams Profiled",
                value: "20",
                sub: "Across all departments",
              },
              {
                label: "Assessments Taken",
                value: "847",
                sub: "HDA-DCFM assessments",
              },
              {
                label: "Avg elidi Score",
                value: "5.8",
                sub: "Organization average",
              },
              {
                label: "High Decision Force",
                value: "42%",
                sub: "Of all employees",
              },
              {
                label: "Cognitive Diversity Index",
                value: "8.4/10",
                sub: "Cross-team diversity",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-4 text-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(200,162,74,0.12), rgba(45,106,79,0.2))",
                  border: "1px solid rgba(200,162,74,0.25)",
                }}
              >
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: GOLD }}
                >
                  {stat.value}
                </div>
                <div className="text-white/80 text-xs font-semibold">
                  {stat.label}
                </div>
                <div className="text-white/35 text-xs mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Org-wide dimension bars */}
            <div>
              <h3 className="font-bold mb-4" style={{ color: GOLD }}>
                Organization-Wide Dimension Averages
              </h3>
              {[
                { dim: "Pattern Mapping (PM)", val: 5.9, color: "#C8A24A" },
                {
                  dim: "Emotional Modulation (EM)",
                  val: 4.8,
                  color: "#CD5C5C",
                },
                {
                  dim: "Rational Risk Mapping (RRM)",
                  val: 5.6,
                  color: "#4A90D9",
                },
                {
                  dim: "Identity & Autonomy Index (IAI)",
                  val: 6.0,
                  color: "#7B68EE",
                },
                {
                  dim: "Social Influence Susceptibility (SIS)",
                  val: 5.1,
                  color: "#50C878",
                },
                {
                  dim: "Execution Drive Index (EDI)",
                  val: 6.2,
                  color: "#2D9E5A",
                },
              ].map(({ dim, val, color }) => (
                <div key={dim} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">{dim}</span>
                    <span className="font-bold" style={{ color }}>
                      {val.toFixed(1)}
                    </span>
                  </div>
                  <div
                    className="h-3 rounded-full"
                    style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                  >
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{
                        width: `${(val / 9) * 100}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Archetype pie */}
            <div>
              <h3 className="font-bold mb-4" style={{ color: GOLD }}>
                NovaMind Archetype Distribution
              </h3>
              <div className="space-y-3">
                {[
                  { name: "Balanced Strategist", pct: 25, color: "#4A90D9" },
                  { name: "Decisive Executor", pct: 22, color: "#2D6A4F" },
                  { name: "Sovereign Navigator", pct: 18, color: GOLD },
                  { name: "Adaptive Harmonizer", pct: 16, color: "#7B68EE" },
                  { name: "Social Harmonizer", pct: 10, color: "#50C878" },
                  { name: "Reactive Empath", pct: 9, color: "#CD5C5C" },
                ].map(({ name, pct, color }) => (
                  <div key={name} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-0.5">
                        <span className="text-white/75">{name}</span>
                        <span className="font-bold" style={{ color }}>
                          {pct}%
                        </span>
                      </div>
                      <div
                        className="h-2 rounded-full"
                        style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
                      >
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="mt-5 p-4 rounded-xl"
                style={{
                  backgroundColor: "rgba(200,162,74,0.08)",
                  border: "1px solid rgba(200,162,74,0.2)",
                }}
              >
                <p className="text-sm text-white/60 italic">
                  "NovaMind&apos;s leadership layer is dominated by Balanced
                  Strategists and Decisive Executors — a cognitively resilient
                  combination for scaling decisions under uncertainty."
                </p>
                <p className="text-xs mt-2" style={{ color: GOLD }}>
                  — elidi Org Intelligence Report, NovaMind Corp
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Section 16: NovaMind — 20 Teams Cognitive Map */}
        <SectionCard number="16" title="NovaMind Corp — 20 Teams Cognitive Map">
          <p className="text-white/50 text-sm mb-6">
            How elidi maps team intelligence across every department. Managers
            can instantly see dominant decision archetypes, cognitive risk
            levels, and performance indicators for each team.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                id: 1,
                team: "Executive Leadership",
                dept: "C-Suite",
                size: 8,
                archetype: "Sovereign Navigator",
                dfl: "High",
                pm: 7.2,
                edi: 7.5,
                color: GOLD,
              },
              {
                id: 2,
                team: "Product Strategy",
                dept: "Product",
                size: 9,
                archetype: "Balanced Strategist",
                dfl: "High",
                pm: 6.8,
                edi: 6.5,
                color: "#4A90D9",
              },
              {
                id: 3,
                team: "Engineering Core",
                dept: "Technology",
                size: 12,
                archetype: "Decisive Executor",
                dfl: "High",
                pm: 6.5,
                edi: 6.8,
                color: "#2D6A4F",
              },
              {
                id: 4,
                team: "Data & Analytics",
                dept: "Technology",
                size: 7,
                archetype: "Sovereign Navigator",
                dfl: "High",
                pm: 7.0,
                edi: 6.9,
                color: GOLD,
              },
              {
                id: 5,
                team: "Customer Success",
                dept: "Operations",
                size: 10,
                archetype: "Adaptive Harmonizer",
                dfl: "Medium",
                pm: 5.8,
                edi: 5.5,
                color: "#7B68EE",
              },
              {
                id: 6,
                team: "Sales Frontline",
                dept: "Revenue",
                size: 11,
                archetype: "Decisive Executor",
                dfl: "High",
                pm: 6.2,
                edi: 7.0,
                color: "#2D6A4F",
              },
              {
                id: 7,
                team: "Marketing & Brand",
                dept: "Revenue",
                size: 8,
                archetype: "Social Harmonizer",
                dfl: "Medium",
                pm: 5.5,
                edi: 5.2,
                color: "#50C878",
              },
              {
                id: 8,
                team: "People & Culture",
                dept: "HR",
                size: 6,
                archetype: "Empathic Sentinel",
                dfl: "Medium",
                pm: 4.8,
                edi: 4.5,
                color: "#FF8C69",
              },
              {
                id: 9,
                team: "Finance & Risk",
                dept: "Finance",
                size: 7,
                archetype: "Balanced Strategist",
                dfl: "High",
                pm: 6.5,
                edi: 6.0,
                color: "#4A90D9",
              },
              {
                id: 10,
                team: "Legal & Compliance",
                dept: "Legal",
                size: 5,
                archetype: "Balanced Strategist",
                dfl: "Medium",
                pm: 6.0,
                edi: 5.5,
                color: "#4A90D9",
              },
              {
                id: 11,
                team: "Design & UX",
                dept: "Product",
                size: 8,
                archetype: "Adaptive Harmonizer",
                dfl: "Medium",
                pm: 5.5,
                edi: 5.0,
                color: "#7B68EE",
              },
              {
                id: 12,
                team: "Operations",
                dept: "Operations",
                size: 9,
                archetype: "Decisive Executor",
                dfl: "High",
                pm: 6.0,
                edi: 6.8,
                color: "#2D6A4F",
              },
              {
                id: 13,
                team: "Partnerships",
                dept: "Revenue",
                size: 6,
                archetype: "Social Harmonizer",
                dfl: "Medium",
                pm: 5.8,
                edi: 5.3,
                color: "#50C878",
              },
              {
                id: 14,
                team: "Research & Innovation",
                dept: "Technology",
                size: 7,
                archetype: "Sovereign Navigator",
                dfl: "High",
                pm: 7.5,
                edi: 7.0,
                color: GOLD,
              },
              {
                id: 15,
                team: "Security",
                dept: "Technology",
                size: 5,
                archetype: "Sovereign Navigator",
                dfl: "High",
                pm: 7.0,
                edi: 7.2,
                color: GOLD,
              },
              {
                id: 16,
                team: "DevOps & Infrastructure",
                dept: "Technology",
                size: 6,
                archetype: "Decisive Executor",
                dfl: "High",
                pm: 6.3,
                edi: 7.1,
                color: "#2D6A4F",
              },
              {
                id: 17,
                team: "Business Intelligence",
                dept: "Analytics",
                size: 7,
                archetype: "Balanced Strategist",
                dfl: "High",
                pm: 6.8,
                edi: 6.4,
                color: "#4A90D9",
              },
              {
                id: 18,
                team: "Learning & Development",
                dept: "HR",
                size: 5,
                archetype: "Adaptive Harmonizer",
                dfl: "Medium",
                pm: 5.2,
                edi: 4.8,
                color: "#7B68EE",
              },
              {
                id: 19,
                team: "Customer Experience",
                dept: "Operations",
                size: 8,
                archetype: "Social Harmonizer",
                dfl: "Medium",
                pm: 5.0,
                edi: 5.0,
                color: "#50C878",
              },
              {
                id: 20,
                team: "Executive Assistants",
                dept: "C-Suite Support",
                size: 4,
                archetype: "Empathic Sentinel",
                dfl: "Low",
                pm: 4.5,
                edi: 3.8,
                color: "#FF8C69",
              },
            ].map((team) => (
              <div
                key={team.id}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: `1px solid ${team.color}30`,
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-bold text-sm text-white leading-tight">
                      {team.team}
                    </div>
                    <div className="text-white/35 text-xs mt-0.5">
                      {team.dept}
                    </div>
                  </div>
                  <div
                    className="text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0 ml-1"
                    style={{
                      backgroundColor:
                        team.dfl === "High"
                          ? "rgba(80,200,120,0.15)"
                          : team.dfl === "Medium"
                            ? "rgba(200,162,74,0.15)"
                            : "rgba(205,92,92,0.15)",
                      color:
                        team.dfl === "High"
                          ? "#50C878"
                          : team.dfl === "Medium"
                            ? GOLD
                            : "#CD5C5C",
                    }}
                  >
                    {team.dfl}
                  </div>
                </div>
                <div
                  className="text-xs px-2 py-1 rounded-full font-semibold mb-3 inline-block"
                  style={{
                    backgroundColor: `${team.color}20`,
                    color: team.color,
                    border: `1px solid ${team.color}40`,
                  }}
                >
                  {team.archetype}
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
                  <span>👥 {team.size} members</span>
                </div>
                <div className="space-y-1.5">
                  <div>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-white/40">PM</span>
                      <span style={{ color: GOLD }}>{team.pm}</span>
                    </div>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                    >
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${(team.pm / 9) * 100}%`,
                          backgroundColor: GOLD,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-white/40">EDI</span>
                      <span style={{ color: "#50C878" }}>{team.edi}</span>
                    </div>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                    >
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${(team.edi / 9) * 100}%`,
                          backgroundColor: "#50C878",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Section 17: Engineering Core — Individual Mind Twin View */}
        <SectionCard
          number="17"
          title="Team Deep Dive — Engineering Core (Individual Mind Twin Profiles)"
        >
          <p className="text-white/50 text-sm mb-6">
            Each team member&apos;s Mind Twin profile reveals their cognitive
            architecture at the individual level. Managers see not just skills
            and experience — but the decision-making DNA of every person on
            their team.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[
              {
                name: "Vikram Rajan",
                role: "Lead Architect",
                archetype: "Sovereign Navigator",
                twin: "Future Me",
                days: 84,
                pm: 7.2,
                em: 2.8,
                rrm: 6.9,
                iai: 7.5,
                sis: 2.5,
                edi: 7.2,
              },
              {
                name: "Preethi Nair",
                role: "Backend Engineer",
                archetype: "Decisive Executor",
                twin: "Bold Me",
                days: 62,
                pm: 6.5,
                em: 3.8,
                rrm: 6.0,
                iai: 6.2,
                sis: 4.0,
                edi: 6.9,
              },
              {
                name: "Akash Gupta",
                role: "Full Stack Developer",
                archetype: "Balanced Strategist",
                twin: "Current Me",
                days: 45,
                pm: 6.0,
                em: 4.5,
                rrm: 5.8,
                iai: 6.0,
                sis: 4.5,
                edi: 6.0,
              },
              {
                name: "Shreya Mehta",
                role: "Frontend Lead",
                archetype: "Adaptive Harmonizer",
                twin: "Calm Me",
                days: 71,
                pm: 5.5,
                em: 5.8,
                rrm: 5.0,
                iai: 5.5,
                sis: 5.8,
                edi: 5.2,
              },
              {
                name: "Rohan Das",
                role: "DevOps Engineer",
                archetype: "Decisive Executor",
                twin: "Future Me",
                days: 38,
                pm: 6.2,
                em: 4.0,
                rrm: 5.8,
                iai: 6.0,
                sis: 4.2,
                edi: 7.0,
              },
              {
                name: "Nandini Pillai",
                role: "API Architect",
                archetype: "Sovereign Navigator",
                twin: "Future Me",
                days: 92,
                pm: 7.0,
                em: 2.5,
                rrm: 7.2,
                iai: 7.8,
                sis: 2.2,
                edi: 7.5,
              },
              {
                name: "Aryan Singh",
                role: "ML Engineer",
                archetype: "Balanced Strategist",
                twin: "Analytical Me",
                days: 57,
                pm: 6.5,
                em: 3.5,
                rrm: 6.5,
                iai: 6.8,
                sis: 3.5,
                edi: 6.5,
              },
              {
                name: "Kavitha Rao",
                role: "Security Engineer",
                archetype: "Sovereign Navigator",
                twin: "Vigilant Me",
                days: 103,
                pm: 7.5,
                em: 2.0,
                rrm: 7.5,
                iai: 8.0,
                sis: 2.0,
                edi: 7.0,
              },
              {
                name: "Deepak Anand",
                role: "Cloud Architect",
                archetype: "Decisive Executor",
                twin: "Bold Me",
                days: 66,
                pm: 6.0,
                em: 4.2,
                rrm: 5.5,
                iai: 6.2,
                sis: 4.0,
                edi: 6.8,
              },
              {
                name: "Meera Krishnan",
                role: "Data Engineer",
                archetype: "Balanced Strategist",
                twin: "Current Me",
                days: 29,
                pm: 5.8,
                em: 4.8,
                rrm: 5.5,
                iai: 5.8,
                sis: 4.5,
                edi: 5.8,
              },
              {
                name: "Suresh Babu",
                role: "QA Lead",
                archetype: "Adaptive Harmonizer",
                twin: "Calm Me",
                days: 41,
                pm: 5.2,
                em: 5.5,
                rrm: 4.8,
                iai: 5.0,
                sis: 5.5,
                edi: 4.8,
              },
              {
                name: "Pooja Sharma",
                role: "Product Engineer",
                archetype: "Social Harmonizer",
                twin: "Collaborative Me",
                days: 53,
                pm: 5.0,
                em: 6.0,
                rrm: 4.5,
                iai: 5.2,
                sis: 6.5,
                edi: 5.0,
              },
            ].map((person) => {
              const dims = [
                { key: "PM", val: person.pm, color: GOLD },
                { key: "EM", val: person.em, color: "#CD5C5C" },
                { key: "RRM", val: person.rrm, color: "#4A90D9" },
                { key: "IAI", val: person.iai, color: "#7B68EE" },
                { key: "SIS", val: person.sis, color: "#50C878" },
                { key: "EDI", val: person.edi, color: "#2D9E5A" },
              ];
              const archetypeColor = ARCHETYPE_COLORS[person.archetype] || GOLD;
              return (
                <div
                  key={person.name}
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: `1px solid ${archetypeColor}25`,
                  }}
                >
                  <div className="mb-3">
                    <div className="font-bold text-sm text-white">
                      {person.name}
                    </div>
                    <div className="text-white/40 text-xs">{person.role}</div>
                  </div>
                  <div
                    className="text-xs px-2 py-0.5 rounded-full font-semibold mb-2 inline-block"
                    style={{
                      backgroundColor: `${archetypeColor}20`,
                      color: archetypeColor,
                      border: `1px solid ${archetypeColor}40`,
                    }}
                  >
                    {person.archetype}
                  </div>
                  <div className="space-y-1.5 mb-3">
                    {dims.map(({ key, val, color }) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-white/35 text-xs w-7 flex-shrink-0">
                          {key}
                        </span>
                        <div
                          className="flex-1 h-2 rounded-full"
                          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                        >
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${(val / 9) * 100}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                        <span
                          className="text-xs font-bold w-8 text-right"
                          style={{ color }}
                        >
                          {val.toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div
                    className="flex items-center justify-between text-xs text-white/35 pt-2"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <span>🧠 {person.twin}</span>
                    <span>{person.days}d active</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="mt-6 p-5 rounded-xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(45,106,79,0.3), rgba(200,162,74,0.1))",
              border: "1px solid rgba(200,162,74,0.2)",
            }}
          >
            <p className="text-white/70 text-sm leading-relaxed">
              <strong style={{ color: GOLD }}>Manager Insight:</strong>{" "}
              Engineering Core shows a bimodal split — 4 Sovereign Navigators
              with very high PM and IAI (ideal for architecture and independent
              technical decisions) and 3 Decisive Executors with strong EDI
              (optimal for delivery and shipping velocity). The 2 Adaptive
              Harmonizers in the team serve as cognitive bridges when the team
              debates build-vs-buy decisions.
            </p>
          </div>
        </SectionCard>

        {/* Section 18: Management Intelligence Dashboard */}
        <SectionCard
          number="18"
          title="Management Intelligence Dashboard — How Leaders Use elidi"
        >
          <p className="text-white/50 text-sm mb-6">
            elidi gives managers a fundamentally new lens — not just headcount
            and performance scores, but the cognitive field dynamics of their
            entire team. This is decision science applied to organizational
            leadership.
          </p>

          {/* Subsection A: Team Cognitive Comparison */}
          <div className="mb-8">
            <h3 className="font-bold text-base mb-4" style={{ color: GOLD }}>
              A — Team Cognitive Profile Comparison
            </h3>
            <p className="text-white/40 text-xs mb-4">
              PM and EDI averages across 4 key teams — the two dimensions that
              most predict decision quality and execution speed
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  team: "Engineering",
                  pm: 6.5,
                  edi: 6.8,
                  em: 3.8,
                  iai: 6.9,
                  color: "#2D6A4F",
                },
                {
                  team: "Sales",
                  pm: 6.2,
                  edi: 7.0,
                  em: 5.8,
                  iai: 5.5,
                  color: GOLD,
                },
                {
                  team: "Marketing",
                  pm: 5.5,
                  edi: 5.2,
                  em: 5.5,
                  iai: 5.0,
                  color: "#7B68EE",
                },
                {
                  team: "People & Culture",
                  pm: 4.8,
                  edi: 4.5,
                  em: 6.2,
                  iai: 4.8,
                  color: "#FF8C69",
                },
              ].map(({ team, pm, edi, em, iai, color }) => (
                <div
                  key={team}
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: `1px solid ${color}35`,
                  }}
                >
                  <div className="font-bold text-sm mb-3" style={{ color }}>
                    {team}
                  </div>
                  {[
                    { label: "Pattern Mapping (PM)", val: pm, color: GOLD },
                    {
                      label: "Execution Drive (EDI)",
                      val: edi,
                      color: "#50C878",
                    },
                    {
                      label: "Emotional Modulation (EM)",
                      val: em,
                      color: "#CD5C5C",
                    },
                    {
                      label: "Identity Index (IAI)",
                      val: iai,
                      color: "#7B68EE",
                    },
                  ].map(({ label, val, color: c }) => (
                    <div key={label} className="mb-2">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-white/40">{label}</span>
                        <span style={{ color: c }}>{val.toFixed(1)}</span>
                      </div>
                      <div
                        className="h-1.5 rounded-full"
                        style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                      >
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${(val / 9) * 100}%`,
                            backgroundColor: c,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Subsection B: Decision Risk Heatmap */}
          <div className="mb-8">
            <h3 className="font-bold text-base mb-4" style={{ color: GOLD }}>
              B — Decision Risk Heatmap by Department
            </h3>
            <p className="text-white/40 text-xs mb-4">
              Green = cognitively optimal. Red = high decision risk. Based on EM
              elevation and EDI suppression patterns detected by DCFM.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[600px]">
                <thead>
                  <tr>
                    <th className="text-left py-2 pr-4 text-white/50 font-medium">
                      Department
                    </th>
                    {["PM", "EM", "RRM", "IAI", "SIS", "EDI"].map((d) => (
                      <th
                        key={d}
                        className="py-2 px-3 text-center font-bold"
                        style={{ color: GOLD }}
                      >
                        {d}
                      </th>
                    ))}
                    <th className="py-2 px-3 text-center text-white/50">
                      Risk Level
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      dept: "Engineering",
                      vals: [6.5, 3.8, 6.8, 6.9, 3.2, 6.8],
                      risk: "Low",
                    },
                    {
                      dept: "Sales",
                      vals: [6.2, 5.8, 5.5, 5.5, 5.2, 7.0],
                      risk: "Medium",
                    },
                    {
                      dept: "Marketing",
                      vals: [5.5, 5.5, 5.0, 5.0, 5.8, 5.2],
                      risk: "Medium",
                    },
                    {
                      dept: "Finance",
                      vals: [6.5, 3.5, 6.5, 6.5, 4.0, 6.0],
                      risk: "Low",
                    },
                    {
                      dept: "People & Culture",
                      vals: [4.8, 6.2, 4.2, 4.8, 6.8, 4.5],
                      risk: "High",
                    },
                  ].map(({ dept, vals, risk }) => (
                    <tr
                      key={dept}
                      style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                    >
                      <td className="py-2 pr-4 text-white/60 font-medium">
                        {dept}
                      </td>
                      {vals.map((v, i) => {
                        const dimKey =
                          ["PM", "EM", "RRM", "IAI", "SIS", "EDI"][i] ||
                          String(i);
                        const isRisk =
                          (i === 1 && v > 5.5) || (i === 5 && v < 5.0);
                        const isOptimal =
                          (i === 0 && v > 6) || (i === 5 && v > 6.5);
                        const bg = isRisk
                          ? "rgba(205,92,92,0.25)"
                          : isOptimal
                            ? "rgba(80,200,120,0.2)"
                            : "rgba(200,162,74,0.12)";
                        const textColor = isRisk
                          ? "#CD5C5C"
                          : isOptimal
                            ? "#50C878"
                            : "rgba(255,255,255,0.6)";
                        return (
                          <td
                            key={dimKey}
                            className="py-2 px-3 text-center font-bold rounded"
                            style={{ color: textColor, backgroundColor: bg }}
                          >
                            {v.toFixed(1)}
                          </td>
                        );
                      })}
                      <td className="py-2 px-3 text-center">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-bold"
                          style={{
                            backgroundColor:
                              risk === "Low"
                                ? "rgba(80,200,120,0.15)"
                                : risk === "Medium"
                                  ? "rgba(200,162,74,0.15)"
                                  : "rgba(205,92,92,0.15)",
                            color:
                              risk === "Low"
                                ? "#50C878"
                                : risk === "Medium"
                                  ? GOLD
                                  : "#CD5C5C",
                          }}
                        >
                          {risk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subsection C: Cognitive Blind Spot Alerts */}
          <div className="mb-8">
            <h3 className="font-bold text-base mb-4" style={{ color: GOLD }}>
              C — Cognitive Blind Spot Alerts
            </h3>
            <p className="text-white/40 text-xs mb-4">
              elidi automatically surfaces pattern-based insights that
              traditional HR tools completely miss
            </p>
            <div className="space-y-3">
              <div
                className="rounded-xl p-4 flex gap-4"
                style={{
                  backgroundColor: "rgba(200,162,74,0.08)",
                  border: "1px solid rgba(200,162,74,0.3)",
                }}
              >
                <div className="text-2xl flex-shrink-0">⚠️</div>
                <div>
                  <div
                    className="font-bold text-sm mb-1"
                    style={{ color: GOLD }}
                  >
                    Emotional Reactivity Risk — Sales Frontline
                  </div>
                  <p className="text-white/65 text-sm">
                    Sales Frontline has an average Emotional Modulation (EM) of
                    6.2. DCFM analysis flags that high-EM sellers under
                    deal-closing pressure tend to make concession decisions 2.3x
                    faster than Balanced Strategist profiles — often leaving
                    value on the table. Recommend coaching on EM regulation
                    before Q4 negotiations.
                  </p>
                </div>
              </div>
              <div
                className="rounded-xl p-4 flex gap-4"
                style={{
                  backgroundColor: "rgba(205,92,92,0.08)",
                  border: "1px solid rgba(205,92,92,0.3)",
                }}
              >
                <div className="text-2xl flex-shrink-0">🚨</div>
                <div>
                  <div
                    className="font-bold text-sm mb-1"
                    style={{ color: "#CD5C5C" }}
                  >
                    Groupthink Risk — People & Culture
                  </div>
                  <p className="text-white/65 text-sm">
                    3 members in People & Culture show Social Influence
                    Susceptibility (SIS) above 7.0. DCFM manifold analysis
                    identifies a convergent attractor state in group hiring
                    decisions — meaning the team is likely making
                    consensus-based choices rather than independent evaluations.
                    This creates systemic bias in talent acquisition. Recommend
                    structured independent review before group discussions.
                  </p>
                </div>
              </div>
              <div
                className="rounded-xl p-4 flex gap-4"
                style={{
                  backgroundColor: "rgba(80,200,120,0.08)",
                  border: "1px solid rgba(80,200,120,0.3)",
                }}
              >
                <div className="text-2xl flex-shrink-0">✅</div>
                <div>
                  <div
                    className="font-bold text-sm mb-1"
                    style={{ color: "#50C878" }}
                  >
                    Autonomous Reasoning Strength — Engineering Core
                  </div>
                  <p className="text-white/65 text-sm">
                    Engineering Core&apos;s Identity and Autonomy Index (IAI)
                    average of 6.8 indicates strong independent reasoning
                    capability. elidi DCFM analysis shows this team&apos;s
                    decision manifold is stable even under social pressure —
                    meaning they can own complex technical decisions without
                    requiring constant leadership approval. This team is rated
                    suitable for autonomous architecture decision-making on
                    Tier-1 systems.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Subsection D: Decision Velocity Chart */}
          <div>
            <h3 className="font-bold text-base mb-4" style={{ color: GOLD }}>
              D — Team Decision Velocity (Decisions Logged Per Month)
            </h3>
            <p className="text-white/40 text-xs mb-4">
              Teams actively using elidi to log, simulate, and track decisions
              over 6 months. Higher velocity indicates deeper cognitive
              engagement with the platform.
            </p>
            <div className="space-y-4">
              {[
                {
                  team: "Engineering Core",
                  months: [12, 18, 24, 28, 31, 36],
                  color: "#2D6A4F",
                },
                {
                  team: "Sales Frontline",
                  months: [8, 15, 22, 27, 33, 40],
                  color: GOLD,
                },
                {
                  team: "Customer Success",
                  months: [5, 9, 14, 18, 22, 25],
                  color: "#7B68EE",
                },
              ].map(({ team, months, color }) => {
                const max = 45;
                return (
                  <div key={team}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold" style={{ color }}>
                        {team}
                      </span>
                      <span className="text-white/40">
                        {months[months.length - 1]} decisions/month
                      </span>
                    </div>
                    <div className="flex gap-1 items-end h-12">
                      {months.map((val, idx) => (
                        <div
                          key={`bar-${val}`}
                          className="flex-1 rounded-t-sm"
                          style={{
                            height: `${(val / max) * 100}%`,
                            backgroundColor: color,
                            opacity: 0.5 + (idx / months.length) * 0.5,
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-white/25 mt-1">
                      {[
                        "Month 1",
                        "Month 2",
                        "Month 3",
                        "Month 4",
                        "Month 5",
                        "Month 6",
                      ].map((m) => (
                        <span key={m}>{m}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </SectionCard>

        {/* Section 19: Brain & Mind Infographic — DCFM Neural Mapping */}
        <SectionCard
          number="19"
          title="Brain and Mind Infographic — DCFM Neural Architecture Mapping"
        >
          <p className="text-white/50 text-sm mb-6">
            For the first time, decision architecture is mapped directly to
            cognitive field dynamics — not personality types, but live manifold
            trajectories through the human decision brain.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Brain SVG */}
            <div className="flex flex-col items-center">
              <h3
                className="font-bold mb-4 text-center"
                style={{ color: GOLD }}
              >
                DCFM Neural Field Activation Map
              </h3>
              <div
                style={{ position: "relative", width: "100%", maxWidth: 380 }}
              >
                <svg
                  viewBox="0 0 380 320"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="DCFM Neural Field Activation Map"
                  style={{ width: "100%", height: "auto" }}
                >
                  <defs>
                    <style>{`
                      @keyframes pulse-gold { 0%,100%{r:10;opacity:1} 50%{r:14;opacity:0.6} }
                      @keyframes pulse-red { 0%,100%{r:10;opacity:1} 50%{r:14;opacity:0.6} }
                      @keyframes pulse-blue { 0%,100%{r:9;opacity:1} 50%{r:13;opacity:0.6} }
                      @keyframes pulse-purple { 0%,100%{r:9;opacity:1} 50%{r:13;opacity:0.6} }
                      @keyframes pulse-teal { 0%,100%{r:9;opacity:1} 50%{r:13;opacity:0.6} }
                      @keyframes pulse-green { 0%,100%{r:10;opacity:1} 50%{r:14;opacity:0.6} }
                      .node-gold circle { animation: pulse-gold 2.5s ease-in-out infinite; }
                      .node-red circle { animation: pulse-red 2.8s ease-in-out infinite 0.4s; }
                      .node-blue circle { animation: pulse-blue 3.1s ease-in-out infinite 0.8s; }
                      .node-purple circle { animation: pulse-purple 2.3s ease-in-out infinite 0.2s; }
                      .node-teal circle { animation: pulse-teal 2.7s ease-in-out infinite 0.6s; }
                      .node-green circle { animation: pulse-green 2.4s ease-in-out infinite 1.0s; }
                    `}</style>
                  </defs>
                  {/* Brain outline */}
                  <ellipse
                    cx="190"
                    cy="155"
                    rx="130"
                    ry="110"
                    fill="rgba(45,106,79,0.15)"
                    stroke="rgba(200,162,74,0.3)"
                    strokeWidth="1.5"
                  />
                  <ellipse
                    cx="190"
                    cy="155"
                    rx="100"
                    ry="85"
                    fill="none"
                    stroke="rgba(200,162,74,0.1)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  {/* Brain fold lines */}
                  <path
                    d="M 100 120 Q 150 100 190 115 Q 230 130 270 120"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 90 155 Q 140 145 190 155 Q 240 165 290 155"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 100 185 Q 150 175 190 185 Q 230 195 270 185"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="1.5"
                  />
                  {/* Hemisphere divider */}
                  <line
                    x1="190"
                    y1="50"
                    x2="190"
                    y2="255"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  {/* Connection lines between nodes */}
                  <line
                    x1="190"
                    y1="75"
                    x2="160"
                    y2="130"
                    stroke="rgba(200,162,74,0.15)"
                    strokeWidth="1"
                  />
                  <line
                    x1="190"
                    y1="75"
                    x2="220"
                    y2="125"
                    stroke="rgba(200,162,74,0.15)"
                    strokeWidth="1"
                  />
                  <line
                    x1="160"
                    y1="130"
                    x2="190"
                    y2="160"
                    stroke="rgba(205,92,92,0.15)"
                    strokeWidth="1"
                  />
                  <line
                    x1="220"
                    y1="125"
                    x2="190"
                    y2="160"
                    stroke="rgba(74,144,217,0.15)"
                    strokeWidth="1"
                  />
                  <line
                    x1="190"
                    y1="160"
                    x2="155"
                    y2="195"
                    stroke="rgba(80,200,120,0.15)"
                    strokeWidth="1"
                  />
                  <line
                    x1="190"
                    y1="160"
                    x2="190"
                    y2="220"
                    stroke="rgba(45,158,90,0.2)"
                    strokeWidth="1"
                  />
                  {/* PM Node — Prefrontal / top center */}
                  <g className="node-gold">
                    <circle cx="190" cy="75" r="10" fill={GOLD} opacity="0.9" />
                    <text
                      x="190"
                      y="79"
                      textAnchor="middle"
                      fill="#1B4332"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      PM
                    </text>
                  </g>
                  {/* EM Node — Limbic / center */}
                  <g className="node-red">
                    <circle
                      cx="190"
                      cy="160"
                      r="10"
                      fill="#CD5C5C"
                      opacity="0.9"
                    />
                    <text
                      x="190"
                      y="164"
                      textAnchor="middle"
                      fill="white"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      EM
                    </text>
                  </g>
                  {/* RRM Node — Rational / upper left */}
                  <g className="node-blue">
                    <circle
                      cx="140"
                      cy="120"
                      r="9"
                      fill="#4A90D9"
                      opacity="0.9"
                    />
                    <text
                      x="140"
                      y="124"
                      textAnchor="middle"
                      fill="white"
                      fontSize="8"
                      fontWeight="bold"
                    >
                      RRM
                    </text>
                  </g>
                  {/* IAI Node — Identity / right */}
                  <g className="node-purple">
                    <circle
                      cx="245"
                      cy="130"
                      r="9"
                      fill="#7B68EE"
                      opacity="0.9"
                    />
                    <text
                      x="245"
                      y="134"
                      textAnchor="middle"
                      fill="white"
                      fontSize="8"
                      fontWeight="bold"
                    >
                      IAI
                    </text>
                  </g>
                  {/* SIS Node — Social / lower left */}
                  <g className="node-teal">
                    <circle
                      cx="148"
                      cy="195"
                      r="9"
                      fill="#50C878"
                      opacity="0.9"
                    />
                    <text
                      x="148"
                      y="199"
                      textAnchor="middle"
                      fill="#1B4332"
                      fontSize="8"
                      fontWeight="bold"
                    >
                      SIS
                    </text>
                  </g>
                  {/* EDI Node — Execution / bottom center */}
                  <g className="node-green">
                    <circle
                      cx="190"
                      cy="230"
                      r="10"
                      fill="#2D9E5A"
                      opacity="0.9"
                    />
                    <text
                      x="190"
                      y="234"
                      textAnchor="middle"
                      fill="white"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      EDI
                    </text>
                  </g>
                  {/* Labels outside */}
                  <text
                    x="190"
                    y="42"
                    textAnchor="middle"
                    fill={GOLD}
                    fontSize="9"
                  >
                    Pattern Mapping
                  </text>
                  <text
                    x="190"
                    y="52"
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.3)"
                    fontSize="8"
                  >
                    Prefrontal Region
                  </text>
                  <text
                    x="75"
                    y="108"
                    textAnchor="middle"
                    fill="#4A90D9"
                    fontSize="9"
                  >
                    Rational Risk
                  </text>
                  <text
                    x="75"
                    y="118"
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.3)"
                    fontSize="8"
                  >
                    Lateral Prefrontal
                  </text>
                  <text
                    x="295"
                    y="115"
                    textAnchor="middle"
                    fill="#7B68EE"
                    fontSize="9"
                  >
                    Identity Index
                  </text>
                  <text
                    x="295"
                    y="125"
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.3)"
                    fontSize="8"
                  >
                    Medial PFC
                  </text>
                  <text
                    x="80"
                    y="200"
                    textAnchor="middle"
                    fill="#50C878"
                    fontSize="9"
                  >
                    Social Processing
                  </text>
                  <text
                    x="80"
                    y="210"
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.3)"
                    fontSize="8"
                  >
                    TPJ Region
                  </text>
                  <text
                    x="190"
                    y="268"
                    textAnchor="middle"
                    fill="#2D9E5A"
                    fontSize="9"
                  >
                    Execution Drive
                  </text>
                  <text
                    x="190"
                    y="278"
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.3)"
                    fontSize="8"
                  >
                    Premotor Cortex
                  </text>
                  <text
                    x="295"
                    y="165"
                    textAnchor="middle"
                    fill="#CD5C5C"
                    fontSize="9"
                  >
                    Emotional Center
                  </text>
                  <text
                    x="295"
                    y="175"
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.3)"
                    fontSize="8"
                  >
                    Limbic System
                  </text>
                </svg>
              </div>
            </div>

            {/* DCFM explanation + before/after cards */}
            <div>
              <div
                className="p-4 rounded-xl mb-5"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(200,162,74,0.12), rgba(45,106,79,0.2))",
                  border: "1px solid rgba(200,162,74,0.3)",
                }}
              >
                <p className="text-white/75 text-sm leading-relaxed italic">
                  "DCFM treats each decision not as a binary choice but as a
                  trajectory through a high-dimensional cognitive manifold —
                  with attractor basins, cyclic emotional loops, and execution
                  field vectors. It is the closest computational model to how
                  the brain actually decides."
                </p>
                <p className="text-xs mt-2" style={{ color: GOLD }}>
                  — Sathish Sampath, Inventor of DCFM, MESMA
                </p>
              </div>

              <h3 className="font-bold mb-3 text-sm" style={{ color: GOLD }}>
                DCFM-Guided Intervention Results
              </h3>
              <div className="space-y-3">
                {[
                  {
                    title: "High EM + Low EDI — Emotional Paralysis Pattern",
                    before:
                      "Subject was experiencing repeated decision avoidance under social pressure",
                    after:
                      "DCFM coaching: pause-reframe-re-decide protocol. EDI improved 1.8 points in 30 days. Now closes decisions 40% faster.",
                    color: "#CD5C5C",
                  },
                  {
                    title: "Low IAI + High SIS — Groupthink Susceptibility",
                    before:
                      "12-person team showed convergent attractor patterns — all members gravitating to the same option when discussing together",
                    after:
                      "DCFM identified SIS elevation in 3 key influencers. Structured independent review protocol introduced. 3 members developed autonomous reasoning tracks within 6 weeks.",
                    color: "#7B68EE",
                  },
                  {
                    title: "High PM + High RRM — Strategic Decision Leadership",
                    before:
                      "Profile identified as top-tier strategic decision maker via DCFM manifold mapping",
                    after:
                      "Assigned M&A decision leadership role. Led $4.2M acquisition analysis — identified 3 strategic blind spots the traditional team missed. Deal closed at 18% better valuation.",
                    color: GOLD,
                  },
                ].map(({ title, before, after, color }) => (
                  <div
                    key={title}
                    className="rounded-xl p-4"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.04)",
                      border: `1px solid ${color}25`,
                    }}
                  >
                    <div
                      className="font-semibold text-sm mb-2"
                      style={{ color }}
                    >
                      {title}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div
                        className="p-2 rounded-lg"
                        style={{
                          backgroundColor: "rgba(205,92,92,0.08)",
                          border: "1px solid rgba(205,92,92,0.15)",
                        }}
                      >
                        <div className="text-white/40 font-semibold mb-1">
                          Before DCFM
                        </div>
                        <p className="text-white/60">{before}</p>
                      </div>
                      <div
                        className="p-2 rounded-lg"
                        style={{
                          backgroundColor: "rgba(80,200,120,0.08)",
                          border: "1px solid rgba(80,200,120,0.15)",
                        }}
                      >
                        <div className="text-green-400 font-semibold mb-1">
                          After DCFM
                        </div>
                        <p className="text-white/70">{after}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Section 20: Cognitive Diversity Index */}
        <SectionCard
          number="20"
          title="Cognitive Diversity Index — Why Team Composition Determines Decision Quality"
        >
          <p className="text-white/50 text-sm mb-6">
            Traditional team building focuses on skills and experience. elidi
            reveals the hidden layer — cognitive architecture diversity. Teams
            with high Cognitive Diversity Index (CDI) consistently outperform
            homogeneous teams on complex decisions.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Homogeneous team */}
            <div
              className="rounded-xl p-5"
              style={{
                backgroundColor: "rgba(205,92,92,0.06)",
                border: "1px solid rgba(205,92,92,0.25)",
              }}
            >
              <h3 className="font-bold mb-2" style={{ color: "#CD5C5C" }}>
                Cognitively Homogeneous Team
              </h3>
              <p className="text-white/40 text-xs mb-4">
                All Decisive Executors — CDI Score: 2.8/10
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["DE1", "DE2", "DE3", "DE4", "DE5", "DE6", "DE7", "DE8"].map(
                  (uid) => (
                    <div
                      key={uid}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: "#2D6A4F",
                        border: "2px solid #2D6A4F40",
                        color: "white",
                      }}
                    >
                      DE
                    </div>
                  ),
                )}
              </div>
              <div className="space-y-2 text-sm">
                {[
                  "Echo chamber — no one questions the plan",
                  "Blind to emotional signals in stakeholders",
                  "Overconfident under ambiguity",
                  "Poor customer empathy in product decisions",
                  "Groupthink risk during crisis decisions",
                ].map((risk) => (
                  <div
                    key={risk}
                    className="flex items-start gap-2 text-white/55"
                  >
                    <span className="text-red-400 flex-shrink-0 mt-0.5">✕</span>
                    {risk}
                  </div>
                ))}
              </div>
            </div>

            {/* Diverse team */}
            <div
              className="rounded-xl p-5"
              style={{
                backgroundColor: "rgba(80,200,120,0.06)",
                border: "1px solid rgba(80,200,120,0.25)",
              }}
            >
              <h3 className="font-bold mb-2" style={{ color: "#50C878" }}>
                Cognitively Diverse Team
              </h3>
              <p className="text-white/40 text-xs mb-4">
                Mixed archetypes — CDI Score: 9.1/10
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { label: "SN", color: GOLD, uid: "sn1" },
                  { label: "DE", color: "#2D6A4F", uid: "de1" },
                  { label: "BS", color: "#4A90D9", uid: "bs1" },
                  { label: "AH", color: "#7B68EE", uid: "ah1" },
                  { label: "SH", color: "#50C878", uid: "sh1" },
                  { label: "ES", color: "#FF8C69", uid: "es1" },
                  { label: "SN", color: GOLD, uid: "sn2" },
                  { label: "DE", color: "#2D6A4F", uid: "de2" },
                ].map(({ label, color, uid }) => (
                  <div
                    key={uid}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: `${color}25`,
                      border: `2px solid ${color}60`,
                      color,
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm">
                {[
                  "Balanced risk assessment from multiple cognitive lenses",
                  "Creative problem solving through cognitive dissonance",
                  "Resilient decision making under uncertainty",
                  "Natural cognitive checks and balances built in",
                  "Higher innovation output — 2.4x more breakthrough ideas",
                ].map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-2 text-white/70"
                  >
                    <span className="text-green-400 flex-shrink-0 mt-0.5">
                      ✓
                    </span>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CDI vs Decision Quality chart */}
          <div>
            <h3 className="font-bold mb-4 text-sm" style={{ color: GOLD }}>
              Decision Quality Score by Cognitive Diversity Index
            </h3>
            <div className="space-y-3">
              {[
                {
                  range: "CDI 1–2 (Homogeneous)",
                  score: 38,
                  color: "#CD5C5C",
                  label: "Critical Risk",
                },
                {
                  range: "CDI 3–4",
                  score: 52,
                  color: "#CD5C5C",
                  label: "High Risk",
                },
                {
                  range: "CDI 5–6",
                  score: 68,
                  color: GOLD,
                  label: "Functional",
                },
                {
                  range: "CDI 7–8",
                  score: 79,
                  color: "#50C878",
                  label: "Strong",
                },
                {
                  range: "CDI 9–10 (Optimal)",
                  score: 89,
                  color: "#2D9E5A",
                  label: "Exceptional",
                },
              ].map(({ range, score, color, label }) => (
                <div key={range} className="flex items-center gap-4">
                  <div className="w-40 text-sm text-white/60 flex-shrink-0">
                    {range}
                  </div>
                  <div
                    className="flex-1 h-6 rounded-full relative"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                  >
                    <div
                      className="h-6 rounded-full flex items-center justify-end pr-3 text-xs font-bold"
                      style={{
                        width: `${score}%`,
                        backgroundColor: color,
                        color: "#1B4332",
                      }}
                    >
                      {score}/100
                    </div>
                  </div>
                  <span
                    className="text-xs font-semibold w-20 flex-shrink-0"
                    style={{ color }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-white/35 text-xs mt-4 italic">
              Decision Quality Score measured across 847 NovaMind Corp decisions
              over 12 months, validated against actual business outcome data.
            </p>
          </div>
        </SectionCard>

        {/* Section 21: DCFM vs Traditional Assessments */}
        <SectionCard
          number="21"
          title="DCFM vs Traditional Assessments — Deep Science Comparison"
        >
          <p className="text-white/50 text-sm mb-6">
            elidi DCFM is not a personality test. It is a live cognitive field
            model — the difference between a static photograph and a live
            neurological MRI of how decisions emerge.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr>
                  <th className="text-left py-3 pr-4 text-white/50 font-medium">
                    Feature
                  </th>
                  <th className="py-3 px-4 text-center font-bold text-white/50">
                    Myers-Briggs
                  </th>
                  <th className="py-3 px-4 text-center font-bold text-white/50">
                    DISC
                  </th>
                  <th className="py-3 px-4 text-center font-bold text-white/50">
                    Big Five
                  </th>
                  <th
                    className="py-3 px-4 text-center font-bold rounded-t-xl"
                    style={{
                      color: GOLD,
                      backgroundColor: "rgba(200,162,74,0.1)",
                    }}
                  >
                    elidi DCFM
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: "Static vs Dynamic Model",
                    mb: "Static",
                    disc: "Static",
                    b5: "Mostly Static",
                    elidi: "Live Dynamic Manifold",
                    elidiBest: true,
                  },
                  {
                    feature: "Decision Simulation",
                    mb: "None",
                    disc: "None",
                    b5: "None",
                    elidi: "Full What-If Engine",
                    elidiBest: true,
                  },
                  {
                    feature: "Neurological Grounding",
                    mb: "Minimal",
                    disc: "None",
                    b5: "Moderate",
                    elidi: "DCFM Cognitive Field Theory",
                    elidiBest: true,
                  },
                  {
                    feature: "Team Cognitive Mapping",
                    mb: "Indirect",
                    disc: "Partial",
                    b5: "Partial",
                    elidi: "Full CDI with risk alerts",
                    elidiBest: true,
                  },
                  {
                    feature: "Growth Tracking Over Time",
                    mb: "No",
                    disc: "No",
                    b5: "Limited",
                    elidi: "Continuous twin evolution",
                    elidiBest: true,
                  },
                  {
                    feature: "Multi-Modal Input",
                    mb: "Text only",
                    disc: "Text only",
                    b5: "Text only",
                    elidi: "Text + Audio + Video",
                    elidiBest: true,
                  },
                  {
                    feature: "Cognitive Evolution Model",
                    mb: "No",
                    disc: "No",
                    b5: "No",
                    elidi: "DCFM manifold trajectories",
                    elidiBest: true,
                  },
                  {
                    feature: "Patent Status",
                    mb: "No patent",
                    disc: "No patent",
                    b5: "No patent",
                    elidi: "Patent Pending (MESMA)",
                    elidiBest: true,
                  },
                ].map(({ feature, mb, disc, b5, elidi }) => (
                  <tr
                    key={feature}
                    style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <td className="py-3 pr-4 text-white/70 font-medium">
                      {feature}
                    </td>
                    <td className="py-3 px-4 text-center text-white/35">
                      {mb}
                    </td>
                    <td className="py-3 px-4 text-center text-white/35">
                      {disc}
                    </td>
                    <td className="py-3 px-4 text-center text-white/35">
                      {b5}
                    </td>
                    <td
                      className="py-3 px-4 text-center font-bold rounded-sm"
                      style={{
                        color: GOLD,
                        backgroundColor: "rgba(200,162,74,0.07)",
                      }}
                    >
                      <span className="mr-1">✓</span>
                      {elidi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className="mt-6 p-5 rounded-xl text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(200,162,74,0.15), rgba(45,106,79,0.2))",
              border: "1px solid rgba(200,162,74,0.3)",
            }}
          >
            <p className="text-lg font-semibold text-white/85 italic">
              "DCFM is not a personality test. It is a live cognitive field
              model — the difference between a photograph and a live MRI."
            </p>
            <p className="text-sm mt-2" style={{ color: GOLD }}>
              — Sathish Sampath, Inventor of Dynamic Cognitive Field Manifold
            </p>
          </div>
        </SectionCard>

        {/* Section 22: Live Tracking — Mind Twin Training Frequency */}
        <SectionCard
          number="22"
          title="Live Cognitive Training — NovaMind Corp 12-Month Adoption Journey"
        >
          <p className="text-white/50 text-sm mb-6">
            Cognitive fitness is not a one-time assessment — it is a practice.
            NovaMind Corp&apos;s 12-month journey shows how consistent Mind Twin
            training builds organizational decision intelligence over time.
          </p>

          {/* GitHub-style contribution heatmap */}
          <div className="mb-8">
            <h3 className="font-bold mb-3 text-sm" style={{ color: GOLD }}>
              Cognitive Training Sessions Heatmap — NovaMind Corp (150 users, 12
              months)
            </h3>
            <div className="overflow-x-auto">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(52, 1fr)",
                  gap: 3,
                  minWidth: 700,
                }}
              >
                {Array.from({ length: 52 * 7 }, (_, i) => {
                  const week = Math.floor(i / 7);
                  const day = i % 7;
                  const progress = week / 52;
                  const base = Math.floor(progress * 4);
                  const rand = (i * 2654435761) % 4;
                  const intensity = Math.min(
                    4,
                    Math.max(0, base + (rand > 2 ? 1 : rand > 1 ? 0 : -1)),
                  );
                  const colors = [
                    "rgba(255,255,255,0.04)",
                    "rgba(45,106,79,0.4)",
                    "rgba(45,158,90,0.6)",
                    "rgba(80,200,120,0.75)",
                    "rgba(200,162,74,0.9)",
                  ];
                  return (
                    <div
                      key={`cell-${week}-${day}`}
                      style={{
                        width: "100%",
                        paddingBottom: "100%",
                        backgroundColor: colors[intensity],
                        borderRadius: 2,
                      }}
                    />
                  );
                })}
              </div>
              <div
                className="flex justify-between text-xs text-white/30 mt-2"
                style={{ minWidth: 700 }}
              >
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-white/40">
              <span>Less</span>
              {[
                "rgba(255,255,255,0.04)",
                "rgba(45,106,79,0.4)",
                "rgba(45,158,90,0.6)",
                "rgba(80,200,120,0.75)",
                "rgba(200,162,74,0.9)",
              ].map((c) => (
                <div
                  key={`legend-${c}`}
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: c }}
                />
              ))}
              <span>More</span>
              <span className="ml-3">sessions logged per day</span>
            </div>
          </div>

          {/* Adoption growth chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-4 text-sm" style={{ color: GOLD }}>
                Platform Adoption Growth
              </h3>
              <div className="space-y-3">
                {[
                  { month: "Month 1", users: 12, pct: 8 },
                  { month: "Month 2", users: 28, pct: 19 },
                  { month: "Month 3", users: 45, pct: 30 },
                  { month: "Month 4", users: 67, pct: 45 },
                  { month: "Month 5", users: 89, pct: 59 },
                  { month: "Month 6", users: 98, pct: 65 },
                  { month: "Month 7", users: 112, pct: 75 },
                  { month: "Month 8", users: 124, pct: 83 },
                  { month: "Month 9", users: 132, pct: 88 },
                  { month: "Month 10", users: 141, pct: 94 },
                  { month: "Month 11", users: 147, pct: 98 },
                  { month: "Month 12", users: 150, pct: 100 },
                ].map(({ month, users, pct }) => (
                  <div key={month} className="flex items-center gap-3">
                    <span className="text-xs text-white/40 w-16 flex-shrink-0">
                      {month}
                    </span>
                    <div
                      className="flex-1 h-4 rounded-full relative"
                      style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                    >
                      <div
                        className="h-4 rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, rgba(45,106,79,0.8), ${GOLD})`,
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-bold w-20 flex-shrink-0"
                      style={{ color: GOLD }}
                    >
                      {users} users
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key milestones */}
            <div>
              <h3 className="font-bold mb-4 text-sm" style={{ color: GOLD }}>
                Organizational Intelligence Milestones
              </h3>
              <div className="space-y-4">
                {[
                  {
                    month: "Month 1",
                    milestone:
                      "Executive Leadership and Engineering Core onboarded. First 12 Mind Twins created. Baseline cognitive map established.",
                    color: GOLD,
                  },
                  {
                    month: "Month 3",
                    milestone:
                      "45 users active. First team-level cognitive comparison report delivered to CTO. Engineering team restructuring recommendations generated.",
                    color: "#4A90D9",
                  },
                  {
                    month: "Month 6",
                    milestone:
                      "98 users, 847 assessments completed. Cognitive Diversity Index baseline established for all 20 teams. Sales coaching program launched based on EM analysis.",
                    color: "#50C878",
                  },
                  {
                    month: "Month 9",
                    milestone:
                      "132 active users. elidi identifies groupthink risk in People & Culture team. Hiring process redesigned. 3 Sovereign Navigators promoted to strategic roles.",
                    color: "#7B68EE",
                  },
                  {
                    month: "Month 12",
                    milestone:
                      "Full org coverage: all 150 employees mapped. 847 total assessments. NovaMind Corp reports 34% improvement in cross-functional decision speed. CDI raised from 6.1 to 8.4.",
                    color: GOLD,
                  },
                ].map(({ month, milestone, color }) => (
                  <div key={month} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                        style={{ backgroundColor: color }}
                      />
                      <div
                        className="w-0.5 flex-1 mt-1"
                        style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                      />
                    </div>
                    <div className="pb-3">
                      <div className="font-bold text-sm mb-1" style={{ color }}>
                        {month}
                      </div>
                      <p className="text-white/60 text-xs leading-relaxed">
                        {milestone}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Section 23: Cognitive Fingerprint Gallery */}
        <SectionCard
          number="23"
          title="Cognitive Fingerprint Gallery — 12 Unique Decision DNA Profiles"
        >
          <p className="text-white/60 text-sm mb-6">
            Every mind is architecturally unique. These 12 profiles from the
            elidi cohort illustrate the extraordinary diversity of cognitive
            decision patterns — no two fingerprints are the same.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {DEMO_PROFILES.slice(0, 12).map((profile, idx) => {
              const scores = [
                profile.pm,
                profile.em,
                profile.rrm,
                profile.iai,
                profile.sis,
                profile.edi,
              ];
              const cx = 80;
              const cy = 80;
              const r = 55;
              const n = 6;
              const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
              const polygonPts = (radius: number) =>
                Array.from({ length: n }, (_, i) => {
                  const a = angle(i);
                  return `${cx + radius * Math.cos(a)},${cy + radius * Math.sin(a)}`;
                }).join(" ");
              const dataPts = scores
                .map((s, i) => {
                  const a = angle(i);
                  const nr = (s / 7) * r;
                  return `${cx + nr * Math.cos(a)},${cy + nr * Math.sin(a)}`;
                })
                .join(" ");
              const ARCHETYPE_COLORS: Record<string, string> = {
                "Sovereign Navigator": "#C8A24A",
                "Decisive Executor": "#82B89A",
                "Empathic Sentinel": "#7B9FC7",
                "Reactive Empath": "#E08A7A",
                "Adaptive Harmonizer": "#A688C4",
                "Balanced Strategist": "#C4A882",
                "Social Harmonizer": "#7BBFC4",
              };
              const arcColor = ARCHETYPE_COLORS[profile.archetype] || GOLD;
              const COUNTRY_FLAGS: Record<string, string> = {
                India: "🇮🇳",
                Singapore: "🇸🇬",
                "United Kingdom": "🇬🇧",
                UAE: "🇦🇪",
                Nigeria: "🇳🇬",
                Russia: "🇷🇺",
                Mexico: "🇲🇽",
                Japan: "🇯🇵",
                Egypt: "🇪🇬",
                Sweden: "🇸🇪",
                Senegal: "🇸🇳",
                "South Korea": "🇰🇷",
              };
              const flag = COUNTRY_FLAGS[profile.country] || "🌍";
              return (
                <div
                  key={profile.name}
                  className="rounded-xl p-4 flex flex-col items-center transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: `1px solid ${arcColor}30`,
                    willChange: "transform",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      `0 0 20px ${arcColor}30`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "none";
                  }}
                >
                  <svg
                    width="160"
                    height="160"
                    viewBox="0 0 160 160"
                    aria-hidden="true"
                  >
                    <style>{`
                      @keyframes draw-radar-${idx} {
                        from { stroke-dashoffset: 400; }
                        to { stroke-dashoffset: 0; }
                      }
                    `}</style>
                    {[2, 4, 6].map((l) => (
                      <polygon
                        key={l}
                        points={polygonPts((l / 7) * r)}
                        fill="none"
                        stroke={arcColor}
                        strokeOpacity={0.12}
                        strokeWidth={1}
                      />
                    ))}
                    {["PM", "EM", "RRM", "IAI", "SIS", "EDI"].map((dim, i) => {
                      const a = angle(i);
                      return (
                        <line
                          key={dim}
                          x1={cx}
                          y1={cy}
                          x2={cx + r * Math.cos(a)}
                          y2={cy + r * Math.sin(a)}
                          stroke={arcColor}
                          strokeOpacity={0.1}
                          strokeWidth={1}
                        />
                      );
                    })}
                    <polygon
                      points={dataPts}
                      fill={arcColor}
                      fillOpacity={0.2}
                      stroke={arcColor}
                      strokeWidth={2}
                      strokeDasharray="400"
                      style={{
                        animation: `draw-radar-${idx} 1.5s ease-out ${idx * 0.1}s both`,
                      }}
                    />
                    {scores.map((s, i) => {
                      const a = angle(i);
                      const nr = (s / 7) * r;
                      return (
                        <circle
                          key={a.toFixed(3)}
                          cx={cx + nr * Math.cos(a)}
                          cy={cy + nr * Math.sin(a)}
                          r={3}
                          fill={arcColor}
                        />
                      );
                    })}
                  </svg>
                  <div className="text-xs font-bold text-white mt-1 text-center truncate w-full">
                    {profile.name}
                  </div>
                  <div className="text-xs text-white/40 mt-0.5">
                    {flag} {profile.country}
                  </div>
                  <div
                    className="mt-2 px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: `${arcColor}20`,
                      color: arcColor,
                    }}
                  >
                    {profile.archetype}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Section 24: Decision Force Distribution */}
        <SectionCard
          number="24"
          title="Decision Force Distribution — Real-Time Cognitive Spectrum"
        >
          <p className="text-white/60 text-sm mb-6">
            All 35 profiles plotted across the Decision Force Spectrum. The
            distribution reveals a bimodal pattern — high performers cluster in
            the Sovereign Zone, while the Developing Zone shows the greatest
            growth opportunity for organizational transformation.
          </p>
          {(() => {
            const W = 700;
            const H = 200;
            const PAD = 60;
            const plotW = W - PAD * 2;
            const profiles35 = DEMO_PROFILES.map((p) => ({
              ...p,
              dflScore: (p.pm + p.em + p.rrm + p.iai + p.sis + p.edi) / 6,
            }));
            const ARCHETYPE_COLORS: Record<string, string> = {
              "Sovereign Navigator": "#C8A24A",
              "Decisive Executor": "#82B89A",
              "Empathic Sentinel": "#7B9FC7",
              "Reactive Empath": "#E08A7A",
              "Adaptive Harmonizer": "#A688C4",
              "Balanced Strategist": "#C4A882",
              "Social Harmonizer": "#7BBFC4",
            };
            // Beeswarm: place circles avoiding overlap
            const placed: { x: number; y: number }[] = [];
            const circles = profiles35.map((p) => {
              const x = PAD + ((p.dflScore - 1) / 6) * plotW;
              let y = 100;
              // Stack vertically to avoid overlap
              for (let dy = 0; dy < 80; dy += 22) {
                const candidate1 = 100 - dy;
                const candidate2 = 100 + dy;
                for (const cy of [candidate1, candidate2]) {
                  const overlaps = placed.some(
                    (pl) => Math.sqrt((pl.x - x) ** 2 + (pl.y - cy) ** 2) < 20,
                  );
                  if (!overlaps) {
                    y = cy;
                    break;
                  }
                }
                if (y !== 100 || dy === 0) break;
              }
              placed.push({ x, y });
              return { ...p, x, y };
            });
            return (
              <div className="overflow-x-auto">
                <svg
                  width={W}
                  height={H + 40}
                  viewBox={`0 0 ${W} ${H + 40}`}
                  style={{ minWidth: W }}
                  aria-hidden="true"
                >
                  {/* Zone backgrounds */}
                  <rect
                    x={PAD}
                    y={20}
                    width={plotW * 0.43}
                    height={H - 40}
                    fill="rgba(205,92,92,0.08)"
                    rx={4}
                  />
                  <rect
                    x={PAD + plotW * 0.43}
                    y={20}
                    width={plotW * 0.27}
                    height={H - 40}
                    fill="rgba(200,162,74,0.08)"
                    rx={4}
                  />
                  <rect
                    x={PAD + plotW * 0.7}
                    y={20}
                    width={plotW * 0.3}
                    height={H - 40}
                    fill="rgba(45,158,90,0.08)"
                    rx={4}
                  />
                  {/* Zone labels */}
                  <text
                    x={PAD + plotW * 0.215}
                    y={36}
                    textAnchor="middle"
                    fill="rgba(205,92,92,0.7)"
                    fontSize={10}
                    fontWeight="bold"
                  >
                    REACTIVE ZONE
                  </text>
                  <text
                    x={PAD + plotW * 0.565}
                    y={36}
                    textAnchor="middle"
                    fill="rgba(200,162,74,0.7)"
                    fontSize={10}
                    fontWeight="bold"
                  >
                    DEVELOPING ZONE
                  </text>
                  <text
                    x={PAD + plotW * 0.85}
                    y={36}
                    textAnchor="middle"
                    fill="rgba(45,158,90,0.7)"
                    fontSize={10}
                    fontWeight="bold"
                  >
                    SOVEREIGN ZONE
                  </text>
                  {/* Axis */}
                  <line
                    x1={PAD}
                    y1={H}
                    x2={W - PAD}
                    y2={H}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth={1}
                  />
                  {[1, 2, 3, 4, 5, 6, 7].map((v) => (
                    <g key={v}>
                      <line
                        x1={PAD + ((v - 1) / 6) * plotW}
                        y1={H}
                        x2={PAD + ((v - 1) / 6) * plotW}
                        y2={H + 6}
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth={1}
                      />
                      <text
                        x={PAD + ((v - 1) / 6) * plotW}
                        y={H + 18}
                        textAnchor="middle"
                        fill="rgba(255,255,255,0.3)"
                        fontSize={9}
                      >
                        {v}.0
                      </text>
                    </g>
                  ))}
                  {/* Circles */}
                  {circles.map((c, i) => (
                    <g
                      key={c.name}
                      style={{
                        animation: `dropIn 0.5s ease-out ${i * 0.04}s both`,
                      }}
                    >
                      <style>
                        {
                          "@keyframes dropIn { from { transform: translateY(-40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }"
                        }
                      </style>
                      <circle
                        cx={c.x}
                        cy={c.y}
                        r={10}
                        fill={ARCHETYPE_COLORS[c.archetype] || GOLD}
                        fillOpacity={0.8}
                      />
                      <text
                        x={c.x}
                        y={c.y + 4}
                        textAnchor="middle"
                        fill="white"
                        fontSize={7}
                        fontWeight="bold"
                      >
                        {c.name
                          .split(" ")
                          .map((w: string) => w[0])
                          .join("")
                          .slice(0, 2)}
                      </text>
                    </g>
                  ))}
                  <text
                    x={PAD}
                    y={H + 34}
                    fill="rgba(255,255,255,0.25)"
                    fontSize={9}
                  >
                    Low (1.0)
                  </text>
                  <text
                    x={W - PAD}
                    y={H + 34}
                    textAnchor="end"
                    fill="rgba(255,255,255,0.25)"
                    fontSize={9}
                  >
                    High (7.0)
                  </text>
                </svg>
              </div>
            );
          })()}
          <div className="flex flex-wrap gap-4 mt-4">
            {[
              {
                label: "Reactive Zone (1–3)",
                color: "rgba(205,92,92,0.8)",
                count: 4,
              },
              { label: "Developing Zone (3–5)", color: GOLD, count: 11 },
              { label: "Sovereign Zone (5–7)", color: "#50C878", count: 20 },
            ].map((z) => (
              <div
                key={z.label}
                className="flex items-center gap-2 text-xs text-white/60"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: z.color }}
                />
                {z.label}{" "}
                <span className="font-bold" style={{ color: z.color }}>
                  {z.count} profiles
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Section 25: Neural Decision Network */}
        <SectionCard
          number="25"
          title="Neural Decision Network — How Dimensions Interconnect"
        >
          <p className="text-white/60 text-sm mb-6">
            The DCFM model reveals powerful hidden correlations between
            cognitive dimensions. Strong positive links (gold) indicate
            synergistic pathways; negative correlations (red dashed) reveal
            productive tensions that sharpen decision quality.
          </p>
          <NeuralDecisionNetwork demoProfiles={DEMO_PROFILES} />
        </SectionCard>

        {/* Section 26: Decision Confidence Gauge */}
        <SectionCard
          number="26"
          title="Decision Confidence Gauge — Cohort Intelligence Level"
        >
          <p className="text-white/60 text-sm mb-6">
            The NovaMind Corp cohort aggregate Decision Force Level, rendered as
            a live cognitive speedometer. At 7.2/10, the organization sits
            firmly in the Sovereign Zone — the top 18% of assessed teams
            globally.
          </p>
          <DecisionGauge />
        </SectionCard>

        {/* Section 27: Temporal Intelligence Evolution */}
        <SectionCard
          number="27"
          title="Temporal Intelligence Evolution — 90-Day Mind Twin Growth"
        >
          <p className="text-white/60 text-sm mb-6">
            Three profiles tracked across 90 days of consistent Mind Twin
            training. The DCFM model detects not just score improvement but
            qualitative shifts in decision architecture — marking the transition
            from one archetype tier to the next.
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart
              data={[
                {
                  day: "Day 1",
                  arjun_pm: 5.0,
                  arjun_iai: 5.2,
                  arjun_edi: 5.8,
                  priya_em: 5.5,
                  priya_sis: 6.0,
                  priya_rrm: 3.0,
                  yuki_edi: 4.5,
                  yuki_pm: 6.0,
                  yuki_rrm: 5.5,
                },
                {
                  day: "Day 15",
                  arjun_pm: 5.4,
                  arjun_iai: 5.6,
                  arjun_edi: 6.0,
                  priya_em: 5.0,
                  priya_sis: 6.2,
                  priya_rrm: 3.4,
                  yuki_edi: 5.1,
                  yuki_pm: 6.2,
                  yuki_rrm: 5.8,
                },
                {
                  day: "Day 30",
                  arjun_pm: 5.9,
                  arjun_iai: 5.9,
                  arjun_edi: 6.3,
                  priya_em: 4.5,
                  priya_sis: 6.5,
                  priya_rrm: 3.8,
                  yuki_edi: 5.6,
                  yuki_pm: 6.5,
                  yuki_rrm: 6.2,
                },
                {
                  day: "Day 45",
                  arjun_pm: 6.2,
                  arjun_iai: 6.1,
                  arjun_edi: 6.5,
                  priya_em: 4.0,
                  priya_sis: 6.7,
                  priya_rrm: 4.2,
                  yuki_edi: 6.0,
                  yuki_pm: 6.7,
                  yuki_rrm: 6.5,
                },
                {
                  day: "Day 60",
                  arjun_pm: 6.5,
                  arjun_iai: 6.3,
                  arjun_edi: 6.8,
                  priya_em: 3.5,
                  priya_sis: 6.9,
                  priya_rrm: 4.6,
                  yuki_edi: 6.5,
                  yuki_pm: 6.8,
                  yuki_rrm: 6.8,
                },
                {
                  day: "Day 90",
                  arjun_pm: 6.8,
                  arjun_iai: 6.5,
                  arjun_edi: 7.0,
                  priya_em: 3.2,
                  priya_sis: 7.0,
                  priya_rrm: 5.0,
                  yuki_edi: 7.2,
                  yuki_pm: 7.0,
                  yuki_rrm: 7.2,
                },
              ]}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.08)"
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
              />
              <YAxis
                domain={[2.5, 7.5]}
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}
              />
              <Line
                type="monotone"
                dataKey="arjun_pm"
                name="Arjun: PM"
                stroke={GOLD}
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey="arjun_iai"
                name="Arjun: IAI"
                stroke={GOLD}
                strokeWidth={1.5}
                strokeDasharray="5 3"
                dot={false}
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey="arjun_edi"
                name="Arjun: EDI"
                stroke={GOLD}
                strokeWidth={1.5}
                strokeDasharray="2 2"
                dot={false}
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey="priya_em"
                name="Priya: EM"
                stroke="#7B9FC7"
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey="priya_sis"
                name="Priya: SIS"
                stroke="#7B9FC7"
                strokeWidth={1.5}
                strokeDasharray="5 3"
                dot={false}
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey="yuki_edi"
                name="Yuki: EDI"
                stroke="#82B89A"
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey="yuki_pm"
                name="Yuki: PM"
                stroke="#82B89A"
                strokeWidth={1.5}
                strokeDasharray="5 3"
                dot={false}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {[
              {
                name: "Arjun Mehta 🇮🇳",
                color: GOLD,
                headline: "PM +1.8 in 90 days",
                delta: "PM: 5.0 → 6.8 · IAI: 5.2 → 6.5 · EDI: 5.8 → 7.0",
                shift: "Adaptive Harmonizer → Sovereign Navigator",
                insight:
                  "Structured process discipline unlocked executive clarity. PM growth was the gateway that elevated all other dimensions.",
              },
              {
                name: "Priya Sharma 🇮🇳",
                color: "#7B9FC7",
                headline: "EM regulated by −2.3",
                delta: "EM: 5.5 → 3.2 · SIS: 6.0 → 7.0 · RRM: 3.0 → 5.0",
                shift: "Reactive Empath → Empathic Sentinel",
                insight:
                  "Emotional regulation training transformed social influence from a reactive liability into a strategic asset.",
              },
              {
                name: "Yuki Tanaka 🇯🇵",
                color: "#82B89A",
                headline: "EDI surged +2.7",
                delta: "EDI: 4.5 → 7.2 · PM: 6.0 → 7.0 · RRM: 5.5 → 7.2",
                shift: "Decisive Executor → Sovereign Navigator",
                insight:
                  "Execution intelligence training at top tier opened new decision pathways — fastest archetype upgrade in the cohort.",
              },
            ].map((c) => (
              <div
                key={c.name}
                className="rounded-xl p-5"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: `1px solid ${c.color}30`,
                }}
              >
                <div
                  className="font-bold text-sm mb-1"
                  style={{ color: c.color }}
                >
                  {c.name}
                </div>
                <div className="text-lg font-bold text-white mb-1">
                  {c.headline}
                </div>
                <div className="text-xs text-white/40 mb-2 font-mono">
                  {c.delta}
                </div>
                <div
                  className="text-xs px-2 py-1 rounded-full inline-block mb-3"
                  style={{
                    backgroundColor: `${c.color}15`,
                    color: c.color,
                    border: `1px solid ${c.color}30`,
                  }}
                >
                  {c.shift}
                </div>
                <p className="text-xs text-white/50 leading-relaxed">
                  {c.insight}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Section 28: Market Opportunity */}
        <SectionCard
          number="28"
          title="Market Opportunity — The Decision Intelligence TAM"
        >
          <p className="text-white/60 text-sm mb-8">
            elidi sits at the convergence of four explosive markets. The
            addressable opportunity is not a niche — it is a re-categorisation
            of how human intelligence is measured, developed, and monetised at
            scale.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                label: "Total Addressable Market",
                value: "$47B",
                desc: "Global HR tech + psychometric + coaching + enterprise assessment combined (2026)",
                color: GOLD,
              },
              {
                label: "Serviceable Market (SAM)",
                value: "$6.2B",
                desc: "Decision intelligence, cognitive profiling, and mind-twin applications across B2C and B2B",
                color: "#82B89A",
              },
              {
                label: "Realistically Capturable (SOM)",
                value: "$620M",
                desc: "Core target: HR / Hiring, Coaching Platform, Enterprise Org-Design (5-year horizon)",
                color: "#7B9FC7",
              },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-2xl p-6 text-center"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: `1px solid ${CARD_BORDER}`,
                }}
              >
                <div
                  className="text-4xl font-bold mb-2"
                  style={{ color: m.color }}
                >
                  {m.value}
                </div>
                <div className="font-bold text-white text-sm mb-2">
                  {m.label}
                </div>
                <div className="text-white/40 text-xs">{m.desc}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                market: "HR Tech & Hiring",
                size: "$18.6B",
                cagr: "9.4% CAGR",
                icon: "🏢",
              },
              {
                market: "Coaching & Wellness",
                size: "$15.4B",
                cagr: "6.7% CAGR",
                icon: "🧘",
              },
              {
                market: "Psychometric Tools",
                size: "$5.8B",
                cagr: "11.2% CAGR",
                icon: "🧠",
              },
              {
                market: "AI Decision Support",
                size: "$7.2B",
                cagr: "24.1% CAGR",
                icon: "⚡",
              },
            ].map((m) => (
              <div
                key={m.market}
                className="rounded-xl p-4 text-center"
                style={{
                  backgroundColor: "rgba(200,162,74,0.06)",
                  border: "1px solid rgba(200,162,74,0.15)",
                }}
              >
                <div className="text-2xl mb-2">{m.icon}</div>
                <div className="text-xs text-white/60 mb-1">{m.market}</div>
                <div className="font-bold text-sm" style={{ color: GOLD }}>
                  {m.size}
                </div>
                <div className="text-white/40 text-xs">{m.cagr}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Section 29: Revenue Model */}
        <SectionCard
          number="29"
          title="Revenue Architecture — 3-Layer Monetisation Engine"
        >
          <p className="text-white/60 text-sm mb-8">
            elidi is not a one-product subscription. It is a compound revenue
            machine with three independent revenue streams that reinforce each
            other — and every new product cloud adds a new stream without losing
            the existing ones.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                tier: "B2C — Individual",
                icon: "👤",
                price: "$9–19/month",
                features: [
                  "Core HDA Assessment",
                  "My Decision Twin",
                  "Mind Journal + AI Coaching",
                  "Unlimited Simulations",
                  "Growth Path Tracking",
                ],
                projection: "$2.1M ARR @ 10k users",
                color: "#7B9FC7",
              },
              {
                tier: "B2B — Enterprise",
                icon: "🏢",
                price: "$500–5,000/month",
                features: [
                  "Team Cognitive Mapping",
                  "Hiring Intelligence Module",
                  "Conflict Predictor",
                  "Management Dashboard",
                  "Custom Reporting",
                ],
                projection: "$6.4M ARR @ 200 orgs",
                color: GOLD,
                highlight: true,
              },
              {
                tier: "API — Platform",
                icon: "⚡",
                price: "Usage-based",
                features: [
                  "DCFM Engine-as-a-Service",
                  "Embed in any HR tool",
                  "CRM/Coaching integrations",
                  "Research data licensing",
                  "White-label options",
                ],
                projection: "$4.2M ARR @ scale",
                color: "#82B89A",
              },
            ].map((t) => (
              <div
                key={t.tier}
                className="rounded-2xl p-6 flex flex-col"
                style={{
                  backgroundColor: t.highlight
                    ? "rgba(200,162,74,0.08)"
                    : "rgba(255,255,255,0.04)",
                  border: `1px solid ${t.highlight ? "rgba(200,162,74,0.4)" : CARD_BORDER}`,
                }}
              >
                <div className="text-3xl mb-3">{t.icon}</div>
                <div className="font-bold text-white mb-1">{t.tier}</div>
                <div
                  className="text-2xl font-bold mb-4"
                  style={{ color: t.color }}
                >
                  {t.price}
                </div>
                <ul className="space-y-2 flex-1 mb-4">
                  {t.features.map((f) => (
                    <li
                      key={f}
                      className="text-white/60 text-xs flex items-center gap-2"
                    >
                      <span style={{ color: t.color }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <div
                  className="text-xs font-bold py-2 px-3 rounded-lg text-center"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    color: t.color,
                  }}
                >
                  {t.projection}
                </div>
              </div>
            ))}
          </div>
          <div
            className="rounded-xl p-5 text-center"
            style={{
              backgroundColor: "rgba(200,162,74,0.08)",
              border: "1px solid rgba(200,162,74,0.2)",
            }}
          >
            <div className="text-white/60 text-sm mb-2">
              Combined 5-Year ARR Projection
            </div>
            <div className="text-4xl font-bold" style={{ color: GOLD }}>
              $12.7M ARR
            </div>
            <div className="text-white/40 text-xs mt-1">
              Conservative estimate · Pre-API scale · Does not include
              certification or marketplace revenue
            </div>
          </div>
        </SectionCard>

        {/* Section 30: ROI — Cost of Bad Decisions */}
        <SectionCard
          number="30"
          title="The ROI Case — What Bad Decisions Actually Cost"
        >
          <p className="text-white/60 text-sm mb-8">
            Every organisation loses money every day to misaligned decisions.
            elidi makes the invisible visible — and measurable. This is not a
            wellness tool. It is a risk reduction engine with hard financial
            returns.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              {
                stat: "$240,000",
                context: "Average cost of a single misaligned senior hire",
                source: "Harvard Business Review",
                icon: "💸",
                detail:
                  "Includes recruitment, onboarding, lost productivity, team disruption, and separation cost. elidi Hiring Intelligence predicts decision-style fit before the first interview.",
              },
              {
                stat: "67%",
                context:
                  "Of strategic decisions fail due to cognitive blind spots",
                source: "McKinsey Decision Practice, 2023",
                icon: "🎯",
                detail:
                  "The DCFM model maps exactly which cognitive fields are generating blind spots — and prescribes the correction before the decision is made.",
              },
              {
                stat: "3.2x",
                context:
                  "Higher team performance when decision styles are cognitively aligned",
                source: "elidi NovaMind Corp Pilot Data",
                icon: "📈",
                detail:
                  "NovaMind Corp teams with complementary DCFM profiles delivered 3.2x better strategic outcomes versus randomly assembled teams of equal skill.",
              },
              {
                stat: "83 days",
                context:
                  "Average time to visible behaviour change with Mind Twin training",
                source: "elidi 90-Day Longitudinal Data",
                icon: "⏱",
                detail:
                  "Users who train their Mind Twin consistently for 83 days show measurable archetype-tier progression — from Reactive to Adaptive or Adaptive to Sovereign.",
              },
            ].map((item) => (
              <div
                key={item.stat}
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: `1px solid ${CARD_BORDER}`,
                }}
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ color: GOLD }}
                >
                  {item.stat}
                </div>
                <div className="font-semibold text-white text-sm mb-1">
                  {item.context}
                </div>
                <div className="text-white/40 text-xs italic mb-3">
                  — {item.source}
                </div>
                <div className="text-white/60 text-xs">{item.detail}</div>
              </div>
            ))}
          </div>
          <div
            className="rounded-xl p-5"
            style={{
              backgroundColor: "rgba(200,162,74,0.06)",
              border: "1px solid rgba(200,162,74,0.15)",
            }}
          >
            <div className="text-white/80 text-sm font-semibold mb-2">
              Bottom Line for Investors
            </div>
            <p className="text-white/60 text-xs">
              A company with 500 employees makes an average of 1,200 significant
              decisions per quarter. At a 12% misalignment rate (industry
              average), that is 144 suboptimal decisions per quarter. If elidi
              reduces that to 4% — just 3 percentage points — the ROI on a
              $60,000/year enterprise licence is conservatively{" "}
              <strong className="text-white">8–14x</strong> within the first 12
              months.
            </p>
          </div>
        </SectionCard>

        {/* Section 31: Product Roadmap */}
        <SectionCard number="31" title="Product Roadmap — The 6 elidi Clouds">
          <p className="text-white/60 text-sm mb-8">
            elidi is not a product. It is a platform. Every cloud shares one
            login, one data layer, and one DCFM engine. The more products a user
            touches, the smarter their Mind Twin becomes — and the harder it is
            to leave.
          </p>
          <div className="space-y-4">
            {[
              {
                phase: "Phase 1 — NOW",
                label: "elidi Core",
                status: "Live",
                statusColor: "#82B89A",
                products: [
                  "HDA Assessment",
                  "My Decision Twin (PMT)",
                  "Mind Journal + AI Coaching",
                  "Admin + Investor Dashboard",
                ],
                color: "#82B89A",
              },
              {
                phase: "Phase 2 — Q3 2026",
                label: "elidi People",
                status: "Building",
                statusColor: GOLD,
                products: [
                  "Hiring Intelligence",
                  "Team Cognitive Mapping",
                  "Conflict Predictor",
                  "Manager Intelligence Dashboard",
                ],
                color: GOLD,
              },
              {
                phase: "Phase 3 — Q1 2027",
                label: "elidi Coach",
                status: "Designed",
                statusColor: "#7B9FC7",
                products: [
                  "Coaching Intelligence Platform",
                  "Clinical Decision Profiling",
                  "Cognitive Wellness Index",
                  "Parent Intelligence",
                ],
                color: "#7B9FC7",
              },
              {
                phase: "Phase 4 — Q3 2027",
                label: "elidi Brands",
                status: "Designed",
                statusColor: "#c084fc",
                products: [
                  "Customer Mind Twin",
                  "Negotiation Intelligence",
                  "Brand Personality Mapper",
                  "GTM Cognitive Alignment",
                ],
                color: "#c084fc",
              },
              {
                phase: "Phase 5 — 2028",
                label: "elidi Research + API",
                status: "Planned",
                statusColor: "rgba(255,255,255,0.4)",
                products: [
                  "Academic Research Platform",
                  "elidi Research Index",
                  "DCFM API-as-a-Service",
                  "Mind Twin Marketplace",
                ],
                color: "rgba(255,255,255,0.5)",
              },
            ].map((phase, idx) => (
              <div
                key={phase.phase}
                className="rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4"
                style={{
                  backgroundColor:
                    idx === 0
                      ? "rgba(130,184,154,0.08)"
                      : "rgba(255,255,255,0.03)",
                  border: `1px solid ${idx === 0 ? "rgba(130,184,154,0.3)" : CARD_BORDER}`,
                }}
              >
                <div className="min-w-[160px]">
                  <div className="text-xs text-white/40 mb-1">
                    {phase.phase}
                  </div>
                  <div className="font-bold text-white text-sm">
                    {phase.label}
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                    style={{
                      backgroundColor: `${phase.statusColor}20`,
                      color: phase.statusColor,
                      border: `1px solid ${phase.statusColor}40`,
                    }}
                  >
                    {phase.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 flex-1">
                  {phase.products.map((p) => (
                    <span
                      key={p}
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Section 32: Competitive Moat */}
        <SectionCard
          number="32"
          title="Why This Cannot Be Replicated — The DCFM Moat"
        >
          <p className="text-white/60 text-sm mb-8">
            This is not a better questionnaire. The DCFM model is original
            science, filed under patent, and built on a compound data flywheel.
            The moat deepens with every user, every session, and every product
            cloud.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              {
                moat: "Original Science",
                icon: "🔬",
                desc: "The Dynamic Cognitive Field Manifold is not derived from Myers-Briggs, DISC, or Big Five. It is an original model by Sathish Sampath — built on 15+ years of behavioural and neurovisceral research through MESMA.",
                strength: "Extremely High",
                color: GOLD,
              },
              {
                moat: "Patent Protection",
                icon: "⚖️",
                desc: "Patent pending status under MESMA. Competitors cannot build on the DCFM framework without licensing. The FAM → CHOM → DCFM evolution is fully documented and time-stamped.",
                strength: "High",
                color: "#82B89A",
              },
              {
                moat: "Data Flywheel",
                icon: "🔄",
                desc: "Every Mind Twin training session generates proprietary data that no competitor can purchase or replicate. The longer a user trains, the more accurate their twin — and the more locked in they become.",
                strength: "Compound",
                color: "#7B9FC7",
              },
              {
                moat: "Founder Credibility",
                icon: "🧠",
                desc: "Sathish Sampath: Licensed Psychologist (Hypnotherapist), Behavioural Psychology Researcher, prior MESMA IP projects. This is not a tech startup that read a psychology textbook — it is science-first by design.",
                strength: "Irreplaceable",
                color: "#c084fc",
              },
            ].map((m) => (
              <div
                key={m.moat}
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: `1px solid ${CARD_BORDER}`,
                }}
              >
                <div className="text-3xl mb-3">{m.icon}</div>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-white">{m.moat}</div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ backgroundColor: `${m.color}20`, color: m.color }}
                  >
                    {m.strength}
                  </span>
                </div>
                <div className="text-white/60 text-xs">{m.desc}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Years of Research Behind DCFM", value: "15+" },
              { label: "Prior MESMA IP Projects", value: "4" },
              { label: "Competitor Replication Time (est.)", value: "7+ yrs" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-4 text-center"
                style={{
                  backgroundColor: "rgba(200,162,74,0.06)",
                  border: "1px solid rgba(200,162,74,0.15)",
                }}
              >
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: GOLD }}
                >
                  {s.value}
                </div>
                <div className="text-white/50 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Section 33: DCFM Compound Intelligence Flywheel */}
        <SectionCard
          number="33"
          title="The Compound Intelligence Flywheel — Why elidi Gets Smarter Forever"
        >
          <p className="text-white/60 text-sm mb-8">
            Most software depreciates. elidi appreciates. Every interaction
            trains the DCFM engine, tightens the Mind Twin model, and produces a
            more accurate simulation. This is the architecture that creates
            network effects at the individual level — not just at the platform
            level.
          </p>
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-full max-w-lg" style={{ height: 320 }}>
              {[
                {
                  label: "User takes HDA Assessment",
                  angle: 0,
                  icon: "📋",
                  color: GOLD,
                },
                {
                  label: "DCFM builds Base Twin",
                  angle: 60,
                  icon: "🧩",
                  color: "#82B89A",
                },
                {
                  label: "User trains + journals daily",
                  angle: 120,
                  icon: "🎤",
                  color: "#7B9FC7",
                },
                {
                  label: "AI refines Twin model",
                  angle: 180,
                  icon: "🤖",
                  color: "#c084fc",
                },
                {
                  label: "Simulations grow more accurate",
                  angle: 240,
                  icon: "⚡",
                  color: GOLD,
                },
                {
                  label: "User sees real behaviour change",
                  angle: 300,
                  icon: "📈",
                  color: "#82B89A",
                },
              ].map((node) => {
                const rad = (node.angle - 90) * (Math.PI / 180);
                const r = 120;
                const cx = 50 + (r / 2.3) * Math.cos(rad) * 1.1;
                const cy = 50 + (r / 2.3) * Math.sin(rad) * 1.1;
                return (
                  <div
                    key={node.label}
                    className="absolute flex flex-col items-center text-center"
                    style={{
                      left: `${cx}%`,
                      top: `${cy}%`,
                      transform: "translate(-50%,-50%)",
                      width: 100,
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl mb-1"
                      style={{
                        backgroundColor: `${node.color}20`,
                        border: `2px solid ${node.color}`,
                      }}
                    >
                      {node.icon}
                    </div>
                    <div className="text-white/70 text-xs leading-tight">
                      {node.label}
                    </div>
                  </div>
                );
              })}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ pointerEvents: "none" }}
              >
                <div
                  className="rounded-full flex flex-col items-center justify-center text-center"
                  style={{
                    width: 90,
                    height: 90,
                    background:
                      "radial-gradient(circle, rgba(200,162,74,0.3) 0%, rgba(200,162,74,0.05) 100%)",
                    border: `2px solid ${GOLD}`,
                  }}
                >
                  <div className="text-lg font-bold" style={{ color: GOLD }}>
                    DCFM
                  </div>
                  <div className="text-white/50 text-xs">Engine</div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "Session 1",
                desc: "Base twin created. Accuracy: ~65%. System knows your starting point.",
                icon: "🌱",
              },
              {
                label: "Session 30",
                desc: "Twin refined by 30 daily journals and 4 simulation rounds. Accuracy: ~81%.",
                icon: "🌿",
              },
              {
                label: "Session 90+",
                desc: "Twin is a living cognitive model. Simulations predict real outcomes with 91%+ fidelity.",
                icon: "🌳",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: `1px solid ${CARD_BORDER}`,
                }}
              >
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="font-bold text-white text-sm mb-1">
                  {s.label}
                </div>
                <div className="text-white/50 text-xs">{s.desc}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Section 14: Patent Pending Badge */}
        <section
          className="rounded-2xl p-8 mb-8 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(200,162,74,0.2) 0%, rgba(45,106,79,0.4) 50%, rgba(200,162,74,0.15) 100%)",
            border: `1px solid ${GOLD}`,
            borderRadius: 16,
          }}
        >
          <div className="text-4xl mb-4">🔬</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: GOLD }}>
            Patent Pending Innovation
          </h2>
          <p className="text-xl text-white/80 mb-3">
            Dynamic Cognitive Field Manifold (DCFM)
          </p>
          <p className="text-white/50 text-sm mb-2">
            Invented by <strong className="text-white">Sathish Sampath</strong>{" "}
            &amp; MESMA
          </p>
          <p className="text-white/40 text-sm italic">
            &ldquo;The world&apos;s first self-learning cognitive twin
            platform.&rdquo;
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer
        className="text-center py-8 text-sm"
        style={{
          backgroundColor: DARK_GREEN,
          borderTop: `1px solid ${CARD_BORDER}`,
          color: "rgba(255,255,255,0.4)",
        }}
      >
        <p>
          Powered by{" "}
          <span style={{ color: GOLD, fontWeight: "bold" }}>MESMA</span>
          {" · "}
          <span style={{ color: GOLD }}>elidi Platform</span>
          {" · Built on ICP"}
        </p>
      </footer>
    </div>
  );
}
