const historyService = require('../services/HistoryService');
const {Action} = require("../enums/Action");
const paginationService = require("../services/PaginationService");

exports.getHistory = async (req, res) => {
    const {id} = req.query;
    try {
        let histories
        if(id) {
            histories = await historyService.getHistory(id);
            histories = historyService.convertHistory(histories)

        } else {
            histories = await historyService.getHistories();
            histories.forEach(h => historyService.convertHistory(h))
            histories = await paginationService.addPaginationProperties(histories, histories.length, req);
        }

        res.status(200).json(histories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Service error' });
    }
};

exports.getInventoryHistory = async (req, res) => {
    try {
        const whereOrClause = [
            { action: Action.increase_product_stock },
            { action: Action.decrease_product_stock }
        ]
        let histories = await historyService.getHistories(whereOrClause);
        histories.forEach(h => historyService.convertHistory(h))

        res.status(200).json(histories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Service error' });
    }
};

exports.createHistory = async (req, res) => {
    let { action, description, userId } = req.body;
    if (action !== undefined) {
        action = historyService.convertAction(action)
    }
    try {
        const newHistory = historyService.convertHistory(await historyService.createHistory(action, description, userId));
        // newHistory.description = JSON.parse(newHistory.description);
        res.status(201).json(newHistory);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Bad request' });
    }
};

exports.undo = async (req, res) => {
    try {
        const lastUndo = await historyService.undo();
        return res.status(201).json(
            historyService.convertHistory(await historyService.createHistory(
                Action.undo,
                {history_id: lastUndo.id},
                lastUndo.userId
            ))
        );
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Service error'});
    }

}

exports.updateHistory = async (req, res) => {
    const { id } = req.query;
    let { action, description, userId} = req.body;
    if (action !== undefined) {
        action = historyService.convertAction(action)
    }
    try {
        const updatedHistory = historyService.convertHistory(await historyService.updateHistory(id, action, description, userId));
        if (!updatedHistory) {
            return res.status(404).json({ message: 'History not found' });
        }
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
