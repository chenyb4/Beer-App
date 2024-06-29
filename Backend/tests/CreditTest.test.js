const {expect, test, beforeEach, beforeAll} = require('@jest/globals');
const databaseSetup = require('./DatabaseSetupTest')
const creditService = require('../services/CreditService')
const db = require("../database");


beforeAll(async () => {
    await db.sequelize.authenticate();
})
beforeEach(async () => {
    await databaseSetup.resetTestDatabase();
})

test("getCredit", async () => {
    const credit = await creditService.getCredit();
    expect(credit.price).toBe(11);
})

test("updateCredit", async () => {
    const defaultAmount = 9;
    const price = 12;
    await creditService.updateCredit(defaultAmount, price);
    const credit = await creditService.getCredit();
    expect(credit.price).toBe(price);
    expect(credit.default_amount).toBe(defaultAmount);
})

test("createCredit", async () => {
    await deleteCredit()
    const defaultAmount = 9;
    const price = 12;
    await creditService.updateCredit(defaultAmount, price);
    const credit = await creditService.getCredit();
    expect(credit.price).toBe(price);
    expect(credit.default_amount).toBe(defaultAmount);
})

async function deleteCredit() {
    await db.Credit.destroy({where: {id: 1}})
}

