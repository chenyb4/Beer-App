const historyService = require('../services/HistoryService');
const undoValue = 7;

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
        const lastUndo = await historyService.undo();
        return res.status(201).json(
            await historyService.createHistory(
                undoValue,
                {history_id: lastUndo.id},
                lastUndo.userId
            )
        );
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
