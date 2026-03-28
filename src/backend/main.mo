import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import BlobStorageMixin "blob-storage/Mixin";
import Outcall "http-outcalls/outcall";

import Time "mo:core/Time";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Nat32 "mo:core/Nat32";


actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include BlobStorageMixin();

  // ─── Types ────────────────────────────────────────────────────────────────────────────

  type DimensionScores = {
    pm : Float;
    em : Float;
    rrm : Float;
    iai : Float;
    sis : Float;
    edi : Float;
  };

  type AssessmentResult = {
    id : Text;
    responses : [Int];
    dimensionScores : DimensionScores;
    archetype : Text;
    decisionForceLevel : Text;
    timestamp : Time.Time;
  };

  type UserProfile = {
    principalId : Text;
    name : Text;
    country : Text;
    phone : Text;
    email : Text;
    createdAt : Time.Time;
  };

  type TwinVersion = {
    id : Text;
    userId : Text;
    versionName : Text;
    pm : Float;
    em : Float;
    rrm : Float;
    iai : Float;
    sis : Float;
    edi : Float;
    createdAt : Time.Time;
    notes : Text;
  };

  type RegisteredAssessment = {
    id : Text;
    userId : Text;
    responses : [Int];
    dimensionScores : DimensionScores;
    archetype : Text;
    decisionForceLevel : Text;
    timestamp : Time.Time;
  };

  type AssessmentTextResponses = {
    assessmentId : Text;
    userId : Text;
    textResponses : [Text];
    timestamp : Time.Time;
  };

  type DecisionLog = {
    id : Text;
    userId : Text;
    scenario : Text;
    twinVersionUsed : Text;
    decisionOutcome : Text;
    actualOutcome : Text;
    timestamp : Time.Time;
  };

  type JournalEntry = {
    id : Text;
    userId : Text;
    title : Text;
    entryType : Text; // "audio", "video", "text"
    blobUrl : Text;
    transcript : Text;
    aiAnalysis : Text;
    dimensionSignals : Text;
    timestamp : Time.Time;
  };

  type UserActivitySummary = {
    profile : UserProfile;
    assessments : [RegisteredAssessment];
    twinVersions : [TwinVersion];
    decisionLogs : [DecisionLog];
    journalEntries : [JournalEntry];
  };

  type PlatformStats = {
    totalUsers : Nat32;
    totalAssessments : Nat32;
    totalTwins : Nat32;
    totalDecisionLogs : Nat32;
    totalJournalEntries : Nat32;
  };

  // ─── State ────────────────────────────────────────────────────────────────────────────

  let anonResults = Map.empty<Text, AssessmentResult>();
  let userProfiles = Map.empty<Text, UserProfile>();
  let twinVersions = Map.empty<Text, TwinVersion>();
  let registeredAssessments = Map.empty<Text, RegisteredAssessment>();
  let assessmentTextResponses = Map.empty<Text, AssessmentTextResponses>();
  let decisionLogs = Map.empty<Text, DecisionLog>();
  let journalEntries = Map.empty<Text, JournalEntry>();

  var idCounter : Nat32 = 0;
  var openaiApiKey : Text = "";

  func generateId() : Text {
    idCounter += 1;
    Time.now().toText() # "_" # idCounter.toText();
  };

  // ─── Anonymous Assessment ──────────────────────────────────────────────────────────

  public query func getAssessmentResult(id : Text) : async AssessmentResult {
    switch (anonResults.get(id)) {
      case (null) { Runtime.trap("Result does not exist") };
      case (?result) { result };
    };
  };

  public query func getRecentResults() : async [AssessmentResult] {
    anonResults.values().toArray().sort(func(a, b) = Int.compare(b.timestamp, a.timestamp)).sliceToArray(0, 20);
  };

  public shared func submitAssessment(responses : [Int], dimensionScores : DimensionScores, archetype : Text, decisionForceLevel : Text) : async Text {
    if (responses.size() != 36) Runtime.trap("Responses must have 36 elements");
    let id = generateId();
    anonResults.add(id, { id; responses; dimensionScores; archetype; decisionForceLevel; timestamp = Time.now() });
    id;
  };

  // ─── User Profiles ────────────────────────────────────────────────────────────────

  public shared ({ caller }) func saveUserProfile(name : Text, country : Text, phone : Text, email : Text) : async () {
    let uid = caller.toText();
    let existing = userProfiles.get(uid);
    let createdAt = switch (existing) {
      case (?p) { p.createdAt };
      case (null) { Time.now() };
    };
    userProfiles.add(uid, { principalId = uid; name; country; phone; email; createdAt });
  };

  public query ({ caller }) func getUserProfile() : async ?UserProfile {
    userProfiles.get(caller.toText());
  };

  public query ({ caller }) func hasCompletedProfile() : async Bool {
    switch (userProfiles.get(caller.toText())) {
      case (null) { false };
      case (?p) { p.country != "" and p.phone != "" };
    };
  };

  // ─── Twin Versions ────────────────────────────────────────────────────────────────

  public shared ({ caller }) func saveTwinVersion(versionName : Text, pm : Float, em : Float, rrm : Float, iai : Float, sis : Float, edi : Float, notes : Text) : async Text {
    let id = generateId();
    let userId = caller.toText();
    twinVersions.add(id, { id; userId; versionName; pm; em; rrm; iai; sis; edi; createdAt = Time.now(); notes });
    id;
  };

  public query ({ caller }) func getTwinVersions() : async [TwinVersion] {
    let uid = caller.toText();
    twinVersions.values().toArray().filter(func(t) = t.userId == uid).sort(func(a, b) = Int.compare(b.createdAt, a.createdAt));
  };

  public shared ({ caller }) func deleteTwinVersion(id : Text) : async () {
    let uid = caller.toText();
    switch (twinVersions.get(id)) {
      case (?t) {
        if (t.userId == uid) { twinVersions.remove(id) };
      };
      case (null) {};
    };
  };

  public shared ({ caller }) func renameTwinVersion(id : Text, newName : Text) : async () {
    let uid = caller.toText();
    switch (twinVersions.get(id)) {
      case (?t) {
        if (t.userId == uid) {
          twinVersions.add(id, { t with versionName = newName });
        };
      };
      case (null) {};
    };
  };

  // ─── Registered Assessments ─────────────────────────────────────────────────────────

  public shared ({ caller }) func submitRegisteredAssessment(responses : [Int], dimensionScores : DimensionScores, archetype : Text, decisionForceLevel : Text) : async Text {
    if (responses.size() != 36) Runtime.trap("Responses must have 36 elements");
    let id = generateId();
    let userId = caller.toText();
    registeredAssessments.add(id, { id; userId; responses; dimensionScores; archetype; decisionForceLevel; timestamp = Time.now() });
    id;
  };

  public shared ({ caller }) func submitAssessmentWithText(responses : [Int], textResponses : [Text], dimensionScores : DimensionScores, archetype : Text, decisionForceLevel : Text) : async Text {
    if (responses.size() != 36) Runtime.trap("Responses must have 36 elements");
    let id = generateId();
    let userId = caller.toText();
    registeredAssessments.add(id, { id; userId; responses; dimensionScores; archetype; decisionForceLevel; timestamp = Time.now() });
    assessmentTextResponses.add(id, { assessmentId = id; userId; textResponses; timestamp = Time.now() });
    id;
  };

  public query ({ caller }) func getUserAssessments() : async [RegisteredAssessment] {
    let uid = caller.toText();
    registeredAssessments.values().toArray().filter(func(a) = a.userId == uid).sort(func(a, b) = Int.compare(b.timestamp, a.timestamp));
  };

  public query ({ caller }) func getAssessmentTextResponses(assessmentId : Text) : async ?AssessmentTextResponses {
    let uid = caller.toText();
    switch (assessmentTextResponses.get(assessmentId)) {
      case (?r) { if (r.userId == uid) ?r else null };
      case (null) { null };
    };
  };

  // ─── Decision Log ────────────────────────────────────────────────────────────────

  public shared ({ caller }) func logDecision(scenario : Text, twinVersionUsed : Text, decisionOutcome : Text, actualOutcome : Text) : async Text {
    let id = generateId();
    let userId = caller.toText();
    decisionLogs.add(id, { id; userId; scenario; twinVersionUsed; decisionOutcome; actualOutcome; timestamp = Time.now() });
    id;
  };

  public query ({ caller }) func getDecisionLog() : async [DecisionLog] {
    let uid = caller.toText();
    decisionLogs.values().toArray().filter(func(d) = d.userId == uid).sort(func(a, b) = Int.compare(b.timestamp, a.timestamp));
  };

  // ─── Journal Entries ────────────────────────────────────────────────────────────────

  public shared ({ caller }) func saveJournalEntry(title : Text, entryType : Text, blobUrl : Text, transcript : Text) : async Text {
    let id = generateId();
    let userId = caller.toText();
    journalEntries.add(id, { id; userId; title; entryType; blobUrl; transcript; aiAnalysis = ""; dimensionSignals = ""; timestamp = Time.now() });
    id;
  };

  public query ({ caller }) func getUserJournalEntries() : async [JournalEntry] {
    let uid = caller.toText();
    journalEntries.values().toArray().filter(func(e) = e.userId == uid).sort(func(a, b) = Int.compare(b.timestamp, a.timestamp));
  };

  public shared ({ caller }) func updateJournalEntry(id : Text, title : Text, aiAnalysis : Text, dimensionSignals : Text) : async () {
    let uid = caller.toText();
    switch (journalEntries.get(id)) {
      case (?e) {
        if (e.userId == uid) {
          journalEntries.add(id, { e with title; aiAnalysis; dimensionSignals });
        };
      };
      case (null) {};
    };
  };

  public shared ({ caller }) func deleteJournalEntry(id : Text) : async () {
    let uid = caller.toText();
    switch (journalEntries.get(id)) {
      case (?e) {
        if (e.userId == uid) { journalEntries.remove(id) };
      };
      case (null) {};
    };
  };

  // ─── OpenAI Configuration ────────────────────────────────────────────────────────────

  public shared func setOpenAIApiKey(key : Text) : async () {
    let isAdmin = await isCallerAdmin();
    if (not isAdmin) Runtime.trap("Unauthorized");
    openaiApiKey := key;
  };

  public shared func getOpenAIApiKey() : async Text {
    let isAdmin = await isCallerAdmin();
    if (not isAdmin) Runtime.trap("Unauthorized");
    if (openaiApiKey.size() > 0) {
      "Key is configured (hidden for security)"
    } else {
      "not set"
    };
  };

  // ─── AI Analysis via HTTP Outcalls ───────────────────────────────────────────────────────

  public query func transformHttpResponse(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    Outcall.transform(input);
  };

  public shared ({ caller }) func analyzeText(text : Text, contextHint : Text) : async Text {
    if (openaiApiKey == "") {
      return "AI analysis not configured. Please set the OpenAI API key.";
    };
    let systemPrompt = "You are a Decision Intelligence analyst trained on the HDA-DCFM (Human Decision Architecture - Dynamic Cognitive Field Manifold) framework. Analyze the provided text and return a JSON response with: {\"sentiment\": \"positive|neutral|negative\", \"emotionTone\": \"calm|anxious|confident|conflicted|energized|drained\", \"dcfmSignals\": {\"pm\": 0-10, \"em\": 0-10, \"rrm\": 0-10, \"iai\": 0-10, \"sis\": 0-10, \"edi\": 0-10}, \"keyThemes\": [\"theme1\", \"theme2\"], \"coachingInsight\": \"one sentence insight\"}. Context: " # contextHint;
    let requestBody = "{\"model\": \"gpt-4o-mini\", \"messages\": [{\"role\": \"system\", \"content\": \"" # systemPrompt # "\"}, {\"role\": \"user\", \"content\": \"" # text # "\"}], \"max_tokens\": 300}";
    let headers = [
      { name = "Content-Type"; value = "application/json" },
      { name = "Authorization"; value = "Bearer " # openaiApiKey },
    ];
    try {
      await Outcall.httpPostRequest(
        "https://api.openai.com/v1/chat/completions",
        headers,
        requestBody,
        transformHttpResponse,
      );
    } catch (_) {
      "Analysis temporarily unavailable";
    };
  };

  // ─── Admin Functions ────────────────────────────────────────────────────────────────

  public shared func getAllUserProfiles() : async [UserProfile] {
    let isAdmin = await isCallerAdmin();
    if (not isAdmin) Runtime.trap("Unauthorized");
    userProfiles.values().toArray().sort(func(a, b) = Int.compare(b.createdAt, a.createdAt));
  };

  public shared func getUserActivitySummary(userId : Text) : async UserActivitySummary {
    let isAdmin = await isCallerAdmin();
    if (not isAdmin) Runtime.trap("Unauthorized");
    let profile = switch (userProfiles.get(userId)) {
      case (?p) { p };
      case (null) { Runtime.trap("User not found") };
    };
    let assessments = registeredAssessments.values().toArray().filter(func(a) = a.userId == userId);
    let twins = twinVersions.values().toArray().filter(func(t) = t.userId == userId);
    let logs = decisionLogs.values().toArray().filter(func(d) = d.userId == userId);
    let journals = journalEntries.values().toArray().filter(func(e) = e.userId == userId);
    { profile; assessments; twinVersions = twins; decisionLogs = logs; journalEntries = journals };
  };

  public shared func getPlatformStats() : async PlatformStats {
    let isAdmin = await isCallerAdmin();
    if (not isAdmin) Runtime.trap("Unauthorized");
    {
      totalUsers = Nat32.fromNat(userProfiles.size());
      totalAssessments = Nat32.fromNat(registeredAssessments.size());
      totalTwins = Nat32.fromNat(twinVersions.size());
      totalDecisionLogs = Nat32.fromNat(decisionLogs.size());
      totalJournalEntries = Nat32.fromNat(journalEntries.size());
    };
  };
};
