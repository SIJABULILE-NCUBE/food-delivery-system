/*
 * food-delivery.js
 * The main program: builds a realistic order and prints the summary.
 * Run with: node food-delivery.js
 *
 * Notice how simple this file is.It never touches a private price or does any delivery maths itself,
 * it just creates food,adds it to an order and asks the order for its summary.That's abstraction in action.
 */

const Pizza = require("./src/Pizza");
const Burger = require("./src/Burger");
const Drink = require("./src/Drink");
const Dessert = require("./src/Dessert");
const Order = require("./src/Order");

// ---------- Create the food ----------
const pizza = new Pizza("Margherita", 89.9, "large");
pizza.addTopping("mushrooms");
pizza.addTopping("olives");

const burger = new Burger("Classic Beef Burger", 75, 1, true);
burger.addExtraPatty();

const drink = new Drink("Coke", 22.5, 2000, true);

const dessert = new Dessert("Chocolate Ice Cream Tub", 64, true, 4);

// ---------- Build the order ----------
const order = new Order("Thandi");
order.addItem(pizza);
order.addItem(burger);
order.addItem(drink);
order.addItem(dessert);

// ---------- Show each item's details ----------
console.log("\nITEMS IN THIS ORDER:");
for (const item of order.getItems()) {
  // describe() is polymorphic too: each food type adds its own details.
  console.log(`- ${item.describe()}`);
}
console.log("");

// ---------- Print the summary ----------
order.printSummary();

// A couple of type specific behaviours,just to show them off.
console.log(`\nDoes the Coke need a cooler bag? ${drink.needsCoolerBag() ? "Yes" : "No"}`);
console.log(`Ice cream price per serving: R${dessert.getPricePerServing().toFixed(2)}`);
