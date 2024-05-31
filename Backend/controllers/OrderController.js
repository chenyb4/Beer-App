const orderService = require('../services/OrderService');
const paginationService = require("../services/PaginationService");

exports.getOrder = async (req, res) => {
    const {id} = req.query;
    try {
        let orders
        if(id) {
            orders = await orderService.getOrder(id);

        } else {
            orders = await orderService.getAllOrders();
            orders = await paginationService.addPaginationProperties(orders, orders.length, req);

        }
        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Service error' });
    }
};

exports.createOrder = async (req, res) => {
    const { amount_of_credits, buyerId, sellerId } = req.body;

    try {
        const newOrder = await orderService.createOrder(amount_of_credits, buyerId, sellerId);
        res.status(201).json(newOrder);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Bad request' });
    }
};

exports.updateOrder = async (req, res) => {
    const { id } = req.query;
    const { amount_of_credits, buyerId, sellerId } = req.body;

    try {
        const updatedOrder = await orderService.updateOrder(id, amount_of_credits, buyerId, sellerId);
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(updatedOrder);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Bad request' });
    }
};

exports.deleteOrder = async (req, res) => {
    const {id} = req.query;

    try {
        const deletedOrder = await orderService.deleteOrder(id);
        res.status(200).json(deletedOrder);
    } catch (err) {
        console.error(err);
        res.status(400).json({message: 'Bad request'});
    }
}