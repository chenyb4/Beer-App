const db = require('../database')
const paginationService = require("./PaginationService");
const productService = require('../services/ProductService');

exports.getAllOrders = async (req) => {
    let query = await paginationService.getQuery(req)

    return await db.Order.findAll(query);
};

exports.getOrder = async (id, details = true) => {
    if (!id) {
        throw new Error('Missing required fields');
    }

    try {
        if (details) return await db.Order.findByPk(id, {
            include: {
                model: db.Order_Product,
                include: {model: db.Product}
            }
        });
        return await db.Order.findByPk(id);
    } catch (err) {
        throw new Error('Failed to get order');
    }
};

exports.createOrder = async (buyerId, sellerId) => {
    if (!buyerId || !sellerId) {
        throw new Error('Missing required fields');
    }

    try {
        return db.Order.create({buyerId, sellerId});
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
    const order = await this.getOrder(orderId, false);
    const product = await productService.getProduct(productId);
    const productInventory = product.amount_in_stock
    if (order && product) {
        if (productInventory >= quantity) {
            try {
                const orderProduct = await db.Order_Product.findOne({where: {orderId, productId}})
                if (orderProduct) {
                    await addToOrderProduct(orderProduct.id, quantity)
                } else {
                    await createNewOrderProduct(orderId, productId, quantity)
                }

                await productService.incrementProductStock(productId, -1 * quantity)
                await this.incrementOrderPrice(orderId, product.price_in_credits, quantity)

            } catch (err) {
                throw new Error('Create OrderProduct: ' + err)
            }

        } else {
            throw new Error('Quantity exceeds amount in stock. Stock: ' + productInventory)
        }

    } else {
        throw new Error('One of the given models does not exist');
    }
}

exports.incrementOrderPrice = async (id, price, amount) => {
    return await db.Order.increment({amount_of_credits: price * amount}, {where: {id}})
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