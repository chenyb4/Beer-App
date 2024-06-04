const db = require('../database')
const bcrypt = require('bcrypt');
const {Op} = require("sequelize");
const paginationService = require("./PaginationService");

exports.getAllUsers = async (req) => {
    const {username, email, isLegalAge, roleId, language} = req.query
    let query = await paginationService.getQuery(req)
    if (!(!username && !email && !isLegalAge && !roleId && !language)) {
        let queries = {};

        if (username) queries = Object.assign({}, queries, {username: {[Op.substring]: username}});
        if (email) queries = Object.assign({}, queries, {email: {[Op.substring]: email}});
        if (isLegalAge) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const legalAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
            queries = Object.assign({}, queries, {date_of_birth: {[Op.lte]: legalAgeDate}});
        }
        if (roleId) queries = Object.assign({}, queries, {roleId});
        if (language) queries = Object.assign({}, queries, {language});

        query = Object.assign({}, query, {where: queries});
    }
    return await db.User.findAll(query);
};

exports.getUser = async (id) => {
    if (!id) {
        throw new Error('Missing required fields');
    }

    try {
        return this.convertUser(await db.User.findByPk(id));
    } catch (err) {
        throw new Error('Failed to get user');
    }
};

exports.getQRUser = async (qr_identifier) => {
    if (!qr_identifier) {
        throw new Error('Missing required fields');
    }

    try {
        return this.convertUser(await db.User.findOne({where: {qr_identifier}}));
    } catch (err) {
        throw new Error('Failed to get user');
    }
};

exports.createUser = async (username, email, password, date_of_birth) => {
    if (!username || !email || !date_of_birth) {
        throw new Error('Missing required fields');
    }

    // For creating a student
    if (!password) {
        try {
            return this.convertUser(await db.User.create({username, email, date_of_birth}));
        } catch (err) {
            console.error(err);
            throw new Error('Failed to create user');
        }
    }
    // For creating an executive
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        return this.convertUser(await db.User.create({username, email, password: hashedPassword, date_of_birth}));
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
                language: this.convertLanguage(language)
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