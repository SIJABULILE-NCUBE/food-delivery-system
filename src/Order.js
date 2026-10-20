/*
 * Order.js
 * Holds a list of food items and does all the order maths.
 *
 * OOP principles in this file:
 * - Encapsulation: the list of items (#items) is private.You can only add or remove items through
 *   addItem() and removeItem(),and getItems() hands back a COPY,so nobody can sneak items in from outside.
 * - Abstraction: whoever uses an Order just calls getFinalTotal() or printSummary().They don't need to know
 *   how the totals are looped through,rounded or formatted.Those details live in private helper methods (#...).
 * - Polymorphism: getDeliveryTotal() calls item.getDeliveryFee() on every item without checking what type it is.
 *   A Pizza,Burger,Drink or Dessert each answer that same call in their own way.
 */

const FoodItem = require("./FoodItem");

class Order {
  #items = [];
  #customerName;

  constructor(customerName = "Guest") {
    this.#customerName = customerName;
  }

  getCustomerName() {
    return this.#customerName;
  }

  addItem(item) {
    // instanceof checks the item really is a FoodItem (or a child of one).This stops random objects
    // like { name: "Fake",price: -10 } getting into the order and breaking the totals.
    if (!(item instanceof FoodItem)) {
      throw new Error("Only food items (Pizza,Burger,Drink,Dessert) can be added to an order.");
    }
    this.#items.push(item);
  }

  // Removes the first item with a matching name.Returns true if something was removed,false if not found.
  removeItem(itemName) {
    for (let i = 0; i < this.#items.length; i++) {
      if (this.#items[i].getName().toLowerCase() === itemName.toLowerCase()) {
        // splice removes the item properly (no empty hole like delete would leave).
        this.#items.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  // A copy,not the real array.Changing the copy doesn't affect the order.
  getItems() {
    return [...this.#items];
  }

  getItemCount() {
    return this.#items.length;
  }

  getFoodTotal() {
    let total = 0;
    for (const item of this.#items) {
      total += item.getPrice();
    }
    return this.#roundToCents(total);
  }

  getDeliveryTotal() {
    let total = 0;
    for (const item of this.#items) {
      // Polymorphism: the same call,but each food type works out its own fee.
      total += item.getDeliveryFee();
    }
    return this.#roundToCents(total);
  }

  getFinalTotal() {
    return this.#roundToCents(this.getFoodTotal() + this.getDeliveryTotal());
  }

  // Prints a clear order summary as a table.
  printSummary() {
    const line = "=".repeat(70);
    console.log(line);
    console.log(`  FOOD DELIVERY ORDER for ${this.#customerName}`);
    console.log(line);

    if (this.#items.length === 0) {
      console.log("  This order is empty.");
      console.log(line);
      return;
    }

    console.log(`  ${"Item".padEnd(28)}${"Type".padEnd(10)}${"Price".padStart(14)}${"Delivery Fee".padStart(16)}`);
    console.log(`  ${"-".repeat(68)}`);

    for (const item of this.#items) {
      // Very long names get shortened so they don't push the other columns out of line.
      const name = item.getName();
      const shownName = name.length > 26 ? `${name.slice(0,23)}...` : name;
      console.log(
        `  ${shownName.padEnd(28)}${item.getType().padEnd(10)}` +
          `${this.#formatRand(item.getPrice()).padStart(14)}${this.#formatRand(item.getDeliveryFee()).padStart(16)}`
      );
    }

    console.log(`  ${"-".repeat(68)}`);
    console.log(`  ${"Food subtotal".padEnd(38)}${this.#formatRand(this.getFoodTotal()).padStart(30)}`);
    console.log(`  ${"Delivery fees".padEnd(38)}${this.#formatRand(this.getDeliveryTotal()).padStart(30)}`);
    console.log(`  ${"TOTAL".padEnd(38)}${this.#formatRand(this.getFinalTotal()).padStart(30)}`);
    console.log(line);
  }

  // ----- private helpers: part of how the order works inside,not something users of the class need -----

  // Rounds to the nearest cent so floating point leftovers (like 0.30000000000000004) never show up in totals.
  #roundToCents(amount) {
    return Math.round(amount * 100) / 100;
  }

  // "R 1,234.50" style formatting.en-US gives commas for thousands and a dot for cents.
  #formatRand(amount) {
    return `R ${amount.toLocaleString("en-US",{ minimumFractionDigits: 2,maximumFractionDigits: 2 })}`;
  }
}

module.exports = Order;
