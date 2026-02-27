

actor {
  public type CoatingType = { #single; #double; #doubleSagwanpatti; #laminate };

  public type CoatingRate = {
    coatingType : CoatingType;
    rate : Nat;
  };

  var singleRate : Nat = 0;
  var doubleRate : Nat = 0;
  var doubleSagwanpattiRate : Nat = 0;
  var laminateRate : Nat = 0;

  // Update a single rate for one coating type (update for admin FP).
  public shared ({ caller }) func updateCoatingRate(coatingType : CoatingType, newRate : Nat) : async () {
    switch (coatingType) {
      case (#single) { singleRate := newRate };
      case (#double) { doubleRate := newRate };
      case (#doubleSagwanpatti) { doubleSagwanpattiRate := newRate };
      case (#laminate) { laminateRate := newRate };
    };
  };

  public query ({ caller }) func getSingleRate() : async Nat {
    singleRate;
  };

  public query ({ caller }) func getDoubleRate() : async Nat {
    doubleRate;
  };

  public query ({ caller }) func getDoubleSagwanpattiRate() : async Nat {
    doubleSagwanpattiRate;
  };

  public query ({ caller }) func getLaminateRate() : async Nat {
    laminateRate;
  };

  public query ({ caller }) func getCoatingRate(coatingType : CoatingType) : async Nat {
    switch (coatingType) {
      case (#single) { singleRate };
      case (#double) { doubleRate };
      case (#doubleSagwanpatti) { doubleSagwanpattiRate };
      case (#laminate) { laminateRate };
    };
  };
};

