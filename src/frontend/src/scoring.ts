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

export function getDimensionDeepDetail(
  dim: Dimension,
  score: number,
): {
  fullInterpretation: string;
  signal: string;
  strength: string;
  developmentFocus: string;
} {
  const details: Record<
    Dimension,
    [
      {
        fullInterpretation: string;
        signal: string;
        strength: string;
        developmentFocus: string;
      },
      {
        fullInterpretation: string;
        signal: string;
        strength: string;
        developmentFocus: string;
      },
      {
        fullInterpretation: string;
        signal: string;
        strength: string;
        developmentFocus: string;
      },
    ]
  > = {
    pm: [
      {
        fullInterpretation:
          "Your process orientation is a genuine strategic asset. You bring structure and discipline to decision workflows, enabling consistent quality even under pressure. The key growth edge is knowing when to flex the framework without abandoning it entirely.",
        signal: "Structured, deliberate decision flow",
        strength: "Consistent frameworks under pressure",
        developmentFocus: "Increase adaptive flexibility",
      },
      {
        fullInterpretation:
          "You apply process tools selectively, which keeps you agile but can introduce inconsistency. Building repeatable decision frameworks for your highest-stakes contexts will compound your reliability over time. The opportunity is to move from occasional structure to systematic habit.",
        signal: "Selective process application",
        strength: "Agile in low-stakes situations",
        developmentFocus: "Build repeatable decision routines",
      },
      {
        fullInterpretation:
          "Without a process anchor, decisions can feel reactive or draining because each one starts from scratch. Structured approaches — even simple checklists or decision logs — dramatically reduce cognitive load and improve confidence. This is the single highest-leverage development area for your profile.",
        signal: "Reactive, situational decision style",
        strength: "Flexible, unencumbered thinking",
        developmentFocus: "Adopt a basic decision checklist",
      },
    ],
    em: [
      {
        fullInterpretation:
          "You use emotional intelligence as a deliberate navigation tool, not just a soft skill. Self-awareness allows you to separate personal reactivity from objective judgment, producing more consistent outcomes in high-stakes moments. Your challenge is ensuring this skill scales when you're under significant stress.",
        signal: "Emotionally calibrated under pressure",
        strength: "Separates reactivity from judgment",
        developmentFocus: "Scale EQ to extreme-stress contexts",
      },
      {
        fullInterpretation:
          "Emotional awareness is present but not yet fully integrated into your decision process. In familiar situations you regulate well, but novel or high-pressure scenarios may still trigger reactive patterns. Deepening regulation practice will close this gap quickly.",
        signal: "Context-dependent emotional regulation",
        strength: "Manages routine emotional triggers",
        developmentFocus: "Regulate under novel high-pressure",
      },
      {
        fullInterpretation:
          "Emotional signals are influencing decisions more than you realise, often without conscious acknowledgment. This is not a flaw — it's a fixable gap. Building a simple pause-and-label practice before major decisions can shift outcomes significantly within weeks.",
        signal: "Emotion-driven, under-acknowledged",
        strength: "Genuine emotional sensitivity",
        developmentFocus: "Pause-and-label before key decisions",
      },
    ],
    rrm: [
      {
        fullInterpretation:
          "You calibrate risk with sophistication — weighing probability, impact, and recovery path simultaneously. This makes you a reliable presence when uncertainty is high, because you neither freeze nor recklessly accelerate. The growth edge is sharing your risk reasoning explicitly, so teams can trust and learn from your process.",
        signal: "Probabilistic, multi-variable risk read",
        strength: "Steady judgment in uncertainty",
        developmentFocus: "Communicate risk reasoning to teams",
      },
      {
        fullInterpretation:
          "Your risk awareness is real but not yet systematic. You catch obvious risks but may underestimate second-order consequences or overweight recent negative experiences. Scenario planning and pre-mortem exercises will sharpen your calibration significantly.",
        signal: "Aware but ad-hoc risk assessment",
        strength: "Identifies first-order risks reliably",
        developmentFocus: "Adopt pre-mortem scenario planning",
      },
      {
        fullInterpretation:
          "Risk may be underweighted in your decisions, either through optimism bias or discomfort with uncertainty. This creates exposure to avoidable surprises. Building a personal risk vocabulary and minimum viable risk review into major decisions will improve outcomes substantially.",
        signal: "Optimism-biased, low risk vigilance",
        strength: "Bold, low-hesitation initiative",
        developmentFocus: "Add minimum risk review ritual",
      },
    ],
    iai: [
      {
        fullInterpretation:
          "You synthesise information with discipline, cross-checking data against intuition and actively hunting for cognitive bias. This makes you highly credible in analytical environments and resilient against groupthink. The refinement is building faster analytical shortcuts for routine decisions, reserving depth for genuinely novel ones.",
        signal: "Data-driven, bias-aware synthesis",
        strength: "Credible analysis under complexity",
        developmentFocus: "Build fast-track routines for low-stakes calls",
      },
      {
        fullInterpretation:
          "Your analytical base is solid but not yet fully systematic. You engage with data well in structured contexts, but bias may creep in when time is short or emotional stakes are high. Committing to data-first decision protocols in key domains will strengthen this dimension considerably.",
        signal: "Solid analysis, context-dependent",
        strength: "Structured thinking in familiar domains",
        developmentFocus: "Commit to data-first protocols",
      },
      {
        fullInterpretation:
          "Analytical habits are still developing, meaning decisions may rely disproportionately on intuition or social proof. Neither is wrong — but without analytical checks, errors compound silently. Starting with one analytical habit (e.g., writing down 3 data points before any major decision) creates rapid gains.",
        signal: "Intuition-led, social-proof influenced",
        strength: "Fast, instinctive pattern matching",
        developmentFocus: "Note 3 data points per major decision",
      },
    ],
    sis: [
      {
        fullInterpretation:
          "You leverage relationships as genuine strategic assets in decision making, not just for social comfort. You read stakeholder dynamics quickly, build consensus efficiently, and create decisions that others actually support and implement. The sophistication play is extending this skill into adversarial or politically complex environments.",
        signal: "Relational intelligence in full deployment",
        strength: "Builds consensus and buy-in at speed",
        developmentFocus: "Navigate adversarial stakeholder dynamics",
      },
      {
        fullInterpretation:
          "Interpersonal awareness is present and useful but not yet fully deployed in decision contexts. You may under-utilise your network for information gathering or leave stakeholders under-consulted. Deliberate stakeholder mapping before major decisions will unlock significant value.",
        signal: "Selective social engagement in decisions",
        strength: "Maintains positive working relationships",
        developmentFocus: "Map stakeholders before major decisions",
      },
      {
        fullInterpretation:
          "Social and relational factors are not fully integrated into your decision process, which can lead to well-reasoned decisions that fail in implementation. People are both information sources and execution vehicles — engaging them earlier in the process typically improves both quality and buy-in.",
        signal: "Independent, under-networked decisions",
        strength: "Self-reliant, unbiased by opinion",
        developmentFocus: "Consult one stakeholder earlier per decision",
      },
    ],
    edi: [
      {
        fullInterpretation:
          "You operate at executive decision levels — committing with clarity, owning outcomes, and maintaining strategic coherence under pressure. This profile marks you as someone others turn to when the stakes are highest. The growth edge is building systems that sustain this capacity as complexity and scale increase.",
        signal: "Clear commitment, strategic ownership",
        strength: "Trusted decision anchor under pressure",
        developmentFocus: "Build scalable decision systems",
      },
      {
        fullInterpretation:
          "Executive decision capability is emerging but not yet fully reliable. You make good calls in familiar territory, but accountability and decisiveness may waver in genuinely novel or high-visibility situations. Deliberate practice in committing and reviewing will accelerate this dimension faster than almost anything else.",
        signal: "Emerging decisiveness, context-dependent",
        strength: "Solid judgment in familiar territory",
        developmentFocus: "Practice committing in high-visibility calls",
      },
      {
        fullInterpretation:
          "Executive decision skills — clarity, commitment, accountability, strategic framing — are the developmental frontier of your profile. These skills are not innate; they are practiced. Starting with structured post-decision reviews and firm internal deadlines will build this muscle more quickly than most expect.",
        signal: "Developing strategic decision ownership",
        strength: "Coachable, high growth potential",
        developmentFocus: "Structured post-decision review habit",
      },
    ],
  };
  const tier = score >= 5 ? 0 : score >= 3 ? 1 : 2;
  return details[dim][tier];
}

export function getArchetypeToAvoid(scores: Record<Dimension, number>): {
  label: string;
  axes: string;
  avoidReason: string;
} {
  const _highest = (Object.keys(scores) as Dimension[]).reduce((a, b) =>
    scores[a] >= scores[b] ? a : b,
  );
  const _lowest = (Object.keys(scores) as Dimension[]).reduce((a, b) =>
    scores[a] <= scores[b] ? a : b,
  );

  if (scores.iai >= 5 && scores.edi < 3) {
    return {
      label: "The Maverick",
      axes: "Intuitive · Very Fluid",
      avoidReason:
        "Your analytical rigor is the very thing that makes your decisions credible and trustworthy. Leaning into pure gut-instinct fluidity would discard that foundation at exactly the moment it matters most. Decisions would lose their data grounding, accountability would erode, and your core competency advantage would be neutralised. The Maverick archetype thrives on bold improvisation — but improvisation without analytical ballast is a high-exposure gamble. Protect your edge: keep analysis primary.",
    };
  }
  if (scores.em >= 5 && scores.iai < 3) {
    return {
      label: "The Analyst",
      axes: "Structured · Data-Only",
      avoidReason:
        "Your emotional intelligence is the primary signal your decision process runs on — and it is a genuine competitive advantage. Doubling down on pure data-detachment would suppress exactly the EQ that gives you your greatest decision edge. People-centered decisions require emotional read as a first-class input, not an afterthought to be filtered out. Pure analytical style without interpersonal sensitivity leads to technically correct but contextually blind decisions — right answers that land wrong. Keep EQ at the center.",
    };
  }
  if (scores.edi >= 5 && scores.em < 3) {
    return {
      label: "The Empath",
      axes: "Relational · Harmony-First",
      avoidReason:
        "The Empath archetype prioritises relationship harmony above decisive action — the inverse of your profile's core strength. Forcing an empathic decision style without the emotional foundation to sustain it would produce neither decisive leadership nor genuine human connection. You would be performing sensitivity rather than exercising it, which erodes credibility in both directions. Your strength is decisive, accountable action: that is what high-stakes environments call for. Empathic style without the emotional grounding to back it up is a costly performance gap.",
    };
  }
  if (scores.em >= 5 && scores.sis >= 5) {
    return {
      label: "The Strategist",
      axes: "Analytical · Systematically Detached",
      avoidReason:
        "Cold analytical structuring conflicts fundamentally with the relational intelligence that defines your highest value. The Strategist archetype demands systematic detachment — treating decisions as logic puzzles, minimising human variables. But your profile's most powerful outcomes emerge precisely through interpersonal sensitivity and emotional attunement. Adopting the Strategist's detached posture would blunt the very mechanism that makes your decisions stick in the real world. Decisions made without people-read may be elegant on paper but brittle in practice.",
    };
  }
  if (scores.iai >= 5 && scores.pm >= 5) {
    return {
      label: "The Maverick",
      axes: "Intuitive · Very Fluid",
      avoidReason:
        "Your profile is built on two compounding strengths — analytical rigor and structured process. The Maverick archetype operates by dismantling both: it thrives on spontaneity, improvisation, and rejection of systematic thinking. Emulating this style would require abandoning the very scaffolding your decision quality depends on. The result would be confident-feeling but poorly grounded decisions. Your analytical and process strengths are what separate your outcomes from the average — guard them deliberately.",
    };
  }
  if (scores.rrm < 3) {
    return {
      label: "The Maverick",
      axes: "Intuitive · Very Fluid",
      avoidReason:
        "The Maverick thrives on high-risk ambiguity — but this archetype only works when risk intelligence is finely calibrated. Without strong risk management foundations, you lack the safety net required to survive Maverick-level exposure. Emulating this archetype is the fastest path to consequential, potentially unrecoverable errors. High-fluidity, high-risk improvisation demands a sophisticated internal risk compass. Until risk calibration is firmly developed, the Maverick pattern amplifies your most critical vulnerability, not your strength.",
    };
  }
  // Default
  return {
    label: "The Executor",
    axes: "Analytical · Fluid",
    avoidReason:
      "The Executor pattern sacrifices strategic depth for speed — making fast, action-first decisions without adequate information synthesis, emotional read, or process structure. This is the wrong trade-off for your profile. Fast action without foundational quality creates momentum in the wrong direction: and the more decisive the execution, the harder the eventual correction becomes. Your profile needs breadth of thinking before commitment, not compressed thinking in service of speed. Build quality in first; speed follows naturally.",
  };
}

// ── Authenticity & Personalization ──────────────────────────────────────────

export type AuthenticityTier = "high" | "medium" | "low";

export interface AuthenticityResult {
  score: number;
  tier: AuthenticityTier;
  summary: string;
  color: string;
}

export function computeAuthenticity(
  responses: number[],
  responseTimes?: number[],
): AuthenticityResult {
  let score = 100;
  const n = responses.length;

  // Penalty: identical responses (straight-lining)
  if (responses.every((r) => r === responses[0])) score -= 60;

  // Penalty: speed-clicking
  if (responseTimes && responseTimes.length > 0) {
    const valid = responseTimes.filter((t) => t > 0);
    if (valid.length > 0) {
      const sorted = [...valid].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median =
        sorted.length % 2 === 0
          ? (sorted[mid - 1] + sorted[mid]) / 2
          : sorted[mid];
      if (median < 4000) score -= 45;
      else if (median < 7000) score -= 15;
    }
  }

  // Penalty: extreme response bias
  const extremeCount = responses.filter((r) => r === 1 || r === 7).length;
  if (extremeCount / n > 0.6) score -= 20;
  else if (extremeCount / n > 0.4) score -= 10;

  // Penalty: central tendency bias
  const centralCount = responses.filter((r) => r >= 3 && r <= 5).length;
  if (centralCount / n > 0.8) score -= 15;
  else if (centralCount / n > 0.7) score -= 8;

  // Bonus: natural timing variance
  if (responseTimes && responseTimes.length > 5) {
    const valid = responseTimes.filter((t) => t > 0);
    const mean = valid.reduce((a, b) => a + b, 0) / valid.length;
    const variance =
      valid.reduce((a, b) => a + (b - mean) ** 2, 0) / valid.length;
    const stdDev = Math.sqrt(variance);
    if (stdDev > 5000) score += 5;
  }

  score = Math.max(0, Math.min(100, score));

  let tier: AuthenticityTier;
  let summary: string;
  let color: string;
  if (score >= 70) {
    tier = "high";
    summary =
      "High Response Reliability — results reflect genuine decision patterns";
    color = "#00C896";
  } else if (score >= 40) {
    tier = "medium";
    summary =
      "Moderate Reliability — some response patterns require cautious interpretation";
    color = "#F0C030";
  } else {
    tier = "low";
    summary =
      "Low Reliability — response patterns suggest rushed or inconsistent input";
    color = "#E74C3C";
  }

  return { score, tier, summary, color };
}

export function getPersonalizedRecommendations(
  scores: Record<Dimension, number>,
  tier: AuthenticityTier,
): string[] {
  const sorted = [...DIMENSIONS].sort((a, b) => scores[a] - scores[b]);

  const recsHigh: Record<Dimension, string> = {
    pm: "Your process scores reveal a clear gap in structured decision workflows. Implement a personal decision log this week — write down the decision, your reasoning, and the expected outcome. Review monthly. This single habit, applied consistently, will compound your PM score by a measurable margin within 90 days.",
    em: "Your emotional regulation profile shows a specific vulnerability under pressure or novelty. Build a '5-second pause protocol' before any decision that triggers a physical reaction — pause, label the emotion, then proceed. Research shows this micro-intervention reduces emotionally-driven errors by up to 40% within 30 days.",
    rrm: "Your risk calibration gap is your most actionable growth lever right now. Before your next major decision, write down three second-order consequences and assign each a rough probability. This 10-minute practice rewires risk estimation and will show measurable improvement in decision quality within 60 days.",
    iai: "Your analytical patterns show intuition is currently outpacing your data-checking habits. Create a '3-before-decide' rule: name three verifiable data points before committing to any significant decision. This simple constraint builds analytical rigor without slowing your speed — and directly addresses your IAI profile.",
    sis: "Your stakeholder intelligence is underutilised in your decision process. Map the three people most affected by your next major decision before you make it — consult at least one. This single stakeholder habit is consistently shown to improve implementation outcomes by 35%+ in research environments.",
    edi: "Your EDI scores suggest decisiveness and accountability need deliberate reinforcement. Set a decision deadline for your next pending choice and commit to a public review of the outcome with a trusted peer. Accountability structures are the fastest path to closing the EDI gap your profile reveals.",
  };

  const recsMedium: Record<Dimension, string> = {
    pm: "Your responses suggest process use could be more consistent. Consider introducing a lightweight decision checklist for important choices — even 3 key questions before deciding can improve structure and reduce regret.",
    em: "Your emotional regulation pattern suggests some situational variability. A brief reflection habit — 2 minutes before key decisions — may help you distinguish emotional signal from noise more reliably.",
    rrm: "Risk assessment appears present but somewhat ad hoc. Adding a brief scenario review (best case / worst case / most likely) before major decisions would sharpen your calibration over time.",
    iai: "Analytical habits are developing but not yet systematic. Committing to reviewing at least one data source before significant decisions will gradually shift your decision profile in a measurable way.",
    sis: "Interpersonal factors could be integrated more deliberately into your decision process. Before major decisions, a quick stakeholder consideration — who is affected, who has useful input — tends to improve outcomes.",
    edi: "Executive decisiveness shows room for growth. Practising time-boxed decision making — setting a firm deadline and sticking to it — is one of the most reliable ways to build this capacity.",
  };

  const recsLow: Record<Dimension, string> = {
    pm: "If these responses reflect how you typically approach decisions, building any consistent process — even a simple routine — would be a meaningful starting point worth exploring.",
    em: "If emotional regulation is genuinely an area you navigate in real decisions, small reflection practices before key choices may be worth exploring to see if they feel useful.",
    rrm: "If risk is a real area of development for you, simply asking 'what could go wrong?' before major decisions is a low-effort starting point that many find valuable.",
    iai: "If you tend to rely more on intuition than analysis in real settings, experimenting with jotting down a few facts before decisions can be an interesting way to test the difference.",
    sis: "If stakeholder dynamics feel unfamiliar in your real decision contexts, taking a moment to consider who is affected by a decision is a low-risk habit to try.",
    edi: "If decisiveness is a real growth area for you, small experiments — like setting a firm decision time limit for a low-stakes choice — can be a gentle way to build that muscle.",
  };

  const recs =
    tier === "high" ? recsHigh : tier === "medium" ? recsMedium : recsLow;

  const general =
    tier === "high"
      ? "Reassess quarterly. Your response patterns show the self-awareness and consistency that make growth tracking genuinely meaningful. Each reassessment will reveal real movement, not just noise."
      : tier === "medium"
        ? "Consider reassessing in 60–90 days after working on your development areas. Reassessment is most valuable when you've actively practised the recommended habits."
        : "If you choose to retake the assessment with more time per question, a second comparison will give a much clearer picture of your actual decision profile.";

  return [...sorted.slice(0, 3).map((d) => recs[d]), general];
}
