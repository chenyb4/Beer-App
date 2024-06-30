const {describe, expect, test, it, beforeEach, beforeAll} = require('@jest/globals');
const databaseSetup = require('./DatabaseSetupTest')
const historyService = require('../services/HistoryService')
const orderService = require('../services/OrderService')
const userService = require('../services/UserService')
const db = require("../database");
const {Action} = require("../enums/Action");


beforeAll(async () => {
    await db.sequelize.authenticate();
})
beforeEach(async () => {
    await databaseSetup.resetTestDatabase();
})

test("getHistory", async () => {
    const history = await historyService.getHistory(1);
    expect(history.action).toBe(Action.decrease_product_stock);
})

test("getHistoriesByOrderId", async () => {
    const histories = await historyService.getHistoriesByOrderId(1);
    expect(histories.length).toBe(3);
})

test("getHistories", async () => {
    const {returnedHistories} = await historyService.getHistories({query: {}});
    expect(returnedHistories.length).toBe(3);
})

test("getProductHistories", async () => {
    const {returnedHistories} = await historyService.getHistories({query: {}}, [
        {action: Action.increase_product_stock},
        {action: Action.decrease_product_stock}
    ]);
    expect(returnedHistories.length).toBe(2);
})

test("createHistory", async () => {
    const history = await historyService.createHistory(Action.decrease_product_stock, {"inventory_change": 5}, 1, 2);
    expect(history.productId).toBe(2);
})

test("updateHistory", async () => {
    await historyService.updateHistory({
        id: 1,
        action: Action.change_user_credits,
        description: {buyerId: 1, credits: 1, orderId: 1},
        userId: 1,
        undoUserId: 2
    });
    const history = await historyService.getHistory(1);
    expect(history.action).toBe(Action.change_user_credits);
    expect(history.description.credits).toBe(1);
    expect(history.userId).toBe(1);
    expect(history.undoUserId).toBe(2);
})

async function undoHelper() {
    const history = await historyService.getHistory(1);
    await historyService.undo(history, 2)
    const updatedHistory = await historyService.getHistory(1);
    expect(updatedHistory.undoUserId).toBe(2);
    const {returnedHistories} = await historyService.getHistories({query: {}});
    expect(returnedHistories.length).toBe(4);
}

test("undo", async () => {
    await undoHelper();
})

test("doubleUndo", async () => {
    await undoHelper()
    const history = await historyService.getHistory(1);
    await expect(historyService.undo(history, 2))
        .rejects
        .toThrow(Error);

    const data = await historyService.getHistories({query: {}});
    expect(data.returnedHistories.length).toBe(4);
})

test("undoOrder", async () => {
    const loggedInUser = 2
    const buyerId = 2
    const order = await orderService.createOrder(buyerId, loggedInUser)
    await userService.updateUser({id: buyerId, credits: 50})
    const orderId = order.id

    await orderService.addProductToOrder(orderId, 1, 2, loggedInUser);
    await orderService.addProductToOrder(orderId, 2, 1, loggedInUser);
    await orderService.confirmOrder(orderId, loggedInUser)

    const histories = await historyService.getHistoriesByOrderId(orderId)
    expect(histories.length).toBe(3)

    await historyService.massUndo(histories, loggedInUser)

    const result = await historyService.getHistoriesByOrderId(orderId)
    expect(result.length).toBe(0)

})