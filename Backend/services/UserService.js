const db = require('../database')
const bcrypt = require('bcrypt');
const {Op} = require("sequelize");
const paginationService = require("./PaginationService");
const historyService = require("./HistoryService");
const {Action} = require('../enums/Action')

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

    if(language !== undefined) language = this.convertLanguage(language);

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
        throw new Error('Failed to get user');
    }
};

exports.getQRUser = async (qr_identifier) => {
    if (!qr_identifier) {
        throw new Error('Missing required fields');
    }

    try {
        return await db.User.findOne({ where: { qr_identifier } });
    } catch (err) {
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
            console.error(err);
            throw new Error('Failed to create user');
        }
    }
    // For creating an executive
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        return await db.User.create({username, email, password: hashedPassword, date_of_birth});
    } catch (err) {
        console.error(err);
        throw new Error('Failed to create user');
    }
};

exports.updateUser = async ({id, isDisabled, username, email, credits, date_of_birth, language, roleId}) => {
    if (!id || (!isDisabled && !username && !email && !credits && !date_of_birth && !language && !roleId)) {
        throw new Error('Missing required fields or no update data provided');
    }

    if(date_of_birth !== undefined) date_of_birth = new Date(Date.parse(date_of_birth)).setHours(0, 0, 0, 0)


    try {
        const oldUser = await this.getUser(id);
        await db.User.update(   // Update User
            {
                isDisabled,
                username,
                email,
                credits,
                date_of_birth,
                language,
                roleId
            },
            {
                where: {id},
            },
        );

        const newUser = await this.getUser(id);
        await createHistoryEntryIfNecessary(oldUser, newUser);
        return newUser;
    } catch (err) {
        console.error(err);
        throw new Error('Failed to update user with id: ' + id);
    }
};

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
    } catch (error) {
        if (baseCase < 1) {
            return await this.createUserIdentifier(id, baseCase + 1);
        } else {
            console.error(error)
        }
    }

}

async function hashValue(value) {
    return await bcrypt.hash(value, 10);
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

const createHistoryEntryIfNecessary = async (oldUser, newUser) => {
    const dummyUserId = 1   // The dummy user always has id number 1 -- will be changed

    if (oldUser.roleId !== newUser.roleId) {
        await historyService.createHistory(
            Action.change_role,
            {
                user_id: newUser.id,
                old_role_id: oldUser.roleId,
                new_role_id: newUser.roleId
            },
            dummyUserId
        );
    }

    if (oldUser.isDisabled !== newUser.isDisabled) {
        const actionId = newUser.isDisabled ? Action.disable_user : Action.enable_user;
        await historyService.createHistory(
            actionId,
            {user_id: newUser.id},
            dummyUserId
        );
    }
}
