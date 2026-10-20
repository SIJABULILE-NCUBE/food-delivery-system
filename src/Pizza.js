/*
 * Pizza.js
 * Inherits from FoodItem and adds what makes sense for a pizza: a size and a list of toppings.
 *
 * Delivery fee: depends on the size,because bigger boxes take up more space on the delivery bike.
 */

const FoodItem = require("./FoodItem");

class Pizza extends FoodItem {
  // Private because toppings should only change through addTopping(),which also updates the price.
  #toppings = [];

  // static means this belongs to the Pizza class itself,not to each pizza.Every pizza uses the same topping price.
  static TOPPING_PRICE = 12;

  constructor(name, price, size = "medium") {
    // super() runs the FoodItem constructor,which sets and validates the name and price.
    // It has to come first,before I use "this".
    super(name, price);

    const allowedSizes = ["small", "medium", "large"];
    if (!allowedSizes.includes(size)) {
      throw new Error(`Invalid pizza size "${size}".Choose small,medium or large.`);
    }
    this.size = size;
  }

  // Pizza specific behaviour: adding a topping also adds R12 to the price.
  // I can't touch #price here (it's private to FoodItem),so I use the getter and setter like everyone else.
  addTopping(topping) {
    this.#toppings.push(topping);
    this.setPrice(this.getPrice() + Pizza.TOPPING_PRICE);
  }

  // Returns a COPY of the toppings,so code outside can look at the list but can't change the real one.
  getToppings() {
    return [...this.#toppings];
  }

  getType() {
    return "Pizza";
  }

  // Overrides the parent method.Same method name as every other food,different result.
  getDeliveryFee() {
    switch (this.size) {
      case "small":
        return 25;
      case "large":
        return 35;
      default:
        return 30; // medium
    }
  }

  describe() {
    const toppingText = this.#toppings.length > 0 ? this.#toppings.join(",") : "no extra toppings";
    // super.describe() reuses the parent's text,then I add the pizza details.
    return `${super.describe()},${this.size},${toppingText}`;
  }
}

module.exports = Pizza;
