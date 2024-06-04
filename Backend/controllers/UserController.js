const userService = require('../services/UserService');
const paginationService = require('../services/PaginationService')

exports.getUser = async (req, res) => {
    const {id, qr_identifier} = req.query;
    try {
        if (qr_identifier) {
            let user = await userService.getQRUser(qr_identifier);
            res.status(200).json(user);
        } else if (id) {
            let user = await userService.getUser(id);
            res.status(200).json(user);
        } else {
            let users = await userService.getAllUsers(req)
            users.forEach(u => userService.convertUser(u))
            res.status(200).json(await paginationService.addPaginationProperties(users, users.length, req));
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Service error'});
    }
};

exports.createUser = async (req, res) => {
    const {username, email, password, date_of_birth} = req.body;

    try {
        const newUser = await userService.createUser(username, email, password, date_of_birth);
        res.status(201).json({user: newUser});
    } catch (err) {
        console.error(err);
        res.status(400).json({message: 'Bad request'});
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.query;
    const { isDisabled, username, email, credits, date_of_birth, language, roleId } = req.body;

    try {
        const updatedUser = await userService.updateUser({id, isDisabled, username, email, credits, date_of_birth, language, roleId});
        if (!updatedUser) {
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(400).json({message: 'Bad request'});
    }
};

exports.deleteUser = async (req, res) => {
    const {id} = req.query;

    try {
        const deletedUser = await userService.deleteUser(id);
        res.status(200).json(deletedUser);
    } catch (err) {
        console.error(err);
        res.status(400).json({message: 'Bad request'});
    }
}
