/* eslint-disable */

// @ts-nocheck

import { IDL } from '@icp-sdk/core/candid';

export const UserRole = IDL.Variant({
  'admin' : IDL.Null,
  'user' : IDL.Null,
  'guest' : IDL.Null,
});

const DimensionScores = IDL.Record({
  'pm': IDL.Float64, 'em': IDL.Float64, 'rrm': IDL.Float64,
  'iai': IDL.Float64, 'sis': IDL.Float64, 'edi': IDL.Float64,
});

const UserProfile = IDL.Record({
  'principalId': IDL.Text, 'name': IDL.Text, 'country': IDL.Text,
  'phone': IDL.Text, 'email': IDL.Text, 'createdAt': IDL.Int,
});

const TwinVersion = IDL.Record({
  'id': IDL.Text, 'userId': IDL.Text, 'versionName': IDL.Text,
  'pm': IDL.Float64, 'em': IDL.Float64, 'rrm': IDL.Float64,
  'iai': IDL.Float64, 'sis': IDL.Float64, 'edi': IDL.Float64,
  'createdAt': IDL.Int, 'notes': IDL.Text,
});

const RegisteredAssessment = IDL.Record({
  'id': IDL.Text, 'userId': IDL.Text, 'responses': IDL.Vec(IDL.Int),
  'dimensionScores': DimensionScores, 'archetype': IDL.Text,
  'decisionForceLevel': IDL.Text, 'timestamp': IDL.Int,
});

const DecisionLog = IDL.Record({
  'id': IDL.Text, 'userId': IDL.Text, 'scenario': IDL.Text,
  'twinVersionUsed': IDL.Text, 'decisionOutcome': IDL.Text,
  'actualOutcome': IDL.Text, 'timestamp': IDL.Int,
});

const UserActivitySummary = IDL.Record({
  'profile': UserProfile,
  'assessments': IDL.Vec(RegisteredAssessment),
  'twinVersions': IDL.Vec(TwinVersion),
  'decisionLogs': IDL.Vec(DecisionLog),
});

const PlatformStats = IDL.Record({
  'totalUsers': IDL.Nat32, 'totalAssessments': IDL.Nat32,
  'totalTwins': IDL.Nat32, 'totalDecisionLogs': IDL.Nat32,
});

const AssessmentResult = IDL.Record({
  'id': IDL.Text, 'responses': IDL.Vec(IDL.Int),
  'dimensionScores': DimensionScores, 'archetype': IDL.Text,
  'decisionForceLevel': IDL.Text, 'timestamp': IDL.Int,
});

export const idlService = IDL.Service({
  '_initializeAccessControlWithSecret': IDL.Func([IDL.Text], [], []),
  'assignCallerUserRole': IDL.Func([IDL.Principal, UserRole], [], []),
  'getCallerUserRole': IDL.Func([], [UserRole], ['query']),
  'isCallerAdmin': IDL.Func([], [IDL.Bool], ['query']),
  'submitAssessment': IDL.Func([IDL.Vec(IDL.Int), DimensionScores, IDL.Text, IDL.Text], [IDL.Text], []),
  'getAssessmentResult': IDL.Func([IDL.Text], [AssessmentResult], ['query']),
  'getRecentResults': IDL.Func([], [IDL.Vec(AssessmentResult)], ['query']),
  'saveUserProfile': IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text], [], []),
  'getUserProfile': IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
  'hasCompletedProfile': IDL.Func([], [IDL.Bool], ['query']),
  'saveTwinVersion': IDL.Func([IDL.Text, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Text], [IDL.Text], []),
  'getTwinVersions': IDL.Func([], [IDL.Vec(TwinVersion)], ['query']),
  'deleteTwinVersion': IDL.Func([IDL.Text], [], []),
  'submitRegisteredAssessment': IDL.Func([IDL.Vec(IDL.Int), DimensionScores, IDL.Text, IDL.Text], [IDL.Text], []),
  'getUserAssessments': IDL.Func([], [IDL.Vec(RegisteredAssessment)], ['query']),
  'logDecision': IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text], [IDL.Text], []),
  'getDecisionLog': IDL.Func([], [IDL.Vec(DecisionLog)], ['query']),
  'getAllUserProfiles': IDL.Func([], [IDL.Vec(UserProfile)], []),
  'getUserActivitySummary': IDL.Func([IDL.Text], [UserActivitySummary], []),
  'getPlatformStats': IDL.Func([], [PlatformStats], []),
});

export const idlInitArgs = [];

export const idlFactory = ({ IDL }) => {
  const UserRole = IDL.Variant({ 'admin': IDL.Null, 'user': IDL.Null, 'guest': IDL.Null });
  const DimensionScores = IDL.Record({ 'pm': IDL.Float64, 'em': IDL.Float64, 'rrm': IDL.Float64, 'iai': IDL.Float64, 'sis': IDL.Float64, 'edi': IDL.Float64 });
  const UserProfile = IDL.Record({ 'principalId': IDL.Text, 'name': IDL.Text, 'country': IDL.Text, 'phone': IDL.Text, 'email': IDL.Text, 'createdAt': IDL.Int });
  const TwinVersion = IDL.Record({ 'id': IDL.Text, 'userId': IDL.Text, 'versionName': IDL.Text, 'pm': IDL.Float64, 'em': IDL.Float64, 'rrm': IDL.Float64, 'iai': IDL.Float64, 'sis': IDL.Float64, 'edi': IDL.Float64, 'createdAt': IDL.Int, 'notes': IDL.Text });
  const RegisteredAssessment = IDL.Record({ 'id': IDL.Text, 'userId': IDL.Text, 'responses': IDL.Vec(IDL.Int), 'dimensionScores': DimensionScores, 'archetype': IDL.Text, 'decisionForceLevel': IDL.Text, 'timestamp': IDL.Int });
  const DecisionLog = IDL.Record({ 'id': IDL.Text, 'userId': IDL.Text, 'scenario': IDL.Text, 'twinVersionUsed': IDL.Text, 'decisionOutcome': IDL.Text, 'actualOutcome': IDL.Text, 'timestamp': IDL.Int });
  const UserActivitySummary = IDL.Record({ 'profile': UserProfile, 'assessments': IDL.Vec(RegisteredAssessment), 'twinVersions': IDL.Vec(TwinVersion), 'decisionLogs': IDL.Vec(DecisionLog) });
  const PlatformStats = IDL.Record({ 'totalUsers': IDL.Nat32, 'totalAssessments': IDL.Nat32, 'totalTwins': IDL.Nat32, 'totalDecisionLogs': IDL.Nat32 });
  const AssessmentResult = IDL.Record({ 'id': IDL.Text, 'responses': IDL.Vec(IDL.Int), 'dimensionScores': DimensionScores, 'archetype': IDL.Text, 'decisionForceLevel': IDL.Text, 'timestamp': IDL.Int });
  return IDL.Service({
    '_initializeAccessControlWithSecret': IDL.Func([IDL.Text], [], []),
    'assignCallerUserRole': IDL.Func([IDL.Principal, UserRole], [], []),
    'getCallerUserRole': IDL.Func([], [UserRole], ['query']),
    'isCallerAdmin': IDL.Func([], [IDL.Bool], ['query']),
    'submitAssessment': IDL.Func([IDL.Vec(IDL.Int), DimensionScores, IDL.Text, IDL.Text], [IDL.Text], []),
    'getAssessmentResult': IDL.Func([IDL.Text], [AssessmentResult], ['query']),
    'getRecentResults': IDL.Func([], [IDL.Vec(AssessmentResult)], ['query']),
    'saveUserProfile': IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text], [], []),
    'getUserProfile': IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
    'hasCompletedProfile': IDL.Func([], [IDL.Bool], ['query']),
    'saveTwinVersion': IDL.Func([IDL.Text, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Float64, IDL.Text], [IDL.Text], []),
    'getTwinVersions': IDL.Func([], [IDL.Vec(TwinVersion)], ['query']),
    'deleteTwinVersion': IDL.Func([IDL.Text], [], []),
    'submitRegisteredAssessment': IDL.Func([IDL.Vec(IDL.Int), DimensionScores, IDL.Text, IDL.Text], [IDL.Text], []),
    'getUserAssessments': IDL.Func([], [IDL.Vec(RegisteredAssessment)], ['query']),
    'logDecision': IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text], [IDL.Text], []),
    'getDecisionLog': IDL.Func([], [IDL.Vec(DecisionLog)], ['query']),
    'getAllUserProfiles': IDL.Func([], [IDL.Vec(UserProfile)], []),
    'getUserActivitySummary': IDL.Func([IDL.Text], [UserActivitySummary], []),
    'getPlatformStats': IDL.Func([], [PlatformStats], []),
  });
};

export const init = ({ IDL }) => { return []; };
