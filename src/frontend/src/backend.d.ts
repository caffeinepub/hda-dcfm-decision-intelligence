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
export interface AssessmentTextResponses {
    assessmentId: string; userId: string; textResponses: string[]; timestamp: bigint;
}
export interface DecisionLog {
    id: string; userId: string; scenario: string; twinVersionUsed: string;
    decisionOutcome: string; actualOutcome: string; timestamp: bigint;
}
export interface JournalEntry {
    id: string; userId: string; title: string;
    entryType: string; // "audio" | "video" | "text"
    blobUrl: string; transcript: string;
    aiAnalysis: string; dimensionSignals: string; timestamp: bigint;
}
export interface UserActivitySummary {
    profile: UserProfile;
    assessments: RegisteredAssessment[];
    twinVersions: TwinVersion[];
    decisionLogs: DecisionLog[];
    journalEntries: JournalEntry[];
}
export interface PlatformStats {
    totalUsers: number; totalAssessments: number; totalTwins: number; totalDecisionLogs: number; totalJournalEntries: number;
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
    renameTwinVersion(id: string, newName: string): Promise<void>;
    // registered assessments
    submitRegisteredAssessment(responses: bigint[], dimensionScores: DimensionScores, archetype: string, decisionForceLevel: string): Promise<string>;
    submitAssessmentWithText(responses: bigint[], textResponses: string[], dimensionScores: DimensionScores, archetype: string, decisionForceLevel: string): Promise<string>;
    getUserAssessments(): Promise<RegisteredAssessment[]>;
    getAssessmentTextResponses(assessmentId: string): Promise<Option<AssessmentTextResponses>>;
    // decision log
    logDecision(scenario: string, twinVersionUsed: string, decisionOutcome: string, actualOutcome: string): Promise<string>;
    getDecisionLog(): Promise<DecisionLog[]>;
    // journal entries
    saveJournalEntry(title: string, entryType: string, blobUrl: string, transcript: string): Promise<string>;
    getUserJournalEntries(): Promise<JournalEntry[]>;
    updateJournalEntry(id: string, title: string, aiAnalysis: string, dimensionSignals: string): Promise<void>;
    deleteJournalEntry(id: string): Promise<void>;
    // AI analysis
    analyzeText(text: string, contextHint: string): Promise<string>;
    setOpenAIApiKey(key: string): Promise<void>;
    getOpenAIApiKey(): Promise<string>;
    // admin
    getAllUserProfiles(): Promise<UserProfile[]>;
    getUserActivitySummary(userId: string): Promise<UserActivitySummary>;
    getPlatformStats(): Promise<PlatformStats>;
}
