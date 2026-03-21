/* eslint-disable */

// @ts-nocheck

import { Actor, HttpAgent, type HttpAgentOptions, type ActorConfig, type Agent, type ActorSubclass } from "@icp-sdk/core/agent";
import type { Principal } from "@icp-sdk/core/principal";
import { idlFactory, type _SERVICE } from "./declarations/backend.did";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
function some<T>(value: T): Some<T> { return { __kind__: "Some", value: value }; }
function none(): None { return { __kind__: "None" }; }
function isNone<T>(option: Option<T>): option is None { return option.__kind__ === "None"; }
function isSome<T>(option: Option<T>): option is Some<T> { return option.__kind__ === "Some"; }
function unwrap<T>(option: Option<T>): T {
    if (isNone(option)) throw new Error("unwrap: none");
    return option.value;
}
function candid_some<T>(value: T): [T] { return [value]; }
function candid_none<T>(): [] { return []; }
function record_opt_to_undefined<T>(arg: T | null): T | undefined { return arg == null ? undefined : arg; }

export class ExternalBlob {
    _blob?: Uint8Array<ArrayBuffer> | null;
    directURL: string;
    onProgress?: (percentage: number) => void = undefined;
    private constructor(directURL: string, blob: Uint8Array<ArrayBuffer> | null){
        if (blob) { this._blob = blob; }
        this.directURL = directURL;
    }
    static fromURL(url: string): ExternalBlob { return new ExternalBlob(url, null); }
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob {
        const url = URL.createObjectURL(new Blob([new Uint8Array(blob)], { type: 'application/octet-stream' }));
        return new ExternalBlob(url, blob);
    }
    public async getBytes(): Promise<Uint8Array<ArrayBuffer>> {
        if (this._blob) return this._blob;
        const response = await fetch(this.directURL);
        const blob = await response.blob();
        this._blob = new Uint8Array(await blob.arrayBuffer());
        return this._blob;
    }
    public getDirectURL(): string { return this.directURL; }
    public withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob {
        this.onProgress = onProgress;
        return this;
    }
}

export enum UserRole { admin = "admin", user = "user", guest = "guest" }

export interface DimensionScores { pm: number; em: number; rrm: number; iai: number; sis: number; edi: number; }
export interface UserProfile { principalId: string; name: string; country: string; phone: string; email: string; createdAt: bigint; }
export interface TwinVersion { id: string; userId: string; versionName: string; pm: number; em: number; rrm: number; iai: number; sis: number; edi: number; createdAt: bigint; notes: string; }
export interface RegisteredAssessment { id: string; userId: string; responses: bigint[]; dimensionScores: DimensionScores; archetype: string; decisionForceLevel: string; timestamp: bigint; }
export interface DecisionLog { id: string; userId: string; scenario: string; twinVersionUsed: string; decisionOutcome: string; actualOutcome: string; timestamp: bigint; }
export interface UserActivitySummary { profile: UserProfile; assessments: RegisteredAssessment[]; twinVersions: TwinVersion[]; decisionLogs: DecisionLog[]; }
export interface PlatformStats { totalUsers: number; totalAssessments: number; totalTwins: number; totalDecisionLogs: number; }
export interface AssessmentResult { id: string; responses: bigint[]; dimensionScores: DimensionScores; archetype: string; decisionForceLevel: string; timestamp: bigint; }

export interface backendInterface {
    _initializeAccessControlWithSecret(userSecret: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    isCallerAdmin(): Promise<boolean>;
    submitAssessment(responses: bigint[], dimensionScores: DimensionScores, archetype: string, decisionForceLevel: string): Promise<string>;
    getAssessmentResult(id: string): Promise<AssessmentResult>;
    getRecentResults(): Promise<AssessmentResult[]>;
    saveUserProfile(name: string, country: string, phone: string, email: string): Promise<void>;
    getUserProfile(): Promise<Option<UserProfile>>;
    hasCompletedProfile(): Promise<boolean>;
    saveTwinVersion(versionName: string, pm: number, em: number, rrm: number, iai: number, sis: number, edi: number, notes: string): Promise<string>;
    getTwinVersions(): Promise<TwinVersion[]>;
    deleteTwinVersion(id: string): Promise<void>;
    submitRegisteredAssessment(responses: bigint[], dimensionScores: DimensionScores, archetype: string, decisionForceLevel: string): Promise<string>;
    getUserAssessments(): Promise<RegisteredAssessment[]>;
    logDecision(scenario: string, twinVersionUsed: string, decisionOutcome: string, actualOutcome: string): Promise<string>;
    getDecisionLog(): Promise<DecisionLog[]>;
    getAllUserProfiles(): Promise<UserProfile[]>;
    getUserActivitySummary(userId: string): Promise<UserActivitySummary>;
    getPlatformStats(): Promise<PlatformStats>;
}

import type { UserRole as _UserRole } from "./declarations/backend.did.d.ts";

export class Backend implements backendInterface {
    constructor(private actor: ActorSubclass<_SERVICE>, private _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>, private _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>, private processError?: (error: unknown) => never){}

    private async call<T>(fn: () => Promise<T>): Promise<T> {
        if (this.processError) {
            try { return await fn(); } catch (e) { this.processError(e); throw new Error("unreachable"); }
        }
        return fn();
    }

    async _initializeAccessControlWithSecret(arg0: string): Promise<void> { return this.call(() => this.actor._initializeAccessControlWithSecret(arg0)); }
    async assignCallerUserRole(arg0: Principal, arg1: UserRole): Promise<void> { return this.call(() => this.actor.assignCallerUserRole(arg0, to_candid_UserRole(arg1))); }
    async getCallerUserRole(): Promise<UserRole> { return this.call(async () => from_candid_UserRole(await this.actor.getCallerUserRole())); }
    async isCallerAdmin(): Promise<boolean> { return this.call(() => this.actor.isCallerAdmin()); }

    async submitAssessment(responses: bigint[], dimensionScores: DimensionScores, archetype: string, decisionForceLevel: string): Promise<string> {
        return this.call(() => this.actor.submitAssessment(responses, dimensionScores, archetype, decisionForceLevel));
    }
    async getAssessmentResult(id: string): Promise<AssessmentResult> { return this.call(() => this.actor.getAssessmentResult(id)); }
    async getRecentResults(): Promise<AssessmentResult[]> { return this.call(() => this.actor.getRecentResults()); }

    async saveUserProfile(name: string, country: string, phone: string, email: string): Promise<void> {
        return this.call(() => this.actor.saveUserProfile(name, country, phone, email));
    }
    async getUserProfile(): Promise<Option<UserProfile>> {
        return this.call(async () => {
            const result = await this.actor.getUserProfile();
            return Array.isArray(result) && result.length > 0 ? some(result[0]) : none();
        });
    }
    async hasCompletedProfile(): Promise<boolean> { return this.call(() => this.actor.hasCompletedProfile()); }

    async saveTwinVersion(versionName: string, pm: number, em: number, rrm: number, iai: number, sis: number, edi: number, notes: string): Promise<string> {
        return this.call(() => this.actor.saveTwinVersion(versionName, pm, em, rrm, iai, sis, edi, notes));
    }
    async getTwinVersions(): Promise<TwinVersion[]> { return this.call(() => this.actor.getTwinVersions()); }
    async deleteTwinVersion(id: string): Promise<void> { return this.call(() => this.actor.deleteTwinVersion(id)); }

    async submitRegisteredAssessment(responses: bigint[], dimensionScores: DimensionScores, archetype: string, decisionForceLevel: string): Promise<string> {
        return this.call(() => this.actor.submitRegisteredAssessment(responses, dimensionScores, archetype, decisionForceLevel));
    }
    async getUserAssessments(): Promise<RegisteredAssessment[]> { return this.call(() => this.actor.getUserAssessments()); }

    async logDecision(scenario: string, twinVersionUsed: string, decisionOutcome: string, actualOutcome: string): Promise<string> {
        return this.call(() => this.actor.logDecision(scenario, twinVersionUsed, decisionOutcome, actualOutcome));
    }
    async getDecisionLog(): Promise<DecisionLog[]> { return this.call(() => this.actor.getDecisionLog()); }

    async getAllUserProfiles(): Promise<UserProfile[]> { return this.call(() => this.actor.getAllUserProfiles()); }
    async getUserActivitySummary(userId: string): Promise<UserActivitySummary> { return this.call(() => this.actor.getUserActivitySummary(userId)); }
    async getPlatformStats(): Promise<PlatformStats> { return this.call(() => this.actor.getPlatformStats()); }
}

function from_candid_UserRole(value: _UserRole): UserRole {
    return "admin" in value ? UserRole.admin : "user" in value ? UserRole.user : "guest" in value ? UserRole.guest : value as unknown as UserRole;
}
function to_candid_UserRole(value: UserRole): _UserRole {
    return value == UserRole.admin ? { admin: null } : value == UserRole.user ? { user: null } : { guest: null };
}

export interface CreateActorOptions {
    agent?: Agent;
    agentOptions?: HttpAgentOptions;
    actorOptions?: ActorConfig;
    processError?: (error: unknown) => never;
}
export function createActor(canisterId: string, _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>, _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>, options: CreateActorOptions = {}): Backend {
    const agent = options.agent || HttpAgent.createSync({ ...options.agentOptions });
    if (options.agent && options.agentOptions) {
        console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
    }
    const actor = Actor.createActor<_SERVICE>(idlFactory, { agent, canisterId: canisterId, ...options.actorOptions });
    return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
