import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type OldMenuItem = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    imageUrl : Text;
  };
  type OldActor = {
    menu : Map.Map<Nat, OldMenuItem>;
  };

  type NewMenuItem = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    imageUrl : Text;
    available : Bool;
  };
  type NewActor = {
    menu : Map.Map<Nat, NewMenuItem>;
  };

  public func run(old : OldActor) : NewActor {
    let newMenu = old.menu.map<Nat, OldMenuItem, NewMenuItem>(
      func(_id, oldItem) {
        { oldItem with available = true };
      }
    );
    { menu = newMenu };
  };
};
