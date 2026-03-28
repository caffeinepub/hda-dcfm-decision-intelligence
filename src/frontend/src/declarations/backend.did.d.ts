/* eslint-disable */

// @ts-nocheck

import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';
import type { Principal } from '@icp-sdk/core/principal';

export type UserRole = { 'admin' : null } |
  { 'user' : null } |
  { 'guest' : null };

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
  id: string; userId: string; responses: bigint[]; dimensionScores: DimensionScores;
  archetype: string; decisionForceLevel: string; timestamp: bigint;
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
  journalEntries: JournalEntry[];
}
export interface PlatformStats {
  totalUsers: number; totalAssessments: number; totalTwins: number; totalDecisionLogs: number; totalJournalEntries: number;
}

export interface AssessmentResult {
  id: string; responses: bigint[]; dimensionScores: DimensionScores;
  archetype: string; decisionForceLevel: string; timestamp: bigint;
}

export interface JournalEntry {
  id: string; userId: string; title: string; entryType: string;
  blobUrl: string; transcript: string; aiAnalysis: string; dimensionSignals: string; timestamp: bigint;
}
export interface _SERVICE {
  '_initializeAccessControlWithSecret': ActorMethod<[string], undefined>;
  'assignCallerUserRole': ActorMethod<[Principal, UserRole], undefined>;
  'getCallerUserRole': ActorMethod<[], UserRole>;
  'isCallerAdmin': ActorMethod<[], boolean>;
  // anonymous assessment
  'submitAssessment': ActorMethod<[bigint[], DimensionScores, string, string], string>;
  'getAssessmentResult': ActorMethod<[string], AssessmentResult>;
  'getRecentResults': ActorMethod<[], AssessmentResult[]>;
  // user profile
  'saveUserProfile': ActorMethod<[string, string, string, string], undefined>;
  'getUserProfile': ActorMethod<[], [] | [UserProfile]>;
  'hasCompletedProfile': ActorMethod<[], boolean>;
  // twin versions
  'saveTwinVersion': ActorMethod<[string, number, number, number, number, number, number, string], string>;
  'getTwinVersions': ActorMethod<[], TwinVersion[]>;
  'deleteTwinVersion': ActorMethod<[string], undefined>;
  // registered assessments
  'submitRegisteredAssessment': ActorMethod<[bigint[], DimensionScores, string, string], string>;
  'getUserAssessments': ActorMethod<[], RegisteredAssessment[]>;
  // decision log
  'logDecision': ActorMethod<[string, string, string, string], string>;
  'getDecisionLog': ActorMethod<[], DecisionLog[]>;
  // admin
  'getAllUserProfiles': ActorMethod<[], UserProfile[]>;
  'getUserActivitySummary': ActorMethod<[string], UserActivitySummary>;
  'getPlatformStats': ActorMethod<[], PlatformStats>;
  'seedDemoData': ActorMethod<[], string>;
}
export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
