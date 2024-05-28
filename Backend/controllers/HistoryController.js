const historyService = require('../services/HistoryService');
const productController = require('../controllers/ProductController');
const userController = require('../controllers/UserController');
const orderController = require('../controllers/OrderController');
const historyController = require('../controllers/HistoryController');
const creditController = require('../controllers/CreditController');
const roleController = require('../controllers/RoleController');
const productService = require("../services/ProductService");

exports.getHistory = async (req, res) => {
    const {id} = req.query;
    try {
        let histories
        if(id) {
            histories = await historyService.getHistory(id);

        } else {
            histories = await historyService.getHistories();
        }
        res.status(200).json(histories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Service error' });
    }
};

exports.createHistory = async (req, res) => {
    const { action, description, userId } = req.body;

    try {
        const newHistory = await historyService.createHistory(action, description, userId);
        // newHistory.description = JSON.parse(newHistory.description);
        res.status(201).json(newHistory);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Bad request' });
    }
};

exports.undo = async (req, res) => {
    let lastUndo;
    try {
        lastUndo = await historyService.getLastUndo();
        console.log(lastUndo);

        const actionDetails = lastUndo.description;
        switch (lastUndo.action) {
            case 9:
                console.log("this is product id form actionDetails: " + actionDetails.product_id)
                const product = await productService.getProduct(actionDetails.product_id);
                console.log("product: " + product.toString())
                res.status(201).json(
                    await productService.updateProduct(
                        product.id,
                        product.name,
                        product.price_in_credits,
                        product.amount_in_stock - 1,
                        product.EAN
                    )
                );
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Service error'});
    }

}

exports.updateHistory = async (req, res) => {
    const { id } = req.query;
    const { action, description, userId} = req.body;

    try {
        const updatedHistory = await historyService.updateHistory(id, action, description, userId);
        if (!updatedHistory) {
            return res.status(404).json({ message: 'History not found' });
        }
        updatedHistory.description = JSON.parse(updatedHistory.description);
        res.status(200).json(updatedHistory);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Bad request' });
    }
};

exports.deleteHistory = async (req, res) => {
    const {id} = req.query;

    try {
        const deletedHistory = await historyService.deleteHistory(id);
        deletedHistory.description = JSON.parse(deletedHistory.description);
        res.status(200).json(deletedHistory);
    } catch (err) {
        console.error(err);
        res.status(400).json({message: 'Bad request'});
    }
}
