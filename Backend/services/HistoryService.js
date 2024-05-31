const db = require('../database')
const productService = require("./ProductService");
const userService = require("./UserService");

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

exports.undo = async () => {
    let lastUndo = await historyService.getLastUndo();
    const actionDetails = lastUndo.description;
    let product;
    switch (lastUndo.action) {
        case 0: // increase product stock
        case 1: // decrease product stock
            product = await productService.getProduct(actionDetails.product_id);
            let updatedStock = lastUndo.action === 0
                ? product.amount_in_stock - 1
                : product.amount_in_stock + 1;
            await productService.updateProduct(
                product.id,
                product.name,
                product.price_in_credits,
                updatedStock,
                product.EAN
            );
            break;
        case 3: // change role
            await userService.updateUser({id: actionDetails.user_id, roleId: actionDetails.old_role_id})
            break;
        case 4: // enable user
        case 5: // disable user - if action === 4 then pass true else pass false
            await userService.updateUser({id: actionDetails.user_id, isDisabled: lastUndo.action === 4})
    }

    return lastUndo;
}

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
