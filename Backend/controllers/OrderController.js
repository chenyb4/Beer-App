const orderService = require('../services/OrderService');
const paginationService = require("../services/PaginationService");
const logger = require("../logger");

exports.getOrder = async (req, res) => {
    const {id} = req.query;
    try {
        let orders
        if (id) {
            orders = await orderService.getOrder(id);

        } else {
            const {returnedOrders, total} = await orderService.getAllOrders(req);
            orders = await paginationService.addPaginationProperties(returnedOrders, total, req);

        }
        res.status(200).json(orders);
    } catch (err) {
        logger.error(err);
        res.status(500).json({message: 'Service error'});
    }
};

exports.createOrder = async (req, res) => {
    const {buyerId, sellerId} = req.body;

    try {
        const newOrder = await orderService.createOrder(buyerId, sellerId);
        res.status(201).json(newOrder);
    } catch (err) {
        logger.error(err);
        res.status(400).json({message: 'Bad request'});
    }
};

exports.updateOrder = async (req, res) => {
    const {id} = req.query;
    const {amount_of_credits, buyerId, sellerId} = req.body;

    try {
        const updatedOrder = await orderService.updateOrder(id, amount_of_credits, buyerId, sellerId);
        if (!updatedOrder) {
            return res.status(404).json({message: 'Order not found'});
        }
        res.status(200).json(updatedOrder);
    } catch (err) {
        logger.error(err);
        res.status(400).json({message: 'Bad request'});
    }
};

exports.addProductToOrder = async (req, res) => {
    const {id} = req.query;
    const {productId, quantity = 1} = req.body;


    try {
        const newOrderProduct = await orderService.addProductToOrder(id, productId, Number(quantity), req.user.id)
        res.status(200).json(newOrderProduct);
    } catch (err) {
        logger.error(err);
        res.status(400).json({message: 'Bad request: ' + err});
    }
};

exports.deleteOrder = async (req, res) => {
    const {id} = req.query;

    try {
        const deletedOrder = await orderService.deleteOrder(id);
        res.status(200).json(deletedOrder);
    } catch (err) {
        logger.error(err);
        res.status(400).json({message: 'Bad request'});
    }
}
