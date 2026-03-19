export const DIMENSIONS = ["pm", "em", "rrm", "iai", "sis", "edi"] as const;
export type Dimension = (typeof DIMENSIONS)[number];

export const DIMENSION_LABELS: Record<Dimension, string> = {
  pm: "Process Management",
  em: "Emotional Management",
  rrm: "Risk & Reward Management",
  iai: "Information & Analytical Intelligence",
  sis: "Social & Interpersonal Skills",
  edi: "Executive Decision Intelligence",
};

export const DIMENSION_SHORT: Record<Dimension, string> = {
  pm: "PM",
  em: "EM",
  rrm: "RRM",
  iai: "IAI",
  sis: "SIS",
  edi: "EDI",
};

// Which question indices (0-based) are reverse scored
export const REVERSE_SCORED_INDICES = [5, 11, 17, 23, 29, 35];

// Questions grouped by dimension (6 questions each, in order)
export const QUESTIONS: { text: string; dimension: Dimension }[] = [
  // PM (0-5)
  {
    text: "I follow a clear, structured process when making important decisions.",
    dimension: "pm",
  },
  {
    text: "I consistently document and review my decision-making criteria.",
    dimension: "pm",
  },
  {
    text: "I set explicit goals before evaluating decision options.",
    dimension: "pm",
  },
  {
    text: "I regularly review my past decisions to improve future ones.",
    dimension: "pm",
  },
  {
    text: "I use formal frameworks or models to guide complex decisions.",
    dimension: "pm",
  },
  {
    text: "I allocate dedicated time for structured decision planning.",
    dimension: "pm",
  },
  // EM (6-11)
  {
    text: "I remain calm and composed when facing high-pressure decisions.",
    dimension: "em",
  },
  {
    text: "I can clearly identify when my emotions are influencing my judgments.",
    dimension: "em",
  },
  {
    text: "I delay decisions when I recognize strong emotional interference.",
    dimension: "em",
  },
  {
    text: "I use emotional awareness as useful data in decision-making.",
    dimension: "em",
  },
  {
    text: "I rarely let personal biases cloud my professional decisions.",
    dimension: "em",
  },
  {
    text: "I seek perspective from others when my emotional state is heightened.",
    dimension: "em",
  },
  // RRM (12-17)
  {
    text: "I accurately assess the probability of different outcomes before deciding.",
    dimension: "rrm",
  },
  {
    text: "I weigh potential rewards against risks in a balanced, systematic way.",
    dimension: "rrm",
  },
  {
    text: "I am comfortable making decisions under significant uncertainty.",
    dimension: "rrm",
  },
  {
    text: "I have clear personal or organizational risk tolerance thresholds.",
    dimension: "rrm",
  },
  {
    text: "I regularly scenario-plan for best, worst, and most likely cases.",
    dimension: "rrm",
  },
  {
    text: "I tend to avoid decisions when uncertainty is high.",
    dimension: "rrm",
  },
  // IAI (18-23)
  {
    text: "I seek out multiple, diverse sources of information before deciding.",
    dimension: "iai",
  },
  {
    text: "I critically evaluate the quality and relevance of data I use.",
    dimension: "iai",
  },
  {
    text: "I can synthesize complex information into clear decision criteria.",
    dimension: "iai",
  },
  {
    text: "I use quantitative tools or analysis to inform key decisions.",
    dimension: "iai",
  },
  {
    text: "I am aware of and actively mitigate cognitive biases in analysis.",
    dimension: "iai",
  },
  {
    text: "I tend to rely on gut feel over data when time is limited.",
    dimension: "iai",
  },
  // SIS (24-29)
  {
    text: "I actively involve stakeholders in major decisions when appropriate.",
    dimension: "sis",
  },
  {
    text: "I am skilled at building consensus among diverse decision-making groups.",
    dimension: "sis",
  },
  {
    text: "I adapt my communication style to influence decision outcomes.",
    dimension: "sis",
  },
  {
    text: "I leverage my network and relationships as a decision-making resource.",
    dimension: "sis",
  },
  {
    text: "I understand how social dynamics affect group decision quality.",
    dimension: "sis",
  },
  {
    text: "I tend to dominate group discussions rather than facilitate them.",
    dimension: "sis",
  },
  // EDI (30-35)
  {
    text: "I make clear, timely decisions even under incomplete information.",
    dimension: "edi",
  },
  {
    text: "I take full accountability for the outcomes of my decisions.",
    dimension: "edi",
  },
  {
    text: "I balance short-term needs with long-term strategic implications.",
    dimension: "edi",
  },
  {
    text: "I can prioritize among competing high-stakes decisions effectively.",
    dimension: "edi",
  },
  {
    text: "I maintain strategic coherence across a portfolio of decisions.",
    dimension: "edi",
  },
  {
    text: "I second-guess myself frequently after committing to a decision.",
    dimension: "edi",
  },
];

export function computeScores(responses: number[]): Record<Dimension, number> {
  const adjusted = responses.map((r, i) =>
    REVERSE_SCORED_INDICES.includes(i) ? 8 - r : r,
  );

  const sums: Record<Dimension, number> = {
    pm: 0,
    em: 0,
    rrm: 0,
    iai: 0,
    sis: 0,
    edi: 0,
  };
  const counts: Record<Dimension, number> = {
    pm: 0,
    em: 0,
    rrm: 0,
    iai: 0,
    sis: 0,
    edi: 0,
  };

  QUESTIONS.forEach((q, i) => {
    sums[q.dimension] += adjusted[i];
    counts[q.dimension]++;
  });

  const result = {} as Record<Dimension, number>;
  for (const d of DIMENSIONS) {
    result[d] = Math.round((sums[d] / counts[d]) * 100) / 100;
  }
  return result;
}

export function classifyArchetype(scores: Record<Dimension, number>): string {
  const { pm, em, rrm, iai, sis, edi } = scores;
  if (edi >= 5.5 && pm >= 5) return "The Strategic Commander";
  if (iai >= 5.5 && rrm >= 5) return "The Analytical Navigator";
  if (sis >= 5.5 && em >= 5) return "The Empathic Orchestrator";
  if (rrm >= 5.5 && edi >= 5) return "The Calculated Risk-Taker";
  if (pm >= 5.5 && iai >= 5) return "The Systematic Analyst";
  if (em >= 5.5 && sis >= 5) return "The Resonant Leader";

  const highest = DIMENSIONS.reduce((a, b) => (scores[a] > scores[b] ? a : b));
  const map: Record<Dimension, string> = {
    pm: "The Process Architect",
    em: "The Emotionally Agile Decider",
    rrm: "The Risk-Aware Strategist",
    iai: "The Data-Driven Thinker",
    sis: "The Collaborative Connector",
    edi: "The Executive Decider",
  };
  return map[highest];
}

export function classifyDecisionForce(
  scores: Record<Dimension, number>,
): string {
  const avg = DIMENSIONS.reduce((s, d) => s + scores[d], 0) / DIMENSIONS.length;
  if (avg >= 6.0) return "Elite Decision Force";
  if (avg >= 5.0) return "High Decision Force";
  if (avg >= 4.0) return "Developing Decision Force";
  if (avg >= 3.0) return "Emerging Decision Force";
  return "Foundation Decision Force";
}

export function getOverallAverage(scores: Record<Dimension, number>): number {
  return (
    Math.round(
      (DIMENSIONS.reduce((s, d) => s + scores[d], 0) / DIMENSIONS.length) * 100,
    ) / 100
  );
}

export function getDimensionInterpretation(
  dim: Dimension,
  score: number,
): string {
  const interpretations: Record<Dimension, [string, string, string]> = {
    pm: [
      "Strong process orientation — you bring structure and discipline to decision workflows.",
      "Moderate process use — some structure but room to build more consistent frameworks.",
      "Low process use — decisions may feel reactive; structured approaches would increase confidence.",
    ],
    em: [
      "High emotional intelligence in decisions — you use self-awareness as a strategic asset.",
      "Developing emotional regulation — awareness is present but consistency may vary.",
      "Emotional factors may be impacting decision quality; building regulation skills is a priority.",
    ],
    rrm: [
      "Sophisticated risk calibration — you balance opportunity and uncertainty expertly.",
      "Moderate risk awareness — improving scenario planning would sharpen outcomes.",
      "Risk may be under-weighted in decisions; building risk frameworks is recommended.",
    ],
    iai: [
      "High analytical intelligence — you synthesize information effectively and mitigate bias.",
      "Solid analytical base — increasing data rigor and bias awareness will enhance quality.",
      "Decisions may rely too heavily on intuition; developing analytical habits is essential.",
    ],
    sis: [
      "Strong interpersonal decision skills — you leverage relationships and build consensus well.",
      "Developing stakeholder skills — improving facilitation and network use will add value.",
      "Social factors may be limiting decision quality; stakeholder engagement is a growth area.",
    ],
    edi: [
      "Executive-level decision intelligence — you act decisively, strategically, and with accountability.",
      "Emerging executive capability — building decisiveness and strategic clarity will accelerate growth.",
      "Executive decision skills need development; focus on accountability and strategic framing.",
    ],
  };
  const tier = score >= 5 ? 0 : score >= 3 ? 1 : 2;
  return interpretations[dim][tier];
}

export function getRecommendations(
  scores: Record<Dimension, number>,
): string[] {
  const sorted = [...DIMENSIONS].sort((a, b) => scores[a] - scores[b]);
  const recs: Record<Dimension, string> = {
    pm: "Invest in structured decision frameworks. Tools like RACI matrices, decision logs, and pre-mortem analysis can dramatically improve process consistency.",
    em: 'Practice mindfulness-based decision techniques. Developing a "pause protocol" before major decisions can reduce emotional interference by up to 40%.',
    rrm: "Build a personal risk assessment toolkit. Regular scenario planning, probability estimation exercises, and defined risk thresholds will improve outcome calibration.",
    iai: "Strengthen analytical habits by committing to data-first decision protocols. Challenge intuitive judgments with structured analytical counterpoints.",
    sis: "Develop stakeholder mapping and facilitation skills. Practice active listening and consensus-building techniques in lower-stakes settings first.",
    edi: "Build executive decision confidence through deliberate practice. Commit to firm deadlines for decisions and conduct post-decision reviews to build accountability muscle.",
  };
  const general =
    "Continue to monitor your Decision Intelligence scores over time. Quarterly reassessment helps track growth and identify shifting development needs.";
  const topRecs = sorted.slice(0, 3).map((d) => recs[d]);
  return [...topRecs, general];
}
