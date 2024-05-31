const db = require('../database')
const bcrypt = require('bcrypt');
const historyService = require("./HistoryService");
const change_role_id = 3;
const enable_user_id = 4;
const disable_user_id = 5;

exports.getAllUsers = async () => {
    let users = await db.User.findAll();
    users.forEach(u => convertUser(u))
    return users
};

exports.getUser = async (id) => {
    if (!id) {
        throw new Error('Missing required fields');
    }

    try {
        return convertUser(await db.User.findByPk(id));
    } catch (err) {
        throw new Error('Failed to get user');
    }
};

exports.createUser = async (username, email, password, date_of_birth, roleId) => {
    if (!username || !email || !password || !date_of_birth || !roleId) {
        throw new Error('Missing required fields');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        return convertUser(await db.User.create({username, email, password: hashedPassword, date_of_birth, roleId}));
    } catch (err) {
        console.error(err);
        throw new Error('Failed to create user');
    }
};

exports.updateUser = async ({id, isDisabled, username, email, credits, date_of_birth, language, roleId}) => {
    if (!id || (isDisabled === undefined && !username && !email && !credits && !date_of_birth && !language && !roleId)) {
        throw new Error('Missing required fields or no update data provided');
    }
    if (language !== undefined) language = convertLanguage(language);


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
                where: { id },
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

exports.getDummyUserId = async () => {
    try {
        const dummyExists = await db.User.findOne({
            where: {
                id: -1
            }
        })
        if (dummyExists === null) {
            await db.User.create({
                id: -1,
                username: "dummy",
                email: "dummy@dummy.nl",
                password: "password",
                date_of_birth: "2024-05-23 13:03:32.289",
                roleId: 1
            });
        }

        return -1
    } catch (err) {
        console.error(err);
        throw new Error('Failed to create dummy user');
    }
}

function convertUser(user) {
    user.language = convertLanguage(user.language)
    return user
}

function convertLanguage(language) {
    const languages = db.User.getAttributes().language.values;
    if(isNaN(language)) {
        return languages.indexOf(language)
    }
    return languages[language];
}

const createHistoryEntryIfNecessary = async (oldUser, newUser) => {
    const dummyUserId = await this.getDummyUserId();

    if (oldUser.roleId !== newUser.roleId) {
        await historyService.createHistory(
            change_role_id,
            {
                user_id: newUser.id,
                old_role_id: oldUser.roleId,
                new_role_id: newUser.roleId
            },
            dummyUserId
        );
    }

    if (oldUser.isDisabled !== newUser.isDisabled) {
        const actionId = newUser.isDisabled ? disable_user_id : enable_user_id;
        await historyService.createHistory(
            actionId,
            { user_id: newUser.id },
            dummyUserId
        );
    }
}
