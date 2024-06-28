const db = require('../database')
const paginationService = require("./PaginationService");
const historyService = require("./HistoryService");
const {Action} = require('../enums/Action')
const logger = require('../logger');


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
        logger.error(err);
        throw new Error('Failed to get product');
    }
}

// Create product
exports.createProduct = async (name, price_in_credits, amount_in_stock, EAN, isAlcoholic) => {
    if (!name || !price_in_credits || amount_in_stock === undefined || !EAN || !isAlcoholic) {
        throw new Error('Missing one of the required fields: name, price_in_credits, amount_in_stock, EAN or isAlcoholic');
    }
    try {
        return db.Product.create({name, price_in_credits, amount_in_stock, EAN, isAlcoholic});
    } catch (err) {
        logger.error(err);
        throw new Error('Failed to create product');
    }
}

// Update product
exports.updateProduct = async ({id, name, price_in_credits, amount_in_stock, EAN, isAlcoholic, loggedInUserId}) => {
    if (!id || (!name && !price_in_credits && !amount_in_stock && !EAN && !isAlcoholic)) {
        throw new Error('Missing required fields or no update data provided');
    }

    try {
        await db.Product.update(
            {
                name,
                price_in_credits,
                EAN,
                isAlcoholic
            },
            {
                where: {
                    id,
                },
            },
        );
        let updatedProduct = await this.getProduct(id);
        if (amount_in_stock !== null && amount_in_stock !== undefined) {

            const amountChanged = amount_in_stock - updatedProduct.amount_in_stock
            await this.manipulateProductStock(id, amountChanged, loggedInUserId)
            updatedProduct = await this.getProduct(id);
        }

        return updatedProduct;
    } catch (err) {
        logger.error(err);
        throw new Error('Failed to update product with id: ' + id);
    }
}

exports.manipulateProductStock = async (id, amountChanged, loggedInUserId) => {
    // Use full functions to ensure that database manipulation and history are done right.
    if (amountChanged > 0) {
        return await this.incrementProductStock(id, amountChanged, loggedInUserId)
    } else if (amountChanged < 0) {
        return await this.decrementProductStock(id, amountChanged * -1, loggedInUserId)
    }
}

exports.incrementProductStock = async (id, amount, loggedInUserId) => {
    if (amount < 1) throw new Error('Amount can not be lower than 1');

    try {
        const product = await db.Product.increment({amount_in_stock: amount}, {where: {id}});
        await historyService.createHistory(Action.increase_product_stock, {"inventory_change": amount}, loggedInUserId, id);
        return product;
    } catch (err) {
        logger.error(err);
        throw new Error('Failed to manipulate stock of product: ' + id + ' by: ' + amount)
    }

}

exports.decrementProductStock = async (id, amount, loggedInUserId) => {
    if (amount < 1) throw new Error('Amount can not be lower than 1');
    const dbProduct = await this.getProduct(id);
    if (dbProduct.amount_in_stock < amount) throw new Error('Amount can not be more than available stock')

    try {
        const product = await db.Product.decrement({amount_in_stock: amount}, {where: {id}});
        await historyService.createHistory(Action.decrease_product_stock, {"inventory_change": amount}, loggedInUserId, id);
        return product;
    } catch (err) {
        logger.error(err);
        throw new Error('Failed to manipulate stock of product: ' + id + ' by: ' + amount)
    }
}

exports.deleteProduct = async (id) => {
    if (!id) throw new Error('Missing required fields or no update data provided');
    return await db.Product.destroy({
        where: {
            id
        }
    });
}
