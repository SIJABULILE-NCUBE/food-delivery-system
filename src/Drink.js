/*
 * Drink.js
 * Inherits from FoodItem and adds a size in millilitres and whether the drink is served cold.
 *
 * Delivery fee: R10 for normal drinks,R15 for 1 litre and up because big bottles are heavy.
 */

const FoodItem = require("./FoodItem");

class Drink extends FoodItem {
  constructor(name, price, sizeMl = 500, isCold = true) {
    super(name, price);

    if (typeof sizeMl !== "number" || sizeMl <= 0) {
      throw new Error("A drink needs a size in ml greater than 0.");
    }
    this.sizeMl = sizeMl;
    this.isCold = isCold;
  }

  // Drink specific behaviour: a quick check the delivery driver can use to see if it needs a cooler bag.
  needsCoolerBag() {
    return this.isCold;
  }

  getType() {
    return "Drink";
  }

  getDeliveryFee() {
    return this.sizeMl >= 1000 ? 15 : 10;
  }

  describe() {
    const temperature = this.isCold ? "cold" : "room temperature";
    return `${super.describe()},${this.sizeMl}ml,${temperature}`;
  }
}

module.exports = Drink;
