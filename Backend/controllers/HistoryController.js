const historyService = require('../services/HistoryService');
require('../controllers/ProductController');
require('../controllers/UserController');
require('../controllers/OrderController');
require('../controllers/HistoryController');
require('../controllers/CreditController');
require('../controllers/RoleController');
const productService = require("../services/ProductService");
const userService = require("../services/UserService");

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
        const actionDetails = lastUndo.description;
        let product; // case 0 and 1
        let undoValue = 7;
        switch (lastUndo.action) {
            case 0: // increase product stock
                product = await productService.getProduct(actionDetails.product_id);
                await productService.updateProduct(
                    product.id,
                    product.name,
                    product.price_in_credits,
                    product.amount_in_stock - 1,
                    product.EAN
                )
                return res.status(201).json(
                    await historyService.createHistory(
                        undoValue,
                        {history_id: lastUndo.id},
                        lastUndo.userId
                    )
                );
            case 1: // decrease product stock
                product = await productService.getProduct(actionDetails.product_id);
                await productService.updateProduct(
                    product.id,
                    product.name,
                    product.price_in_credits,
                    product.amount_in_stock + 1,
                    product.EAN
                )
                return res.status(201).json(
                    await historyService.createHistory(
                        undoValue,
                        {history_id: lastUndo.id},
                        lastUndo.userId
                    )
                );
            case 3: // change role
                await userService.updateUser(actionDetails.user_id, undefined, undefined, undefined, undefined, undefined, undefined, actionDetails.old_role_id)
                return res.status(201).json(
                    await historyService.createHistory(
                        undoValue,
                        {history_id: lastUndo.id},
                        lastUndo.userId
                    )
                );
            case 4: // add user
                await userService.updateUser(actionDetails.user_id, true)
                return res.status(201).json(
                    await historyService.createHistory(
                        undoValue,
                        {history_id: lastUndo.id},
                        lastUndo.userId
                    )
                );
            case 5: // remove user
                await userService.updateUser(actionDetails.user_id, false)
                return res.status(201).json(
                    await historyService.createHistory(
                        undoValue,
                        {history_id: lastUndo.id},
                        lastUndo.userId
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
