const {describe, expect, test, it, beforeEach, beforeAll} = require('@jest/globals');
const databaseSetup = require('./DatabaseSetupTest')
const historyService = require('../services/HistoryService')
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

test("getHistoryByOrderId", async () => {
    const history = await historyService.getHistoryByOrderId(1);
    expect(history.action).toBe(Action.change_user_credits);
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
        description: { buyerId: 1, credits: 1, orderId: 1 },
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