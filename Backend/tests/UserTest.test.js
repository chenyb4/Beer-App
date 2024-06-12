const {describe, expect, test, it, beforeEach, beforeAll} = require ('@jest/globals');
const databaseSetup = require('./DatabaseSetupTest')
const userService = require('../services/UserService')
const db = require("../database");


beforeAll(async () => {
    return await db.sequelize.authenticate();
})
beforeEach(async () => {
    return await databaseSetup.resetTestDatabase();
})

test("getUsers",async ()=> {
    const users = await userService.getUser(1);
    return expect(users.username).toBe('example');
})