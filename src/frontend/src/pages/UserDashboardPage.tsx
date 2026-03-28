import { HttpAgent } from "@icp-sdk/core/agent";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { DynamicRadarChart } from "../components/DynamicRadarChart";
import {
  MultimodalInputWidget,
  type MultimodalResponse,
} from "../components/MultimodalInputWidget";
import { loadConfig } from "../config";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  DIMENSIONS,
  DIMENSION_LABELS,
  DIMENSION_SHORT,
  classifyArchetype,
  classifyDecisionForce,
  computeScores,
} from "../scoring";
import type { Dimension } from "../scoring";
import { StorageClient } from "../utils/StorageClient";

interface Props {
  onNavigate: (page: string) => void;
}

type TabId = "twin" | "builder" | "versions" | "simlab" | "growth" | "journal";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "twin", label: "My Mind Twin", icon: "🧠" },
  { id: "builder", label: "Twin Builder", icon: "🎛️" },
  { id: "versions", label: "My Versions", icon: "📂" },
  { id: "simlab", label: "Simulation Lab", icon: "⚗️" },
  { id: "growth", label: "Growth Path", icon: "📈" },
  { id: "journal", label: "My Day Journal", icon: "📓" },
];

// ─── Personal Question Bank (60 questions, 10 per dimension) ─────────────────
const PERSONAL_QUESTIONS: {
  id: string;
  dimension: Dimension;
  text: string;
  skipLabel: string;
}[] = [
  // PM – Perception & Mapping
  {
    id: "pm1",
    dimension: "pm",
    text: "When you walk into a room full of people you don\u2019t know, what\u2019s the first thing you naturally notice \u2014 faces, energy, exits, or what\u2019s out of place?",
    skipLabel: "Skip",
  },
  {
    id: "pm2",
    dimension: "pm",
    text: "Describe a time you walked into a meeting or situation and immediately knew something was off. What told you?",
    skipLabel: "Skip",
  },
  {
    id: "pm3",
    dimension: "pm",
    text: "When you\u2019re trying to make sense of a complex problem, what do you do first \u2014 talk to people, research, sit with it, or draw it out?",
    skipLabel: "Skip",
  },
  {
    id: "pm4",
    dimension: "pm",
    text: "How quickly can you usually tell if someone is being honest with you?",
    skipLabel: "Skip",
  },
  {
    id: "pm5",
    dimension: "pm",
    text: "When you\u2019re in a new city or place, how do you navigate \u2014 plan ahead, go by feel, or follow others?",
    skipLabel: "Skip",
  },
  {
    id: "pm6",
    dimension: "pm",
    text: "A colleague gives you confusing instructions. What\u2019s your instinct \u2014 ask again, figure it out, or just start?",
    skipLabel: "Skip",
  },
  {
    id: "pm7",
    dimension: "pm",
    text: "You receive unexpected news \u2014 good or bad. What part of your brain wakes up first?",
    skipLabel: "Skip",
  },
  {
    id: "pm8",
    dimension: "pm",
    text: "In a negotiation or important conversation, how aware are you of what\u2019s NOT being said?",
    skipLabel: "Skip",
  },
  {
    id: "pm9",
    dimension: "pm",
    text: "When making a big decision, do you tend to rely more on data, gut feeling, or other people\u2019s experience?",
    skipLabel: "Skip",
  },
  {
    id: "pm10",
    dimension: "pm",
    text: "How do you usually know when you\u2019ve truly understood something versus just heard it?",
    skipLabel: "Skip",
  },

  // EM – Emotional Mapping
  {
    id: "em1",
    dimension: "em",
    text: "Think about the last time someone criticised something you worked hard on. What happened inside you in the first 10 seconds?",
    skipLabel: "Skip",
  },
  {
    id: "em2",
    dimension: "em",
    text: "Describe a decision you made purely on emotion that turned out to be exactly right.",
    skipLabel: "Skip",
  },
  {
    id: "em3",
    dimension: "em",
    text: "When you\u2019re anxious about something, how does it show \u2014 sleep, appetite, irritability, silence?",
    skipLabel: "Skip",
  },
  {
    id: "em4",
    dimension: "em",
    text: "How long does it typically take you to calm down after a heated argument or disappointment?",
    skipLabel: "Skip",
  },
  {
    id: "em5",
    dimension: "em",
    text: "Have you ever stayed in a situation (job, relationship, project) longer than you should because of how it made you feel?",
    skipLabel: "Skip",
  },
  {
    id: "em6",
    dimension: "em",
    text: "When you feel overwhelmed, what\u2019s your go-to coping mechanism?",
    skipLabel: "Skip",
  },
  {
    id: "em7",
    dimension: "em",
    text: "If someone you respect suddenly goes cold or distant, what do you do with that?",
    skipLabel: "Skip",
  },
  {
    id: "em8",
    dimension: "em",
    text: "Describe a time your emotions gave you clarity, not confusion, during a tough decision.",
    skipLabel: "Skip",
  },
  {
    id: "em9",
    dimension: "em",
    text: "How do you handle waiting \u2014 especially when the outcome matters a lot?",
    skipLabel: "Skip",
  },
  {
    id: "em10",
    dimension: "em",
    text: "When something goes really well for you, how long does the good feeling last before you\u2019re already on to the next concern?",
    skipLabel: "Skip",
  },

  // RRM – Risk-Reward Mapping
  {
    id: "rrm1",
    dimension: "rrm",
    text: "You have a stable job and a startup opportunity. Walk me through what goes through your mind.",
    skipLabel: "Not applicable",
  },
  {
    id: "rrm2",
    dimension: "rrm",
    text: "Describe the riskiest thing you\u2019ve done in the last 2 years \u2014 professionally or personally.",
    skipLabel: "Skip",
  },
  {
    id: "rrm3",
    dimension: "rrm",
    text: "Before making a big investment (money, time, career), how much information do you need before you feel ready?",
    skipLabel: "Skip",
  },
  {
    id: "rrm4",
    dimension: "rrm",
    text: "What\u2019s your relationship with regret \u2014 do you regret things you did, or things you didn\u2019t do?",
    skipLabel: "Skip",
  },
  {
    id: "rrm5",
    dimension: "rrm",
    text: "When a deal or opportunity seems almost too good, what\u2019s your instinct?",
    skipLabel: "Skip",
  },
  {
    id: "rrm6",
    dimension: "rrm",
    text: "How do you decide when to cut your losses on something not working?",
    skipLabel: "Skip",
  },
  {
    id: "rrm7",
    dimension: "rrm",
    text: "What\u2019s a gamble you took that paid off? What made you go for it?",
    skipLabel: "Skip",
  },
  {
    id: "rrm8",
    dimension: "rrm",
    text: "How do you feel about debt \u2014 strategic tool or something to avoid?",
    skipLabel: "Not applicable",
  },
  {
    id: "rrm9",
    dimension: "rrm",
    text: "When faced with a risky decision, do you focus more on what you could gain or what you could lose?",
    skipLabel: "Skip",
  },
  {
    id: "rrm10",
    dimension: "rrm",
    text: "Describe a time fear stopped you from doing something you now wish you had done.",
    skipLabel: "Skip",
  },

  // IAI – Internal-Autonomy Index
  {
    id: "iai1",
    dimension: "iai",
    text: "When your close circle strongly disagrees with your decision, what do you typically do?",
    skipLabel: "Skip",
  },
  {
    id: "iai2",
    dimension: "iai",
    text: "Describe a time you did something purely for yourself despite heavy pressure not to.",
    skipLabel: "Skip",
  },
  {
    id: "iai3",
    dimension: "iai",
    text: "How much does someone\u2019s disappointment in you change what you do next?",
    skipLabel: "Skip",
  },
  {
    id: "iai4",
    dimension: "iai",
    text: "When you\u2019re deciding something important, whose voice shows up in your head first \u2014 yours, or someone else\u2019s?",
    skipLabel: "Skip",
  },
  {
    id: "iai5",
    dimension: "iai",
    text: "Have you ever changed a decision not because of logic but because of how the other person would react?",
    skipLabel: "Skip",
  },
  {
    id: "iai6",
    dimension: "iai",
    text: "If no one would ever find out what you chose, would any of your recent decisions have been different?",
    skipLabel: "Skip",
  },
  {
    id: "iai7",
    dimension: "iai",
    text: "Describe your relationship with validation \u2014 how much do you need it to feel confident?",
    skipLabel: "Skip",
  },
  {
    id: "iai8",
    dimension: "iai",
    text: "When you go against someone\u2019s advice and it works out, how do you feel?",
    skipLabel: "Skip",
  },
  {
    id: "iai9",
    dimension: "iai",
    text: "How often do you find yourself doing things out of obligation rather than choice?",
    skipLabel: "Skip",
  },
  {
    id: "iai10",
    dimension: "iai",
    text: "What would you do differently in your life if you stopped caring what people thought?",
    skipLabel: "Skip",
  },

  // SIS – Social Intelligence & Stability
  {
    id: "sis1",
    dimension: "sis",
    text: "When a group is clearly heading in the wrong direction, what do you do \u2014 speak up, wait, or follow along?",
    skipLabel: "Skip",
  },
  {
    id: "sis2",
    dimension: "sis",
    text: "How do you handle someone who constantly drains your energy \u2014 at work or at home?",
    skipLabel: "Skip",
  },
  {
    id: "sis3",
    dimension: "sis",
    text: "Describe your last meaningful conflict. How did you handle it, and what did you wish you\u2019d done differently?",
    skipLabel: "Skip",
  },
  {
    id: "sis4",
    dimension: "sis",
    text: "When someone is clearly performing rather than being genuine, how quickly do you notice \u2014 and what do you do?",
    skipLabel: "Skip",
  },
  {
    id: "sis5",
    dimension: "sis",
    text: "How comfortable are you saying no to people you care about?",
    skipLabel: "Skip",
  },
  {
    id: "sis6",
    dimension: "sis",
    text: "In a group, do people tend to look to you for direction, or do you prefer to follow and support?",
    skipLabel: "Skip",
  },
  {
    id: "sis7",
    dimension: "sis",
    text: "Describe a relationship where you gave more than you received. How long did it take you to see it?",
    skipLabel: "Skip",
  },
  {
    id: "sis8",
    dimension: "sis",
    text: "When you need help, do you ask for it easily, or do you try to figure it out alone?",
    skipLabel: "Skip",
  },
  {
    id: "sis9",
    dimension: "sis",
    text: "How do you usually feel after spending a long day with a lot of people?",
    skipLabel: "Skip",
  },
  {
    id: "sis10",
    dimension: "sis",
    text: "Describe a time you read someone completely wrong. What was the impact?",
    skipLabel: "Skip",
  },

  // EDI – Execution-Decision Integration
  {
    id: "edi1",
    dimension: "edi",
    text: "You have three urgent things to do today with time for only two. How do you decide?",
    skipLabel: "Skip",
  },
  {
    id: "edi2",
    dimension: "edi",
    text: "Describe your process from making a decision to actually acting on it. What happens in between?",
    skipLabel: "Skip",
  },
  {
    id: "edi3",
    dimension: "edi",
    text: "What\u2019s the last thing you decided to do but still haven\u2019t done \u2014 and why?",
    skipLabel: "Skip",
  },
  {
    id: "edi4",
    dimension: "edi",
    text: "How do you handle the gap between knowing what to do and actually doing it?",
    skipLabel: "Skip",
  },
  {
    id: "edi5",
    dimension: "edi",
    text: "When you\u2019re stuck on a task, what does \u2018stuck\u2019 actually look like for you \u2014 avoidance, overthinking, distraction?",
    skipLabel: "Skip",
  },
  {
    id: "edi6",
    dimension: "edi",
    text: "Have you ever made a fast decision that turned out to be your best one? What was it?",
    skipLabel: "Skip",
  },
  {
    id: "edi7",
    dimension: "edi",
    text: "Describe your relationship with deadlines \u2014 do they motivate you, stress you, or do you ignore them?",
    skipLabel: "Skip",
  },
  {
    id: "edi8",
    dimension: "edi",
    text: "When a plan falls apart, how quickly can you switch to a new direction?",
    skipLabel: "Skip",
  },
  {
    id: "edi9",
    dimension: "edi",
    text: "What does a productive day feel like for you \u2014 structured from morning, reactive to what comes, or something else?",
    skipLabel: "Skip",
  },
  {
    id: "edi10",
    dimension: "edi",
    text: "How do you feel when someone else makes a decision you were supposed to make?",
    skipLabel: "Skip",
  },
];

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildSessionQuestions(seed: number) {
  return DIMENSIONS.flatMap((dim) => {
    const pool = PERSONAL_QUESTIONS.filter((q) => q.dimension === dim);
    return seededShuffle(pool, seed + dim.charCodeAt(0)).slice(0, 6);
  });
}

const EMPTY_RESPONSE: MultimodalResponse = {
  scaleValue: 0,
  textResponse: "",
  audioBlob: null,
  videoBlob: null,
  transcript: "",
};

function computeDecisionForce(scores: Record<Dimension, number>): number {
  return scores.em + scores.rrm + scores.iai - (scores.sis + (10 - scores.edi));
}

function interpretForce(f: number): string {
  if (f >= 8) return "Decides confidently";
  if (f >= 6) return "Decides clearly";
  if (f >= 3) return "Cautious decision-maker";
  return "Hesitates";
}

function timeToDecision(em: number): string {
  if (em <= 3) return "Fast (low emotional drag)";
  if (em <= 5) return "Moderate";
  return "Slow (high emotional processing)";
}

function stabilityRating(iai: number): string {
  if (iai >= 6) return "Very Stable";
  if (iai >= 4) return "Stable";
  return "Variable";
}

type StoredAssessment = {
  id: string;
  userId: string;
  responses: bigint[];
  dimensionScores: {
    pm: number;
    em: number;
    rrm: number;
    iai: number;
    sis: number;
    edi: number;
  };
  archetype: string;
  decisionForceLevel: string;
  timestamp: bigint;
};

type TwinVersion = {
  id: string;
  userId: string;
  versionName: string;
  pm: number;
  em: number;
  rrm: number;
  iai: number;
  sis: number;
  edi: number;
  createdAt: bigint;
  notes: string;
};

type DecisionLogEntry = {
  id: string;
  userId: string;
  scenario: string;
  twinVersionUsed: string;
  decisionOutcome: string;
  actualOutcome: string;
  timestamp: bigint;
};

type JournalEntry = {
  id: string;
  userId: string;
  title: string;
  entryType: string;
  blobUrl: string;
  transcript: string;
  aiAnalysis: string;
  dimensionSignals: string;
  timestamp: bigint;
};

function GreenCard({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl p-6 ${className}`}
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {children}
    </div>
  );
}

const DIMENSION_DESCRIPTIONS: Record<string, string> = {
  pm: "This set explores how you naturally structure and map your world. High scorers are sharp situational readers; lower scorers tend to be more intuitive or spontaneous.",
  em: "These questions reveal how your emotions influence your choices. High scorers stay composed and use emotions as data; lower scorers may be more reactive.",
  rrm: "This dimension measures your appetite for risk and how you evaluate trade-offs. High scorers embrace calculated risk; lower scorers prefer certainty.",
  iai: "These questions probe your autonomy of thought \u2014 how independently you decide versus how much external voices shape you.",
  sis: "This set examines how social dynamics and interpersonal relationships shape your decisions. High scorers navigate complexity well; lower scorers may find it challenging.",
  edi: "These questions assess how quickly and decisively you act once a decision is made. High scorers are decisive executors; lower scorers may overthink before acting.",
};

const MAX_JOURNAL_SECONDS = 180;

function formatTimer(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

export function UserDashboardPage({ onNavigate }: Props) {
  const { identity, clear } = useInternetIdentity();
  const { actor } = useActor();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const [activeTab, setActiveTab] = useState<TabId>("twin");
  const [profile, setProfile] = useState<{
    name: string;
    country: string;
  } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // My Mind Twin
  const [assessments, setAssessments] = useState<StoredAssessment[]>([]);
  const [showAssessment, setShowAssessment] = useState(false);
  const [asmStep, setAsmStep] = useState(0);
  const [asmSeed] = useState(() => Date.now());
  const sessionQuestions = useMemo(
    () => buildSessionQuestions(asmSeed),
    [asmSeed],
  );
  const [asmResponses, setAsmResponses] = useState<MultimodalResponse[]>(
    Array(36)
      .fill(null)
      .map(() => ({ ...EMPTY_RESPONSE })),
  );
  const [asmSubmitting, setAsmSubmitting] = useState(false);

  // Twin Builder
  const [bVersionName, setBVersionName] = useState("My Twin");
  const [bSliders, setBSliders] = useState({
    pm: 5,
    em: 5,
    rrm: 5,
    iai: 5,
    sis: 5,
    edi: 5,
  });
  const [bNotes, setBNotes] = useState("");
  const [bSaving, setBSaving] = useState(false);

  // My Versions
  const [versions, setVersions] = useState<TwinVersion[]>([]);
  const [compareA, setCompareA] = useState<string | null>(null);
  const [compareB, setCompareB] = useState<string | null>(null);

  // Simulation Lab
  const [scenario, setScenario] = useState("");
  const [selectedVersionIds, setSelectedVersionIds] = useState<string[]>([]);
  const [simResult, setSimResult] = useState<
    | null
    | {
        name: string;
        force: number;
        interpretation: string;
        time: string;
        stability: string;
        confidence: string;
        cognitiveSignals: string[];
        scenarioInsight: string;
        scores: {
          pm: number;
          em: number;
          rrm: number;
          iai: number;
          sis: number;
          edi: number;
        };
      }[]
  >(null);
  const [simScenario, setSimScenario] = useState("");

  // Growth Path
  const [deltaCurrentId, setDeltaCurrentId] = useState<string | null>(null);
  const [deltaTargetId, setDeltaTargetId] = useState<string | null>(null);
  const [logScenario, setLogScenario] = useState("");
  const [logTwinUsed, setLogTwinUsed] = useState("");
  const [logDecisionOutcome, setLogDecisionOutcome] = useState("");
  const [logActualOutcome, setLogActualOutcome] = useState("");
  const [decisionLogs, setDecisionLogs] = useState<DecisionLogEntry[]>([]);
  const [logSaving, setLogSaving] = useState(false);

  // Journal
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [journalMode, setJournalMode] = useState<"text" | "audio" | "video">(
    "text",
  );
  const [journalText, setJournalText] = useState("");
  const [journalRecording, setJournalRecording] = useState(false);
  const [journalTimeLeft, setJournalTimeLeft] = useState(MAX_JOURNAL_SECONDS);
  const [journalBlob, setJournalBlob] = useState<Blob | null>(null);
  const [journalBlobUrl, setJournalBlobUrl] = useState<string | null>(null);
  const [journalTranscript, setJournalTranscript] = useState("");
  const [journalSaving, setJournalSaving] = useState(false);
  const [journalAnalyzingId, setJournalAnalyzingId] = useState<string | null>(
    null,
  );
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitleVal, setEditingTitleVal] = useState("");
  const [journalVideoEnabled, setJournalVideoEnabled] = useState(false);

  const journalMrRef = useRef<MediaRecorder | null>(null);
  const journalChunksRef = useRef<Blob[]>([]);
  const journalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const journalStreamRef = useRef<MediaStream | null>(null);
  const journalVideoRef = useRef<HTMLVideoElement | null>(null);
  const journalRecogRef = useRef<any>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    if (!isAuthenticated) {
      onNavigate("myDecisionTwin");
      return;
    }
    if (!actor) return;
    actor
      .getUserProfile()
      .then((opt) => {
        if (opt && "__kind__" in opt && opt.__kind__ === "Some") {
          const p = (
            opt as {
              __kind__: "Some";
              value: { name: string; country: string };
            }
          ).value;
          setProfile({ name: p.name, country: p.country });
        }
      })
      .catch(() => {});
    actor
      .isCallerAdmin()
      .then(setIsAdmin)
      .catch(() => {});
    loadAssessments();
    loadVersions();
    loadDecisionLogs();
  }, [isAuthenticated, actor]);

  useEffect(() => {
    if (activeTab === "journal" && actor) {
      loadJournalEntries();
    }
  }, [activeTab, actor]);

  useEffect(() => {
    return () => {
      if (journalTimerRef.current) clearInterval(journalTimerRef.current);
      if (journalStreamRef.current)
        for (const t of journalStreamRef.current.getTracks()) t.stop();
      if (journalRecogRef.current) journalRecogRef.current.stop();
    };
  }, []);

  const loadAssessments = async () => {
    if (!actor) return;
    const list = (await actor
      .getUserAssessments()
      .catch(() => [])) as StoredAssessment[];
    setAssessments(list);
    if (list.length > 0) {
      const latest = list[0].dimensionScores;
      setBSliders({
        pm: latest.pm,
        em: latest.em,
        rrm: latest.rrm,
        iai: latest.iai,
        sis: latest.sis,
        edi: latest.edi,
      });
    }
  };

  const loadVersions = async () => {
    if (!actor) return;
    const list = (await actor
      .getTwinVersions()
      .catch(() => [])) as TwinVersion[];
    setVersions(list);
  };

  const loadDecisionLogs = async () => {
    if (!actor) return;
    const list = (await actor
      .getDecisionLog()
      .catch(() => [])) as DecisionLogEntry[];
    setDecisionLogs(list);
  };

  const loadJournalEntries = async () => {
    if (!actor) return;
    const list = (await (actor as any)
      .getUserJournalEntries()
      .catch(() => [])) as JournalEntry[];
    setJournalEntries(list);
  };

  // ─── Assessment helpers ───────────────────────────────────────────────────
  const currentDim = DIMENSIONS[asmStep];
  const stepStart = asmStep * 6;
  const stepQs = sessionQuestions.slice(stepStart, stepStart + 6);
  const stepResponses = asmResponses.slice(stepStart, stepStart + 6);
  const allAnswered = stepResponses.every(
    (r) =>
      r.scaleValue > 0 ||
      r.textResponse.trim().length > 0 ||
      r.audioBlob !== null ||
      r.videoBlob !== null,
  );

  const handleAsmSubmit = async () => {
    if (!actor) return;
    setAsmSubmitting(true);
    const scaleValues = asmResponses.map((r) =>
      r.scaleValue > 0 ? r.scaleValue : 4,
    );
    const rawScores = computeScores(scaleValues);
    const scores = {
      pm: rawScores.pm,
      em: rawScores.em,
      rrm: rawScores.rrm,
      iai: rawScores.iai,
      sis: rawScores.sis,
      edi: rawScores.edi,
    };
    const archetype = classifyArchetype(scores);
    const forceLevel = classifyDecisionForce(scores);
    const bigintR = scaleValues.map((r) => BigInt(r));
    const textResponses = asmResponses.map(
      (r) => [r.textResponse, r.transcript].filter(Boolean).join(" | ") || "",
    );
    try {
      if ((actor as any).submitAssessmentWithText) {
        await (actor as any).submitAssessmentWithText(
          bigintR,
          textResponses,
          scores,
          archetype,
          forceLevel,
        );
      } else {
        await actor.submitAssessment(bigintR, scores, archetype, forceLevel);
      }
      await loadAssessments();
      toast.success("Assessment saved!");
      setShowAssessment(false);
      setAsmResponses(
        Array(36)
          .fill(null)
          .map(() => ({ ...EMPTY_RESPONSE })),
      );
      setAsmStep(0);
    } catch (_) {
      toast.error("Failed to save assessment. Please try again.");
    } finally {
      setAsmSubmitting(false);
    }
  };

  const handleSaveTwin = async () => {
    if (!actor || !bVersionName.trim()) return;
    setBSaving(true);
    try {
      await actor.saveTwinVersion(
        bVersionName,
        bSliders.pm,
        bSliders.em,
        bSliders.rrm,
        bSliders.iai,
        bSliders.sis,
        bSliders.edi,
        bNotes,
      );
      await loadVersions();
      setBVersionName("My Twin");
      setBNotes("");
    } catch (_) {
    } finally {
      setBSaving(false);
    }
  };

  const handleDeleteVersion = async (id: string) => {
    if (!actor) return;
    await actor.deleteTwinVersion(id).catch(() => {});
    await loadVersions();
  };

  const classifyScenario = (s: string): string => {
    const lower = s.toLowerCase();
    if (/job|career|promotion|resign|work|salary|startup/.test(lower))
      return "Career";
    if (/invest|money|financial|loan|stock|business|profit/.test(lower))
      return "Financial";
    if (/relation|partner|friend|family|marriage|breakup/.test(lower))
      return "Relationship";
    if (/create|design|art|music|write|idea|project/.test(lower))
      return "Creative";
    if (/risk|danger|uncertain|venture|gamble/.test(lower)) return "Risk-based";
    return "Personal";
  };

  const getCognitiveSignals = (v: TwinVersion): string[] => {
    const signals: string[] = [];
    if (v.em >= 6)
      signals.push(
        `High Emotional Processing (EM ${v.em.toFixed(1)}) means emotional responses will significantly influence this decision`,
      );
    else if (v.em <= 3)
      signals.push(
        `Low Emotional Processing (EM ${v.em.toFixed(1)}) allows analytical clarity without emotional interference`,
      );
    else
      signals.push(
        `Balanced Emotional Processing (EM ${v.em.toFixed(1)}) provides measured emotional input to decisions`,
      );
    if (v.iai >= 6)
      signals.push(
        `Strong Information Analysis (IAI ${v.iai.toFixed(1)}) drives thorough evaluation before committing`,
      );
    else if (v.iai <= 3)
      signals.push(
        `Limited Information Analysis (IAI ${v.iai.toFixed(1)}) favors intuitive leaps over detailed research`,
      );
    else
      signals.push(
        `Moderate Information Analysis (IAI ${v.iai.toFixed(1)}) balances research with action`,
      );
    if (v.sis >= 6)
      signals.push(
        `High Social Influence Sensitivity (SIS ${v.sis.toFixed(1)}) means external opinions shape outcomes`,
      );
    else if (v.sis <= 3)
      signals.push(
        `Low Social Influence Sensitivity (SIS ${v.sis.toFixed(1)}) enables independent judgment`,
      );
    if (v.edi >= 6)
      signals.push(
        `Strong Execution Drive (EDI ${v.edi.toFixed(1)}) converts decisions into action swiftly`,
      );
    else if (v.edi <= 3)
      signals.push(
        `Weak Execution Drive (EDI ${v.edi.toFixed(1)}) may delay follow-through`,
      );
    return signals.slice(0, 4);
  };

  const getScenarioInsight = (
    v: TwinVersion,
    scenarioType: string,
    force: number,
  ): string => {
    const strength =
      force >= 8
        ? "high decision force"
        : force >= 5
          ? "moderate decision force"
          : "low decision force";
    const insightMap: Record<string, string> = {
      Career: `For a career decision, this version's ${v.iai >= 5 ? "strong analytical ability" : "intuitive style"} will ${v.edi >= 5 ? "drive decisive action" : "require more time to commit"}. The ${v.sis <= 4 ? "low social sensitivity ensures an independent choice" : "high social sensitivity may lead to seeking validation"} before moving forward.`,
      Financial: `Financial scenarios demand clarity \u2014 this version's ${v.pm >= 5 ? "strong pattern mapping" : "pattern recognition gaps"} will ${force >= 6 ? "support confident risk assessment" : "create hesitation around uncertainty"}. ${v.rrm >= 5 ? "Rational reasoning is a key asset here" : "Emotional weight may cloud pure financial logic"}.`,
      Relationship: `In relational decisions, this version's EM of ${v.em.toFixed(1)} means ${v.em >= 5 ? "feelings take center stage, adding depth but slowing logic" : "rational thinking leads, which can miss emotional nuance"}. ${v.sis >= 5 ? "Social harmony is prioritized, making compromise more likely" : "Independence may override interpersonal compromise"}.`,
      Creative: `Creative decisions thrive on cognitive flexibility \u2014 this version's ${v.iai >= 5 ? "deep analytical capacity helps evaluate creative ideas rigorously" : "intuitive approach fuels spontaneous creative leaps"}. The ${strength} here means ${force >= 6 ? "creative ideas will be acted upon with conviction" : "creative blocks may arise from over-deliberation"}.`,
      "Risk-based": `Risk scenarios test the balance between courage and caution. This version's ${v.rrm >= 5 ? "strong rational reasoning provides calculated risk assessment" : "limited risk rationalization may lead to avoiding challenges"}. With ${v.edi >= 5 ? "strong execution drive, once committed the action follows through" : "moderate execution drive, partial commitments are possible"}.`,
      Personal: `For personal decisions, this version processes through a ${v.em >= 5 ? "primarily emotional lens, giving importance to feelings and values" : "primarily analytical lens, prioritizing logic over sentiment"}. ${v.iai >= 5 ? "Deep introspection guides the choice with clarity" : "Faster intuitive decisions may bypass deeper reflection"}.`,
    };
    return (
      insightMap[scenarioType] ||
      `This version shows ${strength} for this scenario, combining ${v.iai >= 5 ? "analytical depth" : "intuitive speed"} with ${v.edi >= 5 ? "strong execution drive" : "measured action pace"}.`
    );
  };

  const runSimulation = () => {
    const selected = versions.filter((v) => selectedVersionIds.includes(v.id));
    if (!selected.length) return;
    const scenarioType = classifyScenario(scenario);
    const results = selected.map((v) => {
      const scores = {
        pm: v.pm,
        em: v.em,
        rrm: v.rrm,
        iai: v.iai,
        sis: v.sis,
        edi: v.edi,
      };
      const force = computeDecisionForce(scores);
      const confidence = force >= 8 ? "High" : force >= 5 ? "Medium" : "Low";
      return {
        name: v.versionName,
        force: Math.round(force * 100) / 100,
        interpretation: interpretForce(force),
        time: timeToDecision(v.em),
        stability: stabilityRating(v.iai),
        confidence,
        cognitiveSignals: getCognitiveSignals(v),
        scenarioInsight: getScenarioInsight(v, scenarioType, force),
        scores,
      };
    });
    setSimScenario(scenario);
    setSimResult(results);
  };

  const handleLogDecision = async () => {
    if (!actor || !logScenario.trim()) return;
    setLogSaving(true);
    try {
      await actor.logDecision(
        logScenario,
        logTwinUsed,
        logDecisionOutcome,
        logActualOutcome,
      );
      setLogScenario("");
      setLogTwinUsed("");
      setLogDecisionOutcome("");
      setLogActualOutcome("");
      await loadDecisionLogs();
    } catch (_) {
    } finally {
      setLogSaving(false);
    }
  };

  // ─── Journal helpers ──────────────────────────────────────────────────────
  const stopJournalRecording = () => {
    if (journalMrRef.current && journalMrRef.current.state !== "inactive") {
      journalMrRef.current.stop();
    }
    if (journalTimerRef.current) clearInterval(journalTimerRef.current);
    if (journalStreamRef.current)
      for (const t of journalStreamRef.current.getTracks()) t.stop();
    if (journalRecogRef.current) journalRecogRef.current.stop();
    setJournalRecording(false);
    setJournalTimeLeft(MAX_JOURNAL_SECONDS);
  };

  const startJournalRecording = async (isVideo: boolean) => {
    try {
      const constraints = isVideo
        ? { audio: true, video: { width: 640, height: 480 } }
        : { audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      journalStreamRef.current = stream;
      if (isVideo && journalVideoRef.current) {
        journalVideoRef.current.srcObject = stream;
        journalVideoRef.current.muted = true;
        journalVideoRef.current.play();
      }
      journalChunksRef.current = [];
      const mr = new MediaRecorder(stream);
      journalMrRef.current = mr;
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) journalChunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const mime = isVideo ? "video/webm" : "audio/webm";
        const blob = new Blob(journalChunksRef.current, { type: mime });
        const url = URL.createObjectURL(blob);
        setJournalBlob(blob);
        setJournalBlobUrl(url);
        if (isVideo && journalVideoRef.current)
          journalVideoRef.current.srcObject = null;
      };
      mr.start();
      setJournalRecording(true);
      setJournalTimeLeft(MAX_JOURNAL_SECONDS);
      journalTimerRef.current = setInterval(() => {
        setJournalTimeLeft((prev) => {
          if (prev <= 1) {
            stopJournalRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.onresult = (event: any) => {
          let t = "";
          for (let i = 0; i < event.results.length; i++)
            t += event.results[i][0].transcript;
          setJournalTranscript(t);
        };
        rec.start();
        journalRecogRef.current = rec;
      }
    } catch (_) {
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const handleSaveJournalEntry = async () => {
    if (!actor) return;
    const now = new Date();
    const autoTitle = now.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    setJournalSaving(true);
    try {
      let uploadedUrl = "";
      if (journalBlob) {
        try {
          const config = await loadConfig();
          const agent = new HttpAgent({
            identity: identity ?? undefined,
            host: config.backend_host,
          });
          const client = new StorageClient(
            config.bucket_name,
            config.storage_gateway_url,
            config.backend_canister_id,
            config.project_id,
            agent,
          );
          const bytes = new Uint8Array(await journalBlob.arrayBuffer());
          const { hash } = await client.putFile(bytes);
          uploadedUrl = await client.getDirectURL(hash);
        } catch (_) {
          uploadedUrl = journalBlobUrl || "";
        }
      }
      const transcript =
        journalMode === "text" ? journalText : journalTranscript;
      const entryType =
        journalMode.charAt(0).toUpperCase() + journalMode.slice(1);
      await (actor as any).saveJournalEntry(
        autoTitle,
        entryType,
        uploadedUrl,
        transcript,
      );
      await loadJournalEntries();
      toast.success("Journal entry saved!");
      setJournalBlob(null);
      setJournalBlobUrl(null);
      setJournalTranscript("");
      setJournalText("");
    } catch (_) {
      toast.error("Failed to save journal entry.");
    } finally {
      setJournalSaving(false);
    }
  };

  const handleAnalyzeJournal = async (entry: JournalEntry) => {
    if (!actor) return;
    setJournalAnalyzingId(entry.id);
    try {
      const textToAnalyze = entry.transcript || entry.title;
      const result = await (actor as any).analyzeText(
        textToAnalyze,
        "Journal entry for mind twin training",
      );
      await (actor as any).updateJournalEntry(
        entry.id,
        entry.title,
        result,
        "",
      );
      await loadJournalEntries();
      toast.success("Analysis complete!");
    } catch (_) {
      toast.error("Analysis failed.");
    } finally {
      setJournalAnalyzingId(null);
    }
  };

  const handleDeleteJournal = async (id: string) => {
    if (!actor || !confirm("Delete this journal entry?")) return;
    await (actor as any).deleteJournalEntry(id).catch(() => {});
    await loadJournalEntries();
  };

  const handleRenameJournal = async (entry: JournalEntry) => {
    if (!actor || !editingTitleVal.trim()) return;
    await (actor as any)
      .updateJournalEntry(
        entry.id,
        editingTitleVal,
        entry.aiAnalysis,
        entry.dimensionSignals,
      )
      .catch(() => {});
    setEditingTitleId(null);
    await loadJournalEntries();
  };

  const latestScores =
    assessments.length > 0 ? assessments[0].dimensionScores : null;
  const versionA = versions.find((v) => v.id === compareA);
  const versionB = versions.find((v) => v.id === compareB);
  const currentTwin = versions.find((v) => v.id === deltaCurrentId);
  const targetTwin = versions.find((v) => v.id === deltaTargetId);

  function coachingTip(dim: Dimension, delta: number): string {
    if (Math.abs(delta) < 0.3)
      return "On track. Maintain current behaviour patterns.";
    const dir = delta > 0 ? "increase" : "reduce";
    const tips: Record<Dimension, { increase: string; reduce: string }> = {
      pm: {
        increase: "Build a daily decision log habit.",
        reduce: "Trust your process more; reduce over-planning.",
      },
      em: {
        increase: "Practice mindfulness before decisions.",
        reduce: "Build a pause-and-label protocol to reduce reactivity.",
      },
      rrm: {
        increase: "Add pre-mortem analysis to major decisions.",
        reduce: "Embrace more calculated risk; define acceptable loss.",
      },
      iai: {
        increase: "Commit to 3 data points before deciding.",
        reduce: "Reduce analysis paralysis; set decision time limits.",
      },
      sis: {
        increase: "Consult one stakeholder earlier per decision.",
        reduce: "Build independent decision confidence.",
      },
      edi: {
        increase: "Set firm decision deadlines and stick to them.",
        reduce: "Delegate more; focus on highest-leverage calls.",
      },
    };
    return tips[dim][dir];
  }

  const gold = "#C8A24A";

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#0A1F14", color: "white" }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#1B4332",
          borderBottom: "1px solid rgba(200,162,74,0.2)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate("myDecisionTwin")}
              className="text-white/50 hover:text-white text-sm transition-colors"
              data-ocid="dashboard.back.button"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-white font-bold">
                My Decision Twin Dashboard
              </h1>
              {profile && (
                <p className="text-white/50 text-xs">
                  {profile.name || ""}{" "}
                  {profile.country ? `\u00b7 ${profile.country}` : ""}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                type="button"
                onClick={() => onNavigate("adminDashboard")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{
                  backgroundColor: "rgba(200,162,74,0.15)",
                  color: gold,
                  border: "1px solid rgba(200,162,74,0.3)",
                }}
                data-ocid="dashboard.admin.button"
              >
                Admin Panel
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                clear();
                onNavigate("landing");
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white border border-white/20 hover:border-white/40 transition-colors"
              data-ocid="dashboard.signout.button"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto pb-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all"
                style={{
                  borderBottomColor:
                    activeTab === tab.id ? gold : "transparent",
                  color: activeTab === tab.id ? gold : "rgba(255,255,255,0.5)",
                }}
                data-ocid={`dashboard.${tab.id}.tab`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* ─── TAB 1: My Mind Twin ─────────────────────────────────── */}
        {activeTab === "twin" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">My Mind Twin</h2>
              <button
                type="button"
                onClick={() => {
                  setShowAssessment(!showAssessment);
                  setAsmStep(0);
                  setAsmResponses(
                    Array(36)
                      .fill(null)
                      .map(() => ({ ...EMPTY_RESPONSE })),
                  );
                }}
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: gold, color: "#1B4332" }}
                data-ocid="twin.assessment.button"
              >
                {showAssessment ? "Cancel" : "Take New Assessment"}
              </button>
            </div>

            {showAssessment && (
              <GreenCard className="mb-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: gold }}
                    >
                      Dimension {asmStep + 1} of 6:{" "}
                      {DIMENSION_LABELS[currentDim]}
                    </span>
                    <span className="text-white/40 text-xs">
                      Step {asmStep + 1}/6
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${((asmStep + 1) / 6) * 100}%`,
                        backgroundColor: gold,
                      }}
                    />
                  </div>
                  <div
                    className="mt-4 mb-5 p-4 rounded-xl"
                    style={{
                      backgroundColor: "rgba(200,162,74,0.07)",
                      border: "1px solid rgba(200,162,74,0.15)",
                    }}
                  >
                    <p className="text-white/75 text-sm leading-relaxed">
                      {DIMENSION_DESCRIPTIONS[currentDim]}
                    </p>
                    <div className="flex items-center justify-between mt-3 px-1">
                      <span
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      >
                        1 = Not at all like me
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "rgba(200,162,74,0.7)" }}
                      >
                        4 = Somewhat like me
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      >
                        7 = Very much like me
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {stepQs.map((q, qi) => {
                    const idx = stepStart + qi;
                    return (
                      <MultimodalInputWidget
                        key={q.id}
                        question={q.text}
                        dimensionLabel={DIMENSION_LABELS[currentDim]}
                        questionNumber={idx + 1}
                        currentResponse={asmResponses[idx]}
                        skipLabel={q.skipLabel}
                        onResponse={(resp) => {
                          setAsmResponses((prev) => {
                            const next = [...prev];
                            next[idx] = resp;
                            return next;
                          });
                        }}
                      />
                    );
                  })}
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    disabled={asmStep === 0}
                    onClick={() => setAsmStep((s) => s - 1)}
                    className="px-4 py-2 rounded-lg text-sm border border-white/20 text-white/60 disabled:opacity-30"
                    data-ocid="assessment.back.button"
                  >
                    ← Back
                  </button>
                  {asmStep < 5 ? (
                    <button
                      type="button"
                      disabled={!allAnswered}
                      onClick={() => setAsmStep((s) => s + 1)}
                      className="px-6 py-2 rounded-lg text-sm font-bold disabled:opacity-40"
                      style={{ backgroundColor: gold, color: "#1B4332" }}
                      data-ocid="assessment.next.button"
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={!allAnswered || asmSubmitting}
                      onClick={handleAsmSubmit}
                      className="px-6 py-2 rounded-lg text-sm font-bold disabled:opacity-40"
                      style={{ backgroundColor: gold, color: "#1B4332" }}
                      data-ocid="assessment.submit.button"
                    >
                      {asmSubmitting ? "Saving..." : "Submit Assessment"}
                    </button>
                  )}
                </div>
              </GreenCard>
            )}

            {!showAssessment &&
              (latestScores ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <GreenCard>
                    <h3 className="font-bold mb-4">Your HDA-DCFM Profile</h3>
                    <DynamicRadarChart
                      scores={latestScores as Record<Dimension, number>}
                    />
                  </GreenCard>
                  <GreenCard>
                    <h3 className="font-bold mb-4">Dimension Scores</h3>
                    <div className="space-y-3">
                      {DIMENSIONS.map((dim) => (
                        <div key={dim}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-white/70">
                              {DIMENSION_SHORT[dim]} \u2014{" "}
                              {DIMENSION_LABELS[dim]}
                            </span>
                            <span style={{ color: gold }} className="font-bold">
                              {(
                                latestScores[
                                  dim as keyof typeof latestScores
                                ] as number
                              ).toFixed(2)}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-white/10">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${((latestScores[dim as keyof typeof latestScores] as number) / 7) * 100}%`,
                                backgroundColor: gold,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </GreenCard>
                </div>
              ) : (
                <GreenCard className="text-center py-12">
                  <div className="text-4xl mb-4">🧠</div>
                  <h3 className="font-bold text-lg mb-2">No Assessment Yet</h3>
                  <p className="text-white/50 text-sm mb-4">
                    Take your first HDA-DCFM assessment to generate your base
                    twin profile.
                  </p>
                </GreenCard>
              ))}

            {!showAssessment && assessments.length > 1 && (
              <GreenCard className="mt-6">
                <h3 className="font-bold mb-4">Assessment History</h3>
                <div className="space-y-3">
                  {assessments.slice(0, 5).map((a, i) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between text-sm"
                      style={{
                        borderBottom:
                          i < Math.min(4, assessments.length - 1)
                            ? "1px solid rgba(255,255,255,0.07)"
                            : undefined,
                        paddingBottom: 8,
                      }}
                    >
                      <div>
                        <span className="font-medium">{a.archetype}</span>
                        <span className="text-white/40 ml-2">
                          {new Date(
                            Number(a.timestamp) / 1_000_000,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <span style={{ color: gold }} className="text-xs">
                        {a.decisionForceLevel}
                      </span>
                    </div>
                  ))}
                </div>
              </GreenCard>
            )}
          </div>
        )}

        {/* ─── TAB 2: Twin Builder ───────────────────────────────────── */}
        {activeTab === "builder" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-6">Twin Builder</h2>
              {!latestScores && (
                <div
                  className="mb-4 px-4 py-3 rounded-xl text-sm"
                  style={{
                    backgroundColor: "rgba(200,162,74,0.1)",
                    border: "1px solid rgba(200,162,74,0.25)",
                    color: gold,
                  }}
                >
                  Take an assessment first to seed your base values.
                </div>
              )}
              <GreenCard>
                <div className="mb-4">
                  <label
                    className="block text-white/70 text-sm font-medium mb-1"
                    htmlFor="vname"
                  >
                    Version Name
                  </label>
                  <input
                    id="vname"
                    type="text"
                    value={bVersionName}
                    onChange={(e) => setBVersionName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                    placeholder="e.g. Bold Me, Calm Me, Future Me"
                    data-ocid="builder.version_name.input"
                  />
                </div>
                <div className="space-y-5 mb-5">
                  {DIMENSIONS.map((dim) => (
                    <div key={dim}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white/70">
                          {DIMENSION_SHORT[dim]} \u2014 {DIMENSION_LABELS[dim]}
                        </span>
                        <span style={{ color: gold }} className="font-bold">
                          {bSliders[dim].toFixed(1)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="7"
                        step="0.1"
                        value={bSliders[dim]}
                        onChange={(e) =>
                          setBSliders((prev) => ({
                            ...prev,
                            [dim]: Number.parseFloat(e.target.value),
                          }))
                        }
                        className="w-full accent-yellow-500"
                        data-ocid={`builder.${dim}.input`}
                      />
                      {latestScores && (
                        <div className="text-xs text-white/30 mt-1">
                          Base:{" "}
                          {(
                            latestScores[
                              dim as keyof typeof latestScores
                            ] as number
                          ).toFixed(2)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mb-5">
                  <label
                    className="block text-white/70 text-sm font-medium mb-1"
                    htmlFor="bnotes"
                  >
                    Notes (optional)
                  </label>
                  <textarea
                    id="bnotes"
                    value={bNotes}
                    onChange={(e) => setBNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none resize-none"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                    rows={2}
                    placeholder="What does this version represent?"
                    data-ocid="builder.notes.textarea"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSaveTwin}
                  disabled={bSaving || !bVersionName.trim()}
                  className="w-full py-3 rounded-xl font-bold text-sm disabled:opacity-50"
                  style={{ backgroundColor: gold, color: "#1B4332" }}
                  data-ocid="builder.save.button"
                >
                  {bSaving ? "Saving..." : "Save Twin Version"}
                </button>
              </GreenCard>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Simulation Preview</h3>
              {latestScores ? (
                <GreenCard>
                  <div
                    className="mb-3 text-xs font-semibold"
                    style={{ color: gold, letterSpacing: "0.08em" }}
                  >
                    DCFM DECISION FORCE
                  </div>
                  {(() => {
                    const f = computeDecisionForce(
                      bSliders as Record<Dimension, number>,
                    );
                    return (
                      <>
                        <div className="text-4xl font-bold text-white mb-1">
                          {f.toFixed(2)}
                        </div>
                        <div className="text-white/60 text-sm mb-4">
                          {interpretForce(f)}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div
                            className="rounded-xl p-3"
                            style={{
                              backgroundColor: "rgba(255,255,255,0.05)",
                            }}
                          >
                            <div className="text-xs text-white/40 mb-1">
                              Time to Decision
                            </div>
                            <div className="text-sm font-semibold">
                              {timeToDecision(bSliders.em)}
                            </div>
                          </div>
                          <div
                            className="rounded-xl p-3"
                            style={{
                              backgroundColor: "rgba(255,255,255,0.05)",
                            }}
                          >
                            <div className="text-xs text-white/40 mb-1">
                              Stability
                            </div>
                            <div className="text-sm font-semibold">
                              {stabilityRating(bSliders.iai)}
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </GreenCard>
              ) : (
                <GreenCard>
                  <div className="text-center py-6" style={{ color: gold }}>
                    Take an assessment first to see your Simulation Preview.
                  </div>
                </GreenCard>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 3: My Versions ──────────────────────────────────── */}
        {activeTab === "versions" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">My Twin Versions</h2>
              <button
                type="button"
                onClick={() => setActiveTab("builder")}
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={{
                  backgroundColor: "rgba(200,162,74,0.15)",
                  color: gold,
                  border: "1px solid rgba(200,162,74,0.3)",
                }}
                data-ocid="versions.create.button"
              >
                + Create New
              </button>
            </div>
            {versions.length === 0 ? (
              <GreenCard className="text-center py-12">
                <div className="text-4xl mb-3">📂</div>
                <p className="text-white/50">
                  No versions yet. Use Twin Builder to create your first
                  version.
                </p>
              </GreenCard>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                  {versions.map((v, vi) => (
                    <GreenCard key={v.id} data-ocid={`versions.item.${vi + 1}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold">{v.versionName}</h3>
                          <p className="text-white/40 text-xs mt-0.5">
                            {new Date(
                              Number(v.createdAt) / 1_000_000,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteVersion(v.id)}
                          className="text-white/30 hover:text-red-400 text-xs"
                          data-ocid={`versions.delete_button.${vi + 1}`}
                        >
                          Delete
                        </button>
                      </div>
                      <div className="space-y-2 mb-3">
                        {DIMENSIONS.map((dim) => (
                          <div key={dim} className="flex items-center gap-2">
                            <span className="text-white/40 text-xs w-8">
                              {DIMENSION_SHORT[dim]}
                            </span>
                            <div className="flex-1 h-1.5 rounded-full bg-white/10">
                              <div
                                className="h-1.5 rounded-full"
                                style={{
                                  width: `${((v[dim as keyof TwinVersion] as number) / 7) * 100}%`,
                                  backgroundColor: gold,
                                }}
                              />
                            </div>
                            <span className="text-xs text-white/50">
                              {(v[dim as keyof TwinVersion] as number).toFixed(
                                1,
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                      {v.notes && (
                        <p className="text-white/40 text-xs italic">
                          {v.notes}
                        </p>
                      )}
                    </GreenCard>
                  ))}
                </div>

                {versions.length >= 2 && (
                  <GreenCard>
                    <h3 className="font-bold mb-4">Compare Two Versions</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <select
                        value={compareA || ""}
                        onChange={(e) => setCompareA(e.target.value)}
                        className="px-3 py-2 rounded-xl text-sm text-white outline-none"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.07)",
                          border: "1px solid rgba(255,255,255,0.15)",
                        }}
                        data-ocid="versions.compare_a.select"
                      >
                        <option value="" style={{ backgroundColor: "#1B4332" }}>
                          Version A
                        </option>
                        {versions.map((v) => (
                          <option
                            key={v.id}
                            value={v.id}
                            style={{ backgroundColor: "#1B4332" }}
                          >
                            {v.versionName}
                          </option>
                        ))}
                      </select>
                      <select
                        value={compareB || ""}
                        onChange={(e) => setCompareB(e.target.value)}
                        className="px-3 py-2 rounded-xl text-sm text-white outline-none"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.07)",
                          border: "1px solid rgba(255,255,255,0.15)",
                        }}
                        data-ocid="versions.compare_b.select"
                      >
                        <option value="" style={{ backgroundColor: "#1B4332" }}>
                          Version B
                        </option>
                        {versions.map((v) => (
                          <option
                            key={v.id}
                            value={v.id}
                            style={{ backgroundColor: "#1B4332" }}
                          >
                            {v.versionName}
                          </option>
                        ))}
                      </select>
                    </div>
                    {versionA && versionB && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <p
                            className="text-center text-sm font-semibold mb-3"
                            style={{ color: gold }}
                          >
                            {versionA.versionName}
                          </p>
                          <DynamicRadarChart
                            scores={
                              {
                                pm: versionA.pm,
                                em: versionA.em,
                                rrm: versionA.rrm,
                                iai: versionA.iai,
                                sis: versionA.sis,
                                edi: versionA.edi,
                              } as Record<Dimension, number>
                            }
                          />
                        </div>
                        <div>
                          <p
                            className="text-center text-sm font-semibold mb-3"
                            style={{ color: gold }}
                          >
                            {versionB.versionName}
                          </p>
                          <DynamicRadarChart
                            scores={
                              {
                                pm: versionB.pm,
                                em: versionB.em,
                                rrm: versionB.rrm,
                                iai: versionB.iai,
                                sis: versionB.sis,
                                edi: versionB.edi,
                              } as Record<Dimension, number>
                            }
                          />
                        </div>
                      </div>
                    )}
                  </GreenCard>
                )}
              </>
            )}
          </div>
        )}

        {/* ─── TAB 4: Simulation Lab ──────────────────────────────── */}
        {activeTab === "simlab" && (
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold mb-6">Simulation Lab</h2>
            <GreenCard className="mb-6">
              <label
                className="block text-white/70 text-sm font-medium mb-2"
                htmlFor="scenario"
              >
                Describe a decision scenario
              </label>
              <textarea
                id="scenario"
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                placeholder="e.g. I need to decide whether to leave my job for a startup opportunity with higher risk but bigger reward..."
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none resize-none"
                style={{
                  backgroundColor: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
                rows={4}
                data-ocid="simlab.scenario.textarea"
              />
            </GreenCard>

            {versions.length === 0 ? (
              <div className="text-white/40 text-sm mb-6">
                Create twin versions in the Twin Builder first.
              </div>
            ) : (
              <GreenCard className="mb-6">
                <p className="text-white/70 text-sm font-medium mb-3">
                  Select up to 3 versions to simulate:
                </p>
                <div className="space-y-2">
                  {versions.map((v) => (
                    <label
                      key={v.id}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedVersionIds.includes(v.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            if (selectedVersionIds.length < 3)
                              setSelectedVersionIds((prev) => [...prev, v.id]);
                          } else
                            setSelectedVersionIds((prev) =>
                              prev.filter((id) => id !== v.id),
                            );
                        }}
                        className="accent-yellow-500"
                      />
                      <span className="text-sm text-white/80">
                        {v.versionName}
                      </span>
                    </label>
                  ))}
                </div>
              </GreenCard>
            )}

            <button
              type="button"
              onClick={runSimulation}
              disabled={!scenario.trim() || selectedVersionIds.length === 0}
              className="mb-8 px-8 py-3 rounded-xl font-bold text-sm disabled:opacity-40"
              style={{ backgroundColor: gold, color: "#1B4332" }}
              data-ocid="simlab.run.button"
            >
              Run Simulation
            </button>

            {simResult && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold">Simulation Results</h3>
                <div
                  className="rounded-2xl px-6 py-4"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(200,162,74,0.15) 0%, rgba(200,162,74,0.05) 100%)",
                    border: "1px solid rgba(200,162,74,0.35)",
                  }}
                >
                  <div className="text-xs text-white/40 uppercase tracking-widest mb-1">
                    Scenario Analysed
                  </div>
                  <p className="text-white/90 text-sm italic leading-relaxed">
                    &ldquo;{simScenario}&rdquo;
                  </p>
                </div>

                {simResult.map((r, idx) => {
                  const forceColor =
                    r.force >= 8 ? "#4ade80" : r.force >= 5 ? gold : "#f87171";
                  const fillPct = Math.min(
                    100,
                    Math.max(0, (r.force / 15) * 100),
                  );
                  return (
                    <div
                      key={r.name}
                      className="rounded-2xl overflow-hidden"
                      style={{ border: "1px solid rgba(255,255,255,0.12)" }}
                      data-ocid={`simlab.item.${idx + 1}`}
                    >
                      <div
                        className="px-6 py-4 flex items-center justify-between"
                        style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                      >
                        <div>
                          <div className="text-xs text-white/40 uppercase tracking-widest mb-0.5">
                            Version {idx + 1}
                          </div>
                          <h4 className="text-lg font-bold">{r.name}</h4>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-white/40 mb-0.5">
                            Decision Force
                          </div>
                          <span
                            className="text-3xl font-black"
                            style={{ color: forceColor }}
                          >
                            {r.force.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div
                        className="px-6 py-5 space-y-5"
                        style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {r.force >= 8 ? "⚡" : r.force >= 5 ? "🎯" : "⏸️"}
                          </span>
                          <span
                            className="text-base font-bold"
                            style={{ color: forceColor }}
                          >
                            {r.interpretation}
                          </span>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-white/40 mb-1">
                            <span>Decision Force Meter</span>
                            <span>{r.force.toFixed(1)} / 15</span>
                          </div>
                          <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-3 rounded-full"
                              style={{
                                width: `${fillPct}%`,
                                background: `linear-gradient(90deg, ${forceColor}99, ${forceColor})`,
                              }}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            {
                              icon: "🧩",
                              label: "Decision Outcome",
                              value: r.interpretation,
                            },
                            {
                              icon: "⏱️",
                              label: "Time to Decision",
                              value: r.time,
                            },
                            {
                              icon: "🔒",
                              label: "Identity Stability",
                              value: r.stability,
                            },
                            {
                              icon: "💎",
                              label: "Confidence Level",
                              value: r.confidence,
                            },
                          ].map((m) => (
                            <div
                              key={m.label}
                              className="rounded-xl p-3"
                              style={{
                                backgroundColor: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.07)",
                              }}
                            >
                              <div className="text-lg mb-1">{m.icon}</div>
                              <div className="text-xs text-white/40 mb-0.5">
                                {m.label}
                              </div>
                              <div className="text-sm font-semibold text-white/90">
                                {m.value}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div>
                          <div
                            className="text-xs font-bold uppercase tracking-widest mb-2"
                            style={{ color: gold }}
                          >
                            Cognitive Signals
                          </div>
                          <ul className="space-y-1.5">
                            {r.cognitiveSignals.map((sig) => (
                              <li
                                key={sig.slice(0, 30)}
                                className="flex items-start gap-2 text-sm text-white/70"
                              >
                                <span
                                  className="mt-0.5 text-xs"
                                  style={{ color: gold }}
                                >
                                  ▸
                                </span>
                                <span>{sig}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div
                          className="rounded-xl p-4"
                          style={{
                            backgroundColor: "rgba(27,67,50,0.6)",
                            border: "1px solid rgba(200,162,74,0.2)",
                          }}
                        >
                          <div
                            className="text-xs font-bold uppercase tracking-widest mb-2"
                            style={{ color: gold }}
                          >
                            Scenario Insight
                          </div>
                          <p className="text-sm text-white/80 leading-relaxed">
                            {r.scenarioInsight}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {simResult.length >= 2 &&
                  (() => {
                    const sorted = [...simResult].sort(
                      (a, b) => b.force - a.force,
                    );
                    const best = sorted[0];
                    const worst = sorted[sorted.length - 1];
                    const delta = best.force - worst.force;
                    return (
                      <div
                        className="rounded-2xl p-6"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(200,162,74,0.1) 0%, rgba(27,67,50,0.4) 100%)",
                          border: "1px solid rgba(200,162,74,0.3)",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xl">👑</span>
                          <h4 className="font-bold text-base">
                            Which version handles this best?
                          </h4>
                        </div>
                        <div className="space-y-3 mb-5">
                          {sorted.map((r) => {
                            const pct = Math.min(
                              100,
                              Math.max(0, (r.force / 15) * 100),
                            );
                            const isTop = r.name === best.name;
                            return (
                              <div key={r.name}>
                                <div className="flex justify-between text-sm mb-1">
                                  <span
                                    className={
                                      isTop ? "font-bold" : "text-white/70"
                                    }
                                  >
                                    {isTop ? "👑 " : ""}
                                    {r.name}
                                  </span>
                                  <span
                                    className="text-xs font-bold"
                                    style={{
                                      color: isTop
                                        ? gold
                                        : "rgba(255,255,255,0.4)",
                                    }}
                                  >
                                    {r.force.toFixed(1)}
                                  </span>
                                </div>
                                <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                                  <div
                                    className="h-2.5 rounded-full"
                                    style={{
                                      width: `${pct}%`,
                                      background: isTop
                                        ? `linear-gradient(90deg, ${gold}88, ${gold})`
                                        : "rgba(255,255,255,0.2)",
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="text-sm text-white/80 leading-relaxed">
                          <span className="font-bold" style={{ color: gold }}>
                            {best.name}
                          </span>{" "}
                          leads with a Decision Force of{" "}
                          <span className="font-bold">
                            {best.force.toFixed(1)}
                          </span>
                          {delta > 2
                            ? `, significantly ahead by ${delta.toFixed(1)} points`
                            : ""}
                          .{" "}
                          {delta > 3
                            ? `The gap between ${best.name} and ${worst.name} is substantial \u2014 consider what beliefs or habits are holding your ${worst.name} back from this level of decisiveness.`
                            : `The versions are close \u2014 small cognitive shifts could bring ${worst.name} to match ${best.name}\u2019s decision clarity.`}
                        </div>
                      </div>
                    );
                  })()}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 5: Growth Path ─────────────────────────────────── */}
        {activeTab === "growth" && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold">Growth Path</h2>
            <GreenCard>
              <h3 className="font-bold mb-4">Twin Delta Engine</h3>
              <p className="text-white/50 text-sm mb-4">
                Select your Current Me and your Target version to see the gap.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label
                    className="text-white/60 text-xs mb-1 block"
                    htmlFor="dcurrent"
                  >
                    Current Me
                  </label>
                  <select
                    id="dcurrent"
                    value={deltaCurrentId || ""}
                    onChange={(e) => setDeltaCurrentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                    data-ocid="growth.current.select"
                  >
                    <option value="" style={{ backgroundColor: "#1B4332" }}>
                      Select version
                    </option>
                    {versions.map((v) => (
                      <option
                        key={v.id}
                        value={v.id}
                        style={{ backgroundColor: "#1B4332" }}
                      >
                        {v.versionName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="text-white/60 text-xs mb-1 block"
                    htmlFor="dtarget"
                  >
                    Target Me
                  </label>
                  <select
                    id="dtarget"
                    value={deltaTargetId || ""}
                    onChange={(e) => setDeltaTargetId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-sm text-white outline-none"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                    data-ocid="growth.target.select"
                  >
                    <option value="" style={{ backgroundColor: "#1B4332" }}>
                      Select version
                    </option>
                    {versions.map((v) => (
                      <option
                        key={v.id}
                        value={v.id}
                        style={{ backgroundColor: "#1B4332" }}
                      >
                        {v.versionName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {currentTwin && targetTwin && (
                <div className="space-y-4">
                  {DIMENSIONS.map((dim) => {
                    const delta =
                      (targetTwin[dim as keyof TwinVersion] as number) -
                      (currentTwin[dim as keyof TwinVersion] as number);
                    const pct = Math.abs(
                      Math.round(
                        (delta /
                          (currentTwin[dim as keyof TwinVersion] as number)) *
                          100,
                      ),
                    );
                    return (
                      <div
                        key={dim}
                        className="rounded-xl p-4"
                        style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm">
                            {DIMENSION_SHORT[dim]} \u2014{" "}
                            {DIMENSION_LABELS[dim]}
                          </span>
                          <span
                            className="text-sm font-bold"
                            style={{
                              color:
                                delta > 0
                                  ? "#4ade80"
                                  : delta < 0
                                    ? "#f87171"
                                    : gold,
                            }}
                          >
                            {delta > 0
                              ? `\u2191 +${pct}%`
                              : delta < 0
                                ? `\u2193 -${pct}%`
                                : "= On Track"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-white/50 mb-2">
                          <span>
                            Current:{" "}
                            {(
                              currentTwin[dim as keyof TwinVersion] as number
                            ).toFixed(1)}
                          </span>
                          <span>\u2192</span>
                          <span>
                            Target:{" "}
                            {(
                              targetTwin[dim as keyof TwinVersion] as number
                            ).toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs" style={{ color: gold }}>
                          💡 {coachingTip(dim, delta)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </GreenCard>

            {/* Decision Log */}
            <GreenCard>
              <h3 className="font-bold mb-4">Decision Log</h3>
              <p className="text-white/50 text-sm mb-4">
                Log real decisions and track how your twin model performs over
                time.
              </p>
              <div className="space-y-3 mb-4">
                <textarea
                  value={logScenario}
                  onChange={(e) => setLogScenario(e.target.value)}
                  placeholder="Decision scenario..."
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none resize-none"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                  rows={2}
                  data-ocid="growth.log_scenario.textarea"
                />
                <input
                  type="text"
                  value={logTwinUsed}
                  onChange={(e) => setLogTwinUsed(e.target.value)}
                  placeholder="Twin version used (e.g. Bold Me)"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                  data-ocid="growth.log_twin.input"
                />
                <input
                  type="text"
                  value={logDecisionOutcome}
                  onChange={(e) => setLogDecisionOutcome(e.target.value)}
                  placeholder="Predicted/planned outcome"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                  data-ocid="growth.log_outcome.input"
                />
                <input
                  type="text"
                  value={logActualOutcome}
                  onChange={(e) => setLogActualOutcome(e.target.value)}
                  placeholder="Actual outcome (fill in after the fact)"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                  data-ocid="growth.log_actual.input"
                />
              </div>
              <button
                type="button"
                onClick={handleLogDecision}
                disabled={logSaving || !logScenario.trim()}
                className="px-6 py-2 rounded-xl font-bold text-sm disabled:opacity-40"
                style={{ backgroundColor: gold, color: "#1B4332" }}
                data-ocid="growth.log.button"
              >
                {logSaving ? "Saving..." : "Log Decision"}
              </button>

              {decisionLogs.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-sm mb-3">Past Decisions</h4>
                  <div className="space-y-3">
                    {decisionLogs.slice(0, 10).map((log, li) => (
                      <div
                        key={log.id}
                        className="rounded-xl p-4"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.07)",
                        }}
                        data-ocid={`growth.log.item.${li + 1}`}
                      >
                        <p className="text-white text-sm font-medium mb-1">
                          {log.scenario}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs text-white/40">
                          <span>
                            Twin:{" "}
                            <span className="text-white/60">
                              {log.twinVersionUsed || "\u2014"}
                            </span>
                          </span>
                          <span>
                            Predicted:{" "}
                            <span className="text-white/60">
                              {log.decisionOutcome || "\u2014"}
                            </span>
                          </span>
                          <span>
                            Actual:{" "}
                            <span style={{ color: gold }}>
                              {log.actualOutcome || "Pending"}
                            </span>
                          </span>
                          <span>
                            {new Date(
                              Number(log.timestamp) / 1_000_000,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GreenCard>
          </div>
        )}

        {/* ─── TAB 6: My Day Journal ─────────────────────────────── */}
        {activeTab === "journal" && (
          <div className="space-y-6">
            {/* Hero Header */}
            <div
              className="rounded-2xl px-8 py-10 text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(200,162,74,0.12) 0%, rgba(27,67,50,0.5) 100%)",
                border: "1px solid rgba(200,162,74,0.25)",
              }}
            >
              <div className="text-4xl mb-3">📓</div>
              <h2 className="text-2xl font-bold mb-2">
                Tell Me About Your Day
              </h2>
              <p className="text-white/60 text-sm max-w-lg mx-auto leading-relaxed">
                Share anything \u2014 what happened, how you felt, what
                you\u2019re thinking. Your twin learns from every entry. No
                filters needed.
              </p>
            </div>

            {/* Recording Panel */}
            <GreenCard>
              {/* Mode switcher */}
              <div
                className="flex gap-1 p-1 rounded-xl mb-5 w-fit"
                style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
              >
                {(["text", "audio", "video"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setJournalMode(m);
                      if (m === "video") setJournalVideoEnabled(true);
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                    style={{
                      backgroundColor: journalMode === m ? gold : "transparent",
                      color:
                        journalMode === m ? "#1B4332" : "rgba(255,255,255,0.4)",
                    }}
                    data-ocid={`journal.${m}_mode.toggle`}
                  >
                    {m === "text"
                      ? "📝 Write"
                      : m === "audio"
                        ? "🎙 Audio"
                        : "🎥 Video"}
                  </button>
                ))}
              </div>

              {journalMode === "video" && !journalVideoEnabled && (
                <div
                  className="mb-4 px-4 py-3 rounded-xl text-sm"
                  style={{
                    backgroundColor: "rgba(200,162,74,0.1)",
                    border: "1px solid rgba(200,162,74,0.25)",
                    color: gold,
                  }}
                >
                  💡 Video gives your twin more signals to work with \u2014
                  facial expressions, micro-emotions, energy levels. Highly
                  recommended.
                </div>
              )}

              {/* Text mode */}
              {journalMode === "text" && (
                <div>
                  <textarea
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    placeholder="How was your day? What decisions did you make? What did you feel? What\u2019s on your mind?"
                    className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none resize-none"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      minHeight: 160,
                    }}
                    data-ocid="journal.text.textarea"
                  />
                  {journalText.length > 0 && (
                    <button
                      type="button"
                      onClick={handleSaveJournalEntry}
                      disabled={journalSaving}
                      className="mt-3 px-6 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50"
                      style={{ backgroundColor: gold, color: "#1B4332" }}
                      data-ocid="journal.save.button"
                    >
                      {journalSaving ? "Saving..." : "Save Entry"}
                    </button>
                  )}
                </div>
              )}

              {/* Audio/Video recording mode */}
              {(journalMode === "audio" || journalMode === "video") && (
                <div>
                  {journalRecording ? (
                    <div>
                      {journalMode === "video" && (
                        <video
                          ref={journalVideoRef}
                          className="w-full rounded-xl mb-3"
                          style={{ maxHeight: 240, backgroundColor: "#000" }}
                          autoPlay
                          muted
                          playsInline
                        />
                      )}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span
                            className="w-3 h-3 rounded-full animate-pulse"
                            style={{ backgroundColor: "#ef4444" }}
                          />
                          <span className="text-white font-semibold">
                            {journalMode === "video"
                              ? "Recording video..."
                              : "Recording audio..."}
                          </span>
                        </div>
                        <span
                          className="font-mono text-sm"
                          style={{ color: gold }}
                        >
                          {formatTimer(journalTimeLeft)} remaining
                        </span>
                      </div>
                      {journalTranscript && (
                        <p
                          className="text-white/40 text-xs italic mb-4 px-3 py-2 rounded-lg"
                          style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                        >
                          “{journalTranscript}”
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={stopJournalRecording}
                        className="w-full py-3 rounded-xl font-semibold text-sm"
                        style={{ backgroundColor: "#ef4444", color: "white" }}
                        data-ocid="journal.stop.button"
                      >
                        ■ Stop Recording
                      </button>
                    </div>
                  ) : journalBlob ? (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-green-400 text-sm">
                          ✓ {journalMode === "video" ? "Video" : "Audio"}{" "}
                          recorded
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setJournalBlob(null);
                            setJournalBlobUrl(null);
                            setJournalTranscript("");
                          }}
                          className="text-white/30 hover:text-red-400 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                      {journalBlobUrl && journalMode === "audio" && (
                        // biome-ignore lint/a11y/useMediaCaption: transcript shown below
                        <audio
                          controls
                          src={journalBlobUrl}
                          className="w-full mb-3"
                          style={{ height: 40 }}
                        />
                      )}
                      {journalBlobUrl && journalMode === "video" && (
                        // biome-ignore lint/a11y/useMediaCaption: transcript shown below
                        <video
                          controls
                          src={journalBlobUrl}
                          className="w-full rounded-xl mb-3"
                          style={{ maxHeight: 240 }}
                        />
                      )}
                      {journalTranscript && (
                        <div
                          className="mb-4 p-3 rounded-xl text-xs text-white/60 italic"
                          style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                        >
                          “{journalTranscript.slice(0, 300)}
                          {journalTranscript.length > 300 ? "..." : ""}”
                        </div>
                      )}
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={handleSaveJournalEntry}
                          disabled={journalSaving}
                          className="flex-1 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50"
                          style={{ backgroundColor: gold, color: "#1B4332" }}
                          data-ocid="journal.save.button"
                        >
                          {journalSaving ? "Saving..." : "Save Entry"}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            startJournalRecording(journalMode === "video")
                          }
                          className="px-4 py-2.5 rounded-xl text-sm"
                          style={{
                            backgroundColor: "rgba(255,255,255,0.07)",
                            color: "rgba(255,255,255,0.6)",
                          }}
                          data-ocid="journal.rerecord.button"
                        >
                          Re-record
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <button
                        type="button"
                        onClick={() =>
                          startJournalRecording(journalMode === "video")
                        }
                        className="w-20 h-20 rounded-full mb-4 flex items-center justify-center mx-auto text-3xl transition-transform hover:scale-105"
                        style={{
                          backgroundColor: "rgba(200,162,74,0.2)",
                          border: `2px solid ${gold}`,
                        }}
                        data-ocid="journal.record.button"
                      >
                        {journalMode === "video" ? "🎥" : "🎙"}
                      </button>
                      <p className="text-white/60 text-sm mb-1">
                        {journalMode === "video"
                          ? "Start video recording"
                          : "Start audio recording"}
                      </p>
                      <p className="text-white/30 text-xs">Up to 3 minutes</p>
                      {journalMode === "video" && (
                        <p
                          className="text-xs mt-2"
                          style={{ color: "rgba(200,162,74,0.6)" }}
                        >
                          💡 Video gives your twin more signals to work with
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </GreenCard>

            {/* Journal entry feed */}
            <div>
              <h3 className="font-bold mb-4">Your Journal Entries</h3>
              {journalEntries.length === 0 ? (
                <GreenCard
                  className="text-center py-10"
                  data-ocid="journal.empty_state"
                >
                  <div className="text-3xl mb-3">📓</div>
                  <p className="text-white/50 text-sm">
                    No entries yet. Share your first thought above.
                  </p>
                </GreenCard>
              ) : (
                <div className="space-y-4">
                  {[...journalEntries]
                    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
                    .map((entry, ei) => {
                      let parsedAnalysis: Record<string, string> | null = null;
                      if (entry.aiAnalysis) {
                        try {
                          parsedAnalysis = JSON.parse(entry.aiAnalysis);
                        } catch (_) {}
                      }
                      const typeColor =
                        entry.entryType === "Video"
                          ? "#a78bfa"
                          : entry.entryType === "Audio"
                            ? "#34d399"
                            : gold;
                      return (
                        <GreenCard
                          key={entry.id}
                          data-ocid={`journal.item.${ei + 1}`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1">
                              {editingTitleId === entry.id ? (
                                <input
                                  type="text"
                                  value={editingTitleVal}
                                  onChange={(e) =>
                                    setEditingTitleVal(e.target.value)
                                  }
                                  onBlur={() => handleRenameJournal(entry)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter")
                                      handleRenameJournal(entry);
                                    if (e.key === "Escape")
                                      setEditingTitleId(null);
                                  }}
                                  className="w-full px-2 py-1 rounded-lg text-white text-sm font-semibold outline-none"
                                  style={{
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    border: `1px solid ${gold}`,
                                  }}
                                  data-ocid="journal.title.input"
                                />
                              ) : (
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-sm">
                                    {entry.title}
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingTitleId(entry.id);
                                      setEditingTitleVal(entry.title);
                                    }}
                                    className="text-white/25 hover:text-white/60 text-xs transition-colors"
                                    title="Rename"
                                    data-ocid={`journal.edit_button.${ei + 1}`}
                                  >
                                    ✏️
                                  </button>
                                </div>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <span
                                  className="text-xs px-2 py-0.5 rounded-full"
                                  style={{
                                    backgroundColor: `${typeColor}22`,
                                    color: typeColor,
                                  }}
                                >
                                  {entry.entryType}
                                </span>
                                <span className="text-white/30 text-xs">
                                  {new Date(
                                    Number(entry.timestamp) / 1_000_000,
                                  ).toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteJournal(entry.id)}
                              className="text-white/20 hover:text-red-400 text-sm transition-colors"
                              data-ocid={`journal.delete_button.${ei + 1}`}
                            >
                              🗑️
                            </button>
                          </div>

                          {entry.transcript && (
                            <p className="text-white/50 text-xs italic mb-3 leading-relaxed">
                              &ldquo;{entry.transcript.slice(0, 150)}
                              {entry.transcript.length > 150 ? "\u2026" : ""}
                              &rdquo;
                            </p>
                          )}

                          {parsedAnalysis && (
                            <div className="mb-3">
                              <div className="text-xs text-white/30 mb-1.5 uppercase tracking-wider">
                                AI Insights
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {Object.entries(parsedAnalysis).map(
                                  ([k, v]) => (
                                    <span
                                      key={k}
                                      className="px-2 py-0.5 rounded-full text-xs"
                                      style={{
                                        backgroundColor:
                                          "rgba(200,162,74,0.15)",
                                        color: gold,
                                      }}
                                    >
                                      {k}: {String(v)}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                          {!entry.aiAnalysis && entry.transcript && (
                            <button
                              type="button"
                              onClick={() => handleAnalyzeJournal(entry)}
                              disabled={journalAnalyzingId === entry.id}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50"
                              style={{
                                backgroundColor: "rgba(200,162,74,0.15)",
                                color: gold,
                                border: "1px solid rgba(200,162,74,0.3)",
                              }}
                              data-ocid={`journal.analyze_button.${ei + 1}`}
                            >
                              {journalAnalyzingId === entry.id
                                ? "Analysing..."
                                : "\u2728 Analyse with AI"}
                            </button>
                          )}
                        </GreenCard>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
