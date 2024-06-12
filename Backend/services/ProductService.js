const db = require('../database')
const paginationService = require("./PaginationService");
const historyService = require("./HistoryService");
const {Action} = require('../enums/Action')


// Get all products
exports.getAllProducts = async (req) => {
    let query = await paginationService.getQuery(req)
    const products = await db.Product.findAll(query)
    const total = await db.Product.count()
    return {returnedProducts: products, total};
}

// Get one product
exports.getProduct = async (id) => {
    if (!id) {
        throw new Error('Missing required fields');
    }

    try {
        return await db.Product.findByPk(id);
    } catch (err) {
        throw new Error('Failed to get product');
    }
}

// Create product
exports.createProduct = async (name, price_in_credits, amount_in_stock, EAN, isAlcoholic) => {
    if (!name || !price_in_credits || !amount_in_stock || !EAN || !isAlcoholic) {
        throw new Error('Missing one of the required fields: name, price_in_credits, amount_in_stock, EAN or isAlcoholic');
    }
    try {
        return db.Product.create({name, price_in_credits, amount_in_stock, EAN, isAlcoholic});
    } catch (err) {
        console.error(err);
        throw new Error('Failed to create product');
    }
}

// Update product
exports.updateProduct = async (id, name, price_in_credits, amount_in_stock, EAN, loggedInUserId) => {
    if (!id || (!name && !price_in_credits && !amount_in_stock && !EAN)) {
        throw new Error('Missing required fields or no update data provided');
    }

    try {
        const oldProduct = await this.getProduct(id);
        await db.Product.update(
            {
                name,
                price_in_credits,
                amount_in_stock,
                EAN
            },
            {
                where: {
                    id,
                },
            },
        );
        const updatedProduct = await this.getProduct(id);
        const amountChanged = updatedProduct.amount_in_stock - oldProduct.amount_in_stock
        await createProductStockHistory(id, amountChanged, loggedInUserId)

        return updatedProduct;
    } catch (err) {
        console.error(err);
        throw new Error('Failed to update product with id: ' + id);
    }
}

async function createProductStockHistory(id, amountChanged, loggedInUserId) {
    if (amountChanged > 0) {
        await historyService.createHistory(Action.increase_product_stock, {"inventory_change": amountChanged}, loggedInUserId, id)
    } else if (amountChanged < 0) {
        await historyService.createHistory(Action.decrease_product_stock, {"inventory_change": amountChanged * -1}, loggedInUserId, id)
    }
}

exports.incrementProductStock = async (id, amount, loggedInUserId) => {
    const product = await db.Product.increment({amount_in_stock: amount}, {where: {id}});
    await historyService.createHistory(Action.increase_product_stock, {"inventory_change": amount}, loggedInUserId, id);
    return product;
}

exports.decrementProductStock = async (id, amount, loggedInUserId) => {
    const product = await db.Product.decrement({amount_in_stock: amount}, {where: {id}});
    await historyService.createHistory(Action.decrease_product_stock, {"inventory_change": amount}, loggedInUserId, id);
    return product;
}

exports.deleteProduct = async (id) => {
    if (!id) throw new Error('Missing required fields or no update data provided');
    return await db.Product.destroy({
        where: {
            id
        }
    });
}
