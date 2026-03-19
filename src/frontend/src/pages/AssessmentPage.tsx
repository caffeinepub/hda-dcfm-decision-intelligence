import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useSubmitAssessment } from "../hooks/useQueries";
import {
  DIMENSIONS,
  DIMENSION_LABELS,
  QUESTIONS,
  classifyArchetype,
  classifyDecisionForce,
  computeScores,
} from "../scoring";

const LIKERT_LABELS = [
  "Strongly\nDisagree",
  "Disagree",
  "Slightly\nDisagree",
  "Neutral",
  "Slightly\nAgree",
  "Agree",
  "Strongly\nAgree",
];

interface AssessmentPageProps {
  onNavigate: (page: string) => void;
}

export function AssessmentPage({ onNavigate }: AssessmentPageProps) {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<number[]>(Array(36).fill(0));
  const [responseTimes, setResponseTimes] = useState<number[]>(
    Array(36).fill(0),
  );
  const [direction, setDirection] = useState<1 | -1>(1);
  const lastInteractionTime = useRef<number>(Date.now());
  const submitMutation = useSubmitAssessment();

  const currentDim = DIMENSIONS[step];
  const stepQuestions = QUESTIONS.filter((q) => q.dimension === currentDim);
  const stepStartIndex = DIMENSIONS.slice(0, step).length * 6;

  const stepResponses = stepQuestions.map(
    (_, i) => responses[stepStartIndex + i],
  );
  const allAnswered = stepResponses.every((r) => r > 0);
  const progress = (step / 6) * 100;

  // Reset interaction timer when dimension changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional - only ref is mutated
  useEffect(() => {
    lastInteractionTime.current = Date.now();
  }, [step]);

  const handleResponse = (questionIndex: number, value: number) => {
    const globalIndex = stepStartIndex + questionIndex;
    const now = Date.now();
    const elapsed = now - lastInteractionTime.current;
    lastInteractionTime.current = now;

    const newResponses = [...responses];
    newResponses[globalIndex] = value;
    setResponses(newResponses);

    const newTimes = [...responseTimes];
    newTimes[globalIndex] = elapsed;
    setResponseTimes(newTimes);
  };

  const handleNext = () => {
    if (!allAnswered) return;
    setDirection(1);
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!allAnswered) return;
    const scores = computeScores(responses);
    const archetype = classifyArchetype(scores);
    const forceLevel = classifyDecisionForce(scores);

    localStorage.setItem(
      "hda_results",
      JSON.stringify({
        responses,
        scores,
        archetype,
        forceLevel,
        responseTimes,
      }),
    );

    try {
      const bigintResponses = responses.map((r) => BigInt(r));
      const dimensionScores = {
        pm: scores.pm,
        em: scores.em,
        rrm: scores.rrm,
        iai: scores.iai,
        sis: scores.sis,
        edi: scores.edi,
      };
      const id = await submitMutation.mutateAsync({
        responses: bigintResponses,
        dimensionScores,
        archetype,
        decisionForceLevel: forceLevel,
      });
      localStorage.setItem("hda_result_id", id);
    } catch (_) {
      // Continue even if backend fails
    }

    onNavigate("results");
  };

  const isLastStep = step === 5;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F3F6F9" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#081C2F" }} className="sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate("landing")}
            className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
            data-ocid="assessment.link"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M10 12L6 8l4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            Back to Home
          </button>
          <span className="text-white font-bold">HDA-DCFM Assessment</span>
          <span className="text-white/50 text-sm">Step {step + 1} of 6</span>
        </div>
        <div className="h-1 bg-white/10">
          <motion.div
            className="h-full"
            style={{ backgroundColor: "#C8A24A" }}
            animate={{ width: `${progress + 100 / 6}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.3 }}
          >
            {/* Dimension header */}
            <div className="mb-10">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                style={{
                  backgroundColor: "rgba(200,162,74,0.15)",
                  color: "#C8A24A",
                  border: "1px solid rgba(200,162,74,0.25)",
                }}
              >
                Dimension {step + 1} of 6
              </div>
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: "#081C2F" }}
              >
                {DIMENSION_LABELS[currentDim]}
              </h1>
              <p className="text-gray-500 text-sm">
                For each situation below, choose how closely it matches your
                typical approach — from 1 (Strongly Disagree) to 7 (Strongly
                Agree).
              </p>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {stepQuestions.map((q, qi) => {
                const globalIndex = stepStartIndex + qi;
                const selected = responses[globalIndex];
                return (
                  <div
                    key={globalIndex}
                    className="bg-white rounded-2xl p-6 shadow-card border border-gray-100"
                    data-ocid={`assessment.item.${qi + 1}`}
                  >
                    <p
                      className="font-semibold text-sm mb-5"
                      style={{ color: "#0F1F2E" }}
                    >
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3"
                        style={{ backgroundColor: "#081C2F", color: "#C8A24A" }}
                      >
                        {stepStartIndex + qi + 1}
                      </span>
                      {q.text}
                    </p>
                    <div className="flex items-end justify-between gap-1">
                      {LIKERT_LABELS.map((label, val) => {
                        const score = val + 1;
                        const isSelected = selected === score;
                        return (
                          <button
                            type="button"
                            key={score}
                            onClick={() => handleResponse(qi, score)}
                            className="flex flex-col items-center gap-2 flex-1 group"
                            data-ocid={`assessment.radio.${qi + 1}`}
                          >
                            <span
                              className="text-[10px] text-center leading-tight text-gray-400 group-hover:text-gray-600 transition-colors hidden sm:block"
                              style={{ whiteSpace: "pre-line", height: "28px" }}
                            >
                              {label}
                            </span>
                            <div
                              className="w-full h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all border-2"
                              style={{
                                backgroundColor: isSelected
                                  ? "#C8A24A"
                                  : "transparent",
                                borderColor: isSelected ? "#C8A24A" : "#E5E7EB",
                                color: isSelected ? "#081C2F" : "#9CA3AF",
                              }}
                            >
                              {score}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-10">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 0}
                className="px-6 py-3 rounded-xl font-semibold text-sm border-2 transition-all disabled:opacity-30"
                style={{ borderColor: "#081C2F", color: "#081C2F" }}
                data-ocid="assessment.secondary_button"
              >
                ← Back
              </button>
              {isLastStep ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!allAnswered || submitMutation.isPending}
                  className="px-8 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
                  style={{ backgroundColor: "#C8A24A", color: "#081C2F" }}
                  data-ocid="assessment.submit_button"
                >
                  {submitMutation.isPending
                    ? "Submitting..."
                    : "Submit Assessment →"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!allAnswered}
                  className="px-8 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
                  style={{ backgroundColor: "#081C2F", color: "white" }}
                  data-ocid="assessment.primary_button"
                >
                  Next Dimension →
                </button>
              )}
            </div>

            {!allAnswered && (
              <p
                className="text-center text-xs text-amber-600 mt-4"
                data-ocid="assessment.error_state"
              >
                Please answer all {stepQuestions.length} questions to continue.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
