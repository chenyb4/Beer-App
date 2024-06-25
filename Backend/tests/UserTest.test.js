const {describe, expect, test, it, beforeEach, beforeAll} = require ('@jest/globals');
const databaseSetup = require('./DatabaseSetupTest')
const userService = require('../services/UserService')
const db = require("../database");


beforeAll(async () => {
    await db.sequelize.authenticate();
})
beforeEach(async () => {
    await databaseSetup.resetTestDatabase();
})

test("getUsersAge",async ()=> {
    const {users} = await userService.getAllUsers({query: {isLegalAge: true}});
    expect(users[0].username).toBe('example');
})

test("getUsersEmail",async ()=> {
    const {users} = await userService.getAllUsers({query: {email: 'example'}});
    expect(users.length).toBe(3);
})

test("getUserById",async ()=> {
    const user = await userService.getUser(1);
    expect(user.username).toBe('example');
})

test("getUserByQr",async ()=> {
    const user = await userService.getQRUser('iahdfo9q34wsdf8yhrtharfiulhas');
    expect(user.username).toBe('example');
})

test("updateUser",async ()=> {
    const user = await userService.updateUser({id: 1, credits: 30, loggedInUserId: 1});
    expect(user.credits).toBe(30);
})

test("createUser",async ()=> {
    const user = await userService.createUser('bert','bert@example.com',null, "1999-01-01 00:00:00.000");
    expect(user.username).toBe('bert');
})

test("deleteUser",async ()=> {
    const id = 1
    await userService.deleteUser(id);
    const deletedUser = await userService.getUser(id)
    expect(deletedUser).toBe(null)
})

test("incrementUserCredits",async ()=> {
    const id = 1
    const amount = 5
    const userBefore = await userService.getUser(id)
    const creditBefore = userBefore.credits
    await userService.incrementUserCredits(id, amount, 1)
    const userAfter = await userService.getUser(id)
    const creditAfter = userAfter.credits

    expect(Number(creditAfter) - Number(creditBefore)).toBe(amount)
})

test("incrementUserCreditsFail",async ()=> {
    await expect(userService.incrementUserCredits(1, -5, 1))
        .rejects
        .toThrow(Error);
})

test("decrementUserCredits",async ()=> {
    const userId = 1
    const orderId = 1
    const amount = 5
    await userService.updateUser({id: userId, credits: amount})
    const userBefore = await userService.getUser(userId)
    const creditBefore = userBefore.credits
    await userService.decrementUserCredits(orderId, userId, amount, 1)
    const userAfter = await userService.getUser(userId)
    const creditAfter = userAfter.credits

    expect(Number(creditBefore) - Number(creditAfter)).toBe(amount)
})

test("decrementUserCreditsFail",async ()=> {
    await expect(userService.decrementUserCredits(1, 1, 5, 1))
        .rejects
        .toThrow(Error);
})