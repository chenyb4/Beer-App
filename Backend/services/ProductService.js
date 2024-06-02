const db = require('../database')
const historyService = require("./HistoryService");
const {getDummyUserId} = require('./UserService');
const {Action} = require('../enums/Action')


// Get all products
exports.getAllProducts = async () => {
    return await db.Product.findAll();
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
exports.createProduct = async (name, price_in_credits, amount_in_stock, EAN) => {
    if (!name || !price_in_credits || !amount_in_stock || !EAN) {
        throw new Error('Missing required fields: ');
    }
    try {
        return db.Product.create({ name, price_in_credits, amount_in_stock, EAN });
    } catch (err) {
        console.error(err);
        throw new Error('Failed to create product');
    }
}

// Update product
exports.updateProduct = async (id, name, price_in_credits, amount_in_stock, EAN) => {
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
        if (oldProduct.amount_in_stock < updatedProduct.amount_in_stock) {
            await historyService.createHistory(Action.increase_product_stock, {"product_id": id}, await getDummyUserId())
        } else if (oldProduct.amount_in_stock > updatedProduct.amount_in_stock) {
            await historyService.createHistory(Action.decrease_product_stock, {"product_id": id}, await getDummyUserId())
        }

        return updatedProduct;
    } catch (err) {
        console.error(err);
        throw new Error('Failed to update product with id: ' + id);
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
