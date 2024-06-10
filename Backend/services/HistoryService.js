const db = require('../database')
const paginationService = require("./PaginationService");
const productService = require("./ProductService");
const userService = require("./UserService");
const {Action} = require('../enums/Action')
const {Op} = require('sequelize');

exports.getHistories = async (req, whereOrClause) => {
    let query = await paginationService.getQuery(req)
    let queries = {}
    if (whereOrClause) {
        queries = Object.assign({}, queries, {[Op.or]: whereOrClause})
        query = Object.assign({}, query, {
            include: [
                {model: db.Product, attributes: ['name']},
                {model: db.User, attributes: ['username']},
            ]
        });
    }
    query = Object.assign({}, query, {where: queries});
    const histories = await db.History.findAll(query)
    const total = await db.History.count({where: queries})

    return {returnedHistories: histories, total}
};

exports.getHistory = async (id) => {
    if (!id) {
        throw new Error('Missing required fields');
    }

    try {
        return await db.History.findByPk(id);
    } catch (err) {
        throw new Error('Failed to get history');
    }
};

exports.createHistory = async (action, description, userId, productId = null) => {
    if (action === undefined || !description || !userId) {
        throw new Error('Missing required fields');
    }

    try {
        return await db.History.create({action, description, userId, productId});
    } catch (err) {
        console.error(err);
        throw new Error('Failed to create history');
    }
};

exports.getLastUndo = async () => {
    try {
        return await db.History.findOne({
            order: [['createdAt', 'DESC']]
        });
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
                action,
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
    let lastUndo = await this.getLastUndo();
    const actionDetails = lastUndo.description;
    switch (lastUndo.action) {
        case Action.increase_product_stock: // increase product stock
        case Action.decrease_product_stock: // decrease product stock
            await undoStockChange(lastUndo.productId, lastUndo.action, Number(actionDetails.inventory_change))
            break;
        case Action.change_role: // change role
            await userService.updateUser({id: actionDetails.user_id, roleId: actionDetails.old_role_id})
            break;
        case Action.sell_credits:
            await userService.incrementUserCredits(actionDetails.buyerId, actionDetails.credits * -1, true);
            break;
        case Action.enable_user: // enable user
        case Action.disable_user: // disable user - if action === 4 then pass true else pass false
            await userService.updateUser({
                id: actionDetails.user_id,
                isDisabled: lastUndo.action === Action.enable_user
            })
    }

    return lastUndo;
}

async function undoStockChange(product_id, action, amount) {
    action === Action.increase_product_stock
        ? await productService.decrementProductStock(product_id, amount, true)
        : await productService.incrementProductStock(product_id, amount, true)
}

exports.convertAllToDTO = async (histories, total, req) => {
    histories = histories.map(h => this.convertHistory(h))
    return await paginationService.addPaginationProperties(histories, total, req);
}

exports.convertHistory = function(history) {
    history.action = this.convertAction(history.action)
    let historyToReturn = {}
    history = JSON.parse(JSON.stringify(history, null, 2))
    historyToReturn.id = history.id
    historyToReturn.action = history.action
    historyToReturn.description = history.description
    historyToReturn.createdAt = history.createdAt
    historyToReturn.updatedAt = history.updatedAt
    historyToReturn.userId = history.userId

    if(history.product !== null && history.product !== undefined) {
        historyToReturn.productName = history.product.name
        historyToReturn.productId = history.productId
    }
    if(history.user !== null && history.user !== undefined) {
        historyToReturn.username = history.user.username
    }
    return historyToReturn
}

exports.convertAction = function convertAction(action) {
    const actions = db.History.getAttributes().action.values;
    if (isNaN(action)) {
        return actions.indexOf(action)
    }
    return actions[action];
}
