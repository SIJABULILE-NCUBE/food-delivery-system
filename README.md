# Food Delivery System

**Name:** Sijabulile Ncube
**Email:** s.mabhena@gmail.com

My JavaScript Essentials 2 Object-Oriented Programming practical.Customers can build an order from different food types (Pizza,Burger,Drink and Dessert),and the system works out each item's price,its delivery fee and the final order total.

## Project structure

```
food-delivery-system/
├── src/
│   ├── FoodItem.js   parent class (name,private price,validation)
│   ├── Pizza.js      size + toppings
│   ├── Burger.js     patty count + combo
│   ├── Drink.js      size in ml + cold or not
│   ├── Dessert.js    my additional food type: frozen + servings
│   └── Order.js      holds the items and does all the totals
├── food-delivery.js  the main program (builds an order and prints the summary)
├── tests.js          my test code (47 tests)
├── screenshots/      screenshots of the app and tests running
└── package.json
```

## How to run

- Run the app: `node food-delivery.js` (or `npm start`)
- Run the tests: `node tests.js` (or `npm test`)

No libraries to install,it only needs Node.js.

## Delivery fees

| Food type | Delivery fee | Why |
|---|---|---|
| Pizza | R25 small,R30 medium,R35 large | Bigger boxes take more space |
| Burger | R20,or R25 for a combo | Combo chips go in a second bag |
| Drink | R10,or R15 for 1 litre and up | Big bottles are heavy |
| Dessert | R15,or R25 if frozen | Frozen desserts need an insulated bag |

## Where I demonstrated the four OOP principles

### Encapsulation
- **`FoodItem.js`**: `#name` and `#price` are private fields.Code outside the class can't read or change them directly (`pizza.price` is `undefined`).The price can only be read with `getPrice()` and changed with `setPrice()`,which rejects negative,zero,text and NaN prices.
- **`Order.js`**: the list of items (`#items`) is private.Items can only go in through `addItem()` (which checks it really is a food item) and come out through `removeItem()`.`getItems()` returns a copy,so the real list can't be changed from outside.
- **`Pizza.js`**: `#toppings` is private and only changes through `addTopping()`,which also updates the price.

### Inheritance
- **`Pizza`,`Burger`,`Drink` and `Dessert` all `extend FoodItem`**.They inherit the name,the private price,the price validation and `describe()`,so that code is written once instead of four times.
- Each child calls `super(name,price)` in its constructor,and adds its own properties (size,patties,ml,servings) and behaviour (`addTopping()`,`addExtraPatty()`,`needsCoolerBag()`,`getPricePerServing()`).

### Abstraction
- **`FoodItem` is a general template**: creating it directly (`new FoodItem()`) throws an error,and its `getDeliveryFee()` has no real logic,so each food type must provide its own.
- **`Order` hides the details**: whoever uses it just calls `getFinalTotal()` or `printSummary()`.The looping,rounding to cents and Rand formatting happen inside,partly in private helper methods (`#roundToCents()`,`#formatRand()`).
- **`food-delivery.js`** shows this from the outside: it never touches a price directly or does any maths,it just creates food,adds it to an order and asks for the summary.

### Polymorphism
- **`getDeliveryFee()`** is overridden in every food class.In `Order.getDeliveryTotal()` I call `item.getDeliveryFee()` on every item without checking its type,and each one answers differently (for example a large pizza gives R35 and a 500ml drink gives R10).
- **`getType()` and `describe()`** are overridden too.Each child's `describe()` calls `super.describe()` and adds its own details.
- **Proof it works:** I added `Dessert` without changing a single line of `Order.js`,and it worked straight away.

## Screenshots

**App running (`node food-delivery.js`):**

![App output](screenshots/app-output.png)

**Tests running (`node tests.js`):**

![Test output](screenshots/test-output.png)
