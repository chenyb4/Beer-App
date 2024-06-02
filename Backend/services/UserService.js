const db = require('../database')
const bcrypt = require('bcrypt');
const historyService = require("./HistoryService");
const {Action} = require('../enums/Action')

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

exports.createUser = async (username, email, password, date_of_birth) => {
    if (!username || !email || !password || !date_of_birth) {
        throw new Error('Missing required fields');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        return convertUser(await db.User.create({username, email, password: hashedPassword, date_of_birth}));
    } catch (err) {
        console.error(err);
        throw new Error('Failed to create user');
    }
};

exports.updateUser = async ({id, isDisabled, username, email, credits, date_of_birth, language, roleId}) => {
    if (!id || (!isDisabled && !username && !email && !credits && !date_of_birth && !language && !roleId)) {
        throw new Error('Missing required fields or no update data provided');
    }
    if (language) language = convertLanguage(language);


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
    // try {
    //     const dummyExists = await db.User.findOne({
    //         where: {
    //             id: -1
    //         }
    //     })
    //     if (dummyExists === null) {
    //         await db.User.create({
    //             id: -1,
    //             username: "dummy",
    //             email: "dummy@dummy.nl",
    //             password: "password",
    //             date_of_birth: "2024-05-23 13:03:32.289",
    //             roleId: 1
    //         });
    //     }
    //
    //     return -1
    // } catch (err) {
    //     console.error(err);
    //     throw new Error('Failed to create dummy user');
    // }
    return 1
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
            { user_id: newUser.id },
            dummyUserId
        );
    }
}
