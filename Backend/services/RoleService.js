const db = require('../database')

exports.getRoles = async () => {
    return await db.Role.findAll();
};

exports.getRole = async (id) => {
    return await db.Role.findByPk(id);
};

exports.createRole = async (name, discount) => {
    if (!name || !discount) {
        throw new Error('Missing required fields');
    }

    try {
        return db.Role.create({name, discount});
    } catch (err) {
        console.error(err);
        throw new Error('Failed to create role');
    }
};

exports.updateRole = async (id, name, discount) => {
    if (!id || (!name && !discount)) {
        throw new Error('Missing required fields or no update data provided');
    }

    try {
        return await db.Role.update(
            {
                name,
                discount
            },
            {
                where: {
                    id: id,
                },
            },
        );
    } catch (err) {
        console.error(err);
        throw new Error('Failed to update role');
    }
};

exports.deleteRole = async (id) => {
    return await db.Role.destroy({
        where: {
            id: id
        }
    });
};