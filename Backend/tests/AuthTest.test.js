const {describe, expect, test, it, beforeEach, beforeAll} = require('@jest/globals');
const databaseSetup = require('./DatabaseSetupTest')
const authService = require('../services/AuthService')
const db = require("../database");
const userService = require("../services/UserService");
const { getMockRes } = require('@jest-mock/express');

beforeAll(async () => {
    await db.sequelize.authenticate();
})
beforeEach(async () => {
    await databaseSetup.resetTestDatabase();
})

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

function callback() {
    expect(true);
}

function getHeaders(token) {
    const headers = [];
    headers['authorization'] = token
    return headers;
}

test("login", async () => {
    const token = await authService.login("example", "password");
    expect(token).toBeDefined();
})

test("validate", async () => {
    const token = await authService.login("exampleAdmin", "password");
    const mock = getMockRes()
    const res = mock.res
    const next = mock.next
    authService.authenticateTokenForSeller({headers: getHeaders(token)}, res, next)

    // the delay here, functions as an await on the internal async call that gets made.
    await delay(1000);

    expect(next).toBeCalled()
})

test("adminForSeller", async () => {
    const admin = await userService.getUser(4);
    expect(() => authService.authorization(admin, {}, {}, callback, false)).not.toThrow();
})
test("adminForAdmin", async () => {
    const admin = await userService.getUser(4);
    expect(() => authService.authorization(admin, {}, {}, callback, true)).not.toThrow();
})

test("sellerForSeller", async () => {
    const seller = await userService.getUser(2);
    expect(() => authService.authorization(seller, {}, {}, callback, false)).not.toThrow();

})
test("sellerForAdmin", async () => {
    const seller = await userService.getUser(2);
    expect(() => authService.authorization(seller, {}, {}, callback, true)).toThrow();
})
