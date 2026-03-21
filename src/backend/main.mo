import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

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

  // ─── Types ────────────────────────────────────────────────────────────────

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

  type DecisionLog = {
    id : Text;
    userId : Text;
    scenario : Text;
    twinVersionUsed : Text;
    decisionOutcome : Text;
    actualOutcome : Text;
    timestamp : Time.Time;
  };

  type UserActivitySummary = {
    profile : UserProfile;
    assessments : [RegisteredAssessment];
    twinVersions : [TwinVersion];
    decisionLogs : [DecisionLog];
  };

  type PlatformStats = {
    totalUsers : Nat32;
    totalAssessments : Nat32;
    totalTwins : Nat32;
    totalDecisionLogs : Nat32;
  };

  // ─── State ────────────────────────────────────────────────────────────────

  let anonResults = Map.empty<Text, AssessmentResult>();
  let userProfiles = Map.empty<Text, UserProfile>();
  let twinVersions = Map.empty<Text, TwinVersion>();
  let registeredAssessments = Map.empty<Text, RegisteredAssessment>();
  let decisionLogs = Map.empty<Text, DecisionLog>();

  var idCounter : Nat32 = 0;

  func generateId() : Text {
    idCounter += 1;
    Time.now().toText() # "_" # idCounter.toText();
  };

  // ─── Anonymous Assessment ─────────────────────────────────────────────────

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

  // ─── User Profiles ────────────────────────────────────────────────────────

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

  // ─── Twin Versions ────────────────────────────────────────────────────────

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
        if (t.userId == uid) { ignore twinVersions.remove(id) };
      };
      case (null) {};
    };
  };

  // ─── Registered Assessments ───────────────────────────────────────────────

  public shared ({ caller }) func submitRegisteredAssessment(responses : [Int], dimensionScores : DimensionScores, archetype : Text, decisionForceLevel : Text) : async Text {
    if (responses.size() != 36) Runtime.trap("Responses must have 36 elements");
    let id = generateId();
    let userId = caller.toText();
    registeredAssessments.add(id, { id; userId; responses; dimensionScores; archetype; decisionForceLevel; timestamp = Time.now() });
    id;
  };

  public query ({ caller }) func getUserAssessments() : async [RegisteredAssessment] {
    let uid = caller.toText();
    registeredAssessments.values().toArray().filter(func(a) = a.userId == uid).sort(func(a, b) = Int.compare(b.timestamp, a.timestamp));
  };

  // ─── Decision Log ─────────────────────────────────────────────────────────

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

  // ─── Admin Functions ──────────────────────────────────────────────────────

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
    { profile; assessments; twinVersions = twins; decisionLogs = logs };
  };

  public shared func getPlatformStats() : async PlatformStats {
    let isAdmin = await isCallerAdmin();
    if (not isAdmin) Runtime.trap("Unauthorized");
    {
      totalUsers = Nat32.fromNat(userProfiles.size());
      totalAssessments = Nat32.fromNat(registeredAssessments.size());
      totalTwins = Nat32.fromNat(twinVersions.size());
      totalDecisionLogs = Nat32.fromNat(decisionLogs.size());
    };
  };
};
