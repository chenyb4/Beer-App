const db = require('../database')
const bcrypt = require('bcrypt');
const {Op} = require("sequelize");
const paginationService = require("./PaginationService");
const historyService = require("./HistoryService");
const {Action} = require('../enums/Action')
const salt = 10;
const logger = require("../logger");

exports.getAllUsers = async (req) => {
    let query = await paginationService.getQuery(req)

    let queries = this.getQueries(req)
    query = Object.assign({}, query, {where: queries});
    const users = await db.User.findAll(query)
    const total = await db.User.count({where: queries})
    return {users, total};
};

exports.getQueries = (req) => {
    let {username, email, isLegalAge, roleId, language} = req.query

    if (language !== undefined) language = this.convertLanguage(language);

    let queries = {};

    if (username !== undefined) queries = Object.assign({}, queries, {username: {[Op.substring]: username}});
    if (email !== undefined) queries = Object.assign({}, queries, {email: {[Op.substring]: email}});
    if (isLegalAge) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const legalAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        queries = Object.assign({}, queries, {date_of_birth: {[Op.lte]: legalAgeDate}});
    }
    if (roleId !== undefined) queries = Object.assign({}, queries, {roleId});
    if (language !== undefined) queries = Object.assign({}, queries, {language});

    return queries;
}

exports.getUser = async (id) => {
    if (!id) {
        throw new Error('Missing required fields');
    }
    try {
        return await db.User.findByPk(id);
    } catch (err) {
        logger.error(err);
        throw new Error('Failed to get user');
    }
};

exports.getQRUser = async (qr_identifier) => {
    if (!qr_identifier) {
        throw new Error('Missing required fields');
    }

    try {
        return await db.User.findOne({where: {qr_identifier}});
    } catch (err) {
        logger.error(err);
        throw new Error('Failed to get user');
    }
};

exports.createUser = async (username, email, password, date_of_birth) => {
    if (!username || !email || !date_of_birth) {
        throw new Error('Missing required fields');
    }
    date_of_birth = new Date(Date.parse(date_of_birth)).setHours(0, 0, 0, 0)

    // For creating a student
    if (!password) {
        try {
            return await db.User.create({username, email, date_of_birth});
        } catch (err) {
            logger.error(err);
            throw new Error('Failed to create user: ' + err.message);
        }
    }
    // For creating an executive
    const hashedPassword = await hashValue(password)

    try {
        return await db.User.create({username, email, password: hashedPassword, date_of_birth});
    } catch (err) {
        logger.error(err);
        throw new Error('Failed to create user: ' + err.message);
    }
};

exports.updateUser = async ({
                                id,
                                isDisabled,
                                username,
                                email,
                                credits,
                                date_of_birth,
                                language,
                                roleId,
                                loggedInUserId,
                                password
                            }) => {
    if (!id || (!isDisabled && !username && !email && !credits && !date_of_birth && !language && !roleId && !password)) {
        throw new Error('Missing required fields or no update data provided');
    }

    if (date_of_birth !== undefined) date_of_birth = new Date(Date.parse(date_of_birth)).setHours(0, 0, 0, 0)

    let updateValues = {
        isDisabled,
        username,
        email,
        credits,
        date_of_birth,
        language,
        roleId
    }
    if (password !== undefined && password !== null) {
        const hashedPassword = await hashValue(password)
        updateValues = Object.assign({}, updateValues, {password: hashedPassword});
    }


    try {
        const oldUser = await this.getUser(id);
        await db.User.update(updateValues,
            {
                where: {id},
            },
        );

        const newUser = await this.getUser(id);
        await createHistoryEntryIfNecessary(oldUser, newUser, loggedInUserId);
        return newUser;
    } catch (err) {
        logger.error(err);
        throw new Error('Failed to update user with id: ' + id);
    }
};

exports.incrementUserCredits = async (id, amount, loggedInUserId) => {
    if (!id || !amount) throw new Error('Missing required fields or no update data provided');
    if (amount < 1) throw new Error('Amount can not be lower than 1');
    try {
        const user = await db.User.increment({credits: amount}, {where: {id}});

        await historyService.createHistory(
            Action.sell_credits,
            {
                buyerId: id,
                credits: amount
            },
            loggedInUserId
        );
        return user

    } catch (err) {
        console.error(err);
        throw new Error('Failed to manipulate credits of user: ' + id + ' by: ' + amount)
    }
}

exports.decrementUserCredits = async (orderId, buyerId, amount, loggedInUserId) => {
    if (buyerId === undefined || amount === undefined) throw new Error('Missing required fields or no update data provided');
    if (amount < 1) throw new Error('Amount can not be lower than 1');
    const preUser = await this.getUser(buyerId);
    if(preUser.credits < amount) throw new Error('Amount can not be more than available credits')
    try {
        const user = await db.User.decrement({credits: amount}, {where: {id: buyerId}});

        await historyService.createHistory(
            Action.change_user_credits,
            {
                buyerId: buyerId,
                credits: amount,
                orderId: orderId,
            },
            loggedInUserId
        );
        return user

    } catch (err) {
        logger.error(err);
        throw new Error('Failed to manipulate credits of user: ' + buyerId + ' by: ' + amount)
    }
}

exports.deleteUser = async (id) => {
    if (!id) throw new Error('Missing required fields or no update data provided');
    return await db.User.destroy({
        where: {
            id
        }
    });
};

exports.createUserIdentifier = async (id, baseCase = 0) => {
    try {
        const qr_identifier = await hashValue((Date.now()).toString())
        await db.User.update(
            {
                qr_identifier
            },
            {
                where: {
                    id,
                },
            },
        )

        return this.getUser(id);
    } catch (err) {
        if (baseCase < 1) {
            return await this.createUserIdentifier(id, baseCase + 1);
        } else {
            logger.error(err);
        }
    }

}

async function hashValue(value) {
    return await bcrypt.hash(value, salt);
}

exports.convertUser = (user) => {
    user.language = this.convertLanguage(user.language)
    return user
}

exports.convertLanguage = (language) => {
    const languages = db.User.getAttributes().language.values;
    if (isNaN(language)) {
        return languages.indexOf(language)
    }
    return languages[language];
}

const createHistoryEntryIfNecessary = async (oldUser, newUser, loggedInUserId) => {
    if (oldUser.roleId !== newUser.roleId) {
        await historyService.createHistory(
            Action.change_role,
            {
                user_id: newUser.id,
                old_role_id: oldUser.roleId,
                new_role_id: newUser.roleId
            },
            loggedInUserId
        );
    }

    if (oldUser.isDisabled !== newUser.isDisabled) {
        const actionId = newUser.isDisabled ? Action.disable_user : Action.enable_user;
        await historyService.createHistory(
            actionId,
            {user_id: newUser.id},
            loggedInUserId
        );
    }
}
