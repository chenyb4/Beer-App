const db = require('../database')
const bcrypt = require('bcrypt');

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

exports.getQRUser = async (qr_identifier) => {
    if (!qr_identifier) {
        throw new Error('Missing required fields');
    }

    try {
        return convertUser(await db.User.findOne({ where: { qr_identifier } }));
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

exports.updateUser = async (id, username, email, credits, date_of_birth, language) => {
    if (!id || (!username && !email && !credits && !date_of_birth && !language)) {
        throw new Error('Missing required fields or no update data provided');
    }

    try {
        return await db.User.update(
            {
                username,
                email,
                credits,
                date_of_birth,
                language: convertLanguage(language)
            },
            {
                where: {
                    id,
                },
            },
        );
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
    try{
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
        if(baseCase < 1) {
            return await this.createUserIdentifier(id, baseCase + 1);
        } else {
            console.error(error)
        }
    }

}

async function hashValue(value) {
    return await bcrypt.hash(value, 10);
}

function convertUser(user) {
    user.language = convertLanguage(user.language)
    return user
}

function convertLanguage(language) {
    const languages = db.User.getAttributes().language.values;
    if (isNaN(language)) {
        return languages.indexOf(language)
    }
    return languages[language];
}