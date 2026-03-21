import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface DimensionScores {
    pm: number; em: number; rrm: number; iai: number; sis: number; edi: number;
}
export interface UserProfile {
    principalId: string; name: string; country: string; phone: string; email: string; createdAt: bigint;
}
export interface TwinVersion {
    id: string; userId: string; versionName: string;
    pm: number; em: number; rrm: number; iai: number; sis: number; edi: number;
    createdAt: bigint; notes: string;
}
export interface RegisteredAssessment {
    id: string; userId: string; responses: bigint[];
    dimensionScores: DimensionScores; archetype: string; decisionForceLevel: string; timestamp: bigint;
}
export interface DecisionLog {
    id: string; userId: string; scenario: string; twinVersionUsed: string;
    decisionOutcome: string; actualOutcome: string; timestamp: bigint;
}
export interface UserActivitySummary {
    profile: UserProfile;
    assessments: RegisteredAssessment[];
    twinVersions: TwinVersion[];
    decisionLogs: DecisionLog[];
}
export interface PlatformStats {
    totalUsers: number; totalAssessments: number; totalTwins: number; totalDecisionLogs: number;
}
export interface AssessmentResult {
    id: string; responses: bigint[];
    dimensionScores: DimensionScores; archetype: string; decisionForceLevel: string; timestamp: bigint;
}
export interface backendInterface {
    _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    isCallerAdmin(): Promise<boolean>;
    // anonymous assessment
    submitAssessment(responses: bigint[], dimensionScores: DimensionScores, archetype: string, decisionForceLevel: string): Promise<string>;
    getAssessmentResult(id: string): Promise<AssessmentResult>;
    getRecentResults(): Promise<AssessmentResult[]>;
    // user profile
    saveUserProfile(name: string, country: string, phone: string, email: string): Promise<void>;
    getUserProfile(): Promise<Option<UserProfile>>;
    hasCompletedProfile(): Promise<boolean>;
    // twin versions
    saveTwinVersion(versionName: string, pm: number, em: number, rrm: number, iai: number, sis: number, edi: number, notes: string): Promise<string>;
    getTwinVersions(): Promise<TwinVersion[]>;
    deleteTwinVersion(id: string): Promise<void>;
    // registered assessments
    submitRegisteredAssessment(responses: bigint[], dimensionScores: DimensionScores, archetype: string, decisionForceLevel: string): Promise<string>;
    getUserAssessments(): Promise<RegisteredAssessment[]>;
    // decision log
    logDecision(scenario: string, twinVersionUsed: string, decisionOutcome: string, actualOutcome: string): Promise<string>;
    getDecisionLog(): Promise<DecisionLog[]>;
    // admin
    getAllUserProfiles(): Promise<UserProfile[]>;
    getUserActivitySummary(userId: string): Promise<UserActivitySummary>;
    getPlatformStats(): Promise<PlatformStats>;
}
