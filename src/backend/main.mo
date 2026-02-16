import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Migration "migration";

(with migration = Migration.run)
actor {
  public type MenuItem = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    imageUrl : Text;
    available : Bool;
  };

  public type Order = {
    id : Nat;
    user : Principal;
    items : [OrderItem];
    totalPrice : Nat;
    timestamp : Time.Time;
    status : OrderStatus;
  };

  public type OrderItem = {
    menuItemId : Nat;
    quantity : Nat;
  };

  public type OrderStatus = {
    #pending;
    #inPreparation;
    #outForDelivery;
    #delivered;
    #cancelled;
  };

  var nextOrderId = 0;
  var nextMenuItemId = 6;
  let orders = Map.empty<Nat, Order>();

  var menu = Map.fromIter<Nat, MenuItem>(
    [
      (
        1,
        {
          id = 1;
          name = "Spaghetti Bolognese";
          description = "Classic Italian pasta with rich tomato and meat sauce";
          price = 1250;
          imageUrl = "https://example.com/images/spaghetti.jpg";
          available = true;
        },
      ),
      (
        2,
        {
          id = 2;
          name = "Chicken Curry";
          description = "Tender chicken pieces in a creamy curry sauce";
          price = 1400;
          imageUrl = "https://example.com/images/curry.jpg";
          available = true;
        },
      ),
      (
        3,
        {
          id = 3;
          name = "Vegetable Stir Fry";
          description = "Assorted veggies sautéed in a savory sauce";
          price = 1000;
          imageUrl = "https://example.com/images/stirfry.jpg";
          available = true;
        },
      ),
      (
        4,
        {
          id = 4;
          name = "Mac and Cheese";
          description = "Creamy, cheesy macaroni - a true comfort food";
          price = 1100;
          imageUrl = "https://example.com/images/maccheese.jpg";
          available = true;
        },
      ),
      (
        5,
        {
          id = 5;
          name = "Chocolate Chip Cookies";
          description = "Freshly baked cookies with plenty of chocolate chips";
          price = 500;
          imageUrl = "https://example.com/images/cookies.jpg";
          available = true;
        },
      ),
    ].values(),
  );

  public shared ({ caller }) func createMenuItem(name : Text, description : Text, price : Nat, imageUrl : Text) : async MenuItem {
    let newItem : MenuItem = {
      id = nextMenuItemId;
      name;
      description;
      price;
      imageUrl;
      available = true;
    };
    menu.add(nextMenuItemId, newItem);
    nextMenuItemId += 1;
    newItem;
  };

  public shared ({ caller }) func setMenuItemAvailability(menuItemId : Nat, isAvailable : Bool) : async () {
    switch (menu.get(menuItemId)) {
      case (null) { Runtime.trap("Menu item not found") };
      case (?item) {
        let updatedItem = { item with available = isAvailable };
        menu.add(menuItemId, updatedItem);
      };
    };
  };

  public query ({ caller }) func getMenu() : async [MenuItem] {
    menu.values().toArray();
  };

  public shared ({ caller }) func placeOrder(items : [OrderItem]) : async Order {
    if (items.size() == 0) { Runtime.trap("Cannot place order with no items") };

    let validItems = items.filter(
      func(item) {
        switch (menu.get(item.menuItemId)) {
          case (?menuItem) { menuItem.available };
          case (null) { false };
        };
      }
    );

    if (validItems.size() == 0) { Runtime.trap("No valid items in order") };

    let totalPrice = validItems.foldLeft(
      0,
      func(acc, item) {
        switch (menu.get(item.menuItemId)) {
          case (?menuItem) { acc + (menuItem.price * item.quantity) };
          case (null) { acc };
        };
      },
    );

    let newOrder : Order = {
      id = nextOrderId;
      user = caller;
      items = validItems;
      totalPrice;
      timestamp = Time.now();
      status = #pending;
    };

    orders.add(nextOrderId, newOrder);
    nextOrderId += 1;
    newOrder;
  };

  public query ({ caller }) func getOrderStatus(orderId : Nat) : async OrderStatus {
    switch (orders.get(orderId)) {
      case (?order) { order.status };
      case (null) { Runtime.trap("Order not found") };
    };
  };

  public query ({ caller }) func getOrderHistory() : async [Order] {
    orders.values().toArray();
  };
};
