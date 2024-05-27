const db = require('../database')

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

exports.deleteOrder = async (id) => {
    return await db.Order.destroy({
        where: {
            id
        }
    });
};