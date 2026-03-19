import Time "mo:core/Time";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Nat32 "mo:core/Nat32";

actor {
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

  module AssessmentResult {
    public func compareByTimestampAsc(result1 : AssessmentResult, result2 : AssessmentResult) : Order.Order {
      Int.compare(result1.timestamp, result2.timestamp);
    };
    public func compareByTimestampDesc(result1 : AssessmentResult, result2 : AssessmentResult) : Order.Order {
      Int.compare(result2.timestamp, result1.timestamp);
    };
  };

  let results = Map.empty<Text, AssessmentResult>();

  var nextIdCounter : Nat32 = 0;

  public query ({ caller }) func getAssessmentResult(id : Text) : async AssessmentResult {
    switch (results.get(id)) {
      case (null) { Runtime.trap("Result does not exist") };
      case (?result) { result };
    };
  };

  public query ({ caller }) func getRecentResults() : async [AssessmentResult] {
    results.values().toArray().sort(AssessmentResult.compareByTimestampDesc).sliceToArray(0, 20);
  };

  func generateUniqueId() : Text {
    nextIdCounter += 1;
    let timestamp = Time.now();
    timestamp.toText() # "_" # nextIdCounter.toText();
  };

  public shared ({ caller }) func submitAssessment(responses : [Int], dimensionScores : DimensionScores, archetype : Text, decisionForceLevel : Text) : async Text {
    if (responses.size() != 36) {
      Runtime.trap("Responses array must have 36 elements");
    };

    let id = generateUniqueId();
    let result : AssessmentResult = {
      id;
      responses;
      dimensionScores;
      archetype;
      decisionForceLevel;
      timestamp = Time.now();
    };

    results.add(id, result);
    id;
  };
};
