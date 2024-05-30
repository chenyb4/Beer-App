const userService = require('../services/UserService');

exports.getUser = async (req, res) => {
    const {id} = req.query;
    try {
        let users
        if(id) {
            users = await userService.getUser(id);

        } else {
            users = await userService.getAllUsers();
        }
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Service error' });
    }
};

exports.createUser = async (req, res) => {
    const { username, email, password, date_of_birth } = req.body;

    try {
        const newUser = await userService.createUser(username, email, password, date_of_birth);
        res.status(201).json({user: newUser});
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Bad request' });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.query;
    const { username, email, credits, date_of_birth, language } = req.body;

    try {
        const updatedUser = await userService.updateUser(id, username, email, credits, date_of_birth, language);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Bad request' });
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