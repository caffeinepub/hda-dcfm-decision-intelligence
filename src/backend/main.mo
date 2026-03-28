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
  var demoDataSeeded : Bool = false;

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
    // Auto-assign admin role for the super admin email
    if (email == "sathishsampath@gmail.com") {
      AccessControl.assignRole(accessControlState, caller, caller, #admin);
    };
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

  // ─── Demo Data Seeding ─────────────────────────────────────────────────────────────

  public shared func seedDemoData() : async Text {
    let isAdmin = await isCallerAdmin();
    if (not isAdmin) Runtime.trap("Unauthorized");
    if (demoDataSeeded) return "already_seeded";

    let baseTime = Time.now();
    let dayNs : Int = 86_400_000_000_000;

    type Profile = { id: Text; name: Text; country: Text; phone: Text; email: Text; pm: Float; em: Float; rrm: Float; iai: Float; sis: Float; edi: Float; archetype: Text; dfl: Text; versions: [(Text, Float, Float, Float, Float, Float, Float)]; scenarios: [(Text, Text)]; journalTypes: [Text] };

    let profiles : [Profile] = [
      { id="demo_01"; name="Arjun Mehta"; country="India"; phone="+91-9876543210"; email="arjun.mehta@demo.com"; pm=6.8; em=3.2; rrm=7.0; iai=6.5; sis=4.1; edi=7.0; archetype="Sovereign Navigator"; dfl="High"; versions=[("Current Me",6.8,3.2,7.0,6.5,4.1,7.0),("Future Me",7.0,2.5,7.5,7.0,3.5,7.5)]; scenarios=[("Should I expand my business to SE Asia?","Decided — High confidence")]; journalTypes=["video","text"] },
      { id="demo_02"; name="Priya Sharma"; country="India"; phone="+91-9123456789"; email="priya.sharma@demo.com"; pm=4.5; em=6.8; rrm=3.2; iai=5.5; sis=7.0; edi=3.8; archetype="Empathic Sentinel"; dfl="Medium"; versions=[("Current Me",4.5,6.8,3.2,5.5,7.0,3.8),("Calm Me",4.5,4.5,4.0,5.5,5.5,5.0)]; scenarios=[("My manager criticized my work publicly — how do I respond?","Paused — needs emotional grounding")]; journalTypes=["audio","text"] },
      { id="demo_03"; name="David Chen"; country="Singapore"; phone="+65-91234567"; email="david.chen@demo.com"; pm=7.2; em=2.8; rrm=6.5; iai=7.5; sis=3.0; edi=6.8; archetype="Sovereign Navigator"; dfl="High"; versions=[("Current Me",7.2,2.8,6.5,7.5,3.0,6.8),("Bold Me",7.5,2.0,7.0,8.0,2.5,7.5)]; scenarios=[("Acquire a competitor or build in-house?","Decided — Strategic acquisition")]; journalTypes=["video"] },
      { id="demo_04"; name="Sarah Mitchell"; country="United Kingdom"; phone="+44-7700900123"; email="sarah.m@demo.com"; pm=5.0; em=5.5; rrm=5.0; iai=5.0; sis=5.5; edi=5.0; archetype="Adaptive Harmonizer"; dfl="Medium"; versions=[("Current Me",5.0,5.5,5.0,5.0,5.5,5.0)]; scenarios=[("Should I take the leadership role or stay in my niche?","Hesitating — identity conflict")]; journalTypes=["text","audio"] },
      { id="demo_05"; name="Mohammed Al-Rashid"; country="UAE"; phone="+971-501234567"; email="m.alrashid@demo.com"; pm=6.2; em=4.0; rrm=5.8; iai=6.0; sis=5.2; edi=6.5; archetype="Decisive Executor"; dfl="High"; versions=[("Current Me",6.2,4.0,5.8,6.0,5.2,6.5),("Future Me",7.0,3.0,6.5,7.0,4.0,7.5)]; scenarios=[("Launch new product line this quarter or wait 6 months?","Decided — Launch now")]; journalTypes=["video","audio"] },
      { id="demo_06"; name="Anika Patel"; country="India"; phone="+91-9812345678"; email="anika.patel@demo.com"; pm=3.5; em=7.2; rrm=2.8; iai=4.0; sis=7.5; edi=2.5; archetype="Reactive Empath"; dfl="Low"; versions=[("Current Me",3.5,7.2,2.8,4.0,7.5,2.5),("Growth Me",4.5,5.5,4.0,5.0,6.0,4.5)]; scenarios=[("My co-founder wants to pivot the product — agree or disagree?","Deferred — seeking social validation")]; journalTypes=["audio","text","video"] },
      { id="demo_07"; name="James Okafor"; country="Nigeria"; phone="+234-8012345678"; email="j.okafor@demo.com"; pm=6.5; em=3.8; rrm=6.0; iai=5.8; sis=4.5; edi=7.2; archetype="Decisive Executor"; dfl="High"; versions=[("Current Me",6.5,3.8,6.0,5.8,4.5,7.2)]; scenarios=[("Hire fast or stay lean during growth phase?","Decided — Hire strategically")]; journalTypes=["text"] },
      { id="demo_08"; name="Elena Kozlov"; country="Russia"; phone="+7-9123456789"; email="e.kozlov@demo.com"; pm=5.8; em=4.2; rrm=5.5; iai=6.2; sis=4.0; edi=5.5; archetype="Balanced Strategist"; dfl="Medium"; versions=[("Current Me",5.8,4.2,5.5,6.2,4.0,5.5),("Analytical Me",6.5,3.0,6.5,7.0,3.0,6.0)]; scenarios=[("Should I relocate my family for a better career?","Decided — Career move with family plan")]; journalTypes=["audio"] },
      { id="demo_09"; name="Carlos Rivera"; country="Mexico"; phone="+52-5512345678"; email="c.rivera@demo.com"; pm=4.8; em=6.0; rrm=4.5; iai=5.2; sis=6.5; edi=4.2; archetype="Social Harmonizer"; dfl="Medium"; versions=[("Current Me",4.8,6.0,4.5,5.2,6.5,4.2)]; scenarios=[("Should I confront my business partner about performance?","Hesitating — social fear override")]; journalTypes=["text","video"] },
      { id="demo_10"; name="Yuki Tanaka"; country="Japan"; phone="+81-9012345678"; email="y.tanaka@demo.com"; pm=7.0; em=2.5; rrm=7.2; iai=7.8; sis=2.8; edi=6.2; archetype="Sovereign Navigator"; dfl="High"; versions=[("Current Me",7.0,2.5,7.2,7.8,2.8,6.2),("Disciplined Me",7.5,2.0,8.0,8.0,2.0,7.0)]; scenarios=[("Invest in AI R&D or customer acquisition?","Decided — AI R&D with 5yr horizon")]; journalTypes=["video","audio"] },
      { id="demo_11"; name="Rania Hassan"; country="Egypt"; phone="+20-1012345678"; email="r.hassan@demo.com"; pm=5.2; em=5.8; rrm=4.8; iai=5.0; sis=6.2; edi=4.5; archetype="Adaptive Harmonizer"; dfl="Medium"; versions=[("Current Me",5.2,5.8,4.8,5.0,6.2,4.5)]; scenarios=[("Should I start a side business while employed?","Deferred — risk aversion")]; journalTypes=["audio"] },
      { id="demo_12"; name="Sven Larsson"; country="Sweden"; phone="+46-701234567"; email="s.larsson@demo.com"; pm=6.8; em=3.0; rrm=6.5; iai=6.8; sis=3.5; edi=7.0; archetype="Decisive Executor"; dfl="High"; versions=[("Current Me",6.8,3.0,6.5,6.8,3.5,7.0),("Calm Me",6.5,3.5,6.0,6.5,4.0,6.5)]; scenarios=[("Restructure team after poor Q1?","Decided — Restructure with empathy")]; journalTypes=["text","video"] },
      { id="demo_13"; name="Amara Diallo"; country="Senegal"; phone="+221-701234567"; email="a.diallo@demo.com"; pm=4.2; em=6.5; rrm=3.8; iai=4.5; sis=7.2; edi=3.5; archetype="Reactive Empath"; dfl="Low"; versions=[("Current Me",4.2,6.5,3.8,4.5,7.2,3.5),("Empowered Me",5.5,4.5,5.0,6.0,5.5,5.5)]; scenarios=[("Leave NGO for corporate sector?","Hesitating — identity fear")]; journalTypes=["video"] },
      { id="demo_14"; name="Rachel Kim"; country="South Korea"; phone="+82-1012345678"; email="r.kim@demo.com"; pm=6.0; em=4.5; rrm=5.8; iai=6.5; sis=4.8; edi=6.0; archetype="Balanced Strategist"; dfl="High"; versions=[("Current Me",6.0,4.5,5.8,6.5,4.8,6.0),("Future Me",7.0,3.5,6.5,7.5,3.5,7.0)]; scenarios=[("Take CEO role at 29 or gain more experience?","Decided — Take the role with mentors")]; journalTypes=["audio","video"] },
      { id="demo_15"; name="Omar Farouk"; country="Pakistan"; phone="+92-3012345678"; email="o.farouk@demo.com"; pm=5.5; em=5.0; rrm=5.2; iai=5.5; sis=5.0; edi=5.8; archetype="Balanced Strategist"; dfl="Medium"; versions=[("Current Me",5.5,5.0,5.2,5.5,5.0,5.8)]; scenarios=[("Open second location or double down on flagship?","Deferred — data gathering phase")]; journalTypes=["text"] },
      { id="demo_16"; name="Isabella Ferreira"; country="Brazil"; phone="+55-11912345678"; email="i.ferreira@demo.com"; pm=5.8; em=5.5; rrm=5.0; iai=6.0; sis=5.8; edi=5.2; archetype="Adaptive Harmonizer"; dfl="Medium"; versions=[("Current Me",5.8,5.5,5.0,6.0,5.8,5.2),("Bold Me",6.5,4.0,6.0,7.0,4.5,6.5)]; scenarios=[("Raise seed funding or bootstrap?","Decided — Bootstrap for 12 months")]; journalTypes=["audio","text"] },
      { id="demo_17"; name="Kwame Asante"; country="Ghana"; phone="+233-201234567"; email="k.asante@demo.com"; pm=6.5; em=3.5; rrm=6.2; iai=6.8; sis=3.8; edi=6.5; archetype="Sovereign Navigator"; dfl="High"; versions=[("Current Me",6.5,3.5,6.2,6.8,3.8,6.5),("Diplomatic Me",6.0,4.5,5.8,6.5,5.0,6.0)]; scenarios=[("Partner with government or stay private sector?","Decided — Strategic govt. partnership")]; journalTypes=["video","text"] },
      { id="demo_18"; name="Nina Volkova"; country="Ukraine"; phone="+380-671234567"; email="n.volkova@demo.com"; pm=4.0; em=6.8; rrm=3.5; iai=4.2; sis=7.0; edi=3.2; archetype="Reactive Empath"; dfl="Low"; versions=[("Current Me",4.0,6.8,3.5,4.2,7.0,3.2)]; scenarios=[("Rebuild career post-crisis or pivot completely?","Hesitating — emotional overload")]; journalTypes=["audio","video"] },
      { id="demo_19"; name="Lucas Muller"; country="Germany"; phone="+49-1512345678"; email="l.muller@demo.com"; pm=7.2; em=2.5; rrm=7.0; iai=7.5; sis=2.5; edi=7.2; archetype="Sovereign Navigator"; dfl="High"; versions=[("Current Me",7.2,2.5,7.0,7.5,2.5,7.2),("Risk Me",7.8,2.0,7.5,8.0,2.0,8.0)]; scenarios=[("Shut down a $2M product line that conflicts with brand values?","Decided — Strategic shutdown")]; journalTypes=["text","audio","video"] },
      { id="demo_20"; name="Fatima Zahra"; country="Morocco"; phone="+212-612345678"; email="f.zahra@demo.com"; pm=5.0; em=6.0; rrm=4.5; iai=5.2; sis=6.8; edi=4.0; archetype="Social Harmonizer"; dfl="Medium"; versions=[("Current Me",5.0,6.0,4.5,5.2,6.8,4.0),("Strong Me",5.8,4.5,5.5,6.0,5.5,5.5)]; scenarios=[("Decline a high-paying job that conflicts with personal values?","Decided — Values over money")]; journalTypes=["audio"] },
      { id="demo_21"; name="Aditya Nair"; country="India"; phone="+91-9934567890"; email="a.nair@demo.com"; pm=6.0; em=4.8; rrm=5.5; iai=6.2; sis=4.5; edi=6.8; archetype="Decisive Executor"; dfl="High"; versions=[("Current Me",6.0,4.8,5.5,6.2,4.5,6.8),("Founder Mode",7.0,3.5,6.5,7.0,3.5,7.5)]; scenarios=[("Fire a high performer with toxic behavior?","Decided — Performance exit with care")]; journalTypes=["video","text"] },
      { id="demo_22"; name="Olga Petrov"; country="Poland"; phone="+48-501234567"; email="o.petrov@demo.com"; pm=5.5; em=4.5; rrm=5.8; iai=5.5; sis=4.2; edi=6.0; archetype="Balanced Strategist"; dfl="Medium"; versions=[("Current Me",5.5,4.5,5.8,5.5,4.2,6.0)]; scenarios=[("Launch in EU market before product is 'perfect'?","Decided — Launch with v1")]; journalTypes=["text"] },
      { id="demo_23"; name="Marcus Johnson"; country="United States"; phone="+1-4151234567"; email="m.johnson@demo.com"; pm=6.5; em=3.8; rrm=6.2; iai=6.8; sis=4.0; edi=6.5; archetype="Decisive Executor"; dfl="High"; versions=[("Current Me",6.5,3.8,6.2,6.8,4.0,6.5),("Visionary Me",7.0,3.0,7.0,7.5,3.0,7.0)]; scenarios=[("Take Series A now or wait for better valuation?","Decided — Take A, optimize for speed")]; journalTypes=["audio","video"] },
      { id="demo_24"; name="Divya Krishnan"; country="India"; phone="+91-9856789012"; email="d.krishnan@demo.com"; pm=4.8; em=5.8; rrm=4.5; iai=5.0; sis=6.0; edi=4.8; archetype="Adaptive Harmonizer"; dfl="Medium"; versions=[("Current Me",4.8,5.8,4.5,5.0,6.0,4.8),("Empowered Me",5.8,4.5,5.5,6.0,5.0,6.0)]; scenarios=[("Accept promotion that requires relocating away from family?","Deferred — family alignment needed")]; journalTypes=["audio","text","video"] },
      { id="demo_25"; name="Tariq Al-Mansouri"; country="Saudi Arabia"; phone="+966-501234567"; email="t.mansouri@demo.com"; pm=6.8; em=3.5; rrm=6.5; iai=7.0; sis=3.5; edi=7.5; archetype="Sovereign Navigator"; dfl="High"; versions=[("Current Me",6.8,3.5,6.5,7.0,3.5,7.5),("Conservative Me",6.0,4.0,5.8,6.5,4.0,6.5)]; scenarios=[("Diversify portfolio into tech startups or stick to real estate?","Decided — Tech portfolio entry")]; journalTypes=["video"] },
      { id="demo_26"; name="Mei Lin"; country="China"; phone="+86-13812345678"; email="m.lin@demo.com"; pm=6.2; em=3.8; rrm=6.0; iai=6.5; sis=3.8; edi=6.2; archetype="Balanced Strategist"; dfl="High"; versions=[("Current Me",6.2,3.8,6.0,6.5,3.8,6.2),("Future Me",7.0,3.0,7.0,7.5,3.0,7.0)]; scenarios=[("Enter Western markets or dominate APAC first?","Decided — APAC dominance first")]; journalTypes=["text","audio"] },
      { id="demo_27"; name="Kofi Mensah"; country="Ghana"; phone="+233-244567890"; email="k.mensah@demo.com"; pm=3.8; em=7.0; rrm=3.2; iai=4.0; sis=7.5; edi=3.0; archetype="Reactive Empath"; dfl="Low"; versions=[("Current Me",3.8,7.0,3.2,4.0,7.5,3.0),("Resilient Me",5.0,5.0,5.0,5.5,5.5,5.0)]; scenarios=[("Leave stable government job for entrepreneurship?","Hesitating — fear of failure dominant")]; journalTypes=["audio"] },
      { id="demo_28"; name="Anna Bergstrom"; country="Sweden"; phone="+46-731234567"; email="a.bergstrom@demo.com"; pm=6.5; em=4.0; rrm=5.8; iai=6.0; sis=4.5; edi=6.5; archetype="Decisive Executor"; dfl="High"; versions=[("Current Me",6.5,4.0,5.8,6.0,4.5,6.5),("Measured Me",6.0,4.5,5.5,5.8,5.0,6.0)]; scenarios=[("Fire underperforming board member?","Decided — With clear criteria defined")]; journalTypes=["video","text"] },
      { id="demo_29"; name="Raj Patel"; country="India"; phone="+91-9701234567"; email="raj.patel@demo.com"; pm=7.5; em=2.2; rrm=7.5; iai=8.0; sis=2.0; edi=7.8; archetype="Sovereign Navigator"; dfl="High"; versions=[("Current Me",7.5,2.2,7.5,8.0,2.0,7.8),("Balanced Me",6.5,3.5,6.5,7.0,3.5,7.0)]; scenarios=[("Exit current company and build in AI space?","Decided — Exit with 18-month plan")]; journalTypes=["video","audio","text"] },
      { id="demo_30"; name="Sofia Esposito"; country="Italy"; phone="+39-3312345678"; email="s.esposito@demo.com"; pm=5.2; em=5.8; rrm=4.8; iai=5.5; sis=6.0; edi=5.0; archetype="Adaptive Harmonizer"; dfl="Medium"; versions=[("Current Me",5.2,5.8,4.8,5.5,6.0,5.0)]; scenarios=[("Scale family business globally or maintain Italian identity?","Deferred — values research ongoing")]; journalTypes=["audio"] },
      { id="demo_31"; name="Henry Osei"; country="Nigeria"; phone="+234-9012345678"; email="h.osei@demo.com"; pm=6.0; em=4.2; rrm=5.5; iai=6.2; sis=4.8; edi=6.5; archetype="Balanced Strategist"; dfl="High"; versions=[("Current Me",6.0,4.2,5.5,6.2,4.8,6.5),("Executive Me",7.0,3.0,6.5,7.0,3.5,7.5)]; scenarios=[("Negotiate equity or salary first in new role?","Decided — Equity with vesting milestones")]; journalTypes=["text","video"] },
      { id="demo_32"; name="Leila Ahmadi"; country="Iran"; phone="+98-9121234567"; email="l.ahmadi@demo.com"; pm=4.5; em=6.2; rrm=4.0; iai=4.8; sis=6.8; edi=4.0; archetype="Social Harmonizer"; dfl="Medium"; versions=[("Current Me",4.5,6.2,4.0,4.8,6.8,4.0),("Independent Me",5.5,4.5,5.5,6.0,5.0,5.5)]; scenarios=[("Build startup in home country vs emigrate for better ecosystem?","Hesitating — loyalty vs opportunity")]; journalTypes=["audio","text"] },
      { id="demo_33"; name="Thomas Ndlovu"; country="Zimbabwe"; phone="+263-771234567"; email="t.ndlovu@demo.com"; pm=5.8; em=4.5; rrm=5.5; iai=6.0; sis=4.8; edi=6.0; archetype="Balanced Strategist"; dfl="Medium"; versions=[("Current Me",5.8,4.5,5.5,6.0,4.8,6.0),("Focused Me",6.5,3.5,6.0,7.0,4.0,7.0)]; scenarios=[("Prioritize impact or profitability in year 1?","Decided — Impact-led with revenue model")]; journalTypes=["text"] },
      { id="demo_34"; name="Priya Venkatesh"; country="India"; phone="+91-9945678901"; email="p.venkatesh@demo.com"; pm=6.5; em=4.0; rrm=6.0; iai=6.5; sis=4.2; edi=6.8; archetype="Decisive Executor"; dfl="High"; versions=[("Current Me",6.5,4.0,6.0,6.5,4.2,6.8),("Visionary Me",7.0,3.0,7.0,7.5,3.5,7.5)]; scenarios=[("Build product team in India vs hire US engineers?","Decided — India-first with global lead")]; journalTypes=["video","audio"] },
      { id="demo_35"; name="Felix Wagner"; country="Germany"; phone="+49-1761234567"; email="f.wagner@demo.com"; pm=7.0; em=2.8; rrm=6.8; iai=7.2; sis=2.8; edi=7.5; archetype="Sovereign Navigator"; dfl="High"; versions=[("Current Me",7.0,2.8,6.8,7.2,2.8,7.5),("Balanced Me",6.5,3.5,6.5,6.8,3.5,7.0)]; scenarios=[("Acquire a healthtech startup for €15M — yes or no?","Decided — Acquire with integration plan")]; journalTypes=["text","audio","video"] },
    ];

    var idx : Int = 0;
    for (p in profiles.vals()) {
      let t = baseTime - (idx * dayNs * 3);
      idCounter += 1;
      let pid = p.id;
      userProfiles.add(pid, { principalId = pid; name = p.name; country = p.country; phone = p.phone; email = p.email; createdAt = t });

      let responses = [1, 5, 6, 3, 7, 4, 2, 6, 5, 7, 3, 4, 6, 5, 7, 2, 6, 4, 5, 7, 3, 6, 4, 5, 7, 2, 5, 6, 4, 3, 7, 5, 6, 4, 2, 7];
      let aId = pid # "_a1";
      registeredAssessments.add(aId, { id = aId; userId = pid; responses; dimensionScores = { pm = p.pm; em = p.em; rrm = p.rrm; iai = p.iai; sis = p.sis; edi = p.edi }; archetype = p.archetype; decisionForceLevel = p.dfl; timestamp = t });

      var vIdx : Int = 0;
      for (v in p.versions.vals()) {
        let (vName, vPm, vEm, vRrm, vIai, vSis, vEdi) = v;
        let vId = pid # "_v" # vIdx.toText();
        twinVersions.add(vId, { id = vId; userId = pid; versionName = vName; pm = vPm; em = vEm; rrm = vRrm; iai = vIai; sis = vSis; edi = vEdi; createdAt = t - (vIdx * dayNs); notes = "" });
        vIdx += 1;
      };

      var sIdx : Int = 0;
      for (s in p.scenarios.vals()) {
        let (scenario, outcome) = s;
        let dId = pid # "_d" # sIdx.toText();
        decisionLogs.add(dId, { id = dId; userId = pid; scenario; twinVersionUsed = pid # "_v0"; decisionOutcome = outcome; actualOutcome = ""; timestamp = t - (sIdx * dayNs * 2) });
        sIdx += 1;
      };

      var jIdx : Int = 0;
      for (jType in p.journalTypes.vals()) {
        let jId = pid # "_j" # jIdx.toText();
        let jTitle = switch (jIdx) {
          case 0 { "Day Reflection — " # p.name };
          case 1 { "Weekly Review" };
          case _ { "Growth Journal" };
        };
        let jTranscript = switch (jType) {
          case "video" { "Recorded a video entry about key decisions and emotional state this week. Noted strong resolve and clarity in priority areas." };
          case "audio" { "Audio reflection: felt grounded today. Noticed hesitation before committing to major decisions but overcame with structured thinking." };
          case _ { "Today I reflected on my key priorities. The DCFM framework helped me understand why I was hesitating — it was primarily low EDI score creating execution drag." };
        };
        journalEntries.add(jId, { id = jId; userId = pid; title = jTitle; entryType = jType; blobUrl = ""; transcript = jTranscript; aiAnalysis = "Positive emotional regulation. High identity alignment. Execution signals improving."; dimensionSignals = "PM:high,EM:moderate,EDI:growing"; timestamp = t - (jIdx * dayNs) });
        jIdx += 1;
      };

      idx += 1;
    };

    demoDataSeeded := true;
    "seeded_35_profiles";
  };

};