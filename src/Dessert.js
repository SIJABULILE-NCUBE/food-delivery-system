/*
 * Dessert.js
 * My ADDITIONAL food type (section 8 of the brief).
 * Inherits from FoodItem and adds whether it's frozen and how many servings it has.
 *
 * Delivery fee: R25 if frozen (needs an insulated bag and a fast trip),otherwise R15.
 *
 * The nice thing: I didn't have to change Order.js at all for this to work.Because Dessert extends FoodItem
 * and has its own getDeliveryFee(),the order system already knows how to handle it.
 */

const FoodItem = require("./FoodItem");

class Dessert extends FoodItem {
  constructor(name, price, isFrozen = false, servings = 1) {
    super(name, price);

    if (!Number.isInteger(servings) || servings < 1) {
      throw new Error("A dessert needs at least 1 serving.");
    }
    this.isFrozen = isFrozen;
    this.servings = servings;
  }

  // Dessert specific behaviour: works out the price per serving,handy for sharing desserts.
  getPricePerServing() {
    return Math.round((this.getPrice() / this.servings) * 100) / 100;
  }

  getType() {
    return "Dessert";
  }

  getDeliveryFee() {
    return this.isFrozen ? 25 : 15;
  }

  describe() {
    const frozenText = this.isFrozen ? "frozen" : "not frozen";
    const servingText = this.servings === 1 ? "1 serving" : `${this.servings} servings`;
    return `${super.describe()},${frozenText},${servingText}`;
  }
}

module.exports = Dessert;
