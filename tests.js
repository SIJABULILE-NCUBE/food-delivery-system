/*
 * tests.js
 * My test code.Every test prints PASS or FAIL,and there's a summary at the end.
 * Run with: node tests.js
 *
 * I didn't use a testing library (like Jest) to keep the project simple,so I wrote two tiny helpers instead:
 * - check() for normal tests: is this condition true?
 * - checkThrows() for tests where I EXPECT an error,like an invalid price.
 */

const FoodItem = require("./src/FoodItem");
const Pizza = require("./src/Pizza");
const Burger = require("./src/Burger");
const Drink = require("./src/Drink");
const Dessert = require("./src/Dessert");
const Order = require("./src/Order");

let passed = 0;
let failed = 0;

function check(description, condition) {
  if (condition) {
    passed++;
    console.log(`  PASS  ${description}`);
  } else {
    failed++;
    console.log(`  FAIL  ${description}`);
  }
}

// Runs the code inside a try/catch.If it throws,that's what I wanted,so the test passes.
function checkThrows(description, codeThatShouldFail) {
  try {
    codeThatShouldFail();
    failed++;
    console.log(`  FAIL  ${description} (no error was thrown)`);
  } catch (error) {
    passed++;
    console.log(`  PASS  ${description}`);
    console.log(`        -> error message: "${error.message}"`);
  }
}

// ============================================================
console.log("\n1.Food items can be created");
// ============================================================
const pizza = new Pizza("Pepperoni", 99, "medium");
const burger = new Burger("Chicken Burger", 65);
const drink = new Drink("Orange Juice", 25, 500);
check("Pizza is created and is a Pizza", pizza instanceof Pizza);
check("Burger is created and is a Burger", burger instanceof Burger);
check("Drink is created and is a Drink", drink instanceof Drink);

// ============================================================
console.log("\n2.Food item information can be accessed");
// ============================================================
check("getName() returns the name", pizza.getName() === "Pepperoni");
check("getPrice() returns the price", pizza.getPrice() === 99);
check("getType() returns the type", pizza.getType() === "Pizza");
check("Type specific property (pizza size) is stored", pizza.size === "medium");

// ============================================================
console.log("\n3.Encapsulation: the price can't be reached directly");
// ============================================================
check("pizza.price is undefined (the real price is private)", pizza.price === undefined);
pizza.price = 1; // this just creates a new,unrelated public property
check("Setting pizza.price = 1 does NOT change the real price", pizza.getPrice() === 99);
pizza.setPrice(105);
check("setPrice() with a valid price DOES change it", pizza.getPrice() === 105);

// ============================================================
console.log("\n4.Invalid prices are handled");
// ============================================================
checkThrows("Negative price is rejected", () => new Burger("Bad Burger", -20));
checkThrows("Zero price is rejected", () => new Drink("Free Water", 0));
checkThrows("Text price is rejected", () => new Pizza("Text Pizza", "100"));
checkThrows("NaN price is rejected", () => new Pizza("NaN Pizza", NaN));
checkThrows("setPrice() with an invalid price is rejected", () => pizza.setPrice(-5));
check("After the failed setPrice(),the old price is still there", pizza.getPrice() === 105);

// ============================================================
console.log("\n5.Abstraction: FoodItem can't be created on its own");
// ============================================================
checkThrows("new FoodItem() is blocked", () => new FoodItem("Mystery Food", 50));

// ============================================================
console.log("\n6.Different food types can be created with their own behaviour");
// ============================================================
const veggiePizza = new Pizza("Veggie", 80, "small");
veggiePizza.addTopping("peppers");
check("addTopping() adds the topping", veggiePizza.getToppings().includes("peppers"));
check("addTopping() adds R12 to the price (80 + 12 = 92)", veggiePizza.getPrice() === 92);

const doubleBurger = new Burger("Double Trouble", 70);
doubleBurger.addExtraPatty();
check("addExtraPatty() increases patty count to 2", doubleBurger.pattyCount === 2);
check("addExtraPatty() adds R15 to the price (70 + 15 = 85)", doubleBurger.getPrice() === 85);

const coldDrink = new Drink("Iced Tea", 20, 330, true);
check("needsCoolerBag() is true for a cold drink", coldDrink.needsCoolerBag() === true);

// ============================================================
console.log("\n7.Delivery fees are calculated correctly");
// ============================================================
check("Small pizza delivery is R25", new Pizza("A", 50, "small").getDeliveryFee() === 25);
check("Medium pizza delivery is R30", new Pizza("B", 50, "medium").getDeliveryFee() === 30);
check("Large pizza delivery is R35", new Pizza("C", 50, "large").getDeliveryFee() === 35);
check("Burger only delivery is R20", new Burger("D", 50).getDeliveryFee() === 20);
check("Burger combo delivery is R25", new Burger("E", 50, 1, true).getDeliveryFee() === 25);
check("500ml drink delivery is R10", new Drink("F", 20, 500).getDeliveryFee() === 10);
check("2 litre drink delivery is R15", new Drink("G", 30, 2000).getDeliveryFee() === 15);

// ============================================================
console.log("\n8.Polymorphism: different food types give different delivery fees for the SAME method");
// ============================================================
const mixedItems = [new Pizza("P", 50, "large"), new Burger("B", 50), new Drink("D", 50, 500)];
const fees = [];
for (const item of mixedItems) {
  fees.push(item.getDeliveryFee()); // same call every time
}
console.log(`        -> fees returned: ${fees.join(",")}`);
check("Pizza,Burger and Drink each return a different fee", fees[0] !== fees[1] && fees[1] !== fees[2] && fees[0] !== fees[2]);

// ============================================================
console.log("\n9.Food items can be added to and removed from an order");
// ============================================================
const order = new Order("Test Customer");
check("A new order starts empty", order.getItemCount() === 0);
order.addItem(new Pizza("Hawaiian", 100, "medium")); // fee 30
order.addItem(new Burger("Cheese Burger", 60)); // fee 20
order.addItem(new Drink("Sprite", 20, 500)); // fee 10
check("3 items added,count is 3", order.getItemCount() === 3);
checkThrows("A random object can't be added to an order", () => order.addItem({ name: "Fake", price: 10 }));

const copy = order.getItems();
copy.push("sneaky item");
check("Changing the copy from getItems() doesn't change the order", order.getItemCount() === 3);

check("removeItem() returns true when the item exists", order.removeItem("Sprite") === true);
check("After removing,count is 2", order.getItemCount() === 2);
check("removeItem() returns false when the item doesn't exist", order.removeItem("Lasagne") === false);

// ============================================================
console.log("\n10.The final order total is calculated correctly");
// ============================================================
// Order now has: Hawaiian (100,fee 30) and Cheese Burger (60,fee 20)
check("Food total is R160", order.getFoodTotal() === 160);
check("Delivery total is R50", order.getDeliveryTotal() === 50);
check("Final total is R210", order.getFinalTotal() === 210);

const decimalOrder = new Order();
decimalOrder.addItem(new Drink("Water", 10.1, 500));
decimalOrder.addItem(new Drink("Juice", 20.2, 500));
check("Decimal prices add up cleanly (10.10 + 20.20 = 30.30,no floating point mess)", decimalOrder.getFoodTotal() === 30.3);

// ============================================================
console.log("\n11.My additional food type (Dessert) works with the existing order system");
// ============================================================
const iceCream = new Dessert("Vanilla Tub", 60, true, 3);
const cake = new Dessert("Carrot Cake Slice", 45, false);
check("Dessert is a Dessert and also a FoodItem", iceCream instanceof Dessert && iceCream instanceof FoodItem);
check("Frozen dessert delivery is R25", iceCream.getDeliveryFee() === 25);
check("Non frozen dessert delivery is R15", cake.getDeliveryFee() === 15);
check("getPricePerServing() works (60 / 3 = 20)", iceCream.getPricePerServing() === 20);

order.addItem(iceCream);
check("Dessert can be added to the SAME order class", order.getItemCount() === 3);
check("Order total includes the dessert (210 + 60 + 25 = 295)", order.getFinalTotal() === 295);

// ============================================================
console.log("\n12.The order summary prints");
// ============================================================
order.printSummary();

// ============================================================
console.log(`\nRESULT: ${passed} passed,${failed} failed`);
// ============================================================
// A non zero exit code tells tools like GitHub Actions that something failed.
if (failed > 0) {
  process.exitCode = 1;
}
