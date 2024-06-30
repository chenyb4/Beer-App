const historyService = require('../services/HistoryService');
const {Action} = require("../enums/Action");
const logger = require("../logger");

exports.getHistory = async (req, res) => {
    const {id} = req.query;
    try {
        let histories
        if(id) {
            histories = await historyService.getHistory(id);
            histories = historyService.convertHistory(histories)

        } else {
            let {returnedHistories, total} = await historyService.getHistories(req);
            histories = await historyService.convertAllToDTO(returnedHistories, total, req)
        }

        res.status(200).json(histories);
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: 'Service error' });
    }
};

exports.getInventoryHistory = async (req, res) => {
    try {
        const whereOrClause = [
            { action: Action.increase_product_stock },
            { action: Action.decrease_product_stock }
        ]
        let {returnedHistories, total} = await historyService.getHistories(req, whereOrClause);
        const histories = await historyService.convertAllToDTO(returnedHistories, total, req)

        res.status(200).json(histories);
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: 'Service error' });
    }
};

exports.createHistory = async (req, res) => {
    let { action, description, userId, productId } = req.body;
    if (action !== undefined) {
        action = historyService.convertAction(action)
    }
    try {
        const newHistory = historyService.convertHistory(await historyService.createHistory(action, description, userId, productId));
        // newHistory.description = JSON.parse(newHistory.description);
        res.status(201).json(newHistory);
    } catch (err) {
        logger.error(err);
        res.status(400).json({ message: 'Bad request' });
    }
};

exports.undo = async (req, res) => {
    try {

        let undo;
        let undos;
        if (req.query.orderId) {
            undos = await historyService.getHistoriesByOrderId(req.query.orderId);
        } else if (req.query.historyId) {
            undo = await historyService.getHistory(req.query.historyId)
        } else {
            undo = await historyService.getLastUndo()
        }
        let result
        if(undo) {
            result = await historyService.undo(undo, req.user.id);
        } else {
            result = await historyService.massUndo(undos, req.user.id);
        }


        res.status(200).json(result);
    } catch (err) {
        logger.error(err);
        res.status(500).json({message: 'Service error: ' + err.message});
    }
}

exports.updateHistory = async (req, res) => {
    const { id } = req.query;
    let { action, description, userId} = req.body;
    if (action !== undefined) {
        action = historyService.convertAction(action)
    }
    try {
        const updatedHistory = historyService.convertHistory(await historyService.updateHistory({id, action, description, userId}));
        if (!updatedHistory) {
            return res.status(404).json({ message: 'History not found' });
        }
        res.status(200).json(updatedHistory);
    } catch (err) {
        logger.error(err);
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
        logger.error(err);
        res.status(400).json({message: 'Bad request'});
    }
}
