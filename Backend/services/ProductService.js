const db = require('../database')

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
        return db.Product.create({name, price_in_credits, amount_in_stock, EAN});
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
        return await db.Product.update(
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
    } catch (err) {
        console.error(err);
        throw new Error('Failed to update product with id: ' + id);
    }
}

exports.incrementProductStock = async (id, amount) => {
    return await db.Product.increment({amount_in_stock: amount}, {where: {id}})
}

exports.deleteProduct = async (id) => {
    if (!id) throw new Error('Missing required fields or no update data provided');
    return await db.Product.destroy({
        where: {
            id
        }
    });
}
