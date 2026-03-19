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
    text: "Before making an important call at work or in life, you naturally pause and think it through step by step — rather than jumping straight in.",
    dimension: "pm",
  },
  {
    text: "When you make a big decision, you tend to write down or mentally note what you were thinking, so you can look back and learn from it.",
    dimension: "pm",
  },
  {
    text: "You picture a clear goal in your mind before weighing up your options — rather than figuring it out as you go.",
    dimension: "pm",
  },
  {
    text: "After a decision plays out (good or bad), you take time to ask yourself what you'd do differently next time.",
    dimension: "pm",
  },
  {
    text: "When a really complex decision comes up, you find it helpful to use a checklist, framework, or structured approach rather than winging it.",
    dimension: "pm",
  },
  {
    text: "You rarely set aside dedicated time to sit and think through your decisions — it mostly happens on the fly.",
    dimension: "pm",
  },
  // EM (6-11)
  {
    text: "Even when a decision is urgent and the pressure is on, you're able to stay calm and think clearly rather than panicking.",
    dimension: "em",
  },
  {
    text: "In the middle of a heated moment, you can usually sense when your feelings are starting to colour your thinking — and catch yourself.",
    dimension: "em",
  },
  {
    text: "If you notice you're feeling really emotional or stressed, you'll deliberately hold off making an important decision until you've settled.",
    dimension: "em",
  },
  {
    text: "You treat your gut feelings and emotional reactions as useful signals — not just noise to be ignored — when working through a decision.",
    dimension: "em",
  },
  {
    text: "When you're at work or in a professional setting, you generally keep personal feelings from distorting your judgment.",
    dimension: "em",
  },
  {
    text: "When you're in an emotional or difficult state, you tend to reach out to someone you trust before making a big call.",
    dimension: "em",
  },
  // RRM (12-17)
  {
    text: "Before committing to a decision, you naturally think through how likely different outcomes are — not just hope for the best.",
    dimension: "rrm",
  },
  {
    text: "You weigh what you stand to gain against what you might lose in a methodical way, rather than going with whichever feels better.",
    dimension: "rrm",
  },
  {
    text: "Even when things are unclear and outcomes are uncertain, you're able to make a solid decision without feeling paralysed.",
    dimension: "rrm",
  },
  {
    text: "You have a clear sense of how much risk is acceptable to you — a mental line you won't cross when the stakes are high.",
    dimension: "rrm",
  },
  {
    text: "Before a major decision, you mentally walk through the best-case, worst-case, and most realistic scenarios.",
    dimension: "rrm",
  },
  {
    text: "When there's too much uncertainty, you tend to stall or avoid making a decision until things become clearer.",
    dimension: "rrm",
  },
  // IAI (18-23)
  {
    text: "Before deciding, you deliberately seek out different perspectives and sources of information — not just the first thing that comes to hand.",
    dimension: "iai",
  },
  {
    text: "You question whether the information you're using is reliable and relevant, rather than taking it at face value.",
    dimension: "iai",
  },
  {
    text: "Even when a situation is complicated, you're able to cut through the noise and identify what really matters for the decision.",
    dimension: "iai",
  },
  {
    text: "When the stakes are high, you turn to data, numbers, or structured analysis to support your thinking rather than just going on feel.",
    dimension: "iai",
  },
  {
    text: "You're aware of your own mental shortcuts and blind spots — and actively work to correct for them when making decisions.",
    dimension: "iai",
  },
  {
    text: "When you're pressed for time, you mostly go with your gut rather than looking for data or evidence.",
    dimension: "iai",
  },
  // SIS (24-29)
  {
    text: "On big decisions that affect others, you make a point of bringing the right people into the conversation before you decide.",
    dimension: "sis",
  },
  {
    text: "When a group of people with different opinions needs to reach a decision together, you're good at helping them find common ground.",
    dimension: "sis",
  },
  {
    text: "You adjust how you present your thinking — your tone, language, or framing — depending on who you're talking to and what will resonate with them.",
    dimension: "sis",
  },
  {
    text: "You often draw on your network — trusted contacts, mentors, or colleagues — as a resource when facing a tricky decision.",
    dimension: "sis",
  },
  {
    text: "You understand how power dynamics, group politics, and social pressure can affect the quality of decisions made in a team.",
    dimension: "sis",
  },
  {
    text: "In a group discussion, you tend to drive the agenda and push your own view rather than making space for others to contribute.",
    dimension: "sis",
  },
  // EDI (30-35)
  {
    text: "Even without all the information you'd ideally want, you're able to make a clear and timely decision rather than waiting indefinitely.",
    dimension: "edi",
  },
  {
    text: "Once you've made a decision, you own it — you don't deflect blame or make excuses if things don't go as planned.",
    dimension: "edi",
  },
  {
    text: "When you decide something, you naturally think about both the immediate impact and how it fits into the bigger picture long-term.",
    dimension: "edi",
  },
  {
    text: "When multiple important decisions are competing for your attention at once, you're able to prioritise clearly and act on what matters most.",
    dimension: "edi",
  },
  {
    text: "Your decisions — across different areas of life or work — tend to be consistent with each other and aligned with a clear direction.",
    dimension: "edi",
  },
  {
    text: "After committing to a decision, you often find yourself second-guessing it and wondering if you made the right call.",
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
      "High analytical intelligence — you synthesise information effectively and mitigate bias.",
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
