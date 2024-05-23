const db = require('../database')
const bcrypt = require('bcrypt');

exports.getAllUsers = async () => {
    return await db.User.findAll();
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
                username: username,
                email: email,
                credits: credits,
                date_of_birth: date_of_birth
            },
            {
                where: {
                    id: id,
                },
            },
        );
    } catch (err) {
        console.error(err);
        throw new Error('Failed to update user');
    }
};

exports.deleteUser = async (id) => {
    return await db.User.destroy({
        where: {
            id: id
        }
    });
};