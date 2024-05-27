const db = require('../database')

exports.getHistories = async () => {
    let histories = await db.History.findAll();
    histories.forEach(h => convertHistory(h))
    return histories
};

exports.getHistory = async (id) => {
    return convertHistory(await db.History.findByPk(id));
};

exports.createHistory = async (action, description, userId) => {
    if (!action || !description || !userId) {
        throw new Error('Missing required fields');
    }

    try {
        action = convertAction(action)
        return db.History.create({action, description, userId});
    } catch (err) {
        console.error(err);
        throw new Error('Failed to create history');
    }
};

exports.updateHistory = async (id, action, description, userId) => {
    if (!id || (!action && !description && !userId)) {
        throw new Error('Missing required fields or no update data provided');
    }

    try {
        return await db.History.update(
            {
                action,
                description,
                userId
            },
            {
                where: {
                    id: id,
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
            id: id
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