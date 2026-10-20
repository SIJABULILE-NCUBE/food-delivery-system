/*
 * FoodItem.js
 * The PARENT class for every food in the system (Pizza,Burger,Drink,Dessert).
 *
 * OOP principles in this file:
 * - Encapsulation: #name and #price are PRIVATE fields.Nothing outside this class can read or change them directly,
 *   they can only be reached through getName(),getPrice() and setPrice().setPrice() checks the value first,
 *   so an invalid price can never get into the system.
 * - Abstraction: FoodItem is a general template,not a real food you can order.I block anyone from doing
 *   new FoodItem(...) directly,and getDeliveryFee() has no real logic here,every child class has to provide its own.
 * - Inheritance: the child classes extend this one,so they all get the name,price and validation for free
 *   instead of me copying the same code into four files.
 *
 * MDN private fields: developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties
 * MDN new.target:     developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target
 */

class FoodItem {
  // The # makes these private.Trying item.#price from outside the class is a SyntaxError,
  // and item.price just gives undefined,so the real price is properly protected.
  #name;
  #price;

  constructor(name, price) {
    // new.target tells me which class was actually used with "new".
    // If someone tries new FoodItem(...) I stop them,because "a food item" on its own isn't something you can order.
    if (new.target === FoodItem) {
      throw new Error("FoodItem is a general template.Create a Pizza,Burger,Drink or Dessert instead.");
    }

    if (typeof name !== "string" || name.trim() === "") {
      throw new Error("A food item must have a name.");
    }
    this.#name = name.trim();

    // I go through setPrice() even inside the constructor,so the SAME validation runs whether the price
    // is set when the item is created or changed later.One rule,one place.
    this.setPrice(price);
  }

  getName() {
    return this.#name;
  }

  getPrice() {
    return this.#price;
  }

  // The only way to change a price.If the new price is invalid,it throws an error and the old price stays.
  setPrice(newPrice) {
    // Number.isFinite rejects text like "50",NaN and Infinity in one check.
    if (typeof newPrice !== "number" || !Number.isFinite(newPrice) || newPrice <= 0) {
      throw new Error(`Invalid price for ${this.#name}: ${newPrice}.Price must be a number greater than 0.`);
    }
    // Rounded to cents so prices like 89.999 don't sneak in.
    this.#price = Math.round(newPrice * 100) / 100;
  }

  // Each child class overrides this to return its own type name.
  getType() {
    return "Food Item";
  }

  // Every food type MUST work out its own delivery fee,so the parent version just throws.
  // If I ever add a new food class and forget to write getDeliveryFee(),this error tells me straight away.
  getDeliveryFee() {
    throw new Error(`${this.getType()} must have its own getDeliveryFee() method.`);
  }

  // A basic description.Child classes add their own details on top of this using super.describe().
  describe() {
    return `${this.getType()}: ${this.#name} (R${this.#price.toFixed(2)})`;
  }
}

module.exports = FoodItem;
