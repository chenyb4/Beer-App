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
exports.createProduct = async (name, price_in_credits, amount_in_stock, ean) => {
    if (!name || !price_in_credits || !amount_in_stock || !ean) {
        throw new Error('Missing required fields: ');
    }
    try {
        return db.Product.create({ name, price_in_credits, amount_in_stock, ean });
    } catch (err) {
        throw new Error('Failed to create product');
    }
}

// Update product
exports.updateProduct = async (id, name, price_in_credit, amount_in_stock, ean) => {
    if (!id || (!name && !price_in_credit && !amount_in_stock && !ean)) {
        throw new Error('Missing required fields or no update data provided');
    }

    try {
        return await db.Product.update(
            {
                name,
                price_in_credit,
                amount_in_stock,
                ean
            },
            {
                where: {
                    id: id,
                },
            },
        );
    } catch (err) {
        throw new Error('Failed to update product with id: ' + id);
    }
}

exports.deleteProduct = async (id) => {
    if (!id) throw new Error('Missing required fields or no update data provided');
    try {
        return await db.Product.delete(id);
    } catch (err) {
        throw new Error('Failed to delete product with id: ' + id);
    }
}
