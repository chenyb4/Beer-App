const db = require('../database')

exports.getHistories = async () => {
    let histories = await db.History.findAll();
    histories.forEach(h => convertHistory(h))
    return histories
};

exports.getHistory = async (id) => {
    if (!id) {
        throw new Error('Missing required fields');
    }

    try {
        return convertHistory(await db.History.findByPk(id));
    } catch (err) {
        throw new Error('Failed to get history');
    }
};

exports.createHistory = async (action, description, userId) => {
    if (action === undefined || !description || !userId) {
        throw new Error('Missing required fields');
    }

    try {
        action = convertAction(action)
        return convertHistory(await db.History.create({action, description, userId}));
    } catch (err) {
        console.error(err);
        throw new Error('Failed to create history');
    }
};

exports.getLastUndo = async () => {
    try {
        return convertHistory(await db.History.findOne({
            order: [['createdAt', 'DESC']]
        }));
    } catch (err) {
        throw new Error('Failed to get history');
    }
}

exports.updateHistory = async (id, action, description, userId) => {
    if (!id || (!action && !description && !userId)) {
        throw new Error('Missing required fields or no update data provided');
    }

    try {
        return await db.History.update(
            {
                action: convertAction(action),
                description,
                userId
            },
            {
                where: {
                    id,
                },
            },
        );
    } catch (err) {
        console.error(err);
        throw new Error('Failed to update history');
    }
};

exports.deleteHistory = async (id) => {
    return await db.History.destroy({
        where: {
            id
        }
    });
};

function convertHistory(history) {
    history.action = convertAction(history.action)
    return history
}

function convertAction(action) {
    const actions = db.History.getAttributes().action.values;
    if(isNaN(action)) {
        return actions.indexOf(action)
    }
    return actions[action];
}
