const db = require('../database')
const bcrypt = require('bcrypt');

exports.getAllUsers = async () => {
    return await db.User.findAll();
};

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

exports.createUser = async (username, email, password, date_of_birth) => {
    if (!username || !email || !password || !date_of_birth) {
        throw new Error('Missing required fields');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        return db.User.create({username, email, password: hashedPassword, date_of_birth});
    } catch (err) {
        console.error(err);
        throw new Error('Failed to create user');
    }
};

exports.updateUser = async (id, username, email, credits, date_of_birth) => {
    if (!id || (!username && !email && !credits && !date_of_birth)) {
        throw new Error('Missing required fields or no update data provided');
    }

    try {
        return await db.User.update(
            {
                username,
                email,
                credits,
                date_of_birth
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