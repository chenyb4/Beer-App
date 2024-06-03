const db = require('../database')
const productService = require('../services/ProductService');
const {where, or} = require("sequelize");


exports.getAllOrders = async () => {
    return await db.Order.findAll();
};

exports.getOrder = async (id) => {
    if (!id) {
        throw new Error('Missing required fields');
    }

    try {
        return await db.Order.findByPk(id);
    } catch (err) {
        throw new Error('Failed to get order');
    }
};

exports.createOrder = async (amount_of_credits, buyerId, sellerId) => {
    if (!amount_of_credits || !buyerId || !sellerId) {
        throw new Error('Missing required fields');
    }

    try {
        return db.Order.create({amount_of_credits, buyerId, sellerId});
    } catch (err) {
        console.error(err);
        throw new Error('Failed to create order');
    }
};

exports.updateOrder = async (id, amount_of_credits, buyerId, sellerId) => {
    if (!id || (!amount_of_credits && !buyerId && !sellerId)) {
        throw new Error('Missing required fields or no update data provided');
    }

    try {
        return await db.Order.update(
            {
                amount_of_credits,
                buyerId,
                sellerId
            },
            {
                where: {
                    id,
                },
            },
        );
    } catch (err) {
        console.error(err);
        throw new Error('Failed to update order');
    }
};

exports.addProductToOrder = async (orderId, productId, quantity) => {
    const order = await this.getOrder(orderId);
    const product = await productService.getProduct(productId);
    const productInventory = product.amount_in_stock
    if (order && product) {
        if (productInventory >= quantity) {
            try {
                const orderProduct = db.Order_Product.findOne({where: {orderId, productId}})
                if (orderProduct) {
                    await addToOrderProduct(orderProduct.id, quantity)
                } else {
                    await createNewOrderProduct(orderId, productId, quantity)
                }

                await productService.incrementProductStock(productId, -1 * quantity)

            } catch (err) {
                throw new Error('Create OrderProduct: ' + err)
            }

        } else {
            throw new Error('Quantity exceeds amount in stock.')
        }

    } else {
        throw new Error('One of the given models does not exist');
    }
}

async function addToOrderProduct(id, quantity) {
    return await db.Order_Product.increment({quantity}, {where: {id}});
}

async function createNewOrderProduct(orderId, productId, quantity) {
    return await db.Order_Product.create({orderId, productId, quantity})
}

exports.deleteOrder = async (id) => {
    return await db.Order.destroy({
        where: {
            id
        }
    });
};