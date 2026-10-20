/*
 * Burger.js
 * Inherits from FoodItem and adds a patty count and whether it's a combo (with chips).
 *
 * Delivery fee: R20,plus R5 for a combo because the chips go in a second bag.
 */

const FoodItem = require("./FoodItem");

class Burger extends FoodItem {
  static EXTRA_PATTY_PRICE = 15;

  constructor(name, price, pattyCount = 1, isCombo = false) {
    super(name, price);

    if (!Number.isInteger(pattyCount) || pattyCount < 1) {
      throw new Error("A burger needs at least 1 patty.");
    }
    this.pattyCount = pattyCount;
    this.isCombo = isCombo;
  }

  // Burger specific behaviour: an extra patty costs R15 more.
  addExtraPatty() {
    this.pattyCount++;
    this.setPrice(this.getPrice() + Burger.EXTRA_PATTY_PRICE);
  }

  getType() {
    return "Burger";
  }

  getDeliveryFee() {
    const baseFee = 20;
    return this.isCombo ? baseFee + 5 : baseFee;
  }

  describe() {
    const pattyText = this.pattyCount === 1 ? "1 patty" : `${this.pattyCount} patties`;
    const comboText = this.isCombo ? "combo with chips" : "burger only";
    return `${super.describe()},${pattyText},${comboText}`;
  }
}

module.exports = Burger;
