import { useMutation, useQuery } from "@tanstack/react-query";
import type { DimensionScores } from "../backend";
import { useActor } from "./useActor";

export function useSubmitAssessment() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      responses,
      dimensionScores,
      archetype,
      decisionForceLevel,
    }: {
      responses: Array<bigint>;
      dimensionScores: DimensionScores;
      archetype: string;
      decisionForceLevel: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitAssessment(
        responses,
        dimensionScores,
        archetype,
        decisionForceLevel,
      );
    },
  });
}

export function useGetAssessmentResult(id: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["result", id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getAssessmentResult(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}
