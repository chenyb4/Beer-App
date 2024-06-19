const {expect, test, beforeEach, beforeAll} = require('@jest/globals');
const databaseSetup = require('./DatabaseSetupTest')
const productService = require('../services/ProductService')
const db = require("../database");


beforeAll(async () => {
    await db.sequelize.authenticate();
})
beforeEach(async () => {
    await databaseSetup.resetTestDatabase();
})

test("getProductById", async () => {
    const product = await productService.getProduct(1);
    expect(product.name).toBe("beer");
})

test("createNewProduct", async () => {
    const name = "wine";
    const price_in_credits = 1;
    const amount_in_stock = 30;
    const EAN = "1234567899";
    const isAlcoholic = true;

    const product = await productService.createProduct(name, price_in_credits, amount_in_stock, EAN, isAlcoholic);

    expect(product.name).toBe("wine");
    expect(product.price_in_credits).toBe(1);
    expect(product.amount_in_stock).toBe(30);
    expect(product.EAN).toBe("1234567899");
    expect(product.isAlcoholic).toBe(true);
})

test("updateProduct", async () => {
    const id = 1;
    const name = "ranja"
    const price_in_credits = 2
    const amount_in_stock = 23
    const EAN = "10987654321"
    const isAlcoholic = false
    const loggedInUserId = 1

    const product = await productService.updateProduct(
        id,
        name,
        price_in_credits,
        amount_in_stock,
        EAN,
        isAlcoholic,
        loggedInUserId
    );

    expect(product.name).toBe("ranja");
    expect(product.price_in_credits).toBe(2);
    expect(product.amount_in_stock).toBe(23);
    expect(product.EAN).toBe("10987654321");
    expect(product.isAlcoholic).toBe(false);
})

test("deleteProduct", async () => {
    const id = 1

    await productService.deleteProduct(id);

    const deletedProduct = await productService.getProduct(id)
    expect(deletedProduct).toBe(null)
})
