import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DimensionScores {
    em: number;
    pm: number;
    edi: number;
    iai: number;
    rrm: number;
    sis: number;
}
export type Time = bigint;
export interface AssessmentResult {
    id: string;
    dimensionScores: DimensionScores;
    responses: Array<bigint>;
    archetype: string;
    timestamp: Time;
    decisionForceLevel: string;
}
export interface backendInterface {
    getAssessmentResult(id: string): Promise<AssessmentResult>;
    getRecentResults(): Promise<Array<AssessmentResult>>;
    submitAssessment(responses: Array<bigint>, dimensionScores: DimensionScores, archetype: string, decisionForceLevel: string): Promise<string>;
}
