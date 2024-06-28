const {describe, expect, test, it, beforeEach, beforeAll} = require ('@jest/globals');
const databaseSetup = require('./DatabaseSetupTest')
const orderService = require('../services/OrderService')
const productService = require('../services/ProductService')
const db = require("../database");
const userService = require("../services/UserService");


beforeAll(async () => {
    await db.sequelize.authenticate();
})
beforeEach(async () => {
    await databaseSetup.resetTestDatabase();
})

test("getOrdersBySellerId",async ()=> {
    const {returnedOrders} = await orderService.getAllOrders({query: {sellerId: 2}});
    expect(returnedOrders[0].buyer.username).toBe('example');
})

test("getOrderById",async ()=> {
    const order = await orderService.getOrder(1);
    expect(order.sellerId).toBe(2);
})

test("createOrder",async ()=> {
    const order = await orderService.createOrder(2, 1);
    expect(order.sellerId).toBe(1);
})

test("updateOrder",async ()=> {
    await orderService.updateOrder(1, 20, 2, 1);
    const order = await orderService.getOrder(1);
    expect(order.sellerId).toBe(1);
    expect(order.buyerId).toBe(2);
    expect(order.amount_of_credits).toBe(20);
})

test("addProductToOrder",async ()=> {
    const amount = 2;
    const productId = 1;
    const orderBefore = await orderService.getOrder(1);
    const orderPriceBefore = orderBefore.amount_of_credits
    await orderService.addProductToOrder(1, productId, amount, 1)
    const orderAfter = await orderService.getOrder(1);
    const orderPriceAfter = orderAfter.amount_of_credits

    const product = await productService.getProduct(productId);
    const productPrice = product.price_in_credits
    expect(Number(orderPriceAfter) - Number(orderPriceBefore)).toBe(amount * productPrice)
})

test("incrementOrderPriceFail",async ()=> {
    await expect(orderService.incrementOrderPrice(1, 1, -5))
        .rejects
        .toThrow(Error);
    await expect(orderService.incrementOrderPrice(1, -1, 5))
        .rejects
        .toThrow(Error);
})