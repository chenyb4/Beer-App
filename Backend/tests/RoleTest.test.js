const {describe, expect, test, it, beforeEach, beforeAll} = require ('@jest/globals');
const databaseSetup = require('./DatabaseSetupTest')
const roleService = require('../services/RoleService')
const db = require("../database");


beforeAll(async () => {
    await db.sequelize.authenticate();
})
beforeEach(async () => {
    await databaseSetup.resetTestDatabase();
})

test("getRoles",async ()=> {
    const {returnedRoles} = await roleService.getRoles({query: {}});
    expect(returnedRoles.length).toBe(4);
})

test("getRoleById",async ()=> {
    const role = await roleService.getRole(4);
    expect(role.name).toBe("administrator");
})

test("createRole",async ()=> {
    const role = await roleService.createRole("test", 2);
    expect(role.name).toBe("test");
    expect(role.discount).toBe(2);
})

test("updateRole",async ()=> {
    await roleService.updateRole(1, "member", 2);
    const role = await roleService.getRole(1);
    expect(role.name).toBe("member");
    expect(role.discount).toBe(2);
})

test("deleteRole",async ()=> {
    const id = 1
    await roleService.deleteRole(id);
    const deletedRole = await roleService.getRole(id)
    expect(deletedRole).toBeNull()
})